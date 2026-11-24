import React, { useState } from 'react';
import { Camera, Compass, MapPin, X } from 'lucide-react';
import { NepalInteractiveMap } from '../components/NepalInteractiveMap';
import { PostCard } from '../components/PostCard';
import { YouTubeEmbedCard } from '../components/YouTubeEmbedCard';
import { useHub } from '../context/HubContext';
import {
  IMG_HERO_HIMALAYAS,
  IMG_KATHMANDU_NEWS,
  IMG_MUSTANG,
  IMG_POKHARA,
  SEED_DESTINATIONS,
} from '../data/seedData';
import { UI_COPY } from '../i18n/translations';
import type { DestinationGuide } from '../types/hub';

const GALLERY_PHOTOS = [
  { src: IMG_HERO_HIMALAYAS, caption: 'Golden hour prayer flags overlooking Himalayan ridges' },
  { src: IMG_POKHARA, caption: 'Phewa Lake morning reflection of Machhapuchhre, Pokhara' },
  { src: IMG_MUSTANG, caption: 'Ancient walled canyon settlement in Upper Mustang' },
  { src: IMG_KATHMANDU_NEWS, caption: 'Evening heritage square in Kathmandu Valley' },
];

export const TourismPage: React.FC = () => {
  const { publishedPosts, language } = useHub();
  const t = UI_COPY[language];
  const [selectedGuide, setSelectedGuide] = useState<DestinationGuide>(SEED_DESTINATIONS[0]);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ src: string; caption: string } | null>(null);

  const tourismPosts = publishedPosts.filter((p) => p.sector === 'tourism');
  const vlogPosts = tourismPosts.filter((p) => Boolean(p.youtubeId));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-12">
      <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-700 dark:text-orange-400">
          <Compass className="h-4 w-4" aria-hidden="true" />
          <span>{language === 'ne' ? 'पर्यटन र ट्राभल भ्लग डेस्क' : 'Tourism & Travel Vlogs Desk'}</span>
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          {language === 'ne'
            ? 'नेपालका गन्तव्य गाइड, ट्रेक तालिका र ट्राभल भ्लगहरू'
            : 'Nepal Destination Guides, Trek Itineraries & Travel Vlogs'}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          {language === 'ne'
            ? 'पोखरा, मुस्ताङ, सगरमाथा, लुम्बिनी र रारा तालको नक्सा, दैनिक खर्च विवरण र स्थलगत भिडियो भ्लग।'
            : 'Explore Pokhara, Upper Mustang, Everest Base Camp, Lumbini, and Rara Lake with interactive maps, NPR budgets, and YouTube vlogs.'}
        </p>
      </header>

      {/* Interactive Nepal Map */}
      <section aria-label={t.tourismMapTitle}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
          {t.tourismMapTitle}
        </h2>
        <NepalInteractiveMap onSelectDestination={(d) => setSelectedGuide(d)} />
      </section>

      {/* Selected Destination Detailed Trek Itinerary & Budget Breakdown */}
      <section aria-label="Trek Itinerary and Budget">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedGuide.name[language]} —{' '}
              {language === 'ne' ? 'यात्रा तालिका र बजेट' : 'Trek Itinerary & Budget'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {selectedGuide.durationDays} {language === 'ne' ? 'दिन' : 'Days'} ·{' '}
              {selectedGuide.difficulty} · {selectedGuide.budgetNpr} ({selectedGuide.budgetUsd})
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SEED_DESTINATIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedGuide(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${
                  selectedGuide.id === d.id
                    ? 'bg-orange-600 text-white'
                    : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                {d.name[language].split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Day-by-Day Itinerary */}
          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
              {language === 'ne' ? 'दिनअनुसार यात्रा विवरण' : 'Day-by-Day Route Plan'}
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {selectedGuide.itinerary.map((step) => (
                <div key={step.day} className="py-3.5 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-orange-700 dark:text-orange-400 tabular-nums">
                      Day {step.day}
                    </span>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">
                      {step.title[language]}
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                    <p className="font-mono-tabular font-semibold text-slate-700 dark:text-slate-300">
                      {step.elevation}
                    </p>
                    <p>{step.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
                {language === 'ne' ? 'अनुमानित बजेट विवरण (NPR)' : 'Estimated Cost Breakdown'}
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {selectedGuide.budgetBreakdown.map((row) => (
                  <div key={row.item.en} className="py-3 flex items-center justify-between gap-3">
                    <span className="text-slate-700 dark:text-slate-300">{row.item[language]}</span>
                    <span className="font-mono-tabular font-semibold text-slate-900 dark:text-white shrink-0">
                      {row.costNpr}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {language === 'ne' ? 'कुल अनुमानित खर्च' : 'Total Estimated Budget'}
              </span>
              <span className="text-lg font-bold font-mono-tabular text-orange-700 dark:text-orange-400">
                {selectedGuide.budgetNpr}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded YouTube Vlogs */}
      <section aria-label="Travel Vlogs">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
          {t.latestVlogs}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vlogPosts.map((post) => (
            <YouTubeEmbedCard
              key={post.id}
              youtubeId={post.youtubeId!}
              title={post.title[language]}
              thumbnailUrl={post.imageUrl}
              subtitle={post.tags.slice(0, 2).join(' · ')}
            />
          ))}
        </div>
      </section>

      {/* Tourism Stories */}
      <section aria-label="Tourism Guides">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tourismPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Photo Gallery */}
      <section aria-label={t.tourismGalleryTitle}>
        <div className="flex items-center gap-2 mb-5">
          <Camera className="h-5 w-5 text-orange-700 dark:text-orange-400" aria-hidden="true" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.tourismGalleryTitle}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {GALLERY_PHOTOS.map((photo) => (
            <button
              key={photo.caption}
              type="button"
              onClick={() => setLightboxPhoto(photo)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-left"
            >
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-3">
                <p className="text-xs font-medium text-white line-clamp-2">{photo.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {lightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close photo"
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-3 right-3 z-10 rounded-lg bg-slate-900/80 p-2 text-white hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={lightboxPhoto.src}
              alt={lightboxPhoto.caption}
              referrerPolicy="no-referrer"
              className="w-full max-h-[75vh] object-contain"
            />
            <div className="flex items-center gap-2 px-5 py-3 text-sm text-slate-200 border-t border-slate-800">
              <MapPin className="h-4 w-4 text-orange-400 shrink-0" aria-hidden="true" />
              <span>{lightboxPhoto.caption}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
