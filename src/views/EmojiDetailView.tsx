import React, { useState } from 'react';
import { EmojiItem, CATEGORY_BY_SLUG, EMOJI_BY_SLUG } from '../data/index.ts';
import {
  copyToClipboard,
  generateCanvasPng,
  downloadDataUrl,
  generateSvgDataUrl,
} from '../utils/download.ts';
import { trackEvent } from '../utils/analytics.ts';
import { AdSlot } from '../components/AdSlot.tsx';

interface EmojiDetailViewProps {
  emoji: EmojiItem;
  onNavigate: (path: string) => void;
}

export const EmojiDetailView: React.FC<EmojiDetailViewProps> = ({ emoji, onNavigate }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const category = CATEGORY_BY_SLUG.get(emoji.category) || {
    name: 'Emojis',
    slug: 'smileys-emotions',
  };

  const handleCopy = async (text: string, key: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      trackEvent('code_copy', {
        format: key,
        emoji: emoji.emoji,
        slug: emoji.slug,
      });
      setTimeout(() => {
        setCopiedKey((curr) => (curr === key ? null : curr));
      }, 1500);
    }
  };

  const handleDownloadPng = async (size: number) => {
    try {
      setIsDownloading(true);
      const dataUrl = await generateCanvasPng(emoji.emoji, size);
      downloadDataUrl(dataUrl, `${emoji.slug}-emoji-${size}px.png`);
      trackEvent('emoji_download', {
        type: 'png',
        size,
        emoji: emoji.emoji,
        slug: emoji.slug,
      });
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadSvg = () => {
    const dataUrl = generateSvgDataUrl(emoji.emoji);
    downloadDataUrl(dataUrl, `${emoji.slug}-emoji.svg`);
    trackEvent('emoji_download', {
      type: 'svg',
      emoji: emoji.emoji,
      slug: emoji.slug,
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `${emoji.emoji} ${emoji.name} iPhone Emoji`,
      text: `Check out the ${emoji.emoji} ${emoji.name} emoji on iOS Emoji Reference Keyboard!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        trackEvent('emoji_share', { method: 'web_share', slug: emoji.slug });
      } catch (err) {
        console.debug('Share cancelled or not supported', err);
      }
    } else {
      // Fallback: copy link
      copyToClipboard(window.location.href);
      setCopiedKey('share-link');
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-neutral-500 flex items-center gap-2">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="hover:text-neutral-800 transition-colors"
        >
          Home
        </a>
        <span>/</span>
        <a
          href={`/category/${category.slug}/`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(`/category/${category.slug}/`);
          }}
          className="hover:text-neutral-800 transition-colors"
        >
          {category.name}
        </a>
        <span>/</span>
        <span className="text-neutral-800 font-medium">{emoji.name}</span>
      </nav>

      {/* Main Emoji Visual Stage */}
      <header className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-xs text-center space-y-4">
        <div className="inline-flex items-center justify-center p-8 bg-neutral-50 rounded-3xl border border-neutral-200 text-8xl sm:text-9xl select-all shadow-inner">
          <span className="leading-none">{emoji.emoji}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
          {emoji.emoji} {emoji.name} iPhone Emoji
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          {emoji.shortMeaning}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => handleCopy(emoji.emoji, 'char')}
            className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-bold text-sm hover:bg-neutral-800 transition-all active:scale-95 shadow-xs flex items-center gap-2"
          >
            <span>{copiedKey === 'char' ? '✓ Copied!' : 'Copy Emoji Glyph'}</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="px-5 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-semibold text-sm transition-colors flex items-center gap-1.5"
          >
            <span>🔗</span>
            <span>{copiedKey === 'share-link' ? '✓ Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </header>

      {/* Platform Rendering Disclaimer */}
      <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-amber-900 space-y-1 leading-relaxed">
        <h3 className="font-bold text-amber-950 flex items-center gap-1.5">
          <span>ℹ️</span>
          <span>Platform-Aware Rendering Notice</span>
        </h3>
        <p>
          The emoji character displayed above is rendered by your web browser using your device’s native operating system font (such as Apple Color Emoji on iOS/macOS, Segoe UI Emoji on Windows, or Noto Color Emoji on Android). This site provides standardized Unicode reference data and developer tools, and does not distribute proprietary Apple artwork.
        </p>
      </section>

      {/* Ad Slot */}
      <AdSlot slot="6477240404" />

      {/* Mode A: Copy Developer Code Snippets */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
            Copy {emoji.name} Codes & Unicode Sequences
          </h2>
          <span className="text-xs text-neutral-400 font-mono">Mode A</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Character */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col justify-between">
            <span className="text-xs text-neutral-500 font-medium">Glyph</span>
            <div className="font-bold text-2xl text-neutral-900 my-2">{emoji.emoji}</div>
            <button
              type="button"
              onClick={() => handleCopy(emoji.emoji, 'char-grid')}
              className="w-full py-1.5 px-3 bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 rounded-lg text-xs font-semibold transition-colors"
            >
              {copiedKey === 'char-grid' ? '✓ Copied!' : 'Copy Character'}
            </button>
          </div>

          {/* Unicode Hex */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col justify-between">
            <span className="text-xs text-neutral-500 font-medium">Unicode Codepoint</span>
            <div className="font-mono font-bold text-sm text-neutral-900 my-2 truncate">
              {emoji.unicode.join(' ')}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(emoji.unicode.join(' '), 'unicode')}
              className="w-full py-1.5 px-3 bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 rounded-lg text-xs font-semibold transition-colors"
            >
              {copiedKey === 'unicode' ? '✓ Copied!' : 'Copy Codepoints'}
            </button>
          </div>

          {/* HTML Entity */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col justify-between">
            <span className="text-xs text-neutral-500 font-medium">HTML Entity</span>
            <div className="font-mono font-bold text-sm text-neutral-900 my-2 truncate">
              {emoji.htmlEntity}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(emoji.htmlEntity, 'html')}
              className="w-full py-1.5 px-3 bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 rounded-lg text-xs font-semibold transition-colors"
            >
              {copiedKey === 'html' ? '✓ Copied!' : 'Copy HTML'}
            </button>
          </div>

          {/* CSS Escape */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col justify-between">
            <span className="text-xs text-neutral-500 font-medium">CSS Escape</span>
            <div className="font-mono font-bold text-sm text-neutral-900 my-2 truncate">
              {emoji.cssEscape}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(emoji.cssEscape, 'css')}
              className="w-full py-1.5 px-3 bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 rounded-lg text-xs font-semibold transition-colors"
            >
              {copiedKey === 'css' ? '✓ Copied!' : 'Copy CSS'}
            </button>
          </div>

          {/* JavaScript String */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col justify-between">
            <span className="text-xs text-neutral-500 font-medium">JavaScript Escape</span>
            <div className="font-mono font-bold text-sm text-neutral-900 my-2 truncate">
              {emoji.jsEscape}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(emoji.jsEscape, 'js')}
              className="w-full py-1.5 px-3 bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 rounded-lg text-xs font-semibold transition-colors"
            >
              {copiedKey === 'js' ? '✓ Copied!' : 'Copy JS Escape'}
            </button>
          </div>

          {/* URL Encoded */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col justify-between">
            <span className="text-xs text-neutral-500 font-medium">URL Encoded</span>
            <div className="font-mono font-bold text-sm text-neutral-900 my-2 truncate">
              {emoji.urlEncoded}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(emoji.urlEncoded, 'url')}
              className="w-full py-1.5 px-3 bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 rounded-lg text-xs font-semibold transition-colors"
            >
              {copiedKey === 'url' ? '✓ Copied!' : 'Copy URL Code'}
            </button>
          </div>
        </div>
      </section>

      {/* Mode B & C: Canvas PNG & SVG Downloads */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
              Download Emoji Image (PNG & SVG)
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Client-side canvas rasterization rendered from your system font.
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-mono">Mode B & C</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <button
            type="button"
            disabled={isDownloading}
            onClick={() => handleDownloadPng(128)}
            className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <div className="font-bold text-sm text-neutral-900">128×128</div>
            <div className="text-[11px] text-neutral-500">PNG Format</div>
          </button>

          <button
            type="button"
            disabled={isDownloading}
            onClick={() => handleDownloadPng(256)}
            className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <div className="font-bold text-sm text-neutral-900">256×256</div>
            <div className="text-[11px] text-neutral-500">PNG Format</div>
          </button>

          <button
            type="button"
            disabled={isDownloading}
            onClick={() => handleDownloadPng(512)}
            className="p-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl border border-neutral-900 text-center transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <div className="font-bold text-sm">512×512 HD</div>
            <div className="text-[11px] text-neutral-300">High-Res PNG</div>
          </button>

          <button
            type="button"
            disabled={isDownloading}
            onClick={handleDownloadSvg}
            className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <div className="font-bold text-sm text-neutral-900">Vector SVG</div>
            <div className="text-[11px] text-neutral-500">Data-URI File</div>
          </button>
        </div>
      </section>

      {/* Meaning in Texting & Contextual Nuances */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
            What does the {emoji.emoji} {emoji.name} mean in a text?
          </h2>
          <p className="text-base text-neutral-700 leading-relaxed">
            {emoji.meanings.texting}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-neutral-900 mb-3">
            Nuanced Interpretations Across Contexts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              <h4 className="font-bold text-sm text-neutral-900 mb-1">General Context</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {emoji.meanings.general}
              </p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              <h4 className="font-bold text-sm text-neutral-900 mb-1">Romantic & Flirting</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {emoji.meanings.romantic}
              </p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              <h4 className="font-bold text-sm text-neutral-900 mb-1">Friendship & Group Chats</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {emoji.meanings.friendship}
              </p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              <h4 className="font-bold text-sm text-neutral-900 mb-1">Social Media & Bios</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {emoji.meanings.socialMedia}
              </p>
            </div>
          </div>
        </div>

        {emoji.contexts && emoji.contexts.length > 0 && (
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
              Common Occasions & Usage
            </span>
            <div className="flex flex-wrap gap-2">
              {emoji.contexts.map((ctx, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-neutral-100 text-neutral-800 text-xs rounded-full font-medium"
                >
                  #{ctx}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Technical Specifications Table */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
          Technical Specifications & Unicode Metadata
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <tbody>
              <tr className="border-b border-neutral-100">
                <th className="py-3 font-medium text-neutral-500 w-1/3">Standard Name</th>
                <td className="py-3 font-semibold text-neutral-900">{emoji.name}</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <th className="py-3 font-medium text-neutral-500">Character Glyph</th>
                <td className="py-3 text-2xl font-bold text-neutral-900">{emoji.emoji}</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <th className="py-3 font-medium text-neutral-500">Unicode Points</th>
                <td className="py-3 font-mono text-neutral-800">{emoji.unicode.join(', ')}</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <th className="py-3 font-medium text-neutral-500">Sequence Format</th>
                <td className="py-3 font-mono text-neutral-800">{emoji.unicodeSequence}</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <th className="py-3 font-medium text-neutral-500">Variation Selector (VS-16)</th>
                <td className="py-3 text-neutral-800">
                  {emoji.hasVariationSelector ? 'Yes (U+FE0F)' : 'Standard presentation'}
                </td>
              </tr>
              <tr className="border-b border-neutral-100">
                <th className="py-3 font-medium text-neutral-500">ZWJ Compound Sequence</th>
                <td className="py-3 text-neutral-800">
                  {emoji.isZwjSequence ? 'Yes (Zero Width Joiner)' : 'Single codepoint / non-compound'}
                </td>
              </tr>
              <tr className="border-b border-neutral-100">
                <th className="py-3 font-medium text-neutral-500">HTML Hex Code</th>
                <td className="py-3 font-mono text-neutral-800">{emoji.htmlHex}</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <th className="py-3 font-medium text-neutral-500">URL Encoded</th>
                <td className="py-3 font-mono text-neutral-800">{emoji.urlEncoded}</td>
              </tr>
              <tr>
                <th className="py-3 font-medium text-neutral-500">Category</th>
                <td className="py-3 text-neutral-800">
                  <a
                    href={`/category/${category.slug}/`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/category/${category.slug}/`);
                    }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {category.name}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      {emoji.faqs && emoji.faqs.length > 0 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {emoji.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group p-4 bg-neutral-50 rounded-xl border border-neutral-200"
              >
                <summary className="font-semibold text-neutral-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  <span>{faq.question}</span>
                  <span className="transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 text-neutral-600 text-sm leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Emojis */}
      {emoji.related && emoji.related.length > 0 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
            Related Emojis & Variations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {emoji.related.map((relSlug) => {
              const rel = EMOJI_BY_SLUG.get(relSlug);
              if (!rel) return null;
              return (
                <a
                  key={relSlug}
                  href={`/emoji/${rel.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/emoji/${rel.slug}/`);
                  }}
                  className="p-3 bg-neutral-50 hover:bg-white rounded-xl border border-neutral-200 hover:border-neutral-400 hover:shadow-2xs transition-all flex items-center gap-3"
                >
                  <span className="text-3xl">{rel.emoji}</span>
                  <div className="overflow-hidden">
                    <div className="font-medium text-xs text-neutral-900 truncate">
                      {rel.name}
                    </div>
                    <div className="text-[10px] text-neutral-400 uppercase font-mono">
                      {rel.unicode[0]}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
