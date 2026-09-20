import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Film,
  X,
  Send,
  Smile,
  Play,
  Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReelSkeleton } from './SkeletonScreens';
import { useApp } from '../context/AppContext';
import { SharePostModal } from './SharePostModal';
import { ThreadedCommentTree } from './ThreadedCommentTree';
import { Post } from '../types';

export const ReelsView: React.FC = () => {
  const navigate = useNavigate();
  const {
    reels,
    toggleLikeReel,
    toggleSaveReel,
    toggleFollowUser,
    followedUserIds,
    showToast,
    addReelComment,
    likeReelComment,
    deleteReelComment,
    currentUser,
    openUserProfile
  } = useApp();

  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [reelCommentText, setReelCommentText] = useState('');

  // Seeking & Playback Progress States
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDraggingSeek, setIsDraggingSeek] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Initial load skeleton simulation for seamless perceived loading
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 260);
    return () => clearTimeout(timer);
  }, []);

  const currentReel = reels[currentReelIndex];

  // Reset playback time when switching reel
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(true);
  }, [currentReelIndex]);

  // Video duration listener if video is playing
  const handleVideoLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current && !isDraggingSeek) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Simulating playback timer for image/slideshow reels
  useEffect(() => {
    if (videoRef.current || !isPlaying || isDraggingSeek) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= duration) {
          return 0; // Loop reel
        }
        return prev + 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, isDraggingSeek, duration, videoRef]);

  // Seeking pointer event handlers
  const updateSeekPosition = (clientX: number) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clampedX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const ratio = clampedX / rect.width;
    const seekTime = ratio * duration;
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const handleSeekPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDraggingSeek(true);
    updateSeekPosition(e.clientX);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleSeekPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingSeek) {
      updateSeekPosition(e.clientX);
    }
  };

  const handleSeekPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingSeek) {
      setIsDraggingSeek(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const formatTimestamp = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

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
              <div
                onClick={() => {
                  openUserProfile(currentReel.user.id);
                  navigate('/app/profile');
                }}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <img
                  src={currentReel.user.avatar}
                  alt={currentReel.user.username}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/50 group-hover:ring-white transition-all"
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold group-hover:underline">
                    {currentReel.user.username}
                  </span>
                  {currentReel.user.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 fill-sky-500 text-white" />
                  )}
                </div>
              </div>
              <button
                onClick={() => toggleFollowUser(currentReel.user.id)}
                className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                  followedUserIds.includes(currentReel.user.id)
                    ? 'bg-white/20 border-white/50 text-white'
                    : 'bg-white text-zinc-950 font-bold border-white hover:bg-white/90'
                }`}
              >
                {followedUserIds.includes(currentReel.user.id) ? 'Following' : 'Follow'}
              </button>
            </div>

            {/* Caption */}
            <p className="text-xs text-white/95 line-clamp-2 leading-relaxed">
              {currentReel.caption}
            </p>

            {/* Audio Track Ticker */}
            <div className="flex items-center gap-2 text-xs text-white/80 pb-1">
              <Music className="w-3.5 h-3.5 flex-shrink-0 animate-bounce" />
              <div className="overflow-hidden whitespace-nowrap">
                <p className="text-[11px] font-medium tracking-wide">
                  {currentReel.musicTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Draggable Seeking Progress Bar Overlay */}
          <div
            ref={progressBarRef}
            id="reel-seek-progress-bar"
            onPointerDown={handleSeekPointerDown}
            onPointerMove={handleSeekPointerMove}
            onPointerUp={handleSeekPointerUp}
            onPointerCancel={handleSeekPointerUp}
            className="absolute bottom-0 inset-x-0 h-4 flex items-end cursor-pointer z-35 group select-none py-0.5 px-0.5 touch-none"
            title="Drag to seek"
          >
            {/* Background Track */}
            <div className="relative w-full h-1 group-hover:h-2 bg-white/25 rounded-full overflow-hidden transition-all duration-150">
              {/* Progress Fill */}
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-rose-400 rounded-full transition-[width] duration-75"
                style={{ width: `${Math.min(100, Math.max(0, (currentTime / duration) * 100))}%` }}
              />
            </div>

            {/* Draggable Scrubber Thumb */}
            <div
              className="absolute bottom-0 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg pointer-events-none transition-transform scale-0 group-hover:scale-100 group-active:scale-125 ring-2 ring-indigo-500/50"
              style={{ left: `${Math.min(100, Math.max(0, (currentTime / duration) * 100))}%` }}
            />

            {/* Seeking Floating Timestamp Tooltip */}
            {isDraggingSeek && (
              <div
                className="absolute bottom-5 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-mono backdrop-blur-md pointer-events-none shadow-xl border border-white/20 z-40 whitespace-nowrap"
                style={{ left: `${Math.min(90, Math.max(10, (currentTime / duration) * 100))}%` }}
              >
                {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
              </div>
            )}
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
            onClick={() => setShowCommentsModal(true)}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="View & post comments"
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
            comments: currentReel.comments || []
          }}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Reel Comments Drawer */}
      <AnimatePresence>
        {showCommentsModal && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-xs p-0 md:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh] md:max-h-[70vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Comments ({currentReel.commentsCount.toLocaleString()})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCommentsModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentReel.comments && currentReel.comments.length > 0 ? (
                  <ThreadedCommentTree
                    comments={currentReel.comments}
                    onAddReply={(parentId, text) => {
                      addReelComment(currentReel.id, text, parentId);
                    }}
                    onLikeComment={(commentId) => likeReelComment(currentReel.id, commentId)}
                    onDeleteComment={(commentId) => deleteReelComment(currentReel.id, commentId)}
                    onOpenUserProfile={(userId) => {
                      setShowCommentsModal(false);
                      openUserProfile(userId);
                    }}
                    currentUserId={currentUser.id}
                  />
                ) : (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No comments yet. Be the first to comment on this reel!
                  </div>
                )}
              </div>

              {/* Comment Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reelCommentText.trim()) return;
                  addReelComment(currentReel.id, reelCommentText.trim());
                  setReelCommentText('');
                }}
                className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center gap-2"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <input
                  type="text"
                  value={reelCommentText}
                  onChange={(e) => setReelCommentText(e.target.value)}
                  placeholder="Add a comment to this reel..."
                  className="flex-1 text-xs px-3 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!reelCommentText.trim()}
                  className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-opacity shrink-0"
                  title="Post comment"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
