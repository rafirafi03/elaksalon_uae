-- Allow drag & drop ordering for reviews too (extends set_sort_order from 20260322008000).
create or replace function public.set_sort_order(p_table text, p_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_table not in ('products', 'services', 'specialists', 'reviews') then
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
