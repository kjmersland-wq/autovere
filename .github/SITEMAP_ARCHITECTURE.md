# AUTOVERE Sitemap Architecture

## Overview

AUTOVERE's sitemap is now **dynamically generated** during the build process, ensuring:

✅ **All 8 languages** included (en, no, de, sv, fr, pl, it, es)  
✅ **Automatic inclusion** of new content (cars, collections, personalities, articles)  
✅ **Proper hreflang** tags for international SEO  
✅ **x-default** pointing to English  
✅ **Scalable** for future growth  
✅ **Zero manual maintenance** required

---

## Critical Improvements

### Before (Manual Static Sitemap):
- ❌ Only 4 languages (missing fr, pl, it, es)
- ❌ 1843 lines of hardcoded XML
- ❌ Required manual updates for every new car/article
- ❌ ~460 URLs
- ❌ Outdated hreflang (only 4 languages)
- ❌ High risk of human error
- ❌ Not scalable

### After (Automated Dynamic Sitemap):
- ✅ All 8 languages supported
- ✅ Generated from data files automatically
- ✅ **760 URLs** (65% increase in coverage)
- ✅ Complete hreflang coverage (9 tags per URL: 8 languages + x-default)
- ✅ Zero manual maintenance
- ✅ Scalable architecture
- ✅ Auto-runs on every build

---

## Architecture

### Generation Script

Location: `scripts/generate-sitemap.ts`

**Runs automatically** as part of the build process:
```bash
npm run build
# Executes: npm run generate-sitemap && vite build
```

**Manual generation** (for testing):
```bash
npm run generate-sitemap
```

### Data Sources

The sitemap generator reads from:

1. **Language Config** (`src/i18n/config.ts`)
   - `SUPPORTED_LANGS` array (source of truth for languages)
   
2. **Car Data** (`src/data/cars.ts`)
   - `CARS` array (39 cars × 8 languages = 312 URLs)
   
3. **Collections** (`src/data/cars.ts`)
   - `COLLECTIONS` array (10 collections × 8 languages = 80 URLs)
   
4. **Personalities** (`src/data/cars.ts`)
   - `PERSONALITIES` array (6 personalities × 8 languages = 48 URLs)
   
5. **Learn Articles** (`src/data/cars.ts`)
   - `LEARN` array (9 articles × 8 languages = 72 URLs)
   
6. **Static Routes** (hardcoded in generator)
   - Homepage, pricing, watch, help, contact, etc.
   - 16 routes × 8 languages = 128 URLs
   
7. **Comparison Pages** (generated)
   - car-vs-car format
   - 15 comparisons × 8 languages = 120 URLs

**Total**: 760 URLs

---

## URL Structure

### Language Prefixes

Each route exists in 8 language versions:

```
English (default):  https://autovere.com/cars/polestar-3
Norwegian:          https://autovere.com/no/cars/polestar-3
German:             https://autovere.com/de/cars/polestar-3
Swedish:            https://autovere.com/sv/cars/polestar-3
French:             https://autovere.com/fr/cars/polestar-3
Polish:             https://autovere.com/pl/cars/polestar-3
Italian:            https://autovere.com/it/cars/polestar-3
Spanish:            https://autovere.com/es/cars/polestar-3
```

### Hreflang Implementation

Every URL includes alternates for all 8 languages **+ x-default**:

```xml
<url>
  <loc>https://autovere.com/cars/polestar-3</loc>
  <lastmod>2026-05-07</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
  <xhtml:link rel="alternate" hreflang="en" href="https://autovere.com/cars/polestar-3"/>
  <xhtml:link rel="alternate" hreflang="no" href="https://autovere.com/no/cars/polestar-3"/>
  <xhtml:link rel="alternate" hreflang="de" href="https://autovere.com/de/cars/polestar-3"/>
  <xhtml:link rel="alternate" hreflang="sv" href="https://autovere.com/sv/cars/polestar-3"/>
  <xhtml:link rel="alternate" hreflang="fr" href="https://autovere.com/fr/cars/polestar-3"/>
  <xhtml:link rel="alternate" hreflang="pl" href="https://autovere.com/pl/cars/polestar-3"/>
  <xhtml:link rel="alternate" hreflang="it" href="https://autovere.com/it/cars/polestar-3"/>
  <xhtml:link rel="alternate" hreflang="es" href="https://autovere.com/es/cars/polestar-3"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="https://autovere.com/cars/polestar-3"/>
</url>
```

