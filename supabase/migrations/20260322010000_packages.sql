-- Service packages: a bundle of several services sold at one price.
-- Requires 20260322003000_admin_auth_rls.sql (public.is_admin()) and 20260322008000 (set_sort_order).

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null check (char_length(title) between 1 and 160),
  description text not null default '',
  price text not null,
  duration text not null default '',
  image_url text not null default '',
  details text[] not null default '{}',
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Services inside a package (ordered).
create table if not exists public.package_services (
  package_id uuid not null references public.packages (id) on delete cascade,
  service_id uuid not null references public.services (id) on delete cascade,
  position int not null default 0,
  primary key (package_id, service_id)
);

create index if not exists packages_sort_idx on public.packages (is_published, sort_order, created_at desc);
create index if not exists package_services_service_idx on public.package_services (service_id);

alter table public.packages enable row level security;
alter table public.package_services enable row level security;

grant select on public.packages, public.package_services to anon, authenticated;
grant insert, update, delete on public.packages, public.package_services to authenticated;

-- packages: visitors see published only; admins see and manage everything.
drop policy if exists "Public read published packages" on public.packages;
drop policy if exists "Admins read all packages" on public.packages;
drop policy if exists "Admins insert packages" on public.packages;
drop policy if exists "Admins update packages" on public.packages;
drop policy if exists "Admins delete packages" on public.packages;

create policy "Public read published packages"
  on public.packages for select to anon, authenticated using (is_published);
create policy "Admins read all packages"
  on public.packages for select to authenticated using ((select public.is_admin()));
create policy "Admins insert packages"
  on public.packages for insert to authenticated with check ((select public.is_admin()));
create policy "Admins update packages"
  on public.packages for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins delete packages"
  on public.packages for delete to authenticated using ((select public.is_admin()));

-- package_services: readable when the parent package is visible to the caller.
drop policy if exists "Read package services" on public.package_services;
drop policy if exists "Admins insert package services" on public.package_services;
drop policy if exists "Admins update package services" on public.package_services;
drop policy if exists "Admins delete package services" on public.package_services;

create policy "Read package services"
  on public.package_services for select to anon, authenticated
  using (exists (select 1 from public.packages p where p.id = package_id));
create policy "Admins insert package services"
  on public.package_services for insert to authenticated with check ((select public.is_admin()));
create policy "Admins update package services"
  on public.package_services for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins delete package services"
  on public.package_services for delete to authenticated using ((select public.is_admin()));

-- Allow drag & drop ordering of packages.
create or replace function public.set_sort_order(p_table text, p_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_table not in ('products', 'services', 'specialists', 'reviews', 'packages') then
    raise exception 'invalid table: %', p_table;
  end if;
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  execute format(
    'update public.%I t set sort_order = x.ord - 1 from unnest($1) with ordinality as x(id, ord) where t.id = x.id',
    p_table
  ) using p_ids;
end;
$$;

revoke all on function public.set_sort_order(text, uuid[]) from public, anon;
grant execute on function public.set_sort_order(text, uuid[]) to authenticated;

notify pgrst, 'reload schema';
