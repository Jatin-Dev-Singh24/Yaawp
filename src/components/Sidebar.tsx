import React from 'react';
import {
  Home,
  Search,
  Compass,
  Film,
  Send,
  Heart,
  PenSquare,
  Sun,
  Moon,
  Feather,
  Bookmark,
  Sparkles,
  Shield,
  UserPlus,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    currentUser,
    unreadNotifsCount,
    unreadMessagesCount,
    setIsCreateModalOpen,
    openUserProfile,
    openLegalModal,
    setIsCreateAccountModalOpen
  } = useApp();

  const navItems = [
    { id: 'feed', label: 'Home', icon: Home },
    { id: 'reels', label: 'Reels', icon: Film },
    { id: 'communities', label: 'Communities', icon: Users },
    {
      id: 'messages',
      label: 'Messages',
      icon: Send,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
    },
    { id: 'explore', label: 'Explore', icon: Compass },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Heart,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined
    },
    {
      id: 'create',
      label: 'Create',
      icon: PenSquare,
      onClick: () => setIsCreateModalOpen(true)
    },
    { id: 'profile', label: 'Profile', isProfile: true }
  ];

  return (
    <aside
      id="desktop-sidebar"
      className="hidden md:flex flex-col justify-between fixed top-0 left-0 h-screen w-18 xl:w-[244px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 xl:p-5 z-40 transition-colors shrink-0"
    >
      {/* Top Branding & Nav */}
      <div className="flex flex-col space-y-6">
        {/* Brand Logo */}
        <div
          id="sidebar-logo"
          onClick={() => setActiveTab('feed')}
          className="cursor-pointer px-2 xl:px-3 py-2 flex items-center gap-3 transition-opacity hover:opacity-85"
        >
          <div className="xl:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-indigo-500 text-white shadow-xs">
            <Feather className="w-5 h-5" />
          </div>
          <div className="hidden xl:flex items-center gap-2">
            <span className="text-3xl font-normal tracking-tight text-slate-800 dark:text-slate-100 font-monte-carlo">
              Yaawp
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col space-y-1" aria-label="Main Navigation">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else if (item.id === 'profile') {
                    openUserProfile(currentUser.id);
                  } else {
                    setActiveTab(item.id as any);
                  }
                }}
                className={`relative flex items-center justify-center xl:justify-start space-x-3.5 p-3 rounded-lg transition-colors group text-left ${
                  isActive
                    ? 'bg-slate-50 dark:bg-slate-800 font-semibold text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium'
                }`}
                title={item.label}
              >
                {item.isProfile ? (
                  <div className="relative shrink-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.username}
                      className={`w-6 h-6 rounded-md object-cover ring-2 ${
                        isActive ? 'ring-indigo-600 dark:ring-indigo-400' : 'ring-transparent'
                      }`}
                    />
                  </div>
                ) : Icon ? (
                  <div className="relative shrink-0">
                    <Icon
                      className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                        isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'
                      }`}
                    />
                    {item.badge !== undefined && (
                      <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white leading-none shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                ) : null}

                <span className="hidden xl:inline text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col space-y-1.5 pt-3 border-t border-slate-200 dark:border-slate-800 mt-auto">
        {/* Create Account Action */}
        <button
          id="sidebar-create-account-btn"
          onClick={() => setIsCreateAccountModalOpen(true)}
          className="flex items-center justify-center xl:justify-start space-x-3.5 p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
          title="Create Account or Switch"
        >
          <UserPlus className="w-5 h-5 shrink-0" />
          <span className="hidden xl:inline text-xs font-bold">Create Account</span>
        </button>

        {/* Yaawp Legal & Privacy Center */}
        <button
          id="sidebar-legal-center-btn"
          onClick={() => openLegalModal('terms')}
          className="flex items-center justify-center xl:justify-start space-x-3.5 p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          title="Yaawp Terms & Privacy Policy"
        >
          <Shield className="w-5 h-5 shrink-0" />
          <span className="hidden xl:inline text-xs font-semibold">Terms &amp; Privacy</span>
        </button>

        {/* Dark/Light mode toggle */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="flex items-center justify-center xl:justify-start space-x-3.5 p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-slate-700 shrink-0" />
          ) : (
            <Sun className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <span className="hidden xl:inline text-xs font-semibold">
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </span>
        </button>

        {/* User preview profile card */}
        <button
          id="sidebar-profile-switch"
          onClick={() => setActiveTab('profile')}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-indigo-500 p-[2px] shrink-0">
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 p-[2px]">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div className="hidden xl:flex flex-col overflow-hidden min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              {currentUser.username}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              Active Profile
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