---

## SEO Best Practices

### ✅ Implemented

1. **Proper hreflang tags** - Every URL has all language alternates
2. **x-default fallback** - Points to English version
3. **No duplicate content** - Each language has unique URL prefix
4. **Canonical URLs** - Implicit via hreflang
5. **lastmod dates** - Auto-updated to current date on generation
6. **changefreq hints** - Optimized per content type
7. **priority values** - Homepage (1.0), cars (0.9), other (0.8-0.7)
8. **Valid XML** - Proper escaping and structure
9. **Robots.txt reference** - Points to sitemap location
10. **Excluded routes** - /studio and /auth not in sitemap

### robots.txt

```
User-agent: *
Allow: /
Disallow: /studio
Disallow: /auth

Sitemap: https://autovere.com/sitemap.xml
```

---

## Adding New Content

### New Car

1. Add car to `src/data/cars.ts` → `CARS` array
2. Run build → sitemap auto-updates with 8 new URLs (one per language)

### New Collection

1. Add collection to `src/data/cars.ts` → `COLLECTIONS` array
2. Run build → sitemap auto-updates with 8 new URLs

### New Language

1. Add language to `src/i18n/config.ts` → `SUPPORTED_LANGS`
2. Add route in `src/App.tsx`
3. Create locale file in `src/i18n/locales/`
4. Run build → sitemap auto-updates with all routes in new language

**No manual sitemap editing required!**

---

## Maintenance

### Automatic

The sitemap **regenerates automatically** on every production build:

```bash
npm run build
```

This ensures:
- New content is always included
- Language list stays synchronized
- Dates are always current
- No manual intervention needed

### Manual Trigger

For testing or preview:

```bash
npm run generate-sitemap
```

Output: `public/sitemap.xml`

---

## Validation

### Google Search Console

1. Upload sitemap: `https://autovere.com/sitemap.xml`
2. Monitor indexing status
3. Check for errors/warnings
4. Verify coverage for all 8 languages

### Manual Validation

```bash
# Count URLs
grep -c "<url>" public/sitemap.xml
# Should be: 760

# Verify all languages present
grep -c 'hreflang="pl"' public/sitemap.xml
# Should be: 760

# Verify x-default
grep -c 'hreflang="x-default"' public/sitemap.xml
# Should be: 760

# Check XML validity
xmllint --noout public/sitemap.xml
```

---

## Performance

### File Size

- **Current**: ~811 KB
- **Gzipped**: ~45 KB (estimated)
- **Well within** Google's 50 MB limit
- **760 URLs** vs. Google's 50,000 URL limit per sitemap

### Build Time

- Sitemap generation: **< 1 second**
- Negligible impact on total build time
- Runs before Vite build step

---

## Future Enhancements

### Potential Additions

1. **Image sitemap** - For car gallery images
2. **Video sitemap** - For YouTube reviews
3. **News sitemap** - If blog/news section is added
4. **Sitemap index** - If URL count exceeds 10,000
5. **Dynamic lastmod** - From Git commit dates or CMS

### Scalability

Current architecture supports:
- **Up to 50,000 URLs** per sitemap (Google limit)
- **Unlimited languages** (just add to SUPPORTED_LANGS)
- **Dynamic content** from Supabase (future integration)
- **Sitemap index** for multiple sitemaps if needed

---

## Troubleshooting

### Sitemap not updating?

```bash
# Regenerate manually
npm run generate-sitemap

# Check output
cat public/sitemap.xml | head -50
```

### Missing language in sitemap?

1. Check `src/i18n/config.ts` → `SUPPORTED_LANGS` includes language
2. Check `src/App.tsx` → route exists for language
3. Regenerate sitemap
4. Verify in output

### Build failing?

```bash
# Check TypeScript errors
npx tsc --noEmit

# Run generator standalone
npm run generate-sitemap
```

---

## References

- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [hreflang Implementation](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Sitemap XML Format](https://www.sitemaps.org/protocol.html)

---

**Last updated**: 2026-05-07  
**Sitemap version**: 2.0 (Automated)  
**Total URLs**: 760  
**Languages**: 8 (en, no, de, sv, fr, pl, it, es)
