import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useHub } from '../context/HubContext';
import { UI_COPY } from '../i18n/translations';
import type { Sector } from '../types/hub';

export const Navbar: React.FC = () => {
  const { language, route, navigate } = useHub();
  const t = UI_COPY[language];
  const [mobileOpen, setMobileOpen] = useState(false);

  const isSectorActive = (sector: Sector) =>
    route.page === 'sector' && route.sector === sector;

  const navLinks: { label: string; active: boolean; onClick: () => void }[] = [
    { label: t.navHome, active: route.page === 'home', onClick: () => navigate({ page: 'home' }) },
    { label: t.navEducation, active: isSectorActive('education'), onClick: () => navigate({ page: 'sector', sector: 'education' }) },
    { label: t.navHealth, active: isSectorActive('health'), onClick: () => navigate({ page: 'sector', sector: 'health' }) },
    { label: t.navTourism, active: isSectorActive('tourism'), onClick: () => navigate({ page: 'sector', sector: 'tourism' }) },
    { label: t.navNews, active: isSectorActive('news'), onClick: () => navigate({ page: 'sector', sector: 'news' }) },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 h-16">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            navigate({ page: 'home' });
            setMobileOpen(false);
          }}
          className="text-lg sm:text-xl font-bold tracking-tight text-blue-900 dark:text-blue-300 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
        >
          {t.brand}
        </a>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6">
          {navLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 ${
                item.active
                  ? 'border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-slate-600 hover:text-slate-950 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:hover:border-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary CTA action (+ mobile menu trigger on small screens) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              navigate({ page: 'admin' });
              setMobileOpen(false);
            }}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-blue-900 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {t.adminCta}
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-1">
          {navLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onClick();
                setMobileOpen(false);
              }}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                item.active
                  ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              navigate({ page: 'admin' });
              setMobileOpen(false);
            }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-blue-900 dark:text-blue-300 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            {t.adminCta}
          </button>
        </div>
      )}
    </header>
  );
};
