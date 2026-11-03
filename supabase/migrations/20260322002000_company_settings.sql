-- Singleton company / salon contact settings
create table if not exists public.company_settings (
  id int primary key default 1 check (id = 1),
  company_name text not null default 'ELAK',
  tagline text not null default '',
  email text not null default '',
  phone text not null default '',
  whatsapp_number text not null default '',
  address text not null default '',
  city text not null default '',
  country text not null default 'United Arab Emirates',
  map_embed_url text not null default '',
  map_link_url text not null default '',
  opening_hours text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.company_settings (
  id,
  company_name,
  tagline,
  email,
  phone,
  whatsapp_number,
  address,
  city,
  country,
  map_embed_url,
  map_link_url,
  opening_hours
) values (
  1,
  'ELAK',
  'Premium Men''s Salon UAE',
  'hello@elaksalon.ae',
  '+971 55 870 5679',
  '971558705679',
  'Dubai',
  'Dubai',
  'United Arab Emirates',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178509074!2d55.2708!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff5996b343a1d1f!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae',
  'https://maps.google.com/?q=Dubai+UAE',
  'Open daily · 10:00 AM – 10:00 PM'
) on conflict (id) do nothing;

alter table public.company_settings enable row level security;

create policy "Public read company settings"
  on public.company_settings for select
  to anon, authenticated
  using (true);

create policy "Authenticated write company settings"
  on public.company_settings for all
  to authenticated
  using (true)
  with check (true);
