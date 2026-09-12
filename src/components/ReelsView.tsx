import React, { useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Film
} from 'lucide-react';
import { motion } from 'motion/react';
import { ReelSkeleton } from './SkeletonScreens';
import { useApp } from '../context/AppContext';
import { SharePostModal } from './SharePostModal';
import { Post } from '../types';

export const ReelsView: React.FC = () => {
  const {
    reels,
    toggleLikeReel,
    toggleSaveReel,
    toggleFollowUser,
    showToast
  } = useApp();

  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  // Initial load skeleton simulation for seamless perceived loading
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 260);
    return () => clearTimeout(timer);
  }, []);

  const currentReel = reels[currentReelIndex];

  const handleNext = () => {
    if (currentReelIndex < reels.length - 1) {
      setIsTransitioning(true);
      setIsMediaLoaded(false);
      setCurrentReelIndex(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 240);
    }
  };

  const handlePrev = () => {
    if (currentReelIndex > 0) {
      setIsTransitioning(true);
      setIsMediaLoaded(false);
      setCurrentReelIndex(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 240);
    }
  };

  const handleDoubleTap = () => {
    setShowHeartOverlay(true);
    if (!currentReel?.isLiked && currentReel) {
      toggleLikeReel(currentReel.id);
    }
    setTimeout(() => setShowHeartOverlay(false), 900);
  };

  const copyReelLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Reel link copied to clipboard!');
  };

  // Render content-specific ReelSkeleton during initial load or if reels are loading
  if (isInitialLoading || !currentReel) {
    return <ReelSkeleton />;
  }

  return (
    <div
      id="reels-view-container"
      className="flex items-center justify-center min-h-[calc(100vh-80px)] md:min-h-screen py-2 px-2"
    >
      {/* Reel Card */}
      <div className="relative flex items-center gap-4">
        {/* Main Reel Viewport */}
        <div
          className="relative w-full max-w-[380px] h-[80vh] max-h-[750px] aspect-9/16 rounded-2xl overflow-hidden bg-neutral-950 shadow-2xl border border-neutral-800 select-none cursor-pointer"
          onDoubleClick={handleDoubleTap}
        >
          {/* In-viewport media skeleton placeholder while reel media buffers */}
          {(!isMediaLoaded || isTransitioning) && (
            <div className="absolute inset-0 z-15 bg-neutral-900 animate-shimmer flex flex-col items-center justify-center gap-3 text-neutral-700 pointer-events-none">
              <Film className="w-12 h-12 stroke-[1.2] opacity-40 animate-pulse" />
              <div className="w-24 h-2 rounded-full bg-neutral-800 animate-pulse" />
            </div>
          )}

          {/* Reel Media Visual */}
          <img
            key={currentReel.id}
            src={currentReel.mediaUrl}
            alt={currentReel.caption}
            onLoad={() => setIsMediaLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isMediaLoaded && !isTransitioning ? 'opacity-100' : 'opacity-0'
            } ${currentReel.filterClass || 'filter-normal'}`}
          />

          {/* Sound Mute/Unmute Indicator Button */}
          <button
            onClick={e => {
              e.stopPropagation();
              setIsMuted(m => !m);
              showToast(isMuted ? 'Audio unmuted' : 'Audio muted');
            }}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/70"
            aria-label="Toggle sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Double Tap Heart Overlay */}
          {showHeartOverlay && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.9] }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            >
              <Heart className="w-24 h-24 fill-white text-white drop-shadow-xl" />
            </motion.div>
          )}

          {/* Reel Overlay Info (Bottom) */}
          <div className="absolute bottom-0 inset-x-0 p-4 pt-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white z-10 space-y-3">
            {/* User Row */}
            <div className="flex items-center gap-3">
              <img
                src={currentReel.user.avatar}
                alt={currentReel.user.username}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/50"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold hover:underline">
                  {currentReel.user.username}
                </span>
                {currentReel.user.isVerified && (
                  <CheckCircle2 className="w-3.5 h-3.5 fill-sky-500 text-white" />
                )}
              </div>
              <button
                onClick={() => toggleFollowUser(currentReel.user.id)}
                className="px-3 py-1 rounded-lg border border-white/40 text-xs font-semibold hover:bg-white/20 transition-colors"
              >
                {currentReel.user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>

            {/* Caption */}
            <p className="text-xs text-white/95 line-clamp-2 leading-relaxed">
              {currentReel.caption}
            </p>

            {/* Audio Track Ticker */}
            <div className="flex items-center gap-2 text-xs text-white/80">
              <Music className="w-3.5 h-3.5 flex-shrink-0 animate-bounce" />
              <div className="overflow-hidden whitespace-nowrap">
                <p className="text-[11px] font-medium tracking-wide">
                  {currentReel.musicTitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Floating Actions Column */}
        <div className="flex flex-col items-center gap-5 text-neutral-800 dark:text-neutral-200">
          {/* Like */}
          <button
            onClick={() => toggleLikeReel(currentReel.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart
                className={`w-6 h-6 ${
                  currentReel.isLiked
                    ? 'fill-rose-500 text-rose-500'
                    : 'stroke-[1.8px]'
                }`}
              />
            </div>
            <span className="text-[11px] font-semibold">
              {currentReel.likesCount.toLocaleString()}
            </span>
          </button>

          {/* Comments */}
          <button
            onClick={() => showToast('Opening comments')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 stroke-[1.8px]" />
            </div>
            <span className="text-[11px] font-semibold">
              {currentReel.commentsCount.toLocaleString()}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex flex-col items-center gap-1 group"
            title="Share reel"
          >
            <div className="w-11 h-11 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Share2 className="w-5 h-5 stroke-[1.8px]" />
            </div>
            <span className="text-[11px] font-semibold">
              {currentReel.sharesCount.toLocaleString()}
            </span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => toggleSaveReel(currentReel.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bookmark
                className={`w-5 h-5 ${
                  currentReel.isSaved
                    ? 'fill-neutral-900 dark:fill-white text-neutral-900 dark:text-white'
                    : 'stroke-[1.8px]'
                }`}
              />
            </div>
          </button>

          {/* Spinning Vinyl Music Record Disc */}
          <div className="relative w-8 h-8 rounded-full bg-neutral-900 ring-4 ring-neutral-700 overflow-hidden flex items-center justify-center animate-[spin_4s_linear_infinite] mt-2">
            <img
              src={currentReel.user.avatar}
              alt="Music cover"
              className="w-4 h-4 rounded-full object-cover"
            />
          </div>

          {/* Up / Down Navigation Buttons */}
          <div className="flex flex-col gap-1 mt-4">
            <button
              onClick={handlePrev}
              disabled={currentReelIndex === 0}
              className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous reel"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentReelIndex === reels.length - 1}
              className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next reel"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal for Reel */}
      {showShareModal && (
        <SharePostModal
          isOpen={showShareModal}
          post={{
            id: currentReel.id,
            user: currentReel.user,
            mediaUrls: [currentReel.mediaUrl],
            caption: currentReel.caption,
            timestamp: 'Reel',
            createdAt: Date.now(),
            likesCount: currentReel.likesCount,
            isLiked: currentReel.isLiked,
            isSaved: currentReel.isSaved,
            filterClass: currentReel.filterClass,
            comments: []
          }}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};
