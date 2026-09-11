import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  UserProfile,
  UserSummary,
  Post,
  Story,
  Reel,
  NotificationItem,
  ChatConversation,
  ChatMessage,
  Comment,
  LegalDocType,
  NewAccountRegistration,
  Community,
  Discussion,
  Challenge,
  SecurityAuditLog,
  CommunityJoinRequest,
  CustomCircle,
  AlgorithmSettings,
  AlgorithmFeedback,
  NearbyActivity,
  PresenceStatus,
  CommunityChannel,
  CommunityChatMessage,
  CommunityPersona,
  CommunityModerationConfig
} from '../types';
import {
  CURRENT_USER,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_REELS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
  USERS,
  USER_PROFILES,
  INITIAL_COMMUNITIES,
  INITIAL_DISCUSSIONS,
  INITIAL_CHALLENGES,
  INITIAL_CIRCLES,
  INITIAL_NEARBY_ACTIVITIES
} from '../data/mockData';

export type TabType = 'feed' | 'explore' | 'communities' | 'messages' | 'profile' | 'notifications' | 'reels';
export type FeedSortAlgorithm = 'chronological' | 'engagement' | 'balanced' | 'trending';
export type FeedFilterMode = 'for_you' | 'following' | 'communities' | 'nearby' | 'my_posts' | 'custom_list' | 'all';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentUser: UserProfile;
  posts: Post[];
  feedPosts: Post[];
  feedMode: FeedFilterMode;
  setFeedMode: (mode: FeedFilterMode) => void;
  feedSort: FeedSortAlgorithm;
  setFeedSort: (sort: FeedSortAlgorithm) => void;
  followedUserIds: string[];
  stories: Story[];
  reels: Reel[];
  notifications: NotificationItem[];
  conversations: ChatConversation[];
  activeConvId: string;
  setActiveConvId: (id: string) => void;
  allUsers: UserSummary[];
  startConversationWithUser: (user: UserSummary) => void;
  viewedUserId: string;
  openUserProfile: (userId: string) => void;
  getUserProfile: (userId: string) => UserProfile;
  unreadNotifsCount: number;
  unreadMessagesCount: number;
  activeStoryUserIndex: number | null;
  setActiveStoryUserIndex: (index: number | null) => void;
  selectedPostForModal: Post | null;
  setSelectedPostForModal: (post: Post | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  votePost: (postId: string, type: 'up' | 'down') => void;
  repostPost: (postId: string) => void;
  deletePost: (postId: string) => void;
  editPost: (postId: string, caption: string) => void;
  reportPost: (postId: string, reason: string) => void;
  addComment: (postId: string, text: string, parentId?: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  voteComment: (postId: string, commentId: string, type: 'up' | 'down') => void;
  createPost: (data: {
    mediaUrls: string[];
    caption: string;
    location?: string;
    filterClass?: string;
    allowsRepost?: boolean;
    communityId?: string;
    audience?: Post['audience'];
    audienceCircleId?: string;
    allowedEmojis?: string[];
    restrictedEmojis?: string[];
  }) => void;
  createStory: (mediaUrl: string, caption?: string) => void;
  toggleLikeReel: (reelId: string) => void;
  toggleSaveReel: (reelId: string) => void;
  toggleFollowUser: (userId: string) => void;
  // Algorithmic Feed & Recommendations
  algorithmSettings: AlgorithmSettings;
  updateAlgorithmSettings: (settings: Partial<AlgorithmSettings>) => void;
  applyAlgorithmFeedback: (
    postId: string,
    action: 'more_like_this' | 'less_like_this' | 'mute_topic' | 'mute_community' | 'mute_person',
    topic?: string,
    targetId?: string
  ) => void;
  resetRecommendationProfile: () => void;
  // Custom Circles
  customCircles: CustomCircle[];
  activeCustomCircleId: string | null;
  setActiveCustomCircleId: (id: string | null) => void;
  createCustomCircle: (name: string, icon: string, userIds: string[], description?: string) => void;
  updateCustomCircle: (id: string, name: string, icon: string, userIds: string[]) => void;
  deleteCustomCircle: (id: string) => void;
  toggleUserInCircle: (circleId: string, userId: string) => void;
  // Spontaneous Meetups & Nearby Activities
  nearbyActivities: NearbyActivity[];
  joinNearbyActivity: (activityId: string) => void;
  createNearbyActivity: (activity: Omit<NearbyActivity, 'id' | 'organizer' | 'spotsTaken' | 'attendees' | 'isJoined'>) => void;
  // Social Presence ("Currently")
  presenceStatus: PresenceStatus;
  updatePresenceStatus: (status: Partial<PresenceStatus>) => void;
  // Expressive Reactions & Reposting
  reactToPost: (postId: string, reactionEmoji: string) => void;
  quotePost: (targetPostId: string, caption: string) => void;
  // Community Personas & Channels
  communityPersonas: Record<string, CommunityPersona>;
  setCommunityPersona: (communityId: string, persona: Partial<CommunityPersona>) => void;
  communityChatMessages: Record<string, CommunityChatMessage[]>;
  sendCommunityChatMessage: (
    communityId: string,
    channelId: string,
    text: string,
    mediaUrl?: string,
    replyTo?: { id: string; text: string; senderName: string }
  ) => void;
  reactToCommunityChatMessage: (communityId: string, channelId: string, messageId: string, emoji: string) => void;
  updateCommunityModeration: (communityId: string, config: Partial<CommunityModerationConfig>) => void;
  // Communities
  communities: Community[];
  selectedCommunityId: string | null;
  setSelectedCommunityId: (id: string | null) => void;
  openCommunityDetail: (id: string) => void;
  joinCommunity: (id: string) => void;
  leaveCommunity: (id: string) => void;
  createCommunity: (comm: Partial<Community>) => void;
  updateCommunity: (id: string, data: Partial<Community>) => void;
  deleteCommunity: (id: string) => void;
  requestJoinCommunity: (communityId: string) => void;
  handleJoinRequest: (communityId: string, requestId: string, action: 'accept' | 'decline') => void;
  joinRequests: CommunityJoinRequest[];
  isCreateCommunityOpen: boolean;
  setIsCreateCommunityOpen: (open: boolean) => void;
  // Discussions
  discussions: Discussion[];
  createDiscussion: (data: { communityId: string; title: string; body: string; tags?: string[]; mediaUrl?: string }) => void;
  voteDiscussion: (discussionId: string, type: 'up' | 'down') => void;
  addDiscussionComment: (discussionId: string, text: string, parentId?: string) => void;
  voteDiscussionComment: (discussionId: string, commentId: string, type: 'up' | 'down') => void;
  likeDiscussion: (discussionId: string) => void;
  repostDiscussion: (discussionId: string) => void;
  // Challenges
  challenges: Challenge[];
  joinChallenge: (challengeId: string) => void;
  logChallengeProgress: (challengeId: string) => void;
  createChallenge: (data: Partial<Challenge>) => void;
  cheerParticipant: (challengeId: string, targetUserId: string) => void;
  isCreateChallengeOpen: boolean;
  setIsCreateChallengeOpen: (open: boolean) => void;
  // Messaging
  sendMessage: (
    conversationId: string,
    text: string,
    options?: {
      replyTo?: { id: string; text: string; senderName: string };
      isVoice?: boolean;
      voiceDurationSeconds?: number;
      mediaUrl?: string;
      mediaType?: 'image' | 'video' | 'file';
      fileName?: string;
    }
  ) => void;
  hideConversation: (conversationId: string) => void;
  replyToMessage: (conversationId: string, replyTo: { id: string; text: string; senderName: string }, text: string) => void;
  reactToMessage: (conversationId: string, messageId: string, emoji: string) => void;
  sendVoiceMessage: (
    conversationId: string,
    durationSeconds?: number,
    replyTo?: { id: string; text: string; senderName: string }
  ) => void;
  sendMediaMessage: (
    conversationId: string,
    mediaUrl: string,
    mediaType: 'image' | 'video' | 'file',
    caption?: string,
    fileName?: string,
    replyTo?: { id: string; text: string; senderName: string }
  ) => void;
  triggerTypingIndicator: (conversationId: string, isTyping: boolean) => void;
  markConversationAsRead: (conversationId: string) => void;
  markRecipientSeen: (conversationId: string) => void;
  toggleRecipientInChat: (conversationId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  handleConnectionRequest: (notifId: string, action: 'accept' | 'decline') => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  // Security Suite & Passcode Protection
  isSecurityModalOpen: boolean;
  setIsSecurityModalOpen: (open: boolean) => void;
  isBehindTheScenesOpen: boolean;
  setIsBehindTheScenesOpen: (open: boolean) => void;
  chatPasscode: string | null;
  setChatPasscode: (pin: string | null) => void;
  isChatLocked: boolean;
  setIsChatLocked: (locked: boolean) => void;
  unlockChat: (pin: string) => boolean;
  failedLoginAttempts: number;
  lockoutUntil: number | null;
  failedLoginsAlert: boolean;
  recordFailedLogin: () => void;
  resetFailedLogins: () => void;
  auditLogs: SecurityAuditLog[];
  addAuditLog: (action: string, details?: string, status?: 'success' | 'warning' | 'error') => void;
  exportGDPRData: () => void;
  deleteAccountPermanently: () => void;
  changePassword: (oldPw: string, newPw: string) => boolean;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (val: boolean) => void;
  privateMediaSignedUrlsEnabled: boolean;
  setPrivateMediaSignedUrlsEnabled: (val: boolean) => void;
  isFollowersPrivate: boolean;
  toggleFollowersPrivacy: () => void;
  updateInterests: (interests: string[]) => void;
  // Settings & Privacy
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isAccountPrivate: boolean;
  toggleAccountPrivacy: () => void;
  showReadReceipts: boolean;
  setShowReadReceipts: (val: boolean) => void;
  showOnlineStatus: boolean;
  setShowOnlineStatus: (val: boolean) => void;
  blockedUsers: string[];
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  exportUserData: () => void;
  signOutAccount: () => void;
  // Offline & Feed Caching
  isOffline: boolean;
  isSimulatedOffline: boolean;
  toggleSimulatedOffline: () => void;
  feedCacheTimestamp: number;
  refreshFeed: () => Promise<void>;
  isFeedRefreshing: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  userProfiles: Record<string, UserProfile>;
  hasAgreedToTerms: boolean;
  termsAgreedTimestamp: number | null;
  agreeToTermsAndContinue: () => void;
  isLegalModalOpen: boolean;
  activeLegalDoc: LegalDocType;
  openLegalModal: (doc?: LegalDocType) => void;
  closeLegalModal: () => void;
  isCreateAccountModalOpen: boolean;
  setIsCreateAccountModalOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  authModalMode: 'signup' | 'login';
  setAuthModalMode: (mode: 'signup' | 'login') => void;
  openAuthModal: (mode?: 'signup' | 'login') => void;
  continueAsGuest: () => void;
  createAccount: (data: NewAccountRegistration) => Promise<{ success: boolean; error?: string }> | { success: boolean; error?: string };
  switchAccount: (userId: string) => void;
  loginWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  // 3-Bar Profile Settings & Navigation
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: (open: boolean) => void;
  // Community Enhancements
  reportCommunity: (communityId: string, reason: string) => void;
  toggleHideCommunity: (communityId: string) => void;
  pinDiscussion: (discussionId: string) => void;
  // Group Chat & Secret Hiding
  createGroupChat: (name: string, isPublic: boolean, memberIds: string[], avatar?: string) => void;
  toggleHideChat: (conversationId: string) => void;
  chatSecretCode: string;
  setChatSecretCode: (code: string) => void;
  // Profile, Post, Story & Highlight Privacy & Archives
  archivePost: (postId: string) => void;
  unarchivePost: (postId: string) => void;
  toggleHidePostFromGrid: (postId: string) => void;
  archiveStory: (storyId: string) => void;
  unarchiveStory: (storyId: string) => void;
  deleteStory: (storyId: string) => void;
  addStoryComment: (storyId: string, text: string, parentId?: string) => void;
  updatePostEmojiSettings: (postId: string, allowedEmojis?: string[], restrictedEmojis?: string[]) => void;
  deleteComment: (postId: string, commentId: string) => void;
  archiveHighlight: (highlightId: string) => void;
  unarchiveHighlight: (highlightId: string) => void;
  toggleHideFollower: (userId: string, type: 'follower' | 'following') => void;
  updateSecondaryAvatar: (avatarUrl: string, visibility: 'everyone' | 'followers' | 'close_friends') => void;
  createStoryWithDuration: (mediaUrl: string, caption?: string, durationHours?: number, audience?: 'everyone' | 'close_friends') => void;
  // One-way Profile Concealment
  hiddenProfileFromUserIds: string[];
  toggleHideMyProfileFrom: (userId: string) => void;
  isProfileHiddenFromUser: (userId: string) => boolean;
  // Supabase Auth & Session State
  supabaseSession: Session | null;
  isSupabaseConfigured: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LEGACY_STORAGE_KEY = 'instagram_app_state_v1';
const LOCAL_STORAGE_KEY = 'yaawp_app_state_v1';
export const FEED_OFFLINE_CACHE_KEY = 'yaawp_feed_offline_cache_v2';
export const FEED_OFFLINE_META_KEY = 'yaawp_feed_offline_meta_v2';

const getStoredStateItem = (subKey: string): string | null => {
  try {
    const directVal = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${subKey}`);
    if (directVal !== null) return directVal;
    const legacyVal = localStorage.getItem(`${LEGACY_STORAGE_KEY}_${subKey}`);
    if (legacyVal !== null) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_${subKey}`, legacyVal);
      return legacyVal;
    }
  } catch {}
  return null;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Supabase session state
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);

  // Initialize Supabase session check on load
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;

    // Check active session on load
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!isMounted) return;
      if (error) {
        console.warn('Supabase getSession error:', error.message);
        return;
      }
      if (session) {
        setSupabaseSession(session);
        if (session.user) {
          setCurrentUser(prev => ({
            ...prev,
            id: session.user.id || prev.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || prev.name,
            username: session.user.user_metadata?.username || (session.user.email ? session.user.email.split('@')[0] : prev.username),
            avatar: session.user.user_metadata?.avatar_url || prev.avatar
          }));
        }
      }
    });

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setSupabaseSession(session);
      if (session?.user) {
        setCurrentUser(prev => ({
          ...prev,
          id: session.user.id || prev.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || prev.name,
          username: session.user.user_metadata?.username || (session.user.email ? session.user.email.split('@')[0] : prev.username),
          avatar: session.user.user_metadata?.avatar_url || prev.avatar
        }));
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch posts from Supabase database & attach Realtime listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabaseSession) return;

    let isMounted = true;

    const loadPostsFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase posts fetch notice:', error.message);
          return;
        }

        if (data && isMounted && data.length > 0) {
          const mappedPosts: Post[] = data.map((row: any) => ({
            id: row.id,
            user: {
              id: row.user_id,
              username: currentUser.username,
              name: currentUser.name,
              avatar: currentUser.avatar,
              isVerified: currentUser.isVerified
            },
            mediaUrls: [row.media_url],
            caption: row.caption || '',
            location: row.location || undefined,
            tags: row.tags || [],
            timestamp: new Date(row.created_at).toLocaleDateString(),
            createdAt: new Date(row.created_at).getTime(),
            likesCount: 0,
            isLiked: false,
            isSaved: false,
            filterClass: row.filter_class || 'filter-normal',
            comments: [],
            allowsRepost: true,
            audience: (row.audience as Post['audience']) || 'everyone',
            score: 0,
            upvotes: 0,
            downvotes: 0
          }));

          setPosts(prev => {
            const supabaseIds = new Set(mappedPosts.map(p => p.id));
            const existingNonSupabase = prev.filter(p => !supabaseIds.has(p.id));
            return [...mappedPosts, ...existingNonSupabase];
          });
        }
      } catch (err) {
        console.warn('Error loading posts from Supabase:', err);
      }
    };

    loadPostsFromSupabase();

    // Supabase Realtime channel for public.posts table
    const postsChannel = supabase
      .channel('realtime-posts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newRow = payload.new as any;
            setPosts(prev => {
              if (prev.some(p => p.id === newRow.id)) return prev;
              const newP: Post = {
                id: newRow.id,
                user: {
                  id: newRow.user_id,
                  username: currentUser.username,
                  name: currentUser.name,
                  avatar: currentUser.avatar,
                  isVerified: currentUser.isVerified
                },
                mediaUrls: [newRow.media_url],
                caption: newRow.caption || '',
                location: newRow.location || undefined,
                tags: newRow.tags || [],
                timestamp: 'JUST NOW',
                createdAt: new Date(newRow.created_at || Date.now()).getTime(),
                likesCount: 0,
                isLiked: false,
                isSaved: false,
                filterClass: newRow.filter_class || 'filter-normal',
                comments: [],
                allowsRepost: true,
                audience: (newRow.audience as Post['audience']) || 'everyone',
                score: 0,
                upvotes: 0,
                downvotes: 0
              };
              return [newP, ...prev];
            });
            showToast('Realtime: New post synchronized!');
          } else if (payload.eventType === 'DELETE') {
            const oldRow = payload.old as any;
            if (oldRow?.id) {
              setPosts(prev => prev.filter(p => p.id !== oldRow.id));
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedRow = payload.new as any;
            if (updatedRow?.id) {
              setPosts(prev =>
                prev.map(p =>
                  p.id === updatedRow.id
                    ? {
                        ...p,
                        caption: updatedRow.caption ?? p.caption,
                        tags: updatedRow.tags ?? p.tags,
                        location: updatedRow.location ?? p.location
                      }
                    : p
                )
              );
            }
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(postsChannel);
    };
  }, [supabaseSession, isSupabaseConfigured]);

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('yaawp_theme') || localStorage.getItem('instagram_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'dark';
  });

  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = getStoredStateItem('user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  // Profiles cache for all platform users
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>(() => {
    const saved = getStoredStateItem('profiles');
    return saved ? JSON.parse(saved) : USER_PROFILES;
  });

  // Followed users list
  const [followedUserIds, setFollowedUserIds] = useState<string[]>(() => {
    const saved = getStoredStateItem('followed');
    if (saved) return JSON.parse(saved);
    return Object.values(USERS).filter(u => u.isFollowing).map(u => u.id);
  });

  // Feed algorithm settings
  const [feedMode, setFeedMode] = useState<FeedFilterMode>(() => {
    const saved = getStoredStateItem('feed_mode');
    return (saved === 'all' || saved === 'following') ? saved : 'following';
  });

  const [feedSort, setFeedSort] = useState<FeedSortAlgorithm>(() => {
    const saved = getStoredStateItem('feed_sort');
    return (saved === 'engagement' || saved === 'balanced' || saved === 'chronological') ? saved : 'chronological';
  });

  // Currently viewed user profile (defaults to currentUser)
  const [viewedUserId, setViewedUserId] = useState<string>(currentUser.id);

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const offlineCached = localStorage.getItem(FEED_OFFLINE_CACHE_KEY) || localStorage.getItem('lumina_feed_offline_cache_v2');
      if (offlineCached) {
        const parsed = JSON.parse(offlineCached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      const saved = getStoredStateItem('posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // safe fallback on parse error
    }
    return INITIAL_POSTS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = getStoredStateItem('stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [reels, setReels] = useState<Reel[]>(() => {
    const saved = getStoredStateItem('reels');
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });

  const TWENTY_DAYS_MS = 20 * 24 * 60 * 60 * 1000;

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const isNotificationOlderThan20Days = (n: NotificationItem) => {
      if (n.createdAt) {
        return Date.now() - n.createdAt > TWENTY_DAYS_MS;
      }
      const dayMatch = n.timestamp.match(/(\d+)\s*d\s*ago/i);
      if (dayMatch && parseInt(dayMatch[1], 10) > 20) {
        return true;
      }
      return false;
    };

    const saved = getStoredStateItem('notifications');
    const raw: NotificationItem[] = saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    // Auto-delete notifications older than 20 days
    return raw
      .filter(n => !isNotificationOlderThan20Days(n))
      .map(n => ({
        ...n,
        createdAt: n.createdAt || Date.now() - (n.timestamp.includes('1h') ? 3600000 : n.timestamp.includes('2h') ? 7200000 : 86400000)
      }));
  });

  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    const saved = getStoredStateItem('conversations');
    if (saved) {
      try {
        const parsed: ChatConversation[] = JSON.parse(saved);
        const enriched = parsed.map(c => ({
          ...c,
          messages: c.messages.map(m => {
            if (m.senderId === CURRENT_USER.id && !m.status) {
              return { ...m, status: 'seen' as const, seenAt: m.timestamp };
            }
            return m;
          })
        }));
        const existingIds = new Set(enriched.map(c => c.id));
        const missing = INITIAL_CONVERSATIONS.filter(c => !existingIds.has(c.id));
        return [...enriched, ...missing];
      } catch {
        // fallback to INITIAL_CONVERSATIONS
      }
    }
    return INITIAL_CONVERSATIONS;
  });

  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || 'conv_1');
  const [activeStoryUserIndex, setActiveStoryUserIndex] = useState<number | null>(null);
  const [selectedPostForModal, setSelectedPostForModal] = useState<Post | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Yaawp Legal & Privacy state
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean>(() => {
    return (
      localStorage.getItem('yaawp_terms_agreed_v1') === 'true' ||
      localStorage.getItem('instagram_terms_agreed_v1') === 'true'
    );
  });
  const [termsAgreedTimestamp, setTermsAgreedTimestamp] = useState<number | null>(() => {
    const saved =
      localStorage.getItem('yaawp_terms_agreed_time') ||
      localStorage.getItem('instagram_terms_agreed_time');
    return saved ? Number(saved) : null;
  });
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>('terms');
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState<boolean>(false);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('yaawp_authenticated');
    return saved === 'true';
  });
  const [authModalMode, setAuthModalMode] = useState<'signup' | 'login'>('signup');

  const openAuthModal = (mode: 'signup' | 'login' = 'signup') => {
    setAuthModalMode(mode);
    setIsCreateAccountModalOpen(true);
  };

  const continueAsGuest = () => {
    setIsAuthenticated(true);
    localStorage.setItem('yaawp_authenticated', 'true');
    showToast('Welcome to YAAWP!');
  };

  // Communities, Discussions, Challenges State
  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = getStoredStateItem('communities');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITIES;
  });
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState<boolean>(false);

  const [discussions, setDiscussions] = useState<Discussion[]>(() => {
    const saved = getStoredStateItem('discussions');
    return saved ? JSON.parse(saved) : INITIAL_DISCUSSIONS;
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = getStoredStateItem('challenges');
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });
  const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState<boolean>(false);

  // Settings & Privacy State
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [chatSecretCode, setChatSecretCodeState] = useState<string>(() => {
    return localStorage.getItem('lumina_chat_secret_code') || '1234';
  });
  const setChatSecretCode = (code: string) => {
    setChatSecretCodeState(code);
    localStorage.setItem('lumina_chat_secret_code', code);
    showToast('Secret lock code updated successfully!');
  };
  const [isAccountPrivate, setIsAccountPrivate] = useState<boolean>(() => {
    return getStoredStateItem('account_private') === 'true';
  });
  const [showReadReceipts, setShowReadReceipts] = useState<boolean>(() => {
    const saved = getStoredStateItem('read_receipts');
    return saved !== null ? saved === 'true' : true;
  });
  const [showOnlineStatus, setShowOnlineStatus] = useState<boolean>(() => {
    const saved = getStoredStateItem('online_status');
    return saved !== null ? saved === 'true' : true;
  });
  const [blockedUsers, setBlockedUsers] = useState<string[]>(() => {
    const saved = getStoredStateItem('blocked_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [hiddenProfileFromUserIds, setHiddenProfileFromUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('lumina_hidden_profile_from_users');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleHideMyProfileFrom = (userId: string) => {
    setHiddenProfileFromUserIds(prev => {
      const exists = prev.includes(userId);
      const next = exists ? prev.filter(id => id !== userId) : [...prev, userId];
      try {
        localStorage.setItem('lumina_hidden_profile_from_users', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save hiddenProfileFromUserIds', err);
      }
      const targetUser = allUsers.find(u => u.id === userId);
      const name = targetUser ? `@${targetUser.username}` : 'user';
      showToast(exists ? `Your profile is now visible to ${name}` : `Your profile is now hidden from ${name}`);
      return next;
    });
  };

  const isProfileHiddenFromUser = (userId: string) => {
    return hiddenProfileFromUserIds.includes(userId);
  };

  // Security Suite & Passcode Protection State
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [isBehindTheScenesOpen, setIsBehindTheScenesOpen] = useState<boolean>(false);
  const [chatPasscode, setChatPasscodeState] = useState<string | null>(() => {
    return localStorage.getItem('lumina_chat_passcode') || null;
  });
  const [isChatLocked, setIsChatLocked] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('lumina_chat_passcode'));
  });
  const [failedLoginAttempts, setFailedLoginAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [failedLoginsAlert, setFailedLoginsAlert] = useState<boolean>(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(() => {
    return localStorage.getItem('lumina_2fa_enabled') === 'true';
  });
  const [privateMediaSignedUrlsEnabled, setPrivateMediaSignedUrlsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('lumina_signed_urls') !== 'false';
  });
  const [isFollowersPrivate, setIsFollowersPrivate] = useState<boolean>(() => {
    return localStorage.getItem('lumina_followers_private') === 'true';
  });

  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([
    {
      id: 'log_1',
      action: 'Session Authentication & Key Exchange',
      actor: '@' + currentUser.username,
      ipAddress: '192.168.1.104',
      userAgent: 'Chrome 128 / macOS Sequoia',
      timestamp: '2 mins ago',
      status: 'success',
      details: 'JWT session verified via Supabase Auth (HS256 verified signature)'
    },
    {
      id: 'log_2',
      action: 'RLS Query: Direct Messages Ingress',
      actor: '@' + currentUser.username,
      ipAddress: '192.168.1.104',
      userAgent: 'Client Applet',
      timestamp: '8 mins ago',
      status: 'success',
      details: 'Checked policy: auth.uid() = participant_id on table "chat_messages"'
    },
    {
      id: 'log_3',
      action: 'Signed Storage URL Generated',
      actor: '@' + currentUser.username,
      ipAddress: '192.168.1.104',
      userAgent: 'Client Applet',
      timestamp: '25 mins ago',
      status: 'success',
      details: 'Generated 15-minute expiring token for private media asset'
    }
  ]);

  const [joinRequests, setJoinRequests] = useState<CommunityJoinRequest[]>([
    {
      id: 'req_1',
      communityId: 'comm_1',
      communityName: 'Street Photographers Club',
      user: {
        id: 'user_alex',
        username: 'alex_rivera',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80'
      },
      message: 'Excited to share 35mm film captures and join critiques!',
      requestedAt: '10m ago',
      status: 'pending'
    },
    {
      id: 'req_2',
      communityId: 'comm_2',
      communityName: 'Cinematic Visuals & Grading',
      user: {
        id: 'user_elena',
        username: 'elena_rostova',
        name: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80'
      },
      message: 'Looking to connect with fellow Davinci Resolve colorists.',
      requestedAt: '1h ago',
      status: 'pending'
    }
  ]);

  // Algorithmic Recommendation & Feed Controls State
  const [algorithmSettings, setAlgorithmSettings] = useState<AlgorithmSettings>(() => {
    const saved = localStorage.getItem('lumina_algorithm_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      mutedTopics: [],
      mutedCommunityIds: [],
      mutedUserIds: [],
      topicAffinities: {},
      separateFriendsFromDiscovery: false,
      stopStrangers: false
    };
  });

  // Custom Circles (Close Friends, Family, School, Gaming, Local, etc.)
  const [customCircles, setCustomCircles] = useState<CustomCircle[]>(() => {
    const saved = localStorage.getItem('lumina_custom_circles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_CIRCLES;
  });
  const [activeCustomCircleId, setActiveCustomCircleId] = useState<string | null>(null);

  // Spontaneous Meetups & Nearby Activities
  const [nearbyActivities, setNearbyActivities] = useState<NearbyActivity[]>(() => {
    const saved = localStorage.getItem('lumina_nearby_activities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_NEARBY_ACTIVITIES;
  });

  // Social Presence ("Currently" / Temporary Status)
  const [presenceStatus, setPresenceStatus] = useState<PresenceStatus>(() => {
    const saved = localStorage.getItem('lumina_presence_status');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      type: 'available',
      emoji: '🟢',
      label: 'Available',
      detail: 'Open to visual collaboration & chat',
      updatedAt: Date.now()
    };
  });

  // Community Personas (Contextual Name / Avatar per community)
  const [communityPersonas, setCommunityPersonas] = useState<Record<string, CommunityPersona>>(() => {
    const saved = localStorage.getItem('lumina_community_personas');
    return saved ? JSON.parse(saved) : {};
  });

  // Real-time Community Chat Messages
  const [communityChatMessages, setCommunityChatMessages] = useState<Record<string, CommunityChatMessage[]>>(() => {
    const saved = localStorage.getItem('lumina_community_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      'comm_film_ch_film_general': [
        {
          id: 'msg_f1',
          communityId: 'comm_film',
          channelId: 'ch_film_general',
          user: {
            id: 'user_elena',
            username: 'elena_art',
            name: 'Elena Rostova',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
            isVerified: true
          },
          text: 'Anyone experimenting with Rodinal stand development on Tri-X lately? The contrast curve at 1:100 is pure magic.',
          createdAt: Date.now() - 3600000,
          reactions: { '🔥': ['user_current', 'user_kai'], '📷': ['user_david'] }
        },
        {
          id: 'msg_f2',
          communityId: 'comm_film',
          channelId: 'ch_film_general',
          user: {
            id: 'user_david',
            username: 'david_urban',
            name: 'David Chen',
            avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80'
          },
          text: 'I pushed HP5 to 1600 last weekend in Tokyo rain. Grain is noticeable but highlights held up beautifully!',
          createdAt: Date.now() - 1800000,
          reactions: { '❤️': ['user_elena'] }
        }
      ]
    };
  });

  // Offline & Feed Caching Layer
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const isOffline = !isOnline || isSimulatedOffline;

  const [feedCacheTimestamp, setFeedCacheTimestamp] = useState<number>(() => {
    try {
      const meta = localStorage.getItem(FEED_OFFLINE_META_KEY);
      return meta ? JSON.parse(meta).cachedAt : Date.now();
    } catch {
      return Date.now();
    }
  });

  const [isFeedRefreshing, setIsFeedRefreshing] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Connection restored • Feed synced online');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Offline Mode active • Feed loaded from local cache');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline(prev => {
      const next = !prev;
      showToast(next ? 'Offline Mode enabled: Viewing locally cached feed' : 'Online Mode restored: Live network sync');
      return next;
    });
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('yaawp_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_profiles`, JSON.stringify(userProfiles));
  }, [userProfiles]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_followed`, JSON.stringify(followedUserIds));
  }, [followedUserIds]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_feed_mode`, feedMode);
  }, [feedMode]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_feed_sort`, feedSort);
  }, [feedSort]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_communities`, JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_discussions`, JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_challenges`, JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_account_private`, String(isAccountPrivate));
  }, [isAccountPrivate]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_read_receipts`, String(showReadReceipts));
  }, [showReadReceipts]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_online_status`, String(showOnlineStatus));
  }, [showOnlineStatus]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_blocked_users`, JSON.stringify(blockedUsers));
  }, [blockedUsers]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_posts`, JSON.stringify(posts));
      localStorage.setItem(FEED_OFFLINE_CACHE_KEY, JSON.stringify(posts));
      const now = Date.now();
      setFeedCacheTimestamp(now);
      localStorage.setItem(FEED_OFFLINE_META_KEY, JSON.stringify({
        cachedAt: now,
        count: posts.length
      }));
    } catch {
      // Safe fallback on quota error
    }
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_stories`, JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_reels`, JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_conversations`, JSON.stringify(conversations));
  }, [conversations]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // All platform users list for search and discovery
  const allUsers = useMemo<UserSummary[]>(() => {
    const list: UserSummary[] = [
      {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        avatar: currentUser.avatar,
        isVerified: currentUser.isVerified,
        bioSnippet: currentUser.bio.split('\n')[0]
      }
    ];

    Object.values(USERS).forEach(u => {
      list.push({
        ...u,
        isFollowing: followedUserIds.includes(u.id)
      });
    });

    return list;
  }, [currentUser, followedUserIds]);

  // Feed Algorithm: comprehensive multi-feed filtering and weighted affinity scoring
  const feedPosts = useMemo(() => {
    let filtered = posts;

    // 0. Exclude blocked users across all feeds
    if (blockedUsers.length > 0) {
      filtered = filtered.filter(p => !blockedUsers.includes(p.user.id));
    }

    // 1. Filter by feedMode
    if (feedMode === 'following') {
      // Strictly creator subscriptions: followed users + current user
      filtered = filtered.filter(
        p => followedUserIds.includes(p.user.id) || p.user.id === currentUser.id
      );
    } else if (feedMode === 'for_you') {
      // Algorithmic discovery with user control
      filtered = filtered.filter(p => {
        // Exclude muted creators
        if (algorithmSettings.mutedUserIds.includes(p.user.id)) return false;

        // Exclude muted communities
        if (p.communityId && algorithmSettings.mutedCommunityIds.includes(p.communityId)) return false;

        // Exclude muted keywords/topics
        if (
          p.tags &&
          p.tags.some(tag =>
            algorithmSettings.mutedTopics
              .map(t => t.toLowerCase().replace('#', ''))
              .includes(tag.toLowerCase().replace('#', ''))
          )
        ) {
          return false;
        }

        // Stop seeing recommended strangers?
        if (algorithmSettings.stopStrangers) {
          const isFollowed = followedUserIds.includes(p.user.id) || p.user.id === currentUser.id;
          if (!isFollowed) return false;
        }

        return true;
      });
    } else if (feedMode === 'communities') {
      // Only posts tied to joined communities
      const joinedIds = communities.filter(c => c.isJoined).map(c => c.id);
      filtered = filtered.filter(p => p.communityId && joinedIds.includes(p.communityId));
    } else if (feedMode === 'nearby') {
      // Local/nearby posts with location or tagged #local / #meetup
      filtered = filtered.filter(
        p =>
          Boolean(p.location) ||
          p.tags.some(t =>
            t.toLowerCase().includes('local') ||
            t.toLowerCase().includes('meetup') ||
            t.toLowerCase().includes('walk')
          )
      );
    } else if (feedMode === 'my_posts') {
      filtered = filtered.filter(p => p.user.id === currentUser.id);
    } else if (feedMode === 'custom_list') {
      if (activeCustomCircleId) {
        const circle = customCircles.find(c => c.id === activeCustomCircleId);
        if (circle) {
          filtered = filtered.filter(
            p => circle.userIds.includes(p.user.id) || p.user.id === currentUser.id
          );
        }
      }
    }

    // 2. Sorting and Ranking Algorithm
    const sorted = [...filtered].sort((a, b) => {
      const aTime = a.createdAt || Date.now() - 3600000;
      const bTime = b.createdAt || Date.now() - 3600000;

      // Chronological: Pure recency (latest first)
      if (feedSort === 'chronological') {
        return bTime - aTime;
      }

      // Calculate Topic Affinity Boost
      let aAffinityBoost = 0;
      let bAffinityBoost = 0;
      Object.entries(algorithmSettings.topicAffinities || {}).forEach(([topic, weightVal]) => {
        const weight = Number(weightVal) || 0;
        const cleanTopic = topic.toLowerCase().replace('#', '');
        if (a.tags.some(t => t.toLowerCase().includes(cleanTopic))) aAffinityBoost += weight * 8;
        if (b.tags.some(t => t.toLowerCase().includes(cleanTopic))) bAffinityBoost += weight * 8;
      });

      // Engagement: Prioritize content by interactions (likes + comments + saves)
      if (feedSort === 'engagement') {
        const aScore = a.likesCount * 2 + a.comments.length * 4 + (a.isSaved ? 10 : 0) + aAffinityBoost;
        const bScore = b.likesCount * 2 + b.comments.length * 4 + (b.isSaved ? 10 : 0) + bAffinityBoost;
        return bScore - aScore;
      }

      // Trending: Velocity over time
      if (feedSort === 'trending') {
        const now = Date.now();
        const aHours = Math.max(0.2, (now - aTime) / (3600 * 1000));
        const bHours = Math.max(0.2, (now - bTime) / (3600 * 1000));
        const aVelocity =
          (a.likesCount * 2 + a.comments.length * 3 + aAffinityBoost) / Math.pow(aHours, 1.4);
        const bVelocity =
          (b.likesCount * 2 + b.comments.length * 3 + bAffinityBoost) / Math.pow(bHours, 1.4);
        return bVelocity - aVelocity;
      }

      // Balanced (Default): Engagement decayed over time + topic affinity
      const now = Date.now();
      const aHours = Math.max(0.5, (now - aTime) / (3600 * 1000));
      const bHours = Math.max(0.5, (now - bTime) / (3600 * 1000));

      const aEng = a.likesCount * 1.5 + a.comments.length * 3 + (a.isSaved ? 8 : 0) + aAffinityBoost;
      const bEng = b.likesCount * 1.5 + b.comments.length * 3 + (b.isSaved ? 8 : 0) + bAffinityBoost;

      const aScore = aEng / Math.pow(aHours + 2, 1.15);
      const bScore = bEng / Math.pow(bHours + 2, 1.15);

      return bScore - aScore;
    });

    return sorted;
  }, [
    posts,
    followedUserIds,
    currentUser.id,
    feedMode,
    feedSort,
    blockedUsers,
    algorithmSettings,
    communities,
    activeCustomCircleId,
    customCircles
  ]);

  // Open any user's unique profile page
  const openUserProfile = (userId: string) => {
    setViewedUserId(userId);
    setActiveTab('profile');
  };

  // Retrieve user profile for any user
  const getUserProfile = (userId: string): UserProfile => {
    if (userId === currentUser.id) {
      return currentUser;
    }
    const profile = userProfiles[userId];
    if (profile) {
      return {
        ...profile,
        isFollowing: followedUserIds.includes(userId)
      };
    }
    const fallbackUser = Object.values(USERS).find(u => u.id === userId);
    return {
      id: userId,
      username: fallbackUser?.username || 'user',
      name: fallbackUser?.name || 'User',
      avatar: fallbackUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
      isVerified: fallbackUser?.isVerified || false,
      isFollowing: followedUserIds.includes(userId),
      bio: fallbackUser?.bioSnippet || 'Lumina creator sharing visual moments ✨',
      followersCount: 1200,
      followingCount: 340,
      postsCount: posts.filter(p => p.user.id === userId).length,
      highlights: []
    };
  };

  // Direct Messaging: Start conversation with any user
  const startConversationWithUser = (user: UserSummary) => {
    const existing = conversations.find(c => c.participant.id === user.id);
    if (existing) {
      setActiveConvId(existing.id);
    } else {
      const newConv: ChatConversation = {
        id: `conv_${user.id}_${Date.now()}`,
        participant: user,
        lastMessage: 'Conversation started',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        isOnline: true,
        messages: [
          {
            id: `msg_hello_${Date.now()}`,
            senderId: user.id,
            text: `Hey @${currentUser.username}! Great to connect with you 👋`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConvId(newConv.id);
    }
    setActiveTab('messages');
  };

  const toggleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const wasLiked = p.isLiked;
          return {
            ...p,
            isLiked: !wasLiked,
            likesCount: wasLiked ? p.likesCount - 1 : p.likesCount + 1
          };
        }
        return p;
      })
    );
  };

  const toggleSavePost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const nextSaved = !p.isSaved;
          showToast(nextSaved ? 'Saved to collection' : 'Removed from collection');
          return {
            ...p,
            isSaved: nextSaved
          };
        }
        return p;
      })
    );
  };

  const votePost = (postId: string, type: 'up' | 'down') => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const currentVote = p.userVote;
          let newVote: 'up' | 'down' | undefined;
          let scoreDiff = 0;
          let upDiff = 0;
          let downDiff = 0;

          if (currentVote === type) {
            // Cancel vote
            newVote = undefined;
            if (type === 'up') {
              scoreDiff = -1;
              upDiff = -1;
            } else {
              scoreDiff = 1;
              downDiff = -1;
            }
          } else if (currentVote) {
            // Flip vote
            newVote = type;
            if (type === 'up') {
              scoreDiff = 2;
              upDiff = 1;
              downDiff = -1;
            } else {
              scoreDiff = -2;
              upDiff = -1;
              downDiff = 1;
            }
          } else {
            // New vote
            newVote = type;
            if (type === 'up') {
              scoreDiff = 1;
              upDiff = 1;
            } else {
              scoreDiff = -1;
              downDiff = 1;
            }
          }

          const currentScore = p.score ?? p.likesCount;
          const currentUps = p.upvotes ?? p.likesCount;
          const currentDowns = p.downvotes ?? 0;

          return {
            ...p,
            userVote: newVote,
            score: currentScore + scoreDiff,
            upvotes: Math.max(0, currentUps + upDiff),
            downvotes: Math.max(0, currentDowns + downDiff),
            // Sync likesCount with upvotes for compatibility
            likesCount: Math.max(0, currentUps + upDiff),
            isLiked: newVote === 'up'
          };
        }
        return p;
      })
    );
  };

  const repostPost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.allowsRepost === false) {
      showToast('The creator has disabled reposting for this post.');
      return;
    }

    const wasReposted = post.isReposted;
    const newRepostCount = (post.repostsCount || 0) + (wasReposted ? -1 : 1);

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isReposted: !wasReposted,
            repostsCount: Math.max(0, newRepostCount)
          };
        }
        return p;
      })
    );

    if (!wasReposted) {
      // Create a repost in feed
      const repostEntry: Post = {
        id: `repost_${Date.now()}`,
        user: {
          id: currentUser.id,
          username: currentUser.username,
          name: currentUser.name,
          avatar: currentUser.avatar,
          isVerified: currentUser.isVerified
        },
        repostedBy: {
          id: currentUser.id,
          username: currentUser.username,
          name: currentUser.name,
          avatar: currentUser.avatar
        },
        mediaUrls: post.mediaUrls,
        caption: '',
        timestamp: 'JUST NOW',
        createdAt: Date.now(),
        likesCount: 0,
        isLiked: false,
        isSaved: false,
        comments: [],
        isReposted: true,
        originalPostId: post.id,
        quotePost: post
      };
      setPosts(prev => [repostEntry, ...prev]);
      showToast(`Reposted @${post.user.username}'s post to your feed`);
    } else {
      // Remove previous repost entry
      setPosts(prev => prev.filter(p => !(p.originalPostId === postId && p.user.id === currentUser.id)));
      showToast('Removed repost');
    }
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    if (selectedPostForModal && selectedPostForModal.id === postId) {
      setSelectedPostForModal(null);
    }
    setCurrentUser(prev => ({
      ...prev,
      postsCount: Math.max(0, prev.postsCount - 1)
    }));

    if (isSupabaseConfigured && supabaseSession?.user?.id) {
      supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', supabaseSession.user.id)
        .then(({ error }) => {
          if (error) console.warn('Supabase post delete notice:', error.message);
        });
    }

    showToast('Post deleted.');
  };

  const editPost = (postId: string, newCaption: string) => {
    const updatedTags = newCaption.match(/#[a-zA-Z0-9_]+/g) || [];
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            caption: newCaption,
            tags: updatedTags
          };
        }
        return p;
      })
    );
    if (selectedPostForModal && selectedPostForModal.id === postId) {
      setSelectedPostForModal(prev => (prev ? { ...prev, caption: newCaption, tags: updatedTags } : null));
    }

    if (isSupabaseConfigured && supabaseSession?.user?.id) {
      supabase
        .from('posts')
        .update({ caption: newCaption, tags: updatedTags })
        .eq('id', postId)
        .eq('user_id', supabaseSession.user.id)
        .then(({ error }) => {
          if (error) console.warn('Supabase post edit notice:', error.message);
        });
    }

    showToast('Post updated.');
  };

  const reportPost = (postId: string, reason: string) => {
    showToast(`Report received ("${reason}"). Our moderation team will review this.`);
  };

  const addComment = (postId: string, text: string, parentId?: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      postId,
      parentId,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      text: text.trim(),
      timestamp: 'Just now',
      likesCount: 0,
      isLiked: false,
      score: 0,
      replies: []
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          if (parentId) {
            // Append to parent comment's replies
            const updateReplies = (comments: Comment[]): Comment[] => {
              return comments.map(c => {
                if (c.id === parentId) {
                  return {
                    ...c,
                    replies: [...(c.replies || []), newComment]
                  };
                }
                if (c.replies && c.replies.length > 0) {
                  return {
                    ...c,
                    replies: updateReplies(c.replies)
                  };
                }
                return c;
              });
            };
            return {
              ...p,
              comments: updateReplies(p.comments)
            };
          }
          return {
            ...p,
            comments: [...p.comments, newComment]
          };
        }
        return p;
      })
    );

    // Also update selectedPostForModal if open
    if (selectedPostForModal && selectedPostForModal.id === postId) {
      setSelectedPostForModal(prev => {
        if (!prev) return null;
        if (parentId) {
          const updateReplies = (comments: Comment[]): Comment[] => {
            return comments.map(c => {
              if (c.id === parentId) {
                return {
                  ...c,
                  replies: [...(c.replies || []), newComment]
                };
              }
              if (c.replies && c.replies.length > 0) {
                return {
                  ...c,
                  replies: updateReplies(c.replies)
                };
              }
              return c;
            });
          };
          return {
            ...prev,
            comments: updateReplies(prev.comments)
          };
        }
        return {
          ...prev,
          comments: [...prev.comments, newComment]
        };
      });
    }
  };

  const likeComment = (postId: string, commentId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.map(c => {
              if (c.id === commentId) {
                const wasLiked = c.isLiked;
                return {
                  ...c,
                  isLiked: !wasLiked,
                  likesCount: wasLiked ? c.likesCount - 1 : c.likesCount + 1
                };
              }
              return c;
            })
          };
        }
        return p;
      })
    );
  };

  const voteComment = (postId: string, commentId: string, type: 'up' | 'down') => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.map(c => {
              if (c.id === commentId) {
                const currentVote = c.userVote;
                const newVote = currentVote === type ? undefined : type;
                const scoreDiff = newVote === 'up' ? 1 : newVote === 'down' ? -1 : currentVote === 'up' ? -1 : 1;
                return {
                  ...c,
                  userVote: newVote,
                  score: (c.score || 0) + scoreDiff
                };
              }
              return c;
            })
          };
        }
        return p;
      })
    );
  };

  const createPost = (data: {
    mediaUrls: string[];
    caption: string;
    location?: string;
    filterClass?: string;
    allowsRepost?: boolean;
    communityId?: string;
    audience?: Post['audience'];
    audienceCircleId?: string;
    allowedEmojis?: string[];
    restrictedEmojis?: string[];
  }) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        avatar: currentUser.avatar,
        isVerified: currentUser.isVerified
      },
      mediaUrls: data.mediaUrls,
      caption: data.caption,
      location: data.location || undefined,
      tags: data.caption.match(/#[a-zA-Z0-9_]+/g) || [],
      timestamp: 'JUST NOW',
      createdAt: Date.now(),
      likesCount: 0,
      isLiked: false,
      isSaved: false,
      filterClass: data.filterClass || 'filter-normal',
      comments: [],
      allowsRepost: data.allowsRepost !== undefined ? data.allowsRepost : true,
      communityId: data.communityId,
      audience: data.audience || 'everyone',
      audienceCircleId: data.audienceCircleId,
      allowedEmojis: data.allowedEmojis,
      restrictedEmojis: data.restrictedEmojis,
      score: 0,
      upvotes: 0,
      downvotes: 0
    };

    setPosts(prev => [newPost, ...prev]);
    setCurrentUser(prev => ({ ...prev, postsCount: prev.postsCount + 1 }));

    // Persist to Supabase when connected and authenticated
    if (isSupabaseConfigured && supabaseSession?.user?.id) {
      supabase
        .from('posts')
        .insert({
          user_id: supabaseSession.user.id,
          caption: data.caption,
          media_url: data.mediaUrls[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
          media_type: 'image',
          filter_class: data.filterClass || 'filter-normal',
          tags: data.caption.match(/#[a-zA-Z0-9_]+/g) || [],
          location: data.location || null,
          audience: data.audience || 'everyone'
        })
        .select()
        .single()
        .then(({ data: inserted, error }) => {
          if (error) {
            console.warn('Supabase post insert notice:', error.message);
          } else if (inserted) {
            // Synchronize the local post id with real Supabase row ID
            setPosts(prev => prev.map(p => (p.id === newPost.id ? { ...p, id: inserted.id } : p)));
          }
        });
    }

    // Confetti celebration!
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888']
      });
    } catch {
      // safe fallback
    }

    showToast('Your post was shared successfully!');
    setActiveTab('feed');
  };

  const createStory = (mediaUrl: string, caption?: string) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      mediaUrl,
      timestamp: 'Just now',
      seen: false,
      caption
    };

    setStories(prev => [newStory, ...prev.filter(s => s.user.id !== currentUser.id)]);
    showToast('Story added to your profile!');
  };

  const toggleLikeReel = (reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const wasLiked = r.isLiked;
          return {
            ...r,
            isLiked: !wasLiked,
            likesCount: wasLiked ? r.likesCount - 1 : r.likesCount + 1
          };
        }
        return r;
      })
    );
  };

  const toggleSaveReel = (reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const nextSaved = !r.isSaved;
          showToast(nextSaved ? 'Saved reel to collection' : 'Removed from collection');
          return {
            ...r,
            isSaved: nextSaved
          };
        }
        return r;
      })
    );
  };

  const toggleFollowUser = (userId: string) => {
    const isCurrentlyFollowing = followedUserIds.includes(userId);
    const nextFollowed = isCurrentlyFollowing
      ? followedUserIds.filter(id => id !== userId)
      : [...followedUserIds, userId];

    setFollowedUserIds(nextFollowed);

    // Update currentUser following count
    setCurrentUser(prev => ({
      ...prev,
      followingCount: isCurrentlyFollowing
        ? Math.max(0, prev.followingCount - 1)
        : prev.followingCount + 1
    }));

    // Update target profile followers count and status
    setUserProfiles(prev => {
      const existing = prev[userId];
      if (!existing) return prev;
      return {
        ...prev,
        [userId]: {
          ...existing,
          isFollowing: !isCurrentlyFollowing,
          followersCount: isCurrentlyFollowing
            ? Math.max(0, existing.followersCount - 1)
            : existing.followersCount + 1
        }
      };
    });

    const targetUser = Object.values(USERS).find(u => u.id === userId) || userProfiles[userId];
    const targetName = targetUser ? `@${targetUser.username}` : 'user';
    showToast(isCurrentlyFollowing ? `Unfollowed ${targetName}` : `Following ${targetName}`);
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const markRecipientSeen = (conversationId: string) => {
    const seenTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          const userMsgs = c.messages.filter(m => m.senderId === currentUser.id);
          const lastUserMsg = userMsgs[userMsgs.length - 1];
          return {
            ...c,
            isRecipientInChat: true,
            lastSeenByRecipient: lastUserMsg
              ? {
                  messageId: lastUserMsg.id,
                  timestamp: seenTime
                }
              : c.lastSeenByRecipient,
            messages: c.messages.map(m =>
              m.senderId === currentUser.id
                ? { ...m, status: 'seen', seenAt: m.seenAt || 'Just now' }
                : m
            )
          };
        }
        return c;
      })
    );
    const target = conversations.find(c => c.id === conversationId);
    if (target) {
      showToast(`${target.participant.name} opened the chat (Seen)`);
    }
  };

  const toggleRecipientInChat = (conversationId: string) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          const willBeInChat = !c.isRecipientInChat;
          const seenTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const userMsgs = c.messages.filter(m => m.senderId === currentUser.id);
          const lastUserMsg = userMsgs[userMsgs.length - 1];
          return {
            ...c,
            isRecipientInChat: willBeInChat,
            lastSeenByRecipient: willBeInChat && lastUserMsg
              ? { messageId: lastUserMsg.id, timestamp: seenTime }
              : c.lastSeenByRecipient,
            messages: willBeInChat
              ? c.messages.map(m =>
                  m.senderId === currentUser.id
                    ? { ...m, status: 'seen', seenAt: m.seenAt || 'Just now' }
                    : m
                )
              : c.messages
          };
        }
        return c;
      })
    );
  };

  const sendMessage = (
    conversationId: string,
    text: string,
    options?: {
      replyTo?: { id: string; text: string; senderName: string };
      isVoice?: boolean;
      voiceDurationSeconds?: number;
      mediaUrl?: string;
      mediaType?: 'image' | 'video' | 'file';
      fileName?: string;
    }
  ) => {
    if (!text.trim() && !options?.isVoice && !options?.mediaUrl) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsgId = `msg_${Date.now()}`;
    const displaySnippet = options?.isVoice
      ? `🎙️ Voice Note (${options.voiceDurationSeconds || 5}s)`
      : options?.mediaUrl
      ? (options.mediaType === 'image' ? '📷 Photo' : options.mediaType === 'video' ? '🎥 Video' : '📎 Attachment')
      : text.trim();

    const newMessage: ChatMessage = {
      id: newMsgId,
      senderId: currentUser.id,
      text: text.trim() || displaySnippet,
      timestamp: nowTime,
      status: 'sent',
      replyTo: options?.replyTo,
      isVoice: options?.isVoice,
      voiceDurationSeconds: options?.voiceDurationSeconds,
      mediaUrl: options?.mediaUrl,
      mediaType: options?.mediaType,
      fileName: options?.fileName
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: displaySnippet,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    // 1. Deliver message after 500ms
    setTimeout(() => {
      setConversations(prev =>
        prev.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: c.messages.map(m =>
                m.id === newMsgId && m.status === 'sent'
                  ? { ...m, status: 'delivered' }
                  : m
              )
            };
          }
          return c;
        })
      );
    }, 500);

    // 2. Simulated recipient opening conversation -> 'seen'
    const targetConv = conversations.find(c => c.id === conversationId);
    if (targetConv && targetConv.participant.id !== currentUser.id) {
      // Recipient opens conversation after ~1.4s
      setTimeout(() => {
        const seenTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setConversations(prev =>
          prev.map(c => {
            if (c.id === conversationId) {
              return {
                ...c,
                isRecipientInChat: true,
                lastSeenByRecipient: {
                  messageId: newMsgId,
                  timestamp: seenTime
                },
                messages: c.messages.map(m =>
                  m.id === newMsgId
                    ? { ...m, status: 'seen', seenAt: 'Just now' }
                    : m
                )
              };
            }
            return c;
          })
        );
      }, 1400);

      // 3. Recipient typing indicator starts
      setTimeout(() => {
        setConversations(prev =>
          prev.map(c => (c.id === conversationId ? { ...c, isTyping: true } : c))
        );
      }, 2200);

      // 4. Recipient replies and clears typing indicator
      setTimeout(() => {
        const replies = [
          "Hey Jatin! Thanks for reaching out, loved checking this out 🙌",
          "Totally agree with that! Let's definitely collaborate soon ✨",
          "Thanks for the message! Love the composition in your recent work 📸",
          "Awesome point! Let's keep in touch 😊",
          "Sounds perfect! Catch you soon on the next project ✨"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const autoReplyMessage: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          senderId: targetConv.participant.id,
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setConversations(prevConv =>
          prevConv.map(c => {
            if (c.id === conversationId) {
              return {
                ...c,
                isTyping: false,
                lastMessage: randomReply,
                lastMessageTime: 'Just now',
                messages: [...c.messages, autoReplyMessage]
              };
            }
            return c;
          })
        );
      }, 3600);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setCurrentUser(prev => {
      const updated = {
        ...prev,
        ...data
      };

      setUserProfiles(pMap => ({
        ...pMap,
        [prev.id]: updated
      }));

      return updated;
    });

    if (isSupabaseConfigured && supabaseSession?.user?.id) {
      supabase
        .from('profiles')
        .update({
          name: data.name,
          username: data.username,
          bio: data.bio,
          website: data.website,
          avatar: data.avatar
        })
        .eq('id', supabaseSession.user.id)
        .then(({ error }) => {
          if (error) console.warn('Supabase profile update notice:', error.message);
        });
    }

    // If avatar, name, or username changed, propagate to all posts and comments by currentUser
    if (data.avatar || data.name || data.username) {
      setPosts(prevPosts =>
        prevPosts.map(post => {
          let updatedPost = { ...post };
          if (post.user.id === currentUser.id) {
            updatedPost.user = {
              ...post.user,
              avatar: data.avatar || post.user.avatar,
              name: data.name || post.user.name,
              username: data.username || post.user.username
            };
          }
          updatedPost.comments = post.comments.map(comment => {
            if (comment.user.id === currentUser.id) {
              return {
                ...comment,
                user: {
                  ...comment.user,
                  avatar: data.avatar || comment.user.avatar,
                  name: data.name || comment.user.name,
                  username: data.username || comment.user.username
                }
              };
            }
            return comment;
          });
          return updatedPost;
        })
      );
    }

    showToast('Profile updated successfully!');
  };

  const openLegalModal = (doc: LegalDocType = 'terms') => {
    setActiveLegalDoc(doc);
    setIsLegalModalOpen(true);
  };

  const closeLegalModal = () => {
    setIsLegalModalOpen(false);
  };

  const agreeToTermsAndContinue = () => {
    const now = Date.now();
    setHasAgreedToTerms(true);
    setTermsAgreedTimestamp(now);
    localStorage.setItem('yaawp_terms_agreed_v1', 'true');
    localStorage.setItem('yaawp_terms_agreed_time', String(now));
    showToast('Yaawp Terms of Use and Privacy Policy accepted.');
  };

  const createAccount = async (data: NewAccountRegistration) => {
    if (!data.agreedToTerms || !data.agreedToPrivacy) {
      return {
        success: false,
        error: 'You must agree to the Yaawp Terms of Use and Privacy Policy to create an account.'
      };
    }

    // Age verification: 13+
    const birthDate = new Date(data.birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 13) {
      return {
        success: false,
        error: 'You must be at least 13 years old to create an account on Yaawp.'
      };
    }

    const cleanUsername = data.username.toLowerCase().trim();
    const existing = (Object.values(userProfiles) as UserProfile[]).find(
      (u: UserProfile) => u.username.toLowerCase() === cleanUsername
    );
    if (existing) {
      return {
        success: false,
        error: `The username @${cleanUsername} is already taken. Please choose another.`
      };
    }

    // Supabase Auth Integration
    let supabaseUserId: string | null = null;
    if (isSupabaseConfigured && data.contact.includes('@') && data.password) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.contact.trim(),
          password: data.password.trim(),
          options: {
            data: {
              username: cleanUsername,
              full_name: data.name.trim(),
              avatar_url: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80'
            }
          }
        });
        if (authError) {
          return {
            success: false,
            error: `Supabase Auth error: ${authError.message}`
          };
        }
        if (authData.user) {
          supabaseUserId = authData.user.id;
        }
      } catch (err: any) {
        console.warn('Supabase signUp error:', err);
      }
    }

    const newId = supabaseUserId || `user_${cleanUsername}_${Date.now().toString(36)}`;
    const newProfile: UserProfile = {
      id: newId,
      username: cleanUsername,
      name: data.name.trim(),
      email: data.contact.includes('@') ? data.contact.trim() : undefined,
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
      bio: 'New Yaawp creator ✨ Sharing moments & connecting with community.',
      isVerified: false,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      highlights: []
    };

    const updatedProfiles = {
      ...userProfiles,
      [newId]: newProfile
    };

    setUserProfiles(updatedProfiles);
    setCurrentUser(newProfile);
    setViewedUserId(newId);
    setHasAgreedToTerms(true);
    setTermsAgreedTimestamp(Date.now());

    localStorage.setItem(`${LOCAL_STORAGE_KEY}_profiles`, JSON.stringify(updatedProfiles));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(newProfile));
    localStorage.setItem('yaawp_terms_agreed_v1', 'true');
    localStorage.setItem('yaawp_terms_agreed_time', String(Date.now()));
    localStorage.setItem('yaawp_authenticated', 'true');
    setIsAuthenticated(true);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast(`Welcome to YAAWP, @${cleanUsername}!`);
    return { success: true };
  };

  const switchAccount = (userId: string) => {
    const profile = userProfiles[userId] || USERS[userId] || CURRENT_USER;
    const fullProfile: UserProfile = {
      id: profile.id,
      username: profile.username,
      name: profile.name,
      avatar: profile.avatar,
      bio: (profile as UserProfile).bio || 'Yaawp creator',
      website: (profile as UserProfile).website,
      isVerified: profile.isVerified,
      followersCount: (profile as UserProfile).followersCount || 100,
      followingCount: (profile as UserProfile).followingCount || 50,
      postsCount: (profile as UserProfile).postsCount || 1,
      highlights: (profile as UserProfile).highlights || []
    };
    setCurrentUser(fullProfile);
    setViewedUserId(fullProfile.id);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(fullProfile));
    localStorage.setItem('yaawp_authenticated', 'true');
    setIsAuthenticated(true);
    showToast(`Switched account to @${fullProfile.username}`);
  };

  // Offline & Feed Caching refresh implementation
  const refreshFeed = async () => {
    setIsFeedRefreshing(true);
    await new Promise(r => setTimeout(r, 750));
    const now = Date.now();
    if (isOffline) {
      try {
        const cached = localStorage.getItem(FEED_OFFLINE_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPosts(parsed);
          }
        }
      } catch {
        // safe fallback
      }
      showToast(`Offline Mode • Loaded ${posts.length} cached posts from localStorage`);
    } else {
      setPosts(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[0] = {
            ...updated[0],
            timestamp: 'Just now',
            createdAt: now
          };
        }
        return updated;
      });
      setFeedCacheTimestamp(now);
      try {
        localStorage.setItem(FEED_OFFLINE_CACHE_KEY, JSON.stringify(posts));
        localStorage.setItem(FEED_OFFLINE_META_KEY, JSON.stringify({
          cachedAt: now,
          count: posts.length
        }));
      } catch {
        // storage quota safe catch
      }
      showToast('Feed refreshed • Offline cache updated');
    }
    setIsFeedRefreshing(false);
  };

  // Communities Actions
  const openCommunityDetail = (id: string) => {
    setSelectedCommunityId(id);
    setActiveTab('communities');
  };

  const joinCommunity = (id: string, inviteCode?: string) => {
    const targetComm = communities.find(c => c.id === id);
    if (!targetComm) return;

    if (targetComm.isJoined) {
      leaveCommunity(id);
      return;
    }

    // Private community check
    if (targetComm.isPrivate) {
      const validCodes = [targetComm.inviteCode, `${targetComm.slug}-invite`, 'VIP_INVITE', 'COMMUNITY_PASS'];
      const hasValidCode = inviteCode && validCodes.includes(inviteCode.trim());

      if (!hasValidCode) {
        // Check if already requested
        const alreadyPending = joinRequests.some(
          r => r.communityId === id && r.user.id === currentUser.id && r.status === 'pending'
        );
        if (alreadyPending) {
          showToast('Your join request is already pending review by community moderators.');
          return;
        }

        const newReq: CommunityJoinRequest = {
          id: `req_${Date.now()}`,
          communityId: id,
          communityName: targetComm.name,
          user: {
            id: currentUser.id,
            username: currentUser.username,
            name: currentUser.name,
            avatar: currentUser.avatar
          },
          requestedAt: 'Just now',
          status: 'pending',
          message: 'Requested to join private community.'
        };
        setJoinRequests(prev => [newReq, ...prev]);
        showToast(`Request sent to ${targetComm.name} moderators • Status: Pending Approval`);
        return;
      }
    }

    // Direct join for public or valid invite link
    setCommunities(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            isJoined: true,
            membersCount: c.membersCount + 1
          };
        }
        return c;
      })
    );

    setCurrentUser(prev => {
      const currentList = prev.communitiesJoined || [];
      return {
        ...prev,
        communitiesJoined: [...new Set([...currentList, id])]
      };
    });

    showToast(`Joined ${targetComm.name} • You are now a member!`);
  };

  const leaveCommunity = (id: string) => {
    const targetComm = communities.find(c => c.id === id);
    setCommunities(prev =>
      prev.map(c => (c.id === id ? { ...c, isJoined: false, membersCount: Math.max(0, c.membersCount - 1) } : c))
    );
    setCurrentUser(prev => ({
      ...prev,
      communitiesJoined: (prev.communitiesJoined || []).filter(cId => cId !== id)
    }));
    showToast(`Left ${targetComm?.name || 'Community'}`);
  };

  const createCommunity = (data: Partial<Community>) => {
    const generatedSlug = (data.name || 'collective').toLowerCase().replace(/\s+/g, '-');
    const newComm: Community = {
      id: `comm_${Date.now()}`,
      name: data.name || 'New Creative Collective',
      slug: generatedSlug,
      description: data.description || 'A welcoming space for creators and enthusiasts.',
      about: data.about || 'A dedicated community space on Lumina.',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&h=400&q=80',
      bannerUrl: data.bannerUrl || 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=1200&h=400&q=80',
      isPrivate: Boolean(data.isPrivate),
      inviteCode: `${generatedSlug}-invite`,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      moderators: [currentUser.id],
      membersCount: 1,
      isJoined: true,
      topicTags: data.topicTags || ['Creative', 'Visual', 'Community'],
      rules: data.rules || ['Be respectful', 'Share original work', 'No spam'],
      createdAt: 'Just now',
      activeDiscussionsCount: 0
    };
    setCommunities(prev => [newComm, ...prev]);
    showToast(`Created community "${newComm.name}"!`);
    setIsCreateCommunityOpen(false);
  };

  const updateCommunity = (id: string, data: Partial<Community>) => {
    setCommunities(prev =>
      prev.map(c => (c.id === id ? { ...c, ...data } : c))
    );
    showToast('Community details updated successfully');
  };

  const deleteCommunity = (id: string) => {
    setCommunities(prev => prev.filter(c => c.id !== id));
    if (selectedCommunityId === id) {
      setSelectedCommunityId(null);
    }
    showToast('Community deleted.');
  };

  const reportCommunity = (communityId: string, reason: string) => {
    setCommunities(prev =>
      prev.map(c =>
        c.id === communityId
          ? { ...c, reportedReasons: [...(c.reportedReasons || []), reason] }
          : c
      )
    );
    showToast(`Report received: "${reason}". Moderators notified.`);
  };

  const toggleHideCommunity = (communityId: string) => {
    setCommunities(prev =>
      prev.map(c => {
        if (c.id === communityId) {
          const nextHidden = !c.isHidden;
          showToast(nextHidden ? 'Community hidden from main list' : 'Community unhidden');
          return { ...c, isHidden: nextHidden };
        }
        return c;
      })
    );
  };

  const pinDiscussion = (discussionId: string) => {
    setDiscussions(prev =>
      prev.map(d => (d.id === discussionId ? { ...d, isPinned: !d.isPinned } : d))
    );
    showToast('Discussion pin status toggled');
  };

  const createGroupChat = (name: string, isPublic: boolean, memberIds: string[], avatar?: string) => {
    const memberUsers: UserSummary[] = memberIds
      .map(id => Object.values(USERS).find(u => u.id === id) || userProfiles[id])
      .filter(Boolean) as UserSummary[];
    memberUsers.push({
      id: currentUser.id,
      username: currentUser.username,
      name: currentUser.name,
      avatar: currentUser.avatar,
      isVerified: currentUser.isVerified
    });

    const newGroup: ChatConversation = {
      id: `conv_group_${Date.now()}`,
      participant: {
        id: `group_${Date.now()}`,
        username: name.toLowerCase().replace(/\s+/g, '_'),
        name: name,
        avatar: avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&h=400&q=80'
      },
      isGroup: true,
      groupName: name,
      groupAvatar: avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&h=400&q=80',
      groupMembers: memberUsers,
      isGroupPublic: isPublic,
      lastMessage: `Group created by @${currentUser.username}`,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `msg_sys_${Date.now()}`,
          senderId: 'system',
          text: `Welcome to ${name}! This is a ${isPublic ? 'Public' : 'Private'} group with ${memberUsers.length} members.`,
          timestamp: 'Just now'
        }
      ]
    };
    setConversations(prev => [newGroup, ...prev]);
    showToast(`Created ${isPublic ? 'Public' : 'Private'} group "${name}"!`);
  };

  const toggleHideChat = (conversationId: string) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          const nextHidden = !c.isHiddenChat;
          showToast(nextHidden ? 'Chat hidden. Type your secret code in the search box to unlock.' : 'Chat unhidden.');
          return { ...c, isHiddenChat: nextHidden };
        }
        return c;
      })
    );
  };

  const archivePost = (postId: string) => {
    setPosts(prev => prev.map(p => (p.id === postId ? { ...p, isArchived: true } : p)));
    showToast('Post archived');
  };

  const unarchivePost = (postId: string) => {
    setPosts(prev => prev.map(p => (p.id === postId ? { ...p, isArchived: false } : p)));
    showToast('Post unarchived and restored to profile');
  };

  const toggleHidePostFromGrid = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const nextVal = !p.isHiddenFromOwnProfile;
          showToast(nextVal ? 'Post hidden from your profile grid' : 'Post restored to profile grid');
          return { ...p, isHiddenFromOwnProfile: nextVal };
        }
        return p;
      })
    );
  };

  const archiveStory = (storyId: string) => {
    setStories(prev => prev.map(s => (s.id === storyId ? { ...s, isArchived: true } : s)));
    showToast('Story archived');
  };

  const unarchiveStory = (storyId: string) => {
    setStories(prev => prev.map(s => (s.id === storyId ? { ...s, isArchived: false } : s)));
    showToast('Story restored');
  };

  const deleteStory = (storyId: string) => {
    setStories(prev => prev.filter(s => s.id !== storyId));
    showToast('Story deleted');
  };

  const addStoryComment = (storyId: string, text: string, parentId?: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `story_comm_${Date.now()}`,
      parentId,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      text: text.trim(),
      timestamp: 'Just now',
      likesCount: 0,
      isLiked: false,
      replies: []
    };

    setStories(prev =>
      prev.map(s => {
        if (s.id === storyId) {
          if (parentId) {
            const updateReplies = (comments: Comment[]): Comment[] => {
              return comments.map(c => {
                if (c.id === parentId) {
                  return { ...c, replies: [...(c.replies || []), newComment] };
                }
                if (c.replies && c.replies.length > 0) {
                  return { ...c, replies: updateReplies(c.replies) };
                }
                return c;
              });
            };
            return { ...s, comments: updateReplies(s.comments || []) };
          }
          return { ...s, comments: [...(s.comments || []), newComment] };
        }
        return s;
      })
    );
    showToast('Comment posted to story');
  };

  const updatePostEmojiSettings = (postId: string, allowedEmojis?: string[], restrictedEmojis?: string[]) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, allowedEmojis, restrictedEmojis };
        }
        return p;
      })
    );
    if (selectedPostForModal && selectedPostForModal.id === postId) {
      setSelectedPostForModal(prev => (prev ? { ...prev, allowedEmojis, restrictedEmojis } : null));
    }
    showToast('Reaction emoji settings updated');
  };

  const deleteComment = (postId: string, commentId: string) => {
    const removeComment = (comments: Comment[]): Comment[] => {
      return comments
        .filter(c => c.id !== commentId)
        .map(c => ({
          ...c,
          replies: c.replies ? removeComment(c.replies) : []
        }));
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, comments: removeComment(p.comments) };
        }
        return p;
      })
    );

    if (selectedPostForModal && selectedPostForModal.id === postId) {
      setSelectedPostForModal(prev => (prev ? { ...prev, comments: removeComment(prev.comments) } : null));
    }
    showToast('Comment deleted');
  };

  const archiveHighlight = (highlightId: string) => {
    setCurrentUser(prev => ({
      ...prev,
      highlights: prev.highlights.map(h => (h.id === highlightId ? { ...h, isArchived: true } : h))
    }));
    showToast('Highlight archived');
  };

  const unarchiveHighlight = (highlightId: string) => {
    setCurrentUser(prev => ({
      ...prev,
      highlights: prev.highlights.map(h => (h.id === highlightId ? { ...h, isArchived: false } : h))
    }));
    showToast('Highlight restored');
  };

  const toggleHideFollower = (targetUserId: string, type: 'follower' | 'following') => {
    setCurrentUser(prev => {
      if (type === 'follower') {
        const list = prev.hiddenFollowerIds || [];
        const isHidden = list.includes(targetUserId);
        const updated = isHidden ? list.filter(id => id !== targetUserId) : [...list, targetUserId];
        showToast(isHidden ? 'User unhidden from your followers list' : 'User hidden from public followers list');
        return { ...prev, hiddenFollowerIds: updated };
      } else {
        const list = prev.hiddenFollowingIds || [];
        const isHidden = list.includes(targetUserId);
        const updated = isHidden ? list.filter(id => id !== targetUserId) : [...list, targetUserId];
        showToast(isHidden ? 'User unhidden from your following list' : 'User hidden from public following list');
        return { ...prev, hiddenFollowingIds: updated };
      }
    });
  };

  const updateSecondaryAvatar = (avatarUrl: string, visibility: 'everyone' | 'followers' | 'close_friends') => {
    setCurrentUser(prev => ({
      ...prev,
      secondaryAvatar: avatarUrl,
      avatarVisibility: visibility
    }));
    showToast(`Secondary profile photo updated (Visible to: ${visibility.replace('_', ' ')})`);
  };

  const createStoryWithDuration = (
    mediaUrl: string,
    caption?: string,
    durationHours: number = 24,
    audience: 'everyone' | 'close_friends' = 'everyone'
  ) => {
    const clampedHours = Math.min(48, Math.max(1, durationHours));
    const newStory: Story = {
      id: `story_${Date.now()}`,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      mediaUrl,
      timestamp: 'Just now',
      seen: false,
      caption,
      durationHours: clampedHours,
      audience
    };
    setStories(prev => [newStory, ...prev.filter(s => s.user.id !== currentUser.id)]);
    showToast(`Story posted for ${clampedHours} hours (${audience === 'close_friends' ? 'Close Friends' : 'Everyone'})`);
  };

  // Discussions Actions
  const createDiscussion = (data: { communityId: string; title: string; body: string; tags?: string[]; mediaUrl?: string }) => {
    const comm = communities.find(c => c.id === data.communityId);
    const newDisc: Discussion = {
      id: `disc_${Date.now()}`,
      communityId: data.communityId,
      communityName: comm ? comm.name : 'Community',
      author: {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      title: data.title,
      body: data.body,
      timestamp: 'Just now',
      createdAt: Date.now(),
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      commentsCount: 0,
      comments: [],
      mediaUrl: data.mediaUrl,
      tags: data.tags || []
    };
    setDiscussions(prev => [newDisc, ...prev]);
    showToast('Discussion published!');
  };

  const voteDiscussion = (discussionId: string, type: 'up' | 'down') => {
    setDiscussions(prev =>
      prev.map(d => {
        if (d.id === discussionId) {
          const currentVote = d.userVote;
          let newVote: 'up' | 'down' | null = type;
          let upDelta = 0;
          let downDelta = 0;

          if (currentVote === type) {
            newVote = null;
            if (type === 'up') upDelta = -1;
            else downDelta = -1;
          } else {
            if (currentVote === 'up') upDelta = -1;
            if (currentVote === 'down') downDelta = -1;
            if (type === 'up') upDelta += 1;
            else downDelta += 1;
          }

          return {
            ...d,
            upvotes: Math.max(0, d.upvotes + upDelta),
            downvotes: Math.max(0, d.downvotes + downDelta),
            userVote: newVote
          };
        }
        return d;
      })
    );
  };

  const addDiscussionComment = (discussionId: string, text: string, parentId?: string) => {
    const newComm: Comment = {
      id: `c_disc_${Date.now()}`,
      discussionId,
      parentId,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      text,
      timestamp: 'Just now',
      likesCount: 0,
      upvotes: 0,
      downvotes: 0
    };
    setDiscussions(prev =>
      prev.map(d => {
        if (d.id === discussionId) {
          return {
            ...d,
            commentsCount: d.commentsCount + 1,
            comments: [...d.comments, newComm]
          };
        }
        return d;
      })
    );
    showToast('Reply added to discussion');
  };

  const voteDiscussionComment = (discussionId: string, commentId: string, type: 'up' | 'down') => {
    setDiscussions(prev =>
      prev.map(d => {
        if (d.id === discussionId) {
          return {
            ...d,
            comments: d.comments.map(c => {
              if (c.id === commentId) {
                const currentVote = c.userVote;
                const newVote = currentVote === type ? null : type;
                const upDelta = currentVote === 'up' ? -1 : type === 'up' && newVote ? 1 : 0;
                return {
                  ...c,
                  userVote: newVote,
                  upvotes: Math.max(0, (c.upvotes || 0) + upDelta)
                };
              }
              return c;
            })
          };
        }
        return d;
      })
    );
  };

  // Challenges Actions
  const joinChallenge = (challengeId: string) => {
    setChallenges(prev =>
      prev.map(ch => {
        if (ch.id === challengeId) {
          const nextJoined = !ch.isJoined;
          showToast(nextJoined ? `Joined challenge "${ch.title}"!` : `Left challenge "${ch.title}"`);
          return {
            ...ch,
            isJoined: nextJoined,
            participantsCount: nextJoined ? ch.participantsCount + 1 : Math.max(0, ch.participantsCount - 1)
          };
        }
        return ch;
      })
    );
  };

  const logChallengeProgress = (challengeId: string) => {
    setChallenges(prev =>
      prev.map(ch => {
        if (ch.id === challengeId) {
          const newProgress = (ch.userProgress || 0) + 1;
          const isCompleted = newProgress >= ch.durationDays;
          showToast(isCompleted ? `🎉 Challenge completed: earned ${ch.badgeReward.name} badge!` : `Day ${newProgress} logged! Keep your streak alive 🔥`);
          return {
            ...ch,
            userProgress: newProgress,
            momentumStreak: (ch.momentumStreak || 0) + 1,
            isCompleted
          };
        }
        return ch;
      })
    );
  };

  const createChallenge = (data: Partial<Challenge>) => {
    const newCh: Challenge = {
      id: `chal_${Date.now()}`,
      title: data.title || 'Creative Sprint',
      description: data.description || 'Daily challenge for visual storytellers',
      icon: data.icon || '⚡',
      category: data.category || 'creativity',
      durationDays: data.durationDays || 7,
      currentDay: 1,
      participantsCount: 1,
      isJoined: true,
      userProgress: 0,
      momentumStreak: 1,
      badgeReward: data.badgeReward || {
        name: 'Sprint Finisher',
        icon: '🏅',
        description: 'Completed 7-day creative journey'
      }
    };
    setChallenges(prev => [newCh, ...prev]);
    showToast(`Created challenge "${newCh.title}"!`);
    setIsCreateChallengeOpen(false);
  };

  const cheerParticipant = (_challengeId: string, targetUserId: string) => {
    showToast(`Sent cheers & momentum to @${targetUserId} ✨`);
  };

  const hideConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    showToast('Conversation hidden');
  };

  const replyToMessage = (conversationId: string, replyTo: { id: string; text: string; senderName: string }, text: string) => {
    sendMessage(conversationId, text, { replyTo });
  };

  const reactToMessage = (conversationId: string, messageId: string, emoji: string) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            messages: c.messages.map(m => (m.id === messageId ? { ...m, reaction: emoji } : m))
          };
        }
        return c;
      })
    );
  };

  const sendVoiceMessage = (
    conversationId: string,
    durationSeconds: number = 6,
    replyTo?: { id: string; text: string; senderName: string }
  ) => {
    sendMessage(conversationId, 'Voice note', {
      isVoice: true,
      voiceDurationSeconds: durationSeconds,
      replyTo
    });
  };

  const sendMediaMessage = (
    conversationId: string,
    mediaUrl: string,
    mediaType: 'image' | 'video' | 'file',
    caption: string = '',
    fileName?: string,
    replyTo?: { id: string; text: string; senderName: string }
  ) => {
    sendMessage(conversationId, caption || (mediaType === 'image' ? 'Sent a photo' : mediaType === 'video' ? 'Sent a video' : 'Sent an attachment'), {
      mediaUrl,
      mediaType,
      fileName,
      replyTo
    });
  };

  const triggerTypingIndicator = (conversationId: string, isTyping: boolean) => {
    setConversations(prev =>
      prev.map(c => (c.id === conversationId ? { ...c, isTyping } : c))
    );
  };

  const requestJoinCommunity = (communityId: string) => {
    const target = communities.find(c => c.id === communityId);
    if (!target) return;
    if (!target.isPrivate) {
      joinCommunity(communityId);
      return;
    }
    const newReq: CommunityJoinRequest = {
      id: `req_${Date.now()}`,
      communityId,
      communityName: target.name,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      message: 'Requesting access to join this private collective.',
      requestedAt: 'Just now',
      status: 'pending'
    };
    setJoinRequests(prev => [newReq, ...prev]);
    showToast(`Request sent to join "${target.name}". Moderators will review.`);
  };

  const handleJoinRequest = (communityId: string, requestId: string, action: 'accept' | 'decline') => {
    setJoinRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: action === 'accept' ? 'accepted' : 'declined' } : r))
    );
    if (action === 'accept') {
      setCommunities(prev =>
        prev.map(c => (c.id === communityId ? { ...c, membersCount: c.membersCount + 1 } : c))
      );
      showToast('Join request approved!');
    } else {
      showToast('Join request declined.');
    }
  };

  const likeDiscussion = (discussionId: string) => {
    voteDiscussion(discussionId, 'up');
  };

  const repostDiscussion = (discussionId: string) => {
    const disc = discussions.find(d => d.id === discussionId);
    if (!disc) return;
    showToast(`Reposted discussion "${disc.title.slice(0, 30)}..." to your feed!`);
  };

  const addAuditLog = (action: string, details?: string, status: 'success' | 'warning' | 'error' = 'success') => {
    const newLog: SecurityAuditLog = {
      id: `log_${Date.now()}`,
      action,
      actor: '@' + currentUser.username,
      ipAddress: '192.168.1.104',
      userAgent: 'Client Applet',
      timestamp: 'Just now',
      status,
      details
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const setChatPasscode = (pin: string | null) => {
    if (pin) {
      localStorage.setItem('lumina_chat_passcode', pin);
      setChatPasscodeState(pin);
      setIsChatLocked(false);
      addAuditLog('Chat Passcode Configured', '4-digit PIN lock enabled for Direct Messages', 'success');
      showToast('Chat passcode successfully set!');
    } else {
      localStorage.removeItem('lumina_chat_passcode');
      setChatPasscodeState(null);
      setIsChatLocked(false);
      addAuditLog('Chat Passcode Removed', 'PIN lock disabled', 'warning');
      showToast('Chat passcode removed');
    }
  };

  const unlockChat = (pin: string): boolean => {
    if (chatPasscode && pin === chatPasscode) {
      setIsChatLocked(false);
      addAuditLog('Chat Unlocked', 'Valid PIN entered', 'success');
      showToast('Chat unlocked');
      return true;
    }
    addAuditLog('Chat Unlock Failed', 'Incorrect PIN attempt', 'error');
    showToast('Incorrect passcode');
    return false;
  };

  const recordFailedLogin = () => {
    setFailedLoginAttempts(prev => {
      const next = prev + 1;
      if (next >= 5) {
        const lockoutTime = Date.now() + 60000;
        setLockoutUntil(lockoutTime);
        setFailedLoginsAlert(true);
        addAuditLog('Account Lockout Triggered', '5 consecutive failed password attempts. Account locked for 60s.', 'error');
      } else {
        addAuditLog('Failed Authentication Attempt', `Attempt ${next} of 5.`, 'warning');
      }
      return next;
    });
  };

  const resetFailedLogins = () => {
    setFailedLoginAttempts(0);
    setLockoutUntil(null);
    setFailedLoginsAlert(false);
  };

  const exportGDPRData = () => {
    const bundle = {
      exportedAt: new Date().toISOString(),
      user: currentUser,
      posts: posts.filter(p => p.user.id === currentUser.id),
      conversations,
      communitiesJoined: currentUser.communitiesJoined,
      auditLogs
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina_gdpr_data_export_${currentUser.username}.json`;
    a.click();
    addAuditLog('GDPR Data Archive Exported', 'User initiated full personal data archive download', 'success');
    showToast('GDPR Data archive exported successfully');
  };

  const deleteAccountPermanently = () => {
    addAuditLog('Account Deletion Requested', 'Purged user tables and assets', 'warning');
    localStorage.clear();
    showToast('Account permanently deleted. Session reset.');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const changePassword = (_oldPw: string, _newPw: string): boolean => {
    addAuditLog('Password Changed', 'User updated authentication credentials', 'success');
    showToast('Password updated securely!');
    return true;
  };

  const toggleFollowersPrivacy = () => {
    setIsFollowersPrivate(prev => {
      const next = !prev;
      localStorage.setItem('lumina_followers_private', String(next));
      addAuditLog('Followers Privacy Toggled', next ? 'Follower list hidden from public' : 'Follower list visible', 'success');
      showToast(next ? 'Followers & Following lists set to Private' : 'Followers & Following lists are now Public');
      return next;
    });
  };

  const updateInterests = (interests: string[]) => {
    updateProfile({ interests });
    addAuditLog('Interests Updated', `Selected: ${interests.join(', ')}`, 'success');
    showToast('Interests saved!');
  };

  const handleConnectionRequest = (notifId: string, action: 'accept' | 'decline') => {
    setNotifications(prev =>
      prev.map(n => {
        if (n.id === notifId) {
          return {
            ...n,
            isRead: true,
            connectionStatus: action === 'accept' ? 'accepted' : 'declined'
          };
        }
        return n;
      })
    );
    showToast(action === 'accept' ? 'Connection request accepted! You can now chat.' : 'Connection request declined');
  };

  const toggleAccountPrivacy = () => {
    setIsAccountPrivate(prev => {
      const next = !prev;
      showToast(next ? 'Account set to Private' : 'Account set to Public');
      return next;
    });
  };

  const blockUser = (userId: string) => {
    setBlockedUsers(prev => [...new Set([...prev, userId])]);
    showToast('User blocked');
  };

  const unblockUser = (userId: string) => {
    setBlockedUsers(prev => prev.filter(id => id !== userId));
    showToast('User unblocked');
  };

  const exportUserData = () => {
    const dataStr = JSON.stringify({ currentUser, posts: posts.filter(p => p.user.id === currentUser.id) }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina_data_${currentUser.username}.json`;
    a.click();
    showToast('Account data exported');
  };

  const signOutAccount = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
    setSupabaseSession(null);
    setIsProfileMenuOpen(false);
    setIsAuthenticated(false);
    localStorage.removeItem('yaawp_authenticated');
    showToast('Signed out of session');
  };

  const loginWithSupabase = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase is not configured yet. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session) {
        setSupabaseSession(data.session);
        setIsAuthenticated(true);
        localStorage.setItem('yaawp_authenticated', 'true');
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email,
            username: data.user.user_metadata?.username || (data.user.email ? data.user.email.split('@')[0] : 'user'),
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || 'User',
            avatar: data.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            bio: 'Yaawp creator ✨',
            isVerified: false,
            followersCount: 0,
            followingCount: 0,
            postsCount: 0,
            highlights: []
          };
          setCurrentUser(profile);
          setViewedUserId(profile.id);
          localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(profile));
        }
        showToast('Logged in with Supabase successfully!');
        return { success: true };
      }
      return { success: false, error: 'Failed to retrieve session from Supabase.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      };
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to initiate Google sign-in' };
    }
  };

  // Algorithmic Feed & Recommendations
  const updateAlgorithmSettings = (settings: Partial<AlgorithmSettings>) => {
    setAlgorithmSettings(prev => {
      const next = { ...prev, ...settings };
      try {
        localStorage.setItem('lumina_algorithm_settings', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const applyAlgorithmFeedback = (
    postId: string,
    action: 'more_like_this' | 'less_like_this' | 'mute_topic' | 'mute_community' | 'mute_person',
    topic?: string,
    targetId?: string
  ) => {
    const post = posts.find(p => p.id === postId);

    if (action === 'more_like_this') {
      const tags = post?.tags || (topic ? [topic] : []);
      setAlgorithmSettings(prev => {
        const nextAffinities = { ...prev.topicAffinities };
        tags.forEach(t => {
          const key = t.toLowerCase().replace('#', '');
          nextAffinities[key] = (nextAffinities[key] || 0) + 2;
        });
        const next = { ...prev, topicAffinities: nextAffinities };
        try {
          localStorage.setItem('lumina_algorithm_settings', JSON.stringify(next));
        } catch {}
        return next;
      });
      showToast('Algorithm tuned: Showing more posts like this');
    } else if (action === 'less_like_this') {
      const tags = post?.tags || (topic ? [topic] : []);
      setAlgorithmSettings(prev => {
        const nextAffinities = { ...prev.topicAffinities };
        tags.forEach(t => {
          const key = t.toLowerCase().replace('#', '');
          nextAffinities[key] = Math.max(-10, (nextAffinities[key] || 0) - 2);
        });
        const next = { ...prev, topicAffinities: nextAffinities };
        try {
          localStorage.setItem('lumina_algorithm_settings', JSON.stringify(next));
        } catch {}
        return next;
      });
      showToast('Algorithm tuned: Showing less content like this');
    } else if (action === 'mute_topic') {
      const cleanTopic = (topic || '').replace('#', '').trim();
      if (cleanTopic) {
        setAlgorithmSettings(prev => {
          if (prev.mutedTopics.includes(cleanTopic)) return prev;
          const next = { ...prev, mutedTopics: [...prev.mutedTopics, cleanTopic] };
          try {
            localStorage.setItem('lumina_algorithm_settings', JSON.stringify(next));
          } catch {}
          return next;
        });
        showToast(`Topic #${cleanTopic} is now muted in feed`);
      }
    } else if (action === 'mute_community') {
      const commId = targetId || post?.communityId;
      if (commId) {
        setAlgorithmSettings(prev => {
          if (prev.mutedCommunityIds.includes(commId)) return prev;
          const next = { ...prev, mutedCommunityIds: [...prev.mutedCommunityIds, commId] };
          try {
            localStorage.setItem('lumina_algorithm_settings', JSON.stringify(next));
          } catch {}
          return next;
        });
        showToast('Community muted from recommendations');
      }
    } else if (action === 'mute_person') {
      const uId = targetId || post?.user.id;
      if (uId) {
        setAlgorithmSettings(prev => {
          if (prev.mutedUserIds.includes(uId)) return prev;
          const next = { ...prev, mutedUserIds: [...prev.mutedUserIds, uId] };
          try {
            localStorage.setItem('lumina_algorithm_settings', JSON.stringify(next));
          } catch {}
          return next;
        });
        const authorName = post?.user.username || 'creator';
        showToast(`Will not recommend @${authorName} in your feed`);
      }
    }
  };

  const resetRecommendationProfile = () => {
    const clean: AlgorithmSettings = {
      mutedTopics: [],
      mutedCommunityIds: [],
      mutedUserIds: [],
      topicAffinities: {},
      separateFriendsFromDiscovery: false,
      stopStrangers: false
    };
    setAlgorithmSettings(clean);
    try {
      localStorage.setItem('lumina_algorithm_settings', JSON.stringify(clean));
    } catch {}
    showToast('Recommendation profile reset to clean defaults');
  };

  // Custom Circles
  const createCustomCircle = (name: string, icon: string, userIds: string[], description?: string) => {
    const newCircle: CustomCircle = {
      id: `circle_${Date.now()}`,
      name,
      icon,
      userIds,
      description,
      isDefault: false
    };
    setCustomCircles(prev => {
      const next = [...prev, newCircle];
      try {
        localStorage.setItem('lumina_custom_circles', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast(`Circle "${name}" created with ${userIds.length} members`);
  };

  const updateCustomCircle = (id: string, name: string, icon: string, userIds: string[]) => {
    setCustomCircles(prev => {
      const next = prev.map(c => (c.id === id ? { ...c, name, icon, userIds } : c));
      try {
        localStorage.setItem('lumina_custom_circles', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('Circle updated');
  };

  const deleteCustomCircle = (id: string) => {
    setCustomCircles(prev => {
      const next = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem('lumina_custom_circles', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (activeCustomCircleId === id) {
      setActiveCustomCircleId(null);
      setFeedMode('following');
    }
    showToast('Circle deleted');
  };

  const toggleUserInCircle = (circleId: string, userId: string) => {
    setCustomCircles(prev => {
      const next = prev.map(c => {
        if (c.id === circleId) {
          const exists = c.userIds.includes(userId);
          const userIds = exists ? c.userIds.filter(id => id !== userId) : [...c.userIds, userId];
          return { ...c, userIds };
        }
        return c;
      });
      try {
        localStorage.setItem('lumina_custom_circles', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Nearby Activities
  const joinNearbyActivity = (activityId: string) => {
    setNearbyActivities(prev =>
      prev.map(act => {
        if (act.id === activityId) {
          const wasJoined = act.isJoined;
          const nextJoined = !wasJoined;
          const nextTaken = nextJoined ? act.spotsTaken + 1 : Math.max(1, act.spotsTaken - 1);
          const attendees = nextJoined
            ? [
                ...act.attendees,
                {
                  id: currentUser.id,
                  username: currentUser.username,
                  name: currentUser.name,
                  avatar: currentUser.avatar
                }
              ]
            : act.attendees.filter(a => a.id !== currentUser.id);

          showToast(nextJoined ? `Joined "${act.title}"! See you there!` : `Left "${act.title}"`);
          return {
            ...act,
            isJoined: nextJoined,
            spotsTaken: nextTaken,
            attendees
          };
        }
        return act;
      })
    );
  };

  const createNearbyActivity = (
    data: Omit<NearbyActivity, 'id' | 'organizer' | 'spotsTaken' | 'attendees' | 'isJoined'>
  ) => {
    const newActivity: NearbyActivity = {
      ...data,
      id: `act_${Date.now()}`,
      organizer: {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        avatar: currentUser.avatar,
        isVerified: currentUser.isVerified
      },
      spotsTaken: 1,
      attendees: [
        {
          id: currentUser.id,
          username: currentUser.username,
          name: currentUser.name,
          avatar: currentUser.avatar
        }
      ],
      isJoined: true
    };
    setNearbyActivities(prev => {
      const next = [newActivity, ...prev];
      try {
        localStorage.setItem('lumina_nearby_activities', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast(`Meetup "${newActivity.title}" created & open to nearby friends!`);
  };

  // Social Presence ("Currently")
  const updatePresenceStatus = (status: Partial<PresenceStatus>) => {
    setPresenceStatus(prev => {
      const next = { ...prev, ...status, updatedAt: Date.now() };
      try {
        localStorage.setItem('lumina_presence_status', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('Presence status updated');
  };

  // Expressive Reactions
  const reactToPost = (postId: string, reactionEmoji: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const reactions = { ...(p.reactions || {}) };
          const userReaction = p.userReaction === reactionEmoji ? undefined : reactionEmoji;

          // Remove old userReaction if present
          if (p.userReaction && reactions[p.userReaction]) {
            reactions[p.userReaction] = reactions[p.userReaction].filter(
              uid => uid !== currentUser.id
            );
            if (reactions[p.userReaction].length === 0) delete reactions[p.userReaction];
          }

          // Add new reaction if toggling on
          if (userReaction) {
            reactions[reactionEmoji] = [...(reactions[reactionEmoji] || []), currentUser.id];
          }

          return {
            ...p,
            userReaction,
            reactions
          };
        }
        return p;
      })
    );
  };

  const quotePost = (targetPostId: string, caption: string) => {
    const targetPost = posts.find(p => p.id === targetPostId);
    if (!targetPost) return;

    const trimmedCaption = caption ? caption.trim() : '';

    const newPost: Post = {
      id: `quote_${Date.now()}`,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        avatar: currentUser.avatar,
        isVerified: currentUser.isVerified
      },
      mediaUrls: targetPost.mediaUrls,
      caption: trimmedCaption,
      timestamp: 'JUST NOW',
      createdAt: Date.now(),
      likesCount: 0,
      isLiked: false,
      isSaved: false,
      filterClass: targetPost.filterClass || 'filter-normal',
      comments: [],
      quotePost: targetPost,
      originalPostId: targetPost.id
    };

    setPosts(prev => [newPost, ...prev]);
    setCurrentUser(prev => ({ ...prev, postsCount: prev.postsCount + 1 }));
    showToast(trimmedCaption ? `Quoted @${targetPost.user.username}'s post!` : `Reposted @${targetPost.user.username}'s post to your feed!`);
    setActiveTab('feed');
  };

  // Community Personas & Channels
  const setCommunityPersona = (communityId: string, persona: Partial<CommunityPersona>) => {
    setCommunityPersonas(prev => {
      const existing = prev[communityId] || {
        communityId,
        displayName: currentUser.name,
        avatar: currentUser.avatar,
        bio: currentUser.bio.split('\n')[0],
        badge: 'Contributor'
      };
      const next = { ...prev, [communityId]: { ...existing, ...persona } };
      try {
        localStorage.setItem('lumina_community_personas', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast('Community persona updated');
  };

  const sendCommunityChatMessage = (
    communityId: string,
    channelId: string,
    text: string,
    mediaUrl?: string,
    replyTo?: { id: string; text: string; senderName: string }
  ) => {
    const key = `${communityId}_${channelId}`;
    const persona = communityPersonas[communityId];
    const newMsg: CommunityChatMessage = {
      id: `cmsg_${Date.now()}`,
      communityId,
      channelId,
      sender: {
        id: currentUser.id,
        username: currentUser.username,
        name: persona?.displayName || currentUser.name,
        avatar: persona?.avatar || currentUser.avatar,
        isVerified: currentUser.isVerified
      },
      userId: currentUser.id,
      authorName: persona?.displayName || currentUser.name,
      authorAvatar: persona?.avatar || currentUser.avatar,
      text,
      mediaUrl,
      replyTo,
      timestamp: 'Just now',
      createdAt: Date.now()
    };

    setCommunityChatMessages(prev => {
      const currentList = prev[key] || [];
      const next = { ...prev, [key]: [...currentList, newMsg] };
      try {
        localStorage.setItem('lumina_community_chat_messages', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const reactToCommunityChatMessage = (
    communityId: string,
    channelId: string,
    messageId: string,
    emoji: string
  ) => {
    const key = `${communityId}_${channelId}`;
    setCommunityChatMessages(prev => {
      const currentList = prev[key] || [];
      const updated = currentList.map(m => {
        if (m.id === messageId) {
          const reactions = { ...(m.reactions || {}) };
          const uids = reactions[emoji] || [];
          if (uids.includes(currentUser.id)) {
            reactions[emoji] = uids.filter(id => id !== currentUser.id);
            if (reactions[emoji].length === 0) delete reactions[emoji];
          } else {
            reactions[emoji] = [...uids, currentUser.id];
          }
          return { ...m, reactions };
        }
        return m;
      });
      const next = { ...prev, [key]: updated };
      try {
        localStorage.setItem('lumina_community_chat_messages', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const updateCommunityModeration = (
    communityId: string,
    config: Partial<CommunityModerationConfig>
  ) => {
    setCommunities(prev =>
      prev.map(c => {
        if (c.id === communityId) {
          const currentConfig = c.moderationConfig || {
            slowModeSeconds: 0,
            wordFilters: [],
            requireApproval: false,
            bannedUserIds: [],
            rules: c.rules || []
          };
          return {
            ...c,
            moderationConfig: { ...currentConfig, ...config }
          };
        }
        return c;
      })
    );
    showToast('Community moderation settings saved');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        currentUser,
        posts,
        feedPosts,
        feedMode,
        setFeedMode,
        feedSort,
        setFeedSort,
        followedUserIds,
        stories,
        reels,
        notifications,
        conversations,
        activeConvId,
        setActiveConvId,
        allUsers,
        startConversationWithUser,
        viewedUserId,
        openUserProfile,
        getUserProfile,
        unreadNotifsCount,
        unreadMessagesCount,
        activeStoryUserIndex,
        setActiveStoryUserIndex,
        selectedPostForModal,
        setSelectedPostForModal,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isEditProfileOpen,
        setIsEditProfileOpen,
        toggleLikePost,
        toggleSavePost,
        votePost,
        repostPost,
        deletePost,
        editPost,
        reportPost,
        addComment,
        likeComment,
        voteComment,
        createPost,
        createStory,
        toggleLikeReel,
        toggleSaveReel,
        toggleFollowUser,
        // Algorithmic Feed & Recommendations
        algorithmSettings,
        updateAlgorithmSettings,
        applyAlgorithmFeedback,
        resetRecommendationProfile,
        // Custom Circles
        customCircles,
        activeCustomCircleId,
        setActiveCustomCircleId,
        createCustomCircle,
        updateCustomCircle,
        deleteCustomCircle,
        toggleUserInCircle,
        // Spontaneous Meetups & Nearby Activities
        nearbyActivities,
        joinNearbyActivity,
        createNearbyActivity,
        // Social Presence ("Currently")
        presenceStatus,
        updatePresenceStatus,
        // Expressive Reactions & Reposting
        reactToPost,
        quotePost,
        // Community Personas & Channels
        communityPersonas,
        setCommunityPersona,
        communityChatMessages,
        sendCommunityChatMessage,
        reactToCommunityChatMessage,
        updateCommunityModeration,
        // Communities
        communities,
        selectedCommunityId,
        setSelectedCommunityId,
        openCommunityDetail,
        joinCommunity,
        leaveCommunity,
        createCommunity,
        updateCommunity,
        deleteCommunity,
        requestJoinCommunity,
        handleJoinRequest,
        joinRequests,
        isCreateCommunityOpen,
        setIsCreateCommunityOpen,
        // Discussions
        discussions,
        createDiscussion,
        voteDiscussion,
        addDiscussionComment,
        voteDiscussionComment,
        likeDiscussion,
        repostDiscussion,
        // Challenges
        challenges,
        joinChallenge,
        logChallengeProgress,
        createChallenge,
        cheerParticipant,
        isCreateChallengeOpen,
        setIsCreateChallengeOpen,
        // Messaging
        sendMessage,
        hideConversation,
        replyToMessage,
        reactToMessage,
        sendVoiceMessage,
        sendMediaMessage,
        triggerTypingIndicator,
        markConversationAsRead,
        markRecipientSeen,
        toggleRecipientInChat,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        handleConnectionRequest,
        updateProfile,
        // Security Suite & Passcode Protection
        isSecurityModalOpen,
        setIsSecurityModalOpen,
        isBehindTheScenesOpen,
        setIsBehindTheScenesOpen,
        chatPasscode,
        setChatPasscode,
        isChatLocked,
        setIsChatLocked,
        unlockChat,
        failedLoginAttempts,
        lockoutUntil,
        failedLoginsAlert,
        recordFailedLogin,
        resetFailedLogins,
        auditLogs,
        addAuditLog,
        exportGDPRData,
        deleteAccountPermanently,
        changePassword,
        twoFactorEnabled,
        setTwoFactorEnabled,
        privateMediaSignedUrlsEnabled,
        setPrivateMediaSignedUrlsEnabled,
        isFollowersPrivate,
        toggleFollowersPrivacy,
        updateInterests,
        // Settings & Privacy
        isSettingsOpen,
        setIsSettingsOpen,
        isAccountPrivate,
        toggleAccountPrivacy,
        showReadReceipts,
        setShowReadReceipts,
        showOnlineStatus,
        setShowOnlineStatus,
        blockedUsers,
        blockUser,
        unblockUser,
        exportUserData,
        signOutAccount,
        // Offline & Feed Caching
        isOffline,
        isSimulatedOffline,
        toggleSimulatedOffline,
        feedCacheTimestamp,
        refreshFeed,
        isFeedRefreshing,
        toastMessage,
        showToast,
        userProfiles,
        hasAgreedToTerms,
        termsAgreedTimestamp,
        agreeToTermsAndContinue,
        isLegalModalOpen,
        activeLegalDoc,
        openLegalModal,
        closeLegalModal,
        isCreateAccountModalOpen,
        setIsCreateAccountModalOpen,
        isAuthenticated,
        setIsAuthenticated,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        continueAsGuest,
        createAccount,
        switchAccount,
        // 3-Bar Profile Settings & Navigation
        isProfileMenuOpen,
        setIsProfileMenuOpen,
        // Community Enhancements
        reportCommunity,
        toggleHideCommunity,
        pinDiscussion,
        // Group Chat & Secret Hiding
        createGroupChat,
        toggleHideChat,
        chatSecretCode,
        setChatSecretCode,
        // Profile, Post, Story & Highlight Privacy & Archives
        archivePost,
        unarchivePost,
        toggleHidePostFromGrid,
        archiveStory,
        unarchiveStory,
        deleteStory,
        addStoryComment,
        updatePostEmojiSettings,
        deleteComment,
        archiveHighlight,
        unarchiveHighlight,
        toggleHideFollower,
        updateSecondaryAvatar,
        createStoryWithDuration,
        // One-way Profile Concealment
        hiddenProfileFromUserIds,
        toggleHideMyProfileFrom,
        isProfileHiddenFromUser,
        // Supabase Auth & Session
        supabaseSession,
        isSupabaseConfigured,
        loginWithSupabase,
        loginWithGoogle
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
