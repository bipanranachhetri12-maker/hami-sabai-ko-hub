import React, { useState } from 'react';
import { CloudSun, Coins, Droplets, Mountain, Wind } from 'lucide-react';
import { useHub } from '../context/HubContext';
import { SEED_FOREX, SEED_METALS, SEED_WEATHER } from '../data/seedData';
import { UI_COPY } from '../i18n/translations';
import { toNepaliDigits } from '../utils/bsDate';

export const LiveNepalWidgets: React.FC = () => {
  const { language } = useHub();
  const t = UI_COPY[language];
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [activeBoard, setActiveBoard] = useState<'forex' | 'metals'>('forex');

  const city = SEED_WEATHER[selectedCityIndex] ?? SEED_WEATHER[0];
  const fmt = (n: number | string) => (language === 'ne' ? toNepaliDigits(n) : String(n));

  return (
    <section aria-label="Nepal Weather and Market Rates" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Nepal Weather Widget */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <CloudSun className="h-5 w-5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t.weatherTitle}
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SEED_WEATHER.map((item, idx) => (
              <button
                key={item.city}
                type="button"
                onClick={() => setSelectedCityIndex(idx)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedCityIndex === idx
                    ? 'bg-blue-900 text-white dark:bg-blue-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {language === 'ne' ? item.cityNe.split(' ')[0] : item.city.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {language === 'ne' ? city.cityNe : city.city}
            </p>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-slate-900 dark:text-white font-mono-tabular">
                {fmt(city.tempC)}°C
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {city.condition[language]}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300 tabular-nums">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-slate-400">
                <Droplets className="h-3.5 w-3.5" aria-hidden="true" />
                {language === 'ne' ? 'आर्द्रता' : 'Humidity'}
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{fmt(city.humidity)}%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-slate-400">
                <Wind className="h-3.5 w-3.5" aria-hidden="true" />
                {language === 'ne' ? 'हावा' : 'Wind'}
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{fmt(city.windKmh)} km/h</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-slate-400">
                <Mountain className="h-3.5 w-3.5" aria-hidden="true" />
                {language === 'ne' ? 'उचाइ' : 'Elev.'}
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{city.altitude}</span>
            </div>
          </div>
        </div>
      </div>

      {/* NRB Forex & Gold/Silver Widget */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-blue-800 dark:text-blue-400" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t.ratesTitle}
            </h2>
          </div>

          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
            <button
              type="button"
              onClick={() => setActiveBoard('forex')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeBoard === 'forex'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-950 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {language === 'ne' ? 'विदेशी मुद्रा (NRB)' : 'Forex (NRB)'}
            </button>
            <button
              type="button"
              onClick={() => setActiveBoard('metals')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeBoard === 'metals'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-950 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {language === 'ne' ? 'सुन / चाँदी' : 'Gold & Silver'}
            </button>
          </div>
        </div>

        {activeBoard === 'forex' ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs tabular-nums">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="pb-2 font-medium">{language === 'ne' ? 'मुद्रा' : 'Currency'}</th>
                  <th className="pb-2 font-medium text-right">{language === 'ne' ? 'एकाइ' : 'Unit'}</th>
                  <th className="pb-2 font-medium text-right">{t.buy} (NPR)</th>
                  <th className="pb-2 font-medium text-right">{t.sell} (NPR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {SEED_FOREX.map((fx) => (
                  <tr key={fx.code} className="text-slate-800 dark:text-slate-200">
                    <td className="py-1.5 font-semibold">
                      {fx.code}{' '}
                      <span className="font-normal text-slate-500 dark:text-slate-400">
                        · {fx.currency}
                      </span>
                    </td>
                    <td className="py-1.5 text-right font-mono-tabular">{fmt(fx.unit)}</td>
                    <td className="py-1.5 text-right font-mono-tabular">{fmt(fx.buyNpr.toFixed(2))}</td>
                    <td className="py-1.5 text-right font-mono-tabular">{fmt(fx.sellNpr.toFixed(2))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800/70">
            {SEED_METALS.map((m) => (
              <div key={m.name.en} className="flex items-center justify-between py-2.5 text-sm tabular-nums">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{m.name[language]}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{m.unit}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white font-mono-tabular">
                    NPR {fmt(m.priceNpr.toLocaleString())}
                  </p>
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 font-mono-tabular">
                    +NPR {fmt(m.changeNpr)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
