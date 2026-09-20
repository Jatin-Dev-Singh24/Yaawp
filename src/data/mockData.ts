import {
  UserProfile,
  UserSummary,
  Post,
  Story,
  Reel,
  NotificationItem,
  ChatConversation,
  FilterPreset,
  Community,
  Discussion,
  Challenge,
  AchievementBadge
} from '../types';

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge_1',
    name: 'Pioneer Visionary',
    icon: '✨',
    description: 'Founding participant in visual communities',
    rarity: 'legendary',
    earnedAt: '2 months ago'
  },
  {
    id: 'badge_2',
    name: 'Story Weaver',
    icon: '📖',
    description: 'Published 10+ thought-provoking discussions',
    rarity: 'epic',
    earnedAt: '3 weeks ago'
  },
  {
    id: 'badge_3',
    name: 'Momentum Master',
    icon: '⚡',
    description: 'Maintained a 14-day creative challenge streak',
    rarity: 'rare',
    earnedAt: 'Yesterday'
  },
  {
    id: 'badge_4',
    name: 'Community Anchor',
    icon: '⚓',
    description: 'Top contributor in Analog Film & Craft',
    rarity: 'epic',
    earnedAt: '1 week ago'
  }
];

export const CURRENT_USER: UserProfile = {
  id: 'user_current',
  username: 'jatindev',
  name: 'Jatin Dev Singh',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
  isVerified: true,
  bio: 'Exploring aesthetic intersections of lens, code & thought. Analog photographer, generative explorer.',
  website: 'https://jatindev.com',
  preferred_language: 'en',
  followersCount: 14280,
  followingCount: 682,
  postsCount: 24,
  interests: ['Analog Film', 'Surrealist Art', 'Ambient Sound', 'Modernist Architecture', 'Minimalist Living', 'Creative Tech'],
  badges: ACHIEVEMENT_BADGES,
  challengesCompleted: 6,
  challengesCount: 3,
  communitiesJoined: ['comm_film', 'comm_slow_living', 'comm_ambient', 'comm_brutalist'],
  isPrivate: false,
  highlights: [
    {
      id: 'hl_1',
      title: 'Tokyo 🌸',
      coverUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&h=400&q=80'
    },
    {
      id: 'hl_2',
      title: 'Amalfi 🍋',
      coverUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&h=400&q=80'
    },
    {
      id: 'hl_3',
      title: 'Cafés ☕',
      coverUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&h=400&q=80'
    },
    {
      id: 'hl_4',
      title: 'Studio 💻',
      coverUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&h=400&q=80'
    },
    {
      id: 'hl_5',
      title: 'Nordic ❄️',
      coverUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=400&h=400&q=80'
    }
  ]
};

export const USERS: Record<string, UserSummary> = {
  elena_art: {
    id: 'user_elena',
    username: 'elena_art',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    isVerified: true,
    isFollowing: true,
    bioSnippet: 'Architectural photographer in Berlin'
  },
  marco_kitchen: {
    id: 'user_marco',
    username: 'marco_kitchen',
    name: 'Marco Bellini',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    isVerified: false,
    isFollowing: true,
    bioSnippet: 'Artisan sourdough & espresso'
  },
  wanderlust_kai: {
    id: 'user_kai',
    username: 'wanderlust_kai',
    name: 'Kai Tanaka',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    isVerified: true,
    isFollowing: true,
    bioSnippet: 'Chasing sunrises around the globe'
  },
  sophia_vogue: {
    id: 'user_sophia',
    username: 'sophia_vogue',
    name: 'Sophia Laurent',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
    isVerified: true,
    isFollowing: false,
    bioSnippet: 'Fashion editor & minimalist aesthetic'
  },
  david_urban: {
    id: 'user_david',
    username: 'david_urban',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80',
    isVerified: false,
    isFollowing: false,
    bioSnippet: 'Street photography & neon nocturnes'
  },
  chloe_botanicals: {
    id: 'user_chloe',
    username: 'chloe_botanicals',
    name: 'Chloé Martin',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
    isVerified: false,
    isFollowing: false,
    bioSnippet: 'Greenery interior design & plant care'
  }
};

