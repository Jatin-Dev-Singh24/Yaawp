import React, { useState, useRef, useEffect } from 'react';
import { X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { PeacockWatcher } from './PeacockWatcher';
import { UserProfile } from '../types';

export const CreateAccountModal: React.FC = () => {
  const {
    isCreateAccountModalOpen,
    setIsCreateAccountModalOpen,
    authModalMode,
    createAccount,
    loginWithSupabase,
    continueAsGuest,
    userProfiles,
    switchAccount,
    showToast,
    isSupabaseConfigured,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
    }
  }, [authModalMode, isCreateAccountModalOpen]);

  // Form Fields
  // Signup
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  // Login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Peacock Interaction Tracking (UI state only - never reads values)
  const [activeField, setActiveField] = useState<
    'idle' | 'username' | 'email' | 'password' | 'confirmPassword'
  >('idle');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clear typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  if (!isCreateAccountModalOpen) return null;

  const handleFieldChange = (
    field: 'username' | 'email' | 'password' | 'confirmPassword',
    setter: (val: string) => void,
    value: string
  ) => {
    setter(value);
    setErrorMessage(null);
    setActiveField(field);
    setIsTyping(true);

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 650);
  };

  const handleFieldFocus = (field: 'username' | 'email' | 'password' | 'confirmPassword') => {
    setActiveField(field);
    setErrorMessage(null);
  };

  const handleFieldBlur = () => {
    setActiveField('idle');
    setIsTyping(false);
  };

  const switchAuthMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setErrorMessage(null);
    setActiveField('idle');
    setIsTyping(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const identifier = loginUsername.trim();
    const pass = loginPassword.trim();

    if (!identifier || !pass) {
      setErrorMessage('Please enter your username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSupabaseConfigured) {
        // If user typed username, check if email is mapped or pass identifier
        let emailToUse = identifier;
        const profilesList = Object.values(userProfiles) as UserProfile[];
        if (!identifier.includes('@')) {
          const matched = profilesList.find(
            p => p.username.toLowerCase() === identifier.toLowerCase()
          );
          if (matched?.email) {
            emailToUse = matched.email;
          } else {
            emailToUse = `${identifier.toLowerCase()}@yaawp.internal`;
          }
        }

        const res = await loginWithSupabase(emailToUse, pass);
        if (!res.success) {
          // If supabase login fails, try local profile match if present
          const matchedProfile = profilesList.find(
            p => p.username.toLowerCase() === identifier.toLowerCase()
          );
          if (matchedProfile) {
            switchAccount(matchedProfile.id);
            showToast(`Welcome back, @${matchedProfile.username}`);
            setIsCreateAccountModalOpen(false);
            return;
          }
          setErrorMessage(res.error || 'Invalid credentials.');
          return;
        }
        setIsCreateAccountModalOpen(false);
      } else {
        // Local Profile Match or Guest session
        const profilesList = Object.values(userProfiles) as UserProfile[];
        const matched = profilesList.find(
          p =>
            p.username.toLowerCase() === identifier.toLowerCase() ||
            p.email?.toLowerCase() === identifier.toLowerCase()
        );
        if (matched) {
          switchAccount(matched.id);
          showToast(`Welcome back, @${matched.username}`);
        } else {
          continueAsGuest();
        }
        setIsCreateAccountModalOpen(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = signupUsername.trim().toLowerCase().replace(/[^a-z0-9_.]/g, '');
    const cleanEmail = signupEmail.trim();

    if (!cleanUsername || cleanUsername.length < 3) {
      setErrorMessage('Please choose a username of at least 3 characters.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createAccount({
        username: cleanUsername,
        contact: cleanEmail,
        name: cleanUsername,
        password: signupPassword,
        birthday: '2000-01-01',
        agreedToTerms: true,
        agreedToPrivacy: true,
        agreedToCookies: true,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to create account.');
        return;
      }

      showToast(`Account created for @${cleanUsername}`);
      setIsCreateAccountModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine current active password visibility for the peacock
  const currentPasswordVisible =
    mode === 'login'
      ? showLoginPassword
      : activeField === 'confirmPassword'
      ? showSignupConfirmPassword
      : showSignupPassword;

  return (
    <div
      id="yaawp-auth-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-[2px] p-4 sm:p-6 overflow-y-auto"
      onClick={() => setIsCreateAccountModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Yaawp Authentication"
    >
      <div
        id="yaawp-auth-panel"
        className="relative w-full max-w-[420px] bg-[#0c0c0e] border border-zinc-800/70 p-7 sm:p-9 my-auto select-none shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Minimal Close Button */}
        <button
          id="auth-close-btn"
          type="button"
          onClick={() => setIsCreateAccountModalOpen(false)}
          className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-200 transition-colors p-1 focus:outline-none"
          aria-label="Close authentication"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Peacock Seated Naturally Above the Authentication Form */}
        <div className="w-full flex flex-col items-center justify-center pt-1 pb-2">
          <PeacockWatcher
            activeField={activeField}
            isTyping={isTyping}
            isPasswordVisible={currentPasswordVisible}
            isConfirmPasswordVisible={showSignupConfirmPassword}
          />
          {/* Subtle Yaawp Wordmark in MonteCarlo */}
          <span className="font-monte-carlo text-4xl sm:text-5xl text-zinc-100 font-normal tracking-wide mt-1 select-none">
            Yaawp
          </span>
        </div>

        {/* Seamless Tab Switcher: Log In | Sign Up */}
        <div
          id="auth-mode-tabs"
          className="flex items-center justify-center gap-8 mt-6 mb-7 text-xs tracking-[0.22em] uppercase font-light"
        >
          <button
            id="tab-login"
            type="button"
            onClick={() => switchAuthMode('login')}
            className={`pb-1 transition-all border-b ${
              mode === 'login'
                ? 'text-zinc-100 border-zinc-200 font-normal'
                : 'text-zinc-500 border-transparent hover:text-zinc-300 font-light'
            }`}
          >
            Log in
          </button>
          <button
            id="tab-signup"
            type="button"
            onClick={() => switchAuthMode('signup')}
            className={`pb-1 transition-all border-b ${
              mode === 'signup'
                ? 'text-zinc-100 border-zinc-200 font-normal'
                : 'text-zinc-500 border-transparent hover:text-zinc-300 font-light'
            }`}
          >
            Sign up
          </button>
        </div>

        {/* Error Feedback Message */}
        {errorMessage && (
          <div
            id="auth-error-message"
            className="mb-5 px-3 py-2 text-xs font-light text-rose-300 bg-rose-950/30 border border-rose-900/40 flex items-center gap-2"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Forms Container */}
        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            /* --- LOGIN FORM --- */
            <motion.form
              key="login-form"
              id="login-form"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              onSubmit={handleLoginSubmit}
              className="space-y-5"
            >
              {/* Username field */}
              <div className="space-y-1">
                <label
                  htmlFor="login-username"
                  className="block text-[11px] tracking-[0.16em] uppercase font-light text-zinc-400"
                >
                  Username
                </label>
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  value={loginUsername}
                  onChange={e => handleFieldChange('username', setLoginUsername, e.target.value)}
                  onFocus={() => handleFieldFocus('username')}
                  onBlur={handleFieldBlur}
                  placeholder="name or @handle"
                  className="w-full bg-transparent border-b border-zinc-800 focus:border-zinc-300 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors duration-200 font-light"
                  required
                />
              </div>

              {/* Password field with show/hide eye control */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-[11px] tracking-[0.16em] uppercase font-light text-zinc-400"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(prev => !prev)}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 text-xs flex items-center gap-1 focus:outline-none"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={e => handleFieldChange('password', setLoginPassword, e.target.value)}
                    onFocus={() => handleFieldFocus('password')}
                    onBlur={handleFieldBlur}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-b border-zinc-800 focus:border-zinc-300 py-2 pr-8 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors duration-200 font-light"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-3 text-xs tracking-[0.24em] uppercase font-normal text-black bg-zinc-100 hover:bg-white active:bg-zinc-300 transition-colors duration-200 disabled:opacity-40 cursor-pointer focus:outline-none"
              >
                {isSubmitting ? 'Entering...' : 'Log In'}
              </button>

              {/* Quick Guest Explorer link */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    continueAsGuest();
                    setIsCreateAccountModalOpen(false);
                  }}
                  className="text-[11px] tracking-[0.15em] uppercase text-zinc-500 hover:text-zinc-300 transition-colors font-light focus:outline-none"
                >
                  Continue as Guest
                </button>
              </div>
            </motion.form>
          ) : (
            /* --- SIGNUP FORM --- */
            <motion.form
              key="signup-form"
              id="signup-form"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              onSubmit={handleSignupSubmit}
              className="space-y-4"
            >
              {/* Username field */}
              <div className="space-y-1">
                <label
                  htmlFor="signup-username"
                  className="block text-[11px] tracking-[0.16em] uppercase font-light text-zinc-400"
                >
                  Username
                </label>
                <input
                  id="signup-username"
                  type="text"
                  autoComplete="username"
                  value={signupUsername}
                  onChange={e => handleFieldChange('username', setSignupUsername, e.target.value)}
                  onFocus={() => handleFieldFocus('username')}
                  onBlur={handleFieldBlur}
                  placeholder="@yourhandle"
                  className="w-full bg-transparent border-b border-zinc-800 focus:border-zinc-300 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors duration-200 font-light"
                  required
                />
              </div>

              {/* Email field */}
              <div className="space-y-1">
                <label
                  htmlFor="signup-email"
                  className="block text-[11px] tracking-[0.16em] uppercase font-light text-zinc-400"
                >
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  value={signupEmail}
                  onChange={e => handleFieldChange('email', setSignupEmail, e.target.value)}
                  onFocus={() => handleFieldFocus('email')}
                  onBlur={handleFieldBlur}
                  placeholder="your.email@domain.com"
                  className="w-full bg-transparent border-b border-zinc-800 focus:border-zinc-300 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors duration-200 font-light"
                  required
                />
              </div>

              {/* Password field with eye toggle */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="signup-password"
                    className="block text-[11px] tracking-[0.16em] uppercase font-light text-zinc-400"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(prev => !prev)}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 text-xs flex items-center gap-1 focus:outline-none"
                    aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSignupPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <input
                  id="signup-password"
                  type={showSignupPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={signupPassword}
                  onChange={e => handleFieldChange('password', setSignupPassword, e.target.value)}
                  onFocus={() => handleFieldFocus('password')}
                  onBlur={handleFieldBlur}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-zinc-800 focus:border-zinc-300 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors duration-200 font-light"
                  required
                />
              </div>

              {/* Confirm Password field with eye toggle */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="signup-confirm-password"
                    className="block text-[11px] tracking-[0.16em] uppercase font-light text-zinc-400"
                  >
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSignupConfirmPassword(prev => !prev)}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 text-xs flex items-center gap-1 focus:outline-none"
                    aria-label={showSignupConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSignupConfirmPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <input
                  id="signup-confirm-password"
                  type={showSignupConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={signupConfirmPassword}
                  onChange={e =>
                    handleFieldChange('confirmPassword', setSignupConfirmPassword, e.target.value)
                  }
                  onFocus={() => handleFieldFocus('confirmPassword')}
                  onBlur={handleFieldBlur}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-zinc-800 focus:border-zinc-300 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-colors duration-200 font-light"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                id="signup-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-3 text-xs tracking-[0.24em] uppercase font-normal text-black bg-zinc-100 hover:bg-white active:bg-zinc-300 transition-colors duration-200 disabled:opacity-40 cursor-pointer focus:outline-none"
              >
                {isSubmitting ? 'Creating...' : 'Create Account'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
