import React, { useState } from 'react';
import { EmojiItem } from '../data/index.ts';
import { Copy, Check, ExternalLink, Sparkles, Flame, Heart, Smile } from 'lucide-react';

interface SearchDropdownProps {
  isOpen: boolean;
  query: string;
  results: EmojiItem[];
  totalMatches: number;
  highlightedIndex: number;
  onSelectEmoji: (emoji: EmojiItem) => void;
  onCopyEmoji: (emoji: EmojiItem) => void;
  onSelectQuerySuggestion?: (suggestion: string) => void;
  onViewAllInGrid: () => void;
  onClose: () => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  isOpen,
  query,
  results,
  totalMatches,
  highlightedIndex,
  onSelectEmoji,
  onCopyEmoji,
  onSelectQuerySuggestion,
  onViewAllInGrid,
}) => {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (e: React.MouseEvent, emoji: EmojiItem) => {
    e.stopPropagation();
    onCopyEmoji(emoji);
    setCopiedSlug(emoji.slug);
    setTimeout(() => {
      setCopiedSlug((current) => (current === emoji.slug ? null : current));
    }, 1500);
  };

  const popularQueries = [
    { label: 'Hearts', query: 'heart', icon: <Heart className="w-3 h-3 text-rose-500" /> },
    { label: 'Smileys', query: 'smile', icon: <Smile className="w-3 h-3 text-amber-500" /> },
    { label: 'Fire & Hot', query: 'fire', icon: <Flame className="w-3 h-3 text-orange-500" /> },
    { label: 'Sparkles', query: 'sparkles', icon: <Sparkles className="w-3 h-3 text-yellow-500" /> },
    { label: 'Crying Laughing', query: 'joy', icon: <span>😂</span> },
    { label: 'Thumbs Up', query: 'thumbs up', icon: <span>👍</span> },
  ];

  // If query is empty but dropdown opened on focus
  if (!query.trim()) {
    return (
      <div
        className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200/90 dark:border-neutral-700/80 overflow-hidden backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150 text-left"
        role="listbox"
      >
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2.5">
            <span>Trending Searches</span>
            <span className="text-[11px] font-normal normal-case text-neutral-400">Click to search</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularQueries.map((item) => (
              <button
                key={item.query}
                type="button"
                onClick={() => onSelectQuerySuggestion?.(item.query)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 dark:bg-neutral-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 border border-neutral-200/70 dark:border-neutral-700/70 text-xs font-medium text-neutral-700 dark:text-neutral-200 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {results.length > 0 && (
          <div className="p-3">
            <div className="px-2 py-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
              Quick Copy Popular Emojis
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {results.slice(0, 8).map((emoji) => {
                const isCopied = copiedSlug === emoji.slug;
                return (
                  <button
                    key={emoji.slug}
                    type="button"
                    onClick={(e) => handleCopy(e, emoji)}
                    className="flex items-center justify-between p-2 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-700/80 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-600 transition-all text-left group"
                    title={`Copy ${emoji.name}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xl group-hover:scale-110 transition-transform">{emoji.emoji}</span>
                      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200 truncate">
                        {emoji.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 group-hover:text-blue-600 font-semibold shrink-0 ml-1">
                      {isCopied ? '✓' : 'Copy'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // If query is provided but 0 matches
  if (results.length === 0) {
    return (
      <div
        className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200/90 dark:border-neutral-700/80 p-6 text-center text-neutral-600 dark:text-neutral-300 animate-in fade-in-0 zoom-in-95 duration-150"
        role="status"
      >
        <div className="text-3xl mb-2">🔍</div>
        <div className="font-semibold text-neutral-900 dark:text-white text-base mb-1">
          No emojis found for &ldquo;{query}&rdquo;
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-4">
          Try searching for another keyword, a feeling, an object, or an emoji name.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularQueries.slice(0, 4).map((item) => (
            <button
              key={item.query}
              type="button"
              onClick={() => onSelectQuerySuggestion?.(item.query)}
              className="px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-200 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Active search matches
  return (
    <div
      className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200/90 dark:border-neutral-700/80 overflow-hidden backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150 text-left"
      role="listbox"
      id="emoji-ajax-dropdown"
    >
      {/* Header bar */}
      <div className="px-4 py-2.5 bg-neutral-50/80 dark:bg-neutral-800/80 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span className="font-medium">
          Found <strong className="text-neutral-900 dark:text-white">{totalMatches}</strong> matching emojis
        </span>
        <span className="hidden sm:inline text-[11px]">
          Click row to open details • <kbd className="px-1 py-0.5 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded text-[10px]">↵</kbd> or <kbd className="px-1 py-0.5 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded text-[10px]">↑↓</kbd>
        </span>
      </div>

      {/* Results list */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60 scrollbar-thin">
        {results.map((emoji, idx) => {
          const isHighlighted = idx === highlightedIndex;
          const isCopied = copiedSlug === emoji.slug;

          return (
            <div
              key={emoji.slug}
              role="option"
              aria-selected={isHighlighted}
              onClick={() => onSelectEmoji(emoji)}
              className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors group ${
                isHighlighted
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100'
                  : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-neutral-900 dark:text-neutral-100'
              }`}
            >
              {/* Left: Glyph and Name Info */}
              <div className="flex items-center gap-3.5 min-w-0 pr-2">
                <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">
                  {emoji.emoji}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate flex items-center gap-2">
                    <span>{emoji.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    <span className="capitalize">{emoji.category.replace('-', ' ')}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px] uppercase">{emoji.unicode[0]}</span>
                    {emoji.shortMeaning && (
                      <>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:inline truncate max-w-xs">{emoji.shortMeaning}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Actions (Instant 1-Click Copy + View Link) */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleCopy(e, emoji)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isCopied
                      ? 'bg-emerald-600 text-white shadow-xs scale-105'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95'
                  }`}
                  title={`Copy ${emoji.name} to clipboard`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <span className="text-neutral-300 dark:text-neutral-700">
                  <ExternalLink className="w-3.5 h-3.5 group-hover:text-blue-500 transition-colors" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/60 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={onViewAllInGrid}
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
        >
          <span>View all {totalMatches} results in grid below</span>
          <span>↓</span>
        </button>
        <span className="text-neutral-400 text-[11px]">Press Esc to dismiss</span>
      </div>
    </div>
  );
};
