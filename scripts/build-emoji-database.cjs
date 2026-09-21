const fs = require('fs');
const path = require('path');

const emojiDataSource = require('emoji-datasource/emoji.json');
const emojilib = require('emojilib');

const existingEmojisPath = path.join(__dirname, '../data/emojis.json');
let existingEmojis = [];
try {
  existingEmojis = JSON.parse(fs.readFileSync(existingEmojisPath, 'utf8'));
} catch (e) {
  console.log('No previous emojis.json or error reading it');
}

const existingBySlug = new Map(existingEmojis.map(e => [e.slug, e]));
const existingByEmoji = new Map(existingEmojis.map(e => [e.emoji, e]));

const SKIN_TONES = {
  '1F3FB': { name: 'Light Skin Tone', slug: 'light-skin-tone' },
  '1F3FC': { name: 'Medium-Light Skin Tone', slug: 'medium-light-skin-tone' },
  '1F3FD': { name: 'Medium Skin Tone', slug: 'medium-skin-tone' },
  '1F3FE': { name: 'Medium-Dark Skin Tone', slug: 'medium-dark-skin-tone' },
  '1F3FF': { name: 'Dark Skin Tone', slug: 'dark-skin-tone' }
};

function parseSkinToneName(toneKey) {
  if (SKIN_TONES[toneKey]) {
    return SKIN_TONES[toneKey].name;
  }
  // Compound skin tone, e.g., '1F3FB-1F3FC'
  const parts = toneKey.split('-');
  const names = parts.map(p => SKIN_TONES[p]?.name || p);
  return names.join(' and ');
}

function parseSkinToneSlug(toneKey) {
  if (SKIN_TONES[toneKey]) {
    return SKIN_TONES[toneKey].slug;
  }
  return toneKey.toLowerCase();
}

function unifiedToEmoji(unified) {
  return unified
    .split('-')
    .map(hex => String.fromCodePoint(parseInt(hex, 16)))
    .join('');
}

function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\b([a-z])/g, (_, l) => l.toUpperCase())
    .trim();
}

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getCategorySlug(e) {
  const cat = e.category || '';
  const sub = e.subcategory || '';
  const name = (e.name || '').toLowerCase();
  const shortName = (e.short_name || '').toLowerCase();

  if (cat === 'Flags') return 'flags';

  // Check love & hearts
  if ((name.includes('heart') && !name.includes('heart of palm')) || shortName.includes('heart') || shortName.includes('cupid')) {
    return 'hearts-love';
  }

  // Check festivals & holidays
  if (name.includes('diwali') || name.includes('diya') || name.includes('christmas') || name.includes('santa') || name.includes('jack-o-lantern') || name.includes('halloween') || name.includes('menorah') || name.includes('easter') || name.includes('thanksgiving') || name.includes('hanukkah')) {
    return 'festivals-holidays';
  }

  // Check celebrations & party
  if (name.includes('party') || name.includes('confetti') || name.includes('firework') || name.includes('sparkler') || name.includes('balloon') || name.includes('cheers') || name.includes('clinking glasses') || name.includes('gift') || name.includes('poppers')) {
    return 'celebrations-party';
  }

  // Check religious & spiritual (exact word boundaries)
  if (/\b(pray|praying|prayer|church|mosque|synagogue|latin cross|star of david|dharma|shinto|hindu|kaaba|quran|bible|rosary|place of worship|om)\b/i.test(name)) {
    return 'religion-spirituality';
  }

  // Check viral emojis
  if (['fire', 'skull', 'saluting face', 'sparkles', 'melting face', 'hundred points', 'eyes', 'clown face', 'hot face', 'cold face', 'moai'].some(v => name === v || shortName === v)) {
    return 'viral-emojis';
  }

  // Check Weather & Sky
  if (sub === 'sky & weather' || sub === 'weather' || ['sun', 'cloud', 'rain', 'snow', 'lightning', 'thunder', 'rainbow', 'umbrella', 'tornado', 'cyclone', 'fog', 'meteor', 'full moon', 'crescent moon'].some(v => name.includes(v) && !name.includes('sunflower') && !name.includes('sunglasses'))) {
    return 'weather-sky';
  }

  // Check Conventional Categories
  if (cat === 'Smileys & Emotion') return 'smileys-emotions';

  if (cat === 'People & Body') {
    if (sub.includes('hand') || name.includes('hand') || name.includes('finger') || name.includes('fist') || name.includes('wave') || name.includes('clap') || name.includes('thumbs') || name.includes('pinch') || name.includes('point') || name.includes('gestur')) {
      return 'hands-gestures';
    }
    return 'people-body';
  }

  // Work & Office
  if (sub === 'office' || sub === 'mail' || ['briefcase', 'paperclip', 'calendar', 'clipboard', 'file folder', 'stapler', 'pencil', 'ballpoint pen', 'computer', 'keyboard', 'laptop'].some(v => name.includes(v))) {
    return 'work-office';
  }

  if (cat === 'Animals & Nature') return 'animals-nature';
  if (cat === 'Food & Drink') return 'food-drinks';
  if (cat === 'Travel & Places') return 'travel-places';
  if (cat === 'Activities') return 'activities-sports';
  if (cat === 'Objects') return 'objects-tech';
  if (cat === 'Symbols') return 'symbols-zodiac';
  if (cat === 'Component') return 'people-body';

  return 'smileys-emotions';
}

