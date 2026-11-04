-- Manual ordering (drag & drop in admin) for products, services and specialists.
-- Requires 20260322003000_admin_auth_rls.sql (public.is_admin()).

alter table public.products    add column if not exists sort_order int not null default 0;
alter table public.services    add column if not exists sort_order int not null default 0;
alter table public.specialists add column if not exists sort_order int not null default 0;

-- Keep the current visible order (oldest first) for existing rows.
update public.products p set sort_order = x.rn
from (select id, row_number() over (order by created_at) - 1 as rn from public.products) x where p.id = x.id;
update public.services s set sort_order = x.rn
from (select id, row_number() over (order by created_at) - 1 as rn from public.services) x where s.id = x.id;
update public.specialists s set sort_order = x.rn
from (select id, row_number() over (order by created_at) - 1 as rn from public.specialists) x where s.id = x.id;

create index if not exists products_sort_idx on public.products (sort_order, created_at desc);
create index if not exists services_sort_idx on public.services (sort_order, created_at desc);
create index if not exists specialists_sort_idx on public.specialists (sort_order, created_at desc);

-- Saves a new order in one statement: position in p_ids becomes sort_order (0, 1, 2…).
-- SECURITY INVOKER: runs as the caller, so the tables' admin-only UPDATE policies still apply.
create or replace function public.set_sort_order(p_table text, p_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_table not in ('products', 'services', 'specialists') then
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
