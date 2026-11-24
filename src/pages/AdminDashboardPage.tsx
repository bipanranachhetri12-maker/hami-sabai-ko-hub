import React, { useState } from 'react';
import {
  Check,
  Edit3,
  FolderPlus,
  Mail,
  MessageSquare,
  Plus,
  Shield,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useHub } from '../context/HubContext';
import {
  IMG_EDUCATION,
  IMG_HEALTH,
  IMG_HERO_HIMALAYAS,
  IMG_KATHMANDU_NEWS,
  IMG_MUSTANG,
  IMG_POKHARA,
} from '../data/seedData';
import { SECTOR_LABELS, UI_COPY } from '../i18n/translations';
import type { Post, PostStatus, Sector, UserRole } from '../types/hub';
import { formatDualDate } from '../utils/bsDate';

const PRESET_IMAGES = [
  { label: 'Himalayas Golden Hour', url: IMG_HERO_HIMALAYAS },
  { label: 'Nepal Education Campus', url: IMG_EDUCATION },
  { label: 'Nepal Health Clinic', url: IMG_HEALTH },
  { label: 'Pokhara Phewa Lake', url: IMG_POKHARA },
  { label: 'Upper Mustang Canyon', url: IMG_MUSTANG },
  { label: 'Kathmandu Heritage Street', url: IMG_KATHMANDU_NEWS },
];

