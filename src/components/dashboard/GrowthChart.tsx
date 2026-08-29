"use client";

import React, { useState } from 'react';
import { TrendingUp, Users, Eye, Sparkles, BarChart2 } from 'lucide-react';
import { mockFollowerGrowth } from '@/data/mockData';

export const GrowthChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D' | '1Y'>('7D');
  const [metric, setMetric] = useState<'followers' | 'reach' | 'impressions'>('followers');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = mockFollowerGrowth[timeframe];

  // Calculate SVG curve coordinates
  const values = data.map((d) => d[metric]);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const width = 650;
  const height = 220;
  const paddingX = 35;
  const paddingY = 25;

  const points = data.map((item, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((item[metric] - minVal) / range) * (height - paddingY * 2);
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - 10} L ${points[0].x},${height - 10} Z`;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 shadow-2xl relative">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Audience & Reach Growth</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md ig-gradient-bg text-white">
              LIVE METRICS
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time track of follower acceleration and engagement velocity
          </p>
        </div>

        {/* Metric & Timeframe Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
            {(['followers', 'reach', 'impressions'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1 text-xs rounded-lg font-medium capitalize transition-all ${
                  metric === m
                    ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
            {(['7D', '30D', '90D', '1Y'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  timeframe === t
                    ? 'ig-gradient-bg text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-56 overflow-visible"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#27272a" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#27272a" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#27272a" strokeDasharray="3 3" />

          {/* Area Fill */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Smooth Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineStroke)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  className={`transition-all duration-150 cursor-pointer ${
                    isHovered
                      ? 'fill-white stroke-pink-500 stroke-2'
                      : 'fill-pink-500 stroke-zinc-900 stroke-2'
                  }`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Interactive Tooltip Card */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute z-20 px-3 py-2 bg-zinc-900/95 border border-zinc-700 rounded-xl shadow-xl backdrop-blur-md pointer-events-none text-left"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: '15%',
              transform: 'translateX(-50%)',
            }}
          >
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              {points[hoveredIndex].date}
            </p>
            <p className="text-sm font-bold text-white mt-0.5">
              {points[hoveredIndex][metric].toLocaleString()}{' '}
              <span className="text-xs font-normal text-pink-400 capitalize">{metric}</span>
            </p>
            <p className="text-[10px] text-emerald-400 font-medium">
              Engagement: {points[hoveredIndex].engagement}%
            </p>
          </div>
        )}
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between items-center px-4 mt-2 text-[11px] text-zinc-400 font-medium">
        {data.map((item, idx) => (
          <span key={idx}>{item.date}</span>
        ))}
      </div>
    </div>
  );
};
