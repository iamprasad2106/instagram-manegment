"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Instagram,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Users,
  BarChart3,
  Calendar,
  Lock,
} from 'lucide-react';
import { mockAccounts } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { switchAccount, showToast } = useApp();
  const [customHandle, setCustomHandle] = useState('');
  const [selectedDemoId, setSelectedDemoId] = useState(mockAccounts[0].id);

  const handleSelectAndLogin = (accountId: string) => {
    switchAccount(accountId);
    showToast('Logged in successfully!');
    router.push('/dashboard');
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHandle.trim()) return;
    showToast(`Logged into sandbox workspace as @${customHandle.replace('@', '')}`);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 glass-panel p-6 sm:p-10 rounded-3xl border border-zinc-800 shadow-2xl relative z-10">
        {/* Left Column: Visual Brand Showcase */}
        <div className="flex flex-col justify-between space-y-6 md:border-r md:border-zinc-800 md:pr-8">
          <div>
            <div className="w-12 h-12 rounded-2xl ig-gradient-bg flex items-center justify-center text-white shadow-xl shadow-pink-500/25 mb-4">
              <Instagram className="w-7 h-7" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Insta<span className="ig-gradient-text">Studio</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              The modern, all-in-one command center for Instagram creators, brands, and visual agencies.
            </p>
          </div>

          {/* Feature Highlight Pills */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Advanced Growth Analytics</p>
                <p className="text-[11px] text-zinc-400">Track reach velocity, hourly activity & demographics</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Visual Grid Feed Planner</p>
                <p className="text-[11px] text-zinc-400">Simulate 3x3 aesthetic balance before publishing</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Smart Social Inbox & Moderation</p>
                <p className="text-[11px] text-zinc-400">AI auto-replies, spam filtering, and sentiment tagging</p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 font-medium">
            Demo Sandbox Mode • No real Instagram credentials required
          </div>
        </div>

        {/* Right Column: Account Login Hub */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Select a Creator Profile</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Choose one of the preloaded demo workspaces to explore the platform
            </p>
          </div>

          {/* Demo Accounts List */}
          <div className="space-y-2.5">
            {mockAccounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => handleSelectAndLogin(acc.id)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-pink-500/50 transition-all text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="story-ring p-0.5 shrink-0">
                    <img
                      src={acc.avatarUrl}
                      alt={acc.username}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-950"
                    />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white group-hover:text-pink-400 transition-colors flex items-center gap-1">
                      @{acc.username}
                      {acc.isVerified && <span className="text-sky-400 text-[10px]">✓</span>}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">{acc.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-zinc-300">
                    {(acc.followersCount / 1000).toFixed(1)}k
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-zinc-800 group-hover:bg-pink-500 text-zinc-400 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-zinc-800 w-full" />
            <span className="bg-zinc-900 px-3 text-[11px] text-zinc-500 font-medium absolute">
              or enter custom handle
            </span>
          </div>

          {/* Custom Handle Quick Sign In */}
          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-500">
                @
              </span>
              <input
                type="text"
                value={customHandle}
                onChange={(e) => setCustomHandle(e.target.value)}
                placeholder="your_handle"
                className="w-full pl-8 pr-4 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl ig-gradient-bg text-white font-semibold text-xs shadow-lg shadow-pink-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Launch Custom Workspace
            </button>
          </form>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-2 text-[11px] text-zinc-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Sandbox Mode: No password or Instagram OAuth API required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
