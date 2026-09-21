import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Download,
  Share2,
  Calendar,
  MapPin,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  MessageSquareHeart,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { FestivalItem, FESTIVALS, EMOJI_BY_SLUG, EmojiItem } from '../data/index.ts';
import { copyToClipboard, generateCanvasPng, downloadDataUrl } from '../utils/download.ts';
import { showToast } from '../components/Toast.tsx';
import { trackEvent } from '../utils/analytics.ts';
import { AdSlot } from '../components/AdSlot.tsx';

interface FestivalDetailViewProps {
  festival: FestivalItem;
  onNavigate: (path: string) => void;
}

export const FestivalDetailView: React.FC<FestivalDetailViewProps> = ({
  festival,
  onNavigate,
}) => {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [copiedGreetingIndex, setCopiedGreetingIndex] = useState<number | null>(null);
  const [copiedComboIndex, setCopiedComboIndex] = useState<number | null>(null);

  // Emojis mapped for this festival
  const festivalEmojis: EmojiItem[] = useMemo(() => {
    return festival.emojiSlugs
      .map((slug) => EMOJI_BY_SLUG.get(slug))
      .filter((e): e is EmojiItem => e !== undefined);
  }, [festival.emojiSlugs]);

  // Other festivals for recommendations
  const otherFestivals = useMemo(() => {
    return FESTIVALS.filter((f) => f.slug !== festival.slug).slice(0, 6);
  }, [festival.slug]);

  const handleCopyEmoji = async (emoji: EmojiItem) => {
    const success = await copyToClipboard(emoji.emoji);
    if (success) {
      setCopiedSlug(emoji.slug);
      showToast(`${emoji.emoji} Copied to clipboard ✨`);
      trackEvent('festival_emoji_copy', {
        festival: festival.slug,
        emoji: emoji.emoji,
      });
      setTimeout(() => {
        setCopiedSlug((cur) => (cur === emoji.slug ? null : cur));
      }, 1500);
    }
  };

  const handleCopyGreeting = async (text: string, index: number) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedGreetingIndex(index);
      showToast(`Celebration wish copied! Ready to paste in WhatsApp/Instagram ✨`);
      trackEvent('festival_greeting_copy', {
        festival: festival.slug,
        index,
      });
      setTimeout(() => {
        setCopiedGreetingIndex(null);
      }, 1800);
    }
  };

  const handleCopyCombo = async (combo: string, index: number) => {
    const success = await copyToClipboard(combo);
    if (success) {
      setCopiedComboIndex(index);
      showToast(`${combo} combo copied! ✨`);
      trackEvent('festival_combo_copy', {
        festival: festival.slug,
        combo,
      });
      setTimeout(() => {
        setCopiedComboIndex(null);
      }, 1800);
    }
  };

  const handleDownloadPng = async (emoji: EmojiItem) => {
    try {
      const dataUrl = await generateCanvasPng(emoji.emoji, 512);
      downloadDataUrl(dataUrl, `${emoji.slug}-${festival.slug}-apple-emoji.png`);
      showToast(`Downloaded ${emoji.name} PNG ✨`);
      trackEvent('festival_emoji_download', {
        festival: festival.slug,
        emoji: emoji.slug,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2"
      >
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Home
        </a>
        <span>/</span>
        <a
          href="/festivals/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/festivals/');
          }}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Festivals
        </a>
        <span>/</span>
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
          {festival.name}
        </span>
      </nav>

      {/* Hero Section */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200/80 dark:border-blue-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>World Festival & Holiday Emojis</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium border border-neutral-200/80 dark:border-neutral-700/80">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <span>{festival.seasonOrDate}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium border border-neutral-200/80 dark:border-neutral-700/80">
            <MapPin className="w-3.5 h-3.5 text-neutral-500" />
            <span>{festival.region}</span>
          </span>
        </div>

        <div className="flex items-start gap-4 sm:gap-6 pt-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-white dark:bg-neutral-800/90 border border-neutral-200/90 dark:border-neutral-700/80 shadow-sm flex items-center justify-center text-4xl sm:text-5xl select-none">
            {festival.icon}
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
              {festival.h1}
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl">
              {festival.description}
            </p>
          </div>
        </div>

        {/* Quick-Action All Glyphs Tray */}
        <div className="pt-3 pb-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mr-1">
            Instant Copy:
          </span>
          {festivalEmojis.map((e) => {
            const isCopied = copiedSlug === e.slug;
            return (
              <button
                key={e.slug}
                type="button"
                onClick={() => handleCopyEmoji(e)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                  isCopied
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs scale-105'
                    : 'bg-white dark:bg-neutral-800/90 border-neutral-200/90 dark:border-neutral-700/80 hover:border-blue-400 dark:hover:border-blue-500 text-neutral-800 dark:text-neutral-200 shadow-2xs hover:-translate-y-0.5'
                }`}
                title={`Copy ${e.name} (${e.emoji})`}
              >
                <span className="text-lg leading-none">{e.emoji}</span>
                <span className="text-xs">{e.name.split(' ')[0]}</span>
                {isCopied && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </header>

      {/* Top Ad Slot */}
      <AdSlot format="horizontal" />

      {/* Curated Festival Emojis Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200/70 dark:border-neutral-800 pb-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              Essential {festival.name} Emojis
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Click any card to copy the emoji or download high-resolution Apple PNG art.
            </p>
          </div>
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full">
            {festivalEmojis.length} Emojis
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {festivalEmojis.map((emoji) => {
            const isCopied = copiedSlug === emoji.slug;
            return (
              <div
                key={emoji.slug}
                className="group relative flex flex-col justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/90 dark:border-neutral-700/80 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 shadow-2xs hover:shadow-sm"
              >
                <div
                  onClick={() => onNavigate(`/emoji/${emoji.slug}/`)}
                  className="cursor-pointer text-center space-y-2"
                >
                  <div className="text-4xl sm:text-5xl py-2 group-hover:scale-110 transition-transform select-none">
                    {emoji.emoji}
                  </div>
                  <div className="font-semibold text-xs text-neutral-800 dark:text-neutral-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {emoji.name}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-400 truncate">
                    {emoji.unicode[0]}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyEmoji(emoji)}
                    className={`flex-1 min-h-[34px] flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                    }`}
                    aria-label={`Copy ${emoji.name}`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadPng(emoji)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
                    title={`Download ${emoji.name} 512px PNG`}
                    aria-label={`Download ${emoji.name} PNG`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pre-crafted Celebration Wishes & Greetings */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-200/70 dark:border-neutral-800 pb-2">
          <MessageSquareHeart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              {festival.name} Greetings & Wishes
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              1-click ready-to-copy celebration captions for WhatsApp, Instagram stories, iMessage, and SMS.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {festival.greetings.map((greet, idx) => {
            const isCopied = copiedGreetingIndex === idx;
            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/90 dark:border-neutral-700/80 shadow-2xs space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {greet.title}
                    </span>
                    <span className="text-base">{greet.emojiCombo}</span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed font-sans select-all">
                    "{greet.text}"
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleCopyGreeting(greet.text, idx)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Wish Copied!' : 'Copy Wish'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Aesthetic Emoji Combos & Sequences */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-200/70 dark:border-neutral-800 pb-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              Aesthetic {festival.name} Emoji Combos
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Popular sequences for bio captions, celebratory replies, and group chat headers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {festival.combos.map((item, idx) => {
            const isCopied = copiedComboIndex === idx;
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/90 dark:border-neutral-700/80 shadow-2xs gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl tracking-widest select-all">{item.combo}</span>
                    <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {item.meaning}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCombo(item.combo, idx)}
                  className={`shrink-0 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                  }`}
                  title="Copy combo"
                  aria-label={`Copy combo ${item.combo}`}
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cultural Significance & Traditions */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-200/70 dark:border-neutral-800 pb-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              Cultural Background & Celebrations
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Understanding the traditions, customs, and history of {festival.name}.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/90 dark:border-neutral-700/80 shadow-2xs space-y-4 text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm sm:text-base">
          <p>{festival.culturalSignificance}</p>

          <div className="pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">
              Key Traditions & Practices:
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {festival.traditions.map((tradition, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{tradition}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Festival FAQs */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-200/70 dark:border-neutral-800 pb-2">
          <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
            {festival.name} Emoji FAQs
          </h2>
        </div>

        <div className="space-y-3">
          {festival.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/90 dark:border-neutral-700/80 shadow-2xs space-y-1.5"
            >
              <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore More World Festivals */}
      <section className="space-y-4 pt-4 border-t border-neutral-200/70 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
            Explore More World Festivals
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('/festivals/')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            <span>View All ({FESTIVALS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {otherFestivals.map((other) => (
            <button
              key={other.slug}
              type="button"
              onClick={() => onNavigate(`/festivals/${other.slug}/`)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/90 dark:border-neutral-700/80 hover:border-blue-400 dark:hover:border-blue-500 shadow-2xs hover:-translate-y-0.5 transition-all text-center group cursor-pointer"
            >
              <span className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">
                {other.icon}
              </span>
              <span className="font-semibold text-xs text-neutral-800 dark:text-neutral-200 truncate w-full group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {other.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-neutral-400 truncate w-full">
                {other.seasonOrDate.split('(')[0].trim()}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
