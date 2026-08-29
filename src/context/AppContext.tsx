"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  InstagramAccount,
  Post,
  Reel,
  CommentItem,
  ScheduledPost,
  AutomationRule,
  UserNotification,
  ScheduleItemType,
} from '../types';
import {
  mockAccounts,
  mockPosts,
  mockReels,
  mockComments,
  mockScheduledPosts,
  mockAutomationRules,
  mockNotifications,
} from '../data/mockData';

interface AppContextType {
  currentAccount: InstagramAccount;
  accounts: InstagramAccount[];
  switchAccount: (id: string) => void;
  updateAccount: (data: Partial<InstagramAccount>) => Promise<void>;
  addAccount: (accountData: Partial<InstagramAccount>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'savesCount' | 'reachCount' | 'impressionsCount' | 'postedAt'>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  reels: Reel[];
  addReel: (reel: Omit<Reel, 'id' | 'viewsCount' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'savesCount' | 'watchTimeSeconds' | 'postedAt' | 'viralityScore'>) => Promise<void>;
  deleteReel: (id: string) => Promise<void>;
  comments: CommentItem[];
  replyComment: (id: string, text: string) => Promise<void>;
  toggleLikeComment: (id: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  hideComment: (id: string) => Promise<void>;
  pinComment: (id: string) => Promise<void>;
  scheduledPosts: ScheduledPost[];
  addScheduledPost: (post: Omit<ScheduledPost, 'id'>) => Promise<void>;
  deleteScheduledPost: (id: string) => Promise<void>;
  publishScheduledPostNow: (id: string) => Promise<void>;
  notifications: UserNotification[];
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  automationRules: AutomationRule[];
  toggleAutomationRule: (id: string) => Promise<void>;
  addAutomationRule: (rule: Omit<AutomationRule, 'id' | 'executionCount'>) => Promise<void>;
  deleteAutomationRule: (id: string) => Promise<void>;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  createModalOpen: boolean;
  createModalInitialType: ScheduleItemType;
  openCreateModal: (type?: ScheduleItemType) => void;
  closeCreateModal: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<InstagramAccount[]>(mockAccounts);
  const [currentAccountId, setCurrentAccountId] = useState<string>(mockAccounts[0].id);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [reels, setReels] = useState<Reel[]>(mockReels);
  const [comments, setComments] = useState<CommentItem[]>(mockComments);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(mockScheduledPosts);
  const [notifications, setNotifications] = useState<UserNotification[]>(mockNotifications);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(mockAutomationRules);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [createModalInitialType, setCreateModalInitialType] = useState<ScheduleItemType>('post');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const currentAccount = accounts.find((a) => a.id === currentAccountId) || accounts[0] || mockAccounts[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Initial Data Fetching from SQLite Database via REST API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [accRes, postRes, reelRes, commRes, schedRes, autoRes, notifRes] = await Promise.all([
          fetch('/api/accounts').catch(() => null),
          fetch('/api/posts').catch(() => null),
          fetch('/api/reels').catch(() => null),
          fetch('/api/comments').catch(() => null),
          fetch('/api/scheduler').catch(() => null),
          fetch('/api/automation').catch(() => null),
          fetch('/api/notifications').catch(() => null),
        ]);

        if (accRes && accRes.ok) {
          const accData = await accRes.json();
          if (Array.isArray(accData) && accData.length > 0) {
            setAccounts(accData);
            setCurrentAccountId(accData[0].id);
          }
        }

        if (postRes && postRes.ok) {
          const pData = await postRes.json();
          if (Array.isArray(pData)) setPosts(pData);
        }

        if (reelRes && reelRes.ok) {
          const rData = await reelRes.json();
          if (Array.isArray(rData)) setReels(rData);
        }

        if (commRes && commRes.ok) {
          const cData = await commRes.json();
          if (Array.isArray(cData)) setComments(cData);
        }

        if (schedRes && schedRes.ok) {
          const sData = await schedRes.json();
          if (Array.isArray(sData)) setScheduledPosts(sData);
        }

        if (autoRes && autoRes.ok) {
          const aData = await autoRes.json();
          if (Array.isArray(aData)) setAutomationRules(aData);
        }

        if (notifRes && notifRes.ok) {
          const nData = await notifRes.json();
          if (Array.isArray(nData)) setNotifications(nData);
        }
      } catch (err) {
        console.warn('Using local fallback data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const switchAccount = (id: string) => {
    const found = accounts.find((a) => a.id === id);
    if (found) {
      setCurrentAccountId(id);
      showToast(`Switched account to @${found.username}`);
    }
  };

  const updateAccount = async (data: Partial<InstagramAccount>) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === currentAccountId ? { ...acc, ...data } : acc))
    );
    showToast('Profile settings updated successfully');

