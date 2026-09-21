import React from 'react';

interface TrustViewProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const TrustView: React.FC<TrustViewProps> = ({ slug, onNavigate }) => {
  const contentMap: Record<
    string,
    { title: string; lastUpdated?: string; body: React.ReactNode }
  > = {
    about: {
      title: 'About iOS Emoji & Unicode Reference',
      body: (
        <div className="space-y-4 text-neutral-700 leading-relaxed text-sm sm:text-base">
          <p>
            <strong>iOS Emoji</strong> is an authoritative, open Unicode reference library designed to provide developers, digital marketers, writers, and curious communicators with precise Unicode specifications, cross-platform contextual texting meanings, and developer copy snippets for digital pictographs.
          </p>
          <h2 className="text-xl font-bold text-neutral-900 mt-6 mb-2">Our Mission</h2>
          <p>
            Emojis are the universal emotional language of modern digital communication. However, subtle visual differences across operating systems (Apple iOS, Google Android, Microsoft Windows, Samsung One UI) frequently lead to unexpected misinterpretations. Our goal is to provide clear, platform-neutral context alongside zero-friction developer tools.
          </p>
          <h2 className="text-xl font-bold text-neutral-900 mt-6 mb-2">Unicode Standard Fidelity</h2>
          <p>
            All characters in our index are mapped strictly to official Unicode Consortium code points, including Variation Selector (VS-16) protocols and Zero Width Joiner (ZWJ) multi-sequence combinations. We respect platform vendor trademarks and clearly distinguish native font rendering from proprietary artwork.
          </p>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'January 2025',
      body: (
        <div className="space-y-4 text-neutral-700 leading-relaxed text-sm sm:text-base">
          <p>
            Your privacy is our priority. iOS Emoji is built with privacy-by-design principles. We do not require user accounts, email registration, or personal information.
          </p>
          <h2 className="text-xl font-bold text-neutral-900 mt-6 mb-2">Local Processing</h2>
          <p>
            All emoji search filtering, clipboard copying, and high-resolution canvas PNG rendering occur entirely inside your client browser. No text queries or search inputs are transmitted to external servers.
          </p>
          <h2 className="text-xl font-bold text-neutral-900 mt-6 mb-2">Analytics & Advertising</h2>
          <p>
            We use Google Tag Manager and Google AdSense to serve non-intrusive advertisements and monitor aggregate site performance. Third-party vendors, including Google, use cookies to serve ads based on prior visits. You can opt out of personalized advertising by visiting Google Ad Settings.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'January 2025',
      body: (
        <div className="space-y-4 text-neutral-700 leading-relaxed text-sm sm:text-base">
          <p>
            By using this website, you agree to these Terms of Service. All Unicode information, copy snippets, and educational articles are provided for informational and developer utility purposes.
          </p>
          <h2 className="text-xl font-bold text-neutral-900 mt-6 mb-2">Intellectual Property Disclaimer</h2>
          <p>
            Apple, iPhone, iOS, iPadOS, and macOS are registered trademarks of Apple Inc. Android is a trademark of Google LLC. This website is an independent educational reference site and is not affiliated with, sponsored by, or endorsed by Apple Inc., Google LLC, Microsoft Corporation, Samsung Electronics, or the Unicode Consortium.
          </p>
          <p>
            Emoji character glyphs displayed on this site are rendered using the viewer’s native device font. Do not scrape or reproduce proprietary Apple emoji artwork.
          </p>
        </div>
      ),
    },
    contact: {
      title: 'Contact Us',
      body: (
        <div className="space-y-4 text-neutral-700 leading-relaxed text-sm sm:text-base">
          <p>
            Have feedback, a suggested Unicode correction, or an inquiry about our emoji datasets? We’d love to hear from you.
          </p>
          <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 max-w-md my-4">
            <h3 className="font-bold text-neutral-900 mb-1">Editorial & Technical Team</h3>
            <p className="text-xs text-neutral-500 mb-3">Direct all inquiries to:</p>
            <div className="font-mono text-sm font-bold text-blue-600">
              curators@iosemojis.github.io
            </div>
          </div>
        </div>
      ),
    },
    'affiliate-disclosure': {
      title: 'Affiliate Disclosure',
      body: (
        <div className="space-y-4 text-neutral-700 leading-relaxed text-sm sm:text-base">
          <p>
            In compliance with FTC guidelines, please be aware that certain editorial guides and tutorial pages on this website may include affiliate links to relevant hardware, ergonomic keyboards, or typography references.
          </p>
          <p>
            If you click through and make a purchase, we may receive a small referral commission at no additional cost to you. Pure emoji reference records never contain non-contextual affiliate links.
          </p>
        </div>
      ),
    },
    'cookie-policy': {
      title: 'Cookie Policy',
      lastUpdated: 'January 2025',
      body: (
        <div className="space-y-4 text-neutral-700 leading-relaxed text-sm sm:text-base">
          <p>
            This Cookie Policy explains how cookies and local storage are utilized on iOS Emoji.
          </p>
          <h2 className="text-xl font-bold text-neutral-900 mt-6 mb-2">Local Storage (Preferences)</h2>
          <p>
            We use browser <code>localStorage</code> solely to remember your chosen theme preference (Light, Dark, or System mode). No tracking data is saved in local storage.
          </p>
          <h2 className="text-xl font-bold text-neutral-900 mt-6 mb-2">Third-Party Cookies</h2>
          <p>
            Third-party analytics and advertising services (such as Google Tag Manager and Google AdSense) may set cookies to measure traffic and prevent repetitive ad impressions. You can manage or block cookies through your browser settings.
          </p>
        </div>
      ),
    },
  };

  const item = contentMap[slug] || {
    title: 'Information',
    body: <p>Page content not found.</p>,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 w-full space-y-6">
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
        <span className="text-neutral-800 font-medium">{item.title}</span>
      </nav>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200 shadow-xs">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 mb-2">
          {item.title}
        </h1>
        {item.lastUpdated && (
          <p className="text-xs text-neutral-400 mb-6">Last updated: {item.lastUpdated}</p>
        )}
        <div className="mt-6 border-t border-neutral-100 pt-6">{item.body}</div>
      </div>
    </div>
  );
};
