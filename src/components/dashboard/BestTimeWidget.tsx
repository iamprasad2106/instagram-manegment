"use client";

import React from 'react';
import { Clock, Zap, Flame, Info } from 'lucide-react';
import { mockHourlyActivity } from '@/data/mockData';

export const BestTimeWidget: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const sampleHours = [0, 3, 6, 9, 12, 15, 18, 21];

  const getColor = (intensity: number) => {
    if (intensity > 90) return 'bg-pink-500';
    if (intensity > 75) return 'bg-pink-600/80';
    if (intensity > 50) return 'bg-purple-700/60';
    if (intensity > 25) return 'bg-purple-900/40';
    return 'bg-zinc-800/40';
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-pink-500" />
            Optimal Posting Times Heatmap
          </h2>
          <p className="text-xs text-zinc-400">Audience activity concentration based on past 30 days</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-zinc-400">
          <span>Low</span>
          <div className="flex gap-1">
            <span className="w-3 h-3 rounded bg-zinc-800" />
            <span className="w-3 h-3 rounded bg-purple-900/40" />
            <span className="w-3 h-3 rounded bg-purple-700/60" />
            <span className="w-3 h-3 rounded bg-pink-500" />
          </div>
          <span>Peak</span>
        </div>
      </div>

      {/* Prime Windows Recommendation Pill */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent border border-pink-500/20 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg ig-gradient-bg flex items-center justify-center text-white shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white">Recommended Golden Hours:</span>
            <span className="text-zinc-300 ml-1.5">
              Wednesdays & Thursdays at <strong className="text-pink-400">5:00 PM – 7:30 PM</strong>
            </span>
          </div>
        </div>
        <span className="text-[11px] text-emerald-400 font-medium shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          +38% higher initial reach
        </span>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[480px]">
          {/* Hour labels */}
          <div className="grid grid-cols-25 gap-1 text-[10px] text-zinc-500 font-mono mb-1.5 pl-10">
            {Array.from({ length: 24 }).map((_, h) => (
              <div key={h} className="text-center">
                {h % 3 === 0 ? `${h}h` : ''}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="space-y-1.5">
            {mockHourlyActivity.map((d) => (
              <div key={d.day} className="flex items-center gap-2">
                <span className="w-8 text-[11px] font-semibold text-zinc-400">{d.day}</span>
                <div className="flex-1 grid grid-cols-24 gap-1">
                  {d.hours.map((val, hIdx) => (
                    <div
                      key={hIdx}
                      className={`h-5 rounded-md ${getColor(val)} transition-all hover:scale-110 hover:ring-2 hover:ring-white/40 cursor-pointer`}
                      title={`${d.day} at ${hIdx}:00 — Activity index: ${val}%`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
