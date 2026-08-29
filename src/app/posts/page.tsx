"use client";

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Grid,
  List,
  Plus,
  Search,
  Filter,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  Layers,
  Calendar,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Post, ContentStatus } from '@/types';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

export default function PostsPage() {
  const { posts, deletePost, openCreateModal } = useApp();
  const [activeTab, setActiveTab] = useState<ContentStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const filteredPosts = posts.filter((post) => {
    const matchesTab = activeTab === 'all' || post.status === activeTab;
    const matchesQuery =
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.location && post.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-pink-500" />
            Posts Studio
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage, schedule, curate, and inspect your Instagram feed posts & carousels
          </p>
        </div>

        <button
          onClick={() => openCreateModal('post')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl ig-gradient-bg text-white text-xs font-semibold shadow-lg shadow-pink-500/25 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Post
        </button>
      </div>

      {/* Control Bar: Filters, Search, View Switcher */}
      <div className="glass-panel p-4 rounded-2xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(['all', 'published', 'scheduled', 'draft', 'archived'] as const).map((tab) => {
            const count = tab === 'all' ? posts.length : posts.filter((p) => p.status === tab).length;
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-all shrink-0 ${
                  isActive
                    ? 'ig-gradient-bg text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                {tab} <span className="opacity-75 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search captions or #tags..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-all"
            />
          </div>

          <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Detailed Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Mode View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="glass-panel rounded-2xl overflow-hidden border border-zinc-800 group hover:border-zinc-700/80 transition-all cursor-pointer flex flex-col"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-square bg-zinc-950 overflow-hidden">
                <img
                  src={post.mediaUrl}
                  alt="Post thumbnail"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {post.mediaType === 'carousel' && (
                  <span className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white">
                    <Layers className="w-4 h-4" />
                  </span>
                )}
                <div className="absolute top-3 left-3">
                  <StatusBadge status={post.status} />
                </div>
              </div>

              {/* Card Meta Footer */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-zinc-900/40">
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                  {post.caption}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs text-zinc-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-medium text-pink-400">
                      <Heart className="w-3.5 h-3.5 fill-pink-400" />
                      {(post.likesCount / 1000).toFixed(1)}k
                    </span>
                    <span className="flex items-center gap-1 font-medium text-sky-400">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.commentsCount}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    {new Date(post.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table Mode View */}
      {viewMode === 'table' && (
        <div className="glass-panel rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 font-medium">
                <tr>
                  <th className="p-4">Post</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Likes</th>
                  <th className="p-4">Comments</th>
                  <th className="p-4">Saves</th>
                  <th className="p-4">Reach</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="hover:bg-zinc-900/50 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <img
                          src={post.mediaUrl}
                          alt="thumb"
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="truncate">
                          <p className="font-semibold text-white truncate max-w-xs">{post.caption}</p>
                          <span className="text-[10px] text-zinc-400">{post.location || 'Instagram Feed'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="p-4 font-semibold text-pink-400">{post.likesCount.toLocaleString()}</td>
                    <td className="p-4 font-semibold text-sky-400">{post.commentsCount.toLocaleString()}</td>
                    <td className="p-4 font-semibold text-amber-400">{post.savesCount.toLocaleString()}</td>
                    <td className="p-4 font-semibold text-purple-400">{(post.reachCount / 1000).toFixed(1)}k</td>
                    <td className="p-4 text-zinc-400">
                      {new Date(post.postedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Post Insights Modal */}
      {selectedPost && (
        <Modal
          isOpen={Boolean(selectedPost)}
          onClose={() => setSelectedPost(null)}
          title="Post Deep Dive & Analytics"
          subtitle={`Type: ${selectedPost.mediaType.toUpperCase()} • ${new Date(selectedPost.postedAt).toLocaleDateString()}`}
          maxWidth="max-w-3xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
                <img
                  src={selectedPost.mediaUrl}
                  alt="Post"
                  className="w-full h-80 object-cover"
                />
              </div>
              {selectedPost.location && (
                <p className="text-xs text-zinc-400">📍 {selectedPost.location}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 whitespace-pre-line leading-relaxed">
                {selectedPost.caption}
              </div>

              {/* Hashtag pills */}
              <div className="flex flex-wrap gap-1.5">
                {selectedPost.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-zinc-900 text-pink-400 border border-zinc-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Likes</span>
                  <p className="text-lg font-bold text-pink-400">{selectedPost.likesCount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Comments</span>
                  <p className="text-lg font-bold text-sky-400">{selectedPost.commentsCount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Saves</span>
                  <p className="text-lg font-bold text-amber-400">{selectedPost.savesCount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Shares</span>
                  <p className="text-lg font-bold text-purple-400">{selectedPost.sharesCount.toLocaleString()}</p>
                </div>
              </div>

              {/* Discovery breakdown */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-300">Total Impressions</span>
                  <span className="font-bold text-white">{selectedPost.impressionsCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">From Explore Page</span>
                  <span className="font-semibold text-emerald-400">42% (Discovery boost)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">From Hashtags</span>
                  <span className="font-semibold text-sky-400">28%</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
