export type Language = 'en' | 'ne';

export type Sector = 'education' | 'health' | 'tourism' | 'news';

export type UserRole = 'admin' | 'editor' | 'writer';

export type PostStatus = 'published' | 'scheduled' | 'draft';

export interface BilingualText {
  en: string;
  ne: string;
}

export interface Author {
  id: string;
  name: string;
  nameNe: string;
  role: UserRole;
  title: BilingualText;
  bio: BilingualText;
  avatarColor: string;
  credentials?: string;
}

export interface Category {
  id: string;
  sector: Sector;
  slug: string;
  name: BilingualText;
}

export interface Post {
  id: string;
  slug: string;
  sector: Sector;
  categorySlug: string;
  title: BilingualText;
  excerpt: BilingualText;
  content: BilingualText;
  imageUrl: string;
  imageAlt: string;
  authorId: string;
  publishedAt: string; // ISO date string YYYY-MM-DD
  scheduledFor?: string;
  status: PostStatus;
  readTimeMinutes: number;
  tags: string[];
  featured?: boolean;
  breaking?: boolean;
  trendingRank?: number;
  youtubeId?: string; // Optional YouTube video ID for travel vlogs
  medicalReviewedBy?: string; // For Health MedicalWebPage schema
}

export interface CommentItem {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  body: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  sectors: Sector[];
  subscribedAt: string;
}

export interface ExamNotice {
  id: string;
  examCode: 'SEE' | '+2 NEB' | 'IOE' | 'MBBS / CEE' | 'Loksewa';
  board: string;
  title: BilingualText;
  deadlineAd: string;
  status: 'Open' | 'Upcoming' | 'Results Out';
  linkLabel: BilingualText;
}

export interface StudyNote {
  id: string;
  subject: string;
  level: string;
  title: BilingualText;
  pages: number;
  sizeLabel: string;
  summaryPoints: string[];
}

export interface HospitalItem {
  id: string;
  name: string;
  city: string;
  province: string;
  type: 'Government' | 'Teaching' | 'Private' | 'Specialty';
  specialties: string[];
  emergencyPhone: string;
  beds: number;
}

export interface TrekDay {
  day: number;
  title: BilingualText;
  elevation: string;
  duration: string;
}

export interface DestinationGuide {
  id: string;
  slug: string;
  name: BilingualText;
  province: string;
  elevation: string;
  bestSeason: BilingualText;
  budgetNpr: string;
  budgetUsd: string;
  durationDays: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  coordinates: { x: number; y: number; lat: string; lng: string };
  imageUrl: string;
  youtubeId?: string;
  summary: BilingualText;
  itinerary: TrekDay[];
  budgetBreakdown: { item: BilingualText; costNpr: string }[];
}

export interface CityWeather {
  city: string;
  cityNe: string;
  tempC: number;
  condition: BilingualText;
  humidity: number;
  windKmh: number;
  altitude: string;
}

export interface ExchangeRate {
  code: string;
  currency: string;
  unit: number;
  buyNpr: number;
  sellNpr: number;
}

export interface MetalRate {
  name: BilingualText;
  unit: string;
  priceNpr: number;
  changeNpr: number;
}

export type RouteView =
  | { page: 'home' }
  | { page: 'sector'; sector: Sector }
  | { page: 'post'; slug: string }
  | { page: 'author'; authorId: string }
  | { page: 'search' }
  | { page: 'admin' }
  | { page: 'static'; doc: 'about' | 'contact' | 'privacy' | 'advertise' };
