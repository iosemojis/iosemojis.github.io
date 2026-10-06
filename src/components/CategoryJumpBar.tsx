import React from 'react';

export interface CategoryJumpItem {
  id: string;
  icon: string;
  label: string;
}

export const CATEGORY_JUMP_ITEMS: CategoryJumpItem[] = [
  { id: 'search', icon: '🔍', label: 'Search' },
  { id: 'popular', icon: '💯', label: 'Popular' },
  { id: 'smileys-emotions', icon: '😀', label: 'Faces' },
  { id: 'hearts-love', icon: '❤️', label: 'Hearts' },
  { id: 'aesthetic-combos', icon: '✨', label: 'Aesthetic' },
  { id: 'people-gestures', icon: '👋', label: 'Hands' },
  { id: 'people-roles', icon: '🧑', label: 'People' },
  { id: 'animals-nature', icon: '🐶', label: 'Animals' },
  { id: 'food-drinks', icon: '🍕', label: 'Food' },
  { id: 'travel-places', icon: '✈️', label: 'Travel' },
  { id: 'activities-sports', icon: '⚽', label: 'Sports' },
  { id: 'gaming-esports', icon: '🎮', label: 'Gaming' },
  { id: 'objects-tech', icon: '💻', label: 'Objects' },
  { id: 'money-wealth', icon: '💰', label: 'Money' },
  { id: 'symbols-zodiac', icon: '🏧', label: 'Symbols' },
  { id: 'flags', icon: '🏁', label: 'Flags' },
  { id: 'tone-light', icon: '🏻', label: 'Skin Tones' },
  { id: 'gender-person', icon: '🧒', label: 'Gender' },
  { id: 'faq-guide', icon: '❓', label: 'Guide' },
];

