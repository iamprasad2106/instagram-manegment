"use client";

import React, { useState } from 'react';
import {
  Film,
  Play,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Music,
  Plus,
  Flame,
  Clock,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Reel } from '@/types';
import { Modal } from '@/components/ui/Modal';

export default function ReelsPage() {
  const { reels, deleteReel, openCreateModal } = useApp();
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Film className="w-6 h-6 text-purple-400" />
            Reels Studio
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Short-form video retention, virality metrics, audio trends & performance analytics
          </p>
        </div>

        <button
          onClick={() => openCreateModal('reel')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl ig-gradient-bg text-white text-xs font-semibold shadow-lg shadow-pink-500/25 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Reel
        </button>
      </div>

      {/* Reels Quick Stats Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold shrink-0">
            <Play className="w-6 h-6 fill-purple-400" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 font-medium">Total Reel Plays</span>
            <p className="text-xl font-bold text-white">
              {(reels.reduce((acc, r) => acc + r.viewsCount, 0) / 1000).toFixed(1)}k
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 font-medium">Avg. Completion Rate</span>
            <p className="text-xl font-bold text-pink-400">
              {Math.round(reels.reduce((acc, r) => acc + r.completionRate, 0) / (reels.length || 1))}%
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 font-medium">Virality Index</span>
            <p className="text-xl font-bold text-sky-400">92 / 100</p>
          </div>
        </div>
      </div>

      {/* Vertical 9:16 Reels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {reels.map((reel) => (
          <div
            key={reel.id}
            onClick={() => setSelectedReel(reel)}
            className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-pink-500/60 shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Thumbnail */}
            <img
              src={reel.thumbnailUrl}
              alt="Reel thumbnail"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {reel.duration}
              </span>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold ig-gradient-bg text-white shadow-md flex items-center gap-1">
                <Flame className="w-3 h-3" />
                {reel.viralityScore}% Viral
              </span>
            </div>

            {/* Center Play Icon on Hover */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl">
                <Play className="w-7 h-7 fill-white ml-0.5" />
              </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2.5 z-10">
              {/* Audio Pill */}
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                <Music className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span className="truncate">{reel.audioTitle}</span>
              </div>

              {/* Caption Preview */}
              <p className="text-xs text-white line-clamp-2 leading-snug font-medium drop-shadow-sm">
                {reel.caption}
              </p>

              {/* Engagement Stats */}
              <div className="flex items-center justify-between pt-2 border-t border-white/15 text-xs text-zinc-200 font-semibold">
                <span className="flex items-center gap-1">
                  <Play className="w-3.5 h-3.5 fill-white" />
                  {(reel.viewsCount / 1000).toFixed(1)}k
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                  {(reel.likesCount / 1000).toFixed(1)}k
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 text-purple-400" />
                  {(reel.sharesCount / 1000).toFixed(1)}k
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reel Performance Modal */}
      {selectedReel && (
        <Modal
          isOpen={Boolean(selectedReel)}
          onClose={() => setSelectedReel(null)}
          title="Reel Performance & Retention"
          subtitle={`Duration: ${selectedReel.duration} • Posted ${new Date(selectedReel.postedAt).toLocaleDateString()}`}
          maxWidth="max-w-3xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 relative aspect-[9/16] max-h-96">
              <img
                src={selectedReel.thumbnailUrl}
                alt="Reel Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Play className="w-12 h-12 text-white/90 fill-white" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-zinc-200 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 whitespace-pre-line leading-relaxed">
                {selectedReel.caption}
              </p>

              {/* Audio info */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-2.5 text-xs text-pink-400">
                <Music className="w-4 h-4 shrink-0" />
                <span className="truncate font-medium">{selectedReel.audioTitle}</span>
              </div>

              {/* Stats breakdown */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Total Plays</span>
                  <p className="text-lg font-bold text-white">{selectedReel.viewsCount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Watch Completion</span>
                  <p className="text-lg font-bold text-emerald-400">{selectedReel.completionRate}%</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Likes</span>
                  <p className="text-lg font-bold text-pink-400">{selectedReel.likesCount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Shares</span>
                  <p className="text-lg font-bold text-purple-400">{selectedReel.sharesCount.toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  deleteReel(selectedReel.id);
                  setSelectedReel(null);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold border border-rose-500/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Reel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
