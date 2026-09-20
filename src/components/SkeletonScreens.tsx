import React from 'react';
import { Image as ImageIcon, Film } from 'lucide-react';

/**
 * Content-specific Skeleton for Feed Posts.
 * Matches the exact geometry, hierarchy, and dimensions of PostCard.
 */
export const FeedPostSkeleton: React.FC<{ count?: number }> = ({ count = 2 }) => {
  return (
    <div id="feed-post-skeleton-list" className="w-full space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={`feed-skeleton-${index}`}
          className="w-full max-w-[480px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden select-none"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              {/* Avatar circle */}
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0" />
              {/* Username and Location */}
              <div className="space-y-1.5">
                <div className="w-28 h-3 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="w-16 h-2 rounded-md bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
              </div>
            </div>
            {/* Options button placeholder */}
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
          </div>

          {/* Media Body Container */}
          <div className="w-full aspect-square bg-slate-150 dark:bg-slate-850 animate-shimmer relative flex items-center justify-center overflow-hidden">
            <div className="flex flex-col items-center gap-2 text-slate-300 dark:text-slate-700">
              <ImageIcon className="w-10 h-10 stroke-[1.2] opacity-60" />
              <div className="w-20 h-2 rounded-full bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
            </div>
          </div>

          {/* Action Row & Details */}
          <div className="p-3.5 space-y-3">
            {/* Action buttons (Like, Comment, Share ... Bookmark) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>

            {/* Likes count bar */}
            <div className="w-24 h-3.5 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />

            {/* Caption lines */}
            <div className="space-y-1.5 pt-0.5">
              <div className="w-5/6 h-3 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="w-2/3 h-2.5 rounded-md bg-slate-150 dark:bg-slate-800/70 animate-pulse" />
            </div>

            {/* Comments & Timestamp */}
            <div className="pt-1 flex items-center justify-between">
              <div className="w-28 h-2.5 rounded-md bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
              <div className="w-14 h-2 rounded-md bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

/**
 * Content-specific Skeleton for Stories Bar.
 */
export const StoriesBarSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-[480px] md:max-w-xl mx-auto mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-3">
      <div className="flex items-center space-x-5 overflow-x-auto px-2 no-scrollbar">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`story-skel-${i}`} className="flex flex-col items-center space-y-1.5 shrink-0">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 p-0.5 animate-pulse ring-2 ring-slate-100 dark:ring-slate-800" />
            <div className="w-11 h-2 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Content-specific Skeleton for Reels Viewport.
 * Matches the vertical 9:16 aspect ratio, bottom creator metadata overlay,
 * and floating action controls bar.
 */
export const ReelSkeleton: React.FC = () => {
  return (
    <div
      id="reel-skeleton-container"
      className="flex items-center justify-center min-h-[calc(100vh-80px)] md:min-h-screen py-2 px-2 select-none"
    >
      <div className="relative flex items-center gap-4">
        {/* Main 9:16 Reel Viewport */}
        <div className="relative w-full max-w-[380px] h-[80vh] max-h-[750px] aspect-9/16 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl animate-shimmer">
          {/* Subtle Watermark in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-neutral-700">
            <Film className="w-12 h-12 stroke-[1.2] opacity-50" />
            <div className="w-24 h-2.5 rounded-full bg-neutral-800 animate-pulse" />
          </div>

          {/* Top-Right Sound Icon Skeleton */}
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800/80 animate-pulse" />

          {/* Bottom Overlay Skeleton */}
          <div className="absolute bottom-0 inset-x-0 p-4 pt-14 bg-gradient-to-t from-black/95 via-black/60 to-transparent space-y-3 z-10">
            {/* User Row */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-neutral-800 animate-pulse ring-2 ring-neutral-700/60 shrink-0" />
              <div className="w-24 h-3.5 rounded-md bg-neutral-800 animate-pulse" />
              <div className="w-16 h-6 rounded-lg bg-neutral-800/80 animate-pulse" />
            </div>

            {/* Caption Bars */}
            <div className="space-y-1.5">
              <div className="w-5/6 h-3 rounded-md bg-neutral-800 animate-pulse" />
              <div className="w-3/5 h-3 rounded-md bg-neutral-800/80 animate-pulse" />
            </div>

            {/* Audio Track Bar */}
            <div className="flex items-center gap-2 pt-1">
              <div className="w-3.5 h-3.5 rounded-full bg-neutral-800 animate-pulse shrink-0" />
              <div className="w-36 h-2.5 rounded-md bg-neutral-800/70 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Right Floating Actions Column Skeleton */}
        <div className="flex flex-col items-center gap-5">
          {/* Like */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-800 animate-pulse" />
            <div className="w-6 h-2 rounded-md bg-neutral-300 dark:bg-neutral-800 animate-pulse" />
          </div>

          {/* Comment */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-800 animate-pulse" />
            <div className="w-6 h-2 rounded-md bg-neutral-300 dark:bg-neutral-800 animate-pulse" />
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-800 animate-pulse" />
            <div className="w-6 h-2 rounded-md bg-neutral-300 dark:bg-neutral-800 animate-pulse" />
          </div>

          {/* Bookmark */}
          <div className="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-800 animate-pulse" />

          {/* Vinyl Disc Skeleton */}
          <div className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-800 ring-4 ring-neutral-400 dark:ring-neutral-700 animate-pulse mt-2" />

          {/* Up/Down Navigation Skeletons */}
          <div className="flex flex-col gap-1.5 mt-4">
            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Content-specific Skeleton for Profile View.
 * Matches profile header geometry, bio, stats, story highlights, and grid posts.
 */
export const ProfileSkeleton: React.FC = () => {
  return (
    <div id="profile-skeleton-view" className="w-full max-w-4xl mx-auto py-6 px-3 md:px-8 select-none animate-in fade-in duration-200">
      {/* Top Header Card Skeleton */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 pb-8 border-b border-slate-200 dark:border-zinc-800/80">
        {/* Avatar Skeleton */}
        <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-slate-200 dark:bg-zinc-800 animate-pulse shrink-0 ring-4 ring-slate-100 dark:ring-zinc-800/50" />

        {/* Info Column Skeleton */}
        <div className="flex-1 text-center md:text-left space-y-4 w-full">
          {/* Top Row: Username & Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <div className="w-36 h-6 rounded-lg bg-slate-200 dark:bg-zinc-800 animate-pulse" />
            <div className="w-24 h-8 rounded-xl bg-slate-200 dark:bg-zinc-800 animate-pulse" />
            <div className="w-24 h-8 rounded-xl bg-slate-200 dark:bg-zinc-800 animate-pulse" />
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center md:justify-start gap-6 md:gap-8 pt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-4 rounded-md bg-slate-200 dark:bg-zinc-800 animate-pulse" />
              <div className="w-10 h-3 rounded-md bg-slate-100 dark:bg-zinc-800/60 animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-12 h-4 rounded-md bg-slate-200 dark:bg-zinc-800 animate-pulse" />
              <div className="w-14 h-3 rounded-md bg-slate-100 dark:bg-zinc-800/60 animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-10 h-4 rounded-md bg-slate-200 dark:bg-zinc-800 animate-pulse" />
              <div className="w-14 h-3 rounded-md bg-slate-100 dark:bg-zinc-800/60 animate-pulse" />
            </div>
          </div>

          {/* Bio Lines */}
          <div className="space-y-2 pt-1 max-w-md mx-auto md:mx-0">
            <div className="w-32 h-3.5 rounded-md bg-slate-200 dark:bg-zinc-800 animate-pulse" />
            <div className="w-full h-3 rounded-md bg-slate-150 dark:bg-zinc-800/70 animate-pulse" />
            <div className="w-3/4 h-3 rounded-md bg-slate-150 dark:bg-zinc-800/70 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Story Highlights Skeleton Row */}
      <div className="py-6 flex items-center gap-5 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-zinc-800/60">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`highlight-skel-${i}`} className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-16 h-16 md:w-18 md:h-18 rounded-full bg-slate-200 dark:bg-zinc-800 p-0.5 animate-pulse ring-2 ring-slate-100 dark:ring-zinc-800" />
            <div className="w-12 h-2.5 rounded-md bg-slate-200 dark:bg-zinc-800 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="flex items-center justify-around py-4 border-b border-slate-200 dark:border-zinc-800/60">
        <div className="w-16 h-4 rounded-md bg-slate-200 dark:bg-zinc-800 animate-pulse" />
        <div className="w-16 h-4 rounded-md bg-slate-200 dark:bg-zinc-800 animate-pulse" />
        <div className="w-16 h-4 rounded-md bg-slate-200 dark:bg-zinc-800 animate-pulse" />
        <div className="w-16 h-4 rounded-md bg-slate-200 dark:bg-zinc-800 animate-pulse" />
      </div>

      {/* Grid Posts Skeleton */}
      <div className="grid grid-cols-3 gap-1 md:gap-3 pt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`profile-grid-skel-${i}`}
            className="aspect-square rounded-lg md:rounded-xl bg-slate-200 dark:bg-zinc-800/90 animate-pulse overflow-hidden relative flex items-center justify-center"
          >
            <ImageIcon className="w-8 h-8 text-slate-300 dark:text-zinc-700 stroke-[1.2]" />
          </div>
        ))}
      </div>
    </div>
  );
};
