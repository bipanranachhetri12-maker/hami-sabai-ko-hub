import React, { useState } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';
import { useHub } from '../context/HubContext';
import { SECTOR_LABELS, UI_COPY } from '../i18n/translations';
import type { Sector } from '../types/hub';

export const NewsletterBox: React.FC = () => {
  const { language, subscribeNewsletter } = useHub();
  const t = UI_COPY[language];
  const [email, setEmail] = useState('');
  const [sectors, setSectors] = useState<Sector[]>(['education', 'news']);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleSector = (s: Sector) => {
    setSectors((prev) =>
      prev.includes(s) ? (prev.length > 1 ? prev.filter((x) => x !== s) : prev) : [...prev, s]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(language === 'ne' ? 'कृपया मान्य इमेल ठेगाना राख्नुहोस्।' : 'Please enter a valid email address.');
      return;
    }
    const res = subscribeNewsletter(email, sectors);
    if (res.ok) {
      setStatusMsg(
        res.alreadyExists
          ? language === 'ne'
            ? 'तपाईं पहिले नै सदस्य हुनुहुन्छ।'
            : 'This email is already subscribed to the briefing.'
          : t.newsletterSuccess
      );
      setEmail('');
    }
  };

  const allSectors: Sector[] = ['education', 'health', 'tourism', 'news'];

  return (
    <section
      aria-label="Newsletter signup"
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-blue-950 text-white p-6 sm:p-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-6">
          <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider">
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span>Hami Sabai Ko Hub</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
            {t.newsletterTitle}
          </h2>
          <p className="mt-2 text-sm text-blue-100/90 leading-relaxed max-w-xl">
            {t.newsletterDesc}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            {allSectors.map((sec) => {
              const checked = sectors.includes(sec);
              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => toggleSector(sec)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 border ${
                    checked
                      ? 'bg-white text-blue-950 border-white'
                      : 'bg-blue-900/50 text-blue-100 border-blue-700 hover:bg-blue-900'
                  }`}
                >
                  {SECTOR_LABELS[sec][language]}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <label htmlFor="newsletter-email" className="sr-only">
              {t.newsletterEmailPlaceholder}
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.newsletterEmailPlaceholder}
              className="flex-1 rounded-lg border border-blue-700 bg-blue-900/60 px-4 py-2.5 text-sm text-white placeholder:text-blue-200/70 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition-colors whitespace-nowrap shrink-0"
            >
              {t.newsletterSubmit}
            </button>
          </div>

          {errorMsg && <p className="text-xs text-red-300">{errorMsg}</p>}
          {statusMsg && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{statusMsg}</span>
            </p>
          )}
        </form>
      </div>
    </section>
  );
};
