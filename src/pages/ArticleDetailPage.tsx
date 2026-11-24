import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';
import { CommentsSection } from '../components/CommentsSection';
import { PostCard } from '../components/PostCard';
import { SocialShareBar } from '../components/SocialShareBar';
import { YouTubeEmbedCard } from '../components/YouTubeEmbedCard';
import { useHub } from '../context/HubContext';
import { SECTOR_LABELS, UI_COPY } from '../i18n/translations';
import { formatDualDate } from '../utils/bsDate';

interface ArticleDetailPageProps {
  slug: string;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ slug }) => {
  const { posts, publishedPosts, authors, language, navigate } = useHub();
  const t = UI_COPY[language];

  const post = posts.find((p) => p.slug === slug);

  useEffect(() => {
    if (!post) return;
    const prevTitle = document.title;
    document.title = `${post.title[language]} – Hami Sabai Ko Hub`;
    return () => {
      document.title = prevTitle;
    };
  }, [post, language]);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {language === 'ne' ? 'लेख फेला परेन' : 'Story Not Found'}
        </h1>
        <button
          type="button"
          onClick={() => navigate({ page: 'home' })}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.backToHome}</span>
        </button>
      </div>
    );
  }

  const author = authors.find((a) => a.id === post.authorId);
  const { bs, ad } = formatDualDate(post.publishedAt, language);
  const related = publishedPosts
    .filter((p) => p.id !== post.id && p.sector === post.sector)
    .slice(0, 3);

  const schemaType =
    post.sector === 'news'
      ? 'NewsArticle'
      : post.sector === 'health'
      ? 'MedicalWebPage'
      : post.youtubeId
      ? 'VideoObject'
      : 'Article';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: post.title[language],
    name: post.title[language],
    description: post.excerpt[language],
    datePublished: post.publishedAt,
    inLanguage: language,
    author: author ? { '@type': 'Person', name: author.name } : undefined,
    publisher: { '@type': 'Organization', name: 'Hami Sabai Ko Hub' },
  };

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <button
        type="button"
        onClick={() => navigate({ page: 'sector', sector: post.sector })}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{SECTOR_LABELS[post.sector][language]}</span>
      </button>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          <span className="font-semibold text-blue-800 dark:text-blue-400">
            {SECTOR_LABELS[post.sector][language]}
          </span>
          <span aria-hidden="true">·</span>
          <span>{bs}</span>
          <span aria-hidden="true">·</span>
          <span>{ad}</span>
          <span aria-hidden="true">·</span>
          <span>
            {post.readTimeMinutes} {t.minRead}
          </span>
        </div>

        <h1 className="mt-3 text-3xl sm:text-4xl font-bold leading-tight text-slate-900 dark:text-white [text-wrap:balance]">
          {post.title[language]}
        </h1>

        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          {post.excerpt[language]}
        </p>

        {post.medicalReviewedBy && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Medically reviewed by {post.medicalReviewedBy}</span>
          </div>
        )}
      </header>

      {/* Featured Image or YouTube Vlog Embed */}
      <div className="mt-6">
        {post.youtubeId ? (
          <YouTubeEmbedCard
            youtubeId={post.youtubeId}
            title={post.title[language]}
            thumbnailUrl={post.imageUrl}
            subtitle={`${SECTOR_LABELS[post.sector][language]} · ${bs}`}
          />
        ) : (
          <figure className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
            <img
              src={post.imageUrl}
              alt={post.imageAlt}
              referrerPolicy="no-referrer"
              className="w-full max-h-[480px] object-cover"
            />
            <figcaption className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 italic">
              {post.imageAlt}
            </figcaption>
          </figure>
        )}
      </div>

      {/* Article Body */}
      <div className="mt-8 max-w-2xl space-y-5 text-base leading-[1.8] text-slate-800 dark:text-slate-200">
        {post.content[language].split('\n\n').map((para, idx) => (
          <p
            key={idx}
            className={
              idx === 0
                ? 'first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:leading-none first-letter:text-blue-900 dark:first-letter:text-blue-400'
                : ''
            }
          >
            {para}
          </p>
        ))}

        {post.tags.length > 0 && (
          <div className="pt-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Topics: </span>
            {post.tags.join(' · ')}
          </div>
        )}
      </div>

      <div className="mt-8 max-w-2xl">
        <SocialShareBar title={post.title[language]} slug={post.slug} />
      </div>

      {/* Author Profile Card */}
      {author && (
        <div className="mt-6 max-w-2xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${author.avatarColor}`}
          >
            {author.name
              .split(' ')
              .map((w) => w[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => navigate({ page: 'author', authorId: author.id })}
                className="text-base font-bold text-slate-900 dark:text-white hover:underline"
              >
                {language === 'ne' ? author.nameNe : author.name}
              </button>
              <span className="text-xs font-medium capitalize text-slate-500 dark:text-slate-400">
                {author.role}
              </span>
            </div>
            <p className="text-xs font-medium text-blue-800 dark:text-blue-400">
              {author.title[language]}
            </p>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {author.bio[language]}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <AdSlot variant="leaderboard" />
      </div>

      <div className="max-w-2xl">
        <CommentsSection postId={post.id} />
      </div>

      {related.length > 0 && (
        <section aria-label={t.relatedStories} className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
            {t.relatedStories}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item) => (
              <PostCard key={item.id} post={item} compact />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
