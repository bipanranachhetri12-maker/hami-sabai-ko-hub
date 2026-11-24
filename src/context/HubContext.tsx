import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  SEED_AUTHORS,
  SEED_CATEGORIES,
  SEED_COMMENTS,
  SEED_POSTS,
} from '../data/seedData';
import type {
  Author,
  Category,
  CommentItem,
  Language,
  NewsletterSubscriber,
  Post,
  RouteView,
  Sector,
  UserRole,
} from '../types/hub';

interface HubContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  route: RouteView;
  navigate: (next: RouteView) => void;
  posts: Post[];
  publishedPosts: Post[];
  authors: Author[];
  categories: Category[];
  comments: CommentItem[];
  subscribers: NewsletterSubscriber[];
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  addPost: (post: Omit<Post, 'id'>) => void;
  updatePost: (id: string, patch: Partial<Post>) => void;
  deletePost: (id: string) => void;
  addCategory: (sector: Sector, enName: string, neName: string) => void;
  deleteCategory: (id: string) => void;
  submitComment: (postId: string, authorName: string, authorEmail: string, body: string) => void;
  moderateComment: (id: string, status: 'approved' | 'rejected') => void;
  deleteComment: (id: string) => void;
  subscribeNewsletter: (email: string, sectors: Sector[]) => { ok: boolean; alreadyExists?: boolean };
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const HubContext = createContext<HubContextValue | null>(null);

const STORAGE_KEYS = {
  lang: 'hsh_lang_v1',
  theme: 'hsh_theme_v1',
  posts: 'hsh_posts_v1',
  categories: 'hsh_categories_v1',
  comments: 'hsh_comments_v1',
  subscribers: 'hsh_subscribers_v1',
  role: 'hsh_role_v1',
};

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function parseHashToRoute(): RouteView {
  if (typeof window === 'undefined') return { page: 'home' };
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash || hash === 'home') return { page: 'home' };
  const [head, arg] = hash.split('/');
  if (head === 'education' || head === 'health' || head === 'tourism' || head === 'news') {
    return { page: 'sector', sector: head };
  }
  if (head === 'post' && arg) return { page: 'post', slug: decodeURIComponent(arg) };
  if (head === 'author' && arg) return { page: 'author', authorId: decodeURIComponent(arg) };
  if (head === 'search') return { page: 'search' };
  if (head === 'admin') return { page: 'admin' };
  if (head === 'about' || head === 'contact' || head === 'privacy' || head === 'advertise') {
    return { page: 'static', doc: head };
  }
  return { page: 'home' };
}

function routeToHash(route: RouteView): string {
  switch (route.page) {
    case 'home':
      return '#/';
    case 'sector':
      return `#/${route.sector}`;
    case 'post':
      return `#/post/${encodeURIComponent(route.slug)}`;
    case 'author':
      return `#/author/${encodeURIComponent(route.authorId)}`;
    case 'search':
      return '#/search';
    case 'admin':
      return '#/admin';
    case 'static':
      return `#/${route.doc}`;
  }
}

export const HubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() =>
    safeRead<Language>(STORAGE_KEYS.lang, 'en')
  );
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    safeRead<'light' | 'dark'>(STORAGE_KEYS.theme, 'light')
  );
  const [route, setRoute] = useState<RouteView>(() => parseHashToRoute());
  const [posts, setPosts] = useState<Post[]>(() => safeRead<Post[]>(STORAGE_KEYS.posts, SEED_POSTS));
  const [categories, setCategories] = useState<Category[]>(() =>
    safeRead<Category[]>(STORAGE_KEYS.categories, SEED_CATEGORIES)
  );
  const [comments, setComments] = useState<CommentItem[]>(() =>
    safeRead<CommentItem[]>(STORAGE_KEYS.comments, SEED_COMMENTS)
  );
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() =>
    safeRead<NewsletterSubscriber[]>(STORAGE_KEYS.subscribers, [
      {
        id: 'sub-seed',
        email: 'reader@hamisabaikohub.com',
        sectors: ['education', 'news'],
        subscribedAt: '2026-11-20',
      },
    ])
  );
  const [activeRole, setActiveRoleState] = useState<UserRole>(() =>
    safeRead<UserRole>(STORAGE_KEYS.role, 'admin')
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme));
    } catch {
      // ignore storage quota errors
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language === 'ne' ? 'ne' : 'en';
    try {
      localStorage.setItem(STORAGE_KEYS.lang, JSON.stringify(language));
    } catch {
      // ignore
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(posts));
    } catch {
      // ignore
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(comments));
    } catch {
      // ignore
    }
  }, [comments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.subscribers, JSON.stringify(subscribers));
    } catch {
      // ignore
    }
  }, [subscribers]);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashToRoute());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (next: RouteView) => {
    setRoute(next);
    const nextHash = routeToHash(next);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const toggleLanguage = () => setLanguageState((prev) => (prev === 'en' ? 'ne' : 'en'));
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    try {
      localStorage.setItem(STORAGE_KEYS.role, JSON.stringify(role));
    } catch {
      // ignore
    }
  };

  const todayIso = new Date().toISOString().split('T')[0];
  const publishedPosts = posts.filter((p) => {
    if (p.status === 'published') return true;
    if (p.status === 'scheduled' && p.scheduledFor && p.scheduledFor <= todayIso) return true;
    return false;
  });

  const addPost = (post: Omit<Post, 'id'>) => {
    const id = `post-${Date.now()}`;
    setPosts((prev) => [{ ...post, id }, ...prev]);
  };

  const updatePost = (id: string, patch: Partial<Post>) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const addCategory = (sector: Sector, enName: string, neName: string) => {
    const slug = enName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    if (!slug) return;
    setCategories((prev) => [
      ...prev,
      {
        id: `cat-${Date.now()}`,
        sector,
        slug,
        name: { en: enName.trim(), ne: neName.trim() || enName.trim() },
      },
    ]);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const submitComment = (
    postId: string,
    authorName: string,
    authorEmail: string,
    body: string
  ) => {
    const item: CommentItem = {
      id: `cmt-${Date.now()}`,
      postId,
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim(),
      body: body.trim(),
      createdAt: todayIso,
      status: activeRole === 'admin' || activeRole === 'editor' ? 'approved' : 'pending',
    };
    setComments((prev) => [item, ...prev]);
  };

  const moderateComment = (id: string, status: 'approved' | 'rejected') => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const deleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const subscribeNewsletter = (email: string, sectors: Sector[]) => {
    const normalized = email.trim().toLowerCase();
    const exists = subscribers.some((s) => s.email.toLowerCase() === normalized);
    if (exists) {
      return { ok: true, alreadyExists: true };
    }
    setSubscribers((prev) => [
      {
        id: `sub-${Date.now()}`,
        email: normalized,
        sectors: sectors.length ? sectors : ['news'],
        subscribedAt: todayIso,
      },
      ...prev,
    ]);
    return { ok: true, alreadyExists: false };
  };

  return (
    <HubContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        theme,
        toggleTheme,
        route,
        navigate,
        posts,
        publishedPosts,
        authors: SEED_AUTHORS,
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
        submitComment,
        moderateComment,
        deleteComment,
        subscribeNewsletter,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </HubContext.Provider>
  );
};

export function useHub(): HubContextValue {
  const ctx = useContext(HubContext);
  if (!ctx) throw new Error('useHub must be used within HubProvider');
  return ctx;
}
