-- Admin authorization + hardened RLS.
-- Before: any authenticated user could write. After: only users listed in public.admins.

-- 1. Admins allow-list ------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- A signed-in user may only see whether they themselves are an admin.
drop policy if exists "Admins read own row" on public.admins;
create policy "Admins read own row"
  on public.admins for select
  to authenticated
  using (user_id = (select auth.uid()));
-- No insert/update/delete policies: admins are managed from the Supabase dashboard / SQL editor only.

-- 2. is_admin() helper (security definer so it can read public.admins under RLS)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 3. Table privileges (new Supabase projects don't auto-grant to API roles) ---
grant usage on schema public to anon, authenticated;
grant select on public.products, public.services, public.specialists, public.company_settings to anon, authenticated;
grant insert, update, delete on public.products, public.services, public.specialists, public.company_settings to authenticated;
grant select on public.admins to authenticated;

-- 4. Replace "any authenticated user can write" with admin-only policies -----
drop policy if exists "Authenticated write products" on public.products;
drop policy if exists "Authenticated write services" on public.services;
drop policy if exists "Authenticated write specialists" on public.specialists;
drop policy if exists "Authenticated write company settings" on public.company_settings;

do $$
declare t text;
begin
  foreach t in array array['products', 'services', 'specialists', 'company_settings'] loop
    execute format('drop policy if exists "Admins insert %1$s" on public.%1$I', t);
    execute format('drop policy if exists "Admins update %1$s" on public.%1$I', t);
    execute format('drop policy if exists "Admins delete %1$s" on public.%1$I', t);

    execute format('create policy "Admins insert %1$s" on public.%1$I for insert to authenticated with check ((select public.is_admin()))', t);
    execute format('create policy "Admins update %1$s" on public.%1$I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format('create policy "Admins delete %1$s" on public.%1$I for delete to authenticated using ((select public.is_admin()))', t);
  end loop;
end $$;

-- 5. Storage: public read, admin-only write on the "media" bucket ------------
update storage.buckets
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
where id = 'media';

drop policy if exists "Authenticated upload media" on storage.objects;
drop policy if exists "Authenticated update media" on storage.objects;
drop policy if exists "Authenticated delete media" on storage.objects;
drop policy if exists "Admins upload media" on storage.objects;
drop policy if exists "Admins update media" on storage.objects;
drop policy if exists "Admins delete media" on storage.objects;

create policy "Admins upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "Admins update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "Admins delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
