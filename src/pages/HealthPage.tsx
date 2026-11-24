import React, { useState } from 'react';
import { Building2, HeartPulse, Phone, Search } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';
import { HealthCalculators } from '../components/HealthCalculators';
import { PostCard } from '../components/PostCard';
import { useHub } from '../context/HubContext';
import { SEED_HOSPITALS } from '../data/seedData';
import { UI_COPY } from '../i18n/translations';

export const HealthPage: React.FC = () => {
  const { publishedPosts, categories, language } = useHub();
  const t = UI_COPY[language];
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [hospitalQuery, setHospitalQuery] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('all');

  const healthCategories = categories.filter((c) => c.sector === 'health');
  const healthPosts = publishedPosts.filter(
    (p) => p.sector === 'health' && (selectedCat === 'all' || p.categorySlug === selectedCat)
  );

  const provinces = ['all', 'Bagmati', 'Gandaki', 'Koshi', 'Lumbini'];
  const filteredHospitals = SEED_HOSPITALS.filter((h) => {
    const matchesProv = provinceFilter === 'all' || h.province === provinceFilter;
    const q = hospitalQuery.toLowerCase().trim();
    const matchesText =
      !q ||
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.specialties.some((s) => s.toLowerCase().includes(q));
    return matchesProv && matchesText;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-12">
      <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          <HeartPulse className="h-4 w-4" aria-hidden="true" />
          <span>{language === 'ne' ? 'स्वास्थ्य डेस्क · नेपाल' : 'Health Desk · Nepal'}</span>
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          {language === 'ne'
            ? 'चिकित्सक लेख, स्वास्थ्य क्याल्कुलेटर र अस्पताल निर्देशिका'
            : 'Doctor-Reviewed Guides, Health Tools & Hospital Directory'}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          {language === 'ne'
            ? 'नेपाली परिवारका लागि प्रमाणित स्वास्थ्य जानकारी, BMI जाँच र देशभरका प्रमुख अस्पतालका आपतकालीन नम्बरहरू।'
            : 'Evidence-based medical guidance for Nepal, interactive BMI & hydration calculators, and verified hospital emergency contacts.'}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCat('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              selectedCat === 'all'
                ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {t.all}
          </button>
          {healthCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCat(cat.slug)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                selectedCat === cat.slug
                  ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {cat.name[language]}
            </button>
          ))}
        </div>
      </header>

      {/* Health Articles */}
      <section aria-label="Doctor-reviewed health articles">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Interactive Health Calculators */}
      <section aria-label={t.healthCalcTitle}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
          {t.healthCalcTitle}
        </h2>
        <HealthCalculators />
      </section>

      <AdSlot variant="leaderboard" />

      {/* Hospital Directory */}
      <section aria-label={t.healthHospitalsTitle}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.healthHospitalsTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="search"
                value={hospitalQuery}
                onChange={(e) => setHospitalQuery(e.target.value)}
                placeholder={language === 'ne' ? 'अस्पताल वा शहर खोज्नुहोस्...' : 'Search hospital or specialty...'}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {provinces.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProvinceFilter(p)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
                    provinceFilter === p
                      ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                      : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {p === 'all' ? t.all : p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {hosp.province} · {hosp.type}
                  </span>
                  <span className="tabular-nums">{hosp.beds} beds</span>
                </div>
                <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                  {hosp.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hosp.city}</p>
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                  {hosp.specialties.join(' · ')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {language === 'ne' ? 'आकस्मिक सेवा' : 'Emergency'}
                </span>
                <a
                  href={`tel:${hosp.emergencyPhone}`}
                  className="inline-flex items-center gap-1.5 font-semibold font-mono-tabular text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{hosp.emergencyPhone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
