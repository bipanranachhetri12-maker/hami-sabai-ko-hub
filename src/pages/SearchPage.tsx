import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { useHub } from '../context/HubContext';
import { SECTOR_LABELS, UI_COPY } from '../i18n/translations';
import type { Sector } from '../types/hub';

export const SearchPage: React.FC = () => {
  const { publishedPosts, language, searchQuery, setSearchQuery } = useHub();
  const t = UI_COPY[language];

  const [sectorFilter, setSectorFilter] = useState<'all' | Sector>('all');
  const [dateRange, setDateRange] = useState<'all' | '7d' | '30d'>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  const allTags = useMemo(() => {
    const set = new Set<string>();
    publishedPosts.forEach((p) => p.tags.forEach((tg) => set.add(tg)));
    return Array.from(set).sort();
  }, [publishedPosts]);

  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const now = Date.now();

    return publishedPosts.filter((p) => {
      if (sectorFilter !== 'all' && p.sector !== sectorFilter) return false;
      if (tagFilter !== 'all' && !p.tags.includes(tagFilter)) return false;

      if (dateRange !== 'all') {
        const ts = Date.parse(p.publishedAt);
        const days = (now - ts) / 86400000;
        if (dateRange === '7d' && days > 7) return false;
        if (dateRange === '30d' && days > 30) return false;
      }

      if (!q) return true;
      return (
        p.title.en.toLowerCase().includes(q) ||
        p.title.ne.toLowerCase().includes(q) ||
        p.excerpt.en.toLowerCase().includes(q) ||
        p.excerpt.ne.toLowerCase().includes(q) ||
        p.tags.some((tg) => tg.toLowerCase().includes(q))
      );
    });
  }, [publishedPosts, searchQuery, sectorFilter, dateRange, tagFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.searchTitle}</h1>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="md:col-span-2">
            <select
              aria-label={t.filterSector}
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value as 'all' | Sector)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-white"
            >
              <option value="all">{t.filterSector}: {t.all}</option>
              {(['education', 'health', 'tourism', 'news'] as Sector[]).map((sec) => (
                <option key={sec} value={sec}>
                  {SECTOR_LABELS[sec][language]}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              aria-label={t.filterDate}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as 'all' | '7d' | '30d')}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-white"
            >
              <option value="all">{t.filterDate}: {t.all}</option>
              <option value="7d">{language === 'ne' ? 'पछिल्लो ७ दिन' : 'Last 7 Days'}</option>
              <option value="30d">{language === 'ne' ? 'पछिल्लो ३० दिन' : 'Last 30 Days'}</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              aria-label={t.filterTag}
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-white"
            >
              <option value="all">{t.filterTag}: {t.all}</option>
              {allTags.map((tg) => (
                <option key={tg} value={tg}>
                  {tg}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {results.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">{t.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
