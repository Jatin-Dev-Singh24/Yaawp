import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Heart,
  Eye,
  MessageCircle,
  Archive,
  Shield,
  Lock,
  Users,
  Film,
  Clock,
  UserX,
  Key,
  Download,
  LogOut,
  ChevronRight,
  Settings,
  Camera,
  Check,
  Globe,
  Trash2,
  Search,
  Sliders,
  ChevronLeft,
  Share2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileSettingsModal: React.FC = () => {
  const {
    isProfileMenuOpen,
    setIsProfileMenuOpen,
    currentUser,
    posts,
    reels,
    openLegalModal,
    setIsSecurityModalOpen,
    setIsCreateAccountModalOpen,
    exportUserData,
    signOutAccount,
    showToast,
    isAccountPrivate,
    toggleAccountPrivacy,
    isFollowersPrivate,
    toggleFollowersPrivacy,
    setSelectedPostForModal,
    archivePost,
    unarchivePost,
    toggleHidePostFromGrid,
    updateSecondaryAvatar,
    allUsers,
    toggleHideFollower,
    hiddenProfileFromUserIds,
    toggleHideMyProfileFrom
  } = useApp();

  const [activeSubView, setActiveSubView] = useState<
    | 'main'
    | 'saved'
    | 'liked'
    | 'watched'
    | 'commented'
    | 'archive'
    | 'dual_avatar'
    | 'followers_privacy'
    | 'privacy_policy'
    | 'story_settings'
    | 'hide_profile_from'
  >('main');

  const [searchQuery, setSearchQuery] = useState('');
  const [storyDuration, setStoryDuration] = useState<'24h' | '48h'>('48h');
  const [messageRestriction, setMessageRestriction] = useState<'everyone' | 'connections' | 'none'>('connections');
  const [secondaryAvatarUrl, setSecondaryAvatarUrl] = useState(
    currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'
  );
  const [avatarVisibility, setAvatarVisibility] = useState<'everyone' | 'followers' | 'close_friends'>('close_friends');
  const [hiddenFollowers, setHiddenFollowers] = useState<string[]>([]);

  if (!isProfileMenuOpen) return null;

  // Filter items for subviews
  const savedPosts = posts.filter(p => p.isSaved);
  const likedPosts = posts.filter(p => p.isLiked);
  const commentedPosts = posts.filter(p => p.comments.some(c => c.user.id === currentUser.id));
  const watchedReels = reels.slice(0, 4); // User's watch history

  const handleToggleHideFollowerItem = (userId: string) => {
    setHiddenFollowers(prev => {
      const exists = prev.includes(userId);
      const next = exists ? prev.filter(id => id !== userId) : [...prev, userId];
      showToast(exists ? 'Follower unhidden from public list' : 'Follower hidden from public list');
      return next;
    });
    toggleHideFollower?.(userId, 'follower');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 md:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[700px]">
        {/* Header */}
        <div className="p-4 px-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            {activeSubView !== 'main' && (
              <button
                onClick={() => setActiveSubView('main')}
                className="p-1.5 -ml-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Back to Settings"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-lime-400" />
              <span>
                {activeSubView === 'main'
                  ? 'Settings and activity'
                  : activeSubView === 'saved'
                  ? 'Saved Posts'
                  : activeSubView === 'liked'
                  ? 'Liked Posts'
                  : activeSubView === 'watched'
                  ? 'Watched Reels'
                  : activeSubView === 'commented'
                  ? 'Commented Posts'
                  : activeSubView === 'archive'
                  ? 'Archive & Trash'
                  : activeSubView === 'dual_avatar'
                  ? 'Dual Profile Pictures'
                  : activeSubView === 'followers_privacy'
                  ? 'Followers Privacy & Hidden'
                  : activeSubView === 'hide_profile_from'
                  ? 'Hide my profile from'
                  : activeSubView === 'story_settings'
                  ? 'Story & Message Settings'
                  : 'Privacy & Policy'}
              </span>
            </h2>
          </div>

          <button
            onClick={() => {
              setIsProfileMenuOpen(false);
              setActiveSubView('main');
            }}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6 text-zinc-200">
          {activeSubView === 'main' && (
            <>
              {/* Search Bar in Settings */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search settings..."
                  className="w-full pl-10 pr-4 py-2 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-lime-500"
                />
              </div>

              {/* Section 1: How you use Lumina (Saved, Liked, Watched, Commented, Archive) */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
                  How you interact
                </p>
                <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl divide-y divide-zinc-800/60 overflow-hidden">
                  <button
                    onClick={() => setActiveSubView('saved')}
                    className="w-full p-3 px-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Bookmark className="w-4 h-4 text-lime-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">Saved</p>
                        <p className="text-[10px] text-zinc-400">{savedPosts.length} saved bookmarks</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={() => setActiveSubView('liked')}
                    className="w-full p-3 px-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <div>
                        <p className="text-xs font-semibold text-white">Liked</p>
                        <p className="text-[10px] text-zinc-400">{likedPosts.length} posts you liked</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={() => setActiveSubView('watched')}
                    className="w-full p-3 px-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Film className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">Watched</p>
                        <p className="text-[10px] text-zinc-400">Reels viewing history</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={() => setActiveSubView('commented')}
                    className="w-full p-3 px-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-4 h-4 text-sky-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">Commented</p>
                        <p className="text-[10px] text-zinc-400">{commentedPosts.length} posts you participated in</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={() => setActiveSubView('archive')}
                    className="w-full p-3 px-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Archive className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">Archive</p>
                        <p className="text-[10px] text-zinc-400">Archived posts, stories & highlights</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>
              </div>

              {/* Section 2: Who can see your content */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
                  Who can see your content
                </p>
                <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl divide-y divide-zinc-800/60 overflow-hidden">
                  <div className="p-3 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-indigo-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">Private Account</p>
                        <p className="text-[10px] text-zinc-400">Only approved followers can see your posts and stories</p>
                      </div>
                    </div>
                    <button
                      onClick={toggleAccountPrivacy}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        isAccountPrivate ? 'bg-lime-400 justify-end' : 'bg-zinc-800 justify-start'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full shadow-md ${isAccountPrivate ? 'bg-zinc-950' : 'bg-zinc-400'}`} />
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveSubView('dual_avatar')}
                    className="w-full p-3 px-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">Dual Profile Pictures</p>
                        <p className="text-[10px] text-zinc-400">Public picture vs Close Friends picture</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={() => setActiveSubView('followers_privacy')}
                    className="w-full p-3 px-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">Followers & Following Privacy</p>
                        <p className="text-[10px] text-zinc-400">Hide specific people from lists or conceal counts</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    id="settings-hide-profile-from-btn"
                    onClick={() => setActiveSubView('hide_profile_from')}
                    className="w-full p-3 px-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <UserX className="w-4 h-4 text-rose-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">Hide my profile from</p>
                        <p className="text-[10px] text-zinc-400">
                          {hiddenProfileFromUserIds.length > 0
                            ? `${hiddenProfileFromUserIds.length} ${
                                hiddenProfileFromUserIds.length === 1 ? 'person' : 'people'
                              } cannot see your profile`
                            : 'Choose specific people who cannot see your profile'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={() => setActiveSubView('story_settings')}
                    className="w-full p-3 px-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">Story Duration (Up to 48 Hours)</p>
                        <p className="text-[10px] text-zinc-400">Configure 24h or 48h active duration</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>
              </div>

              {/* Section 3: Privacy, Policy & Security (With Shield Icon) */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
                  Privacy, Policy & Security
                </p>
                <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl divide-y divide-zinc-800/60 overflow-hidden">
                  <button
                    id="settings-shield-privacy-btn"
                    onClick={() => openLegalModal('privacy')}
                    className="w-full p-3.5 px-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-lime-400/10 text-lime-400">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-lime-400 transition-colors">
                          Privacy Policy & Legal Agreements
                        </p>
                        <p className="text-[10px] text-zinc-400">
                          Review Yaawp terms, cookie policies & GDPR rights
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsSecurityModalOpen(true);
                    }}
                    className="w-full p-3 px-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Key className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">Security Suite & Passcode</p>
                        <p className="text-[10px] text-zinc-400">Two-Factor Authentication & Audit Logs</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>
              </div>

              {/* Section 4: Login & Account Management */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
                  Login & Account
                </p>
                <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl divide-y divide-zinc-800/60 overflow-hidden">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsCreateAccountModalOpen(true);
                    }}
                    className="w-full p-3 px-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-indigo-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">Add or Switch Account</p>
                        <p className="text-[10px] text-zinc-400">Login to another persona or create a brand page</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={exportUserData}
                    className="w-full p-3 px-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">Download Your Information</p>
                        <p className="text-[10px] text-zinc-400">Get an offline JSON copy of your profile & media</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={signOutAccount}
                    className="w-full p-3 px-4 flex items-center justify-between hover:bg-rose-950/30 text-rose-400 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-4 h-4" />
                      <div>
                        <p className="text-xs font-bold">Log Out @{currentUser.username}</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* SubView: Saved Posts */}
          {activeSubView === 'saved' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Only you can see what you've saved.
              </p>
              {savedPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {savedPosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setSelectedPostForModal(post);
                      }}
                      className="aspect-square bg-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 relative group"
                    >
                      <img src={post.mediaUrls[0]} alt={post.caption} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Bookmark className="w-5 h-5 text-lime-400 fill-lime-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  No saved posts yet.
                </div>
              )}
            </div>
          )}

          {/* SubView: Liked Posts */}
          {activeSubView === 'liked' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Posts and photos you've given a heart to.
              </p>
              {likedPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {likedPosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setSelectedPostForModal(post);
                      }}
                      className="aspect-square bg-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 relative group"
                    >
                      <img src={post.mediaUrls[0]} alt={post.caption} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  No liked posts yet.
                </div>
              )}
            </div>
          )}

          {/* SubView: Watched Reels */}
          {activeSubView === 'watched' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Recently viewed short-form video reels.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {watchedReels.map(reel => (
                  <div key={reel.id} className="relative aspect-[9/16] bg-zinc-800 rounded-2xl overflow-hidden group">
                    <img src={reel.thumbnailUrl} alt={reel.caption} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between">
                      <span className="text-[10px] bg-zinc-950/70 text-lime-400 px-2 py-0.5 rounded-md font-mono self-start">
                        {reel.durationSeconds}s
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white line-clamp-1">{reel.caption}</p>
                        <p className="text-[10px] text-zinc-400">@{reel.user.username}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SubView: Commented */}
          {activeSubView === 'commented' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Posts where you left a comment or joined a discussion.
              </p>
              {commentedPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {commentedPosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setSelectedPostForModal(post);
                      }}
                      className="aspect-square bg-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 relative group"
                    >
                      <img src={post.mediaUrls[0]} alt={post.caption} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-sky-400 fill-sky-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  No commented posts yet.
                </div>
              )}
            </div>
          )}

          {/* SubView: Archive & Trash */}
          {activeSubView === 'archive' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800">
                <h4 className="text-xs font-bold text-white mb-1">Archived Content</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Only you can see the posts, stories and highlights you've archived. Archiving hides content from your profile without deleting its likes and comments.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-zinc-300">Your Posts in Archive</p>
                <div className="grid grid-cols-3 gap-2">
                  {posts.slice(0, 3).map(post => (
                    <div key={post.id} className="aspect-square rounded-xl overflow-hidden bg-zinc-800 relative group">
                      <img src={post.mediaUrls[0]} alt="" className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 text-center">
                        <button
                          onClick={() => {
                            unarchivePost(post.id);
                            showToast('Restored post to profile grid');
                          }}
                          className="px-2 py-1 rounded bg-lime-400 text-zinc-950 font-bold text-[10px]"
                        >
                          Show on Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SubView: Dual Profile Pictures */}
          {activeSubView === 'dual_avatar' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800">
                <h4 className="text-xs font-bold text-white mb-1">Dual Profile Picture Protection</h4>
                <p className="text-[11px] text-zinc-400">
                  Set two distinct avatars: your public persona for the world, and a personal avatar seen only by Close Friends or mutual connections.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Primary Avatar */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-2">
                  <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider">Primary (Public)</span>
                  <div className="w-20 h-20 rounded-full mx-auto overflow-hidden ring-2 ring-lime-400/50">
                    <img src={currentUser.avatar} alt="Primary" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs font-semibold text-white">Everyone sees this</p>
                </div>

                {/* Secondary Avatar */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-2">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Secondary (Private)</span>
                  <div className="w-20 h-20 rounded-full mx-auto overflow-hidden ring-2 ring-cyan-400/50">
                    <img src={secondaryAvatarUrl} alt="Secondary" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs font-semibold text-white">Connections only</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-zinc-300">
                  Secondary Avatar Image URL
                </label>
                <input
                  type="text"
                  value={secondaryAvatarUrl}
                  onChange={e => setSecondaryAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400"
                />

                <label className="block text-xs font-semibold text-zinc-300 pt-2">
                  Who sees your Secondary Picture?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['everyone', 'followers', 'close_friends'] as const).map(vis => (
                    <button
                      key={vis}
                      onClick={() => setAvatarVisibility(vis)}
                      className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all ${
                        avatarVisibility === vis
                          ? 'border-lime-400 bg-lime-400/10 text-lime-400'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                      }`}
                    >
                      {vis === 'everyone' ? 'Everyone' : vis === 'followers' ? 'Followers' : 'Close Friends'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    updateSecondaryAvatar(secondaryAvatarUrl, avatarVisibility);
                    showToast('Dual profile pictures and visibility saved!');
                  }}
                  className="w-full py-2.5 rounded-xl bg-lime-400 text-zinc-950 font-bold text-xs hover:bg-lime-300 transition-colors mt-3"
                >
                  Save Dual Avatar Settings
                </button>
              </div>
            </div>
          )}

          {/* SubView: Followers & Following Privacy */}
          {activeSubView === 'followers_privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Hide Follower & Following Lists</h4>
                  <p className="text-[10px] text-zinc-400">Prevent other users from clicking and viewing who you follow</p>
                </div>
                <button
                  onClick={toggleFollowersPrivacy}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    isFollowersPrivate ? 'bg-lime-400 justify-end' : 'bg-zinc-800 justify-start'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full shadow-md ${isFollowersPrivate ? 'bg-zinc-950' : 'bg-zinc-400'}`} />
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-zinc-300">
                  Select Specific Followers to Conceal from Your Public Profile:
                </p>
                <div className="max-h-64 overflow-y-auto divide-y divide-zinc-800 border border-zinc-800 rounded-2xl bg-zinc-950 p-1">
                  {allUsers
                    .filter(u => u.id !== currentUser.id)
                    .map(user => {
                      const isHidden = hiddenFollowers.includes(user.id);
                      return (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/60 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <p className="text-xs font-semibold text-white">{user.name}</p>
                              <p className="text-[10px] text-zinc-400">@{user.username}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleHideFollowerItem(user.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                              isHidden
                                ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            }`}
                          >
                            {isHidden ? 'Concealed' : 'Conceal'}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* SubView: Story Duration Settings */}
          {activeSubView === 'story_settings' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800">
                <h4 className="text-xs font-bold text-white mb-1">Story Lifespan Duration</h4>
                <p className="text-[11px] text-zinc-400">
                  Standard stories disappear after 24 hours. Extend your stories up to 48 hours for weekend coverage, travel logs, and conferences.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setStoryDuration('24h');
                    showToast('Stories duration set to standard 24 hours');
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    storyDuration === '24h'
                      ? 'border-lime-400 bg-lime-400/10 text-white'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                  }`}
                >
                  <Clock className="w-4 h-4 text-zinc-400 mb-1" />
                  <p className="text-xs font-bold">Standard 24h</p>
                  <p className="text-[10px] text-zinc-500">Default disappearance</p>
                </button>

                <button
                  onClick={() => {
                    setStoryDuration('48h');
                    showToast('Stories duration extended to 48 hours!');
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    storyDuration === '48h'
                      ? 'border-lime-400 bg-lime-400/10 text-white'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-lime-400 mb-1" />
                  <p className="text-xs font-bold text-lime-400">Extended 48h</p>
                  <p className="text-[10px] text-zinc-400">Keeps active for 2 full days</p>
                </button>
              </div>

              <div className="pt-2 space-y-2">
                <label className="block text-xs font-semibold text-zinc-300">
                  Message Restrictions & Story Replies
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['everyone', 'connections', 'none'] as const).map(res => (
                    <button
                      key={res}
                      onClick={() => {
                        setMessageRestriction(res);
                        showToast(`Story replies restricted to: ${res}`);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        messageRestriction === res
                          ? 'border-lime-400 bg-lime-400/10 text-lime-400'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SubView: Hide My Profile From */}
          {activeSubView === 'hide_profile_from' && (
            <div className="p-4 space-y-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-rose-400 text-xs">
                  <UserX className="w-4 h-4 shrink-0" />
                  <span>One-Way Profile Concealment</span>
                </div>
                <p className="text-[11px] leading-relaxed text-rose-200/80">
                  People you choose here cannot see your profile, posts, reels, or stories. When they visit your profile, it will show as <strong>"Profile Unavailable"</strong>. However, you can still view their profile normally.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by username or name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400/60"
                />
              </div>

              {/* Hidden users section */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Currently Hidden ({hiddenProfileFromUserIds.length})
                </p>

                {hiddenProfileFromUserIds.length === 0 ? (
                  <div className="p-4 text-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-xs">
                    You haven't hidden your profile from anyone yet. Search below to add someone.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {allUsers
                      .filter(u => hiddenProfileFromUserIds.includes(u.id))
                      .map(u => (
                        <div
                          key={u.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950 border border-rose-900/30"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar}
                              alt={u.username}
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-rose-500/40"
                            />
                            <div>
                              <p className="text-xs font-bold text-white flex items-center gap-1">
                                <span>{u.name}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400">
                                  Blocked
                                </span>
                              </p>
                              <p className="text-[11px] text-zinc-400">@{u.username}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleHideMyProfileFrom(u.id)}
                            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
                          >
                            Unhide
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Available users list */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Add People to Hide List
                </p>

                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {allUsers
                    .filter(u => u.id !== currentUser.id)
                    .filter(
                      u =>
                        !searchQuery ||
                        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(u => {
                      const isHidden = hiddenProfileFromUserIds.includes(u.id);
                      return (
                        <div
                          key={u.id}
                          className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar}
                              alt={u.username}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-xs font-semibold text-white">{u.name}</p>
                              <p className="text-[11px] text-zinc-400">@{u.username}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleHideMyProfileFrom(u.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              isHidden
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                                : 'bg-zinc-800 text-zinc-200 hover:bg-rose-600 hover:text-white'
                            }`}
                          >
                            {isHidden ? 'Hidden' : 'Hide Profile'}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
