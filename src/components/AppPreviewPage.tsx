import React from 'react';
import { useApp } from '../context/AppContext';

export const AppPreviewPage: React.FC = () => {
  const { openAuthModal } = useApp();

  return (
    <div
      id="yaawp-landing-page"
      className="min-h-screen w-full bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between selection:bg-zinc-200 selection:text-black relative px-6 sm:px-12 md:px-20 py-8 sm:py-12 overflow-hidden"
    >
      {/* Top Header: Simple Log In & Sign Up Text Actions */}
      <header
        id="landing-header"
        className="w-full flex items-center justify-end z-10"
      >
        <nav
          id="landing-auth-nav"
          className="flex items-center gap-8 sm:gap-12"
          aria-label="Authentication"
        >
          <button
            id="landing-login-btn"
            type="button"
            onClick={() => openAuthModal('login')}
            className="text-[13px] tracking-[0.22em] uppercase font-light text-zinc-400 hover:text-white transition-colors duration-300 cursor-pointer focus:outline-none"
          >
            Log in
          </button>
          <button
            id="landing-signup-btn"
            type="button"
            onClick={() => openAuthModal('signup')}
            className="text-[13px] tracking-[0.22em] uppercase font-light text-zinc-400 hover:text-white transition-colors duration-300 cursor-pointer focus:outline-none"
          >
            Sign up
          </button>
        </nav>
      </header>

      {/* Centerpiece: Prominent YAAWP MonteCarlo Wordmark with generous whitespace */}
      <main
        id="landing-main"
        className="flex-1 flex flex-col items-center justify-center my-auto z-10 text-center select-none"
      >
        <h1
          id="yaawp-landing-wordmark"
          className="font-monte-carlo text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] leading-none text-zinc-100 font-normal tracking-wide transition-all duration-500"
        >
          YAAWP
        </h1>
      </main>

      {/* Discreet bottom spacing to balance layout */}
      <footer
        id="landing-footer"
        className="w-full flex items-center justify-between text-[11px] tracking-[0.2em] uppercase font-light text-zinc-600/70 select-none z-10"
      >
        <span className="hidden sm:inline">Volume I</span>
        <span className="mx-auto sm:mx-0">All Rights Reserved</span>
      </footer>
    </div>
  );
};
