import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';
import { BreakingTicker } from '../components/BreakingTicker';
import { LiveNepalWidgets } from '../components/LiveNepalWidgets';
import { NewsletterBox } from '../components/NewsletterBox';
import { PostCard } from '../components/PostCard';
import { YouTubeEmbedCard } from '../components/YouTubeEmbedCard';
import { useHub } from '../context/HubContext';
import { SECTOR_LABELS, UI_COPY } from '../i18n/translations';
import type { Sector } from '../types/hub';
import { formatDualDate } from '../utils/bsDate';

export const HomePage: React.FC = () => {
  const { publishedPosts, language, navigate } = useHub();
  const t = UI_COPY[language];
  const [slideIdx, setSlideIdx] = useState(0);

  const heroSlides = publishedPosts.filter((p) => p.featured).slice(0, 4);
  const slides = heroSlides.length > 0 ? heroSlides : publishedPosts.slice(0, 3);
  const activeSlide = slides[slideIdx % slides.length];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const sectors: Sector[] = ['education', 'health', 'tourism', 'news'];
  const featuredBySector = sectors
    .map((sec) => publishedPosts.find((p) => p.sector === sec))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const vlogPosts = publishedPosts.filter((p) => Boolean(p.youtubeId)).slice(0, 3);

  return (
    <div>
      <BreakingTicker />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-12">
        {/* Hero Slider */}
        {activeSlide && (
          <section aria-label="Featured Nepal Stories" className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] min-h-[360px] w-full">
              <img
                src={activeSlide.imageUrl}
                alt={activeSlide.imageAlt}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover opacity-85 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-slate-950/20" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-12">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-300 tabular-nums">
                    {SECTOR_LABELS[activeSlide.sector][language]}
                    <span aria-hidden="true" className="mx-2 text-white/50">·</span>
                    {formatDualDate(activeSlide.publishedAt, language).bs}
                  </p>
                  <h1 className="mt-2 text-2xl sm:text-4xl lg:text-[42px] font-bold leading-tight text-white [text-wrap:balance]">
                    {activeSlide.title[language]}
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-slate-200 line-clamp-2 max-w-2xl leading-relaxed">
                    {activeSlide.excerpt[language]}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => navigate({ page: 'post', slug: activeSlide.slug })}
                      className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition-colors"
                    >
                      <span>{t.heroReadMore}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        type="button"
                        aria-label="Previous slide"
                        onClick={() => setSlideIdx((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="rounded-lg border border-white/25 bg-slate-950/60 p-2 text-white hover:bg-slate-900"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <div className="flex items-center gap-1.5 px-1">
                        {slides.map((s, idx) => (
                          <button
                            key={s.id}
                            type="button"
                            aria-label={`Slide ${idx + 1}`}
                            onClick={() => setSlideIdx(idx)}
                            className={`h-2 rounded-full transition-all ${
                              idx === slideIdx % slides.length ? 'w-6 bg-orange-500' : 'w-2 bg-white/40 hover:bg-white/70'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        aria-label="Next slide"
                        onClick={() => setSlideIdx((prev) => (prev + 1) % slides.length)}
                        className="rounded-lg border border-white/25 bg-slate-950/60 p-2 text-white hover:bg-slate-900"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Live Weather + NRB Forex / Gold-Silver Widgets */}
        <LiveNepalWidgets />

        {/* Featured Post From Each of the 4 Sectors */}
        <section aria-label={t.featuredSectors}>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white [text-wrap:balance]">
                {t.featuredSectors}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {t.featuredSectorsSub}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {sectors.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => navigate({ page: 'sector', sector: sec })}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-blue-700 dark:hover:border-blue-400 transition-colors whitespace-nowrap shrink-0"
                >
                  {SECTOR_LABELS[sec][language]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBySector.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* AdSense-Ready Leaderboard */}
        <AdSlot variant="leaderboard" />

        {/* Latest Travel Vlogs */}
        <section aria-label={t.latestVlogs}>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t.latestVlogs}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {t.latestVlogsSub}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate({ page: 'sector', sector: 'tourism' })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 dark:text-orange-400 hover:underline whitespace-nowrap shrink-0"
            >
              <span>{t.viewAllTourism}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {vlogPosts.map((post) => (
              <YouTubeEmbedCard
                key={post.id}
                youtubeId={post.youtubeId!}
                title={post.title[language]}
                thumbnailUrl={post.imageUrl}
                subtitle={`${formatDualDate(post.publishedAt, language).bs} · ${post.tags[0] || 'Nepal'}`}
              />
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <NewsletterBox />
      </div>
    </div>
  );
};
