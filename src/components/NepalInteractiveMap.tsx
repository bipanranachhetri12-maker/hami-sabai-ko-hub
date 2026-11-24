import React, { useState } from 'react';
import { Calendar, Compass, MapPin, Mountain } from 'lucide-react';
import { useHub } from '../context/HubContext';
import { SEED_DESTINATIONS } from '../data/seedData';
import type { DestinationGuide } from '../types/hub';

interface NepalInteractiveMapProps {
  onSelectDestination?: (dest: DestinationGuide) => void;
}

export const NepalInteractiveMap: React.FC<NepalInteractiveMapProps> = ({ onSelectDestination }) => {
  const { language } = useHub();
  const [selectedId, setSelectedId] = useState(SEED_DESTINATIONS[0].id);

  const selected = SEED_DESTINATIONS.find((d) => d.id === selectedId) ?? SEED_DESTINATIONS[0];

  const handleSelect = (dest: DestinationGuide) => {
    setSelectedId(dest.id);
    onSelectDestination?.(dest);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Interactive Topographic SVG Map of Nepal */}
      <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-300">
            <Compass className="h-4 w-4" aria-hidden="true" />
            <span>
              {language === 'ne'
                ? 'गन्तव्य छान्न नक्सामा क्लिक गर्नुहोस्'
                : 'Click any Himalayan or Terai pin to inspect trek & budget'}
            </span>
          </div>
          <span className="text-[11px] font-mono-tabular text-slate-400">26°–30° N · 80°–88° E</span>
        </div>

        <div className="relative w-full aspect-[16/9] rounded-lg bg-slate-950/90 border border-slate-800 overflow-hidden">
          <svg
            viewBox="0 0 100 65"
            className="h-full w-full"
            role="img"
            aria-label="Interactive map of Nepal tourist destinations"
          >
            {/* Subtle elevation grid */}
            <defs>
              <pattern id="nepal-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100" height="65" fill="url(#nepal-grid)" />

            {/* Stylized geographic silhouette of Nepal */}
            <path
              d="M 8 19 L 15 14 L 23 18 L 32 16 L 40 21 L 49 23 L 58 27 L 68 29 L 78 29 L 88 34 L 91 45 L 86 55 L 74 53 L 62 52 L 52 50 L 42 49 L 33 46 L 23 41 L 14 35 L 9 27 Z"
              fill="#1E293B"
              stroke="#475569"
              strokeWidth="0.6"
            />

            {/* Himalayan belt subtle contour */}
            <path
              d="M 15 21 Q 35 23 55 29 T 86 38"
              fill="none"
              stroke="rgba(251,146,60,0.28)"
              strokeWidth="0.7"
              strokeDasharray="1.4 1.2"
            />

            {/* Province river lines */}
            <path d="M 22 20 Q 25 32 23 41" fill="none" stroke="rgba(56,189,248,0.25)" strokeWidth="0.4" />
            <path d="M 42 23 Q 44 36 41 48" fill="none" stroke="rgba(56,189,248,0.25)" strokeWidth="0.4" />
            <path d="M 73 30 Q 75 41 72 52" fill="none" stroke="rgba(56,189,248,0.25)" strokeWidth="0.4" />

            {/* Kathmandu Reference Node */}
            <circle cx="56" cy="40" r="1.1" fill="#94A3B8" />
            <text x="58" y="40.8" fill="#94A3B8" fontSize="2.4" fontFamily="sans-serif">
              Kathmandu
            </text>

            {/* Interactive Destination Markers */}
            {SEED_DESTINATIONS.map((dest) => {
              const active = dest.id === selected.id;
              const cx = dest.coordinates.x;
              const cy = dest.coordinates.y * 0.72;
              return (
                <g
                  key={dest.id}
                  className="cursor-pointer"
                  onClick={() => handleSelect(dest)}
                >
                  {active && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="3.8"
                      fill="rgba(234,88,12,0.28)"
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={active ? 2.1 : 1.5}
                    fill={active ? '#EA580C' : '#38BDF8'}
                    stroke="#FFFFFF"
                    strokeWidth="0.45"
                  />
                  <text
                    x={cx + 2.4}
                    y={cy + 0.9}
                    fill={active ? '#FDBA74' : '#E2E8F0'}
                    fontSize={active ? '2.8' : '2.3'}
                    fontWeight={active ? '700' : '500'}
                    fontFamily="sans-serif"
                  >
                    {dest.name.en.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {SEED_DESTINATIONS.map((dest) => (
            <button
              key={dest.id}
              type="button"
              onClick={() => handleSelect(dest)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                dest.id === selected.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {dest.name[language].split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Destination Inspector */}
      <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between">
        <div>
          <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
            <img
              src={selected.imageUrl}
              alt={selected.name.en}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-orange-700 dark:text-orange-400">
              {selected.province} Province
            </span>
            <span className="font-mono-tabular">
              {selected.coordinates.lat}, {selected.coordinates.lng}
            </span>
          </div>

          <h3 className="mt-1.5 text-xl font-bold text-slate-900 dark:text-white">
            {selected.name[language]}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {selected.summary[language]}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs tabular-nums">
          <div>
            <span className="flex items-center gap-1 text-slate-400">
              <Mountain className="h-3.5 w-3.5" aria-hidden="true" />
              {language === 'ne' ? 'उचाइ' : 'Elevation'}
            </span>
            <p className="mt-0.5 font-semibold text-slate-900 dark:text-white font-mono-tabular">
              {selected.elevation}
            </p>
          </div>
          <div>
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {language === 'ne' ? 'उपयुक्त समय' : 'Season'}
            </span>
            <p className="mt-0.5 font-semibold text-slate-900 dark:text-white">
              {selected.bestSeason[language]}
            </p>
          </div>
          <div>
            <span className="flex items-center gap-1 text-slate-400">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {language === 'ne' ? 'अनुमानित खर्च' : 'Est. Budget'}
            </span>
            <p className="mt-0.5 font-semibold text-orange-700 dark:text-orange-400 font-mono-tabular">
              {selected.budgetNpr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
