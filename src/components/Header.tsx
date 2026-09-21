import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon, Sparkles } from 'lucide-react';
import { trackEvent } from '../utils/analytics.ts';

interface HeaderProps {
  onNavigate: (path: string) => void;
  onSearchFocus?: () => void;
}

export type Theme = 'light' | 'dark';

export const Header: React.FC<HeaderProps> = ({ onNavigate, onSearchFocus }) => {
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
            href="/about/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/about/');
            }}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            About
          </a>
        </nav>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
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