export const USER_PROFILES: Record<string, UserProfile> = {
  [CURRENT_USER.id]: CURRENT_USER,
  user_elena: {
    ...USERS.elena_art,
    bio: 'Architectural photographer & visual designer in Berlin 🏛️\nExploring geometry, natural light & brutalist forms.\nPrints & commissions available 📩',
    website: 'https://elenarostova.design',
    followersCount: 38400,
    followingCount: 412,
    postsCount: 1,
    highlights: [
      { id: 'h_e1', title: 'Berlin 🏛️', coverUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&h=400&q=80' },
      { id: 'h_e2', title: 'Nordic ❄️', coverUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=400&h=400&q=80' }
    ]
  },
  user_marco: {
    ...USERS.marco_kitchen,
    bio: 'Artisan Pizzaiolo & Baker 🍕\nNaturally leavened sourdough & Roman focaccia.\nHost of "Dough Lab" Masterclasses in Naples & Rome 🌾',
    website: 'https://marcocucina.it',
    followersCount: 52100,
    followingCount: 380,
    postsCount: 1,
    highlights: [
      { id: 'h_m1', title: 'Recipes 📖', coverUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&h=400&q=80' },
      { id: 'h_m2', title: 'Napoli 🍕', coverUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&h=400&q=80' }
    ]
  },
  user_kai: {
    ...USERS.wanderlust_kai,
    bio: 'Alpine Explorer & Landscape Cinematographer 🏔️\nChasing dawn light across 40+ countries 🏕️\nSony Alpha Ambassador | Leave No Trace 🌱',
    website: 'https://kaitravels.photo',
    followersCount: 94800,
    followingCount: 520,
    postsCount: 1,
    highlights: [
      { id: 'h_k1', title: 'Alps 🏔️', coverUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&h=400&q=80' },
      { id: 'h_k2', title: 'Amalfi 🌊', coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=400&q=80' }
    ]
  },
  user_sophia: {
    ...USERS.sophia_vogue,
    bio: 'Contributing Fashion Director @ Studio Mode Paris 👠\nSustainable tailoring & vintage archival collections.\nCoffee, ceramics & autumn coats 🍂',
    website: 'https://sophialaurent.fr',
    followersCount: 112000,
    followingCount: 610,
    postsCount: 1,
    highlights: [
      { id: 'h_s1', title: 'PFW 🖤', coverUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&h=400&q=80' },
      { id: 'h_s2', title: 'Editorial 📸', coverUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&h=400&q=80' }
    ]
  },
  user_david: {
    ...USERS.david_urban,
    bio: 'Tokyo Street & Cyberpunk Nocturnes 🌃⚡\nLeica M11 & cine lenses.\nDocumenting after-hours light & rainy reflections 🌧️',
    website: 'https://davidchen.tokyo',
    followersCount: 76500,
    followingCount: 390,
    postsCount: 1,
    highlights: [
      { id: 'h_d1', title: 'Shinjuku 🏮', coverUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=400&h=400&q=80' },
      { id: 'h_d2', title: 'NightWalk ⚡', coverUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=400&h=400&q=80' }
    ]
  },
  user_chloe: {
    ...USERS.chloe_botanicals,
    bio: 'Biophilic Interior Architect & Botanist 🌿🏡\nCreating lush, living sanctuaries indoors.\nAuthor of "Green Living Spaces" 📖',
    website: 'https://chloebotanicals.com',
    followersCount: 43200,
    followingCount: 480,
    postsCount: 1,
    highlights: [
      { id: 'h_c1', title: 'Plants 🌿', coverUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80' }
    ]
  }
};

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_current',
    user: {
      id: CURRENT_USER.id,
      username: CURRENT_USER.username,
      name: CURRENT_USER.name,
      avatar: CURRENT_USER.avatar
    },
    mediaUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1080&h=1920&q=85',
    timestamp: '15m ago',
    seen: false,
    caption: 'Tokyo night walk in Shibuya 🌙✨'
  },
  {
    id: 'story_elena',
    user: USERS.elena_art,
    mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1080&h=1920&q=85',
    timestamp: '1h ago',
    seen: false,
    caption: 'Morning light in the studio ☕',
    poll: {
      id: 'poll_elena_1',
      question: 'Which palette for the new exhibition? 🎨',
      options: [
        { id: 'opt_1', text: 'Warm Terracotta 🏺', votes: 46 },
        { id: 'opt_2', text: 'Cerulean Blue 🌊', votes: 54 }
      ],
      totalVotes: 100
    }
  },
  {
    id: 'story_kai',
    user: USERS.wanderlust_kai,
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&h=1920&q=85',
    timestamp: '2h ago',
    seen: false,
    caption: 'Yosemite valley at sunrise 🌲'
  },
  {
    id: 'story_marco',
    user: USERS.marco_kitchen,
    mediaUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1080&h=1920&q=85',
    timestamp: '3h ago',
    seen: false,
    caption: 'Fresh batch of sourdough straight out of the hearth 🔥'
  },
  {
    id: 'story_sophia',
    user: USERS.sophia_vogue,
    mediaUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1080&h=1920&q=85',
    timestamp: '4h ago',
    seen: true,
    caption: 'Paris Fashion Week fitting details 🖤'
  },
  {
    id: 'story_david',
    user: USERS.david_urban,
    mediaUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1080&h=1920&q=85',
    timestamp: '6h ago',
    seen: true,
    caption: 'Shinjuku reflections after the rain 🌧️'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_curr_1',
    user: {
      id: CURRENT_USER.id,
      username: CURRENT_USER.username,
      name: CURRENT_USER.name,
      avatar: CURRENT_USER.avatar,
      isVerified: CURRENT_USER.isVerified
    },
    mediaUrls: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&h=1200&q=85',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&h=1200&q=85'
    ],
    caption: 'Tokyo twilight perspectives. Where traditional pagodas meet modern neon architecture. Finding peaceful geometry in the heart of the metropolis 🌸🏙️',
    location: 'Shinjuku Gyoen, Tokyo, Japan',
    tags: ['#tokyo', '#architecture', '#design', '#cityscape', '#minimal'],
    timestamp: '1 HOUR AGO',
    createdAt: Date.now() - 1 * 3600 * 1000,
    likesCount: 3410,
    isLiked: false,
    isSaved: false,
    filterClass: 'filter-normal',
    comments: [
      {
        id: 'c_curr_1',
        postId: 'post_curr_1',
        user: USERS.elena_art,
        text: 'The framing on the pagoda in the background is sublime Jatin! 🔥',
        timestamp: '40m',
        likesCount: 16,
        isLiked: true
      },
      {
        id: 'c_curr_2',
        postId: 'post_curr_1',
        user: USERS.wanderlust_kai,
        text: 'Next time we must shoot together in Shibuya at dawn 📸',
        timestamp: '25m',
        likesCount: 6,
        isLiked: false
      }
    ]
  },
  {
    id: 'post_1',
    user: USERS.wanderlust_kai,
    mediaUrls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=1200&q=85',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&h=1200&q=85',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&h=1200&q=85'
    ],
    caption: 'Golden hour along the coast of Amalfi. No filter needed when the Mediterranean light paints everything in gold 🌊☀️ Have you ever visited southern Italy?',
    location: 'Positano, Amalfi Coast, Italy',
    tags: ['#amalficoast', '#positano', '#italy', '#travelgram', '#goldenhour'],
    timestamp: '2 HOURS AGO',
    createdAt: Date.now() - 2 * 3600 * 1000,
    likesCount: 2845,
    isLiked: false,
    isSaved: false,
    filterClass: 'filter-normal',
    comments: [
      {
        id: 'c_1',
        postId: 'post_1',
        user: USERS.elena_art,
        text: 'The color grading in this series is breathtaking Kai! 😍',
        timestamp: '1h',
        likesCount: 14,
        isLiked: true
      },
      {
        id: 'c_2',
        postId: 'post_1',
        user: USERS.marco_kitchen,
        text: 'Did you grab some lemon granita down by the beach?',
        timestamp: '45m',
        likesCount: 5,
        isLiked: false
      }
    ]
  },
  {
    id: 'post_2',
    user: USERS.elena_art,
    mediaUrls: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&h=1200&q=85'
    ],
    caption: 'Minimalist geometry in modern Scandinavian architecture. When sunlight becomes part of the interior palette 📐🏛️',
    location: 'Copenhagen, Denmark',
    tags: ['#architecture', '#minimalism', '#copenhagen', '#designinspiration'],
    timestamp: '5 HOURS AGO',
    createdAt: Date.now() - 5 * 3600 * 1000,
    likesCount: 1492,
    isLiked: true,
    isSaved: true,
    filterClass: 'filter-lark',
    comments: [
      {
        id: 'c_3',
        postId: 'post_2',
        user: {
          id: CURRENT_USER.id,
          username: CURRENT_USER.username,
          name: CURRENT_USER.name,
          avatar: CURRENT_USER.avatar
        },
        text: 'Such clean lines and peaceful shadows. Outstanding composition!',
        timestamp: '3h',
        likesCount: 8,
        isLiked: false
      }
    ]
  },
  {
    id: 'post_3',
    user: USERS.marco_kitchen,
    mediaUrls: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&h=1200&q=85',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&h=1200&q=85'
    ],
    caption: 'Wood-fired Napoletana sourdough pizza. 72-hour cold fermentation with San Marzano tomatoes and buffalo mozzarella. Simplicity is the ultimate sophistication 🍕🌿',
    location: 'Naples, Italy',
    tags: ['#pizza', '#napoletana', '#sourdough', '#foodporn', '#italianeats'],
    timestamp: '8 HOURS AGO',
    createdAt: Date.now() - 8 * 3600 * 1000,
    likesCount: 3910,
    isLiked: false,
    isSaved: false,
    filterClass: 'filter-clarendon',
    comments: [
      {
        id: 'c_4',
        postId: 'post_3',
        user: USERS.sophia_vogue,
        text: 'Now I am craving pizza at midnight! That crust blistering is perfection 🤤',
        timestamp: '6h',
        likesCount: 12,
        isLiked: false
      },
      {
        id: 'c_5',
        postId: 'post_3',
        user: USERS.wanderlust_kai,
        text: 'Save a slice for me next time I pass through Napoli! 🙌',
        timestamp: '4h',
        likesCount: 3,
        isLiked: false
      }
    ]
  },
  {
    id: 'post_4',
    user: USERS.david_urban,
    mediaUrls: [
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&h=1200&q=85'
    ],
    caption: 'Neon dreams and rainy reflections in Shinjuku alleys. Cyberpunk reality alive in every puddle 🏮⚡',
    location: 'Shinjuku, Tokyo, Japan',
    tags: ['#tokyo', '#streetphotography', '#neon', '#cyberpunk', '#nightwalk'],
    timestamp: '12 HOURS AGO',
    createdAt: Date.now() - 12 * 3600 * 1000,
    likesCount: 5204,
    isLiked: true,
    isSaved: false,
    filterClass: 'filter-juno',
    comments: [
      {
        id: 'c_6',
        postId: 'post_4',
        user: USERS.elena_art,
        text: 'The wet asphalt reflects the neon glow so intensely. Masterful night shot!',
        timestamp: '10h',
        likesCount: 9,
        isLiked: false
      }
    ]
  },
  {
    id: 'post_chloe_1',
    user: USERS.chloe_botanicals,
    mediaUrls: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&h=1200&q=85'
    ],
    caption: 'Bringing the garden indoors. Light filtering through Monstera Deliciosa and Ficus lyrata leaves creates the most calming sanctuary 🌿🪴',
    location: 'Botanical Studio, Lyon, France',
    tags: ['#indoorplants', '#biophilic', '#urbanjungle', '#plantlover'],
    timestamp: '18 HOURS AGO',
    createdAt: Date.now() - 18 * 3600 * 1000,
    likesCount: 2190,
    isLiked: false,
    isSaved: false,
    filterClass: 'filter-lark',
    comments: [
      {
        id: 'c_chloe_1',
        postId: 'post_chloe_1',
        user: USERS.sophia_vogue,
        text: 'I need tips on keeping my fiddle leaf fig this vibrant! Stunning space.',
        timestamp: '15h',
        likesCount: 5,
        isLiked: false
      }
    ]
  },
  {
    id: 'post_5',
    user: USERS.sophia_vogue,
    mediaUrls: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&h=1200&q=85'
    ],
    caption: 'Neutrals, oversized wool tailoring, and autumn leaves along Boulevard Saint-Germain. Autumn in Paris has a warmth that stays with you 🍂🧥',
    location: 'Paris, France',
    tags: ['#parisianstyle', '#autumnfashion', '#streetstyle', '#parisfashion'],
    timestamp: '1 DAY AGO',
    createdAt: Date.now() - 24 * 3600 * 1000,
    likesCount: 4120,
    isLiked: false,
    isSaved: true,
    filterClass: 'filter-vintage',
    comments: [
      {
        id: 'c_7',
        postId: 'post_5',
        user: USERS.chloe_botanicals,
        text: 'Obsessed with the tone of that trench coat! Where is it from?',
        timestamp: '22h',
        likesCount: 7,
        isLiked: false
      }
    ]
  },
  {
    id: 'post_curr_2',
    user: {
      id: CURRENT_USER.id,
      username: CURRENT_USER.username,
      name: CURRENT_USER.name,
      avatar: CURRENT_USER.avatar,
      isVerified: CURRENT_USER.isVerified
    },
    mediaUrls: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&h=1200&q=85'
    ],
    caption: 'Quiet mornings along the cliffside terraces of Positano. Lemons, salty breeze, and morning espresso 🍋☕',
    location: 'Amalfi Coast, Italy',
    tags: ['#amalfi', '#travel', '#espresso', '#mediterranean'],
    timestamp: '2 DAYS AGO',
    createdAt: Date.now() - 48 * 3600 * 1000,
    likesCount: 4890,
    isLiked: true,
    isSaved: true,
    filterClass: 'filter-clarendon',
    comments: [
      {
        id: 'c_curr_3',
        postId: 'post_curr_2',
        user: USERS.marco_kitchen,
        text: 'Nothing beats fresh sfogliatella in the morning there!',
        timestamp: '1d',
        likesCount: 11,
        isLiked: false
      }
    ]
  }
];

export const INITIAL_REELS: Reel[] = [
  {
    id: 'reel_1',
    user: USERS.wanderlust_kai,
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=720&h=1280&q=85',
    caption: 'Waking up above the cloud inversion in the Swiss Alps 🏔️✨',
    musicTitle: 'Ludovico Einaudi • Nuvole Bianche',
    likesCount: 48900,
    commentsCount: 1240,
    sharesCount: 3890,
    isLiked: true,
    isSaved: true,
    filterClass: 'filter-clarendon'
  },
  {
    id: 'reel_2',
    user: USERS.david_urban,
    mediaUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=720&h=1280&q=85',
    caption: 'Tokyo metro cinematic transit moments 🚄 Neon flashes and speed',
    musicTitle: 'Kavinsky • Nightcall (Synthwave Remix)',
    likesCount: 82100,
    commentsCount: 2310,
    sharesCount: 9400,
    isLiked: false,
    isSaved: false,
    filterClass: 'filter-dramatic'
  },
  {
    id: 'reel_3',
    user: USERS.marco_kitchen,
    mediaUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=720&h=1280&q=85',
    caption: 'Pouring the silky microfoam for this morning flat white ☕ Rosetta art',
    musicTitle: 'Acoustic Chill Beats • Morning Brew',
    likesCount: 31200,
    commentsCount: 840,
    sharesCount: 1950,
    isLiked: false,
    isSaved: false,
    filterClass: 'filter-lark'
  },
  {
    id: 'reel_4',
    user: USERS.sophia_vogue,
    mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=720&h=1280&q=85',
    caption: 'Autumn wardrobe transitions: 4 ways to style structured trench coats ✨',
    musicTitle: 'Dua Lipa • Dance The Night (Chic Edit)',
    likesCount: 65400,
    commentsCount: 1980,
    sharesCount: 5200,
    isLiked: true,
    isSaved: false,
    filterClass: 'filter-vintage'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'like',
    user: USERS.elena_art,
    postPreviewUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=200&h=200&q=80',
    timestamp: '15m ago',
    isRead: false
  },
  {
    id: 'notif_2',
    type: 'comment',
    user: USERS.wanderlust_kai,
    text: 'commented: "Incredible perspective brother! Keep shooting!"',
    postPreviewUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=200&h=200&q=80',
    timestamp: '1h ago',
    isRead: false
  },
  {
    id: 'notif_3',
    type: 'follow',
    user: USERS.sophia_vogue,
    timestamp: '3h ago',
    isRead: false
  },
  {
    id: 'notif_4',
    type: 'like',
    user: USERS.marco_kitchen,
    postPreviewUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&h=200&q=80',
    timestamp: '1d ago',
    isRead: true
  },
  {
    id: 'notif_5',
    type: 'mention',
    user: USERS.david_urban,
    text: 'mentioned you in a story: "@jatindev in the city 🌃"',
    timestamp: '2d ago',
    isRead: true
  }
];

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv_group_visual_guild',
    participant: {
      id: 'group_visual_guild',
      username: 'light_collective',
      name: 'Lens & Light Collective',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&h=400&q=80'
    },
    isGroup: true,
    groupName: 'Lens & Light Collective',
    groupAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&h=400&q=80',
    groupDescription: 'Private collective for visual creators, photographers & filmmakers. Discussing natural lighting, editorial shoots, and upcoming gallery collabs.',
    isGroupPublic: false,
    ownerId: CURRENT_USER.id,
    adminIds: [CURRENT_USER.id, USERS.elena_art.id],
    groupMessagingPermission: 'all',
    restrictedMessengerIds: [],
    inviteCode: 'light-collective',
    pendingJoinRequests: [
      {
        id: 'req_join_1',
        user: USERS.sophia_vogue,
        requestedAt: '12m ago'
      },
      {
        id: 'req_join_2',
        user: USERS.chloe_botanicals,
        requestedAt: '1h ago'
      }
    ],
    groupMembers: [
      {
        id: CURRENT_USER.id,
        username: CURRENT_USER.username,
        name: CURRENT_USER.name,
        avatar: CURRENT_USER.avatar,
        isVerified: CURRENT_USER.isVerified
      },
      USERS.elena_art,
      USERS.wanderlust_kai,
      USERS.david_urban
    ],
    lastMessage: 'Elena: The new studio keycard is ready for everyone!',
    lastMessageTime: '1:15 PM',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 'msg_g1',
        senderId: 'system',
        text: 'Lens & Light Collective created by Jatin Dev Singh. Group set to Private.',
        timestamp: '11:00 AM'
      },
      {
        id: 'msg_g2',
        senderId: CURRENT_USER.id,
        text: 'Welcome everyone! Excited to organize our upcoming studio session here ✨',
        timestamp: '11:05 AM',
        status: 'seen'
      },
      {
        id: 'msg_g3',
        senderId: USERS.elena_art.id,
        text: 'The new studio keycard is ready for everyone! Let me know if you need early access.',
        timestamp: '1:15 PM'
      }
    ]
  },
  {
    id: 'conv_group_tokyo_walk',
    participant: {
      id: 'group_tokyo_walk',
      username: 'tokyo_walk',
      name: 'Tokyo Street Nocturnes',
      avatar: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&h=400&q=80'
    },
    isGroup: true,
    groupName: 'Tokyo Street Nocturnes',
    groupAvatar: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&h=400&q=80',
    groupDescription: 'Public group sharing urban exploration locations, neon lighting spots, and weekend street walks around Shinjuku & Shibuya.',
    isGroupPublic: true,
    ownerId: USERS.david_urban.id,
    adminIds: [USERS.david_urban.id],
    groupMessagingPermission: 'all',
    restrictedMessengerIds: [],
    inviteCode: 'tokyo-night',
    groupMembers: [
      USERS.david_urban,
      {
        id: CURRENT_USER.id,
        username: CURRENT_USER.username,
        name: CURRENT_USER.name,
        avatar: CURRENT_USER.avatar,
        isVerified: CURRENT_USER.isVerified
      },
      USERS.wanderlust_kai
    ],
    lastMessage: 'David: Gathering in front of Omoide Yokocho at 8 PM tonight!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 'msg_t1',
        senderId: USERS.david_urban.id,
        text: 'Gathering in front of Omoide Yokocho at 8 PM tonight! Bring rain gear just in case 🌧️',
        timestamp: 'Yesterday 6:30 PM'
      }
    ]
  },
  {
    id: 'conv_elena',
    participant: USERS.elena_art,
    lastMessage: 'Let me know which lens you used for that Copenhagen series!',
    lastMessageTime: '12:45 PM',
    unreadCount: 1,
    isOnline: true,
    isRecipientInChat: true,
    listIds: ['list_school', 'list_friends'],
    lastSeenByRecipient: {
      messageId: 'm2',
      timestamp: '12:38 PM'
    },
    messages: [
      {
        id: 'm1',
        senderId: 'user_elena',
        text: 'Hey Jatin! Loved your recent shots from Tokyo.',
        timestamp: '12:30 PM'
      },
      {
        id: 'm2',
        senderId: 'user_current',
        text: 'Thanks so much Elena! Tokyo never sleeps, truly endless inspiration.',
        timestamp: '12:35 PM',
        status: 'seen',
        seenAt: '12:38 PM'
      },
      {
        id: 'm3',
        senderId: 'user_elena',
        text: 'Let me know which lens you used for that Copenhagen series!',
        timestamp: '12:45 PM'
      }
    ]
  },

  {
    id: 'conv_sophia',
    participant: USERS.sophia_vogue,
    lastMessage: 'Are we still good for the studio shoot this Friday?',
    lastMessageTime: '10:22 AM',
    unreadCount: 2,
    isOnline: true,
    isRecipientInChat: false,
    listIds: ['list_family'],
    lastSeenByRecipient: {
      messageId: 'm_s2',
      timestamp: '10:15 AM'
    },
    messages: [
      {
        id: 'm_s1',
        senderId: 'user_sophia',
        text: 'Loved the lookbook moodboard you sent over!',
        timestamp: '10:10 AM'
      },
      {
        id: 'm_s2',
        senderId: 'user_current',
        text: 'Let’s definitely lock in the shoot details for next Friday!',
        timestamp: '10:14 AM',
        status: 'seen',
        seenAt: '10:15 AM'
      },
      {
        id: 'm_s3',
        senderId: 'user_sophia',
        text: 'Are we still good for the studio shoot this Friday?',
        timestamp: '10:20 AM'
      },
      {
        id: 'm_s4',
        senderId: 'user_sophia',
        text: 'I booked the lighting equipment as well 💡',
        timestamp: '10:22 AM'
      }
    ]
  },
  {
    id: 'conv_kai',
    participant: USERS.wanderlust_kai,
    lastMessage: 'Sent you the pin for that Amalfi lookout cliff 📍',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
    isOnline: false,
    isRecipientInChat: false,
    lastSeenByRecipient: {
      messageId: 'm5',
      timestamp: 'Yesterday 3:21 PM'
    },
    messages: [
      {
        id: 'm4',
        senderId: 'user_kai',
        text: 'Yo! Planning the next Dolomites trek next month.',
        timestamp: 'Yesterday 3:15 PM'
      },
      {
        id: 'm5',
        senderId: 'user_current',
        text: 'Count me in! Weather should be crisp and perfect for morning mist.',
        timestamp: 'Yesterday 3:20 PM',
        status: 'seen',
        seenAt: 'Yesterday 3:21 PM'
      },
      {
        id: 'm6',
        senderId: 'user_kai',
        text: 'Sent you the pin for that Amalfi lookout cliff 📍',
        timestamp: 'Yesterday 3:22 PM'
      }
    ]
  },
  {
    id: 'conv_david',
    participant: USERS.david_urban,
    lastMessage: 'Yes, I can lend you the 35mm lens tomorrow afternoon!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isOnline: true,
    isRecipientInChat: false,
    messages: [
      {
        id: 'm_d1',
        senderId: 'user_david',
        text: 'Hey Jatin, do you still have that 35mm lens?',
        timestamp: 'Yesterday 4:50 PM'
      },
      {
        id: 'm_d2',
        senderId: 'user_current',
        text: 'Yes, I can lend you the 35mm lens tomorrow afternoon!',
        timestamp: 'Yesterday 5:12 PM',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'conv_marco',
    participant: USERS.marco_kitchen,
    lastMessage: 'Next time you are in Rome we have to do espresso tasting!',
    lastMessageTime: '2d ago',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 'm7',
        senderId: 'user_marco',
        text: 'Next time you are in Rome we have to do espresso tasting!',
        timestamp: '2d ago'
      }
    ]
  }
];

