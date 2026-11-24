import React from 'react';
import { useHub } from '../context/HubContext';
import { SECTOR_LABELS, UI_COPY } from '../i18n/translations';
import type { Sector } from '../types/hub';

export const Footer: React.FC = () => {
  const { language, navigate } = useHub();
  const t = UI_COPY[language];
  const sectors: Sector[] = ['education', 'health', 'tourism', 'news'];

  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-blue-900 dark:text-blue-300">{t.brand}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'ne'
                ? 'नेपालको शिक्षा, स्वास्थ्य, पर्यटन भ्लग र विश्वसनीय समाचार एउटै डिजिटल मञ्चमा।'
                : 'Nepal’s unified bilingual publication for Education, Health, Tourism & Travel Vlogs, and News.'}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {language === 'ne' ? 'मुख्य क्षेत्रहरू' : 'Sectors'}
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {sectors.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => navigate({ page: 'sector', sector: s })}
                    className="hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                  >
                    {SECTOR_LABELS[s][language]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {language === 'ne' ? 'संस्थागत' : 'Publication'}
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button type="button" onClick={() => navigate({ page: 'static', doc: 'about' })} className="hover:text-blue-900 dark:hover:text-blue-300">
                  {t.about}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate({ page: 'static', doc: 'contact' })} className="hover:text-blue-900 dark:hover:text-blue-300">
                  {t.contact}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate({ page: 'static', doc: 'advertise' })} className="hover:text-blue-900 dark:hover:text-blue-300">
                  {t.advertise}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate({ page: 'static', doc: 'privacy' })} className="hover:text-blue-900 dark:hover:text-blue-300">
                  {t.privacy}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {language === 'ne' ? 'उपकरणहरू' : 'Hub Tools'}
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button type="button" onClick={() => navigate({ page: 'search' })} className="hover:text-blue-900 dark:hover:text-blue-300">
                  {t.searchTitle}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate({ page: 'admin' })} className="hover:text-blue-900 dark:hover:text-blue-300">
                  {t.adminCta}
                </button>
              </li>
              <li>
                <a href="/sitemap.xml" className="hover:text-blue-900 dark:hover:text-blue-300">
                  Sitemap XML
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-6 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Hami Sabai Ko Hub · Kathmandu, Nepal</p>
          <p>Bilingual Nepali &amp; English · Built for fast mobile &amp; slow-network reading</p>
        </div>
      </div>
    </footer>
  );
};
