"use client";

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Grid,
  Clock,
  Plus,
  Layers,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Send,
  Sparkles,
  AlertCircle,
  Eye,
  Wand2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ScheduledPost } from '@/types';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { AestheticScorer } from '@/components/scheduler/AestheticScorer';

export default function SchedulerPage() {
  const {
    scheduledPosts,
    posts,
    publishScheduledPostNow,
    deleteScheduledPost,
    openCreateModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'queue' | 'grid'>('queue');
  const [selectedItem, setSelectedItem] = useState<ScheduledPost | null>(null);

  // Combine scheduled posts and published posts to simulate the futuristic 3x3 Instagram grid
  const combinedGridFeed = [
    ...scheduledPosts.map((s) => ({ ...s, isScheduled: true })),
    ...posts.map((p) => ({
      id: p.id,
      type: p.mediaType === 'carousel' ? 'carousel' : 'post',
      mediaUrl: p.mediaUrl,
      caption: p.caption,
      scheduledDateTime: p.postedAt,
      status: 'published' as const,
      hashtags: p.hashtags,
      isScheduled: false,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-pink-500" />
            Content Scheduler & Visual Feed Planner
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Automate publication, queue future drops, and preview 3x3 feed aesthetic balance with AI Scoring
          </p>
        </div>

        <button
          onClick={() => openCreateModal('post')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl ig-gradient-bg text-white text-xs font-semibold shadow-lg shadow-pink-500/25 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Schedule Content
        </button>
      </div>

      {/* View Switcher: Queue List vs Instagram Feed Preview */}
      <div className="glass-panel p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
        <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'queue'
                ? 'ig-gradient-bg text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Schedule Queue ({scheduledPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('grid')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'grid'
                ? 'ig-gradient-bg text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            Visual Feed Planner (3x3 Preview & AI Score)
          </button>
        </div>

        <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          Auto-publish Engine Online
        </span>
      </div>

      {/* Queue View */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {scheduledPosts.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center border border-zinc-800">
              <Clock className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">No scheduled posts yet</h3>
              <p className="text-xs text-zinc-400 mt-1 mb-4">
                Schedule your next photo, reel, or carousel to maintain regular posting momentum.
              </p>
              <button
                onClick={() => openCreateModal('post')}
                className="px-4 py-2 rounded-xl ig-gradient-bg text-white text-xs font-semibold"
              >
                Schedule First Post
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {scheduledPosts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="glass-panel p-4 sm:p-5 rounded-2xl border border-zinc-800/80 hover:border-zinc-700/80 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                      <img
                        src={item.mediaUrl}
                        alt="scheduled thumb"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 p-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px]">
                        {item.type === 'reel' ? (
                          <Film className="w-3 h-3 text-purple-400" />
                        ) : item.type === 'carousel' ? (
                          <Layers className="w-3 h-3 text-orange-400" />
                        ) : (
                          <ImageIcon className="w-3 h-3 text-pink-400" />
                        )}
                      </span>
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={item.status} />
                        <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-200 truncate max-w-md font-medium">
                        {item.caption}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1 text-zinc-300">
                          <CalendarIcon className="w-3.5 h-3.5 text-pink-400" />
                          {new Date(item.scheduledDateTime).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                        {item.location && <span>📍 {item.location}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className="flex items-center gap-2 self-end sm:self-auto shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => publishScheduledPostNow(item.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl ig-gradient-bg text-white text-xs font-semibold shadow-md shadow-pink-500/20 active:scale-95 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Publish Now
                    </button>
                    <button
                      onClick={() => deleteScheduledPost(item.id)}
                      className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Remove from schedule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Visual Feed Planner (3x3 Profile Grid Preview & AI Scorer) */}
      {activeTab === 'grid' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-zinc-800 shadow-2xl">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  Live Aesthetic Grid Planner
                </h2>
                <p className="text-xs text-zinc-400">
                  Scheduled posts appear with glowing badges so you can preview color and compositional cohesion before going live.
                </p>
              </div>
              <span className="text-[11px] font-medium text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
                Visual Flow Simulation
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto">
              {combinedGridFeed.slice(0, 9).map((item, idx) => (
                <div
                  key={item.id}
                  className={`relative aspect-square rounded-xl overflow-hidden bg-zinc-950 group cursor-pointer border ${
                    item.isScheduled
                      ? 'border-pink-500 ring-2 ring-pink-500/30'
                      : 'border-zinc-800'
                  }`}
                >
                  <img
                    src={item.mediaUrl}
                    alt="feed preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {item.isScheduled ? (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md ig-gradient-bg text-white text-[9px] font-bold shadow-md">
                      QUEUED
                    </div>
                  ) : null}

                  {item.type === 'reel' && (
                    <div className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white">
                      <Film className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                  )}
                  {item.type === 'carousel' && (
                    <div className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white">
                      <Layers className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                  )}

                  {/* Hover overlay with caption */}
                  <div className="absolute inset-0 bg-black/80 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between text-white text-xs">
                    <p className="line-clamp-3 text-[11px] leading-snug">{item.caption}</p>
                    <span className="text-[10px] text-zinc-400">
                      {item.isScheduled ? 'Scheduled for ' : 'Published '}
                      {new Date(item.scheduledDateTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI 3x3 Feed Aesthetic Harmony Scorer */}
          <AestheticScorer items={combinedGridFeed.slice(0, 9)} />
        </div>
      )}

      {/* Scheduled Item Modal */}
      {selectedItem && (
        <Modal
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title="Scheduled Post Details"
          subtitle={`Set to publish on ${new Date(selectedItem.scheduledDateTime).toLocaleString()}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
              <img
                src={selectedItem.mediaUrl}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-zinc-200 p-3 rounded-xl bg-zinc-950 border border-zinc-800 leading-relaxed whitespace-pre-line">
              {selectedItem.caption}
            </p>
            {selectedItem.firstComment && (
              <div className="text-xs text-zinc-300 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <strong className="text-pink-400 block mb-1">First Comment Scheduled:</strong>
                {selectedItem.firstComment}
              </div>
            )}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                onClick={() => {
                  deleteScheduledPost(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 font-semibold"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  publishScheduledPostNow(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 rounded-xl ig-gradient-bg text-white text-xs font-semibold"
              >
                Publish Right Now
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
