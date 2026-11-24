import React, { useState } from 'react';
import { Flame, Newspaper } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';
import { BreakingTicker } from '../components/BreakingTicker';
import { PostCard } from '../components/PostCard';
import { useHub } from '../context/HubContext';
import { UI_COPY } from '../i18n/translations';
import { formatDualDate } from '../utils/bsDate';

export const NewsPage: React.FC = () => {
  const { publishedPosts, categories, language, navigate } = useHub();
  const t = UI_COPY[language];
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const newsCategories = categories.filter((c) => c.sector === 'news');
  const allNews = publishedPosts.filter((p) => p.sector === 'news');
  const filteredNews = allNews.filter(
    (p) => selectedCat === 'all' || p.categorySlug === selectedCat
  );

  const trending = [...allNews]
    .sort((a, b) => (a.trendingRank ?? 99) - (b.trendingRank ?? 99))
    .slice(0, 5);

  return (
    <div>
      <BreakingTicker />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-10">
        <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
            <Newspaper className="h-4 w-4" aria-hidden="true" />
            <span>{language === 'ne' ? 'नेपाल समाचार डेस्क' : 'Nepal Newsroom'}</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {language === 'ne'
              ? 'राजनीति, अर्थ, खेलकुद, मनोरञ्जन र प्रविधि'
              : 'Politics, Business, Sports, Entertainment & Tech'}
          </h1>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCat('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                selectedCat === 'all'
                  ? 'bg-red-700 text-white dark:bg-red-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {t.all}
            </button>
            {newsCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.slug)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  selectedCat === cat.slug
                    ? 'bg-red-700 text-white dark:bg-red-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {cat.name[language]}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main News Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredNews.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Trending Sidebar + AdSense Rectangle */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Flame className="h-4 w-4 text-red-700 dark:text-red-400" aria-hidden="true" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.newsTrendingTitle}
                </h2>
              </div>

              <ol className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                {trending.map((item, idx) => (
                  <li key={item.id} className="py-3 flex items-start gap-3">
                    <span className="text-lg font-bold font-mono-tabular text-red-700/80 dark:text-red-400 leading-none mt-0.5">
                      0{idx + 1}
                    </span>
                    <div>
                      <button
                        type="button"
                        onClick={() => navigate({ page: 'post', slug: item.slug })}
                        className="text-left text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-red-700 dark:hover:text-red-400 leading-snug"
                      >
                        {item.title[language]}
                      </button>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                        {formatDualDate(item.publishedAt, language).bs}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <AdSlot variant="rectangle" />
          </aside>
        </div>
      </div>
    </div>
  );
};
