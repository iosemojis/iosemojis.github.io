import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Copy, Check, Sparkles, ChevronDown } from 'lucide-react';
import { EMOJIS, EmojiItem, MULTILINGUAL_BY_CODE } from '../data/index.ts';
import { searchEmojis } from '../utils/search.ts';
import { copyToClipboard } from '../utils/download.ts';
import { trackEvent } from '../utils/analytics.ts';
import { showToast } from '../components/Toast.tsx';
import { AdSlot } from '../components/AdSlot.tsx';
import { CategoryJumpBar } from '../components/CategoryJumpBar.tsx';
import { EmojiClipboardBar } from '../components/EmojiClipboardBar.tsx';

interface HomeViewProps {
  onNavigate: (path: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  lang?: string;
}


const UI_COPY: Record<string, {
  badge: string;
  subtitle: string;
  searchPlaceholder: string;
  searchResults: string;
  noResults: string;
  clearSearch: string;
  popularTrending: string;
  combosSub: string;
}> = {
  en: {
    badge: '🍎 Authentic iOS Apple Glyphs • 1-Click Copy & Paste • Free Web Tool',
    subtitle: 'Click any emoji to copy instantly or build multi-emoji sentences. Browse authentic Apple iPhone emojis, heart colors, aesthetic bio combos, and skin tones.',
    searchPlaceholder: 'Search 3,800+ emojis (e.g., heart, skull, laughing, crying, fire)...',
    searchResults: 'Search Results',
    noResults: 'No matching emojis found.',
    clearSearch: 'Clear search',
    popularTrending: 'Trending worldwide',
    combosSub: 'Copy aesthetic sets for Instagram bio, TikTok & WhatsApp status',
  },
  es: {
    badge: '🍎 Emojis Auténticos de iPhone Apple • Copiar y Pegar en 1 Clic • Gratis',
    subtitle: 'Haz clic en cualquier emoji para copiarlo al instante o crear combinaciones. Explora emojis de iPhone de Apple, corazones de colores, combos aesthetic y tonos de piel.',
    searchPlaceholder: 'Buscar más de 3.800 emojis (ej. corazón, calavera, risa, fuego)...',
    searchResults: 'Resultados de búsqueda',
    noResults: 'No se encontraron emojis.',
    clearSearch: 'Borrar búsqueda',
    popularTrending: 'Tendencia mundial',
    combosSub: 'Copia combinaciones aesthetic para tu biografía de Instagram, TikTok y WhatsApp',
  },
  pt: {
    badge: '🍎 Emojis Oficiais do iPhone Apple • Copiar e Colar em 1 Clique • Grátis',
    subtitle: 'Clique em qualquer emoji para copiar na hora ou montar frases com múltiplos emojis. Navegue pelos emojis do iPhone, corações coloridos, combos aesthetic e tons de pele.',
    searchPlaceholder: 'Pesquisar mais de 3.800 emojis (ex: coração, caveira, fogo, rindo)...',
    searchResults: 'Resultados da pesquisa',
    noResults: 'Nenhum emoji encontrado.',
    clearSearch: 'Limpar pesquisa',
    popularTrending: 'Tendência mundial',
    combosSub: 'Copie combinações aesthetic para biografia do Instagram, TikTok e status do WhatsApp',
  },
  de: {
    badge: '🍎 Echte Apple iPhone Emojis • Mit 1 Klick Kopieren • Kostenlos',
    subtitle: 'Klicke auf ein Emoji, um es sofort zu kopieren oder Kombinationen zu erstellen. Entdecke originale iPhone Emojis, bunte Herzen, ästhetische Bio-Kombis und Hauttöne.',
    searchPlaceholder: 'Über 3.800 Emojis durchsuchen (z.B. Herz, Totenkopf, Lachen, Feuer)...',
    searchResults: 'Suchergebnisse',
    noResults: 'Keine passenden Emojis gefunden.',
    clearSearch: 'Suche löschen',
    popularTrending: 'Weltweit im Trend',
    combosSub: 'Kopiere ästhetische Sets für deine Instagram-Bio, TikTok & WhatsApp-Status',
  },
  fr: {
    badge: '🍎 Émojis Authentiques Apple iPhone • Copier-Coller en 1 Clic • Gratuit',
    subtitle: "Cliquez sur n'importe quel émoji pour le copier instantanément. Parcourez les émojis iPhone originaux, cœurs de couleur, combinaisons esthétiques et teintes de peau.",
    searchPlaceholder: 'Rechercher parmi 3 800+ émojis (ex: cœur, crâne, rire, feu)...',
    searchResults: 'Résultats de recherche',
    noResults: 'Aucun émoji trouvé.',
    clearSearch: 'Effacer la recherche',
    popularTrending: 'Tendance mondiale',
    combosSub: 'Copiez des sets esthétiques pour bio Instagram, TikTok et statuts WhatsApp',
  },
  it: {
    badge: '🍎 Emoji Autentiche Apple iPhone • Copia e Incolla con 1 Clic • Gratis',
    subtitle: "Clicca su qualsiasi emoji per copiarla all'istante o creare combinazioni. Sfoglia le emoji iPhone originali, cuori colorati, combo aesthetic e tonalità della pelle.",
    searchPlaceholder: 'Cerca tra oltre 3.800 emoji (es: cuore, teschio, risata, fuoco)...',
    searchResults: 'Risultati della ricerca',
    noResults: 'Nessuna emoji trovata.',
    clearSearch: 'Cancella ricerca',
    popularTrending: 'Di tendenza nel mondo',
    combosSub: 'Copia combinazioni aesthetic per la bio di Instagram, TikTok e WhatsApp',
  },
  id: {
    badge: '🍎 Emoji Asli iPhone Apple • Salin & Tempel 1 Kali Klik • Gratis',
    subtitle: 'Klik emoji apa saja untuk langsung menyalin ke papan klip atau buat rangkaian emotikon. Temukan emoji iPhone Apple asli, warna hati, kombo aesthetic, dan warna kulit.',
    searchPlaceholder: 'Cari lebih dari 3.800 emoji (contoh: hati, tengkorak, tertawa, api)...',
    searchResults: 'Hasil Pencarian',
    noResults: 'Emoji tidak ditemukan.',
    clearSearch: 'Hapus pencarian',
    popularTrending: 'Sedang tren di dunia',
    combosSub: 'Salin set aesthetic untuk bio Instagram, TikTok & status WhatsApp',
  },
  ja: {
    badge: '🍎 本物のApple iPhone絵文字 • 1クリックでコピペ • 無料Webツール',
    subtitle: 'クリックするだけで絵文字をすぐにコピー＆ペースト。本物のiPhone絵文字、ハートの色、インスタ用の可愛い組み合わせ、肌の色を網羅。',
    searchPlaceholder: '3,800種以上の絵文字を検索 (例: ハート、ドクロ、笑顔、泣く、炎)...',
    searchResults: '検索結果',
    noResults: '該当する絵文字が見つかりません。',
    clearSearch: '検索をクリア',
    popularTrending: '世界中で人気',
    combosSub: 'プロフや投稿に使える可愛い絵文字セットをワンクリックでコピペ',
  },
};

// Curated Aesthetic Combos for Instagram & TikTok Bios
const AESTHETIC_COMBOS = [
  { combo: '🫧🤍✨', label: 'Soft Clean Aesthetic', vibe: 'Clean, Pure, Minimal' },
  { combo: '🧸🎀🩰', label: 'Coquette & Balletcore', vibe: 'Soft Pink, Girly, Cute' },
  { combo: '🌿🍵🕯️', label: 'Cottagecore Study', vibe: 'Cozy, Relaxed, Warm' },
  { combo: '🎧🖤🦇', label: 'Dark Academia', vibe: 'Moody, Vintage, Grunge' },
  { combo: '🍓🍰🍼', label: 'Pastel Sweetness', vibe: 'Dessert, Soft, Kawaii' },
  { combo: '🪐🌙✨', label: 'Celestial Night', vibe: 'Stars, Moon, Galaxy' },
  { combo: '💌🌸🏹', label: 'Love Letter', vibe: 'Romance, Cupid, Blossom' },
  { combo: '🌊🌴☀️', label: 'Tropical Summer', vibe: 'Beach, Vacation, Sunshine' },
  { combo: '⚡️🥀⛓️', label: 'Y2K Cyber Alt', vibe: 'Edgy, Nightcore, Aesthetic' },
  { combo: '🕊️📖☕️', label: 'Poetry & Coffee', vibe: 'Peaceful, Intellectual' },
  { combo: '🍂🧣☕️', label: 'Autumn Cozy', vibe: 'Warmth, Books, Fall' },
  { combo: '🫧🪞🪄', label: 'Dreamy Fairycore', vibe: 'Magic, Mirror, Sparkles' },
];

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, searchInputRef, lang = 'en' }) => {
  const langConfig = useMemo(() => {
    return MULTILINGUAL_BY_CODE.get(lang) || MULTILINGUAL_BY_CODE.get('en')!;
  }, [lang]);

  const sectionH2 = useMemo(() => {
    return new Map(langConfig.h2_sections.map((s) => [s.id, s.h2]));
  }, [langConfig]);

  const uiCopy = UI_COPY[lang] || UI_COPY['en'];
  const [searchQuery, setSearchQuery] = useState('');
  const [clipboardText, setClipboardText] = useState('');
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);

  // Group emojis into categorical sets
  const categoryGroups = useMemo(() => {
    return {
      popular: EMOJIS.filter((e) =>
        ['red-heart', 'face-with-tears-of-joy', 'sparkles', 'fire', 'skull', 'thumbs-up', 'eyes', 'folded-hands', 'smiling-face-with-heart-eyes', 'melting-face', 'party-popper', 'hundred-points'].includes(e.slug)
      ),
      smileys: EMOJIS.filter((e) => e.category === 'smileys-emotions'),
      hearts: EMOJIS.filter((e) => e.category === 'hearts-love'),
      hands: EMOJIS.filter((e) => e.category === 'hands-gestures'),
      people: EMOJIS.filter((e) => e.category === 'people-body' && !e.unicode.some((u) => u.startsWith('1F3F'))),
      animals: EMOJIS.filter((e) => e.category === 'animals-nature'),
      food: EMOJIS.filter((e) => e.category === 'food-drinks'),
      travel: EMOJIS.filter((e) => e.category === 'travel-places'),
      sports: EMOJIS.filter((e) => e.category === 'activities-sports'),
      gaming: EMOJIS.filter((e) => ['video-game', 'joystick', 'alien-monster', 'bullseye', 'game-die', 'trophy', 'first-place-medal', 'headphone', 'crossed-swords', 'shield', 'joker', 'robot', 'puzzle-piece', 'bowling', 'boxing-glove'].includes(e.slug)),
      objects: EMOJIS.filter((e) => e.category === 'objects-tech'),
      money: EMOJIS.filter((e) => ['money-bag', 'dollar-banknote', 'money-with-wings', 'credit-card', 'money-mouth-face', 'chart-increasing', 'chart-decreasing', 'gem-stone', 'bank', 'coin', 'bar-chart'].includes(e.slug)),
      symbols: EMOJIS.filter((e) => e.category === 'symbols-zodiac'),
      flags: EMOJIS.filter((e) => e.category === 'flags'),
      // Fitzpatrick Tones
      toneLight: EMOJIS.filter((e) => e.unicode.some((u) => u === '1F3FB')).slice(0, 48),
      toneMediumLight: EMOJIS.filter((e) => e.unicode.some((u) => u === '1F3FC')).slice(0, 48),
      toneMedium: EMOJIS.filter((e) => e.unicode.some((u) => u === '1F3FD')).slice(0, 48),
      toneMediumDark: EMOJIS.filter((e) => e.unicode.some((u) => u === '1F3FE')).slice(0, 48),
      toneDark: EMOJIS.filter((e) => e.unicode.some((u) => u === '1F3FF')).slice(0, 48),
      toneMultiple: EMOJIS.filter((e) => e.unicode.filter((u) => u.startsWith('1F3F')).length > 1).slice(0, 36),
      // Gender filters
      genderPerson: EMOJIS.filter((e) => e.category === 'people-body' && (e.name.toLowerCase().includes('person') || e.name.toLowerCase().includes('child'))).slice(0, 48),
      genderMen: EMOJIS.filter((e) => e.category === 'people-body' && (e.name.toLowerCase().includes('man') || e.name.toLowerCase().includes('boy'))).slice(0, 48),
      genderWomen: EMOJIS.filter((e) => e.category === 'people-body' && (e.name.toLowerCase().includes('woman') || e.name.toLowerCase().includes('girl'))).slice(0, 48),
    };
  }, []);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchEmojis(EMOJIS, searchQuery);
  }, [searchQuery]);

  // Click Handler: Both Copies Immediately & Appends to Live Clipboard Bar
  const handleEmojiClick = async (emoji: string, name: string) => {
    // 1. Copy to clipboard
    await copyToClipboard(emoji);
    setCopiedEmoji(emoji);
    showToast(`${emoji} Copied to clipboard! ✨`);
    trackEvent('emoji_click_keyboard', { emoji, name });

    // 2. Append to clipboard bar
    setClipboardText((prev) => prev + emoji);

    setTimeout(() => {
      setCopiedEmoji((curr) => (curr === emoji ? null : curr));
    }, 1500);
  };

  const handleCopyCombo = async (combo: string, label: string) => {
    await copyToClipboard(combo);
    showToast(`${combo} Copied combo! ✨`);
    setClipboardText((prev) => prev + ' ' + combo);
    trackEvent('combo_copy', { combo, label });
  };

  return (
    <div className="pb-28">
      {/* Category Jump Bar */}
      <CategoryJumpBar lang={lang} />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Main Hero Header: Verified H1 */}
        <header className="text-center max-w-3xl mx-auto pt-2 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3 border border-blue-200/60 dark:border-blue-800/60">
            <span>{uiCopy.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
            {langConfig.h1}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto">
            {uiCopy.subtitle}
          </p>
        </header>

        {/* SECTION 1: SEARCH */}
        <section id="search" className="scroll-mt-32 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
            <span>{sectionH2.get('search')}</span>
          </h2>
          <div className="relative flex items-center bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-300 dark:border-neutral-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <Search className="absolute left-4 w-5 h-5 text-neutral-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 3,800+ emojis (e.g., heart, skull, laughing, crying, cat, fire)..."
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-400 text-sm sm:text-base focus:outline-none"
              aria-label="Search emojis"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Active Search Results Grid */}
          {searchQuery.trim() && (
            <div className="mt-4 p-4 bg-neutral-100/70 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700">
              <div className="text-xs font-semibold text-neutral-500 mb-3 flex justify-between items-center">
                <span>Search Results ({searchResults.length} matches)</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 hover:underline text-xs"
                >
                  Clear search
                </button>
              </div>
              {searchResults.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-4">No matching emojis found for "{searchQuery}".</p>
              ) : (
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {searchResults.slice(0, 50).map((emo) => (
                    <button
                      key={emo.slug}
                      type="button"
                      onClick={() => handleEmojiClick(emo.emoji, emo.name)}
                      className="group relative p-2.5 bg-white dark:bg-neutral-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-blue-400 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95"
                      title={`${emo.name} (${emo.emoji}) - Click to copy`}
                    >
                      <span className="text-3xl leading-none">{emo.emoji}</span>
                      <span className="text-[10px] text-neutral-400 truncate max-w-full mt-1 font-mono">
                        {emo.name.slice(0, 10)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Responsive Ad Placement 1 */}
        <AdSlot id="ad-keyboard-top" label="Advertisement" />

        {/* SECTION 2: MOST POPULAR EMOJIS */}
        <section id="popular" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('popular')}</span>
            </h2>
            <span className="text-xs text-neutral-400">Trending worldwide</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2 sm:gap-2.5">
            {categoryGroups.popular.map((emo) => (
              <EmojiButton
                key={emo.slug}
                emoji={emo.emoji}
                name={emo.name}
                isCopied={copiedEmoji === emo.emoji}
                onClick={() => handleEmojiClick(emo.emoji, emo.name)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 3: FACES & EMOTIONS */}
        <section id="smileys-emotions" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('smileys-emotions')}</span>
            </h2>
            <span className="text-xs text-neutral-400">{categoryGroups.smileys.length} smileys</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {categoryGroups.smileys.map((emo) => (
              <EmojiButton
                key={emo.slug}
                emoji={emo.emoji}
                name={emo.name}
                isCopied={copiedEmoji === emo.emoji}
                onClick={() => handleEmojiClick(emo.emoji, emo.name)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 4: HEARTS & LOVE */}
        <section id="hearts-love" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('hearts-love')}</span>
            </h2>
            <span className="text-xs text-neutral-400">All colors & romance</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
            {categoryGroups.hearts.map((emo) => (
              <EmojiButton
                key={emo.slug}
                emoji={emo.emoji}
                name={emo.name}
                isCopied={copiedEmoji === emo.emoji}
                onClick={() => handleEmojiClick(emo.emoji, emo.name)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 5: AESTHETIC EMOJI COMBOS FOR BIO */}
        <section id="aesthetic-combos" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('aesthetic-combos')}</span>
            </h2>
            <span className="text-xs text-neutral-400">1-click copy for Instagram & TikTok</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {AESTHETIC_COMBOS.map((item) => (
              <button
                key={item.combo}
                type="button"
                onClick={() => handleCopyCombo(item.combo, item.label)}
                className="p-3.5 bg-white dark:bg-neutral-800/80 hover:bg-blue-50/70 dark:hover:bg-blue-950/30 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 hover:border-blue-400 transition-all text-left flex items-center justify-between gap-3 cursor-pointer group shadow-2xs"
              >
                <div>
                  <div className="text-2xl tracking-wider mb-1">{item.combo}</div>
                  <div className="font-semibold text-xs text-neutral-900 dark:text-white">{item.label}</div>
                  <div className="text-[11px] text-neutral-400">{item.vibe}</div>
                </div>
                <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-700 group-hover:bg-blue-600 group-hover:text-white rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 transition-colors">
                  Copy
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Responsive Ad Placement 2 */}
        <AdSlot id="ad-keyboard-mid" label="Advertisement" />

        {/* SECTION 6: HAND GESTURES & BODY LANGUAGE */}
        <section id="people-gestures" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('people-gestures')}</span>
            </h2>
            <span className="text-xs text-neutral-400">Hands, fingers & signs</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {categoryGroups.hands.slice(0, 60).map((emo) => (
              <EmojiButton
                key={emo.slug}
                emoji={emo.emoji}
                name={emo.name}
                isCopied={copiedEmoji === emo.emoji}
                onClick={() => handleEmojiClick(emo.emoji, emo.name)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 7: PEOPLE & ROLES */}
        <section id="people-roles" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('people-roles')}</span>
            </h2>
            <span className="text-xs text-neutral-400">Professions, characters & families</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {categoryGroups.people.slice(0, 60).map((emo) => (
              <EmojiButton
                key={emo.slug}
                emoji={emo.emoji}
                name={emo.name}
                isCopied={copiedEmoji === emo.emoji}
                onClick={() => handleEmojiClick(emo.emoji, emo.name)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 8: ANIMALS & NATURE */}
        <section id="animals-nature" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('animals-nature')}</span>
            </h2>
            <span className="text-xs text-neutral-400">Pets, wildlife & flora</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {categoryGroups.animals.map((emo) => (
              <EmojiButton
                key={emo.slug}
                emoji={emo.emoji}
                name={emo.name}
                isCopied={copiedEmoji === emo.emoji}
                onClick={() => handleEmojiClick(emo.emoji, emo.name)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 9: FOOD & DRINKS */}
        <section id="food-drinks" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('food-drinks')}</span>
            </h2>
            <span className="text-xs text-neutral-400">Culinary delights & drinks</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {categoryGroups.food.map((emo) => (
              <EmojiButton
                key={emo.slug}
                emoji={emo.emoji}
                name={emo.name}
                isCopied={copiedEmoji === emo.emoji}
                onClick={() => handleEmojiClick(emo.emoji, emo.name)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 10: TRAVEL & PLACES */}
        <section id="travel-places" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('travel-places')}</span>
            </h2>
            <span className="text-xs text-neutral-400">Transport & world spots</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {categoryGroups.travel.map((emo) => (
              <EmojiButton
                key={emo.slug}
                emoji={emo.emoji}
                name={emo.name}
                isCopied={copiedEmoji === emo.emoji}
                onClick={() => handleEmojiClick(emo.emoji, emo.name)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 11: ACTIVITIES & SPORTS */}
        <section id="activities-sports" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('activities-sports')}</span>
            </h2>
            <span className="text-xs text-neutral-400">Games, medals & sports</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {categoryGroups.sports.map((emo) => (
              <EmojiButton
                key={emo.slug}
                emoji={emo.emoji}
                name={emo.name}
                isCopied={copiedEmoji === emo.emoji}
                onClick={() => handleEmojiClick(emo.emoji, emo.name)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 12: GAMING & DISCORD */}
        <section id="gaming-esports" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('gaming-esports')}</span>
            </h2>
            <span className="text-xs text-neutral-400">Esports & controllers</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {categoryGroups.gaming.map((emo) => (
              <EmojiButton
                key={emo.slug}
                emoji={emo.emoji}
                name={emo.name}
                isCopied={copiedEmoji === emo.emoji}
                onClick={() => handleEmojiClick(emo.emoji, emo.name)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 13: OBJECTS & TOOLS */}
        <section id="objects-tech" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('objects-tech')}</span>
            </h2>
            <span className="text-xs text-neutral-400">Electronics, stationery & tools</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {categoryGroups.objects.slice(0, 72).map((emo) => (
              <EmojiButton
                key={emo.slug}
                emoji={emo.emoji}
                name={emo.name}
                isCopied={copiedEmoji === emo.emoji}
                onClick={() => handleEmojiClick(emo.emoji, emo.name)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 14: MONEY & WEALTH */}
        <section id="money-wealth" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('money-wealth')}</span>
            </h2>
            <span className="text-xs text-neutral-400">Cash, charts & coins</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
            {categoryGroups.money.map((emo) => (
              <EmojiButton
                key={emo.slug}
                emoji={emo.emoji}
                name={emo.name}
                isCopied={copiedEmoji === emo.emoji}
                onClick={() => handleEmojiClick(emo.emoji, emo.name)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 15: SYMBOLS & SIGNS */}
        <section id="symbols-zodiac" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('symbols-zodiac')}</span>
            </h2>
            <span className="text-xs text-neutral-400">Zodiac, math & signs</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {categoryGroups.symbols.slice(0, 72).map((emo) => (
              <EmojiButton
                key={emo.slug}
                emoji={emo.emoji}
                name={emo.name}
                isCopied={copiedEmoji === emo.emoji}
                onClick={() => handleEmojiClick(emo.emoji, emo.name)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 16: FLAGS */}
        <section id="flags" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('flags')}</span>
            </h2>
            <span className="text-xs text-neutral-400">World flags & banners</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {categoryGroups.flags.slice(0, 60).map((emo) => (
              <EmojiButton
                key={emo.slug}
                emoji={emo.emoji}
                name={emo.name}
                isCopied={copiedEmoji === emo.emoji}
                onClick={() => handleEmojiClick(emo.emoji, emo.name)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 17-21: SKIN TONES */}
        <section id="tone-light" className="scroll-mt-32 space-y-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
              <span>{sectionH2.get('tone-light')}</span>
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
              {categoryGroups.toneLight.map((emo) => (
                <EmojiButton key={emo.slug} emoji={emo.emoji} name={emo.name} isCopied={copiedEmoji === emo.emoji} onClick={() => handleEmojiClick(emo.emoji, emo.name)} />
              ))}
            </div>
          </div>

          <div id="tone-medium-light" className="scroll-mt-32">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
              <span>{sectionH2.get('tone-medium-light')}</span>
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
              {categoryGroups.toneMediumLight.map((emo) => (
                <EmojiButton key={emo.slug} emoji={emo.emoji} name={emo.name} isCopied={copiedEmoji === emo.emoji} onClick={() => handleEmojiClick(emo.emoji, emo.name)} />
              ))}
            </div>
          </div>

          <div id="tone-medium" className="scroll-mt-32">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
              <span>{sectionH2.get('tone-medium')}</span>
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
              {categoryGroups.toneMedium.map((emo) => (
                <EmojiButton key={emo.slug} emoji={emo.emoji} name={emo.name} isCopied={copiedEmoji === emo.emoji} onClick={() => handleEmojiClick(emo.emoji, emo.name)} />
              ))}
            </div>
          </div>

          <div id="tone-medium-dark" className="scroll-mt-32">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
              <span>{sectionH2.get('tone-medium-dark')}</span>
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
              {categoryGroups.toneMediumDark.map((emo) => (
                <EmojiButton key={emo.slug} emoji={emo.emoji} name={emo.name} isCopied={copiedEmoji === emo.emoji} onClick={() => handleEmojiClick(emo.emoji, emo.name)} />
              ))}
            </div>
          </div>

          <div id="tone-dark" className="scroll-mt-32">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
              <span>{sectionH2.get('tone-dark')}</span>
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
              {categoryGroups.toneDark.map((emo) => (
                <EmojiButton key={emo.slug} emoji={emo.emoji} name={emo.name} isCopied={copiedEmoji === emo.emoji} onClick={() => handleEmojiClick(emo.emoji, emo.name)} />
              ))}
            </div>
          </div>

          <div id="tone-multiple" className="scroll-mt-32">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
              <span>{sectionH2.get('tone-multiple')}</span>
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
              {categoryGroups.toneMultiple.map((emo) => (
                <EmojiButton key={emo.slug} emoji={emo.emoji} name={emo.name} isCopied={copiedEmoji === emo.emoji} onClick={() => handleEmojiClick(emo.emoji, emo.name)} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 22-24: GENDER BREAKDOWN */}
        <section id="gender-person" className="scroll-mt-32 space-y-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
              <span>{sectionH2.get('gender-person')}</span>
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
              {categoryGroups.genderPerson.map((emo) => (
                <EmojiButton key={emo.slug} emoji={emo.emoji} name={emo.name} isCopied={copiedEmoji === emo.emoji} onClick={() => handleEmojiClick(emo.emoji, emo.name)} />
              ))}
            </div>
          </div>

          <div id="gender-men" className="scroll-mt-32">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
              <span>{sectionH2.get('gender-men')}</span>
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
              {categoryGroups.genderMen.map((emo) => (
                <EmojiButton key={emo.slug} emoji={emo.emoji} name={emo.name} isCopied={copiedEmoji === emo.emoji} onClick={() => handleEmojiClick(emo.emoji, emo.name)} />
              ))}
            </div>
          </div>

          <div id="gender-women" className="scroll-mt-32">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
              <span>{sectionH2.get('gender-women')}</span>
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
              {categoryGroups.genderWomen.map((emo) => (
                <EmojiButton key={emo.slug} emoji={emo.emoji} name={emo.name} isCopied={copiedEmoji === emo.emoji} onClick={() => handleEmojiClick(emo.emoji, emo.name)} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 25: GUIDE & FAQ */}
        <section id="faq-guide" className="scroll-mt-32 bg-white dark:bg-neutral-800/60 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-700/80 shadow-xs space-y-6">
          <div className="border-b border-neutral-200 dark:border-neutral-700 pb-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{sectionH2.get('faq-guide')}</span>
            </h2>
            <p className="text-sm text-neutral-500 mt-1">Frequently asked questions and keyboard guide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-bold text-neutral-900 dark:text-white text-base">How do I copy an emoji to WhatsApp or Instagram?</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Click or tap any emoji on this page. It is copied instantly to your clipboard! You can also click multiple emojis to build text in the floating bottom copy bar, then click <strong>Copy All</strong> and paste it directly into WhatsApp, Instagram bio, TikTok caption, or iMessage.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-neutral-900 dark:text-white text-base">Do these emojis look like iPhone emojis on Windows and Android?</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Yes! When you copy and paste these standard Unicode characters and send them to an iPhone, iPad, or Mac user, they will render natively in Apple's signature glossy iOS artwork.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-neutral-900 dark:text-white text-base">Can I create aesthetic emoji combos for my bio?</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Yes! Scroll up to our <strong>Aesthetic Emoji Combos</strong> section to find 1-click curated combinations for soft girl, coquette, dark academia, and cottagecore bio aesthetics.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-neutral-900 dark:text-white text-base">Looking for fancy text fonts and unicode symbols?</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Check out our companion tool <a href="https://emojisymbols.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">EmojiSymbols.netlify.app ↗</a> for high-resolution PNG downloads, aesthetic bio symbols, and Japanese kaomoji!
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* FLOATING BOTTOM COPY BAR */}
      <EmojiClipboardBar
        value={clipboardText}
        onChange={setClipboardText}
        onClear={() => setClipboardText('')}
      />
    </div>
  );
};

// Reusable Fast-Rendering Emoji Button
const EmojiButton: React.FC<{
  emoji: string;
  name: string;
  isCopied: boolean;
  onClick: () => void;
}> = React.memo(({ emoji, name, isCopied, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative p-2 sm:p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
        isCopied
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
          : 'bg-white dark:bg-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-700/60 border-neutral-200/90 dark:border-neutral-700/80 hover:border-neutral-400 shadow-2xs'
      }`}
      title={`${name} (${emoji}) - Click to copy & add`}
      aria-label={`Copy ${name}`}
    >
      <span className="text-3xl sm:text-3xl leading-none select-none transition-transform group-hover:scale-115">
        {emoji}
      </span>
      {isCopied && (
        <span className="absolute -top-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs animate-bounce">
          ✓
        </span>
      )}
    </button>
  );
});
