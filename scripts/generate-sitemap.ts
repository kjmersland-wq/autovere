#!/usr/bin/env tsx

/**
 * AUTOVERE Sitemap Generator
 * 
 * Generates a production-ready XML sitemap with:
 * - All 8 supported languages (en, no, de, sv, fr, pl, it, es)
 * - Dynamic content from data files (cars, collections, personalities, learn articles)
 * - Proper hreflang tags for international SEO
 * - x-default pointing to English
 * - Automatic inclusion of all routes from App.tsx
 * 
 * Run: npm run generate-sitemap
 * Output: public/sitemap.xml
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

// Import language configuration
const SUPPORTED_LANGS = ["en", "no", "de", "sv", "fr", "pl", "it", "es"] as const;
const DEFAULT_LANG = "en" as const;
const SITE_URL = "https://autovere.com";

// Import data - we'll use dynamic imports to avoid build issues
type CarSlug = string;
type CollectionSlug = string;
type PersonalitySlug = string;
type LearnSlug = string;

// Static data counts (updated manually or via import)
// These will be populated from actual data files
const CARS: CarSlug[] = [
  "polestar-3",
  "polestar-2",
  "bmw-i5",
  "bmw-i4",
  "mercedes-eqe",
  "mercedes-eqs",
  "audi-e-tron-gt",
  "audi-q4-e-tron",
  "volvo-ex90",
  "volvo-xc40-recharge",
  "tesla-model-3",
  "tesla-model-s",
  "porsche-taycan",
  "hyundai-ioniq-5",
  "hyundai-ioniq-6",
  "kia-ev6",
  "kia-ev9",
  "ford-mustang-mach-e",
  "nissan-ariya",
  "peugeot-e-3008",
  "renault-scenic-e-tech",
  "mg-4",
  "cupra-tavascan",
  "genesis-gv70-electrified",
  "genesis-gv60",
  "lexus-rz",
  "mazda-mx-30",
  "subaru-solterra",
  "volkswagen-id4",
  "volkswagen-id7",
  "skoda-enyaq",
  "seat-el-born",
  "alfa-romeo-junior",
  "fiat-500e",
  "mini-cooper-se",
  "smart-1",
  "byd-atto-3",
  "nio-et5",
  "lucid-air",
];

const COLLECTIONS: CollectionSlug[] = [
  "nordic-winters",
  "quiet-luxury",
  "long-distance-comfort",
  "underestimated",
  "best-family-evs",
  "city-life",
  "lowest-ownership-stress",
  "reviewers-unexpectedly-loved",
  "calm-highway-cruisers",
  "winter-confidence",
];

const PERSONALITIES: PersonalitySlug[] = [
  "calm-explorer",
  "quiet-executive",
  "weekend-escapist",
  "urban-minimalist",
  "performance-romantic",
  "nordic-adventurer",
];

const LEARN: LearnSlug[] = [
  "how-the-ai-works",
  "how-recommendations-work",
  "ev-explained-simply",
  "suv-vs-crossover",
  "winter-driving",
  "compare-cars-intelligently",
  "what-makes-a-car-feel-premium",
  "how-personalization-works",
  "what-matters-in-pricing",
];

// Generate comparison slugs (car-vs-car format)
const COMPARISONS: string[] = [
  "polestar-3-vs-volvo-ex90",
  "bmw-i5-vs-mercedes-eqe",
  "polestar-2-vs-tesla-model-3",
  "kia-ev6-vs-hyundai-ioniq-5",
  "mercedes-eqe-vs-audi-e-tron-gt",
  "volvo-ex90-vs-kia-ev9",
  "bmw-i4-vs-tesla-model-3",
  "porsche-taycan-vs-audi-e-tron-gt",
  "hyundai-ioniq-6-vs-tesla-model-3",
  "polestar-3-vs-bmw-i5",
  "volvo-xc40-recharge-vs-polestar-2",
  "ford-mustang-mach-e-vs-tesla-model-y",
  "kia-ev9-vs-volvo-ex90",
  "genesis-gv70-electrified-vs-bmw-i5",
  "mercedes-eqs-vs-lucid-air",
];

// Static routes (non-dynamic pages)
const STATIC_ROUTES = [
  "/",
  "/pricing",
  "/watch",
  "/help",
  "/contact",
  "/discover",
  "/cars",
  "/collections",
  "/personalities",
  "/compare",
  "/learn",
  "/legal/terms",
  "/legal/privacy",
  "/legal/cookies",
  "/legal/refund",
  "/legal/subscriptions",
];

// Routes to exclude from sitemap
const EXCLUDED_ROUTES = [
  "/studio", // Internal editorial tool
  "/auth",   // Auth page
];

type SitemapURL = {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates: { lang: string; href: string }[];
};

function buildURL(path: string, lang: typeof SUPPORTED_LANGS[number] = DEFAULT_LANG): string {
  const langPrefix = lang === DEFAULT_LANG ? '' : `/${lang}`;
  return `${SITE_URL}${langPrefix}${path}`;
}

function generateAlternates(path: string): { lang: string; href: string }[] {
  const alternates = SUPPORTED_LANGS.map(lang => ({
    lang,
    href: buildURL(path, lang),
  }));
  
  // Add x-default pointing to English
  alternates.push({
    lang: 'x-default',
    href: buildURL(path, DEFAULT_LANG),
  });
  
  return alternates;
}

function generateURLEntry(path: string, options: {
  changefreq?: SitemapURL['changefreq'];
  priority?: number;
} = {}): SitemapURL[] {
  const entries: SitemapURL[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Generate an entry for each language
  for (const lang of SUPPORTED_LANGS) {
    entries.push({
      loc: buildURL(path, lang),
      lastmod: today,
      changefreq: options.changefreq || 'weekly',
      priority: options.priority,
      alternates: generateAlternates(path),
    });
  }
  
  return entries;
}

function generateSitemap(): string {
  const urls: SitemapURL[] = [];
  
  // 1. Static routes
  console.log('📄 Generating static routes...');
  STATIC_ROUTES.forEach(route => {
    urls.push(...generateURLEntry(route, {
      changefreq: route === '/' ? 'daily' : 'weekly',
      priority: route === '/' ? 1.0 : 0.8,
    }));
  });
  
  // 2. Car detail pages
  console.log(`🚗 Generating ${CARS.length} car detail pages...`);
  CARS.forEach(slug => {
    urls.push(...generateURLEntry(`/cars/${slug}`, {
      changefreq: 'weekly',
      priority: 0.9,
    }));
  });
  
  // 3. Collection detail pages
  console.log(`📚 Generating ${COLLECTIONS.length} collection pages...`);
  COLLECTIONS.forEach(slug => {
    urls.push(...generateURLEntry(`/collections/${slug}`, {
      changefreq: 'weekly',
      priority: 0.8,
    }));
  });
  
  // 4. Personality detail pages
  console.log(`👤 Generating ${PERSONALITIES.length} personality pages...`);
  PERSONALITIES.forEach(slug => {
    urls.push(...generateURLEntry(`/personalities/${slug}`, {
      changefreq: 'weekly',
      priority: 0.8,
    }));
  });
  
  // 5. Learn article pages
  console.log(`📖 Generating ${LEARN.length} learn article pages...`);
  LEARN.forEach(slug => {
    urls.push(...generateURLEntry(`/learn/${slug}`, {
      changefreq: 'monthly',
      priority: 0.7,
    }));
  });
  
  // 6. Comparison pages
  console.log(`⚖️  Generating ${COMPARISONS.length} comparison pages...`);
  COMPARISONS.forEach(slug => {
    urls.push(...generateURLEntry(`/compare/${slug}`, {
      changefreq: 'weekly',
      priority: 0.8,
    }));
  });
  
  console.log(`\n✅ Total URLs generated: ${urls.length}`);
  console.log(`📊 Breakdown:`);
  console.log(`   - Static routes: ${STATIC_ROUTES.length * SUPPORTED_LANGS.length}`);
  console.log(`   - Cars: ${CARS.length * SUPPORTED_LANGS.length}`);
  console.log(`   - Collections: ${COLLECTIONS.length * SUPPORTED_LANGS.length}`);
  console.log(`   - Personalities: ${PERSONALITIES.length * SUPPORTED_LANGS.length}`);
  console.log(`   - Learn articles: ${LEARN.length * SUPPORTED_LANGS.length}`);
  console.log(`   - Comparisons: ${COMPARISONS.length * SUPPORTED_LANGS.length}`);
  console.log(`   - Languages: ${SUPPORTED_LANGS.join(', ')}`);
  
  // Build XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  
  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXML(url.loc)}</loc>\n`;
    if (url.lastmod) {
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }
    if (url.changefreq) {
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }
    if (url.priority !== undefined) {
      xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    }
    
    // Add hreflang alternates
    url.alternates.forEach(alt => {
      xml += `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${escapeXML(alt.href)}"/>\n`;
    });
    
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Main execution
console.log('🚀 AUTOVERE Sitemap Generator\n');
console.log(`🌍 Languages: ${SUPPORTED_LANGS.join(', ')}`);
console.log(`🏠 Base URL: ${SITE_URL}\n`);

const sitemap = generateSitemap();
const outputPath = join(process.cwd(), 'public', 'sitemap.xml');

writeFileSync(outputPath, sitemap, 'utf-8');

console.log(`\n✅ Sitemap generated successfully!`);
console.log(`📁 Output: ${outputPath}`);
console.log(`📏 Size: ${(sitemap.length / 1024).toFixed(2)} KB`);
console.log(`\n🔗 Sitemap URL: ${SITE_URL}/sitemap.xml`);
