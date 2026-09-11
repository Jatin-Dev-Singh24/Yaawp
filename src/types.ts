export type NavigationTab = 'feed' | 'explore' | 'communities' | 'messages' | 'profile' | 'notifications';

export interface AchievementBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserSummary {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isVerified?: boolean;
  isFollowing?: boolean;
  bioSnippet?: string;
}

export interface UserProfile extends UserSummary {
  email?: string;
  bio: string;
  website?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  interests?: string[];
  badges?: AchievementBadge[];
  challengesCompleted?: number;
  challengesCount?: number;
  communitiesJoined?: string[];
  isPrivate?: boolean;
  secondaryAvatar?: string;
  avatarVisibility?: 'everyone' | 'followers' | 'close_friends';
  hiddenFollowerIds?: string[];
  hiddenFollowingIds?: string[];
  isPrivateAccount?: boolean;
  messagePermission?: 'everyone' | 'followers' | 'nobody';
  highlights: {
    id: string;
    title: string;
    coverUrl: string;
    isArchived?: boolean;
  }[];
}

export interface Comment {
  id: string;
  postId?: string;
  discussionId?: string;
  parentId?: string;
  user: UserSummary;
  text: string;
  timestamp: string;
  likesCount: number;
  isLiked?: boolean;
  score?: number;
  upvotes?: number;
  downvotes?: number;
  userVote?: 'up' | 'down' | null;
  replies?: Comment[];
}

export interface Post {
  id: string;
  user: UserSummary;
  mediaUrls: string[];
  caption: string;
  location?: string;
  tags?: string[];
  timestamp: string;
  createdAt?: number; // Unix timestamp in ms for precise sorting
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  score?: number;
  isReposted?: boolean;
  originalPostId?: string;
  upvotes?: number;
  downvotes?: number;
  userVote?: 'up' | 'down' | null;
  comments: Comment[];
  filterClass?: string;
  allowsRepost?: boolean;
  repostedBy?: UserSummary;
  videoUrl?: string;
  communityId?: string;
  communityName?: string;
  audience?: 'everyone' | 'followers' | 'close_friends' | 'private' | 'community' | 'specific';
  audienceCircleId?: string;
  isHiddenFromOwnProfile?: boolean;
  isArchived?: boolean;
  recommendationReason?: string;
  reactions?: { [emoji: string]: number };
  userReaction?: string;
  quotePost?: {
    id: string;
    authorName?: string;
    authorUsername?: string;
    authorAvatar?: string;
    caption?: string;
    mediaUrl?: string;
    mediaUrls?: string[];
    user?: UserSummary;
    timestamp?: string;
    isVerified?: boolean;
    [key: string]: any;
  };
  allowedEmojis?: string[];
  restrictedEmojis?: string[];
}

export interface CommunityChannel {
  id: string;
  name: string;
  description: string;
  type: 'chat' | 'announcements' | 'media' | 'meetups';
  isLocked?: boolean;
}

export interface CommunityChatMessage {
  id: string;
  channelId: string;
  communityId: string;
  sender?: UserSummary;
  userId?: string;
  authorName?: string;
  authorAvatar?: string;
  authorBadge?: string;
  text: string;
  timestamp: string;
  createdAt?: number;
  mediaUrl?: string;
  replyTo?: {
    id: string;
    text: string;
    senderName: string;
  };
  replyToId?: string;
  reactions?: {
    [emoji: string]: string[]; // emoji -> array of userIds
  };
}

export interface CommunityModerationConfig {
  slowModeSeconds: number; // 0 = off, 10, 30, 60
  wordFilters: string[];
  requireApproval: boolean;
  bannedUserIds: string[];
  rules: string[];
}

export interface CommunityPersona {
  communityId: string;
  displayName: string;
  avatarUrl: string;
  flair?: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  about?: string;
  avatar: string;
  bannerUrl: string;
  isPrivate: boolean;
  ownerId: string;
  ownerName?: string;
  moderators: string[];
  membersCount: number;
  isJoined?: boolean;
  topicTags: string[];
  rules: string[];
  createdAt: string;
  activeDiscussionsCount: number;
  inviteCode?: string;
  isHidden?: boolean;
  reportedReasons?: string[];
  channels?: CommunityChannel[];
  moderationConfig?: CommunityModerationConfig;
  contributorBadges?: {
    userId: string;
    badge: string;
    title: string;
  }[];
}

export interface Discussion {
  id: string;
  communityId: string;
  communityName: string;
  author: UserSummary;
  title: string;
  body: string;
  timestamp: string;
  createdAt?: number;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  commentsCount: number;
  comments: Comment[];
  isPinned?: boolean;
  mediaUrl?: string;
  tags?: string[];
  flair?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'creativity' | 'mindfulness' | 'fitness' | 'craft' | 'social';
  durationDays: number;
  currentDay: number;
  participantsCount: number;
  isJoined?: boolean;
  isCompleted?: boolean;
  userProgress?: number; // days completed
  momentumStreak?: number;
  badgeReward: {
    name: string;
    icon: string;
    description: string;
  };
  leaderboard?: {
    user: UserSummary;
    streak: number;
    progress: number;
  }[];
  communityId?: string;
  communityName?: string;
}

