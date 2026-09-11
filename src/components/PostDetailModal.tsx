import React, { useState } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Smile,
  CheckCircle2,
  Edit2,
  Archive,
  EyeOff,
  Trash2,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThreadedCommentTree } from './ThreadedCommentTree';
import { ConfirmationModal } from './ConfirmationModal';

export const PostDetailModal: React.FC = () => {
  const {
    selectedPostForModal,
    setSelectedPostForModal,
    toggleLikePost,
    toggleSavePost,
    addComment,
    likeComment,
    deleteComment,
    openUserProfile,
    showToast,
    currentUser,
    editPost,
    deletePost,
    archivePost,
    toggleHidePostFromGrid
  } = useApp();

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editedCaption, setEditedCaption] = useState('');
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    variant: 'danger' | 'warning';
    confirmLabel: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
    variant: 'danger',
    confirmLabel: 'Confirm'
  });

  if (!selectedPostForModal) return null;
  const post = selectedPostForModal;

  const handleNextMedia = () => {
    if (currentMediaIndex < post.mediaUrls.length - 1) {
      setCurrentMediaIndex(prev => prev + 1);
    }
  };

  const handlePrevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(prev => prev - 1);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
    setShowEmojiPicker(false);
  };

  const addEmoji = (emoji: string) => {
    setCommentText(prev => prev + emoji);
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Post link copied to clipboard!');
  };

  const goToProfile = (userId: string) => {
    setSelectedPostForModal(null);
    openUserProfile(userId);
  };

  return (
    <div
      id="post-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 md:p-8"
      onClick={() => setSelectedPostForModal(null)}
    >
      {/* Close button */}
      <button
        onClick={() => setSelectedPostForModal(null)}
        className="absolute top-4 right-4 z-50 text-white/80 hover:text-white p-2"
        aria-label="Close detail modal"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Container */}
      <div
        className="relative w-full max-w-5xl h-full max-h-[85vh] bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-200 dark:border-slate-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Left Side: Media */}
        <div className="relative w-full md:w-3/5 bg-black flex items-center justify-center overflow-hidden">
          <img
            src={post.mediaUrls[currentMediaIndex]}
            alt="Post content"
            className={`max-w-full max-h-full object-contain ${post.filterClass || 'filter-normal'}`}
          />

          {/* Carousel arrows */}
          {post.mediaUrls.length > 1 && (
            <>
              {currentMediaIndex > 0 && (
                <button
                  onClick={handlePrevMedia}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {currentMediaIndex < post.mediaUrls.length - 1 && (
                <button
                  onClick={handleNextMedia}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {post.mediaUrls.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full ${
                      idx === currentMediaIndex ? 'bg-indigo-500 scale-125' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Side: Header, Comments, Actions */}
        <div className="w-full md:w-2/5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800">
          {/* Post Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => goToProfile(post.user.id)}
            >
              <img
                src={post.user.avatar}
                alt={post.user.username}
                className="w-9 h-9 rounded-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:underline">
                    {post.user.username}
                  </span>
                  {post.user.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 fill-indigo-500 text-white" />
                  )}
                </div>
                {post.location && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {post.location}
                  </span>
                )}
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors"
                title="Post options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {showOptionsMenu && (
                <div className="absolute right-0 top-8 z-30 w-44 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-1.5 space-y-1 text-xs text-zinc-200 animate-in fade-in">
                  {post.user.id === currentUser.id ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditingCaption(true);
                          setEditedCaption(post.caption);
                          setShowOptionsMenu(false);
                        }}
                        className="w-full px-3 py-1.5 text-left rounded-xl hover:bg-zinc-800 flex items-center gap-2"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-lime-400" />
                        Edit Caption
                      </button>

                      <button
                        onClick={() => {
                          setShowOptionsMenu(false);
                          setConfirmState({
                            isOpen: true,
                            title: 'Archive Post',
                            message: 'Are you sure you want to archive this post? You can restore it later from your profile settings archive.',
                            confirmLabel: 'Archive',
                            variant: 'warning',
                            action: () => {
                              archivePost(post.id);
                              setSelectedPostForModal(null);
                            }
                          });
                        }}
                        className="w-full px-3 py-1.5 text-left rounded-xl hover:bg-zinc-800 flex items-center gap-2"
                      >
                        <Archive className="w-3.5 h-3.5 text-amber-400" />
                        Archive Post
                      </button>

                      <button
                        onClick={() => {
                          toggleHidePostFromGrid(post.id);
                          setShowOptionsMenu(false);
                        }}
                        className="w-full px-3 py-1.5 text-left rounded-xl hover:bg-zinc-800 flex items-center gap-2"
                      >
                        <EyeOff className="w-3.5 h-3.5 text-purple-400" />
                        Hide from Profile
                      </button>

                      <button
                        onClick={() => {
                          setShowOptionsMenu(false);
                          setConfirmState({
                            isOpen: true,
                            title: 'Delete Post',
                            message: 'Are you sure you want to delete this post? This will permanently delete your post and its comments.',
                            confirmLabel: 'Delete',
                            variant: 'danger',
                            action: () => {
                              deletePost(post.id);
                              setSelectedPostForModal(null);
                            }
                          });
                        }}
                        className="w-full px-3 py-1.5 text-left rounded-xl hover:bg-rose-950/50 flex items-center gap-2 text-rose-400 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Post
                      </button>
                    </>
                  ) : null}

                  <button
                    onClick={() => {
                      copyLink();
                      setShowOptionsMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left rounded-xl hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comments & Caption Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            {/* Caption as first comment or inline editor */}
            {isEditingCaption ? (
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
                <textarea
                  value={editedCaption}
                  onChange={e => setEditedCaption(e.target.value)}
                  rows={3}
                  className="w-full p-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-lime-400"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingCaption(false)}
                    className="px-3 py-1 rounded-lg text-xs text-zinc-400 hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (editedCaption.trim()) {
                        editPost(post.id, editedCaption);
                        setIsEditingCaption(false);
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-lime-400 text-zinc-950 text-xs font-bold hover:bg-lime-300"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <img
                  src={post.user.avatar}
                  alt={post.user.username}
                  onClick={() => goToProfile(post.user.id)}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 cursor-pointer"
                />
                <div className="flex-1 space-y-1">
                  <p className="text-slate-900 dark:text-slate-100 leading-snug">
                    <span
                      onClick={() => goToProfile(post.user.id)}
                      className="font-bold mr-1.5 cursor-pointer hover:underline"
                    >
                      {post.user.username}
                    </span>
                    {post.caption}
                  </p>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                    {post.timestamp}
                  </span>
                </div>
              </div>
            )}

            {/* Threaded comments (Reddit style) */}
            {post.comments && post.comments.length > 0 ? (
              <ThreadedCommentTree
                comments={post.comments}
                onAddReply={(parentId, text) => addComment(post.id, text, parentId)}
                onLikeComment={(commentId) => likeComment(post.id, commentId)}
                onOpenUserProfile={(userId) => goToProfile(userId)}
                onDeleteComment={(commentId) => deleteComment(post.id, commentId)}
                currentUserId={currentUser.id}
              />
            ) : (
              <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                <p className="text-xs">No comments yet. Start the conversation!</p>
              </div>
            )}
          </div>

          {/* Actions & Likes Count */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => toggleLikePost(post.id)}>
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      post.isLiked
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-slate-800 dark:text-slate-200 hover:text-slate-500'
                    }`}
                  />
                </button>
                <button onClick={() => {}}>
                  <MessageCircle className="w-5 h-5 text-slate-800 dark:text-slate-200" />
                </button>
                <button onClick={copyLink}>
                  <Send className="w-5 h-5 text-slate-800 dark:text-slate-200" />
                </button>
              </div>

              <button onClick={() => toggleSavePost(post.id)}>
                <Bookmark
                  className={`w-5 h-5 ${
                    post.isSaved ? 'fill-slate-900 dark:fill-white text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'
                  }`}
                />
              </button>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {post.likesCount.toLocaleString()} likes
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase mt-0.5">
                {post.timestamp}
              </span>
            </div>

            {/* Comment input form */}
            <form
              onSubmit={handleAddComment}
              className="relative flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
            >
              <button
                type="button"
                onClick={() => setShowEmojiPicker(prev => !prev)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <Smile className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 text-xs bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />

              {commentText.trim() && (
                <button
                  type="submit"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                >
                  Post
                </button>
              )}

              {/* Emoji quick drawer */}
              {showEmojiPicker && (
                <div className="absolute -top-12 left-0 flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-30">
                  {['❤️', '🔥', '🙌', '😍', '👏', '✨'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className="hover:scale-125 transition-transform text-base"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        variant={confirmState.variant}
        onConfirm={() => {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
          confirmState.action();
        }}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
