"use client";

import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Heart,
  CornerDownRight,
  Pin,
  EyeOff,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  UserX,
  Wand2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SentimentBadge, StatusBadge } from '@/components/ui/Badge';
import { SentimentType, CommentStatus } from '@/types';

export default function CommentsPage() {
  const {
    comments,
    replyComment,
    toggleLikeComment,
    deleteComment,
    hideComment,
    pinComment,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'replied' | 'question' | 'spam'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [dynamicAiReplies, setDynamicAiReplies] = useState<any[]>([]);

  const defaultTemplates = [
    'Thank you so much for the love! ✨ Glad you enjoyed the breakdown.',
    'Hey! You can find the full preset pack & camera settings in our bio link. 📸',
    'Sent you a direct message with the details! 📩',
  ];

  const filteredComments = comments.filter((c) => {
    let matchesTab = true;
    if (activeTab === 'unread') matchesTab = c.status === 'unread';
    else if (activeTab === 'replied') matchesTab = c.status === 'replied';
    else if (activeTab === 'question') matchesTab = c.sentiment === 'question';
    else if (activeTab === 'spam') matchesTab = c.sentiment === 'spam' || c.status === 'flagged';

    const matchesQuery =
      c.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.userHandle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesQuery;
  });

  const handleOpenReply = async (comment: any) => {
    if (activeReplyId === comment.id) {
      setActiveReplyId(null);
      return;
    }

    setActiveReplyId(comment.id);
    setReplyInput('');
    setIsGeneratingAi(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'comment_reply',
          commentText: comment.text,
          commenterName: comment.userHandle || comment.username,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDynamicAiReplies(data.replies || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSendReply = async (id: string) => {
    if (!replyInput.trim()) return;
    await replyComment(id, replyInput);
    setActiveReplyId(null);
    setReplyInput('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-sky-400" />
            Comments & Social Inbox
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Moderate, reply with AI assistance, analyze audience sentiment, and automate community engagement
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4" />
          <span>AI Auto-Responder Engine Online</span>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="glass-panel p-4 rounded-2xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { key: 'all', label: 'All Comments', count: comments.length },
            { key: 'unread', label: 'Unread', count: comments.filter((c) => c.status === 'unread').length },
            { key: 'question', label: 'Questions', count: comments.filter((c) => c.sentiment === 'question').length },
            { key: 'replied', label: 'Replied', count: comments.filter((c) => c.status === 'replied').length },
            { key: 'spam', label: 'Spam / Flagged', count: comments.filter((c) => c.sentiment === 'spam' || c.status === 'flagged').length },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-all shrink-0 ${
                  isActive
                    ? 'ig-gradient-bg text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                {tab.label} <span className="opacity-75 text-[10px]">({tab.count})</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commenters or text..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
          />
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3.5">
        {filteredComments.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center border border-zinc-800">
            <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No comments found</h3>
            <p className="text-xs text-zinc-400 mt-1">There are no comments matching your current filter.</p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`glass-panel p-4 sm:p-5 rounded-2xl border transition-all ${
                comment.status === 'unread'
                  ? 'border-pink-500/30 bg-zinc-900/90'
                  : 'border-zinc-800/80 bg-zinc-900/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                {/* User avatar & info */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={comment.userAvatar}
                    alt={comment.username}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white truncate">
                        {comment.username}
                      </span>
                      <span className="text-xs text-zinc-400 shrink-0">
                        @{comment.userHandle}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {comment.createdAt} on post: <strong className="text-zinc-300 font-normal">{comment.postCaption?.slice(0, 30)}...</strong>
                    </span>
                  </div>
                </div>

                {/* Badges & Post Thumbnail */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {comment.isPinned && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/20 text-pink-400 flex items-center gap-1 border border-pink-500/30">
                      <Pin className="w-3 h-3 fill-pink-400" />
                      Pinned
                    </span>
                  )}
                  <SentimentBadge sentiment={comment.sentiment} />
                  {comment.postThumbnail && (
                    <img
                      src={comment.postThumbnail}
                      alt="post"
                      className="w-8 h-8 rounded-lg object-cover border border-zinc-700"
                    />
                  )}
                </div>
              </div>

              {/* Comment Content */}
              <div className="pl-0 sm:pl-13 space-y-3">
                <p className="text-xs text-zinc-200 leading-relaxed font-normal bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/60">
                  {comment.text}
                </p>

                {/* Existing Reply */}
                {comment.replyText && (
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-2.5 text-xs">
                    <CornerDownRight className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-semibold text-pink-400 block mb-0.5">
                        Your reply ({comment.repliedAt}):
                      </span>
                      <p className="text-zinc-300 leading-snug">{comment.replyText}</p>
                    </div>
                  </div>
                )}

                {/* Moderation Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-zinc-400">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLikeComment(comment.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        comment.isLiked ? 'text-pink-500 font-semibold' : 'hover:text-zinc-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-pink-500' : ''}`} />
                      <span>{comment.likesCount}</span>
                    </button>

                    <button
                      onClick={() => handleOpenReply(comment)}
                      className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 font-semibold transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{comment.replyText ? 'Edit Reply' : 'AI Reply Assistant'}</span>
                    </button>

                    <button
                      onClick={() => pinComment(comment.id)}
                      className="hover:text-pink-400 transition-colors"
                      title={comment.isPinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => hideComment(comment.id)}
                      className="hover:text-amber-400 transition-colors"
                      title="Hide comment from public"
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Reply Composer Drawer with Contextual AI */}
                {activeReplyId === comment.id && (
                  <div className="mt-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                        AI Contextual Suggestions for @{comment.userHandle}:
                      </span>
                      {isGeneratingAi && (
                        <span className="text-[10px] text-pink-400 flex items-center gap-1">
                          <Wand2 className="w-3 h-3 animate-spin" />
                          Drafting personalized replies...
                        </span>
                      )}
                    </div>

                    {/* AI Dynamic Reply Pills */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      {(dynamicAiReplies.length > 0 ? dynamicAiReplies : defaultTemplates.map((t, idx) => ({ id: idx, text: t, label: 'Template' }))).map((r: any, idx: number) => (
                        <button
                          key={r.id || idx}
                          type="button"
                          onClick={() => setReplyInput(r.text)}
                          className="flex-1 text-[11px] text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 p-2.5 rounded-xl border border-zinc-800 hover:border-pink-500/40 transition-all text-left group"
                        >
                          <span className="text-[10px] text-pink-400 font-semibold block mb-1">
                            {r.label || `Option ${idx + 1}`}:
                          </span>
                          &ldquo;{r.text}&rdquo;
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <textarea
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        placeholder="Click an AI suggestion above or type a custom reply..."
                        rows={2}
                        className="flex-1 px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 resize-none"
                      />
                      <button
                        onClick={() => handleSendReply(comment.id)}
                        className="px-4 py-2 rounded-xl ig-gradient-bg text-white text-xs font-semibold self-end shadow-md shadow-pink-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Post Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