export const FILTER_PRESETS: FilterPreset[] = [
  { id: 'normal', name: 'Normal', filterClass: 'filter-normal', previewColor: '#cbd5e1' },
  { id: 'clarendon', name: 'Clarendon', filterClass: 'filter-clarendon', previewColor: '#38bdf8' },
  { id: 'lark', name: 'Lark', filterClass: 'filter-lark', previewColor: '#86efac' },
  { id: 'juno', name: 'Juno', filterClass: 'filter-juno', previewColor: '#f472b6' },
  { id: 'slumber', name: 'Slumber', filterClass: 'filter-slumber', previewColor: '#fdba74' },
  { id: 'ludwig', name: 'Ludwig', filterClass: 'filter-ludwig', previewColor: '#d8b4fe' },
  { id: 'reyes', name: 'Reyes', filterClass: 'filter-reyes', previewColor: '#fef08a' },
  { id: 'moon', name: 'Moon (B&W)', filterClass: 'filter-moon', previewColor: '#94a3b8' },
  { id: 'vintage', name: 'Vintage', filterClass: 'filter-vintage', previewColor: '#e2e8f0' },
  { id: 'dramatic', name: 'Dramatic', filterClass: 'filter-dramatic', previewColor: '#64748b' }
];

export const EXPLORE_PRESETS = [
  {
    id: 'exp_1',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&h=800&q=80',
    likesCount: 12400,
    commentsCount: 340,
    type: 'photo',
    category: 'Travel'
  },
  {
    id: 'exp_2',
    mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&h=1200&q=80',
    likesCount: 8920,
    commentsCount: 215,
    type: 'reel',
    category: 'Architecture'
  },
  {
    id: 'exp_3',
    mediaUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&h=800&q=80',
    likesCount: 5430,
    commentsCount: 180,
    type: 'photo',
    category: 'Food'
  },
  {
    id: 'exp_4',
    mediaUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&h=800&q=80',
    likesCount: 9810,
    commentsCount: 420,
    type: 'photo',
    category: 'Photography'
  },
  {
    id: 'exp_5',
    mediaUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&h=800&q=80',
    likesCount: 14200,
    commentsCount: 560,
    type: 'photo',
    category: 'Style'
  },
  {
    id: 'exp_6',
    mediaUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&h=1200&q=80',
    likesCount: 28400,
    commentsCount: 910,
    type: 'reel',
    category: 'Travel'
  },
  {
    id: 'exp_7',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=800&q=80',
    likesCount: 16700,
    commentsCount: 490,
    type: 'photo',
    category: 'Nature'
  },
  {
    id: 'exp_8',
    mediaUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&h=800&q=80',
    likesCount: 7600,
    commentsCount: 190,
    type: 'photo',
    category: 'Food'
  },
  {
    id: 'exp_9',
    mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&h=800&q=80',
    likesCount: 11300,
    commentsCount: 310,
    type: 'photo',
    category: 'Style'
  }
];

