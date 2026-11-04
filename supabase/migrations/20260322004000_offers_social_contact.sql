-- Offers (linked to products / services), company social links, contact form messages.
-- Requires 20260322003000_admin_auth_rls.sql (public.is_admin()).

-- 1. Social links on company settings ---------------------------------------
alter table public.company_settings
  add column if not exists social_links text[] not null default '{}';

-- 2. Offers -------------------------------------------------------------------
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  discount_type text not null default 'percent' check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10, 2) not null check (discount_value > 0),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint offers_dates_check check (ends_at > starts_at),
  constraint offers_percent_check check (discount_type <> 'percent' or discount_value <= 100)
);

create table if not exists public.offer_products (
  offer_id uuid not null references public.offers (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  primary key (offer_id, product_id)
);

create table if not exists public.offer_services (
  offer_id uuid not null references public.offers (id) on delete cascade,
  service_id uuid not null references public.services (id) on delete cascade,
  primary key (offer_id, service_id)
);

create index if not exists offers_window_idx on public.offers (is_active, starts_at, ends_at);
create index if not exists offer_products_product_idx on public.offer_products (product_id);
create index if not exists offer_services_service_idx on public.offer_services (service_id);

alter table public.offers enable row level security;
alter table public.offer_products enable row level security;
alter table public.offer_services enable row level security;

grant select on public.offers, public.offer_products, public.offer_services to anon, authenticated;
grant insert, update, delete on public.offers, public.offer_products, public.offer_services to authenticated;

do $$
declare t text;
begin
  foreach t in array array['offers', 'offer_products', 'offer_services'] loop
    execute format('drop policy if exists "Public read %1$s" on public.%1$I', t);
    execute format('drop policy if exists "Admins insert %1$s" on public.%1$I', t);
    execute format('drop policy if exists "Admins update %1$s" on public.%1$I', t);
    execute format('drop policy if exists "Admins delete %1$s" on public.%1$I', t);

    execute format('create policy "Public read %1$s" on public.%1$I for select to anon, authenticated using (true)', t);
    execute format('create policy "Admins insert %1$s" on public.%1$I for insert to authenticated with check ((select public.is_admin()))', t);
    execute format('create policy "Admins update %1$s" on public.%1$I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format('create policy "Admins delete %1$s" on public.%1$I for delete to authenticated using ((select public.is_admin()))', t);
  end loop;
end $$;

-- 3. Contact form messages ----------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  phone text not null default '' check (char_length(phone) <= 40),
  message text not null check (char_length(message) between 1 and 4000),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Visitors can only submit; they can never read messages.
grant insert on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;

drop policy if exists "Anyone can submit contact message" on public.contact_messages;
drop policy if exists "Admins read contact messages" on public.contact_messages;
drop policy if exists "Admins delete contact messages" on public.contact_messages;

create policy "Anyone can submit contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "Admins read contact messages"
  on public.contact_messages for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins delete contact messages"
  on public.contact_messages for delete
  to authenticated
  using ((select public.is_admin()));
