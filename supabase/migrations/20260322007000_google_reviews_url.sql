-- Link to the salon's Google reviews, shown as "View more on Google" in the site testimonials.
alter table public.company_settings
  add column if not exists google_reviews_url text not null default '';
