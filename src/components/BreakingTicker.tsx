import React from 'react';
import { Radio } from 'lucide-react';
import { useHub } from '../context/HubContext';
import { UI_COPY } from '../i18n/translations';

export const BreakingTicker: React.FC = () => {
  const { publishedPosts, language, navigate } = useHub();
  const t = UI_COPY[language];

  const breakingItems = publishedPosts.filter((p) => p.breaking);
  const items = breakingItems.length > 0 ? breakingItems : publishedPosts.slice(0, 4);

  return (
    <div className="border-b border-red-200 dark:border-red-900/50 bg-red-50/90 dark:bg-red-950/30">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6 py-2 overflow-hidden">
        <div className="inline-flex items-center gap-1.5 bg-red-700 text-white px-2.5 py-1 rounded text-xs font-semibold shrink-0 whitespace-nowrap">
          <Radio className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t.breakingLabel}</span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div className="animate-ticker flex items-center gap-8">
            {[...items, ...items].map((post, idx) => (
              <button
                key={`${post.id}-${idx}`}
                type="button"
                onClick={() => navigate({ page: 'post', slug: post.slug })}
                className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-red-700 dark:hover:text-red-300 transition-colors whitespace-nowrap shrink-0"
              >
                {post.title[language]}
                <span aria-hidden="true" className="ml-8 text-red-300 dark:text-red-800">
                  /
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
