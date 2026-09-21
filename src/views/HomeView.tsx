import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Copy, Download, ArrowRight, Search, X, Check, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { EMOJIS, CATEGORIES, FESTIVALS, EmojiItem } from '../data/index.ts';
import { searchEmojis } from '../utils/search.ts';
import { copyToClipboard, generateCanvasPng, downloadDataUrl } from '../utils/download.ts';
import { trackEvent } from '../utils/analytics.ts';
import { AdSlot } from '../components/AdSlot.tsx';
import { showToast } from '../components/Toast.tsx';
import { SearchDropdown } from '../components/SearchDropdown.tsx';
import { Pagination } from '../components/Pagination.tsx';

interface HomeViewProps {
  onNavigate: (path: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, searchInputRef }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<'all' | 'conventional' | 'thematic'>('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 320;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const [pageSize, setPageSize] = useState<number>(60);
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const p = parseInt(new URLSearchParams(window.location.search).get('page') || '1', 10);
      return isNaN(p) || p < 1 ? 1 : p;
    }
    return 1;
  });

  const filteredEmojis = useMemo(() => {
    let list = EMOJIS;
    if (selectedCategory !== 'all') {
      list = list.filter((e) => e.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      list = searchEmojis(list, searchQuery);
    }
    return list;
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredEmojis.length / pageSize));

  // Reset pagination when search or category filter changes
  useEffect(() => {
    setCurrentPage(1);
    setHighlightedIndex(-1);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('page')) {
        url.searchParams.delete('page');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      }
    }
  }, [searchQuery, selectedCategory]);

  // Keep currentPage within valid bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const displayedEmojis = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredEmojis.slice(startIndex, startIndex + pageSize);
  }, [filteredEmojis, currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    const targetPage = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(targetPage);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (targetPage > 1) {
        url.searchParams.set('page', targetPage.toString());
      } else {
        url.searchParams.delete('page');
      }
      window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    }
    const gridEl = document.getElementById('emoji-grid-section');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    trackEvent('pagination_change', { page: targetPage, category: selectedCategory });
  };

  // Dropdown results: top 10 ranked matches from full dataset
  const dropdownMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchEmojis(EMOJIS, searchQuery);
  }, [searchQuery]);

  const dropdownResults = useMemo(() => {
    return dropdownMatches.slice(0, 10);
  }, [dropdownMatches]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyEmoji = async (emoji: EmojiItem) => {
    const success = await copyToClipboard(emoji.emoji);
    if (success) {
      setCopiedSlug(emoji.slug);
      showToast(`${emoji.emoji} Copied to clipboard ✨`);
      trackEvent('emoji_copy', {
        emoji: emoji.emoji,
        slug: emoji.slug,
        name: emoji.name,
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setIsDropdownOpen(true);
    if (val.length > 2) {
      trackEvent('search', { query: val });
    }
  };

  const popularEmojis = useMemo(() => {
    const slugs = [
      'red-heart',
      'face-with-tears-of-joy',
      'sparkles',
      'fire',
      'party-popper',
      'hundred-points',
      'folded-hands',
      'rocket',
    ];
    return EMOJIS.filter((e) => slugs.includes(e.slug));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const listLength = searchQuery.trim() ? dropdownResults.length : popularEmojis.length;
      if (listLength > 0) {
        setHighlightedIndex((prev) => (prev < listLength - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const listLength = searchQuery.trim() ? dropdownResults.length : popularEmojis.length;
      if (listLength > 0) {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : listLength - 1));
      }
    } else if (e.key === 'Enter') {
      const currentList = searchQuery.trim() ? dropdownResults : popularEmojis;
      if (highlightedIndex >= 0 && highlightedIndex < currentList.length) {
        e.preventDefault();
        const selected = currentList[highlightedIndex];
        onNavigate(`/emoji/${selected.slug}/`);
        setIsDropdownOpen(false);
      } else {
        // Close dropdown and let user inspect results in main grid
        setIsDropdownOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-10 sm:space-y-12">
      {/* Friendly, Inviting Hero Section */}
      <section className="text-center py-4 sm:py-8 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4 border border-blue-200/70 dark:border-blue-800/70 shadow-2xs">
          <span>🌐</span>
          <span>Universal Emojis for All Devices • Apple, Android & Web • 3,786 Emojis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-3.5 leading-tight">
          iOS Emoji & iPhone Keyboard
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Universal emoji keyboard for all devices and platforms. Search, explore, and copy authentic Apple, iOS, and Android emojis in one click. Works seamlessly across WhatsApp, Instagram, TikTok, iPhone, and Android.
        </p>

        {/* Live AJAX Search Bar Container */}
        <div ref={searchContainerRef} className="relative mt-8 max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white dark:bg-neutral-800/95 rounded-2xl border border-neutral-200/90 dark:border-neutral-700/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] focus-within:shadow-[0_4px_30px_rgba(59,130,246,0.15)] focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 dark:focus-within:ring-blue-500/20 transition-all duration-200">
            <Search className="absolute left-4 w-5 h-5 text-neutral-400 focus-within:text-blue-500 pointer-events-none transition-colors" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search emojis (e.g. heart, fire, smile, cry)..."
              className="w-full pl-12 pr-24 py-3.5 sm:py-4 rounded-2xl bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-400 text-sm sm:text-base focus:outline-none"
              aria-label="Search emojis"
              aria-expanded={isDropdownOpen}
              aria-controls="emoji-ajax-dropdown"
            />
            <div className="absolute right-3 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline px-2 py-1 text-[11px] font-semibold text-neutral-400 bg-neutral-100 dark:bg-neutral-700/60 rounded-md border border-neutral-200/80 dark:border-neutral-600/60">
                /
              </kbd>
            </div>
          </div>

          {/* Live AJAX Search Dropdown */}
          <SearchDropdown
            isOpen={isDropdownOpen}
            query={searchQuery}
            results={searchQuery.trim() ? dropdownResults : popularEmojis}
            totalMatches={searchQuery.trim() ? dropdownMatches.length : popularEmojis.length}
            highlightedIndex={highlightedIndex}
            onSelectEmoji={(emoji) => {
              onNavigate(`/emoji/${emoji.slug}/`);
              setIsDropdownOpen(false);
            }}
            onCopyEmoji={handleCopyEmoji}
            onSelectQuerySuggestion={(suggestion) => {
              setSearchQuery(suggestion);
              setIsDropdownOpen(true);
            }}
            onViewAllInGrid={() => {
              setIsDropdownOpen(false);
              const gridEl = document.getElementById('emoji-grid-section');
              if (gridEl) {
                gridEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onClose={() => setIsDropdownOpen(false)}
          />

          {/* Quick Copy Tray - Soft & Friendly Apple Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Quick Copy:</span>
            {popularEmojis.map((pop) => (
              <button
                key={pop.slug}
                type="button"
                onClick={() => handleCopyEmoji(pop)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-neutral-800/90 border border-neutral-200/90 dark:border-neutral-700/80 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-neutral-800 dark:text-neutral-200 transition-all hover:-translate-y-0.5 active:scale-95 shadow-2xs hover:shadow-xs cursor-pointer"
                title={`Copy ${pop.name}`}
              >
                <span className="text-base">{pop.emoji}</span>
                <span className="hidden sm:inline font-medium">{pop.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Clean Unobtrusive Top Ad Container with PageKey */}
      <AdSlot slot="6477240404" pageKey={currentPage} position="top" />

      {/* Category Pills Filter with Mode Toggle */}
      <nav aria-label="Emoji categories filter" className="border-b border-black/[0.06] dark:border-white/[0.08] pb-4 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-xl">
            <button
              type="button"
              onClick={() => setCategoryTypeFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                categoryTypeFilter === 'all'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              All Categories
            </button>
            <button
              type="button"
              onClick={() => setCategoryTypeFilter('conventional')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                categoryTypeFilter === 'conventional'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Conventional (Unicode)
            </button>
            <button
              type="button"
              onClick={() => setCategoryTypeFilter('thematic')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                categoryTypeFilter === 'thematic'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Thematic & Curated
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/festivals/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/80 dark:border-blue-800/60 hover:bg-blue-100 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>World Festivals Hub ({FESTIVALS.length}) →</span>
          </button>
        </div>

        <div className="relative flex items-center gap-2 group/carousel">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => scrollCategories('left')}
            className="flex items-center justify-center w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 shadow-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 shrink-0 transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
            title="Scroll categories left"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* Scrollable Container with high-contrast visible scrollbar and mouse-wheel support */}
          <div
            ref={categoryScrollRef}
            onWheel={(e) => {
              if (e.deltaY !== 0 && categoryScrollRef.current) {
                categoryScrollRef.current.scrollLeft += e.deltaY;
              }
            }}
            className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 px-1 custom-horizontal-scrollbar scroll-smooth flex-1 min-w-0"
          >
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                trackEvent('category_click', { category: 'all' });
              }}
              className={`min-h-[44px] flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                  : 'bg-white dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 border border-neutral-200/90 dark:border-neutral-700/80 hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }`}
            >
              <span>🌐</span>
              <span>Universal Emojis ({EMOJIS.length.toLocaleString()})</span>
            </button>
            {CATEGORIES.filter((cat) => {
              if (categoryTypeFilter === 'conventional') return cat.isConventional;
              if (categoryTypeFilter === 'thematic') return !cat.isConventional;
              return true;
            }).map((cat) => {
              const count = EMOJIS.filter((e) => e.category === cat.slug).length;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    trackEvent('category_click', { category: cat.slug });
                  }}
                  className={`min-h-[44px] flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                      : 'bg-white dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 border border-neutral-200/90 dark:border-neutral-700/80 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="text-[11px] opacity-70 font-normal">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => scrollCategories('right')}
            className="flex items-center justify-center w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 shadow-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 shrink-0 transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
            title="Scroll categories right"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
        </div>
      </nav>

      {/* Emoji Cards Grid */}
      <section id="emoji-grid-section" aria-label="Emoji Grid" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                {selectedCategory === 'all'
                  ? 'All Emojis'
                  : `${CATEGORIES.find((c) => c.slug === selectedCategory)?.name || 'Category'} Emojis`}
              </h2>
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => onNavigate(`/category/${selectedCategory}/`)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <span>Category Page</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
              Page <strong className="text-neutral-900 dark:text-white">{currentPage}</strong> of{' '}
              <strong className="text-neutral-900 dark:text-white">{totalPages}</strong> • Showing {displayedEmojis.length} of {filteredEmojis.length.toLocaleString()} emojis
            </p>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed font-medium transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                ← Prev
              </button>
              <span className="px-2.5 py-1 font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200/60 dark:border-blue-800/60">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed font-medium transition-colors cursor-pointer"
                aria-label="Next page"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {filteredEmojis.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-12 text-center border border-black/[0.08] dark:border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
              No matching emojis found
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5 max-w-sm mx-auto">
              Try searching with popular keywords like "smile", "heart", "cat", or reset your filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="min-h-[44px] px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs sm:text-sm font-semibold rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <>
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

                    {/* Click to Copy Large Display */}
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

                    {/* Intuitive Consumer Action Controls */}
                    <div className="w-full mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-700/80 flex items-center justify-between gap-1.5">
                      {/* 1. Quick Copy */}
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

                      {/* 2. Download PNG */}
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

            {/* In-feed / Mid-Page AdSlot with pageKey to refresh AdSense on every page */}
            <AdSlot slot="6477240404" pageKey={currentPage} position="mid" className="my-6" />

            {/* Pagination Bar */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredEmojis.length}
              itemsPerPage={pageSize}
              onPageChange={handlePageChange}
              onItemsPerPageChange={(count: number) => {
                setPageSize(count);
                handlePageChange(1);
              }}
              className="my-6"
            />

            {/* Post-Pagination Bottom AdSlot */}
            <AdSlot slot="6477240404" pageKey={currentPage} position="bottom" className="my-6" />
          </>
        )}
      </section>

      {/* Popular World Festivals Across the Globe */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎉</span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                Popular World Festivals & Celebrations
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Dedicated emoji collections, copy-paste wishes, and cultural etiquette for global holidays.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/festivals/')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-all cursor-pointer"
          >
            <span>View All {FESTIVALS.length} Festivals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {FESTIVALS.slice(0, 12).map((fest) => (
            <div
              key={fest.slug}
              onClick={() => onNavigate(`/festivals/${fest.slug}/`)}
              className="group p-3.5 rounded-2xl bg-white dark:bg-neutral-800/90 border border-neutral-200/90 dark:border-neutral-700/80 hover:border-blue-400 dark:hover:border-blue-500 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2 text-center">
                <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform select-none py-1">
                  {fest.icon}
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {fest.name.split(' ')[0]}
                  </h3>
                  <p className="text-[11px] text-neutral-400 truncate">
                    {fest.seasonOrDate.split('(')[0].trim()}
                  </p>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-700/60 flex items-center justify-center gap-1 text-sm">
                {fest.glyphs.slice(0, 3).map((g, i) => (
                  <span key={i} className="hover:scale-125 transition-transform">{g}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consumer-Friendly Informative Guides */}
      <article className="space-y-8 text-neutral-800 dark:text-neutral-200">
        <section className="bg-white dark:bg-neutral-800 p-6 sm:p-8 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.04)] space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            All Emojis on Apple: Complete Directory of Apple Emoji & Emoji for iOS
          </h2>
          <p className="leading-relaxed text-neutral-600 dark:text-neutral-300">
            The <strong>iPhone emoji</strong> keyboard is loved worldwide for its distinctive gloss, multi-layered shading, and emotional depth. Each symbol in this directory is fully compatible with Apple iOS, Android, macOS, and Windows.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-black/[0.04] dark:border-white/[0.04]">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">
                1-Click Instant Copy
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Click any emoji in our directory to instantly copy it for WhatsApp, Instagram, TikTok, and iMessage.
              </p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-black/[0.04] dark:border-white/[0.04]">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">
                Save Transparent PNGs
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Download crisp 512px high-resolution images with transparent backgrounds for graphic designs and video stickers.
              </p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-black/[0.04] dark:border-white/[0.04]">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">
                Universal Compatibility
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Works seamlessly across Samsung, Google Pixel, Xiaomi, PC, and Mac without needing any special app installation.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Sending Emoji to iPhone */}
        <section className="bg-white dark:bg-neutral-800 p-6 sm:p-8 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.04)] space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            How to Send Emojis to iPhone from Any Phone
          </h2>
          <p className="leading-relaxed text-neutral-600 dark:text-neutral-300">
            Because emojis follow standardized Unicode protocols, sending an emoji from an Android phone or PC to an iPhone is effortless. When you copy an emoji from this keyboard and send it in a message, your recipient's iPhone automatically displays Apple's native design.
          </p>
          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-2xl border border-black/[0.04] dark:border-white/[0.04] text-sm space-y-2">
            <h4 className="font-semibold text-neutral-900 dark:text-white">3 Simple Steps to Send:</h4>
            <ol className="list-decimal pl-5 space-y-1.5 text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">
              <li>Tap or click any emoji on this page to copy it to your clipboard.</li>
              <li>Open your favorite messaging app (WhatsApp, Instagram DM, Messages, Telegram).</li>
              <li>Paste and send. The recipient on iPhone will see the full Apple emoji rendering instantly!</li>
            </ol>
          </div>
        </section>

        {/* Section 3: Emot iPhone - Indonesian & Southeast Asian viral query */}
        <section className="bg-white dark:bg-neutral-800 p-6 sm:p-8 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.04)] space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Emot iPhone: Cara Menggunakan Emoji Apple di HP Android Tanpa Root
          </h2>
          <p className="leading-relaxed text-neutral-600 dark:text-neutral-300">
            Istilah <strong>emot iphone</strong> sangat populer bagi pengguna Android di Indonesia yang menyukai tampilan visual Apple iOS di HP Xiaomi, Samsung, Oppo, Vivo, dan Realme agar story media sosial terlihat lebih estetik.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-black/[0.04] dark:border-white/[0.04]">
              <h4 className="font-bold text-neutral-900 dark:text-white mb-1">
                Metode 1: Salin Langsung via Web Keyboard
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400">
                Cukup salin emoji langsung dari web ini. Saat dikirim ke teman pengguna iPhone, mereka akan melihat ikon Apple asli secara otomatis.
              </p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-black/[0.04] dark:border-white/[0.04]">
              <h4 className="font-bold text-neutral-900 dark:text-white mb-1">
                Metode 2: Menggunakan Font iOS (zFont 3)
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400">
                Gunakan aplikasi pengatur font seperti zFont 3 untuk mengubah font keyboard sistem Android menjadi gaya iOS tanpa root.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Frequently Asked Questions */}
      <section className="bg-white dark:bg-neutral-800 p-6 sm:p-8 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.04)] space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Frequently Asked Questions</h2>
        <div className="space-y-3">
          <details className="group p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-black/[0.04] dark:border-white/[0.04]" open>
            <summary className="font-semibold text-neutral-900 dark:text-white cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
              <span>How do I copy and paste an iPhone emoji?</span>
              <span className="transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              Simply click or tap any emoji card on this site. The authentic Apple emoji glyph is instantly copied to your clipboard ready for WhatsApp, Instagram, TikTok, and messages.
            </p>
          </details>

          <details className="group p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-black/[0.04] dark:border-white/[0.04]">
            <summary className="font-semibold text-neutral-900 dark:text-white cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
              <span>Can I download emoji pictures with transparent backgrounds?</span>
              <span className="transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              Yes! Click the download icon on any emoji card to save a high-resolution 512px transparent PNG file directly to your device.
            </p>
          </details>

          <details className="group p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-black/[0.04] dark:border-white/[0.04]">
            <summary className="font-semibold text-neutral-900 dark:text-white cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
              <span>How can I send an emoji to an iPhone user from an Android phone?</span>
              <span className="transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              Copy any symbol from this keyboard and paste it into your chat. Because Unicode standardizes all code points, the recipient on iPhone will automatically see the official Apple emoji.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
};
