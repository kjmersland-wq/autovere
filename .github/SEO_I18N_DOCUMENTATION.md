# SEO & Internationalization Technical Documentation

## Overview

AUTOVERE's SEO implementation automatically handles multilingual content with proper hreflang tags, canonical URLs, and locale metadata.

## Supported Languages

As of this implementation, AUTOVERE supports **8 languages**:

1. **English (en)** - Default language
2. **Norwegian (no)** - Norsk
3. **German (de)** - Deutsch
4. **Swedish (sv)** - Svenska
5. **French (fr)** - Français
6. **Polish (pl)** - Polski ⭐ NEW
7. **Italian (it)** - Italiano ⭐ NEW
8. **Spanish (es)** - Español ⭐ NEW

## URL Structure

### Language-Specific URLs

Each language (except English default) uses a language prefix:

```
English (default):  https://autovere.com/
                   https://autovere.com/pricing
                   https://autovere.com/cars/polestar-4

Norwegian:         https://autovere.com/no/
                   https://autovere.com/no/pricing
                   https://autovere.com/no/cars/polestar-4

Polish:            https://autovere.com/pl/
                   https://autovere.com/pl/pricing
                   https://autovere.com/pl/cars/polestar-4

Italian:           https://autovere.com/it/
                   https://autovere.com/it/pricing
                   https://autovere.com/it/cars/polestar-4

Spanish:           https://autovere.com/es/
                   https://autovere.com/es/pricing
                   https://autovere.com/es/cars/polestar-4
```

## Automatic SEO Tag Generation

### Hreflang Tags

The `SEO.tsx` component automatically generates hreflang tags for **all supported languages**:

```html
<!-- Automatically generated for every page -->
<link rel="alternate" hreflang="en" href="https://autovere.com/pricing" />
<link rel="alternate" hreflang="no" href="https://autovere.com/no/pricing" />
<link rel="alternate" hreflang="de" href="https://autovere.com/de/pricing" />
<link rel="alternate" hreflang="sv" href="https://autovere.com/sv/pricing" />
<link rel="alternate" hreflang="fr" href="https://autovere.com/fr/pricing" />
<link rel="alternate" hreflang="pl" href="https://autovere.com/pl/pricing" />
<link rel="alternate" hreflang="it" href="https://autovere.com/it/pricing" />
<link rel="alternate" hreflang="es" href="https://autovere.com/es/pricing" />
<link rel="alternate" hreflang="x-default" href="https://autovere.com/pricing" />
```

### Implementation

From `src/components/SEO.tsx`:

```typescript
// hreflang for all supported languages + x-default
document
  .querySelectorAll('link[rel="alternate"][hreflang]')
  .forEach((n) => n.remove());
SUPPORTED_LANGS.forEach((l) => setLink("alternate", buildLocalized(path, l), l));
setLink("alternate", buildLocalized(path, DEFAULT_LANG), "x-default");
```

**Key Point:** Adding languages to `SUPPORTED_LANGS` in `config.ts` automatically updates:
- Hreflang tags
- Language switcher
- Routing
- All i18n infrastructure

## Canonical URLs

Canonical URLs automatically adjust based on the current language:

```html
<!-- English page -->
<link rel="canonical" href="https://autovere.com/pricing" />

<!-- Polish page -->
<link rel="canonical" href="https://autovere.com/pl/pricing" />

<!-- Italian page -->
<link rel="canonical" href="https://autovere.com/it/pricing" />
```

## Open Graph Metadata

Locale-aware Open Graph tags:

```html
<!-- For Polish page -->
<meta property="og:locale" content="pl" />
<meta property="og:url" content="https://autovere.com/pl/pricing" />

<!-- For Italian page -->
<meta property="og:locale" content="it" />
<meta property="og:url" content="https://autovere.com/it/pricing" />
```

## Routing Configuration

### App.tsx Routes

```tsx
<Routes>
  {/* Localized routes — same tree mounted under each language prefix */}
  <Route path="/en/*" element={<AppRoutes />} />
  <Route path="/no/*" element={<AppRoutes />} />
  <Route path="/de/*" element={<AppRoutes />} />
  <Route path="/sv/*" element={<AppRoutes />} />
  <Route path="/fr/*" element={<AppRoutes />} />
  <Route path="/pl/*" element={<AppRoutes />} />
  <Route path="/it/*" element={<AppRoutes />} />
  <Route path="/es/*" element={<AppRoutes />} />
  {/* Default (English) at root */}
  <Route path="/*" element={<AppRoutes />} />
</Routes>
```

