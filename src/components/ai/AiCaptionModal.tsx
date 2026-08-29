"use client";

import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  Hash,
  Send,
  Zap,
  Flame,
  MessageCircle,
  ShoppingBag,
  BookOpen,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface AiCaptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCaption: (caption: string, hashtags: string) => void;
}

export const AiCaptionModal: React.FC<AiCaptionModalProps> = ({
  isOpen,
  onClose,
  onApplyCaption,
}) => {
  const [topic, setTopic] = useState('Kyoto architectural sunset photoshoot & lighting setup');
  const [goal, setGoal] = useState('Drive Engagement & Comments');
  const [tone, setTone] = useState('Aesthetic & Minimal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const goals = [
    { label: 'Drive Comments', icon: MessageCircle },
    { label: 'Sales & Bio Link', icon: ShoppingBag },
    { label: 'Storytelling & BTS', icon: BookOpen },
    { label: 'Viral Reach & Hook', icon: Flame },
  ];

  const tones = [
    'Aesthetic & Minimal',
    'High Energy & Hype',
    'Professional Studio',
    'Conversational & Authentic',
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'caption',
          topic,
          goal,
          tone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setVariants(data.variants || []);
      }
    } catch (err) {
      console.error('Failed to generate AI captions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate initial suggestions on first open if empty
  React.useEffect(() => {
    if (isOpen && variants.length === 0) {
      handleGenerate();
    }
  }, [isOpen]);

  const handleApply = (v: any) => {
    const fullCaption = `${v.hook}\n\n${v.body}\n\n${v.cta}`;
    const hashtagStr = v.hashtags ? v.hashtags.map((h: string) => h.replace('#', '')).join(', ') : '';
    onApplyCaption(fullCaption, hashtagStr);
    onClose();
  };

  const handleCopy = (v: any) => {
    const fullCaption = `${v.hook}\n\n${v.body}\n\n${v.cta}\n\n${v.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullCaption);
    setCopiedId(v.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Caption & Hook Generator"
      subtitle="Powered by Gemini Creator Intelligence"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Input Parameters Controls */}
        <form onSubmit={handleGenerate} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              What is your post about? (Visual subject, scene, or tips)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 5 camera movement tricks for cinematic B-roll..."
              className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Goal */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Content Objective</label>
              <div className="grid grid-cols-2 gap-1.5">
                {goals.map((g) => {
                  const Icon = g.icon;
                  const isSelected = goal === g.label;
                  return (
                    <button
                      key={g.label}
                      type="button"
                      onClick={() => setGoal(g.label)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border text-left transition-colors ${
                        isSelected
                          ? 'ig-gradient-bg text-white border-pink-500 font-semibold'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{g.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Creator Voice & Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
              >
                {tones.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl ig-gradient-bg text-white text-xs font-semibold shadow-lg shadow-pink-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Synthesizing Viral Variants...' : 'Generate 3 AI Variants'}
          </button>
        </form>

        {/* Results List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              Generated AI Variants:
            </span>
          </div>

          <div className="space-y-3.5">
            {variants.map((v) => (
              <div
                key={v.id}
                className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-pink-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20">
                    {v.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(v)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-medium border border-zinc-800 transition-colors"
                    >
                      {copiedId === v.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === v.id ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApply(v)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg ig-gradient-bg text-white text-[11px] font-semibold shadow-md active:scale-95 transition-transform"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Apply to Post
                    </button>
                  </div>
                </div>

                <p className="text-xs font-semibold text-white leading-relaxed">{v.hook}</p>
                <p className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed">{v.body}</p>
                <p className="text-xs text-pink-300 font-medium">{v.cta}</p>

                {v.hashtags && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {v.hashtags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
