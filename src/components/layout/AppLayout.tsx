"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { GlobalCreateModal } from './GlobalCreateModal';
import { Toast } from '@/components/ui/Toast';
import { useApp } from '@/context/AppContext';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { isSidebarCollapsed, toastMessage } = useApp();

  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-pink-500 selection:text-white">
        {children}
        <Toast message={toastMessage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-pink-500 selection:text-white">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Quick Creator Modal */}
      <GlobalCreateModal />

      {/* Global Toast Alerts */}
      <Toast message={toastMessage} />
    </div>
  );
};
