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
  Plus,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { openCreateModal, comments } = useApp();

  const unreadComments = comments.filter((c) => c.status === 'unread').length;

  const items = [
    { label: 'Feed', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Posts', href: '/posts', icon: ImageIcon },
    { label: 'Create', isAction: true },
    { label: 'Reels', href: '/reels', icon: Film },
    { label: 'Inbox', href: '/comments', icon: MessageSquare, badge: unreadComments },
    { label: 'Calendar', href: '/scheduler', icon: Calendar },
    { label: 'Insights', href: '/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-xl px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around">
        {items.map((item, idx) => {
          if (item.isAction) {
            return (
              <button
                key="action-btn"
                onClick={() => openCreateModal('post')}
                className="w-10 h-10 -mt-5 rounded-full ig-gradient-bg flex items-center justify-center text-white shadow-lg shadow-pink-500/40 active:scale-95 transition-transform"
                title="Create Content"
              >
                <Plus className="w-6 h-6" />
              </button>
            );
          }

          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
          const Icon = item.icon!;

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors relative ${
                isActive ? 'text-pink-500 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {Boolean(item.badge && item.badge > 0) && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-pink-500" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
