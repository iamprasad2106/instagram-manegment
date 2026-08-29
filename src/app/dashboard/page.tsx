"use client";

import React from 'react';
import { ProfileHeader } from '@/components/dashboard/ProfileHeader';
import { StatCards } from '@/components/dashboard/StatCards';
import { GrowthChart } from '@/components/dashboard/GrowthChart';
import { RecentPosts } from '@/components/dashboard/RecentPosts';
import { RecentComments } from '@/components/dashboard/RecentComments';
import { BestTimeWidget } from '@/components/dashboard/BestTimeWidget';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Profile Header with Avatar, Verified Badge, Username, Followers, Following, Total Posts, Engagement Rate */}
      <ProfileHeader />

      {/* 2. Key Performance Stat Cards with Trends */}
      <StatCards />

      {/* 3. Interactive Followers Growth & Audience Velocity Chart */}
      <GrowthChart />

      {/* 4. Two-Column Layout: Recent Posts Grid & Recent Comments Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentPosts />
        <RecentComments />
      </div>

      {/* 5. Optimal Posting Times Heatmap */}
      <BestTimeWidget />
    </div>
  );
}