function buildEmojiItem({ unified, rawName, shortName, shortNames, categorySlug, isSkinTone = false, skinToneName = '' }) {
  const glyph = unifiedToEmoji(unified);

  // If we already have a hand-curated entry for this exact emoji glyph, keep its rich handcrafted metadata!
  if (existingByEmoji.has(glyph)) {
    const existing = existingByEmoji.get(glyph);
    return {
      ...existing,
      unicodeSequence: unified.toLowerCase(),
      category: categorySlug
    };
  }

  const codepoints = unified.split('-');
  const unicodeList = codepoints.map(hex => `U+${hex.toUpperCase()}`);
  const unicodeSequence = unified.toLowerCase();
  const hasVariationSelector = codepoints.includes('FE0F');
  const isZwjSequence = codepoints.includes('200D');

  let baseTitle = toTitleCase(rawName || shortName);
  // Clean up title if needed
  baseTitle = baseTitle.replace(/Sign$/, '').trim();

  let finalName = baseTitle;
  if (isSkinTone && skinToneName) {
    finalName = `${baseTitle} (${skinToneName})`;
  }

  let slugBase = toSlug(finalName);
  if (!slugBase) {
    slugBase = `emoji-${unicodeSequence}`;
  }

  // Escapes
  const htmlEntity = codepoints.map(c => `&#x${c};`).join('');
  const htmlHex = codepoints.map(c => `&#x${c};`).join('');
  const cssEscape = codepoints.map(c => `\\${c}`).join('');
  const jsEscape = `"${codepoints.map(c => `\\u{${c}}`).join('')}"`;
  const urlEncoded = encodeURIComponent(glyph);

  // Keywords from emojilib and short_names
  const libKeywords = emojilib[glyph] || [];
  const nameWords = baseTitle.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const keywordSet = new Set([
    ...shortNames.map(s => s.replace(/_/g, ' ')),
    ...libKeywords.map(k => k.replace(/_/g, ' ')),
    ...nameWords,
    `${baseTitle.toLowerCase()} emoji`,
    `${glyph} emoji`,
    `copy ${baseTitle.toLowerCase()}`,
    ...unicodeList.map(u => u.toLowerCase())
  ]);

  if (isSkinTone && skinToneName) {
    keywordSet.add(skinToneName.toLowerCase());
    keywordSet.add(`${baseTitle.toLowerCase()} ${skinToneName.toLowerCase()}`);
  }

  const keywords = Array.from(keywordSet).slice(0, 15);

  const shortMeaning = `The ${glyph} ${finalName} emoji is an official Unicode symbol commonly used in digital messaging and social captions.`;

  const meanings = {
    general: `The ${glyph} ${finalName} conveys ${baseTitle.toLowerCase()} in digital conversations, expressing standard visual and contextual emotion.`,
    romantic: `In personal or romantic messaging, ${glyph} adds warmth, playfulness, or visual personality to messages.`,
    friendship: `Frequently used among friends to emphasize shared moments, humor, or specific topics related to ${baseTitle.toLowerCase()}.`,
    socialMedia: `Popular on Instagram, TikTok, and X (Twitter) for aesthetic captions, comments, and visual storytelling.`,
    texting: `In text messages, ${glyph} ${finalName} adds clear visual tone and emphasis, making casual conversations more engaging.`
  };

  const contexts = [
    baseTitle.toLowerCase(),
    categorySlug.replace(/-/g, ' '),
    'texting',
    'social media'
  ];

  const faqs = [
    {
      question: `What does the ${glyph} ${finalName} emoji mean?`,
      answer: `The ${glyph} ${finalName} emoji officially represents ${baseTitle.toLowerCase()} in the Unicode Standard. In texting and social media, it is used to express ${baseTitle.toLowerCase()} or add colorful visual flair to conversations.`
    },
    {
      question: `How do I copy and paste the ${glyph} ${finalName} emoji?`,
      answer: `Simply click the 'Copy Emoji' button on this page to copy ${glyph} directly to your device clipboard. It can be pasted into iPhone iMessage, Android WhatsApp, Instagram bios, TikTok captions, or computer keyboards.`
    },
    {
      question: `Why does the ${glyph} emoji look different on iPhone vs Android?`,
      answer: `Emoji designs are rendered by operating system fonts (Apple Color Emoji on iPhone/iPad/Mac, and Noto Color Emoji on Android). While the Unicode code point (${unicodeList.join(' ')}) is identical, Apple and Google design their own proprietary visual artwork.`
    }
  ];

  return {
    slug: slugBase,
    emoji: glyph,
    name: finalName,
    category: categorySlug,
    unicode: unicodeList,
    unicodeSequence,
    hasVariationSelector,
    isZwjSequence,
    htmlEntity,
    htmlHex,
    cssEscape,
    jsEscape,
    urlEncoded,
    keywords,
    shortMeaning,
    meanings,
    contexts,
    related: [],
    faqs
  };
}

