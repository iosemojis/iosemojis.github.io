import React, { useState } from 'react';
import { Copy, Check, Trash2, Delete, Share2, Sparkles } from 'lucide-react';
import { copyToClipboard } from '../utils/download.ts';
import { showToast } from './Toast.tsx';
import { trackEvent } from '../utils/analytics.ts';

interface EmojiClipboardBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}

export const EmojiClipboardBar: React.FC<EmojiClipboardBarProps> = ({ value, onChange, onClear }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) {
      showToast('Click any emoji below to add it to the copy bar! ✨');
      return;
    }
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(true);
      showToast(`Copied "${value}" to clipboard! ✨`);
      trackEvent('copy_all_bar', { length: value.length, content: value });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBackspace = () => {
    if (!value) return;
    // Remove last emoji (handling surrogate pairs / ZWJ sequences correctly)
    const chars = Array.from(value);
    chars.pop();
    onChange(chars.join(''));
  };

  const handleShare = async () => {
    if (!value) return;
    if (navigator.share) {
      try {
        await navigator.share({
          text: value,
        });
      } catch (err) {
        // Share cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-200/80 dark:border-neutral-800 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] transition-all">
      <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
        {/* Live Input Field displaying clicked emojis */}
        <div className="relative flex-1 flex items-center bg-neutral-100/80 dark:bg-neutral-800/80 rounded-xl px-3 py-2 border border-neutral-200/60 dark:border-neutral-700/60 min-h-[46px] overflow-hidden">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Click any emoji below to copy or build text..."
            className="w-full bg-transparent text-lg sm:text-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 placeholder:text-sm font-sans focus:outline-none overflow-x-auto"
            aria-label="Emoji copy buffer"
          />
          {value && (
            <span className="hidden sm:inline text-[11px] font-mono text-neutral-400 ml-2 select-none">
              {Array.from(value).length} emojis
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Backspace Button */}
          <button
            type="button"
            onClick={handleBackspace}
            disabled={!value}
            title="Delete last emoji"
            className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Backspace"
          >
            <Delete className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Clear Button */}
          <button
            type="button"
            onClick={onClear}
            disabled={!value}
            title="Clear all emojis"
            className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Clear all"
          >
            <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Share Button (Mobile friendly) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleShare}
              disabled={!value}
              title="Share emojis"
              className="hidden sm:flex p-2 sm:px-2.5 sm:py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {/* Main "Copy All" Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide text-white transition-all transform active:scale-95 shadow-md cursor-pointer ${
              copied
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-blue-500/25'
            }`}
            aria-label="Copy emojis to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
