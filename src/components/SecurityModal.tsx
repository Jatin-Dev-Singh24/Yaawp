import React, { useState, useMemo } from 'react';
import {
  X,
  Shield,
  Lock,
  KeyRound,
  AlertTriangle,
  History,
  Download,
  Trash2,
  CheckCircle2,
  Smartphone,
  Eye,
  EyeOff,
  Clock,
  FileSpreadsheet,
  Link2,
  RefreshCw,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SecurityModal: React.FC = () => {
  const {
    isSecurityModalOpen,
    setIsSecurityModalOpen,
    chatPasscode,
    setChatPasscode,
    failedLoginAttempts,
    lockoutUntil,
    failedLoginsAlert,
    resetFailedLogins,
    auditLogs,
    exportGDPRData,
    deleteAccountPermanently,
    changePassword,
    twoFactorEnabled,
    setTwoFactorEnabled,
    privateMediaSignedUrlsEnabled,
    setPrivateMediaSignedUrlsEnabled,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'passcode' | 'password' | 'audit' | 'privacy' | 'lockout'>('passcode');

  // Password change state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Chat passcode state
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!newPw) return { score: 0, label: 'None', color: 'bg-zinc-700' };
    let score = 0;
    if (newPw.length >= 8) score += 1;
    if (newPw.length >= 12) score += 1;
    if (/[a-z]/.test(newPw) && /[A-Z]/.test(newPw)) score += 1;
    if (/\d/.test(newPw)) score += 1;
    if (/[^a-zA-Z0-9]/.test(newPw)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score, label: 'Fair', color: 'bg-amber-500' };
    if (score === 4) return { score, label: 'Good', color: 'bg-lime-500' };
    return { score, label: 'Strong (Exceeds Policy)', color: 'bg-lime-400' };
  }, [newPw]);

  if (!isSecurityModalOpen) return null;

  const handleSetPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      showToast('Passcode must be exactly 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      showToast('PIN codes do not match');
      return;
    }
    setChatPasscode(newPin);
    setNewPin('');
    setConfirmPin('');
    showToast('Chat Passcode Lock updated successfully');
  };

  const handleRemovePasscode = () => {
    setChatPasscode(null);
    showToast('Chat Passcode Lock removed');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPw) {
      showToast('Enter your current password');
      return;
    }
    if (passwordStrength.score < 2) {
      showToast('Please choose a stronger password');
      return;
    }
    if (newPw !== confirmPw) {
      showToast('New passwords do not match');
      return;
    }
    const success = changePassword(currentPw, newPw);
    if (success) {
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    }
  };

  const isLockedOut = lockoutUntil !== null && Date.now() < lockoutUntil;
  const lockoutRemainingHours = lockoutUntil
    ? Math.max(0, Math.ceil((lockoutUntil - Date.now()) / (1000 * 60 * 60)))
    : 0;

  return (
    <div
      id="security-suite-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 md:p-6"
    >
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 px-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20">
              <Shield className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Security & Privacy Center
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-lime-400 font-mono">
                  AES-256 / RLS
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                End-to-end chat lock, audit logs, and account protections
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSecurityModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Failed Logins Alert Banner if Spike Detected */}
        {failedLoginsAlert && (
          <div className="bg-amber-950/40 border-b border-amber-800/60 p-3 px-5 flex items-start gap-2.5 text-amber-200 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-amber-300">Security Alert:</span> Abnormal login failures detected.
              Daily attempt limit is monitored to prevent brute-force attacks.
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-4 pt-3 border-b border-zinc-800/60 overflow-x-auto no-scrollbar bg-zinc-900/20">
          {[
            { id: 'passcode', label: 'Chat Lock', icon: Lock },
            { id: 'password', label: 'Password & 2FA', icon: KeyRound },
            { id: 'audit', label: 'Audit Trail', icon: History },
            { id: 'lockout', label: 'Login Protection', icon: AlertTriangle },
            { id: 'privacy', label: 'GDPR & Storage', icon: Download }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors shrink-0 ${
                  activeTab === tab.id
                    ? 'text-lime-400 border-b-2 border-lime-400 bg-zinc-800/60'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {/* TAB 1: Chat Passcode Lock */}
          {activeTab === 'passcode' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-lime-400/10 text-lime-400 flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Direct Message Passcode Lock</h4>
                      <p className="text-[11px] text-zinc-400">
                        {chatPasscode ? 'Lock is currently ACTIVE (4-digit PIN required)' : 'No lock configured'}
                      </p>
                    </div>
                  </div>
                  {chatPasscode ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime-400/20 text-lime-300 border border-lime-400/30">
                      ENABLED
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      OFF
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  When enabled, entering your Messages tab requires your 4-digit PIN. Protects confidential threads, photos, and voice notes from casual snooping.
                </p>

                {chatPasscode && (
                  <div className="pt-2">
                    <button
                      onClick={handleRemovePasscode}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold hover:bg-rose-900 transition-colors"
                    >
                      Disable Chat Passcode
                    </button>
                  </div>
                )}
              </div>

              {/* Set or Change PIN Form */}
              <form onSubmit={handleSetPasscode} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <h5 className="text-xs font-bold text-zinc-200">
                  {chatPasscode ? 'Update 4-Digit Passcode' : 'Set New 4-Digit Passcode'}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">New 4-digit PIN</label>
                    <input
                      type="password"
                      maxLength={4}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      value={newPin}
                      onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-center tracking-widest text-sm text-lime-400 font-mono focus:outline-none focus:ring-1 focus:ring-lime-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Confirm PIN</label>
                    <input
                      type="password"
                      maxLength={4}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      value={confirmPin}
                      onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-center tracking-widest text-sm text-lime-400 font-mono focus:outline-none focus:ring-1 focus:ring-lime-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={newPin.length !== 4 || confirmPin.length !== 4}
                  className="px-4 py-2 rounded-lg bg-lime-400 text-zinc-950 font-bold text-xs hover:bg-lime-300 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Save Chat PIN
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Password & 2FA */}
          {activeTab === 'password' && (
            <div className="space-y-4">
              {/* 2FA Reminder */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-lime-400/10 text-lime-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Two-Factor Reminders (2FA)</h5>
                    <p className="text-[11px] text-zinc-400">Requires authenticator verification on unknown logins</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    showToast(twoFactorEnabled ? '2FA disabled' : '2FA activated! Reminders enabled.');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    twoFactorEnabled
                      ? 'bg-lime-400 text-zinc-950 hover:bg-lime-300'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {twoFactorEnabled ? 'Active' : 'Enable'}
                </button>
              </div>

              {/* Password Change Form */}
              <form onSubmit={handleChangePasswordSubmit} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <h5 className="text-xs font-bold text-zinc-200">Change Account Password</h5>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={currentPw}
                      onChange={e => setCurrentPw(e.target.value)}
                      placeholder="Current password"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-lime-400 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showCurrentPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      placeholder="Minimum 8 characters with numbers & symbols"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-lime-400 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showNewPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {newPw && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-zinc-400">Password Strength:</span>
                        <span className="font-semibold text-lime-400">{passwordStrength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex gap-1">
                        {[1, 2, 3, 4, 5].map(step => (
                          <div
                            key={step}
                            className={`h-full flex-1 transition-all duration-200 ${
                              step <= passwordStrength.score ? passwordStrength.color : 'bg-zinc-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-lime-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!currentPw || !newPw || newPw !== confirmPw}
                  className="px-4 py-2 rounded-lg bg-lime-400 text-zinc-950 font-bold text-xs hover:bg-lime-300 disabled:opacity-50 transition-colors"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Audit Trail */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white">Immutable Security Audit Trail</h5>
                  <p className="text-[11px] text-zinc-400">
                    Live logs of connections, message reads, media opens, and auth events
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-lime-400">
                  {auditLogs.length} Events Logged
                </span>
              </div>

              <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800/80 bg-zinc-900/40">
                {auditLogs.slice(0, 8).map(log => (
                  <div key={log.id} className="p-2.5 px-3 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        log.status === 'warning' ? 'bg-amber-400' : 'bg-lime-400'
                      }`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-200">{log.action}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                            {log.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">{log.details}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 text-[10px] text-zinc-500 font-mono">
                      <div>{log.timestamp}</div>
                      <div>{log.ip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Login Protection & Lockout */}
          {activeTab === 'lockout' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-white">Daily Failed-Login Rate Limiting</h5>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isLockedOut ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-lime-400/10 text-lime-400'
                  }`}>
                    {isLockedOut ? 'ACCOUNT LOCKED (24-HR)' : 'NORMAL OPERATION'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Accounts that fail 5 consecutive authentication attempts trigger an automatic 24-hour lockout and an administrative security spike alert.
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs">
                  <span className="text-zinc-400">Failed attempts today:</span>
                  <span className="font-mono font-bold text-lime-400">{failedLoginAttempts} / 5</span>
                </div>
                {isLockedOut && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs space-y-1">
                    <p className="font-bold">24-Hour Lockout Active</p>
                    <p className="text-[11px]">Remaining lockout duration: ~{lockoutRemainingHours} hours</p>
                  </div>
                )}
                <div className="pt-2">
                  <button
                    onClick={resetFailedLogins}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3 text-lime-400" />
                    Reset Failed Logins Counter (Testing)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GDPR & Privacy */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              {/* Private Media Signed Links */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-lime-400" />
                    <h5 className="text-xs font-bold text-white">Private Media Signed URLs</h5>
                  </div>
                  <button
                    onClick={() => {
                      setPrivateMediaSignedUrlsEnabled(!privateMediaSignedUrlsEnabled);
                      showToast(privateMediaSignedUrlsEnabled ? 'Standard URLs restored' : 'Short-lived signed URLs (15m expiry) active');
                    }}
                    className={`px-3 py-1 rounded text-xs font-bold ${
                      privateMediaSignedUrlsEnabled ? 'bg-lime-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {privateMediaSignedUrlsEnabled ? 'Enabled (15m)' : 'Standard'}
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  All photos and videos in chats and private communities are delivered via cryptographically signed temporary tokens that expire after 15 minutes.
                </p>
              </div>

              {/* GDPR Data Export */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-lime-400" />
                  GDPR Article 20: Data Portability Export
                </h5>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Download a machine-readable JSON archive containing all your profile data, posts, messages, comments, and security audit records.
                </p>
                <button
                  onClick={exportGDPRData}
                  className="px-3.5 py-1.5 rounded-lg bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-bold hover:bg-lime-400/20 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Complete Data (.json)
                </button>
              </div>

              {/* Permanent Account Deletion */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/50 space-y-2">
                <h5 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4" />
                  Permanent Account Deletion (Right to Erasure)
                </h5>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Irreversibly delete your account, posts, direct messages, followers, and private media buckets from database servers.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to permanently delete your account? All data will be wiped.')) {
                      deleteAccountPermanently();
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold hover:bg-rose-900 transition-colors"
                >
                  Permanently Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
