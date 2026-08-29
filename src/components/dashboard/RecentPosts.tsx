"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Post } from '@/types';
import { Modal } from '@/components/ui/Modal';

export const RecentPosts: React.FC = () => {
  const { posts } = useApp();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const displayPosts = posts.slice(0, 4);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-white">Recent Feed Posts</h2>
          <p className="text-xs text-zinc-400">Latest media performance & engagement stats</p>
        </div>
        <Link
          href="/posts"
          className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
        >
          View All ({posts.length})
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of Posts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {displayPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-pink-500/10"
          >
            {/* Image */}
            <img
              src={post.mediaUrl}
              alt="Post thumbnail"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Carousel badge if multi */}
            {post.mediaType === 'carousel' && (
              <div className="absolute top-2.5 right-2.5 p-1 rounded-md bg-black/60 backdrop-blur-md text-white">
                <Layers className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Hover overlay with live counts */}
            <div className="absolute inset-0 bg-black/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 text-white">
              <div className="flex justify-end">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ig-gradient-bg">
                  View Insights
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                    {(post.likesCount / 1000).toFixed(1)}k
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
                    {post.commentsCount}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-300 truncate">
                  Reach: {(post.reachCount / 1000).toFixed(1)}k
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Detail Insights Modal */}
      {selectedPost && (
        <Modal
          isOpen={Boolean(selectedPost)}
          onClose={() => setSelectedPost(null)}
          title="Post Performance & Insights"
          subtitle={`Published on ${new Date(selectedPost.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          maxWidth="max-w-3xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
              <img
                src={selectedPost.mediaUrl}
                alt="Post"
                className="w-full h-80 object-cover"
              />
            </div>
            <div className="space-y-4">
              <p className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/80">
                {selectedPost.caption}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 font-medium">Likes</span>
                  <p className="text-base font-bold text-pink-400">{selectedPost.likesCount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 font-medium">Comments</span>
                  <p className="text-base font-bold text-sky-400">{selectedPost.commentsCount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 font-medium">Saves</span>
                  <p className="text-base font-bold text-amber-400">{selectedPost.savesCount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 font-medium">Shares</span>
                  <p className="text-base font-bold text-purple-400">{selectedPost.sharesCount.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-zinc-300 font-medium">Accounts Reached</span>
                  <span className="font-bold text-white">{selectedPost.reachCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-medium">Total Impressions</span>
                  <span className="font-bold text-white">{selectedPost.impressionsCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
