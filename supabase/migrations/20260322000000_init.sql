-- ELAK initial schema: products, services, specialists
create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  brand text not null,
  price text not null,
  image_url text not null,
  category text not null,
  description text not null default '',
  details text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  image_url text not null,
  category text not null,
  duration text not null,
  price_from text not null,
  details text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.specialists (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  role text not null,
  specialty text not null,
  experience text not null,
  image_url text not null,
  bio text not null default '',
  skills text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.services enable row level security;
alter table public.specialists enable row level security;

create policy "Public read products"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "Public read services"
  on public.services for select
  to anon, authenticated
  using (true);

create policy "Public read specialists"
  on public.specialists for select
  to anon, authenticated
  using (true);

create policy "Authenticated write products"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated write services"
  on public.services for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated write specialists"
  on public.specialists for all
  to authenticated
  using (true)
  with check (true);
