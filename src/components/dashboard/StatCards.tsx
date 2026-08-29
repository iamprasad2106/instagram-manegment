"use client";

import React from 'react';
import {
  Users,
  Heart,
  TrendingUp,
  Eye,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const StatCards: React.FC = () => {
  const { currentAccount, posts } = useApp();

  const totalLikes = posts.reduce((acc, p) => acc + p.likesCount, 0);
  const totalComments = posts.reduce((acc, p) => acc + p.commentsCount, 0);
  const totalReach = posts.reduce((acc, p) => acc + p.reachCount, 0);

  const stats = [
    {
      title: 'Total Followers',
      value: currentAccount.followersCount.toLocaleString(),
      change: '+1,240 this week',
      isPositive: true,
      icon: Users,
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Avg. Engagement Rate',
      value: `${currentAccount.engagementRate}%`,
      change: '+0.6% vs last month',
      isPositive: true,
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      title: 'Total Feed Likes',
      value: (totalLikes / 1000).toFixed(1) + 'k',
      change: '+18.4% growth',
      isPositive: true,
      icon: Heart,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Account Reach (30D)',
      value: (totalReach / 1000).toFixed(1) + 'k',
      change: '+24.1% impressions',
      isPositive: true,
      icon: Eye,
      color: 'from-sky-500 to-blue-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-zinc-700/80 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-400">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white mt-1 tracking-tight">{stat.value}</h3>
              </div>
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg shrink-0`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs">
              {stat.isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-rose-400" />
              )}
              <span className={stat.isPositive ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                {stat.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
