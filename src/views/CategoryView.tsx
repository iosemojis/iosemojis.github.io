import React, { useState, useMemo } from 'react';
import { Copy, Download, ArrowRight, Check } from 'lucide-react';
import { CATEGORIES, EMOJIS, EmojiItem, CategoryItem } from '../data/index.ts';
import { searchEmojis } from '../utils/search.ts';
import { copyToClipboard, generateCanvasPng, downloadDataUrl } from '../utils/download.ts';
import { trackEvent } from '../utils/analytics.ts';
import { AdSlot } from '../components/AdSlot.tsx';
import { showToast } from '../components/Toast.tsx';

interface CategoryViewProps {
  category: CategoryItem;
  onNavigate: (path: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ category, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const PAGE_SIZE = 96;
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const categoryEmojis = useMemo(() => {
    const list = EMOJIS.filter((e) => e.category === category.slug);
    if (!searchQuery.trim()) return list;
    return searchEmojis(list, searchQuery);
  }, [category.slug, searchQuery]);

  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, category.slug]);

  const displayedEmojis = useMemo(() => {
    return categoryEmojis.slice(0, visibleCount);
  }, [categoryEmojis, visibleCount]);

  const handleCopyEmoji = async (emoji: EmojiItem) => {
    const success = await copyToClipboard(emoji.emoji);
    if (success) {
      setCopiedSlug(emoji.slug);
      showToast(`${emoji.emoji} Copied to clipboard ✨`);
      trackEvent('emoji_copy', {
        emoji: emoji.emoji,
        slug: emoji.slug,
        category: category.slug,
      });
      setTimeout(() => {
        setCopiedSlug((current) => (current === emoji.slug ? null : current));
      }, 1500);
    }
  };

  const handleDownloadPng = async (emoji: EmojiItem) => {
    try {
      const dataUrl = await generateCanvasPng(emoji.emoji, 512);
      downloadDataUrl(dataUrl, `${emoji.slug}-apple-emoji.png`);
      showToast(`Downloaded ${emoji.name} PNG ✨`);
      trackEvent('emoji_download', {
        type: 'png',
        size: 512,
        slug: emoji.slug,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const relatedCategories = useMemo(() => {
    return CATEGORIES.filter((c) => c.slug !== category.slug).slice(0, 6);
  }, [category.slug]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="hover:text-neutral-800 dark:hover:text-white transition-colors"
        >
          Home
        </a>
        <span>/</span>
        <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{category.name}</span>
      </nav>

      {/* Category Header */}
      <header className="border-b border-black/[0.06] dark:border-white/[0.08] pb-6">
        <div className="flex items-center gap-3.5 mb-3">
          <span className="text-4xl sm:text-5xl p-3 bg-white dark:bg-neutral-800 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-black/[0.06] dark:border-white/[0.08]">
            {category.icon}
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {category.h1}
            </h1>
            <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
              Showing {categoryEmojis.length} emojis in this collection
            </span>
          </div>
        </div>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl leading-relaxed mt-3">
          {category.introCopy}
        </p>

        {/* Filter Input & Festival Hub link */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px] max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Filter ${category.name} emojis...`}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-800/90 border border-neutral-200/90 dark:border-neutral-700/80 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-xs transition-all"
            />
          </div>
          {category.slug === 'festivals-holidays' && (
            <button
              type="button"
              onClick={() => onNavigate('/festivals/')}
              className="px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 hover:bg-blue-100 text-xs font-semibold transition-all cursor-pointer"
            >
              🎉 Explore All 19 Dedicated World Festival Pages →
            </button>
          )}
        </div>
      </header>

      {/* Clean Unobtrusive Ad Slot */}
      <AdSlot slot="6477240404" />

      {/* Category Emoji Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            Showing {displayedEmojis.length} of {categoryEmojis.length.toLocaleString()} emojis
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayedEmojis.map((item) => {
            const isCopied = copiedSlug === item.slug;
            return (
              <div
                key={item.slug}
                className="group relative bg-white dark:bg-neutral-800 rounded-2xl p-4 border border-black/[0.08] dark:border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-between text-center overflow-hidden"
              >
                {/* Top-Right Details Arrow Navigation */}
                <a
                  href={`/emoji/${item.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/emoji/${item.slug}/`);
                  }}
                  className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700/80 transition-colors cursor-pointer z-10"
                  title={`View ${item.name} meanings & details`}
                  aria-label={`View ${item.name} details`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                {/* Click to Copy */}
                <button
                  type="button"
                  onClick={() => handleCopyEmoji(item)}
                  className="w-full flex flex-col items-center focus:outline-none rounded-xl py-2 cursor-pointer transition-transform active:scale-95"
                  aria-label={`Copy ${item.name}`}
                >
                  <span className="text-5xl sm:text-6xl mb-2 select-all leading-none transition-transform duration-200 group-hover:scale-105">
                    {item.emoji}
                  </span>
                  <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 line-clamp-1 w-full px-1">
                    {item.name}
                  </span>
                </button>

                {/* Card Actions */}
                <div className="w-full mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-700/80 flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyEmoji(item)}
                    className={`min-h-[38px] flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-700/90 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100'
                    }`}
                    title={`Copy ${item.name}`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadPng(item)}
                    className="min-h-[38px] w-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-700/90 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 transition-all active:scale-95 cursor-pointer"
                    title="Download 512px PNG"
                    aria-label={`Download ${item.name} PNG`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {visibleCount < categoryEmojis.length && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="min-h-[44px] px-8 py-3 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Load More Emojis ({(categoryEmojis.length - visibleCount).toLocaleString()} remaining)
            </button>
            <button
              type="button"
              onClick={() => setVisibleCount(categoryEmojis.length)}
              className="min-h-[44px] px-6 py-3 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all cursor-pointer"
            >
              Show All ({categoryEmojis.length.toLocaleString()})
            </button>
          </div>
        )}
      </section>

      {/* Category FAQs */}
      {category.faqs && category.faqs.length > 0 && (
        <section className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 border border-black/[0.08] dark:border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.04)] space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
            {category.name} FAQs
          </h2>
          <div className="space-y-3">
            {category.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-black/[0.04] dark:border-white/[0.04]"
              >
                <summary className="font-semibold text-neutral-900 dark:text-white cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  <span>{faq.question}</span>
                  <span className="transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Categories */}
      <section className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 border border-black/[0.08] dark:border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.04)] space-y-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Explore Other Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {relatedCategories.map((other) => (
            <a
              key={other.slug}
              href={`/category/${other.slug}/`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/category/${other.slug}/`);
              }}
              className="p-3.5 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-black/[0.04] dark:border-white/[0.04] hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all flex items-center gap-3 hover:-translate-y-0.5"
            >
              <span className="text-2xl">{other.icon}</span>
              <div className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">
                {other.name}
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
