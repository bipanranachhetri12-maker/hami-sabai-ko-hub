import React, { useState } from 'react';
import { BookOpen, Download, FileText, GraduationCap } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';
import { PostCard } from '../components/PostCard';
import { useHub } from '../context/HubContext';
import { SEED_EXAM_NOTICES, SEED_STUDY_NOTES } from '../data/seedData';
import { UI_COPY } from '../i18n/translations';
import type { StudyNote } from '../types/hub';
import { formatDualDate } from '../utils/bsDate';

export const EducationPage: React.FC = () => {
  const { publishedPosts, categories, language } = useHub();
  const t = UI_COPY[language];
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [examFilter, setExamFilter] = useState<string>('all');
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const eduCategories = categories.filter((c) => c.sector === 'education');
  const eduPosts = publishedPosts.filter(
    (p) => p.sector === 'education' && (selectedCat === 'all' || p.categorySlug === selectedCat)
  );

  const filteredNotices = SEED_EXAM_NOTICES.filter(
    (n) => examFilter === 'all' || n.examCode === examFilter
  );

  const handleDownloadNote = (note: StudyNote) => {
    const content = [
      `HAMI SABAI KO HUB - STUDY SUMMARY SHEET`,
      `========================================`,
      `Title: ${note.title.en}`,
      `Nepali: ${note.title.ne}`,
      `Level: ${note.level} | Subject: ${note.subject}`,
      ``,
      `KEY SYLLABUS POINTS:`,
      ...note.summaryPoints.map((pt, i) => `${i + 1}. ${pt}`),
      ``,
      `Published by Hami Sabai Ko Hub Education Desk (Kathmandu, Nepal)`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.id}-${note.level.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setDownloadedId(note.id);
    setTimeout(() => setDownloadedId(null), 2500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-12">
      {/* Sector Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-400">
          <GraduationCap className="h-4 w-4" aria-hidden="true" />
          <span>{language === 'ne' ? 'शिक्षा डेस्क · नेपाल' : 'Education Desk · Nepal'}</span>
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          {language === 'ne'
            ? 'छात्रवृत्ति, परीक्षा सूचना र अध्ययन सामग्री'
            : 'Scholarships, Exam Notices & Study Guides'}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          {language === 'ne'
            ? 'SEE, +२ NEB, IOE पुल्चोक, MBBS/CEE, लोकसेवा र वैदेशिक अध्ययनका आधिकारिक तालिका तथा नोटहरू।'
            : 'Verified timelines, preparation roadmaps, and study notes for SEE, +2 NEB, IOE, MBBS/CEE, Loksewa, and Study Abroad.'}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCat('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              selectedCat === 'all'
                ? 'bg-blue-900 text-white dark:bg-blue-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {t.all}
          </button>
          {eduCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCat(cat.slug)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                selectedCat === cat.slug
                  ? 'bg-blue-900 text-white dark:bg-blue-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {cat.name[language]}
            </button>
          ))}
        </div>
      </header>

      {/* Live Exam Notices Board */}
      <section aria-label={t.eduExamBoard}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.eduExamBoard}</h2>
          <div className="flex flex-wrap gap-1.5">
            {['all', 'SEE', '+2 NEB', 'IOE', 'MBBS / CEE', 'Loksewa'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setExamFilter(code)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  examFilter === code
                    ? 'bg-blue-900 text-white dark:bg-blue-600'
                    : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                }`}
              >
                {code === 'all' ? t.all : code}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3 font-semibold">{language === 'ne' ? 'परीक्षा' : 'Exam'}</th>
                <th className="px-4 py-3 font-semibold">{language === 'ne' ? 'सूचना विवरण' : 'Notice Title'}</th>
                <th className="px-4 py-3 font-semibold">{language === 'ne' ? 'म्याद (BS / AD)' : 'Deadline (BS / AD)'}</th>
                <th className="px-4 py-3 font-semibold">{language === 'ne' ? 'अवस्था' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredNotices.map((notice) => {
                const { bs, ad } = formatDualDate(notice.deadlineAd, language);
                return (
                  <tr key={notice.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3.5 font-semibold text-blue-900 dark:text-blue-400 whitespace-nowrap">
                      {notice.examCode}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{notice.title[language]}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{notice.board}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300 tabular-nums whitespace-nowrap">
                      <span className="font-medium">{bs}</span>
                      <span className="block text-slate-400">{ad}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-semibold whitespace-nowrap">
                      <span
                        className={
                          notice.status === 'Results Out'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : notice.status === 'Open'
                            ? 'text-blue-800 dark:text-blue-400'
                            : 'text-amber-700 dark:text-amber-400'
                        }
                      >
                        {notice.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Education Articles */}
      <section aria-label="Education Articles">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eduPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <AdSlot variant="leaderboard" />

      {/* Downloadable Study Notes */}
      <section aria-label={t.eduNotesTitle}>
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="h-5 w-5 text-blue-800 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.eduNotesTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SEED_STUDY_NOTES.map((note) => (
            <div
              key={note.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-blue-800 dark:text-blue-400">{note.level}</span>
                  <span>{note.sizeLabel}</span>
                </div>
                <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                  {note.title[language]}
                </h3>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {note.summaryPoints.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <FileText className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">{note.subject}</span>
                <button
                  type="button"
                  onClick={() => handleDownloadNote(note)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900 dark:bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {downloadedId === note.id
                      ? language === 'ne'
                        ? 'डाउनलोड भयो'
                        : 'Downloaded'
                      : t.downloadNote}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
