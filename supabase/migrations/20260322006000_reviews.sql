-- Customer reviews shown in the site carousel, managed from the admin.
-- Requires 20260322003000_admin_auth_rls.sql (public.is_admin()).

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  role text not null default '',
  rating smallint not null default 5 check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 1 and 1000),
  image_url text not null default '',
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reviews_published_idx on public.reviews (is_published, sort_order, created_at desc);

alter table public.reviews enable row level security;

grant select on public.reviews to anon, authenticated;
grant insert, update, delete on public.reviews to authenticated;

drop policy if exists "Public read published reviews" on public.reviews;
drop policy if exists "Admins read all reviews" on public.reviews;
drop policy if exists "Admins insert reviews" on public.reviews;
drop policy if exists "Admins update reviews" on public.reviews;
drop policy if exists "Admins delete reviews" on public.reviews;

-- Visitors only see published reviews; admins see everything.
create policy "Public read published reviews"
  on public.reviews for select
  to anon, authenticated
  using (is_published);

create policy "Admins read all reviews"
  on public.reviews for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins insert reviews"
  on public.reviews for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins update reviews"
  on public.reviews for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins delete reviews"
  on public.reviews for delete
  to authenticated
  using ((select public.is_admin()));
