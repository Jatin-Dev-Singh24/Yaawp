import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { MobileHeader } from './components/MobileHeader';
import { MobileNav } from './components/MobileNav';
import { FeedView } from './components/FeedView';
import { ExploreView } from './components/ExploreView';
import { CommunitiesView } from './components/CommunitiesView';
import { ReelsView } from './components/ReelsView';
import { MessagesView } from './components/MessagesView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { StoryViewerModal } from './components/StoryViewerModal';
import { PostDetailModal } from './components/PostDetailModal';
import { CreatePostModal } from './components/CreatePostModal';
import { EditProfileModal } from './components/EditProfileModal';
import { MetaLegalModal } from './components/MetaLegalModal';
import { CreateAccountModal } from './components/CreateAccountModal';
import { TermsConsentBanner } from './components/TermsConsentBanner';
import { AmbientCursor } from './components/AmbientCursor';
import { SecurityModal } from './components/SecurityModal';
import { BehindTheScenesModal } from './components/BehindTheScenesModal';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { AppPreviewPage } from './components/AppPreviewPage';
import { AnimatePresence, motion } from 'motion/react';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col md:flex-row transition-colors selection:bg-lime-500 selection:text-zinc-950 relative">
      {/* Ambient Cursor Aura for Dark Premium Theme */}
      <AmbientCursor />

      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Mobile Top Header */}
      <MobileHeader />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-18 xl:pl-[244px] pb-16 md:pb-0 min-h-screen overflow-x-hidden relative z-10">
        {activeTab === 'feed' && <FeedView />}
        {activeTab === 'explore' && <ExploreView />}
        {activeTab === 'communities' && <CommunitiesView />}
        {activeTab === 'reels' && <ReelsView />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'notifications' && <NotificationsView />}
        {activeTab === 'profile' && <ProfileView />}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Global Modals */}
      <StoryViewerModal />
      <PostDetailModal />
      <CreatePostModal />
      <EditProfileModal />
      <MetaLegalModal />
      <CreateAccountModal />
      <SecurityModal />
      <BehindTheScenesModal />
      <ProfileSettingsModal />

      {/* Yaawp Legal Terms Agreement Consent Banner */}
      <TermsConsentBanner />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, toastMessage } = useApp();

  return (
    <>
      {isAuthenticated ? (
        <MainLayout />
      ) : (
        <>
          <AppPreviewPage />
          <CreateAccountModal />
          <MetaLegalModal />
        </>
      )}

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-18 md:bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-xs font-semibold shadow-lg border border-slate-800 dark:border-slate-200 backdrop-blur-xs flex items-center gap-2"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
