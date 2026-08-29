"use client";

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Film,
  Calendar,
  Hash,
  MapPin,
  Sparkles,
  Layers,
  Send,
  UploadCloud,
  Check,
  Wand2,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/context/AppContext';
import { ScheduleItemType } from '@/types';
import { AiCaptionModal } from '@/components/ai/AiCaptionModal';

export const GlobalCreateModal: React.FC = () => {
  const {
    createModalOpen,
    closeCreateModal,
    createModalInitialType,
    addPost,
    addReel,
    addScheduledPost,
    currentAccount,
  } = useApp();

  const [contentType, setContentType] = useState<ScheduleItemType>(createModalInitialType || 'post');
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80');
  const [hashtags, setHashtags] = useState('photography, creator, aesthetic, visualart');
  const [location, setLocation] = useState('Tokyo, Japan');
  const [firstComment, setFirstComment] = useState('');
  const [audioTitle, setAudioTitle] = useState('Trending Beat • Neon Sunset');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>('now');
  const [scheduleDate, setScheduleDate] = useState('2026-08-30');
  const [scheduleTime, setScheduleTime] = useState('18:00');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const presetImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
  ];

  const handleApplyAiCaption = (aiCaption: string, aiHashtags: string) => {
    setCaption(aiCaption);
    if (aiHashtags) setHashtags(aiHashtags);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = hashtags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);

    if (scheduleMode === 'schedule') {
      const combinedDateTime = `${scheduleDate}T${scheduleTime}:00Z`;
      await addScheduledPost({
        type: contentType,
        mediaUrl: mediaUrl || presetImages[0],
        caption,
        scheduledDateTime: combinedDateTime,
        status: 'scheduled',
        hashtags: tagArray,
        location,
        firstComment,
        audioTitle: contentType === 'reel' ? audioTitle : undefined,
      });
    } else {
      if (contentType === 'reel') {
        await addReel({
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
          thumbnailUrl: mediaUrl || presetImages[0],
          caption,
          completionRate: 80,
          audioTitle,
          duration: '0:30',
          status: 'published',
        });
      } else {
        await addPost({
          mediaUrl: mediaUrl || presetImages[0],
          mediaType: contentType === 'carousel' ? 'carousel' : 'image',
          caption,
          status: 'published',
          hashtags: tagArray,
          location,
        });
      }
    }

    setCaption('');
    closeCreateModal();
  };

  return (
    <>
      <Modal
        isOpen={createModalOpen}
        onClose={closeCreateModal}
        title="Create New Instagram Content"
        subtitle={`Posting as @${currentAccount.username}`}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handlePublish} className="space-y-5">
          {/* Content Type Selector */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setContentType('post')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                contentType === 'post'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-pink-500" />
              Photo Post
            </button>
            <button
              type="button"
              onClick={() => setContentType('reel')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                contentType === 'reel'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Film className="w-4 h-4 text-purple-500" />
              Reel Video
            </button>
            <button
              type="button"
              onClick={() => setContentType('carousel')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                contentType === 'carousel'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-4 h-4 text-orange-500" />
              Carousel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column: Media Preview & Select */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-zinc-300">Selected Media Cover</label>
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 group">
                <img
                  src={mediaUrl}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[11px] text-white font-medium bg-black/60 px-2 py-1 rounded-md backdrop-blur-md">
                    {contentType.toUpperCase()} PREVIEW
                  </span>
                </div>
              </div>

              {/* Quick Preset Selector */}
              <div>
                <p className="text-[11px] text-zinc-400 mb-1.5 font-medium">Choose Demo Asset:</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {presetImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMediaUrl(img)}
                      className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        mediaUrl === img ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Caption, Tags & Settings */}
            <div className="space-y-4">
              {/* Caption with AI Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-zinc-300">Caption</label>
                  <button
                    type="button"
                    onClick={() => setIsAiModalOpen(true)}
                    className="text-[11px] text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1 bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-500/20 transition-all hover:scale-102"
                  >
                    <Sparkles className="w-3 h-3 text-pink-400" />
                    AI Caption Studio
                  </button>
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a compelling caption or click 'AI Caption Studio' to auto-generate viral hooks..."
                  rows={4}
                  required
                  className="w-full px-3 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-all resize-none"
                />
              </div>

              {/* Hashtags */}
              <div>
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1 mb-1">
                  <Hash className="w-3.5 h-3.5 text-pink-500" />
                  Hashtags
                </label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="comma separated tags..."
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Location & Audio */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-zinc-300 flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location name"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                  />
                </div>

                {contentType === 'reel' && (
                  <div>
                    <label className="text-xs font-medium text-zinc-300 mb-1 block truncate">
                      Audio Track
                    </label>
                    <input
                      type="text"
                      value={audioTitle}
                      onChange={(e) => setAudioTitle(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                )}
              </div>

              {/* Schedule Mode Toggle */}
              <div className="pt-2 border-t border-zinc-800">
                <div className="flex items-center gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => setScheduleMode('now')}
                    className={`flex-1 py-1.5 text-xs rounded-lg font-medium border transition-colors ${
                      scheduleMode === 'now'
                        ? 'bg-zinc-800 text-white border-zinc-700'
                        : 'border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                    }`}
                  >
                    Publish Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleMode('schedule')}
                    className={`flex-1 py-1.5 text-xs rounded-lg font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                      scheduleMode === 'schedule'
                        ? 'bg-zinc-800 text-white border-zinc-700'
                        : 'border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-pink-400" />
                    Schedule Later
                  </button>
                </div>

                {scheduleMode === 'schedule' && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                    />
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={closeCreateModal}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl ig-gradient-bg text-white text-xs font-semibold shadow-lg shadow-pink-500/25 hover:opacity-95 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              {scheduleMode === 'schedule' ? 'Queue to Schedule' : 'Publish to Instagram'}
            </button>
          </div>
        </form>
      </Modal>

      {/* AI Caption Generator Modal */}
      {isAiModalOpen && (
        <AiCaptionModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onApplyCaption={handleApplyAiCaption}
        />
      )}
    </>
  );
};
