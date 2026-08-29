"use client";

import React from 'react';
import {
  Sparkles,
  Link as LinkIcon,
  MapPin,
  TrendingUp,
  Share2,
  Settings as SettingsIcon,
  CheckCircle2,
  Users,
  Eye,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export const ProfileHeader: React.FC = () => {
  const { currentAccount, openCreateModal } = useApp();

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-zinc-800/80 mb-8">
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-8 justify-between">
        {/* Profile Avatar & Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          <div className="relative group">
            <div className="story-ring p-1 shadow-xl shadow-pink-500/20">
              <img
                src={currentAccount.avatarUrl}
                alt={currentAccount.username}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-zinc-950 shadow-inner"
              />
            </div>
            <span className="absolute bottom-1 right-1 px-2 py-0.5 text-[10px] font-bold rounded-full ig-gradient-bg text-white shadow-md">
              LIVE
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                @{currentAccount.username}
                {currentAccount.isVerified && (
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-sky-500/30">
                    ✓
                  </span>
                )}
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-zinc-800/90 text-zinc-300 border border-zinc-700/60">
                {currentAccount.category}
              </span>
            </div>

            <p className="text-sm font-medium text-zinc-200">{currentAccount.fullName}</p>

            <p className="text-xs text-zinc-300 max-w-xl whitespace-pre-line leading-relaxed">
              {currentAccount.bio}
            </p>

            {currentAccount.website && (
              <a
                href={currentAccount.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                {currentAccount.website.replace('https://', '')}
              </a>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => openCreateModal('post')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl ig-gradient-bg text-white text-xs font-semibold shadow-lg shadow-pink-500/25 hover:brightness-110 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Create Content
          </button>
          <Link
            href="/settings"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold border border-zinc-700/60 transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mt-8 pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-5 gap-4 lg:gap-6">
        <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/60">
          <span className="text-xs text-zinc-400 font-medium block mb-1">Followers</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl lg:text-2xl font-bold text-white tracking-tight">
              {currentAccount.followersCount.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400">+4.2%</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/60">
          <span className="text-xs text-zinc-400 font-medium block mb-1">Following</span>
          <span className="text-xl lg:text-2xl font-bold text-white tracking-tight">
            {currentAccount.followingCount.toLocaleString()}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/60">
          <span className="text-xs text-zinc-400 font-medium block mb-1">Total Posts</span>
          <span className="text-xl lg:text-2xl font-bold text-white tracking-tight">
            {currentAccount.postsCount.toLocaleString()}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/60">
          <span className="text-xs text-zinc-400 font-medium block mb-1">Engagement</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl lg:text-2xl font-bold text-pink-400 tracking-tight">
              {currentAccount.engagementRate}%
            </span>
            <span className="text-[11px] font-semibold text-emerald-400">High</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/60">
          <span className="text-xs text-zinc-400 font-medium block mb-1">Story Reach</span>
          <span className="text-xl lg:text-2xl font-bold text-white tracking-tight">
            {(currentAccount.storyReach / 1000).toFixed(1)}k
          </span>
        </div>
      </div>
    </div>
  );
};
