import React from 'react';
import { Heart, Moon, Sun, PenSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileHeader: React.FC = () => {
  const {
    setActiveTab,
    unreadNotifsCount,
    theme,
    toggleTheme,
    setIsCreateModalOpen
  } = useApp();

  return (
    <header
      id="mobile-header"
      className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800"
    >
      <div
        id="mobile-logo-btn"
        onClick={() => setActiveTab('feed')}
        className="flex items-center gap-1.5 cursor-pointer"
      >
        <span className="text-3xl font-normal tracking-tight text-slate-800 dark:text-slate-100 font-monte-carlo">
          Yaawp
        </span>
      </div>

      {/* Top Right: Dark mode, Notifications, Create button (no other options) */}
      <div className="flex items-center gap-2">
        {/* 1. Dark Mode Toggle */}
        <button
          id="mobile-theme-btn"
          onClick={toggleTheme}
          className="text-slate-600 dark:text-slate-300 p-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-slate-700" />
          ) : (
            <Sun className="w-5 h-5 text-amber-400" />
          )}
        </button>

        {/* 2. Notifications */}
        <button
          id="mobile-notif-btn"
          onClick={() => setActiveTab('notifications')}
          className="relative text-slate-700 dark:text-slate-200 p-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Notifications"
        >
          <Heart className="w-5 h-5 stroke-[1.8px]" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        {/* 3. Create Button with Pencil Composer Icon */}
        <button
          id="mobile-create-post-btn"
          onClick={() => setIsCreateModalOpen(true)}
          className="p-1.5 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          aria-label="Create Post"
          title="Create post"
        >
          <PenSquare className="w-5 h-5 stroke-[1.8px]" />
        </button>
      </div>
    </header>
  );
};
