import React, { useState } from 'react';
import { Calendar, Moon, Search, Sun } from 'lucide-react';
import { useHub } from '../context/HubContext';
import { UI_COPY } from '../i18n/translations';
import { formatDualDate } from '../utils/bsDate';
import { PWAInstallButton } from './PWAInstallButton';

export const UtilityRibbon: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    navigate,
    searchQuery,
    setSearchQuery,
  } = useHub();
  const t = UI_COPY[language];
  const [localInput, setLocalInput] = useState(searchQuery);

  const todayIso = new Date().toISOString().split('T')[0];
  const { bs, ad } = formatDualDate(todayIso, language);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localInput.trim());
    navigate({ page: 'search' });
  };

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2">
        {/* Bikram Sambat + English Date */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 tabular-nums">
          <Calendar className="h-3.5 w-3.5 text-blue-800 dark:text-blue-400 shrink-0" aria-hidden="true" />
          <span>{bs}</span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="text-slate-500 dark:text-slate-400">{ad}</span>
        </div>

        {/* Search + Bilingual Switch + Dark Mode + PWA Install */}
        <div className="flex flex-wrap items-center gap-2.5">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <label htmlFor="hub-quick-search" className="sr-only">
              {t.searchPlaceholder}
            </label>
            <input
              id="hub-quick-search"
              type="search"
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-44 sm:w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-3 pr-9 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              aria-label={t.searchBtn}
              className="absolute right-2 p-1 text-slate-500 hover:text-blue-900 dark:text-slate-400 dark:hover:text-blue-300"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Language Toggle */}
          <div
            role="group"
            aria-label="Language switcher"
            className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-0.5"
          >
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                language === 'en'
                  ? 'bg-blue-900 text-white dark:bg-blue-600'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ne')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                language === 'ne'
                  ? 'bg-blue-900 text-white dark:bg-blue-600'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              नेपाली
            </button>
          </div>

          {/* Light / Dark Theme Switch */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </button>

          <PWAInstallButton />
        </div>
      </div>
    </div>
  );
};