export const AdminDashboardPage: React.FC = () => {
  const {
    language,
    posts,
    authors,
    categories,
    comments,
    subscribers,
    activeRole,
    setActiveRole,
    addPost,
    updatePost,
    deletePost,
    addCategory,
    deleteCategory,
    moderateComment,
    deleteComment,
    navigate,
  } = useHub();
  const t = UI_COPY[language];

  const [tab, setTab] = useState<'posts' | 'categories' | 'comments' | 'subscribers'>('posts');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Post Editor Form State
  const [sector, setSector] = useState<Sector>('news');
  const [categorySlug, setCategorySlug] = useState('politics');
  const [titleEn, setTitleEn] = useState('');
  const [titleNe, setTitleNe] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [excerptNe, setExcerptNe] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentNe, setContentNe] = useState('');
  const [imageUrl, setImageUrl] = useState(IMG_KATHMANDU_NEWS);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [status, setStatus] = useState<PostStatus>('published');
  const [scheduledFor, setScheduledFor] = useState('');
  const [tagsInput, setTagsInput] = useState('Nepal, Update');
  const [saveFeedback, setSaveFeedback] = useState('');

  // Category Form State
  const [newCatSector, setNewCatSector] = useState<Sector>('education');
  const [newCatEn, setNewCatEn] = useState('');
  const [newCatNe, setNewCatNe] = useState('');

  const canPublishOrSchedule = activeRole === 'admin' || activeRole === 'editor';
  const canDeletePosts = activeRole === 'admin';
  const canManageCategories = activeRole === 'admin' || activeRole === 'editor';
  const canModerateComments = activeRole === 'admin' || activeRole === 'editor';

  const extractYoutubeId = (raw: string): string | undefined => {
    const trimmed = raw.trim();
    if (!trimmed) return undefined;
    const match = trimmed.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
    if (match?.[1]) return match[1];
    if (/^[A-Za-z0-9_-]{6,15}$/.test(trimmed)) return trimmed;
    return undefined;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitleEn('');
    setTitleNe('');
    setExcerptEn('');
    setExcerptNe('');
    setContentEn('');
    setContentNe('');
    setYoutubeUrl('');
    setStatus(canPublishOrSchedule ? 'published' : 'draft');
    setScheduledFor('');
    setTagsInput('Nepal');
  };

  const startEdit = (p: Post) => {
    setEditingId(p.id);
    setSector(p.sector);
    setCategorySlug(p.categorySlug);
    setTitleEn(p.title.en);
    setTitleNe(p.title.ne);
    setExcerptEn(p.excerpt.en);
    setExcerptNe(p.excerpt.ne);
    setContentEn(p.content.en);
    setContentNe(p.content.ne);
    setImageUrl(p.imageUrl);
    setYoutubeUrl(p.youtubeId ? `https://youtu.be/${p.youtubeId}` : '');
    setStatus(p.status);
    setScheduledFor(p.scheduledFor || '');
    setTagsInput(p.tags.join(', '));
    setTab('posts');
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim()) return;

    const effectiveStatus: PostStatus =
      !canPublishOrSchedule && status !== 'draft' ? 'draft' : status;

    const slug =
      titleEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
      '-' +
      String(Date.now()).slice(-4);

    const payload: Omit<Post, 'id'> = {
      slug: editingId ? posts.find((x) => x.id === editingId)?.slug || slug : slug,
      sector,
      categorySlug,
      title: { en: titleEn.trim(), ne: titleNe.trim() || titleEn.trim() },
      excerpt: { en: excerptEn.trim() || titleEn.trim(), ne: excerptNe.trim() || titleNe.trim() || titleEn.trim() },
      content: { en: contentEn.trim() || excerptEn.trim() || titleEn.trim(), ne: contentNe.trim() || contentEn.trim() || titleEn.trim() },
      imageUrl,
      imageAlt: titleEn.trim(),
      authorId: authors[0].id,
      publishedAt: new Date().toISOString().split('T')[0],
      scheduledFor: effectiveStatus === 'scheduled' ? scheduledFor : undefined,
      status: effectiveStatus,
      readTimeMinutes: Math.max(2, Math.ceil((contentEn.split(/\s+/).length || 80) / 180)),
      tags: tagsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      youtubeId: extractYoutubeId(youtubeUrl),
    };

    if (editingId) {
      updatePost(editingId, payload);
      setSaveFeedback('Post updated successfully.');
    } else {
      addPost(payload);
      setSaveFeedback(
        effectiveStatus === 'draft'
          ? 'Saved as draft (Writers require Editor/Admin approval to publish).'
          : 'Post saved and published.'
      );
    }

    resetForm();
    setTimeout(() => setSaveFeedback(''), 3500);
  };

  const roles: UserRole[] = ['admin', 'editor', 'writer'];
  const sectorCats = categories.filter((c) => c.sector === sector);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* Header + Role-Based Access Switcher */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t.adminTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.adminSub}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">
            <Shield className="h-3.5 w-3.5 text-blue-800 dark:text-blue-400" aria-hidden="true" />
            Active Role:
          </span>
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setActiveRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors whitespace-nowrap shrink-0 ${
                activeRole === r
                  ? 'bg-blue-900 text-white dark:bg-blue-600'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </header>

      {/* Role Permission Notice */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900 px-4 py-3 text-xs text-slate-700 dark:text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <span>
          <strong className="capitalize">{activeRole}</strong> permissions:{' '}
          {activeRole === 'admin'
            ? 'Full access — Create, Edit, Schedule, Delete posts, Manage Categories, Moderate Comments.'
            : activeRole === 'editor'
            ? 'Editorial access — Create, Edit, Publish/Schedule posts, Manage Categories, Moderate Comments (Delete disabled).'
            : 'Writer access — Submit Draft posts only (Publishing, Categories & Moderation restricted to Editors/Admins).'}
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setTab('posts')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
            tab === 'posts'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Posts ({posts.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('categories')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
            tab === 'categories'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('comments')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
            tab === 'comments'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Comments Moderation ({comments.filter((c) => c.status === 'pending').length} pending)
        </button>
        <button
          type="button"
          onClick={() => setTab('subscribers')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
            tab === 'subscribers'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Newsletter Subscribers ({subscribers.length})
        </button>
      </div>

      {/* Tab 1: Posts CRUD + Scheduler + YouTube + Image Upload */}
      {tab === 'posts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleSavePost}
            className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {editingId ? 'Edit Article / Vlog' : 'Create New Post'}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Sector</label>
                <select
                  value={sector}
                  onChange={(e) => {
                    const nextSec = e.target.value as Sector;
                    setSector(nextSec);
                    const firstCat = categories.find((c) => c.sector === nextSec);
                    if (firstCat) setCategorySlug(firstCat.slug);
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  {(['education', 'health', 'tourism', 'news'] as Sector[]).map((s) => (
                    <option key={s} value={s}>
                      {SECTOR_LABELS[s].en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Category</label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  {sectorCats.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Title (English) *</label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Headline in English"
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Title (Nepali / नेपाली)</label>
              <input
                type="text"
                value={titleNe}
                onChange={(e) => setTitleNe(e.target.value)}
                placeholder="नेपाली शीर्षक"
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Summary / Excerpt (English)</label>
              <textarea
                rows={2}
                value={excerptEn}
                onChange={(e) => setExcerptEn(e.target.value)}
                placeholder="Short 1-2 sentence summary"
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Article Body (English)</label>
              <textarea
                rows={4}
                value={contentEn}
                onChange={(e) => setContentEn(e.target.value)}
                placeholder="Full editorial article text..."
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Article Body (Nepali)</label>
              <textarea
                rows={3}
                value={contentNe}
                onChange={(e) => setContentNe(e.target.value)}
                placeholder="नेपाली भाषामा पूरा सामग्री..."
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            {/* Image Upload / Preset Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Cover Image (Preset or Upload)
              </label>
              <select
                value={PRESET_IMAGES.some((i) => i.url === imageUrl) ? imageUrl : ''}
                onChange={(e) => e.target.value && setImageUrl(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="">Custom Uploaded Image</option>
                {PRESET_IMAGES.map((img) => (
                  <option key={img.url} value={img.url}>
                    {img.label}
                  </option>
                ))}
              </select>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Upload Local Image</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                YouTube Vlog Link or Video ID (optional)
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PostStatus)}
                  disabled={!canPublishOrSchedule}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white disabled:opacity-60"
                >
                  <option value="published">Publish Now</option>
                  <option value="scheduled">Schedule</option>
                  <option value="draft">Save as Draft</option>
                </select>
              </div>
              {status === 'scheduled' && canPublishOrSchedule && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Publish Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 dark:bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>{editingId ? 'Update Post' : 'Save Post'}</span>
            </button>

            {saveFeedback && (
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{saveFeedback}</p>
            )}
          </form>

          {/* Existing Posts Table */}
          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">All Content Items</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[680px] overflow-y-auto">
              {posts.map((p) => {
                const { bs } = formatDualDate(p.publishedAt, language);
                return (
                  <div key={p.id} className="p-4 flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                        <span className="font-semibold capitalize text-blue-800 dark:text-blue-400">
                          {p.sector}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{p.status}</span>
                        {p.scheduledFor && <span>({p.scheduledFor})</span>}
                        <span aria-hidden="true">·</span>
                        <span>{bs}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate({ page: 'post', slug: p.slug })}
                        className="mt-1 text-left text-sm font-semibold text-slate-900 dark:text-white hover:underline line-clamp-1"
                      >
                        {p.title[language]}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        aria-label="Edit post"
                        className="rounded-lg border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      {canDeletePosts && (
                        <button
                          type="button"
                          onClick={() => deletePost(p.id)}
                          aria-label="Delete post"
                          className="rounded-lg border border-red-200 dark:border-red-900/60 p-2 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Category Manager */}
      {tab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <FolderPlus className="h-4 w-4 text-blue-800 dark:text-blue-400" aria-hidden="true" />
              <span>Add Category</span>
            </h2>
            {!canManageCategories ? (
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Switch role to Editor or Admin to manage categories.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCatEn.trim()) return;
                  addCategory(newCatSector, newCatEn, newCatNe);
                  setNewCatEn('');
                  setNewCatNe('');
                }}
                className="space-y-3"
              >
                <select
                  value={newCatSector}
                  onChange={(e) => setNewCatSector(e.target.value as Sector)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  {(['education', 'health', 'tourism', 'news'] as Sector[]).map((s) => (
                    <option key={s} value={s}>
                      {SECTOR_LABELS[s].en}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={newCatEn}
                  onChange={(e) => setNewCatEn(e.target.value)}
                  placeholder="Category Name (English)"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={newCatNe}
                  onChange={(e) => setNewCatNe(e.target.value)}
                  placeholder="श्रेणी नाम (नेपाली)"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-900 dark:bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                >
                  Create Category
                </button>
              </form>
            )}
          </div>

          <div className="md:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map((cat) => (
              <div key={cat.id} className="px-5 py-3 flex items-center justify-between text-sm">
                <div>
                  <span className="text-xs font-semibold capitalize text-blue-800 dark:text-blue-400">
                    {cat.sector}
                  </span>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {cat.name.en} · {cat.name.ne}
                  </p>
                </div>
                {canManageCategories && (
                  <button
                    type="button"
                    onClick={() => deleteCategory(cat.id)}
                    aria-label="Delete category"
                    className="rounded-lg p-1.5 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Comments Moderation */}
      {tab === 'comments' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
          {comments.map((c) => {
            const targetPost = posts.find((p) => p.id === c.postId);
            return (
              <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="font-semibold text-slate-900 dark:text-white">{c.authorName}</span>
                    <span>·</span>
                    <span
                      className={`font-semibold capitalize ${
                        c.status === 'approved'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : c.status === 'pending'
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-red-700 dark:text-red-400'
                      }`}
                    >
                      {c.status}
                    </span>
                    {targetPost && (
                      <>
                        <span>·</span>
                        <span className="truncate max-w-xs">{targetPost.title.en}</span>
                      </>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-300">{c.body}</p>
                </div>

                {canModerateComments && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => moderateComment(c.id, 'approved')}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => moderateComment(c.id, 'rejected')}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteComment(c.id)}
                      aria-label="Delete comment"
                      className="rounded-lg border border-red-200 dark:border-red-900/60 p-1.5 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 4: Newsletter Subscribers */}
      {tab === 'subscribers' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
          {subscribers.map((sub) => (
            <div key={sub.id} className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-800 dark:text-blue-400" aria-hidden="true" />
                <span className="font-medium text-slate-900 dark:text-white">{sub.email}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {sub.sectors.join(', ')} · {sub.subscribedAt}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
