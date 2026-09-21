import React, { useState, useMemo } from 'react';
import { Sparkles, Calendar, MapPin, Search, ArrowRight, Check } from 'lucide-react';
import { FESTIVALS, FestivalItem } from '../data/index.ts';
import { copyToClipboard } from '../utils/download.ts';
import { showToast } from '../components/Toast.tsx';
import { trackEvent } from '../utils/analytics.ts';
import { AdSlot } from '../components/AdSlot.tsx';

interface FestivalsListViewProps {
  onNavigate: (path: string) => void;
}

export const FestivalsListView: React.FC<FestivalsListViewProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'autumn-winter' | 'spring-summer' | 'faith'>('all');
  const [copiedGlyph, setCopiedGlyph] = useState<string | null>(null);

  const filteredFestivals = useMemo(() => {
    return FESTIVALS.filter((fest) => {
      const matchesSearch =
        searchQuery === '' ||
        fest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fest.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fest.region.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'all') return true;
      if (activeFilter === 'autumn-winter') {
        const text = (fest.seasonOrDate + ' ' + fest.slug).toLowerCase();
        return (
          text.includes('october') ||
          text.includes('november') ||
          text.includes('december') ||
          text.includes('january') ||
          text.includes('february') ||
          fest.slug === 'diwali' ||
          fest.slug === 'christmas' ||
          fest.slug === 'halloween' ||
          fest.slug === 'thanksgiving' ||
          fest.slug === 'hanukkah' ||
          fest.slug === 'new-year' ||
          fest.slug === 'lunar-new-year'
        );
      }
      if (activeFilter === 'spring-summer') {
        const text = (fest.seasonOrDate + ' ' + fest.slug).toLowerCase();
        return (
          text.includes('march') ||
          text.includes('april') ||
          text.includes('may') ||
          text.includes('june') ||
          fest.slug === 'easter' ||
          fest.slug === 'holi' ||
          fest.slug === 'st-patricks-day' ||
          fest.slug === 'carnival' ||
          fest.slug === 'mothers-fathers-day' ||
          fest.slug === 'earth-day'
        );
      }
      if (activeFilter === 'faith') {
        return ['diwali', 'christmas', 'eid', 'ramadan', 'hanukkah', 'easter', 'holi'].includes(
          fest.slug
        );
      }
      return true;
    });
  }, [searchQuery, activeFilter]);

  const handleCopyQuickGlyph = async (glyph: string, festSlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(glyph);
    if (success) {
      setCopiedGlyph(glyph);
      showToast(`${glyph} Copied to clipboard! ✨`);
      trackEvent('festival_list_quick_copy', {
        glyph,
        festival: festSlug,
      });
      setTimeout(() => {
        setCopiedGlyph(null);
      }, 1500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
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
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
          World Festivals
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200/80 dark:border-blue-800/60">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Global Holiday Celebrations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Popular World Festivals & Holiday Emojis
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-3xl leading-relaxed">
          Dedicated emoji guides, copyable greeting messages, aesthetic sequences, and cultural traditions for major festivals celebrated across the globe.
        </p>
      </header>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search festivals (e.g., Diwali, Eid, Christmas)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/90 dark:border-neutral-700/80 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-white placeholder:text-neutral-400 shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Festivals' },
            { id: 'autumn-winter', label: 'Autumn / Winter' },
            { id: 'spring-summer', label: 'Spring / Summer' },
            { id: 'faith', label: 'Faith & Spiritual' },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setActiveFilter(pill.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === pill.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      <AdSlot format="horizontal" />

      {/* Festivals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFestivals.map((fest) => (
          <div
            key={fest.slug}
            onClick={() => onNavigate(`/festivals/${fest.slug}/`)}
            className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/90 dark:border-neutral-700/80 hover:border-blue-400 dark:hover:border-blue-500 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                  {fest.icon}
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                    <Calendar className="w-3 h-3" />
                    <span>{fest.seasonOrDate.split('(')[0].trim()}</span>
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {fest.name}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                  {fest.tagline}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{fest.region}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5">
              {/* Glyphs Tray */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {fest.glyphs.slice(0, 5).map((glyph, idx) => {
                  const isCopied = copiedGlyph === glyph;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => handleCopyQuickGlyph(glyph, fest.slug, e)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-base border transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-500 text-white border-emerald-600 scale-110'
                          : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200/80 dark:border-neutral-700/80 hover:bg-neutral-100'
                      }`}
                      title={`Copy ${glyph}`}
                    >
                      {isCopied ? <Check className="w-3 h-3" /> : glyph}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                <span>View Emojis, Wishes & Combos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFestivals.length === 0 && (
        <div className="text-center py-12 space-y-3">
          <div className="text-4xl">🔍</div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No festivals matching "{searchQuery}". Try searching for Diwali, Christmas, or Eid.
          </p>
        </div>
      )}
    </div>
  );
};
