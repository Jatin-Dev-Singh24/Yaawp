import React from 'react';
import { Home, Film, Users, Send, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    viewedUserId,
    openUserProfile,
    unreadMessagesCount
  } = useApp();

  const isProfileActive = activeTab === 'profile' && (!viewedUserId || viewedUserId === currentUser.id);

  return (
    <nav
      id="mobile-nav-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800"
    >
      {/* 1. Home */}
      <button
        id="mobile-nav-feed"
        onClick={() => setActiveTab('feed')}
        className={`p-2 transition-colors ${
          activeTab === 'feed'
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-label="Home Feed"
      >
        <Home className={`w-5 h-5 ${activeTab === 'feed' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
      </button>

      {/* 2. Reels */}
      <button
        id="mobile-nav-reels"
        onClick={() => setActiveTab('reels')}
        className={`p-2 transition-colors ${
          activeTab === 'reels'
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-label="Reels"
      >
        <Film className={`w-5 h-5 ${activeTab === 'reels' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
      </button>

      {/* 3. Messages */}
      <button
        id="mobile-nav-messages"
        onClick={() => setActiveTab('messages')}
        className={`relative p-2 transition-colors ${
          activeTab === 'messages'
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-label="Messages"
      >
        <Send className={`w-5 h-5 ${activeTab === 'messages' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
        {unreadMessagesCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex h-3.5 min-w-3.5 px-1 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white shadow-xs">
            {unreadMessagesCount}
          </span>
        )}
      </button>

      {/* 5. Explore */}
      <button
        id="mobile-nav-explore"
        onClick={() => setActiveTab('explore')}
        className={`p-2 transition-colors ${
          activeTab === 'explore'
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-label="Explore"
      >
        <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
      </button>

      {/* 6. Profile */}
      <button
        id="mobile-nav-profile"
        onClick={() => openUserProfile(currentUser.id)}
        className="p-1.5 flex items-center justify-center"
        aria-label="Profile"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.username}
          className={`w-6 h-6 rounded-full object-cover ring-2 transition-all ${
            isProfileActive
              ? 'ring-indigo-600 dark:ring-indigo-400 scale-105'
              : 'ring-transparent opacity-85 hover:opacity-100'
          }`}
        />
      </button>
    </nav>
  );
};
