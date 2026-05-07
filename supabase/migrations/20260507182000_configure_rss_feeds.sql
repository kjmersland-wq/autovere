-- =====================================================
-- Configure RSS Feeds for Trusted Sources
-- Phase 3: Add RSS/Atom feed URLs to seeded sources
-- =====================================================

-- Update Car and Driver
update public.content_sources
set rss_feeds = '[
  {"url": "https://www.caranddriver.com/rss/all.xml/", "language": "en", "category": "all", "enabled": true}
]'::jsonb
where slug = 'car-and-driver';

-- Update Top Gear  
update public.content_sources
set rss_feeds = '[
  {"url": "https://www.topgear.com/feed", "language": "en", "category": "all", "enabled": true}
]'::jsonb
where slug = 'top-gear';

-- Update MotorTrend
update public.content_sources
set rss_feeds = '[
  {"url": "https://www.motortrend.com/feed/", "language": "en", "category": "all", "enabled": true}
]'::jsonb
where slug = 'motortrend';

-- Update Autocar
update public.content_sources
set rss_feeds = '[
  {"url": "https://www.autocar.co.uk/rss", "language": "en", "category": "all", "enabled": true}
]'::jsonb
where slug = 'autocar';

-- Update EVO
update public.content_sources
set rss_feeds = '[
  {"url": "https://www.evo.co.uk/rss", "language": "en", "category": "all", "enabled": true}
]'::jsonb
where slug = 'evo';

-- Update Electrek
update public.content_sources
set rss_feeds = '[
  {"url": "https://electrek.co/feed/", "language": "en", "category": "ev", "enabled": true}
]'::jsonb
where slug = 'electrek';

-- Update InsideEVs
update public.content_sources
set rss_feeds = '[
  {"url": "https://insideevs.com/feed/", "language": "en", "category": "ev", "enabled": true}
]'::jsonb
where slug = 'insideevs';

-- Update Auto Express
update public.content_sources
set rss_feeds = '[
  {"url": "https://www.autoexpress.co.uk/feed", "language": "en", "category": "all", "enabled": true}
]'::jsonb
where slug = 'auto-express';

-- Update What Car?
update public.content_sources
set rss_feeds = '[
  {"url": "https://www.whatcar.com/feed/", "language": "en", "category": "all", "enabled": true}
]'::jsonb
where slug = 'what-car';

-- Update Auto Bild (German)
update public.content_sources
set rss_feeds = '[
  {"url": "https://www.autobild.de/rss/neueste-artikel/", "language": "de", "category": "all", "enabled": true}
]'::jsonb
where slug = 'auto-bild';

-- Update Quattroruote (Italian)
update public.content_sources
set rss_feeds = '[
  {"url": "https://www.quattroruote.it/feed", "language": "it", "category": "all", "enabled": true}
]'::jsonb
where slug = 'quattroruote';

-- Update Auto Świat (Polish)
update public.content_sources
set rss_feeds = '[
  {"url": "https://www.auto-swiat.pl/rss", "language": "pl", "category": "all", "enabled": true}
]'::jsonb
where slug = 'auto-swiat';

-- Update Motor.es (Spanish)
update public.content_sources
set rss_feeds = '[
  {"url": "https://www.motor.es/rss", "language": "es", "category": "all", "enabled": true}
]'::jsonb
where slug = 'motor-es';

-- Update Teknikens Värld (Swedish)
update public.content_sources
set rss_feeds = '[
  {"url": "https://teknikensvarld.se/feed/", "language": "sv", "category": "all", "enabled": true}
]'::jsonb
where slug = 'teknikens-varld';

-- Update Vi Bilägare (Swedish)
update public.content_sources
set rss_feeds = '[
  {"url": "https://www.vibilagare.se/rss", "language": "sv", "category": "all", "enabled": true}
]'::jsonb
where slug = 'vi-bilagare';

-- Update Road & Track
update public.content_sources
set rss_feeds = '[
  {"url": "https://www.roadandtrack.com/rss/all.xml/", "language": "en", "category": "all", "enabled": true}
]'::jsonb
where slug = 'road-and-track';

-- Update Hagerty
update public.content_sources
set rss_feeds = '[
  {"url": "https://www.hagerty.com/media/feed/", "language": "en", "category": "all", "enabled": true}
]'::jsonb
where slug = 'hagerty';

-- Update Jalopnik
update public.content_sources
set rss_feeds = '[
  {"url": "https://jalopnik.com/rss", "language": "en", "category": "all", "enabled": true}
]'::jsonb
where slug = 'jalopnik';

-- =====================================================
-- MIGRATION COMPLETE
-- All 17 sources now have RSS feeds configured
-- =====================================================