const CATEGORY_LABELS_BY_LANG: Record<string, Record<string, string>> = {
  en: {
    search: 'Search', popular: 'Popular', 'smileys-emotions': 'Faces', 'hearts-love': 'Hearts',
    'aesthetic-combos': 'Aesthetic', 'people-gestures': 'Hands', 'people-roles': 'People',
    'animals-nature': 'Animals', 'food-drinks': 'Food', 'travel-places': 'Travel',
    'activities-sports': 'Sports', 'gaming-esports': 'Gaming', 'objects-tech': 'Objects',
    'money-wealth': 'Money', 'symbols-zodiac': 'Symbols', flags: 'Flags',
    'tone-light': 'Skin Tones', 'gender-person': 'Gender', 'faq-guide': 'Guide',
  },
  es: {
    search: 'Buscar', popular: 'Populares', 'smileys-emotions': 'Caritas', 'hearts-love': 'Corazones',
    'aesthetic-combos': 'Aesthetic', 'people-gestures': 'Manos', 'people-roles': 'Personas',
    'animals-nature': 'Animales', 'food-drinks': 'Comida', 'travel-places': 'Viajes',
    'activities-sports': 'Deportes', 'gaming-esports': 'Juegos', 'objects-tech': 'Objetos',
    'money-wealth': 'Dinero', 'symbols-zodiac': 'Símbolos', flags: 'Banderas',
    'tone-light': 'Tonos de Piel', 'gender-person': 'Género', 'faq-guide': 'Guía',
  },
  pt: {
    search: 'Buscar', popular: 'Populares', 'smileys-emotions': 'Carinhas', 'hearts-love': 'Corações',
    'aesthetic-combos': 'Aesthetic', 'people-gestures': 'Mãos', 'people-roles': 'Pessoas',
    'animals-nature': 'Animais', 'food-drinks': 'Comida', 'travel-places': 'Viagem',
    'activities-sports': 'Esportes', 'gaming-esports': 'Jogos', 'objects-tech': 'Objetos',
    'money-wealth': 'Dinheiro', 'symbols-zodiac': 'Símbolos', flags: 'Bandeiras',
    'tone-light': 'Tons de Pele', 'gender-person': 'Gênero', 'faq-guide': 'Guia',
  },
  de: {
    search: 'Suche', popular: 'Beliebt', 'smileys-emotions': 'Gesichter', 'hearts-love': 'Herzen',
    'aesthetic-combos': 'Aesthetic', 'people-gestures': 'Hände', 'people-roles': 'Personen',
    'animals-nature': 'Tiere', 'food-drinks': 'Essen', 'travel-places': 'Reisen',
    'activities-sports': 'Sport', 'gaming-esports': 'Gaming', 'objects-tech': 'Objekte',
    'money-wealth': 'Geld', 'symbols-zodiac': 'Symbole', flags: 'Flaggen',
    'tone-light': 'Hauttöne', 'gender-person': 'Geschlecht', 'faq-guide': 'Anleitung',
  },
  fr: {
    search: 'Recherche', popular: 'Populaire', 'smileys-emotions': 'Visages', 'hearts-love': 'Cœurs',
    'aesthetic-combos': 'Aesthetic', 'people-gestures': 'Mains', 'people-roles': 'Personnes',
    'animals-nature': 'Animaux', 'food-drinks': 'Nourriture', 'travel-places': 'Voyage',
    'activities-sports': 'Sports', 'gaming-esports': 'Jeux', 'objects-tech': 'Objets',
    'money-wealth': 'Argent', 'symbols-zodiac': 'Symboles', flags: 'Drapeaux',
    'tone-light': 'Teintes de Peau', 'gender-person': 'Genre', 'faq-guide': 'Guide',
  },
  it: {
    search: 'Cerca', popular: 'Popolari', 'smileys-emotions': 'Faccine', 'hearts-love': 'Cuori',
    'aesthetic-combos': 'Aesthetic', 'people-gestures': 'Mani', 'people-roles': 'Persone',
    'animals-nature': 'Animali', 'food-drinks': 'Cibo', 'travel-places': 'Viaggi',
    'activities-sports': 'Sport', 'gaming-esports': 'Gaming', 'objects-tech': 'Oggetti',
    'money-wealth': 'Soldi', 'symbols-zodiac': 'Simboli', flags: 'Bandiere',
    'tone-light': 'Tonalità Pelle', 'gender-person': 'Genere', 'faq-guide': 'Guida',
  },
  id: {
    search: 'Cari', popular: 'Populer', 'smileys-emotions': 'Wajah', 'hearts-love': 'Hati',
    'aesthetic-combos': 'Aesthetic', 'people-gestures': 'Tangan', 'people-roles': 'Orang',
    'animals-nature': 'Hewan', 'food-drinks': 'Makanan', 'travel-places': 'Wisata',
    'activities-sports': 'Olahraga', 'gaming-esports': 'Game', 'objects-tech': 'Benda',
    'money-wealth': 'Uang', 'symbols-zodiac': 'Simbol', flags: 'Bendera',
    'tone-light': 'Warna Kulit', 'gender-person': 'Gender', 'faq-guide': 'Panduan',
  },
  ja: {
    search: '検索', popular: '人気', 'smileys-emotions': '顔文字', 'hearts-love': 'ハート',
    'aesthetic-combos': '可愛い', 'people-gestures': '手・ジェスチャー', 'people-roles': '人物',
    'animals-nature': '動物・自然', 'food-drinks': '食べ物', 'travel-places': '旅行',
    'activities-sports': 'スポーツ', 'gaming-esports': 'ゲーム', 'objects-tech': '物・ツール',
    'money-wealth': 'お金', 'symbols-zodiac': '記号', flags: '国旗',
    'tone-light': '肌の色', 'gender-person': '性別', 'faq-guide': '使い方',
  },
};

interface CategoryJumpBarProps {
  activeId?: string;
  lang?: string;
}

export const CategoryJumpBar: React.FC<CategoryJumpBarProps> = ({ activeId, lang = 'en' }) => {
  const labels = CATEGORY_LABELS_BY_LANG[lang] || CATEGORY_LABELS_BY_LANG['en'];
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // account for sticky header & bar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Emoji Category Quick Navigation"
      className="sticky top-16 z-30 w-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 py-2 transition-all shadow-xs"
    >
      <div className="max-w-6xl mx-auto px-4 overflow-x-auto custom-horizontal-scrollbar flex items-center gap-1.5 sm:gap-2 no-scrollbar py-0.5">
        {CATEGORY_JUMP_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleScrollTo(item.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span className="whitespace-nowrap">{labels[item.id] || item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
