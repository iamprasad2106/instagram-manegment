"use client";

import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  PieChart,
  CheckCircle2,
  AlertCircle,
  Zap,
  Flame,
  Layers,
  Palette,
  Eye,
} from 'lucide-react';

export const AestheticScorer: React.FC<{ items: any[] }> = ({ items }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>({
    overallScore: 94,
    status: 'Optimal Aesthetic Cohesion',
    paletteBreakdown: [
      { name: 'Warm Sunset & Earth Tones', percentage: 55, color: 'bg-amber-500' },
      { name: 'Deep Monochromatic Shadows', percentage: 30, color: 'bg-blue-600' },
      { name: 'Minimalist High-Key Highlights', percentage: 15, color: 'bg-pink-500' },
    ],
    metrics: [
      { label: 'Color Palette Rhythm', score: '96 / 100', rating: 'Harmonious' },
      { label: 'Composition Variety (Wide vs Macro)', score: '91 / 100', rating: 'Balanced' },
      { label: 'Contrast Distribution', score: '95 / 100', rating: 'Smooth' },
      { label: 'Visual Fatigue Index', score: '4%', rating: 'Minimal' },
    ],
    recommendations: [
      '✨ Excellent alternating cadence between wide landscape vistas and close-up detail shots.',
      '💡 Queued Reel in position #2 provides dynamic eye-flow without disrupting adjacent warm tones.',
      '🎯 Consider planning a cool-blue accent shot for next week to maintain visual depth.',
    ],
  });

  const handleReanalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'aesthetic_score',
          gridItems: items,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.analysis) setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-zinc-800 shadow-2xl space-y-6 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl ig-gradient-bg flex items-center justify-center text-white shadow-lg shadow-pink-500/20 shrink-0">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              AI 3x3 Feed Aesthetic & Palette Harmony
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">
                PRO FEATURE
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Evaluates color temperature, contrast cadence, and layout fatigue before publication
            </p>
          </div>
        </div>

        <button
          onClick={handleReanalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold border border-zinc-800 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Wand2 className={`w-3.5 h-3.5 text-pink-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing Grid Palette...' : 'Re-Score Feed Rhythm'}
        </button>
      </div>

      {/* Main Score & Palette Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Badge */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs text-zinc-400 font-medium">Aesthetic Cohesion Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-transparent bg-clip-text ig-gradient-bg">
                {analysis.overallScore}
              </span>
              <span className="text-sm font-semibold text-zinc-400">/ 100</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{analysis.status}</span>
          </div>
        </div>

        {/* Palette Distribution */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <span className="text-xs text-zinc-400 font-medium block">
            Color Palette & Temperature Distribution
          </span>

          <div className="w-full h-3 rounded-full bg-zinc-900 overflow-hidden flex">
            {analysis.paletteBreakdown.map((p: any, i: number) => (
              <div
                key={i}
                className={`h-full ${p.color || 'bg-pink-500'} transition-all`}
                style={{ width: `${p.percentage}%` }}
                title={`${p.name}: ${p.percentage}%`}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
            {analysis.paletteBreakdown.map((p: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-zinc-300">
                <span className={`w-2.5 h-2.5 rounded-full ${p.color || 'bg-pink-500'} shrink-0`} />
                <span className="truncate">{p.name}</span>
                <span className="font-bold text-white ml-auto">{p.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {analysis.metrics.map((m: any, i: number) => (
          <div key={i} className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-[11px] text-zinc-400 block truncate">{m.label}</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-sm font-bold text-white">{m.score}</span>
              <span className="text-[10px] font-semibold text-emerald-400">{m.rating}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations Pill */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent border border-pink-500/20 space-y-2">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-pink-400" />
          AI Feed Curation Suggestions:
        </span>
        <ul className="space-y-1.5 text-xs text-zinc-300">
          {analysis.recommendations.map((rec: string, i: number) => (
            <li key={i} className="leading-relaxed">
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
