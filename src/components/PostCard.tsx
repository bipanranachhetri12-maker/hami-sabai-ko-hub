import React, { useState } from 'react';
import { BookOpen, HeartPulse, MapPin, Newspaper, Play } from 'lucide-react';
import { useHub } from '../context/HubContext';
import { SECTOR_LABELS, UI_COPY } from '../i18n/translations';
import type { Post, Sector } from '../types/hub';
import { formatDualDate } from '../utils/bsDate';

const SECTOR_TEXT_ACCENT: Record<Sector, string> = {
  education: 'text-blue-800 dark:text-blue-400',
  health: 'text-emerald-700 dark:text-emerald-400',
  tourism: 'text-orange-700 dark:text-orange-400',
  news: 'text-red-700 dark:text-red-400',
};

const SECTOR_FALLBACK_BG: Record<Sector, string> = {
  education: 'from-blue-900 to-slate-800',
  health: 'from-emerald-800 to-slate-800',
  tourism: 'from-orange-700 to-slate-800',
  news: 'from-red-800 to-slate-800',
};

function SectorIcon({ sector }: { sector: Sector }) {
  if (sector === 'education') return <BookOpen className="h-8 w-8 text-white/80" />;
  if (sector === 'health') return <HeartPulse className="h-8 w-8 text-white/80" />;
  if (sector === 'tourism') return <MapPin className="h-8 w-8 text-white/80" />;
  return <Newspaper className="h-8 w-8 text-white/80" />;
}

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, compact = false }) => {
  const { language, authors, navigate } = useHub();
  const t = UI_COPY[language];
  const [imgError, setImgError] = useState(false);

  const author = authors.find((a) => a.id === post.authorId);
  const { bs } = formatDualDate(post.publishedAt, language);
  const sectorLabel = SECTOR_LABELS[post.sector][language];

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-150 hover:border-slate-300 dark:hover:border-slate-700">
      <button
        type="button"
        onClick={() => navigate({ page: 'post', slug: post.slug })}
        className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 text-left focus-visible:outline-2 focus-visible:outline-blue-600"
      >
        {!imgError && post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.imageAlt}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${SECTOR_FALLBACK_BG[post.sector]} p-4 text-center`}
          >
            <SectorIcon sector={post.sector} />
            <span className="mt-2 text-xs font-medium text-white/90 line-clamp-1">
              {sectorLabel}
            </span>
          </div>
        )}

        {post.youtubeId && (
          <span
            aria-label="Video Vlog"
            className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-md bg-slate-950/85 px-2.5 py-1 text-xs font-semibold text-white"
          >
            <Play className="h-3 w-3 fill-current" aria-hidden="true" />
            Vlog
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-5">
        {/* Clean unboxed zero-pill metadata */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          <span className={`font-semibold ${SECTOR_TEXT_ACCENT[post.sector]}`}>{sectorLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{bs}</span>
          <span aria-hidden="true">·</span>
          <span>
            {post.readTimeMinutes} {t.minRead}
          </span>
        </div>

        <h3 className="mt-2.5 text-base sm:text-lg font-semibold leading-snug text-slate-900 dark:text-slate-100">
          <button
            type="button"
            onClick={() => navigate({ page: 'post', slug: post.slug })}
            className="text-left hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
          >
            {post.title[language]}
          </button>
        </h3>

        {!compact && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {post.excerpt[language]}
          </p>
        )}

        {author && (
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={() => navigate({ page: 'author', authorId: author.id })}
              className="font-medium text-slate-700 dark:text-slate-300 hover:underline"
            >
              {language === 'ne' ? author.nameNe : author.name}
            </button>
            <span className="truncate max-w-[140px]">{post.tags.slice(0, 2).join(' · ')}</span>
          </div>
        )}
      </div>
    </article>
  );
};
