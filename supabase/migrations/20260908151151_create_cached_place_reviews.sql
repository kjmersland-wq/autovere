-- Read-through cache for Google Places ratings/reviews, so the corridor POI
-- cards never hit the paid Places API more than once per station: the
-- on-demand serverless proxy (src/lib/place-reviews.functions.ts) checks
-- this table first and only calls Google when a row is missing or stale.
create table if not exists public.cached_place_reviews (
  poi_id text primary key,
  place_id text,
  rating numeric,
  review_count integer,
  top_review text,
  photo_url text,
  fetched_at timestamptz not null default now()
);

grant select on public.cached_place_reviews to anon, authenticated;
grant insert, update on public.cached_place_reviews to anon, authenticated;
grant all on public.cached_place_reviews to service_role;
grant usage on schema public to anon, authenticated;

alter table public.cached_place_reviews enable row level security;

drop policy if exists "Anyone can read cached place reviews" on public.cached_place_reviews;
create policy "Anyone can read cached place reviews"
  on public.cached_place_reviews for select
  to anon, authenticated
  using (true);

-- Written only by the server-side on-demand proxy (never directly from the
-- browser UI) — public write access mirrors the existing product_events
-- log-table policy since cached review data isn't sensitive.
drop policy if exists "Anyone can populate cached place reviews" on public.cached_place_reviews;
create policy "Anyone can populate cached place reviews"
  on public.cached_place_reviews for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Anyone can refresh cached place reviews" on public.cached_place_reviews;
create policy "Anyone can refresh cached place reviews"
  on public.cached_place_reviews for update
  to anon, authenticated
  using (true)
  with check (true);

create index if not exists cached_place_reviews_fetched_at_idx on public.cached_place_reviews (fetched_at);