**Each language prefix mounts the exact same route tree**, ensuring URL parity across all locales.

## Language Detection

From `src/i18n/routing.tsx`:

```typescript
export const detectLangFromPath = (pathname: string): Lang => {
  const seg = pathname.split("/").filter(Boolean)[0];
  if (seg && (SUPPORTED_LANGS as readonly string[]).includes(seg)) 
    return seg as Lang;
  return DEFAULT_LANG;
};
```

Detection order:
1. Check first URL segment (`/pl/pricing` → `pl`)
2. If not a valid language, default to `en`

## Language Switcher

From `src/components/LanguageSwitcher.tsx`:

The language switcher automatically shows all 8 languages by iterating over `SUPPORTED_LANGS`:

```tsx
{SUPPORTED_LANGS.map((l) => (
  <DropdownMenuItem key={l} onClick={() => switchTo(l)}>
    {LANG_LABELS[l]}
  </DropdownMenuItem>
))}
```

## SEO Best Practices Implemented

### ✅ No Duplicate Content Issues

- **Canonical tags** point to the correct language version
- **Hreflang tags** tell search engines about language variants
- **Each language has unique URLs** with proper prefixes

### ✅ Proper International Targeting

```html
<!-- Tells Google: Polish version exists at /pl/ -->
<link rel="alternate" hreflang="pl" href="https://autovere.com/pl/" />

<!-- Tells Google: Italian version exists at /it/ -->
<link rel="alternate" hreflang="it" href="https://autovere.com/it/" />

<!-- Tells Google: Default/fallback is English -->
<link rel="alternate" hreflang="x-default" href="https://autovere.com/" />
```

### ✅ Search Engine Indexing

Each language version:
- Has its own `<title>` tag (from translated locale files)
- Has its own `<meta name="description">` (from translated locale files)
- Uses proper `lang` attribute on `<html>` (via LangSync component)
- Gets indexed separately by Google/Bing

## Adding Future Languages

To add a new language (e.g., Portuguese):

1. **Update `src/i18n/config.ts`:**
   ```typescript
   export const SUPPORTED_LANGS = ["en", "no", "de", "sv", "fr", "pl", "it", "es", "pt"] as const;
   
   export const LANG_LABELS: Record<Lang, string> = {
     // ... existing
     pt: "Português",
   };
   
   import pt from "./locales/pt";
   // Add to resources
   ```

2. **Update `src/App.tsx`:**
   ```tsx
   <Route path="/pt/*" element={<AppRoutes />} />
   ```

3. **Create `src/i18n/locales/pt.ts`** with translations

4. **No SEO changes needed** - hreflang, canonical, routing all update automatically!

## Verification Checklist

When new languages are added, verify:

- [ ] Build passes without TypeScript errors
- [ ] Language appears in switcher dropdown
- [ ] URL `/[lang]/pricing` renders correctly
- [ ] View page source: hreflang tags include new language
- [ ] View page source: canonical URL uses correct language prefix
- [ ] View page source: og:locale matches language
- [ ] Google Search Console: No duplicate content warnings
- [ ] All translated strings appear (no English fallbacks)

## Related Files

- `src/i18n/config.ts` - Language configuration
- `src/i18n/routing.tsx` - URL routing and language detection
- `src/i18n/LangSync.tsx` - Syncs i18n with route changes
- `src/components/SEO.tsx` - Automatic SEO tag generation
- `src/components/LanguageSwitcher.tsx` - Language dropdown
- `src/App.tsx` - Route definitions

## Notes

- **Dynamic by design:** Most SEO infrastructure uses `SUPPORTED_LANGS` array
- **Single source of truth:** Update `config.ts` to add languages everywhere
- **No manual hreflang editing:** Tags auto-generate from config
- **Locale files fully independent:** Each can be updated without affecting others
- **English is special:** Root path (`/`) points to English, not `/en/`

---

**Last updated:** 2026-05-07  
**Languages supported:** 8 (en, no, de, sv, fr, pl, it, es)