export const PRESET_CREATION_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&h=1200&q=85',
    title: 'Road Trip Sunset',
    location: 'Route 66, Arizona'
  },
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=1200&q=85',
    title: 'Modern Villa',
    location: 'Beverly Hills, California'
  },
  {
    url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&h=1200&q=85',
    title: 'Autumn Trail',
    location: 'Banff National Park, Canada'
  },
  {
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&h=1200&q=85',
    title: 'Neon Reflection',
    location: 'Ginza, Tokyo'
  },
  {
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&h=1200&q=85',
    title: 'Coffee Barista',
    location: 'Melbourne, Australia'
  },
  {
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&h=1200&q=85',
    title: 'Artisan Bakery',
    location: 'Paris, France'
  }
];

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm_film',
    name: 'Analog & Silver',
    slug: 'analog-silver',
    description: 'A dedicated enclave for medium format, 35mm grain, darkroom printing, and chemistry experiments.',
    about: 'We celebrate deliberate photography. No burst modes, no algorithmic sharpening. Share film recipes, camera restorations, negative scans, and critical feedback.',
    avatar: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&h=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=1200&h=400&q=80',
    isPrivate: false,
    ownerId: 'user_current',
    ownerName: 'Jatin Dev Singh',
    moderators: ['user_current', 'user_elena'],
    membersCount: 4280,
    isJoined: true,
    topicTags: ['Photography', '35mm', 'Darkroom', 'FilmCraft', 'Kodak'],
    rules: [
      'State film stock and camera gear in discussion titles',
      'Critique with gentleness and technical clarity',
      'No AI-generated imagery disguised as analog'
    ],
    channels: [
      { id: 'ch_film_general', name: 'general-chat', description: 'General film talk and community chatter', type: 'chat' },
      { id: 'ch_film_announcements', name: 'announcements', description: 'Darkroom updates and print exchange notices', type: 'announcements' },
      { id: 'ch_film_scans', name: 'film-scans', description: 'Showcase 35mm and 120 negative scans', type: 'media' },
      { id: 'ch_film_meetups', name: 'local-meetups', description: 'Spontaneous photowalks and camera swaps', type: 'meetups' }
    ],
    moderationConfig: {
      slowModeSeconds: 0,
      wordFilters: ['spam', 'buy followers', 'cheap crypto'],
      requireApproval: false,
      bannedUserIds: [],
      rules: [
        'State film stock and camera gear in discussion titles',
        'Critique with gentleness and technical clarity',
        'No AI-generated imagery disguised as analog'
      ]
    },
    contributorBadges: [
      { userId: 'user_current', badge: '🏆', title: 'Founding Contributor' },
      { userId: 'user_elena', badge: '📷', title: 'Master Printer' }
    ],
    createdAt: '4 months ago',
    activeDiscussionsCount: 38
  },
  {
    id: 'comm_slow_living',
    name: 'Slow Living & Rituals',
    slug: 'slow-living',
    description: 'Intentional pace, quiet mornings, mindful objects, handwritten correspondence, and stillness.',
    about: 'A counterweight to the hyper-velocity feed. We discuss offline sabbath days, tea ceremonies, woodworking, analogue journaling, and unhurried design.',
    avatar: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&h=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&h=400&q=80',
    isPrivate: false,
    ownerId: 'user_maya',
    ownerName: 'Maya Lin',
    moderators: ['user_maya'],
    membersCount: 3120,
    isJoined: true,
    topicTags: ['Mindfulness', 'Rituals', 'Journaling', 'Minimalism'],
    rules: [
      'Foster peaceful reflection, avoid sensationalism',
      'Respect everyone’s chosen rhythm'
    ],
    createdAt: '6 months ago',
    activeDiscussionsCount: 24
  },
  {
    id: 'comm_brutalist',
    name: 'Concrete & Horizon',
    slug: 'concrete-horizon',
    description: 'Raw materials, modernist geometry, heroic facades, brutalist architecture, and urban shadows.',
    about: 'Documenting the poetry of pre-cast concrete, sculptural stairwells, and modernist utopias across global metropolises.',
    avatar: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&h=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=400&q=80',
    isPrivate: false,
    ownerId: 'user_elena',
    ownerName: 'Elena Rostova',
    moderators: ['user_elena'],
    membersCount: 2640,
    isJoined: true,
    topicTags: ['Architecture', 'Brutalism', 'Urbanism', 'Geometry'],
    rules: [
      'Include architect name and construction decade if known',
      'High-resolution imagery encouraged'
    ],
    createdAt: '3 months ago',
    activeDiscussionsCount: 19
  },
  {
    id: 'comm_ambient',
    name: 'Ambient Resonance',
    slug: 'ambient-resonance',
    description: 'Field recordings, tape loops, modular synthesizers, acoustic spaces, and meditative frequencies.',
    about: 'For sound artists, drone lovers, and producers exploring the quiet boundaries of hearing and space.',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&h=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&h=400&q=80',
    isPrivate: false,
    ownerId: 'user_kai',
    ownerName: 'Kai Tanaka',
    moderators: ['user_kai'],
    membersCount: 1890,
    isJoined: true,
    topicTags: ['Sound', 'Ambient', 'FieldRecordings', 'Synthesis'],
    rules: [
      'Share patch notes or microphone techniques when posting samples',
      'Honor silence as much as sound'
    ],
    createdAt: '2 months ago',
    activeDiscussionsCount: 15
  },
  {
    id: 'comm_writers',
    name: 'The Marginalia Guild',
    slug: 'marginalia-guild',
    description: 'Private salon for essayists, poets, and deep reading circles.',
    about: 'An intimate, private sanctuary for sharing unfinished prose, close textual analysis, and philosophical inquiries.',
    avatar: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&h=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&h=400&q=80',
    isPrivate: true,
    ownerId: 'user_elena',
    ownerName: 'Elena Rostova',
    moderators: ['user_elena'],
    membersCount: 420,
    isJoined: false,
    topicTags: ['Writing', 'Poetry', 'Essays', 'Literature'],
    rules: [
      'Private community: respect confidentiality of shared drafts',
      'Thoughtful commentary over quick takes'
    ],
    createdAt: '5 months ago',
    activeDiscussionsCount: 41
  }
];

