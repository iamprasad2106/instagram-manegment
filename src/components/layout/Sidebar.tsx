"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Film,
  MessageSquare,
  BarChart3,
  Calendar,
  Settings,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, currentAccount, openCreateModal } = useApp();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Posts', href: '/posts', icon: ImageIcon },
    { label: 'Reels', href: '/reels', icon: Film },
    { label: 'Comments', href: '/comments', icon: MessageSquare, badge: '6' },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Scheduler', href: '/scheduler', icon: Calendar },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-40 bg-zinc-950/90 border-r border-zinc-800/80 backdrop-blur-xl transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800/80">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl ig-gradient-bg flex items-center justify-center text-white shrink-0 shadow-lg shadow-pink-500/25">
            <Instagram className="w-6 h-6" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                Insta<span className="ig-gradient-text">Studio</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">
                Creator Suite
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        <button
          onClick={() => openCreateModal('post')}
          className={`w-full flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl ig-gradient-bg text-white font-semibold text-sm shadow-lg shadow-pink-600/20 hover:brightness-110 active:scale-98 transition-all ${
            isSidebarCollapsed ? 'px-0' : ''
          }`}
          title="Create or Schedule Post"
        >
          <PlusCircle className="w-5 h-5 shrink-0" />
          {!isSidebarCollapsed && <span>New Content</span>}
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-zinc-800/90 text-white shadow-inner font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
              }`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full ig-gradient-bg" />
              )}
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-pink-500' : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
              />
              {!isSidebarCollapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {!isSidebarCollapsed && item.badge && (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Account Profile Footer */}
      <div className="p-3 border-t border-zinc-800/80">
        <Link
          href="/settings"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900 transition-colors group"
        >
          <div className="story-ring shrink-0">
            <img
              src={currentAccount.avatarUrl}
              alt={currentAccount.username}
              className="w-9 h-9 rounded-full object-cover border-2 border-zinc-950"
            />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate flex items-center gap-1">
                @{currentAccount.username}
                {currentAccount.isVerified && (
                  <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[9px] font-bold">
                    ✓
                  </span>
                )}
              </p>
              <p className="text-[11px] text-zinc-400 truncate capitalize">
                {currentAccount.category}
              </p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
};
