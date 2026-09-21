import React from 'react';
import { EMOJIS } from '../data/index.ts';

interface NotFoundViewProps {
  onNavigate: (path: string) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center my-auto">
      <div className="text-8xl mb-6">😶</div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mb-3">
        404 — Emoji Not Found
      </h1>
      <p className="text-neutral-600 text-base sm:text-lg mb-8">
        We couldn’t find that emoji page or URL. It may have moved or been updated under official Unicode standard sequences.
      </p>
      <div className="mb-10 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
        >
          Return to Emoji Directory
        </button>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-4">
          Or explore popular emojis:
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {EMOJIS.slice(0, 10).map((emo) => (
            <button
              key={emo.slug}
              type="button"
              onClick={() => onNavigate(`/emoji/${emo.slug}/`)}
              className="text-3xl p-3 bg-white rounded-xl border border-neutral-200 hover:border-neutral-400 hover:scale-110 transition-transform shadow-2xs"
              title={emo.name}
            >
              {emo.emoji}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};
