"use client";

import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Users,
  Bot,
  Bell,
  Shield,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Link as LinkIcon,
  Save,
  ToggleLeft,
  ToggleRight,
  Camera,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { AutomationRule } from '@/types';

export default function SettingsPage() {
  const {
    currentAccount,
    updateAccount,
    accounts,
    switchAccount,
    addAccount,
    deleteAccount,
    automationRules,
    toggleAutomationRule,
    addAutomationRule,
    deleteAutomationRule,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'accounts' | 'automation' | 'notifications'>('profile');

  // Form State for Profile
  const [fullName, setFullName] = useState(currentAccount.fullName);
  const [bio, setBio] = useState(currentAccount.bio);
  const [category, setCategory] = useState(currentAccount.category);
  const [website, setWebsite] = useState(currentAccount.website);
  const [avatarUrl, setAvatarUrl] = useState(currentAccount.avatarUrl);

  // Sync state whenever active account changes
  useEffect(() => {
    setFullName(currentAccount.fullName);
    setBio(currentAccount.bio);
    setCategory(currentAccount.category);
    setWebsite(currentAccount.website);
    setAvatarUrl(currentAccount.avatarUrl);
  }, [currentAccount]);

  // Connect Account Modal State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newCategory, setNewCategory] = useState('Digital Creator');
  const [newBio, setNewBio] = useState('Creating compelling stories & visual aesthetics ✨');
  const [newWebsite, setNewWebsite] = useState('https://mybrand.bio');
  const [newAvatarUrl, setNewAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');
  const [newFollowers, setNewFollowers] = useState('14200');

  // New Rule Modal
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [triggerWords, setTriggerWords] = useState('');
  const [replyTemplate, setReplyTemplate] = useState('');
  const [actionType, setActionType] = useState<AutomationRule['actionType']>('reply_comment');

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAccount({
      fullName,
      bio,
      category,
      website,
      avatarUrl,
    });
  };

  const handleConnectAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    await addAccount({
      username: newUsername,
      fullName: newFullName || newUsername,
      category: newCategory,
      bio: newBio,
      website: newWebsite,
      avatarUrl: newAvatarUrl,
      followersCount: parseInt(newFollowers, 10) || 1200,
      followingCount: 240,
      isVerified: true,
    });

    setIsConnectModalOpen(false);
    setNewUsername('');
    setNewFullName('');
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    const keywords = triggerWords.split(',').map((w) => w.trim()).filter(Boolean);
    await addAutomationRule({
      name: ruleName,
      triggerKeywords: keywords,
      replyTemplate,
      isActive: true,
      actionType,
    });
    setIsRuleModalOpen(false);
    setRuleName('');
    setTriggerWords('');
    setReplyTemplate('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-pink-500" />
          Settings & Account Center
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure profile metadata, manage multi-account workspaces, and customize AI automation workflows
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-zinc-900 rounded-2xl p-1.5 border border-zinc-800 overflow-x-auto">
        {[
          { key: 'profile', label: 'Profile & Bio', icon: User },
          { key: 'accounts', label: `Connected Accounts (${accounts.length})`, icon: Users },
          { key: 'automation', label: 'AI & Automation Rules', icon: Bot },
          { key: 'notifications', label: 'Preferences & Alerts', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                isActive
                  ? 'ig-gradient-bg text-white shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Settings Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="glass-panel p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6 max-w-2xl">
          <div className="space-y-3">
            <div className="flex items-center gap-5">
              <div className="story-ring p-1">
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-zinc-950"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                  @{currentAccount.username}
                  {currentAccount.isVerified && <span className="text-sky-400 text-xs">✓ Verified</span>}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">Select a new avatar or paste an image URL below:</p>
              </div>
            </div>

            {/* Avatar Presets */}
            <div className="flex items-center gap-2 pt-1">
              {presetAvatars.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(img)}
                  className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                    avatarUrl === img ? 'border-pink-500 ring-2 ring-pink-500/30 scale-105' : 'border-zinc-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Display Name / Brand</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Category / Niche</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Website URL in Bio</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Bio Description</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl ig-gradient-bg text-white text-xs font-semibold shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Profile Changes
          </button>
        </form>
      )}

      {/* Connected Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white">Multi-Account Management</h2>
              <p className="text-xs text-zinc-400">Switch active workspaces or connect your own personal/brand Instagram account</p>
            </div>

            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl ig-gradient-bg text-white text-xs font-semibold shadow-md shadow-pink-500/20 active:scale-95 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Connect New Account
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((acc) => {
              const isActive = acc.id === currentAccount.id;
              return (
                <div
                  key={acc.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isActive
                      ? 'border-pink-500/50 bg-pink-500/5 shadow-xl shadow-pink-500/10'
                      : 'border-zinc-800 bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={acc.avatarUrl}
                        alt={acc.username}
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate flex items-center gap-1">
                          @{acc.username}
                          {acc.isVerified && <span className="text-sky-400 text-xs">✓</span>}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">{acc.fullName}</p>
                        <span className="text-[11px] text-zinc-500">{acc.category}</span>
                      </div>
                    </div>

                    {accounts.length > 1 && (
                      <button
                        onClick={() => deleteAccount(acc.id)}
                        className="text-zinc-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Remove Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-medium">
                      {(acc.followersCount / 1000).toFixed(1)}k followers
                    </span>
                    {isActive ? (
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full ig-gradient-bg text-white">
                        Active Account
                      </span>
                    ) : (
                      <button
                        onClick={() => switchAccount(acc.id)}
                        className="px-3 py-1 text-xs rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
                      >
                        Switch To
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Automation Rules Tab */}
      {activeTab === 'automation' && (
        <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-400" />
                Automated Community & DM Triggers
              </h2>
              <p className="text-xs text-zinc-400">
                Trigger instant DM links, comment replies, and spam filtration based on keyword matching
              </p>
            </div>

            <button
              onClick={() => setIsRuleModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl ig-gradient-bg text-white text-xs font-semibold shadow-md shadow-pink-500/20 active:scale-95 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              New Rule
            </button>
          </div>

          {/* Rules List */}
          <div className="space-y-3.5">
            {automationRules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-white">{rule.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase">
                      {rule.actionType.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs text-zinc-400">Triggers on:</span>
                    {rule.triggerKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-[11px] font-mono rounded bg-zinc-950 text-pink-400 border border-zinc-800"
                      >
                        &ldquo;{kw}&rdquo;
                      </span>
                    ))}
                  </div>

                  {rule.replyTemplate && (
                    <p className="text-xs text-zinc-300 bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800/80">
                      <strong>Template:</strong> &ldquo;{rule.replyTemplate}&rdquo;
                    </p>
                  )}

                  <span className="text-[11px] text-zinc-500 font-medium block">
                    Executed {rule.executionCount.toLocaleString()} times
                  </span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => toggleAutomationRule(rule.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      rule.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {rule.isActive ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => deleteAutomationRule(rule.id)}
                    className="p-2 text-zinc-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preferences & Notifications */}
      {activeTab === 'notifications' && (
        <div className="glass-panel p-6 rounded-3xl border border-zinc-800 space-y-6 max-w-2xl">
          <h2 className="text-base font-semibold text-white">System & Notification Preferences</h2>

          <div className="space-y-4 divide-y divide-zinc-800/80">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Engagement Spike Alerts</p>
                <p className="text-[11px] text-zinc-400">Get notified when a post gains &gt;500 likes in 1 hour</p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">Enabled</span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Auto-Publish Confirmations</p>
                <p className="text-[11px] text-zinc-400">Send push notification when a queued post goes live</p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">Enabled</span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Weekly Performance Digest</p>
                <p className="text-[11px] text-zinc-400">Receive weekly audience growth summary every Sunday</p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Connect New Account Modal */}
      {isConnectModalOpen && (
        <Modal
          isOpen={isConnectModalOpen}
          onClose={() => setIsConnectModalOpen(false)}
          title="Connect / Add Instagram Account"
          subtitle="Add your brand or personal profile to the management hub"
        >
          <form onSubmit={handleConnectAccount} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Instagram @Handle</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. my_creative_studio"
                  required
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Maya Lin | Visual Studio"
                  required
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Niche Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Photography, Travel, Agency"
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Initial Followers</label>
                <input
                  type="number"
                  value={newFollowers}
                  onChange={(e) => setNewFollowers(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Bio Description</label>
              <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Website URL</label>
              <input
                type="url"
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsConnectModalOpen(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl ig-gradient-bg text-white text-xs font-semibold"
              >
                Save & Connect Account
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* New Rule Modal */}
      {isRuleModalOpen && (
        <Modal
          isOpen={isRuleModalOpen}
          onClose={() => setIsRuleModalOpen(false)}
          title="Create New Automation Rule"
          subtitle="Configure trigger keywords and automated action"
        >
          <form onSubmit={handleCreateRule} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Rule Name</label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="e.g. Auto-reply to pricing question"
                required
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Trigger Keywords (comma-separated)</label>
              <input
                type="text"
                value={triggerWords}
                onChange={(e) => setTriggerWords(e.target.value)}
                placeholder="price, cost, buy, discount"
                required
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Action Type</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500"
              >
                <option value="reply_comment">Reply to Comment Directly</option>
                <option value="reply_dm">Send Direct Message (DM)</option>
                <option value="hide_comment">Auto-Hide Comment (Spam filter)</option>
              </select>
            </div>

            {actionType !== 'hide_comment' && (
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Reply Message Template</label>
                <textarea
                  value={replyTemplate}
                  onChange={(e) => setReplyTemplate(e.target.value)}
                  placeholder="Hey @{{username}}! Thank you for asking. Here is the link..."
                  rows={3}
                  required
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-pink-500 resize-none"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsRuleModalOpen(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl ig-gradient-bg text-white text-xs font-semibold"
              >
                Save Automation Rule
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
