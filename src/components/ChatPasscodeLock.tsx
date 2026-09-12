import React, { useState } from 'react';
import { Lock, Shield, Fingerprint, Delete, KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ChatPasscodeLock: React.FC = () => {
  const {
    chatPasscode,
    isChatLocked,
    unlockChat,
    setChatPasscode,
    showToast,
    failedLoginAttempts,
    recordFailedLogin
  } = useApp();

  const [pin, setPin] = useState('');
  const [errorShake, setErrorShake] = useState(false);

  if (!isChatLocked || !chatPasscode) {
    return null;
  }

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 4) {
      setTimeout(() => {
        const success = unlockChat(newPin);
        if (!success) {
          setErrorShake(true);
          recordFailedLogin();
          setTimeout(() => {
            setPin('');
            setErrorShake(false);
          }, 600);
        } else {
          setPin('');
        }
      }, 150);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleBiometricUnlock = () => {
    showToast('Biometric Face ID / Touch ID Authenticated');
    unlockChat(chatPasscode);
  };

  const handleEmergencyBypass = () => {
    setChatPasscode(null);
    showToast('Passcode protection cleared');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white select-none">
      <div className={`w-full max-w-xs flex flex-col items-center text-center ${errorShake ? 'animate-shake' : ''}`}>
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-md mb-4">
          <Lock className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Protected Direct Messages
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[220px]">
          Enter your 4-digit security PIN to access end-to-end encrypted conversations
        </p>

        {/* 4 PIN Dots */}
        <div className="flex items-center gap-4 my-6">
          {[0, 1, 2, 3].map(index => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-indigo-600 dark:bg-indigo-500 scale-110 shadow-[0_0_10px_rgba(79,70,229,0.5)]'
                    : 'border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              />
            );
          })}
        </div>

        {failedLoginAttempts > 0 && (
          <p className="text-[11px] text-rose-500 mb-2 font-medium">
            Incorrect PIN ({failedLoginAttempts} attempts)
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="h-14 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 text-lg font-semibold text-slate-900 dark:text-white active:scale-95 transition-all flex items-center justify-center shadow-xs"
            >
              {num}
            </button>
          ))}

          {/* Biometric Face/Touch ID Simulation */}
          <button
            type="button"
            onClick={handleBiometricUnlock}
            className="h-14 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 transition-all flex items-center justify-center"
            title="Biometric Instant Unlock"
          >
            <Fingerprint className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-14 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 text-lg font-semibold text-slate-900 dark:text-white active:scale-95 transition-all flex items-center justify-center shadow-xs"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-500 active:scale-95 transition-all flex items-center justify-center"
            title="Backspace"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Fallback / Reset Helpers */}
        <div className="flex items-center justify-between w-full mt-6 text-[11px] text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={() => showToast(`Hint: Saved PIN is "${chatPasscode}"`)}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
          >
            <KeyRound className="w-3 h-3" />
            Show Hint
          </button>

          <button
            type="button"
            onClick={handleEmergencyBypass}
            className="hover:text-rose-500 transition-colors"
          >
            Reset PIN
          </button>
        </div>
      </div>
    </div>
  );
};
