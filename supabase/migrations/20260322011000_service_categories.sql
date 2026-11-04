-- Service categories (e.g. "Massage" → Swedish Massage, Relax Massage…).
-- Requires 20260322003000_admin_auth_rls.sql (public.is_admin()) and 20260322008000 (set_sort_order).

create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 1 and 80),
  slug text not null unique,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Services point to a category. Deleting a category leaves its services uncategorised.
alter table public.services
  add column if not exists category_id uuid references public.service_categories (id) on delete set null;

create index if not exists services_category_idx on public.services (category_id);
create index if not exists service_categories_sort_idx on public.service_categories (sort_order, created_at desc);

-- Convert existing free-text categories into real categories (image = first service image in it).
insert into public.service_categories (name, slug, image_url, sort_order)
select
  c.category,
  trim(both '-' from regexp_replace(lower(c.category), '[^a-z0-9]+', '-', 'g')),
  c.image_url,
  row_number() over (order by c.first_created) - 1
from (
  select distinct on (lower(trim(category)))
    trim(category) as category, image_url, created_at as first_created
  from public.services
  where trim(category) <> ''
  order by lower(trim(category)), created_at
) c
on conflict (name) do nothing;

update public.services s
set category_id = sc.id
from public.service_categories sc
where s.category_id is null and lower(trim(s.category)) = lower(sc.name);

-- RLS: public read, admin write.
alter table public.service_categories enable row level security;

grant select on public.service_categories to anon, authenticated;
grant insert, update, delete on public.service_categories to authenticated;

drop policy if exists "Public read service categories" on public.service_categories;
drop policy if exists "Admins insert service categories" on public.service_categories;
drop policy if exists "Admins update service categories" on public.service_categories;
drop policy if exists "Admins delete service categories" on public.service_categories;

create policy "Public read service categories"
  on public.service_categories for select to anon, authenticated using (true);
create policy "Admins insert service categories"
  on public.service_categories for insert to authenticated with check ((select public.is_admin()));
create policy "Admins update service categories"
  on public.service_categories for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins delete service categories"
  on public.service_categories for delete to authenticated using ((select public.is_admin()));

-- Allow drag & drop ordering of categories.
create or replace function public.set_sort_order(p_table text, p_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_table not in ('products', 'services', 'specialists', 'reviews', 'packages', 'service_categories') then
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
