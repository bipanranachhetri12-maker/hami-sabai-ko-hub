-- Optional PostgreSQL / Supabase Reference Schema for Hami Sabai Ko Hub
-- (Frontend-only mode currently uses localStorage; apply this schema if connecting Supabase later)

create type user_role as enum ('admin', 'editor', 'writer');
create type sector_type as enum ('education', 'health', 'tourism', 'news');
create type post_status as enum ('published', 'scheduled', 'draft');
create type comment_status as enum ('approved', 'pending', 'rejected');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  full_name_ne text,
  role user_role not null default 'writer',
  title_en text,
  title_ne text,
  bio_en text,
  bio_ne text,
  credentials text,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  sector sector_type not null,
  slug text not null unique,
  name_en text not null,
  name_ne text not null
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sector sector_type not null,
  category_slug text references categories(slug),
  title_en text not null,
  title_ne text not null,
  excerpt_en text not null,
  excerpt_ne text not null,
  content_en text not null,
  content_ne text not null,
  image_url text,
  image_alt text,
  author_id uuid references profiles(id),
  published_at date not null default current_date,
  scheduled_for date,
  status post_status not null default 'draft',
  read_time_minutes int not null default 5,
  tags text[] not null default '{}',
  featured boolean not null default false,
  breaking boolean not null default false,
  youtube_id text,
  medical_reviewed_by text,
  created_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_name text not null,
  author_email text not null,
  body text not null,
  status comment_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  sectors sector_type[] not null default '{news}',
  subscribed_at timestamptz not null default now()
);
