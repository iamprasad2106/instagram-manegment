"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  ChevronDown,
  Plus,
  Check,
  Sparkles,
  ExternalLink,
  LogOut,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentAccount,
    accounts,
    switchAccount,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openCreateModal,
    isSidebarCollapsed,
  } = useApp();

  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const accountRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
      }`}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, hashtags, comments, metrics..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-900/90 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/50 transition-all"
            />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Quick Create Button */}
          <button
            onClick={() => openCreateModal('post')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg ig-gradient-bg text-white text-xs font-semibold shadow-md shadow-pink-500/20 hover:opacity-95 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Compose</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-pink-500 ring-2 ring-zinc-950 animate-pulse" />
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-pink-500/20 text-pink-400">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-pink-400 hover:text-pink-300 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/60">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-3.5 hover:bg-zinc-800/50 transition-colors cursor-pointer flex gap-3 ${
                        !notif.isRead ? 'bg-pink-500/5' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-pink-400 shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-white truncate">{notif.title}</p>
                          <span className="text-[10px] text-zinc-400 shrink-0">{notif.timeAgo}</span>
                        </div>
                        <p className="text-xs text-zinc-300 leading-snug">{notif.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Account Switcher Dropdown */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-800 transition-all text-left"
            >
              <div className="story-ring shrink-0">
                <img
                  src={currentAccount.avatarUrl}
                  alt={currentAccount.username}
                  className="w-7 h-7 rounded-full object-cover border border-zinc-950"
                />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-white leading-none flex items-center gap-1">
                  @{currentAccount.username}
                </p>
                <p className="text-[10px] text-zinc-400 leading-none mt-0.5">
                  {(currentAccount.followersCount / 1000).toFixed(1)}k followers
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            </button>

            {accountDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Switch Instagram Account
                </div>
                <div className="py-1 space-y-1">
                  {accounts.map((acc) => {
                    const isSelected = acc.id === currentAccount.id;
                    return (
                      <button
                        key={acc.id}
                        onClick={() => {
                          switchAccount(acc.id);
                          setAccountDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                          isSelected ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/60 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={acc.avatarUrl}
                            alt={acc.username}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div className="truncate">
                            <p className="text-xs font-semibold truncate flex items-center gap-1">
                              @{acc.username}
                              {acc.isVerified && (
                                <span className="w-3 h-3 rounded-full bg-sky-500 text-white flex items-center justify-center text-[8px] font-bold">
                                  ✓
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-zinc-400 truncate">
                              {(acc.followersCount / 1000).toFixed(1)}k followers
                            </p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-pink-500 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 mt-1 border-t border-zinc-800 space-y-1">
                  <Link
                    href="/settings"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-xl transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-zinc-400" />
                    Manage Accounts
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    Switch or Logout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
