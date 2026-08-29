"use client";

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Layers,
  Film,
  Image as ImageIcon,
  Clock,
  Download,
  Calendar,
  Globe,
  Share2,
  PieChart,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockDemographics } from '@/data/mockData';
import { BestTimeWidget } from '@/components/dashboard/BestTimeWidget';
import { GrowthChart } from '@/components/dashboard/GrowthChart';

export default function AnalyticsPage() {
  const { currentAccount, showToast } = useApp();
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | '90d'>('30d');

  const handleExport = (format: 'PDF' | 'CSV') => {
    showToast(`Generating ${format} Performance Audit Report for @${currentAccount.username}...`);
    setTimeout(() => {
      showToast(`Report downloaded successfully! [${format}]`);
    }, 1500);
  };

  const contentFormatStats = [
    { type: 'Reels Videos', icon: Film, avgReach: '48.2k', engagement: '7.8%', color: 'from-purple-500 to-indigo-500', sharePercent: 45 },
    { type: 'Carousels', icon: Layers, avgReach: '36.4k', engagement: '6.9%', color: 'from-pink-500 to-rose-500', sharePercent: 32 },
    { type: 'Single Photos', icon: ImageIcon, avgReach: '22.1k', engagement: '4.2%', color: 'from-amber-500 to-orange-500', sharePercent: 18 },
    { type: 'Stories', icon: Clock, avgReach: '14.8k', engagement: '3.1%', color: 'from-sky-500 to-blue-500', sharePercent: 5 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-pink-500" />
            Analytics & Audience Insights
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Deep performance diagnostics, audience demographics & content benchmarking
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleExport('CSV')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl ig-gradient-bg text-white text-xs font-semibold shadow-md shadow-pink-500/20 hover:brightness-110 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF Report
          </button>
        </div>
      </div>

      {/* High-Level Conversion KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-zinc-800">
          <span className="text-xs text-zinc-400 font-medium block mb-1">Total Impressions</span>
          <h3 className="text-2xl font-bold text-white">492.8k</h3>
          <span className="text-[11px] font-semibold text-emerald-400 mt-1 block">+19.2% vs last month</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-zinc-800">
          <span className="text-xs text-zinc-400 font-medium block mb-1">Unique Accounts Reached</span>
          <h3 className="text-2xl font-bold text-white">184.2k</h3>
          <span className="text-[11px] font-semibold text-emerald-400 mt-1 block">86% non-followers</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-zinc-800">
          <span className="text-xs text-zinc-400 font-medium block mb-1">Profile Visits</span>
          <h3 className="text-2xl font-bold text-white">{currentAccount.profileViewsWeek.toLocaleString()}</h3>
          <span className="text-[11px] font-semibold text-emerald-400 mt-1 block">+12.4% conversion</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-zinc-800">
          <span className="text-xs text-zinc-400 font-medium block mb-1">External Link Taps</span>
          <h3 className="text-2xl font-bold text-pink-400">{currentAccount.websiteClicksWeek.toLocaleString()}</h3>
          <span className="text-[11px] font-semibold text-emerald-400 mt-1 block">12.1% CTR on bio</span>
        </div>
      </div>

      {/* Main Growth Curve Chart */}
      <GrowthChart />

      {/* Content Format Comparison Matrix */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">Content Format Benchmarking</h2>
            <p className="text-xs text-zinc-400">Comparing reach efficiency and engagement by asset type</p>
          </div>
          <span className="text-xs text-pink-400 font-medium">Reels lead overall reach</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contentFormatStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-2">
                    <Icon className="w-4 h-4 text-pink-400" />
                    {stat.type}
                  </span>
                  <span className="text-[11px] text-zinc-400">{stat.sharePercent}% of mix</span>
                </div>

                <div>
                  <span className="text-[11px] text-zinc-400 block">Average Reach / Post</span>
                  <p className="text-xl font-bold text-white mt-0.5">{stat.avgReach}</p>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Avg. Engagement</span>
                  <span className="font-semibold text-emerald-400">{stat.engagement}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demographics Grid: Age, Gender, Top Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Groups Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-zinc-800 shadow-2xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-500" />
              Age Distribution
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">Core audience concentrated in 25-34</p>
          </div>

          <div className="space-y-3 pt-2">
            {mockDemographics.ageGroups.map((age, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-300">{age.range} years</span>
                  <span className="text-pink-400">{age.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full ig-gradient-bg transition-all duration-500"
                    style={{ width: `${age.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Split */}
        <div className="glass-panel p-6 rounded-3xl border border-zinc-800 shadow-2xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-500" />
              Gender Breakdown
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">Follower identity distribution</p>
          </div>

          <div className="pt-4 flex flex-col justify-center space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-pink-500" />
                <span className="text-zinc-200">Women</span>
              </div>
              <span className="font-bold text-white">{mockDemographics.gender.female}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden flex">
              <div
                className="h-full bg-pink-500 transition-all duration-500"
                style={{ width: `${mockDemographics.gender.female}%` }}
              />
              <div
                className="h-full bg-purple-500 transition-all duration-500"
                style={{ width: `${mockDemographics.gender.male}%` }}
              />
              <div
                className="h-full bg-sky-500 transition-all duration-500"
                style={{ width: `${mockDemographics.gender.nonBinary}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-zinc-200">Men</span>
              </div>
              <span className="font-bold text-white">{mockDemographics.gender.male}%</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-500" />
                <span className="text-zinc-200">Non-Binary / Custom</span>
              </div>
              <span className="font-bold text-white">{mockDemographics.gender.nonBinary}%</span>
            </div>
          </div>
        </div>

        {/* Top Countries & Cities */}
        <div className="glass-panel p-6 rounded-3xl border border-zinc-800 shadow-2xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              Top Territories & Cities
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">Geographic audience concentration</p>
          </div>

          <div className="space-y-2.5 pt-1 divide-y divide-zinc-800/60">
            {mockDemographics.topCountries.slice(0, 4).map((c, i) => (
              <div key={i} className="pt-2 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-zinc-200">
                  <span>{c.flag}</span>
                  {c.country}
                </span>
                <span className="font-semibold text-white">{c.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optimal Posting Time Heatmap */}
      <BestTimeWidget />
    </div>
  );
}
