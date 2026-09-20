import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { TemporaryGamesProvider } from './context/TemporaryGamesContext';
import { AnimatePresence, motion } from 'motion/react';
import {
  PreviewPage,
  LoginPage,
  SignupPage,
  AppLayout,
  HomePage,
  ExplorePage,
  ReelsPage,
  ChatsPage,
  CommunitiesPage,
  ProfilePage,
  NotificationsPage,
  SettingsPage,
  LegalPage
} from './pages';
import { CreateAccountModal } from './components/CreateAccountModal';
import { ErrorBoundary } from './components/ErrorBoundary';

const AppRoutes: React.FC = () => {
  const { toastMessage } = useApp();

  return (
    <>
      <Routes>
        {/* / → preview */}
        <Route
          path="/"
          element={
            <ErrorBoundary fallbackTitle="Unable to load Home">
              <PreviewPage />
            </ErrorBoundary>
          }
        />

        {/* /auth/login → login */}
        <Route
          path="/auth/login"
          element={
            <ErrorBoundary fallbackTitle="Unable to load Login">
              <LoginPage />
            </ErrorBoundary>
          }
        />

        {/* /auth/signup → signup */}
        <Route
          path="/auth/signup"
          element={
            <ErrorBoundary fallbackTitle="Unable to load Signup">
              <SignupPage />
            </ErrorBoundary>
          }
        />

        {/* /app/* routes */}
        <Route
          path="/app"
          element={
            <ErrorBoundary fallbackTitle="App error encountered">
              <AppLayout />
            </ErrorBoundary>
          }
        >
          <Route index element={<Navigate to="/app/home" replace />} />
          {/* /app/home → FeedView */}
          <Route
            path="home"
            element={
              <ErrorBoundary fallbackTitle="Feed failed to load">
                <HomePage />
              </ErrorBoundary>
            }
          />
          {/* /app/explore → ExploreView */}
          <Route
            path="explore"
            element={
              <ErrorBoundary fallbackTitle="Explore failed to load">
                <ExplorePage />
              </ErrorBoundary>
            }
          />
          {/* /app/reels → ReelsView */}
          <Route
            path="reels"
            element={
              <ErrorBoundary fallbackTitle="Reels failed to load">
                <ReelsPage />
              </ErrorBoundary>
            }
          />
          {/* /app/chats → MessagesView */}
          <Route
            path="chats"
            element={
              <ErrorBoundary fallbackTitle="Messages failed to load">
                <ChatsPage />
              </ErrorBoundary>
            }
          />
          {/* /app/communities → CommunitiesView */}
          <Route
            path="communities"
            element={
              <ErrorBoundary fallbackTitle="Communities failed to load">
                <CommunitiesPage />
              </ErrorBoundary>
            }
          />
          {/* /app/profile → ProfileView */}
          <Route
            path="profile"
            element={
              <ErrorBoundary fallbackTitle="Profile failed to load">
                <ProfilePage />
              </ErrorBoundary>
            }
          />
          {/* /app/notifications → NotificationsView */}
          <Route
            path="notifications"
            element={
              <ErrorBoundary fallbackTitle="Notifications failed to load">
                <NotificationsPage />
              </ErrorBoundary>
            }
          />
          {/* /app/settings → SettingsView */}
          <Route
            path="settings"
            element={
              <ErrorBoundary fallbackTitle="Settings failed to load">
                <SettingsPage />
              </ErrorBoundary>
            }
          />
          {/* /app/legal → LegalView (wrinkle textured) */}
          <Route
            path="legal"
            element={
              <ErrorBoundary fallbackTitle="Legal Center failed to load">
                <LegalPage />
              </ErrorBoundary>
            }
          />
        </Route>

        {/* Convenient Fallbacks */}
        <Route path="/feed" element={<Navigate to="/app/home" replace />} />
        <Route path="/messages" element={<Navigate to="/app/chats" replace />} />
        <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
        <Route path="/legal" element={<Navigate to="/app/legal" replace />} />
        <Route path="/terms" element={<Navigate to="/app/legal?doc=terms" replace />} />
        <Route path="/privacy" element={<Navigate to="/app/legal?doc=privacy" replace />} />
        <Route path="/cookies" element={<Navigate to="/app/legal?doc=cookies" replace />} />
        <Route path="/community" element={<Navigate to="/app/legal?doc=community" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Modals for Landing/Auth pages */}
      <CreateAccountModal />

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
    <ErrorBoundary fallbackTitle="Application Error">
      <AppProvider>
        <TemporaryGamesProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TemporaryGamesProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
