import React from 'react';
import { GuideItem, EMOJI_BY_SLUG } from '../data/index.ts';
import { AdSlot } from '../components/AdSlot.tsx';

interface GuideDetailViewProps {
  guide: GuideItem;
  onNavigate: (path: string) => void;
}

export const GuideDetailView: React.FC<GuideDetailViewProps> = ({ guide, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumbs */}
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
        <span className="text-neutral-500">Guides</span>
        <span>/</span>
        <span className="text-neutral-800 font-medium truncate">{guide.title}</span>
      </nav>

      <article className="space-y-8">
        <header className="border-b border-neutral-200 pb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight mb-4">
            {guide.h1}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-neutral-500">
            <span>By {guide.author}</span>
            <span>•</span>
            <span>Published {guide.publishedDate}</span>
            <span>•</span>
            <span>{guide.readingTime}</span>
          </div>
        </header>

        {/* Ad Slot */}
        <AdSlot slot="6477240404" />

        {/* Content Sections */}
        <div className="space-y-6 text-neutral-800 text-base sm:text-lg leading-relaxed">
          {guide.contentSections.map((sec, idx) => (
            <section
              key={idx}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs space-y-3"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                {sec.heading}
              </h2>
              <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">
                {sec.body}
              </p>
            </section>
          ))}
        </div>

        {/* Featured Emojis in This Guide */}
        {guide.relevantEmojis && guide.relevantEmojis.length > 0 && (
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">Featured Emojis in This Guide</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {guide.relevantEmojis.map((slug) => {
                const emo = EMOJI_BY_SLUG.get(slug);
                if (!emo) return null;
                return (
                  <a
                    key={slug}
                    href={`/emoji/${emo.slug}/`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/emoji/${emo.slug}/`);
                    }}
                    className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:bg-white transition-all flex items-center gap-3"
                  >
                    <span className="text-3xl">{emo.emoji}</span>
                    <div className="overflow-hidden">
                      <div className="font-medium text-xs text-neutral-900 truncate">
                        {emo.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 uppercase font-mono">
                        {emo.unicode[0]}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* FAQs */}
        {guide.faqs && guide.faqs.length > 0 && (
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {guide.faqs.map((faq, idx) => (
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
      </article>
    </div>
  );
};
