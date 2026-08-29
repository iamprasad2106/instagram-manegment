"use client";

import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export const Toast: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900/95 border border-zinc-700 text-white px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="w-8 h-8 rounded-lg ig-gradient-bg flex items-center justify-center text-white shrink-0 shadow-lg shadow-pink-500/20">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium pr-2 text-zinc-100">{message}</p>
    </div>
  );
};