console.log('Processing all emojis from emoji-datasource...');
const allEmojis = [];
const usedSlugs = new Set();

for (const e of emojiDataSource) {
  const categorySlug = getCategorySlug(e);
  const baseItem = buildEmojiItem({
    unified: e.unified,
    rawName: e.name,
    shortName: e.short_name,
    shortNames: e.short_names || [e.short_name],
    categorySlug,
    isSkinTone: false
  });

  // Ensure slug uniqueness
  let slug = baseItem.slug;
  let counter = 2;
  while (usedSlugs.has(slug)) {
    slug = `${baseItem.slug}-${counter}`;
    counter++;
  }
  usedSlugs.add(slug);
  baseItem.slug = slug;
  allEmojis.push(baseItem);

  // Process skin tone variations if any
  if (e.skin_variations) {
    for (const [toneKey, variation] of Object.entries(e.skin_variations)) {
      const toneName = parseSkinToneName(toneKey);
      const skinItem = buildEmojiItem({
        unified: variation.unified,
        rawName: e.name,
        shortName: e.short_name,
        shortNames: e.short_names || [e.short_name],
        categorySlug,
        isSkinTone: true,
        skinToneName: toneName
      });

      let skinSlug = skinItem.slug;
      let sCounter = 2;
      while (usedSlugs.has(skinSlug)) {
        skinSlug = `${skinItem.slug}-${sCounter}`;
        sCounter++;
      }
      usedSlugs.add(skinSlug);
      skinItem.slug = skinSlug;
      allEmojis.push(skinItem);
    }
  }
}

// Compute related emojis by category and subcategory
console.log(`Generated ${allEmojis.length} total emojis!`);

// Map related emojis
const emojisByCategory = {};
for (const item of allEmojis) {
  if (!emojisByCategory[item.category]) {
    emojisByCategory[item.category] = [];
  }
  emojisByCategory[item.category].push(item.slug);
}

for (const item of allEmojis) {
  if (!item.related || item.related.length === 0) {
    const siblings = emojisByCategory[item.category] || [];
    const filtered = siblings.filter(s => s !== item.slug);
    // Grab 6 related items
    const startIdx = Math.abs(item.slug.length * 7) % Math.max(1, filtered.length - 6);
    item.related = filtered.slice(startIdx, startIdx + 6);
  }
}

// Write to data/emojis.json
const outputPath = path.join(__dirname, '../data/emojis.json');
fs.writeFileSync(outputPath, JSON.stringify(allEmojis, null, 2), 'utf8');
console.log(`Successfully saved ${allEmojis.length} emojis to ${outputPath}`);
