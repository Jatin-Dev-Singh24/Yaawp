import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  Smile,
  Hash,
  Check,
  Lock,
  Globe,
  Users,
  Shield,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FILTER_PRESETS, PRESET_CREATION_PHOTOS } from '../data/mockData';
import { uploadMediaToSupabase } from '../lib/supabaseStorage';
import { DEFAULT_QUICK_REACTIONS, ALL_PRESET_EMOJIS, EMOJI_CATEGORIES } from '../data/emojis';

export const CreatePostModal: React.FC = () => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    currentUser,
    createPost,
    createStory,
    customCircles,
    communities,
    showToast
  } = useApp();

  const [step, setStep] = useState<'media' | 'filter' | 'caption'>('media');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('filter-normal');
  const [caption, setCaption] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [shareTarget, setShareTarget] = useState<'post' | 'story'>('post');
  const [audience, setAudience] = useState<'everyone' | 'followers' | 'close_friends' | 'custom_circle' | 'community'>('everyone');
  const [selectedCircleId, setSelectedCircleId] = useState<string>(customCircles[0]?.id || '');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>(communities[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Additional settings: Emoji controls
  const [showAdditionalSettings, setShowAdditionalSettings] = useState(false);
  const [customEmojiControl, setCustomEmojiControl] = useState(false);
  const [allowedEmojis, setAllowedEmojis] = useState<string[]>([...DEFAULT_QUICK_REACTIONS]);
  const [customEmojiInput, setCustomEmojiInput] = useState('');
  const [activeEmojiCategory, setActiveEmojiCategory] = useState<string>(EMOJI_CATEGORIES[0].name);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isCreateModalOpen) return null;

  const toggleAllowedEmoji = (emoji: string) => {
    setAllowedEmojis(prev => {
      if (prev.includes(emoji)) {
        if (prev.length <= 1) return prev;
        return prev.filter(e => e !== emoji);
      } else {
        return [...prev, emoji];
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setStep('filter');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setStep('filter');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string, loc: string) => {
    setSelectedFile(null);
    setSelectedImage(url);
    setLocation(loc);
    setStep('filter');
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setIsSubmitting(true);
    try {
      let finalMediaUrl = selectedImage;

      // Upload directly to Supabase Storage if user selected an actual file
      if (selectedFile) {
        const uploadRes = await uploadMediaToSupabase(
          selectedFile,
          shareTarget === 'post' ? 'posts' : 'stories',
          undefined,
          currentUser.id
        );
        if (uploadRes.url) {
          finalMediaUrl = uploadRes.url;
        }
      }

      if (shareTarget === 'post') {
        createPost({
          mediaUrls: [finalMediaUrl],
          caption,
          location: location.trim() || undefined,
          filterClass: selectedFilter,
          audience,
          audienceCircleId: audience === 'custom_circle' ? selectedCircleId : undefined,
          communityId: audience === 'community' ? selectedCommunityId : undefined,
          allowedEmojis: customEmojiControl ? allowedEmojis : undefined
        });
      } else {
        createStory(finalMediaUrl, caption);
      }
      resetAndClose();
    } catch (err) {
      console.error('Failed to submit post:', err);
      showToast('Error sharing post, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep('media');
    setSelectedImage('');
    setSelectedFile(null);
    setSelectedFilter('filter-normal');
    setCaption('');
    setLocation('');
    setShareTarget('post');
    setShowAdditionalSettings(false);
    setCustomEmojiControl(false);
    setAllowedEmojis([...AVAILABLE_REACTION_EMOJIS]);
    setIsCreateModalOpen(false);
  };

  const insertHashtag = (tag: string) => {
    setCaption(prev => (prev ? `${prev} ${tag}` : tag));
  };

  return (
    <div
      id="create-post-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 md:p-6"
    >
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16">
            {step !== 'media' && (
              <button
                onClick={() => setStep(step === 'caption' ? 'filter' : 'media')}
                className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {step === 'media' && 'Create new post'}
            {step === 'filter' && 'Filters & Adjustments'}
            {step === 'caption' && 'Post details'}
          </h3>

          <div className="w-16 flex justify-end">
            {step === 'filter' && (
              <button
                onClick={() => setStep('caption')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 'caption' && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Sharing...' : 'Share'}
              </button>
            )}

            {step === 'media' && (
              <button
                onClick={resetAndClose}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 flex-1">
          {/* STEP 1: SELECT MEDIA */}
          {step === 'media' && (
            <div className="flex flex-col items-center justify-center py-6">
              {/* Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-md aspect-4/3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 flex flex-col items-center justify-center gap-3 p-6 text-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800/40"
              >
                <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Drag photos here or click to browse
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Supports JPG, PNG, WEBP, GIF
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-2 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Select from Computer
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Preset Gallery */}
              <div className="w-full mt-7">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Or select from aesthetic presets
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PRESET_CREATION_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url, preset.location)}
                      className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500"
                    >
                      <img
                        src={preset.url}
                        alt={preset.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-end p-1.5 transition-opacity">
                        <span className="text-[10px] font-medium text-white truncate">
                          {preset.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: APPLY FILTERS */}
          {step === 'filter' && (
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Preview Image */}
              <div className="w-full md:w-3/5 aspect-square bg-slate-950 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className={`w-full h-full object-cover ${selectedFilter}`}
                />
              </div>

              {/* Filter Thumbnails Grid */}
              <div className="w-full md:w-2/5 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Filters ({FILTER_PRESETS.length})
                </span>
                <div className="grid grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {FILTER_PRESETS.map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFilter(f.filterClass)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border text-center transition-all ${
                        selectedFilter === f.filterClass
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="relative w-14 h-14 rounded-md overflow-hidden border border-slate-300 dark:border-slate-700">
                        <img
                          src={selectedImage}
                          alt={f.name}
                          className={`w-full h-full object-cover ${f.filterClass}`}
                        />
                        {selectedFilter === f.filterClass && (
                          <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white drop-shadow" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {f.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CAPTION & DETAILS */}
          {step === 'caption' && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Mini Preview */}
              <div className="w-full md:w-2/5 aspect-square rounded-xl overflow-hidden bg-slate-950">
                <img
                  src={selectedImage}
                  alt="Post preview"
                  className={`w-full h-full object-cover ${selectedFilter}`}
                />
              </div>

              {/* Form details */}
              <div className="w-full md:w-3/5 flex flex-col gap-4">
                {/* Post or Story toggle */}
                <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setShareTarget('post')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      shareTarget === 'post'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Feed Post
                  </button>
                  <button
                    type="button"
                    onClick={() => setShareTarget('story')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      shareTarget === 'story'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    24h Story
                  </button>
                </div>

                {/* Who sees this post? Audience selector */}
                {shareTarget === 'post' && (
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-indigo-500" />
                        Who sees this post?
                      </span>
                    </label>

                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setAudience('everyone')}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                          audience === 'everyone'
                            ? 'border-indigo-500 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Everyone
                      </button>

                      <button
                        type="button"
                        onClick={() => setAudience('followers')}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                          audience === 'followers'
                            ? 'border-indigo-500 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Followers
                      </button>

                      <button
                        type="button"
                        onClick={() => setAudience('close_friends')}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                          audience === 'close_friends'
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Close Friends
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setAudience('custom_circle')}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                          audience === 'custom_circle'
                            ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Custom Circle
                      </button>

                      <button
                        type="button"
                        onClick={() => setAudience('community')}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                          audience === 'community'
                            ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Community
                      </button>
                    </div>

                    {/* Circle selector */}
                    {audience === 'custom_circle' && (
                      <div className="pt-2">
                        <select
                          value={selectedCircleId}
                          onChange={e => setSelectedCircleId(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-purple-300 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          {customCircles.map(circle => (
                            <option key={circle.id} value={circle.id}>
                              {circle.icon} {circle.name} ({circle.userIds.length} members)
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Community selector */}
                    {audience === 'community' && (
                      <div className="pt-2">
                        <select
                          value={selectedCommunityId}
                          onChange={e => setSelectedCommunityId(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          {communities.map(comm => (
                            <option key={comm.id} value={comm.id}>
                              {comm.name} ({comm.category})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {/* Caption input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Caption
                  </label>
                  <textarea
                    rows={3}
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder="Write a caption... (use #hashtags)"
                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{caption.length}/2200</span>
                  </div>
                </div>

                {/* Hashtag shortcuts */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    Popular Tags:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['#photography', '#wanderlust', '#vibes', '#aesthetic', '#minimal', '#streetstyle'].map(
                      tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => insertHashtag(tag)}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] transition-colors"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Location input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Add Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Shibuya, Tokyo, Japan"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Additional Settings (Emoji Reaction Controls) */}
                {shareTarget === 'post' && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowAdditionalSettings(prev => !prev)}
                      className="w-full flex items-center justify-between py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                        Additional Settings (Emoji Reactions)
                      </span>
                      {showAdditionalSettings ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    {showAdditionalSettings && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                              Restrict or Allow Specific Emojis
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                              Choose which reactions audience can use on this post
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCustomEmojiControl(prev => !prev)}
                            className={`w-10 h-6 rounded-full transition-colors relative ${
                              customEmojiControl ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                          >
                            <span
                              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                customEmojiControl ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        {customEmojiControl && (
                          <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                                Selected reactions ({allowedEmojis.length} allowed):
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Tap to toggle
                              </span>
                            </div>

                            {/* Active allowed chips */}
                            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                              {allowedEmojis.map(emoji => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => toggleAllowedEmoji(emoji)}
                                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-white dark:bg-slate-700 border border-indigo-400 text-xs shadow-xs hover:border-rose-400 transition-colors"
                                  title={`Remove ${emoji}`}
                                >
                                  <span>{emoji}</span>
                                  <span className="text-[10px] text-indigo-500">×</span>
                                </button>
                              ))}
                            </div>

                            {/* Add custom emoji field */}
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={customEmojiInput}
                                onChange={e => setCustomEmojiInput(e.target.value)}
                                placeholder="Type or paste any custom emoji..."
                                className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (customEmojiInput.trim() && !allowedEmojis.includes(customEmojiInput.trim())) {
                                    setAllowedEmojis(prev => [...prev, customEmojiInput.trim()]);
                                    setCustomEmojiInput('');
                                  }
                                }}
                                disabled={!customEmojiInput.trim()}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold disabled:opacity-40"
                              >
                                Add
                              </button>
                            </div>

                            {/* Category selector */}
                            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                              {EMOJI_CATEGORIES.map(cat => (
                                <button
                                  key={cat.name}
                                  type="button"
                                  onClick={() => setActiveEmojiCategory(cat.name)}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium shrink-0 transition-colors ${
                                    activeEmojiCategory === cat.name
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                  }`}
                                >
                                  {cat.icon} {cat.name.split(' ')[0]}
                                </button>
                              ))}
                            </div>

                            {/* Grid of emojis in selected category */}
                            <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                              {(EMOJI_CATEGORIES.find(c => c.name === activeEmojiCategory)?.emojis || []).map(emoji => {
                                const isAllowed = allowedEmojis.includes(emoji);
                                return (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => toggleAllowedEmoji(emoji)}
                                    className={`p-1.5 rounded-lg text-base transition-all ${
                                      isAllowed
                                        ? 'bg-indigo-100 dark:bg-indigo-950/60 ring-1 ring-indigo-500 scale-105'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 opacity-60'
                                    }`}
                                    title={isAllowed ? `Allowed: ${emoji}` : `Restricted: ${emoji}`}
                                  >
                                    <span>{emoji}</span>
                                  </button>
                                );
                              })}
                            </div>

                            <p className="text-[10px] text-slate-400 dark:text-slate-500">
                              Tip: You can also adjust emoji reaction rules anytime after posting via the post's 3-dot options menu.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
