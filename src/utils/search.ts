import { EmojiItem } from '../data/index.ts';

export function normalizeSearch(query: string): string {
  if (!query) return '';
  return query
    .toLowerCase()
    .normalize('NFC')
    .replace(/[#-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function searchEmojis(emojis: EmojiItem[], query: string): EmojiItem[] {
  const norm = normalizeSearch(query);
  if (!norm) return emojis;

  // Check if query is a hex code or U+ format
  const hexQuery = norm.replace(/^u\+/, '').replace(/\s+/g, '');
  const isHexLike = /^[0-9a-f]{4,6}$/i.test(hexQuery);

  return emojis.filter((item) => {
    // 1. Direct emoji glyph match
    if (item.emoji.includes(norm) || norm.includes(item.emoji)) {
      return true;
    }

    // 2. Unicode hex code point match
    if (isHexLike) {
      const matchHex = item.unicode.some((u) =>
        u.toLowerCase().replace('u+', '').includes(hexQuery)
      );
      if (matchHex) return true;
    }

    // 3. Name match
    const normName = normalizeSearch(item.name);
    if (normName.includes(norm)) return true;

    // 4. Category match
    const normCat = normalizeSearch(item.category);
    if (normCat.includes(norm)) return true;

    // 5. Keywords match
    const matchKeyword = item.keywords.some((kw) =>
      normalizeSearch(kw).includes(norm)
    );
    if (matchKeyword) return true;

    // 6. Short meaning match
    const normMeaning = normalizeSearch(item.shortMeaning);
    if (normMeaning.includes(norm)) return true;

    return false;
  });
}
