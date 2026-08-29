"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Heart,
  Send,
  CornerDownRight,
  Pin,
  EyeOff,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SentimentBadge } from '@/components/ui/Badge';

export const RecentComments: React.FC = () => {
  const { comments, replyComment, toggleLikeComment, pinComment } = useApp();
  const [replyInputId, setReplyInputId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const displayComments = comments.slice(0, 4);

  const handleSendReply = (id: string) => {
    if (!replyText.trim()) return;
    replyComment(id, replyText);
    setReplyInputId(null);
    setReplyText('');
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-white">Recent Engagement Stream</h2>
          <p className="text-xs text-zinc-400">Live audience feedback, questions & sentiment</p>
        </div>
        <Link
          href="/comments"
          className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
        >
          View Inbox
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stream List */}
      <div className="space-y-3.5">
        {displayComments.map((comment) => (
          <div
            key={comment.id}
            className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/70 hover:border-zinc-700/80 transition-all space-y-2.5"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={comment.userAvatar}
                  alt={comment.username}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white truncate">
                      {comment.username}
                    </span>
                    <span className="text-[10px] text-zinc-400 shrink-0">
                      @{comment.userHandle} • {comment.createdAt}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {comment.isPinned && (
                  <Pin className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                )}
                <SentimentBadge sentiment={comment.sentiment} />
              </div>
            </div>

            {/* Comment Body */}
            <p className="text-xs text-zinc-200 pl-10 leading-relaxed">{comment.text}</p>

            {/* Existing Reply if any */}
            {comment.replyText && (
              <div className="ml-10 p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-start gap-2 text-xs">
                <CornerDownRight className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-semibold text-pink-400 block mb-0.5">
                    Your reply:
                  </span>
                  <p className="text-zinc-300 leading-snug">{comment.replyText}</p>
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pl-10 pt-1 text-xs text-zinc-400">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleLikeComment(comment.id)}
                  className={`flex items-center gap-1 transition-colors ${
                    comment.isLiked ? 'text-pink-500 font-semibold' : 'hover:text-zinc-200'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-pink-500' : ''}`} />
                  <span>{comment.likesCount}</span>
                </button>
                <button
                  onClick={() =>
                    setReplyInputId(replyInputId === comment.id ? null : comment.id)
                  }
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <CornerDownRight className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
                <button
                  onClick={() => pinComment(comment.id)}
                  className="hover:text-pink-400 transition-colors"
                  title="Pin comment"
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Target Post Pill */}
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
                <img
                  src={comment.postThumbnail}
                  alt="target"
                  className="w-3.5 h-3.5 rounded object-cover"
                />
                <span className="truncate max-w-[100px]">{comment.postCaption}</span>
              </div>
            </div>

            {/* Quick Reply Form */}
            {replyInputId === comment.id && (
              <div className="ml-10 pt-2 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply(comment.id)}
                  placeholder="Write an instant reply..."
                  autoFocus
                  className="flex-1 px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                />
                <button
                  onClick={() => handleSendReply(comment.id)}
                  className="px-3 py-1.5 rounded-xl ig-gradient-bg text-white text-xs font-semibold hover:opacity-90 active:scale-95 transition-all"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
