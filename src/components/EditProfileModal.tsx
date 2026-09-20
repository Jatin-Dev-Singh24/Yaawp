import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Check, Upload, Loader2, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { uploadMediaToSupabase } from '../lib/supabaseStorage';
import { INITIAL_LANGUAGES } from '../translations';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80'
];

export const EditProfileModal: React.FC = () => {
  const {
    isEditProfileOpen,
    setIsEditProfileOpen,
    currentUser,
    updateProfile,
    showToast,
    preferredLanguage,
    setPreferredLanguage
  } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [website, setWebsite] = useState(currentUser.website || '');
  const [language, setLanguage] = useState(currentUser.preferred_language || preferredLanguage || 'en');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal opens or currentUser updates
  useEffect(() => {
    if (isEditProfileOpen) {
      setName(currentUser.name);
      setUsername(currentUser.username);
      setBio(currentUser.bio);
      setWebsite(currentUser.website || '');
      setLanguage(currentUser.preferred_language || preferredLanguage || 'en');
      setAvatar(currentUser.avatar);
      setSelectedFile(null);
    }
  }, [isEditProfileOpen, currentUser, preferredLanguage]);

  if (!isEditProfileOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalAvatar = avatar;

      if (selectedFile) {
        const uploadRes = await uploadMediaToSupabase(selectedFile, 'avatars', undefined, currentUser.id);
        if (uploadRes.url) {
          finalAvatar = uploadRes.url;
        }
      }

      updateProfile({
        name: name.trim() || currentUser.name,
        username: username.trim() || currentUser.username,
        bio: bio.trim(),
        website: website.trim() || undefined,
        avatar: finalAvatar,
        preferred_language: language
      });
      if (language !== preferredLanguage) {
        setPreferredLanguage(language);
      }
      setIsEditProfileOpen(false);
    } catch (err) {
      console.error('Failed to update avatar:', err);
      showToast('Error saving profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      id="edit-profile-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150 ambient-glow">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setIsEditProfileOpen(false)}
            className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Edit profile
          </h3>
          <button
            id="save-profile-btn"
            onClick={handleSave}
            disabled={isSaving}
            className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Save
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                Save
              </>
            )}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Avatar Section */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-4">
              <div
                className="relative group cursor-pointer shrink-0"
                onClick={() => fileInputRef.current?.click()}
                title="Click to change profile picture"
              >
                <img
                  src={avatar}
                  alt="Profile Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-xs"
                />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  @{username}
                </span>
                <button
                  type="button"
                  id="upload-avatar-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload new photo
                </button>
                <p className="text-[10px] text-slate-400">
                  PNG, JPG supported
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Quick avatar presets */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-semibold text-slate-400 block mb-1.5">
                Or pick a preset:
              </span>
              <div className="flex items-center gap-2">
                {PRESET_AVATARS.map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(presetUrl)}
                    className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                      avatar === presetUrl ? 'border-indigo-600 ring-2 ring-indigo-400/40' : 'border-transparent'
                    }`}
                  >
                    <img src={presetUrl} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Full Name
            </label>
            <input
              id="edit-name-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                @
              </span>
              <input
                id="edit-username-input"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Website */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Website
            </label>
            <input
              id="edit-website-input"
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Preferred Language */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                Preferred Language
              </label>
              <span className="text-[10px] text-slate-400">
                30 available
              </span>
            </div>
            <select
              id="edit-preferred-language-select"
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {INITIAL_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Bio
              </label>
              <span className="text-[10px] text-slate-400">
                {bio.length}/150
              </span>
            </div>
            <textarea
              id="edit-bio-input"
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={150}
              placeholder="Write a short bio about yourself..."
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

