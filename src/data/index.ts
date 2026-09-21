import emojisData from '../../data/emojis.json';
import categoriesData from '../../data/categories.json';
import guidesData from '../../data/guides.json';
import festivalsData from '../../data/festivals.json';

export interface EmojiItem {
  slug: string;
  emoji: string;
  name: string;
  category: string;
  unicode: string[];
  unicodeSequence: string;
  hasVariationSelector: boolean;
  isZwjSequence: boolean;
  htmlEntity: string;
  htmlHex: string;
  cssEscape: string;
  jsEscape: string;
  urlEncoded: string;
  keywords: string[];
  shortMeaning: string;
  meanings: {
    general: string;
    romantic: string;
    friendship: string;
    socialMedia: string;
    texting: string;
  };
  contexts: string[];
  related: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface CategoryItem {
  slug: string;
  name: string;
  icon: string;
  isConventional?: boolean;
  h1: string;
  description: string;
  introCopy: string;
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface FestivalGreeting {
  title: string;
  text: string;
  emojiCombo: string;
}

export interface FestivalCombo {
  combo: string;
  label: string;
  meaning: string;
}

export interface FestivalItem {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  seasonOrDate: string;
  region: string;
  h1: string;
  description: string;
  culturalSignificance: string;
  traditions: string[];
  glyphs: string[];
  emojiSlugs: string[];
  combos: FestivalCombo[];
  greetings: FestivalGreeting[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface GuideItem {
  slug: string;
  title: string;
  description: string;
  h1: string;
  publishedDate: string;
  author: string;
  readingTime: string;
  relevantEmojis: string[];
  contentSections: {
    heading: string;
    body: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const EMOJIS: EmojiItem[] = emojisData as EmojiItem[];
export const CATEGORIES: CategoryItem[] = categoriesData as CategoryItem[];
export const GUIDES: GuideItem[] = guidesData as GuideItem[];
export const FESTIVALS: FestivalItem[] = festivalsData as FestivalItem[];

export const EMOJI_BY_SLUG = new Map<string, EmojiItem>(
  EMOJIS.map((e) => [e.slug, e])
);

export const CATEGORY_BY_SLUG = new Map<string, CategoryItem>(
  CATEGORIES.map((c) => [c.slug, c])
);

export const GUIDE_BY_SLUG = new Map<string, GuideItem>(
  GUIDES.map((g) => [g.slug, g])
);

export const FESTIVAL_BY_SLUG = new Map<string, FestivalItem>(
  FESTIVALS.map((f) => [f.slug, f])
);
