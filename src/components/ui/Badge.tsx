import React from 'react';
import { SentimentType, ContentStatus, ScheduleStatus } from '@/types';

export const SentimentBadge: React.FC<{ sentiment: SentimentType }> = ({ sentiment }) => {
  const styles: Record<SentimentType, { bg: string; text: string; label: string }> = {
    positive: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', text: 'Positive', label: 'Positive' },
    question: { bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20', text: 'Question', label: 'Question' },
    neutral: { bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20', text: 'Neutral', label: 'Neutral' },
    spam: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', text: 'Spam', label: 'Spam' },
    negative: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', text: 'Feedback', label: 'Feedback' },
  };

  const current = styles[sentiment] || styles.neutral;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${current.bg}`}>
      {current.label}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ContentStatus | ScheduleStatus }> = ({ status }) => {
  const styles: Record<string, { bg: string; text: string }> = {
    published: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', text: 'Published' },
    scheduled: { bg: 'bg-violet-500/10 text-violet-400 border-violet-500/20', text: 'Scheduled' },
    draft: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', text: 'Draft' },
    archived: { bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20', text: 'Archived' },
    publishing: { bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20', text: 'Publishing...' },
  };

  const current = styles[status] || styles.draft;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${current.bg}`}>
      {current.text}
    </span>
  );
};