export const INITIAL_DISCUSSIONS: Discussion[] = [
  {
    id: 'disc_1',
    communityId: 'comm_film',
    communityName: 'Analog & Silver',
    author: {
      id: 'user_elena',
      username: 'elena_art',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
      isVerified: true
    },
    title: 'Why Tri-X pushed to 1600 produces more emotive architecture portraits than modern digital sensors',
    body: 'There is something irreplaceable in how silver halide crystals clump in heavy shadow gradation. When shooting high-contrast concrete at dusk, digital leaves you with synthetic, clinical black clipping. Tri-X 400 pushed two stops in Rodinal yields this sculptural, velvety soot that makes stone feel tactile. Here is my side-by-side test sheet and developer agitation timetable.',
    timestamp: '3 hours ago',
    createdAt: Date.now() - 3 * 3600 * 1000,
    upvotes: 142,
    downvotes: 4,
    userVote: 'up',
    commentsCount: 28,
    isPinned: true,
    tags: ['TriX', 'Darkroom', 'Architecture'],
    comments: [
      {
        id: 'comm_disc_1_1',
        discussionId: 'disc_1',
        user: {
          id: 'user_current',
          username: 'jatindev',
          name: 'Jatin Dev Singh',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
          isVerified: true
        },
        text: 'Completely agree on the highlight roll-off too. Digital blows to pure magenta/cyan fringe, whereas grain simply scatters the light organically.',
        timestamp: '2 hours ago',
        likesCount: 18,
        upvotes: 34,
        downvotes: 1,
        userVote: 'up',
        replies: [
          {
            id: 'comm_disc_1_1_reply',
            discussionId: 'disc_1',
            parentId: 'comm_disc_1_1',
            user: {
              id: 'user_elena',
              username: 'elena_art',
              name: 'Elena Rostova',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
              isVerified: true
            },
            text: 'Spot on Jatin! Especially with backlit windows in brutalist atriums.',
            timestamp: '1 hour ago',
            likesCount: 9,
            upvotes: 16,
            downvotes: 0,
            userVote: null
          }
        ]
      },
      {
        id: 'comm_disc_1_2',
        discussionId: 'disc_1',
        user: {
          id: 'user_kai',
          username: 'kai_sound',
          name: 'Kai Tanaka',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80',
          isVerified: true
        },
        text: 'What was your agitation frequency in Rodinal? 1:50 stand development or continuous first minute?',
        timestamp: '1 hour ago',
        likesCount: 5,
        upvotes: 11,
        downvotes: 0,
        userVote: null,
        replies: []
      }
    ]
  },
  {
    id: 'disc_2',
    communityId: 'comm_slow_living',
    communityName: 'Slow Living & Rituals',
    author: {
      id: 'user_maya',
      username: 'maya_lin',
      name: 'Maya Lin',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
      isVerified: true
    },
    title: 'The 7:00 AM analog hour: replacing early morning screen check with fountain pen & water glass',
    body: 'For the last 21 days I left my phone across the apartment in a wooden box until 8 AM. In that golden hour, I drink room-temperature water, write two unedited stream-of-consciousness pages in a leather notebook, and sit with whatever feeling arises without defensive entertainment.',
    timestamp: '5 hours ago',
    createdAt: Date.now() - 5 * 3600 * 1000,
    upvotes: 218,
    downvotes: 2,
    userVote: null,
    commentsCount: 34,
    isPinned: false,
    tags: ['Rituals', 'MorningRoutine', 'Journaling'],
    comments: [
      {
        id: 'comm_disc_2_1',
        discussionId: 'disc_2',
        user: {
          id: 'user_current',
          username: 'jatindev',
          name: 'Jatin Dev Singh',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
          isVerified: true
        },
        text: 'Doing this alongside the 14-day Twilight challenge has profoundly improved my focus depth.',
        timestamp: '3 hours ago',
        likesCount: 14,
        upvotes: 27,
        downvotes: 0,
        userVote: 'up',
        replies: []
      }
    ]
  },
  {
    id: 'disc_3',
    communityId: 'comm_brutalist',
    communityName: 'Concrete & Horizon',
    author: {
      id: 'user_current',
      username: 'jatindev',
      name: 'Jatin Dev Singh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
      isVerified: true
    },
    title: 'Barbican Estate after rainfall: How surface moisture transforms bush-hammered concrete textures',
    body: 'Most architectural photography searches for pristine dry sunshine. But brutalism truly breathes during wet weather. Dampness darkens the porous aggregate and reveals the board-marked grain left by wooden formwork fifty years ago.',
    timestamp: '1 day ago',
    createdAt: Date.now() - 24 * 3600 * 1000,
    upvotes: 312,
    downvotes: 7,
    userVote: 'up',
    commentsCount: 45,
    isPinned: false,
    tags: ['Barbican', 'London', 'Texture'],
    comments: []
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'chal_film_30',
    title: '30-Day Analog Film Diary',
    description: 'Capture exactly one frame per day on film. No digital safety backups. Trust your eye, calculate light manually, and log your thoughts.',
    icon: '🎞️',
    category: 'creativity',
    durationDays: 30,
    currentDay: 16,
    participantsCount: 1240,
    isJoined: true,
    isCompleted: false,
    userProgress: 16,
    momentumStreak: 16,
    communityId: 'comm_film',
    communityName: 'Analog & Silver',
    badgeReward: {
      name: 'Silver Disciplinarian',
      icon: '🎞️',
      description: 'Completed 30 consecutive days of single-frame analog shooting'
    },
    leaderboard: [
      {
        user: {
          id: 'user_current',
          username: 'jatindev',
          name: 'Jatin Dev Singh',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
          isVerified: true
        },
        streak: 16,
        progress: 16
      },
      {
        user: {
          id: 'user_elena',
          username: 'elena_art',
          name: 'Elena Rostova',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
          isVerified: true
        },
        streak: 16,
        progress: 16
      },
      {
        user: {
          id: 'user_kai',
          username: 'kai_sound',
          name: 'Kai Tanaka',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80',
          isVerified: true
        },
        streak: 14,
        progress: 14
      }
    ]
  },
  {
    id: 'chal_screen_twilight',
    title: 'Zero Screen-Time Twilight',
    description: 'Turn off all glowing devices 60 minutes before sleep. Substitute with books, ambient audio, acoustic instruments, or tactile craft.',
    icon: '🌙',
    category: 'mindfulness',
    durationDays: 14,
    currentDay: 11,
    participantsCount: 3100,
    isJoined: true,
    isCompleted: false,
    userProgress: 11,
    momentumStreak: 11,
    communityId: 'comm_slow_living',
    communityName: 'Slow Living & Rituals',
    badgeReward: {
      name: 'Twilight Restorer',
      icon: '🌙',
      description: 'Maintained 14 days of screen-free pre-sleep quietude'
    },
    leaderboard: [
      {
        user: {
          id: 'user_maya',
          username: 'maya_lin',
          name: 'Maya Lin',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
          isVerified: true
        },
        streak: 14,
        progress: 14
      },
      {
        user: {
          id: 'user_current',
          username: 'jatindev',
          name: 'Jatin Dev Singh',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
          isVerified: true
        },
        streak: 11,
        progress: 11
      }
    ]
  },
  {
    id: 'chal_city_geometry',
    title: 'Urban Shadows & Angles',
    description: 'Document 10 unexpected geometric shadow cast patterns in your daily city walks. Look for sharp diagonals and concrete contrasts.',
    icon: '📐',
    category: 'creativity',
    durationDays: 10,
    currentDay: 10,
    participantsCount: 890,
    isJoined: true,
    isCompleted: true,
    userProgress: 10,
    momentumStreak: 10,
    communityId: 'comm_brutalist',
    communityName: 'Concrete & Horizon',
    badgeReward: {
      name: 'Shadow Cartographer',
      icon: '📐',
      description: 'Successfully observed and mapped 10 architectural geometry moments'
    },
    leaderboard: [
      {
        user: {
          id: 'user_current',
          username: 'jatindev',
          name: 'Jatin Dev Singh',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
          isVerified: true
        },
        streak: 10,
        progress: 10
      }
    ]
  }
];

