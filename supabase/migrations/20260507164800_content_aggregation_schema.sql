-- =====================================================
-- AUTOVERE Content Aggregation Schema
-- Supports multi-source automotive content intelligence
-- =====================================================

-- =====================================================
-- 1. CONTENT_SOURCES TABLE
-- Registry of trusted automotive publications
-- =====================================================

create table public.content_sources (
  id uuid primary key default gen_random_uuid(),
  
  -- Basic Information
  name text not null, -- "Car and Driver", "Top Gear", etc.
  slug text not null unique, -- "car-and-driver", "top-gear"
  domain text not null, -- "caranddriver.com"
  
  -- Branding & Description
  logo_url text,
  description text,
  
  -- Quality & Trust Metrics
  trust_score int not null default 50 check (trust_score >= 0 and trust_score <= 100),
  
  -- Capabilities
  languages text[] not null default '{en}', -- ['en', 'de', 'fr']
  content_types text[] not null default '{article}', -- ['article', 'review', 'video', 'comparison']
  
  -- RSS Feed Configuration
  -- Structure: [{url: "...", language: "en", category: "reviews", enabled: true}]
  rss_feeds jsonb default '[]'::jsonb,
  
  -- Status
  is_active boolean not null default true,
  
  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for content_sources
create index idx_content_sources_slug on public.content_sources(slug);
create index idx_content_sources_active on public.content_sources(is_active) where is_active = true;
create index idx_content_sources_domain on public.content_sources(domain);

-- RLS for content_sources
alter table public.content_sources enable row level security;

create policy "Anyone can view active content sources"
  on public.content_sources for select
  to anon, authenticated
  using (is_active = true);

create policy "Service role can manage content sources"
  on public.content_sources for all
  using (auth.role() = 'service_role');

-- =====================================================
-- 2. CONTENT_CATEGORIES TABLE
-- Multilingual content taxonomy
-- =====================================================

create table public.content_categories (
  id uuid primary key default gen_random_uuid(),
  
  -- Core Identity
  slug text not null unique, -- "ev-testing", "winter-reviews", "luxury-sedans"
  
  -- Multilingual Names (8 languages)
  name_en text not null,
  name_no text,
  name_de text,
  name_sv text,
  name_fr text,
  name_pl text,
  name_it text,
  name_es text,
  
  -- Hierarchy
  parent_id uuid references public.content_categories(id) on delete set null,
  
  -- Organization
  sort_order int not null default 0,
  is_active boolean not null default true,
  
  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for content_categories
create index idx_content_categories_slug on public.content_categories(slug);
create index idx_content_categories_parent on public.content_categories(parent_id);
create index idx_content_categories_active on public.content_categories(is_active) where is_active = true;

-- RLS for content_categories
alter table public.content_categories enable row level security;

create policy "Anyone can view active categories"
  on public.content_categories for select
  to anon, authenticated
  using (is_active = true);

create policy "Service role can manage categories"
  on public.content_categories for all
  using (auth.role() = 'service_role');

-- =====================================================
-- 3. CONTENT_ITEMS TABLE
-- Aggregated automotive content from all sources
-- =====================================================

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  
  -- Source Attribution
  source_id uuid not null references public.content_sources(id) on delete cascade,
  
  -- Content Classification
  content_type text not null check (content_type in (
    'article',
    'review',
    'comparison',
    'test',
    'ranking',
    'ownership',
    'launch',
    'ev_test',
    'winter_test',
    'track_test',
    'longterm',
    'reliability',
    'guide',
    'video',
    'mixed'
  )),
  
  -- Core Content
  title text not null,
  slug text not null, -- URL-friendly version of title
  description text,
  excerpt text, -- First 150-200 chars for previews
  
  -- Source & URL
  url text not null unique, -- Original article/video URL
  url_hash text not null unique, -- For deduplication: md5(url)
  thumbnail_url text,
  
  -- Attribution
  author text,
  published_at timestamptz not null,
  
  -- Localization
  language text not null default 'en' check (language in ('en', 'no', 'de', 'fr', 'sv', 'pl', 'it', 'es')),
  
  -- Taxonomy & Relations
  categories text[] default '{}', -- ['ev', 'winter-testing', 'family']
  car_slugs text[] default '{}', -- ['polestar-3', 'bmw-i5'] - related cars
  
  -- Flexible Metadata Storage
  -- Can store: viewCount, duration (for videos), word_count (for articles), etc.
  metadata jsonb default '{}'::jsonb,
  
  -- Quality & Curation
  quality_score int check (quality_score >= 0 and quality_score <= 100),
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  
  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Performance Indexes for content_items
create index idx_content_items_source on public.content_items(source_id);
create index idx_content_items_type_published on public.content_items(content_type, published_at desc);
create index idx_content_items_language_published on public.content_items(language, published_at desc);
create index idx_content_items_published on public.content_items(published_at desc);
create index idx_content_items_url_hash on public.content_items(url_hash);
create index idx_content_items_featured on public.content_items(is_featured) where is_featured = true;
create index idx_content_items_visible on public.content_items(is_visible) where is_visible = true;

-- GIN indexes for array columns (for fast "contains" queries)
create index idx_content_items_categories on public.content_items using gin(categories);
create index idx_content_items_car_slugs on public.content_items using gin(car_slugs);

-- Composite index for common query patterns
create index idx_content_items_lang_type_pub on public.content_items(language, content_type, published_at desc);

-- RLS for content_items
alter table public.content_items enable row level security;

create policy "Anyone can view visible content items"
  on public.content_items for select
  to anon, authenticated
  using (is_visible = true);

create policy "Service role can manage content items"
  on public.content_items for all
  using (auth.role() = 'service_role');

-- =====================================================
-- 4. HELPER FUNCTIONS
-- =====================================================

-- Function to generate URL hash for deduplication
create or replace function public.generate_url_hash(url_text text)
returns text
language plpgsql
as $$
begin
  return md5(lower(trim(url_text)));
end;
$$;

-- Trigger to auto-update url_hash before insert/update
create or replace function public.set_content_item_url_hash()
returns trigger
language plpgsql
as $$
begin
  NEW.url_hash := public.generate_url_hash(NEW.url);
  NEW.updated_at := now();
  return NEW;
end;
$$;

create trigger content_items_set_url_hash
  before insert or update on public.content_items
  for each row
  execute function public.set_content_item_url_hash();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  NEW.updated_at := now();
  return NEW;
end;
$$;

-- Apply updated_at trigger to all tables
create trigger content_sources_updated_at
  before update on public.content_sources
  for each row
  execute function public.update_updated_at_column();

create trigger content_categories_updated_at
  before update on public.content_categories
  for each row
  execute function public.update_updated_at_column();

-- =====================================================
-- 5. SEED DATA - Initial Content Sources
-- =====================================================

insert into public.content_sources (name, slug, domain, trust_score, languages, content_types, description, rss_feeds) values

-- Top Tier Global Publications
('Car and Driver', 'car-and-driver', 'caranddriver.com', 95, '{en}', '{article,review,comparison,test}', 'Leading American automotive magazine with expert reviews and testing.', '[]'::jsonb),
('Top Gear', 'top-gear', 'topgear.com', 95, '{en}', '{article,review,video}', 'World-renowned automotive entertainment and journalism.', '[]'::jsonb),
('MotorTrend', 'motortrend', 'motortrend.com', 95, '{en}', '{article,review,comparison,test,video}', 'Authoritative automotive testing and reviews.', '[]'::jsonb),
('Autocar', 'autocar', 'autocar.co.uk', 95, '{en}', '{article,review,test}', 'British automotive journalism with rigorous testing.', '[]'::jsonb),
('EVO', 'evo', 'evo.co.uk', 92, '{en}', '{article,review,track_test}', 'Performance car reviews and track testing.', '[]'::jsonb),

-- EV-Focused Publications
('Electrek', 'electrek', 'electrek.co', 90, '{en}', '{article,review,ev_test}', 'Leading electric vehicle news and reviews.', '[]'::jsonb),
('InsideEVs', 'insideevs', 'insideevs.com', 90, '{en}', '{article,review,ev_test,comparison}', 'Comprehensive EV coverage and testing.', '[]'::jsonb),

-- European Publications
('Auto Express', 'auto-express', 'autoexpress.co.uk', 90, '{en}', '{article,review,test}', 'UK automotive news and reviews.', '[]'::jsonb),
('What Car?', 'what-car', 'whatcar.com', 92, '{en}', '{article,review,guide}', 'British car buying guides and reviews.', '[]'::jsonb),
('Auto Bild', 'auto-bild', 'autobild.de', 90, '{de}', '{article,review,test}', 'Germany''s leading automotive publication.', '[]'::jsonb),
('Quattroruote', 'quattroruote', 'quattroruote.it', 88, '{it}', '{article,review,test}', 'Premier Italian automotive magazine.', '[]'::jsonb),
('Auto Świat', 'auto-swiat', 'autoswiat.pl', 85, '{pl}', '{article,review,test}', 'Poland''s leading automotive magazine.', '[]'::jsonb),
('Motor.es', 'motor-es', 'motor.es', 85, '{es}', '{article,review}', 'Spanish automotive news and reviews.', '[]'::jsonb),

-- Scandinavian
('Teknikens Värld', 'teknikens-varld', 'teknikensvarld.se', 92, '{sv}', '{article,review,test}', 'Swedish automotive testing and reviews.', '[]'::jsonb),
('Vi Bilägare', 'vi-bilagare', 'vibilagare.se', 90, '{sv}', '{article,review,test}', 'Swedish car ownership and testing.', '[]'::jsonb),

-- Enthusiast & Specialist
('Road & Track', 'road-and-track', 'roadandtrack.com', 92, '{en}', '{article,review,track_test}', 'Performance and enthusiast automotive journalism.', '[]'::jsonb),
('Hagerty', 'hagerty', 'hagerty.com', 88, '{en}', '{article,review,guide}', 'Classic and collector car expertise.', '[]'::jsonb),
('Jalopnik', 'jalopnik', 'jalopnik.com', 82, '{en}', '{article,review}', 'Automotive news and culture.', '[]'::jsonb);

-- =====================================================
-- 6. SEED DATA - Initial Content Categories
-- =====================================================

insert into public.content_categories (slug, name_en, name_no, name_de, name_sv, name_fr, name_pl, name_it, name_es, sort_order) values

-- Top-Level Categories
('reviews', 'Reviews', 'Anmeldelser', 'Bewertungen', 'Recensioner', 'Critiques', 'Recenzje', 'Recensioni', 'Reseñas', 10),
('comparisons', 'Comparisons', 'Sammenligninger', 'Vergleiche', 'Jämförelser', 'Comparaisons', 'Porównania', 'Confronti', 'Comparaciones', 20),
('ev-testing', 'EV Testing', 'EV-testing', 'EV-Tests', 'EV-testning', 'Tests VE', 'Testy EV', 'Test EV', 'Pruebas EV', 30),
('winter-testing', 'Winter Testing', 'Vintertesting', 'Wintertest', 'Vintertestning', 'Tests hivernaux', 'Testy zimowe', 'Test invernali', 'Pruebas de invierno', 40),
('track-testing', 'Track Testing', 'Banetesting', 'Track-Tests', 'Bantestning', 'Tests sur circuit', 'Testy torowe', 'Test in pista', 'Pruebas en circuito', 50),
('ownership', 'Ownership Reports', 'Eierrapporter', 'Erfahrungsberichte', 'Ägarrapporter', 'Rapports propriétaires', 'Raporty właścicieli', 'Rapporti di proprietà', 'Informes de propietarios', 60),
('guides', 'Buying Guides', 'Kjøpsguider', 'Kaufratgeber', 'Köpguider', 'Guides d''achat', 'Poradniki zakupowe', 'Guide all''acquisto', 'Guías de compra', 70),
('news', 'News', 'Nyheter', 'Nachrichten', 'Nyheter', 'Actualités', 'Aktualności', 'Notizie', 'Noticias', 80);

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
