import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon, Sparkles } from 'lucide-react';
import { trackEvent } from '../utils/analytics.ts';

interface HeaderProps {
  onNavigate: (path: string) => void;
  onSearchFocus?: () => void;
  currentLang?: string;
}

const LANG_OPTIONS: { code: string; flag: string; label: string; path: string }[] = [
  { code: 'en', flag: '🇺🇸', label: 'English', path: '/' },
  { code: 'es', flag: '🇪🇸', label: 'Español', path: '/es/' },
  { code: 'pt', flag: '🇧🇷', label: 'Português', path: '/pt/' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch', path: '/de/' },
  { code: 'fr', flag: '🇫🇷', label: 'Français', path: '/fr/' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano', path: '/it/' },
  { code: 'id', flag: '🇮🇩', label: 'Indonesia', path: '/id/' },
  { code: 'ja', flag: '🇯🇵', label: '日本語', path: '/ja/' },
];

export type Theme = 'light' | 'dark';

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onSearchFocus,
  currentLang = 'en',
}) => {
  const activeLangObj =
    LANG_OPTIONS.find((l) => l.code === currentLang) || LANG_OPTIONS[0];
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    const root = document.documentElement;
    const body = document.body;
    if (nextTheme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    localStorage.setItem('theme', nextTheme);
    trackEvent('theme_change', { theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] dark:border-white/[0.08] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Apple-style Brand Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="flex items-center gap-2 font-bold text-lg tracking-tight text-neutral-900 dark:text-white group"
        >
          <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
            🍎
          </span>
          <span className="flex items-center gap-1 font-bold">
            iOS<span className="text-neutral-500 font-medium">Emoji</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Directory
          </a>
          <a
            href="/festivals/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/festivals/');
            }}
            className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white transition-colors text-blue-600 dark:text-blue-400 font-semibold"
          >
            <span>🎉 Festivals</span>
          </a>
          <a
            href="/category/smileys-emotions/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/category/smileys-emotions/');
            }}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Smileys
          </a>
          <a
            href="/category/hearts-love/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/category/hearts-love/');
            }}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Hearts
          </a>
          <a
            href="/guides/iphone-emoji/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/guides/iphone-emoji/');
            }}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Guides
          </a>
          <a
            href="https://emojisymbols.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200/60 dark:border-amber-800/60 hover:bg-amber-100 transition-colors"
          >
            <span>✨</span>
            <span>EmojiSymbols ↗</span>
          </a>
        </nav>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-all cursor-pointer shadow-2xs"
              aria-label="Select Language"
            >
              <span>{activeLangObj.flag}</span>
              <span className="uppercase">{activeLangObj.code}</span>
              <span className="text-[10px] text-neutral-400">▾</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block group-focus-within:block bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl py-2 w-44 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Language / Country
              </div>
              {LANG_OPTIONS.map((item) => {
                const isActive = item.code === activeLangObj.code;
                return (
                  <a
                    key={item.code}
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.path);
                    }}
                    className={`flex items-center justify-between px-3 py-1.5 text-xs transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.flag}</span>
                      <span>{item.label}</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono text-neutral-400">
                      {item.code}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
          {onSearchFocus && (
            <button
              type="button"
              onClick={onSearchFocus}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-200 transition-all active:scale-95"
              aria-label="Search emojis"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded shadow-2xs text-neutral-400">
                /
              </kbd>
            </button>
          )}

          {/* Theme switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
