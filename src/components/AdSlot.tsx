import React from 'react';
import { useHub } from '../context/HubContext';
import { UI_COPY } from '../i18n/translations';

interface AdSlotProps {
  variant: 'leaderboard' | 'rectangle';
}

export const AdSlot: React.FC<AdSlotProps> = ({ variant }) => {
  const { language, navigate } = useHub();
  const t = UI_COPY[language];

  return (
    <aside
      aria-label="Advertisement"
      data-adsense-slot={variant === 'leaderboard' ? 'ca-pub-responsive-728x90' : 'ca-pub-responsive-300x250'}
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900/60 px-4 text-center ${
        variant === 'leaderboard' ? 'min-h-[96px] py-4' : 'min-h-[240px] py-6'
      }`}
    >
      <span className="text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400">
        {t.adLabel}
      </span>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {variant === 'leaderboard' ? '728 × 90 Responsive Banner' : '300 × 250 Sidebar Placement'}
      </p>
      <button
        type="button"
        onClick={() => navigate({ page: 'static', doc: 'advertise' })}
        className="mt-2 text-xs font-semibold text-blue-800 dark:text-blue-400 hover:underline"
      >
        {t.advertise}
      </button>
    </aside>
  );
};
