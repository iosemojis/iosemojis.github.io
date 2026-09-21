import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-sm transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-neutral-100 text-base mb-3">
              <span>🍎</span>
              <span>iOS Emoji Keyboard</span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed mb-3">
              Fast, authentic Unicode emoji reference keyboard, contextual messaging dictionary, and developer copy snippets for iOS, Android, and Web.
            </p>
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <span className="text-neutral-400">Featured Resource: </span>
              <a
                href="https://emojisymbols.netlify.app/"
                target="_blank"
                rel="noopener"
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold inline-flex items-center gap-1"
              >
                <span>✨</span>
                <span>Emoji Symbols &amp; Fancy Text Generator ↗</span>
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3 text-xs uppercase tracking-wider">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/category/hearts-love/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/category/hearts-love/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  Hearts & Love Emojis
                </a>
              </li>
              <li>
                <a
                  href="/category/smileys-emotions/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/category/smileys-emotions/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  Smileys & Emotions
                </a>
              </li>
              <li>
                <a
                  href="/category/viral-emojis/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/category/viral-emojis/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  Trending Viral Emojis
                </a>
              </li>
              <li>
                <a
                  href="/category/festivals-holidays/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/category/festivals-holidays/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  Diwali & Festive Emojis
                </a>
              </li>
              <li>
                <a
                  href="/category/religion-spirituality/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/category/religion-spirituality/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  Religion & Spirituality
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3 text-xs uppercase tracking-wider">
              World Festivals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/festivals/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/festivals/');
                  }}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Explore All 19 Festivals →
                </a>
              </li>
              <li>
                <a
                  href="/festivals/diwali/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/festivals/diwali/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  🪔 Diwali (Deepavali)
                </a>
              </li>
              <li>
                <a
                  href="/festivals/christmas/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/festivals/christmas/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  🎄 Christmas & Holidays
                </a>
              </li>
              <li>
                <a
                  href="/festivals/eid/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/festivals/eid/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  🌙 Eid Mubarak
                </a>
              </li>
              <li>
                <a
                  href="/festivals/halloween/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/festivals/halloween/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  🎃 Halloween Spooky Emojis
                </a>
              </li>
              <li>
                <a
                  href="/festivals/lunar-new-year/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/festivals/lunar-new-year/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  🧧 Lunar New Year
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3 text-xs uppercase tracking-wider">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/about/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/about/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/privacy/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/privacy/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/terms/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/contact/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/contact/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/affiliate-disclosure/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/affiliate-disclosure/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  Affiliate Disclosure
                </a>
              </li>
              <li>
                <a
                  href="/cookie-policy/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/cookie-policy/');
                  }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6 text-xs text-neutral-400 dark:text-neutral-500 space-y-3 leading-relaxed">
          <p>
            <strong>Platform Disclaimer:</strong> Apple, iPhone, iOS, iPadOS, and macOS are registered trademarks of Apple Inc. Android is a trademark of Google LLC. This independent educational reference website is not affiliated with, sponsored by, or endorsed by Apple Inc., Google LLC, Microsoft Corporation, Samsung Electronics, or the Unicode Consortium.
          </p>
          <p>
            All emoji character glyphs displayed on this site are rendered using the viewer’s native operating system font. This site provides standardized Unicode character points and does not distribute or host proprietary Apple artwork.
          </p>
          <p>© {new Date().getFullYear()} iOS Emoji Reference Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