export interface Story {
  id: string;
  user: UserSummary;
  mediaUrl: string;
  timestamp: string;
  seen: boolean;
  caption?: string;
  durationSeconds?: number;
  durationHours?: number;
  isArchived?: boolean;
  audience?: 'everyone' | 'close_friends';
  comments?: Comment[];
}

export interface Reel {
  id: string;
  user: UserSummary;
  mediaUrl: string;
  caption: string;
  musicTitle: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  filterClass?: string;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'reply' | 'follow' | 'mention' | 'community' | 'challenge' | 'connection_request' | 'message';
  user: UserSummary;
  postPreviewUrl?: string;
  text?: string;
  timestamp: string;
  createdAt?: number;
  isRead: boolean;
  targetPostId?: string;
  targetCommunityId?: string;
  targetDiscussionId?: string;
  connectionStatus?: 'pending' | 'accepted' | 'declined';
}

export type MessageDeliveryStatus = 'sending' | 'sent' | 'delivered' | 'seen';

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'file';
  fileName?: string;
  isLiked?: boolean;
  status?: MessageDeliveryStatus;
  seenAt?: string;
  replyTo?: {
    id: string;
    text: string;
    senderName: string;
  };
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
  isVoice?: boolean;
  voiceDurationSeconds?: number;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  action: string;
  category?: 'connection' | 'message_read' | 'media_open' | 'auth' | 'security';
  details?: string;
  ip?: string;
  ipAddress?: string;
  actor?: string;
  userAgent?: string;
  status: 'success' | 'flagged' | 'warning' | 'error';
}

export interface CommunityJoinRequest {
  id: string;
  communityId: string;
  communityName: string;
  user: UserSummary;
  requestedAt: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
}

export interface ChatConversation {
  id: string;
  participant: UserSummary;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  isOnline?: boolean;
  isRecipientInChat?: boolean;
  lastSeenByRecipient?: {
    messageId: string;
    timestamp: string;
  };
  isTyping?: boolean;
  isArchived?: boolean;
  isMuted?: boolean;
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
  groupMembers?: UserSummary[];
  isGroupPublic?: boolean;
  isHiddenChat?: boolean;
}

export interface FilterPreset {
  id: string;
  name: string;
  filterClass: string;
  previewColor: string;
}

export type LegalDocType = 'terms' | 'privacy' | 'cookies' | 'community';

export interface NewAccountRegistration {
  contact: string;
  name: string;
  username: string;
  birthday: string;
  password?: string;
  avatar?: string;
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
  agreedToCookies?: boolean;
}

export type FeedMode =
  | 'for_you'
  | 'following'
  | 'communities'
  | 'nearby'
  | 'my_posts'
  | 'custom_list'
  | 'all';

export type FeedSort = 'algorithmic' | 'chronological' | 'trending' | 'discussed';

export interface CustomCircle {
  id: string;
  name: string;
  icon: string;
  description?: string;
  userIds: string[];
  isDefault?: boolean;
}

export interface AlgorithmSettings {
  mutedTopics: string[];
  mutedCommunityIds: string[];
  mutedUserIds: string[];
  topicAffinities: { [topic: string]: number }; // positive = more like this, negative = less
  separateFriendsFromDiscovery: boolean;
  stopStrangers: boolean;
  lastResetTimestamp?: number;
}

export interface AlgorithmFeedback {
  postId: string;
  action: 'more_like_this' | 'less_like_this' | 'mute_topic' | 'mute_community' | 'mute_person';
  topic?: string;
  communityId?: string;
  userId?: string;
  timestamp: number;
}

export interface NearbyActivity {
  id: string;
  title: string;
  category: 'sports' | 'photography' | 'gaming' | 'music' | 'social' | 'creative';
  icon: string;
  time: string;
  locationName: string;
  distanceDesc?: string;
  spotsTotal: number;
  spotsTaken: number;
  attendees: UserSummary[];
  organizer: UserSummary;
  description: string;
  isJoined?: boolean;
  privacyLevel: 'neighborhood' | 'city' | 'exact_shared';
}

export type SocialPresenceType =
  | 'available'
  | 'gaming'
  | 'music'
  | 'studying'
  | 'creating'
  | 'chatting'
  | 'away'
  | 'custom';

export interface PresenceStatus {
  type: SocialPresenceType;
  emoji: string;
  label: string;
  detail?: string;
  updatedAt: string;
}
