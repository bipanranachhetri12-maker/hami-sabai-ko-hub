import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeEmbedCardProps {
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  subtitle?: string;
}

export const YouTubeEmbedCard: React.FC<YouTubeEmbedCardProps> = ({
  youtubeId,
  title,
  thumbnailUrl,
  subtitle,
}) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="relative aspect-video w-full bg-slate-950">
        {playing ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group relative h-full w-full overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-orange-500"
            aria-label={`Play vlog: ${title}`}
          >
            <img
              src={thumbnailUrl}
              alt={title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg transition-transform duration-200 group-hover:scale-110">
                <Play className="h-6 w-6 fill-current ml-0.5" aria-hidden="true" />
              </span>
            </div>
            <div className="absolute bottom-3 left-4 right-4">
              {subtitle && (
                <p className="text-[11px] font-medium text-orange-300">{subtitle}</p>
              )}
              <p className="mt-0.5 text-sm sm:text-base font-semibold text-white line-clamp-2">
                {title}
              </p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