export const INITIAL_CIRCLES = [
  {
    id: 'circle_close_friends',
    name: 'Close Friends',
    icon: '⭐️',
    description: 'Closest friends & inner creative circle',
    userIds: ['user_elena', 'user_kai'],
    isDefault: true
  },
  {
    id: 'circle_family',
    name: 'Family',
    icon: '🏡',
    description: 'Immediate and extended family members',
    userIds: ['user_marco'],
    isDefault: true
  },
  {
    id: 'circle_school',
    name: 'School & Alumni',
    icon: '🎓',
    description: 'Classmates, campus clubs & design alumni',
    userIds: ['user_sophia', 'user_david'],
    isDefault: true
  },
  {
    id: 'circle_gaming',
    name: 'Gaming Squad',
    icon: '🎮',
    description: 'Discord & late night competitive roster',
    userIds: ['user_david', 'user_kai'],
    isDefault: true
  },
  {
    id: 'circle_local',
    name: 'Local Neighbors',
    icon: '📍',
    description: 'People in your immediate neighborhood',
    userIds: ['user_elena', 'user_chloe'],
    isDefault: true
  }
];

export const INITIAL_NEARBY_ACTIVITIES = [
  {
    id: 'act_badminton',
    title: '🏸 Badminton — 4/6 spots',
    category: 'sports' as const,
    icon: '🏸',
    time: 'Tonight · 6:30 PM',
    locationName: 'Civic Sports Complex • Court 3',
    distanceDesc: '1.2 km away',
    spotsTotal: 6,
    spotsTaken: 4,
    organizer: {
      id: 'user_david',
      username: 'david_urban',
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80',
      isVerified: false
    },
    attendees: [
      {
        id: 'user_david',
        username: 'david_urban',
        name: 'David Chen',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80'
      },
      {
        id: 'user_kai',
        username: 'wanderlust_kai',
        name: 'Kai Tanaka',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80'
      }
    ],
    description: 'Casual intermediate doubles rally! Rackets available if you need a spare. Bring non-marking shoes.',
    isJoined: false,
    privacyLevel: 'neighborhood' as const
  },
  {
    id: 'act_photowalk',
    title: '📷 Street Photography Walk',
    category: 'photography' as const,
    icon: '📷',
    time: 'Saturday · 5:00 PM',
    locationName: 'Arts District • West Promenade',
    distanceDesc: '2.4 km away',
    spotsTotal: 10,
    spotsTaken: 7,
    organizer: {
      id: 'user_elena',
      username: 'elena_art',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
      isVerified: true
    },
    attendees: [
      {
        id: 'user_elena',
        username: 'elena_art',
        name: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80'
      }
    ],
    description: 'Golden hour architectural & shadows walk along the industrial canals. Any camera welcome (digital or 35mm film). Finishing with coffee.',
    isJoined: true,
    privacyLevel: 'neighborhood' as const
  },
  {
    id: 'act_valorant',
    title: '🎮 Valorant community session',
    category: 'gaming' as const,
    icon: '🎮',
    time: 'Today · 8:00 PM',
    locationName: 'Community Discord / Online Server',
    distanceDesc: 'Online meetup',
    spotsTotal: 5,
    spotsTaken: 3,
    organizer: {
      id: 'user_kai',
      username: 'wanderlust_kai',
      name: 'Kai Tanaka',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
      isVerified: true
    },
    attendees: [
      {
        id: 'user_kai',
        username: 'wanderlust_kai',
        name: 'Kai Tanaka',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80'
      }
    ],
    description: 'Friendly unranked 5-stack games! Low-stress, good comms, mics preferred. Beginners welcome.',
    isJoined: false,
    privacyLevel: 'city' as const
  },
  {
    id: 'act_jam',
    title: '🎸 Open Jam',
    category: 'music' as const,
    icon: '🎸',
    time: 'Sunday · 4:00 PM',
    locationName: 'Riverside Amphitheater • East Lawn',
    distanceDesc: '3.1 km away',
    spotsTotal: 8,
    spotsTaken: 5,
    organizer: {
      id: 'user_marco',
      username: 'marco_kitchen',
      name: 'Marco Bellini',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      isVerified: false
    },
    attendees: [
      {
        id: 'user_marco',
        username: 'marco_kitchen',
        name: 'Marco Bellini',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80'
      }
    ],
    description: 'Acoustic jam in the park! Bring your guitar, cajón, or just come listen and vibe to indie and folk covers.',
    isJoined: false,
    privacyLevel: 'neighborhood' as const
  },
  {
    id: 'act_coffee',
    title: '☕ Weekend Tech & Creative Coffee',
    category: 'social' as const,
    icon: '☕',
    time: 'Saturday · 10:30 AM',
    locationName: 'Blueprint Roasters • Patio',
    distanceDesc: '0.8 km away',
    spotsTotal: 6,
    spotsTaken: 4,
    organizer: {
      id: 'user_chloe',
      username: 'chloe_botanicals',
      name: 'Chloé Martin',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
      isVerified: false
    },
    attendees: [
      {
        id: 'user_chloe',
        username: 'chloe_botanicals',
        name: 'Chloé Martin',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80'
      }
    ],
    description: 'Informal co-working & casual chat about side projects, AI workflows, and botanical design.',
    isJoined: false,
    privacyLevel: 'neighborhood' as const
  }
];
