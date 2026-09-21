/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  EMOJI_BY_SLUG,
  CATEGORY_BY_SLUG,
  GUIDE_BY_SLUG,
  FESTIVAL_BY_SLUG,
} from './data/index.ts';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { HomeView } from './views/HomeView.tsx';
import { CategoryView } from './views/CategoryView.tsx';
import { EmojiDetailView } from './views/EmojiDetailView.tsx';
import { GuideDetailView } from './views/GuideDetailView.tsx';
import { FestivalsListView } from './views/FestivalsListView.tsx';
import { FestivalDetailView } from './views/FestivalDetailView.tsx';
import { TrustView } from './views/TrustView.tsx';
import { NotFoundView } from './views/NotFoundView.tsx';
import { ToastContainer } from './components/Toast.tsx';
import { trackEvent } from './utils/analytics.ts';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Navigate handler with pushState
  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Listen to popstate for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut '/' to focus search on home
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        if (currentPath !== '/') {
          navigate('/');
        }
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPath]);

  // Dynamic Metadata and SEO Updates
  useEffect(() => {
    const clean = currentPath.replace(/\/$/, '') || '/';
    const baseUrl = 'https://iosemojis.github.io';

    let title =
      'iOS Emoji & iPhone Emoji Keyboard — Copy Apple Emoji & Emot iPhone Online';
    let description =
      'Copy & paste authentic iPhone emoji, Apple emoji, and emoji for iOS with 1 click. Complete directory of emojis on Apple, send emoji to iPhone, and download emot iPhone for Android.';
    let canonical = `${baseUrl}/`;

    if (clean === '/') {
      // Home default
    } else if (clean.startsWith('/emoji/')) {
      const slug = clean.replace('/emoji/', '');
      const emo = EMOJI_BY_SLUG.get(slug);
      if (emo) {
        title = `${emo.emoji} ${emo.name} iPhone Emoji — Meaning, Copy & Download Apple Emoji PNG`;
        description = `Copy ${emo.emoji} ${emo.name} iPhone emoji in 1 click. Discover the true meaning of this apple emoji, download 512px transparent PNG, and learn how to use emot iPhone on Android.`;
        canonical = `${baseUrl}/emoji/${slug}/`;
      }
    } else if (clean.startsWith('/category/')) {
      const slug = clean.replace('/category/', '');
      const cat = CATEGORY_BY_SLUG.get(slug);
      if (cat) {
        title = `${cat.name} Emojis — Copy, Meanings & Codes | iOS Emoji`;
        description = cat.description;
        canonical = `${baseUrl}/category/${slug}/`;
      }
    } else if (clean === '/festivals') {
      title = 'Popular World Festivals & Holiday Emojis — Copy Diwali, Christmas, Eid Wishes | iOS Emoji';
      description = 'Dedicated directory of emojis, copyable wishes, aesthetic combos, and cultural traditions for 19 popular world festivals and holidays.';
      canonical = `${baseUrl}/festivals/`;
    } else if (clean.startsWith('/festivals/')) {
      const slug = clean.replace('/festivals/', '');
      const fest = FESTIVAL_BY_SLUG.get(slug);
      if (fest) {
        title = `${fest.h1} | iOS Emoji`;
        description = fest.description;
        canonical = `${baseUrl}/festivals/${slug}/`;
      }
    } else if (clean.startsWith('/guides/')) {
      const slug = clean.replace('/guides/', '');
      const guide = GUIDE_BY_SLUG.get(slug);
      if (guide) {
        title = `${guide.title} | iOS Emoji Guides`;
        description = guide.description;
        canonical = `${baseUrl}/guides/${slug}/`;
      }
    } else if (
      ['/about', '/privacy', '/terms', '/contact', '/affiliate-disclosure', '/cookie-policy'].includes(
        clean
      )
    ) {
      const pageName = clean.replace('/', '');
      title = `${pageName.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} | iOS Emoji`;
      canonical = `${baseUrl}/${pageName}/`;
    }

    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update canonical link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonical);

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonical);

    // Update Twitter tags
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', title);
    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', description);
    let twUrl = document.querySelector('meta[name="twitter:url"]');
    if (twUrl) twUrl.setAttribute('content', canonical);

    // Update Dynamic JSON-LD Breadcrumb / Schema
    let dynamicLd = document.getElementById('dynamic-seo-ld') as HTMLScriptElement | null;
    if (!dynamicLd) {
      dynamicLd = document.createElement('script');
      dynamicLd.id = 'dynamic-seo-ld';
      dynamicLd.type = 'application/ld+json';
      document.head.appendChild(dynamicLd);
    }

    const breadcrumbs = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` }
    ];

    if (clean.startsWith('/festivals/')) {
      const slug = clean.replace('/festivals/', '');
      const fest = FESTIVAL_BY_SLUG.get(slug);
      breadcrumbs.push(
        { '@type': 'ListItem', position: 2, name: 'Festivals', item: `${baseUrl}/festivals/` },
        { '@type': 'ListItem', position: 3, name: fest ? fest.name : slug, item: canonical }
      );
    } else if (clean === '/festivals') {
      breadcrumbs.push(
        { '@type': 'ListItem', position: 2, name: 'Festivals', item: canonical }
      );
    } else if (clean.startsWith('/category/')) {
      const slug = clean.replace('/category/', '');
      const cat = CATEGORY_BY_SLUG.get(slug);
      breadcrumbs.push(
        { '@type': 'ListItem', position: 2, name: cat ? cat.name : slug, item: canonical }
      );
    } else if (clean.startsWith('/emoji/')) {
      const slug = clean.replace('/emoji/', '');
      const emo = EMOJI_BY_SLUG.get(slug);
      breadcrumbs.push(
        { '@type': 'ListItem', position: 2, name: emo ? `${emo.emoji} ${emo.name}` : slug, item: canonical }
      );
    } else if (clean.startsWith('/guides/')) {
      const slug = clean.replace('/guides/', '');
      const guide = GUIDE_BY_SLUG.get(slug);
      breadcrumbs.push(
        { '@type': 'ListItem', position: 2, name: guide ? guide.title : slug, item: canonical }
      );
    }

    dynamicLd.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs
        }
      ]
    });

    // Track page view event
    trackEvent('page_view', { path: clean, title });
  }, [currentPath]);

  // Route Resolver
  const renderCurrentView = () => {
    const clean = currentPath.replace(/\/$/, '') || '/';

    // 1. Homepage
    if (clean === '/') {
      return (
        <HomeView
          onNavigate={navigate}
          searchInputRef={searchInputRef}
        />
      );
    }

    // 2. Emoji Detail: /emoji/:slug
    if (clean.startsWith('/emoji/')) {
      const slug = clean.replace('/emoji/', '');
      const emo = EMOJI_BY_SLUG.get(slug);
      if (emo) {
        return <EmojiDetailView emoji={emo} onNavigate={navigate} />;
      }
      return <NotFoundView onNavigate={navigate} />;
    }

    // 3. Category Page: /category/:slug or /categories
    if (clean === '/categories') {
      const firstCat = CATEGORY_BY_SLUG.get('smileys-emotions');
      if (firstCat) return <CategoryView category={firstCat} onNavigate={navigate} />;
      return <NotFoundView onNavigate={navigate} />;
    }

    if (clean.startsWith('/category/')) {
      const slug = clean.replace('/category/', '');
      const cat = CATEGORY_BY_SLUG.get(slug);
      if (cat) {
        return <CategoryView category={cat} onNavigate={navigate} />;
      }
      return <NotFoundView onNavigate={navigate} />;
    }

    // 4. Festivals: /festivals or /festivals/:slug
    if (clean === '/festivals') {
      return <FestivalsListView onNavigate={navigate} />;
    }

    if (clean.startsWith('/festivals/')) {
      const slug = clean.replace('/festivals/', '');
      const fest = FESTIVAL_BY_SLUG.get(slug);
      if (fest) {
        return <FestivalDetailView festival={fest} onNavigate={navigate} />;
      }
      return <NotFoundView onNavigate={navigate} />;
    }

    // 5. Guide Page: /guides/:slug
    if (clean.startsWith('/guides/')) {
      const slug = clean.replace('/guides/', '');
      const guide = GUIDE_BY_SLUG.get(slug);
      if (guide) {
        return <GuideDetailView guide={guide} onNavigate={navigate} />;
      }
      return <NotFoundView onNavigate={navigate} />;
    }

    // 5. Legal & Trust Pages
    const legalSlugs = [
      'about',
      'privacy',
      'terms',
      'contact',
      'affiliate-disclosure',
      'cookie-policy',
    ];
    const matchLegal = legalSlugs.find((slug) => clean === `/${slug}`);
    if (matchLegal) {
      return <TrustView slug={matchLegal} onNavigate={navigate} />;
    }

    // 6. Not Found Fallback
    return <NotFoundView onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Header
        onNavigate={navigate}
        onSearchFocus={() => {
          if (currentPath !== '/') {
            navigate('/');
          }
          setTimeout(() => {
            searchInputRef.current?.focus();
          }, 50);
        }}
      />

      <main className="flex-1">{renderCurrentView()}</main>

      <Footer onNavigate={navigate} />
      <ToastContainer />
    </div>
  );
}
