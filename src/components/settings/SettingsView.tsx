import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Palette,
  Camera,
  Shield,
  Lock,
  Eye,
  Globe,
  Archive,
  Bookmark,
  Heart,
  Film,
  MessageCircle,
  Users,
  ChevronRight,
  Sun,
  Moon,
  Check,
  Search,
  Key,
  Download,
  LogOut,
  UserPlus,
  Sliders,
  Sparkles,
  ExternalLink,
  Trash2,
  FileText,
  UserCheck,
  Plus,
  Clock,
  UserX,
  AlertTriangle
} from 'lucide-react';
import { useApp, AppThemePreset, LIGHT_THEMES } from '../../context/AppContext';
import { INITIAL_LANGUAGES, getLanguageByCode } from '../../translations';
import { CustomPfpConfig, AvatarAudience } from '../../types';
import { ChangeSecretCodeModal } from '../chat/ChangeSecretCodeModal';

type SettingsSection =
  | 'appearance'
  | 'dual_avatar'
  | 'security'
  | 'privacy'
  | 'language'
  | 'activity'
  | 'legal'
  | 'account';

export const SettingsView: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    theme,
    systemTheme,
    setSystemTheme,
    toggleTheme,
    posts,
    reels,
    openLegalModal,
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
    updateCustomDualPfp,
    allUsers,
    hiddenProfileFromUserIds,
    toggleHideMyProfileFrom,
    preferredLanguage,
    setPreferredLanguage,
    currentLanguageOption,
    setActiveTab,
    securitySettings,
    updateSecuritySettings,
    t
  } = useApp();

  const [activeSection, setActiveSection] = useState<SettingsSection>('appearance');
  const [activitySubTab, setActivitySubTab] = useState<'saved' | 'liked' | 'archive' | 'watched' | 'commented'>('saved');
  const [searchQuery, setSearchQuery] = useState('');
  const [languageSearchQuery, setLanguageSearchQuery] = useState('');
  const [storyDuration, setStoryDuration] = useState<'24h' | '48h'>('48h');
  const [messageRestriction, setMessageRestriction] = useState<'everyone' | 'connections' | 'none'>('connections');
  const [showChangeSecretCodeModal, setShowChangeSecretCodeModal] = useState(false);

  // Security Passcode State
  const [pinInput, setPinInput] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);

  // Theme tab: Bright vs Dark presets
  const isCurrentThemeLight = LIGHT_THEMES.includes(systemTheme) || theme === 'light';
  const [themeTab, setThemeTab] = useState<'bright' | 'dark'>(() => (isCurrentThemeLight ? 'bright' : 'dark'));

  // Dual Custom Profile Picture State
  const [activePfpTab, setActivePfpTab] = useState<'pfp1' | 'pfp2'>('pfp1');
  const [pfp1, setPfp1] = useState<CustomPfpConfig>(() => {
    if (currentUser.pfp1Config) return currentUser.pfp1Config;
    return {
      id: 'pfp_custom_1',
      label: 'Profile Picture 1',
      url: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
      hasNoPfp: false,
      audience: 'everyone',
      customUserIds: [],
      customUsernames: []
    };
  });

  const [pfp2, setPfp2] = useState<CustomPfpConfig>(() => {
    if (currentUser.pfp2Config) return currentUser.pfp2Config;
    return {
      id: 'pfp_custom_2',
      label: 'Profile Picture 2',
      url: currentUser.secondaryAvatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop',
      hasNoPfp: false,
      audience: 'close_friends',
      customUserIds: [],
      customUsernames: []
    };
  });

  const [customUserSearch, setCustomUserSearch] = useState('');

  // Handle saving dual PFP config
  const handleSaveDualPfp = () => {
    updateCustomDualPfp(pfp1, pfp2);
    showToast('Dual Profile Picture configuration saved!');
  };

  // Activity items
  const savedPosts = posts.filter(p => p.isSaved);
  const likedPosts = posts.filter(p => p.isLiked);
  const archivedPosts = posts.filter(p => p.isArchived);

  // Themes list with vivid colors
  const brightThemes: {
    id: AppThemePreset;
    name: string;
    desc: string;
    bg: string;
    card: string;
    border: string;
    accent: string;
    text: string;
  }[] = [
    {
      id: 'light',
      name: 'Sunlight Day',
      desc: 'Clean pure daylight with crisp indigo accents',
      bg: '#f8fafc',
      card: '#ffffff',
      border: '#e2e8f0',
      accent: '#4f46e5',
      text: '#0f172a'
    },
    {
      id: 'nordic',
      name: 'Nordic Fjord',
      desc: 'Scandinavian arctic ice with royal blue tones',
      bg: '#edf3f8',
      card: '#f8fbfe',
      border: '#c4d8ec',
      accent: '#2563eb',
      text: '#0f172a'
    },
    {
      id: 'porcelain',
      name: 'Porcelain Pure',
      desc: 'Warm sunlit alabaster & antique amber sepia',
      bg: '#faf6ee',
      card: '#fffefb',
      border: '#decfae',
      accent: '#b45309',
      text: '#292524'
    },
    {
      id: 'mint_light',
      name: 'Mint Crisp',
      desc: 'Fresh eucalyptus & botanic spearmint dew',
      bg: '#ecfbf2',
      card: '#f8fef9',
      border: '#a8e6be',
      accent: '#059669',
      text: '#064e3b'
    },
    {
      id: 'rose_light',
      name: 'Rose Blossom',
      desc: 'Soft champagne peony & delicate rose quartz',
      bg: '#fdf2f4',
      card: '#fffbfb',
      border: '#f4b3c0',
      accent: '#e11d48',
      text: '#4c0519'
    }
  ];

  const darkThemes: {
    id: AppThemePreset;
    name: string;
    desc: string;
    bg: string;
    card: string;
    border: string;
    accent: string;
    text: string;
  }[] = [
    {
      id: 'dark',
      name: 'Cyber Lime',
      desc: 'Classic Yaawp deep slate with cyber lime punch',
      bg: '#09090b',
      card: '#18181b',
      border: '#3f3f46',
      accent: '#a3e635',
      text: '#f4f4f5'
    },
    {
      id: 'midnight',
      name: 'Midnight Navy',
      desc: 'Deep oceanic royal navy & brilliant sapphire glow',
      bg: '#050c1e',
      card: '#0c1d42',
      border: '#1d418f',
      accent: '#38bdf8',
      text: '#e0f2fe'
    },
    {
      id: 'obsidian',
      name: 'Obsidian OLED',
      desc: 'True pitch black OLED with titanium white contrast',
      bg: '#000000',
      card: '#0a0a0c',
      border: '#27272a',
      accent: '#ffffff',
      text: '#ffffff'
    },
    {
      id: 'cyber',
      name: 'Cyberpunk Violet',
      desc: 'Electric neon indigo, violet nebula & cyan laser',
      bg: '#060719',
      card: '#0f1330',
      border: '#262f74',
      accent: '#818cf8',
      text: '#e0e7ff'
    },
    {
      id: 'sunset',
      name: 'Sunset Ember',
      desc: 'Volcanic terracotta, scorched dusk & flame copper',
      bg: '#140905',
      card: '#24120a',
      border: '#542817',
      accent: '#f97316',
      text: '#ffedd5'
    },
    {
      id: 'emerald',
      name: 'Emerald Forest',
      desc: 'Alpine pine forest night & luminous jade green',
      bg: '#03140e',
      card: '#09281d',
      border: '#1a5c45',
      accent: '#10b981',
      text: '#d1fae5'
    }
  ];

  const handleSavePin = () => {
    if (pinInput.length !== 4) {
      showToast('PIN passcode must be exactly 4 digits');
      return;
    }
    if (pinInput !== pinConfirm) {
      showToast('PIN passcodes do not match');
      return;
    }
    updateSecuritySettings({
      isPasscodeEnabled: true,
      passcode: pinInput
    });
    setPinInput('');
    setPinConfirm('');
    setIsSettingPin(false);
    showToast('Security PIN passcode updated successfully!');
  };

  const navSections: { id: SettingsSection; label: string; icon: any; badge?: string }[] = [
    { id: 'appearance', label: 'Appearance & Themes', icon: Palette },
    { id: 'dual_avatar', label: 'Dual Profile Pictures', icon: Camera },
    { id: 'security', label: 'Security Suite & PIN', icon: Lock },
    { id: 'privacy', label: 'Privacy & Account', icon: Shield },
    { id: 'language', label: 'Language & Translation', icon: Globe },
    { id: 'activity', label: 'Your Activity & Archive', icon: Bookmark },
    { id: 'legal', label: 'Legal Center & Terms', icon: FileText, badge: 'Wrinkled Page' },
    { id: 'account', label: 'Account Management', icon: Users }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-lime-400 to-emerald-500 flex items-center justify-center text-zinc-950 shadow-md shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400">
                Preferences &amp; Governance
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Settings &amp; Activity
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('profile');
                navigate('/app/profile');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </header>

      {/* Main Two-Column Master-Detail Layout */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Left Navigation Master Sidebar */}
        <aside className="lg:col-span-4 space-y-3">
          {/* User Profile Summary Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-xs">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-lime-400/50"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                @{currentUser.username}
              </p>
            </div>
          </div>

          {/* Settings Section Pills */}
          <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            {navSections.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  id={`settings-tab-${section.id}`}
                  onClick={() => {
                    if (section.id === 'legal') {
                      setActiveTab('legal');
                      navigate('/app/legal');
                    } else {
                      setActiveSection(section.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-lime-400 text-zinc-950 font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{section.label}</span>
                  </div>
                  {section.badge ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold">
                      {section.badge}
                    </span>
                  ) : (
                    <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive ? 'text-zinc-950' : ''}`} />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Detail Content Panel */}
        <section className="lg:col-span-8 space-y-6">
          {/* ========================================================================= */}
          {/* 1. APPEARANCE & THEMES SECTION                                            */}
          {/* ========================================================================= */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Palette className="w-5 h-5 text-lime-500" />
                      App Atmosphere &amp; Themes
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Choose from 11 distinctly rendered atmospheric themes. Each preset features unique background, card surface, border, and accent colors.
                    </p>
                  </div>

                  {/* Bright vs Dark Category Switcher */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl shrink-0 self-start sm:self-auto">
                    <button
                      onClick={() => setThemeTab('bright')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        themeTab === 'bright'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Bright (5)
                    </button>
                    <button
                      onClick={() => setThemeTab('dark')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        themeTab === 'dark'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      Dark (6)
                    </button>
                  </div>
                </div>

                {/* Theme Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {(themeTab === 'bright' ? brightThemes : darkThemes).map(themeItem => {
                    const isSelected = systemTheme === themeItem.id;
                    return (
                      <button
                        key={themeItem.id}
                        id={`theme-select-${themeItem.id}`}
                        onClick={() => {
                          setSystemTheme(themeItem.id);
                          showToast(`Activated ${themeItem.name} Theme`);
                        }}
                        className={`group relative p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.99] flex flex-col justify-between overflow-hidden shadow-xs ${
                          isSelected
                            ? 'border-lime-500 ring-2 ring-lime-500/20 shadow-md'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                        style={{ backgroundColor: themeItem.bg }}
                      >
                        {/* Selected Checkmark Badge */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-lime-500 text-zinc-950 flex items-center justify-center shadow-md">
                            <Check className="w-4 h-4 stroke-[3px]" />
                          </div>
                        )}

                        <div className="space-y-2">
                          {/* Mini UI Swatch Preview */}
                          <div
                            className="p-3 rounded-xl border space-y-1.5 shadow-2xs"
                            style={{
                              backgroundColor: themeItem.card,
                              borderColor: themeItem.border
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="w-12 h-2 rounded-full" style={{ backgroundColor: themeItem.text, opacity: 0.8 }} />
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeItem.accent }} />
                            </div>
                            <div className="w-24 h-1.5 rounded-full" style={{ backgroundColor: themeItem.text, opacity: 0.3 }} />
                            <div
                              className="w-full h-5 rounded-lg flex items-center px-2 text-[9px] font-bold text-white shadow-2xs"
                              style={{ backgroundColor: themeItem.accent }}
                            >
                              Sample Button
                            </div>
                          </div>

                          <div className="pt-1">
                            <h3
                              className="text-sm font-black tracking-tight"
                              style={{ color: themeItem.text }}
                            >
                              {themeItem.name}
                            </h3>
                            <p
                              className="text-xs font-medium line-clamp-2 mt-0.5"
                              style={{ color: themeItem.text, opacity: 0.7 }}
                            >
                              {themeItem.desc}
                            </p>
                          </div>
                        </div>

                        {/* Color Swatch Dots */}
                        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-black/5 dark:border-white/5">
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60" style={{ color: themeItem.text }}>
                            Palette:
                          </span>
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: themeItem.bg }} title="Canvas" />
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: themeItem.card }} title="Card" />
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: themeItem.border }} title="Border" />
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: themeItem.accent }} title="Accent" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. DUAL PROFILE PICTURES SECTION                                          */}
          {/* ========================================================================= */}
          {activeSection === 'dual_avatar' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Camera className="w-5 h-5 text-lime-500" />
                      Dual Custom Profile Pictures
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Configure two independent profile pictures with custom audience visibility permissions.
                    </p>
                  </div>
                  <button
                    id="save-dual-pfp-btn"
                    onClick={handleSaveDualPfp}
                    className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[2.5px]" />
                    Save Configuration
                  </button>
                </div>

                {/* Tab Switcher: PFP 1 vs PFP 2 */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <button
                    onClick={() => setActivePfpTab('pfp1')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activePfpTab === 'pfp1'
                        ? 'bg-lime-400 text-zinc-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <img src={pfp1.url} alt="PFP 1" className="w-5 h-5 rounded-full object-cover" />
                    Profile Picture 1 (Primary)
                  </button>
                  <button
                    onClick={() => setActivePfpTab('pfp2')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activePfpTab === 'pfp2'
                        ? 'bg-lime-400 text-zinc-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <img src={pfp2.url} alt="PFP 2" className="w-5 h-5 rounded-full object-cover" />
                    Profile Picture 2 (Secondary)
                  </button>
                </div>

                {/* Active PFP Editor */}
                {activePfpTab === 'pfp1' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <img src={pfp1.url} alt="PFP 1 Preview" className="w-16 h-16 rounded-full object-cover ring-2 ring-lime-400" />
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Avatar Image URL</label>
                        <input
                          type="text"
                          value={pfp1.url}
                          onChange={e => setPfp1({ ...pfp1, url: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                          placeholder="Enter image URL..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Audience Visibility</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(['everyone', 'followers', 'close_friends', 'none'] as AvatarAudience[]).map(aud => (
                          <button
                            key={aud}
                            onClick={() => setPfp1({ ...pfp1, audience: aud })}
                            className={`p-2.5 rounded-xl border text-xs font-bold capitalize transition-all ${
                              pfp1.audience === aud
                                ? 'bg-lime-400 border-lime-500 text-zinc-950 shadow-xs'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {aud.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <img src={pfp2.url} alt="PFP 2 Preview" className="w-16 h-16 rounded-full object-cover ring-2 ring-lime-400" />
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Avatar Image URL</label>
                        <input
                          type="text"
                          value={pfp2.url}
                          onChange={e => setPfp2({ ...pfp2, url: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                          placeholder="Enter image URL..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Audience Visibility</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(['everyone', 'followers', 'close_friends', 'custom_users'] as AvatarAudience[]).map(aud => (
                          <button
                            key={aud}
                            onClick={() => setPfp2({ ...pfp2, audience: aud })}
                            className={`p-2.5 rounded-xl border text-xs font-bold capitalize transition-all ${
                              pfp2.audience === aud
                                ? 'bg-lime-400 border-lime-500 text-zinc-950 shadow-xs'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {aud.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. SECURITY SUITE & PIN SECTION                                           */}
          {/* ========================================================================= */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-lime-500" />
                    Security Suite &amp; PIN Passcode
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage your account security, 4-digit PIN passcode, biometric login, and hidden vault access code.
                  </p>
                </div>

                {/* PIN Passcode Toggle & Setup */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">4-Digit Security PIN</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {securitySettings?.isPasscodeEnabled ? 'PIN passcode is active' : 'No PIN passcode configured'}
                      </p>
                    </div>

                    <button
                      onClick={() => setIsSettingPin(!isSettingPin)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs"
                    >
                      {securitySettings?.isPasscodeEnabled ? 'Change PIN' : 'Set PIN'}
                    </button>
                  </div>

                  {isSettingPin && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">New 4-Digit PIN</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={pinInput}
                            onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
                            placeholder="••••"
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-center font-mono text-base tracking-widest text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Confirm PIN</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={pinConfirm}
                            onChange={e => setPinConfirm(e.target.value.replace(/\D/g, ''))}
                            placeholder="••••"
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-center font-mono text-base tracking-widest text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setIsSettingPin(false)}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSavePin}
                          className="px-4 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold text-xs shadow-xs"
                        >
                          Save PIN
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Secret Code for Hidden Vault */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Hidden Vault Secret Code</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Access hidden private chats and secret media vaults with a custom passphrase.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowChangeSecretCodeModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs"
                  >
                    Change Code
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. PRIVACY & ACCOUNT SECTION                                              */}
          {/* ========================================================================= */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-lime-500" />
                    Privacy &amp; Visibility Controls
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Control who can see your content, followers, and send you direct messages.
                  </p>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
                  {/* Private Account */}
                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Private Account</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Only approved followers can view your posts and stories.</p>
                    </div>
                    <button
                      onClick={toggleAccountPrivacy}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        isAccountPrivate ? 'bg-lime-400' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isAccountPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Hide Followers List */}
                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Hide Followers List</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Only you can view your full list of followers.</p>
                    </div>
                    <button
                      onClick={toggleFollowersPrivacy}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        isFollowersPrivate ? 'bg-lime-400' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isFollowersPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Story Duration */}
                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Story Visibility Duration</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Select standard 24 hours or extended 48 hours.</p>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <button
                        onClick={() => {
                          setStoryDuration('24h');
                          showToast('Story duration set to 24h');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          storyDuration === '24h' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                        }`}
                      >
                        24h
                      </button>
                      <button
                        onClick={() => {
                          setStoryDuration('48h');
                          showToast('Story duration set to 48h');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          storyDuration === '48h' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                        }`}
                      >
                        48h
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. LANGUAGE & TRANSLATION SECTION                                         */}
          {/* ========================================================================= */}
          {activeSection === 'language' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-lime-500" />
                    Language &amp; Localization
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Current active language: <span className="font-bold text-lime-600 dark:text-lime-400">{currentLanguageOption?.name} ({currentLanguageOption?.nativeName})</span>
                  </p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={languageSearchQuery}
                    onChange={e => setLanguageSearchQuery(e.target.value)}
                    placeholder="Search languages..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-1">
                  {INITIAL_LANGUAGES.filter(
                    l =>
                      l.name.toLowerCase().includes(languageSearchQuery.toLowerCase()) ||
                      l.nativeName.toLowerCase().includes(languageSearchQuery.toLowerCase())
                  ).map(lang => {
                    const isSelected = preferredLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setPreferredLanguage(lang.code);
                          showToast(`Language set to ${lang.name}`);
                        }}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-lime-400 border-lime-500 text-zinc-950 font-bold shadow-xs'
                            : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{lang.name}</div>
                          <div className="text-[11px] opacity-75">{lang.nativeName}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 stroke-[3px]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. YOUR ACTIVITY & ARCHIVE SECTION                                        */}
          {/* ========================================================================= */}
          {activeSection === 'activity' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-lime-500" />
                    Your Activity &amp; Saved Items
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Review your saved bookmarks, liked posts, and archived memories.
                  </p>
                </div>

                {/* Sub tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <button
                    onClick={() => setActivitySubTab('saved')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      activitySubTab === 'saved' ? 'bg-lime-400 text-zinc-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    Saved ({savedPosts.length})
                  </button>
                  <button
                    onClick={() => setActivitySubTab('liked')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      activitySubTab === 'liked' ? 'bg-lime-400 text-zinc-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    Liked ({likedPosts.length})
                  </button>
                  <button
                    onClick={() => setActivitySubTab('archive')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      activitySubTab === 'archive' ? 'bg-lime-400 text-zinc-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    Archived ({archivedPosts.length})
                  </button>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {(activitySubTab === 'saved' ? savedPosts : activitySubTab === 'liked' ? likedPosts : archivedPosts).map(
                    post => (
                      <div
                        key={post.id}
                        onClick={() => setSelectedPostForModal(post)}
                        className="aspect-square rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative group cursor-pointer"
                      >
                        <img src={post.image} alt="Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. ACCOUNT MANAGEMENT SECTION                                             */}
          {/* ========================================================================= */}
          {activeSection === 'account' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-lime-500" />
                    Account Governance
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage multi-account login, data export, or sign out.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsCreateAccountModalOpen(true)}
                    className="w-full p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-indigo-700 dark:text-indigo-300 font-bold text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <UserPlus className="w-4 h-4" />
                      <span>Add or Switch Another Account</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={exportUserData}
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-slate-800 dark:text-slate-200 font-bold text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4" />
                      <span>Export Your Data &amp; Archives (JSON)</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={signOutAccount}
                    className="w-full p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between text-rose-600 dark:text-rose-400 font-bold text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out of Yaawp</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Secret Code Modal if needed */}
      <ChangeSecretCodeModal
        isOpen={showChangeSecretCodeModal}
        onClose={() => setShowChangeSecretCodeModal(false)}
      />
    </div>
  );
};

export default SettingsView;
