import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { useHub } from '../context/HubContext';
import { UI_COPY } from '../i18n/translations';

interface AuthorProfilePageProps {
  authorId: string;
}

export const AuthorProfilePage: React.FC<AuthorProfilePageProps> = ({ authorId }) => {
  const { authors, publishedPosts, language, navigate } = useHub();
  const t = UI_COPY[language];

  const author = authors.find((a) => a.id === authorId);
  if (!author) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 text-center">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">Author not found</p>
        <button
          type="button"
          onClick={() => navigate({ page: 'home' })}
          className="mt-4 rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white"
        >
          {t.backToHome}
        </button>
      </div>
    );
  }

  const authorPosts = publishedPosts.filter((p) => p.authorId === author.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-10">
      <button
        type="button"
        onClick={() => navigate({ page: 'home' })}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{t.backToHome}</span>
      </button>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6">
        <div
          className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold ${author.avatarColor}`}
        >
          {author.name
            .split(' ')
            .map((w) => w[0])
            .slice(0, 2)
            .join('')}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-400">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              {author.role}
            </span>
            {author.credentials && (
              <>
                <span aria-hidden="true">·</span>
                <span>{author.credentials}</span>
              </>
            )}
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {language === 'ne' ? author.nameNe : author.name}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            {author.title[language]}
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {author.bio[language]}
          </p>
        </div>
      </div>

      <section aria-label="Published Articles">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
          {language === 'ne'
            ? `प्रकाशित लेखहरू (${authorPosts.length})`
            : `Published Articles (${authorPosts.length})`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {authorPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
};
