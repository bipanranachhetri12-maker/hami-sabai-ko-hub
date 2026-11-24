import React, { useState } from 'react';
import { MessageSquare, ShieldCheck } from 'lucide-react';
import { useHub } from '../context/HubContext';
import { UI_COPY } from '../i18n/translations';
import { formatDualDate } from '../utils/bsDate';

interface CommentsSectionProps {
  postId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const { language, comments, submitComment, activeRole, navigate } = useHub();
  const t = UI_COPY[language];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const approvedComments = comments.filter(
    (c) => c.postId === postId && c.status === 'approved'
  );
  const pendingComments = comments.filter(
    (c) => c.postId === postId && c.status === 'pending'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    submitComment(postId, name, email || 'reader@example.com', body);
    setName('');
    setEmail('');
    setBody('');
    setSubmittedNotice(true);
  };

  return (
    <section aria-label="Comments" className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
          <MessageSquare className="h-5 w-5 text-blue-800 dark:text-blue-400" aria-hidden="true" />
          <span>
            {t.commentsTitle} ({approvedComments.length})
          </span>
        </h3>

        {pendingComments.length > 0 && (
          <button
            type="button"
            onClick={() => navigate({ page: 'admin' })}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
          >
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {pendingComments.length}{' '}
              {language === 'ne' ? 'प्रतिक्रिया समीक्षामा' : 'pending moderation'}
            </span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={language === 'ne' ? 'तपाईंको नाम' : 'Your Name'}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={language === 'ne' ? 'इमेल (वैकल्पिक)' : 'Email (optional, kept private)'}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <textarea
          rows={3}
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t.commentPlaceholder}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {activeRole === 'writer'
              ? language === 'ne'
                ? 'नयाँ प्रतिक्रिया समीक्षापछि प्रकाशित हुनेछ।'
                : 'Comments require Editor/Admin approval before public display.'
              : language === 'ne'
              ? `सक्रिय भूमिका (${activeRole}) बाट सिधै स्वीकृत हुनेछ।`
              : `Posting as ${activeRole} (auto-approved).`}
          </span>
          <button
            type="submit"
            className="rounded-lg bg-blue-900 dark:bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors"
          >
            {t.commentSubmit}
          </button>
        </div>
        {submittedNotice && (
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            {t.commentPendingNote}
          </p>
        )}
      </form>

      <div className="mt-6 space-y-4">
        {approvedComments.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {language === 'ne'
              ? 'अहिलेसम्म कुनै प्रतिक्रिया छैन। पहिलो प्रतिक्रिया दिनुहोस्!'
              : 'No approved comments yet. Start the discussion above.'}
          </p>
        ) : (
          approvedComments.map((c) => {
            const { bs } = formatDualDate(c.createdAt, language);
            return (
              <div
                key={c.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {c.authorName}
                  </span>
                  <span className="tabular-nums">{bs}</span>
                </div>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {c.body}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