    try {
      await fetch('/api/accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentAccountId, ...data }),
      });
    } catch (err) {
      console.error('Failed to sync profile update:', err);
    }
  };

  const addAccount = async (accountData: Partial<InstagramAccount>) => {
    const tempId = `acc-${Date.now()}`;
    const newAcc: InstagramAccount = {
      id: tempId,
      username: (accountData.username || 'new_creator').replace('@', ''),
      fullName: accountData.fullName || 'New Creator',
      avatarUrl: accountData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: accountData.bio || 'Digital creator & aesthetic curator ✨',
      category: accountData.category || 'Digital Creator',
      website: accountData.website || '',
      isVerified: accountData.isVerified ?? false,
      followersCount: accountData.followersCount || 1000,
      followingCount: accountData.followingCount || 120,
      postsCount: 0,
      engagementRate: 5.2,
      storyReach: 450,
      profileViewsWeek: 620,
      websiteClicksWeek: 85,
    };

    setAccounts((prev) => [...prev, newAcc]);
    setCurrentAccountId(tempId);
    showToast(`Connected new account @${newAcc.username}!`);

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAcc),
      });
      if (res.ok) {
        const saved = await res.json();
        setAccounts((prev) => prev.map((a) => (a.id === tempId ? saved : a)));
        setCurrentAccountId(saved.id);
      }
    } catch (err) {
      console.error('Failed to create account in database:', err);
    }
  };

  const deleteAccount = async (id: string) => {
    if (accounts.length <= 1) {
      showToast('Cannot delete the last remaining account');
      return;
    }

    const remaining = accounts.filter((a) => a.id !== id);
    setAccounts(remaining);
    if (currentAccountId === id) {
      setCurrentAccountId(remaining[0].id);
    }
    showToast('Account removed');

    try {
      await fetch(`/api/accounts?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete account:', err);
    }
  };

  const addPost = async (postData: Omit<Post, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'savesCount' | 'reachCount' | 'impressionsCount' | 'postedAt'>) => {
    const tempId = `post-${Date.now()}`;
    const newPost: Post = {
      ...postData,
      id: tempId,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      reachCount: 1,
      impressionsCount: 1,
      postedAt: new Date().toISOString(),
    };

    setPosts((prev) => [newPost, ...prev]);
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === currentAccountId ? { ...acc, postsCount: acc.postsCount + 1 } : acc
      )
    );
    showToast('Post published successfully to database!');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: currentAccountId, ...postData }),
      });
      if (res.ok) {
        const saved = await res.json();
        setPosts((prev) => prev.map((p) => (p.id === tempId ? saved : p)));
      }
    } catch (err) {
      console.error('Failed to persist post:', err);
    }
  };

  const deletePost = async (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === currentAccountId ? { ...acc, postsCount: Math.max(0, acc.postsCount - 1) } : acc
      )
    );
    showToast('Post deleted');

    try {
      await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const addReel = async (reelData: Omit<Reel, 'id' | 'viewsCount' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'savesCount' | 'watchTimeSeconds' | 'postedAt' | 'viralityScore'>) => {
    const tempId = `reel-${Date.now()}`;
    const newReel: Reel = {
      ...reelData,
      id: tempId,
      viewsCount: 1,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      watchTimeSeconds: 1,
      postedAt: new Date().toISOString(),
      viralityScore: Math.floor(Math.random() * 30) + 70,
    };
    setReels((prev) => [newReel, ...prev]);
    showToast('Reel uploaded and persisted!');

    try {
      const res = await fetch('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: currentAccountId, ...reelData }),
      });
      if (res.ok) {
        const saved = await res.json();
        setReels((prev) => prev.map((r) => (r.id === tempId ? saved : r)));
      }
    } catch (err) {
      console.error('Failed to persist reel:', err);
    }
  };

  const deleteReel = async (id: string) => {
    setReels((prev) => prev.filter((r) => r.id !== id));
    showToast('Reel deleted');

    try {
      await fetch(`/api/reels?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete reel:', err);
    }
  };

  const replyComment = async (id: string, text: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'replied',
              replyText: text,
              repliedAt: 'Just now',
            }
          : c
      )
    );
    showToast('Reply saved to database!');

    try {
      await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          replyText: text,
          status: 'replied',
          repliedAt: 'Just now',
        }),
      });
    } catch (err) {
      console.error('Failed to sync reply:', err);
    }
  };

  const toggleLikeComment = async (id: string) => {
    const target = comments.find((c) => c.id === id);
    if (!target) return;
    const newLiked = !target.isLiked;
    const newCount = newLiked ? target.likesCount + 1 : Math.max(0, target.likesCount - 1);

    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isLiked: newLiked, likesCount: newCount } : c))
    );

    try {
      await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isLiked: newLiked, likesCount: newCount }),
      });
    } catch (err) {
      console.error('Failed to sync like:', err);
    }
  };

  const deleteComment = async (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    showToast('Comment removed');

    try {
      await fetch(`/api/comments?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const hideComment = async (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'hidden' } : c))
    );
    showToast('Comment hidden');

    try {
      await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'hidden' }),
      });
    } catch (err) {
      console.error('Failed to hide comment:', err);
    }
  };

  const pinComment = async (id: string) => {
    const target = comments.find((c) => c.id === id);
    if (!target) return;
    const newPin = !target.isPinned;

    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isPinned: newPin } : { ...c, isPinned: false }
      )
    );
    showToast('Comment pin updated');

    try {
      await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isPinned: newPin }),
      });
    } catch (err) {
      console.error('Failed to pin comment:', err);
    }
  };

  const addScheduledPost = async (itemData: Omit<ScheduledPost, 'id'>) => {
    const tempId = `sched-${Date.now()}`;
    const newItem: ScheduledPost = {
      ...itemData,
      id: tempId,
    };
    setScheduledPosts((prev) => [newItem, ...prev]);
    showToast('Scheduled content stored in SQLite database!');

    try {
      const res = await fetch('/api/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: currentAccountId, ...itemData }),
      });
      if (res.ok) {
        const saved = await res.json();
        setScheduledPosts((prev) => prev.map((s) => (s.id === tempId ? saved : s)));
      }
    } catch (err) {
      console.error('Failed to save schedule:', err);
    }
  };

  const deleteScheduledPost = async (id: string) => {
    setScheduledPosts((prev) => prev.filter((s) => s.id !== id));
    showToast('Scheduled post removed');

    try {
      await fetch(`/api/scheduler?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete schedule:', err);
    }
  };

  const publishScheduledPostNow = async (id: string) => {
    const item = scheduledPosts.find((s) => s.id === id);
    if (!item) return;

    if (item.type === 'reel') {
      await addReel({
        videoUrl: item.mediaUrl,
        thumbnailUrl: item.mediaUrl,
        caption: item.caption,
        completionRate: 85,
        audioTitle: item.audioTitle || 'Original Audio',
        duration: '0:30',
        status: 'published',
      });
    } else {
      await addPost({
        mediaUrl: item.mediaUrl,
        carouselUrls: item.carouselUrls,
        mediaType: item.type === 'carousel' ? 'carousel' : 'image',
        caption: item.caption,
        status: 'published',
        hashtags: item.hashtags,
        location: item.location,
      });
    }

    await deleteScheduledPost(id);
    showToast('Scheduled item published immediately!');
  };

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: true }),
      });
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read');
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const toggleAutomationRule = async (id: string) => {
    const target = automationRules.find((r) => r.id === id);
    if (!target) return;
    const newActive = !target.isActive;

    setAutomationRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: newActive } : r))
    );
    showToast('Automation rule toggled');

    try {
      await fetch('/api/automation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: newActive }),
      });
    } catch (err) {
      console.error('Failed to toggle rule:', err);
    }
  };

  const addAutomationRule = async (rule: Omit<AutomationRule, 'id' | 'executionCount'>) => {
    const tempId = `rule-${Date.now()}`;
    const newRule: AutomationRule = {
      ...rule,
      id: tempId,
      executionCount: 0,
    };
    setAutomationRules((prev) => [...prev, newRule]);
    showToast('New automation rule created and saved in database!');

    try {
      const res = await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: currentAccountId, ...rule }),
      });
      if (res.ok) {
        const saved = await res.json();
        setAutomationRules((prev) => prev.map((r) => (r.id === tempId ? saved : r)));
      }
    } catch (err) {
      console.error('Failed to save rule:', err);
    }
  };

  const deleteAutomationRule = async (id: string) => {
    setAutomationRules((prev) => prev.filter((r) => r.id !== id));
    showToast('Automation rule deleted');

    try {
      await fetch(`/api/automation?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete rule:', err);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const openCreateModal = (type: ScheduleItemType = 'post') => {
    setCreateModalInitialType(type);
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        currentAccount,
        accounts,
        switchAccount,
        updateAccount,
        addAccount,
        deleteAccount,
        posts,
        addPost,
        deletePost,
        reels,
        addReel,
        deleteReel,
        comments,
        replyComment,
        toggleLikeComment,
        deleteComment,
        hideComment,
        pinComment,
        scheduledPosts,
        addScheduledPost,
        deleteScheduledPost,
        publishScheduledPostNow,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        automationRules,
        toggleAutomationRule,
        addAutomationRule,
        deleteAutomationRule,
        isSidebarCollapsed,
        toggleSidebar,
        createModalOpen,
        createModalInitialType,
        openCreateModal,
        closeCreateModal,
        toastMessage,
        showToast,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
