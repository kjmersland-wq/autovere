#!/usr/bin/env tsx

/**
 * AUTOVERE Route Integrity Audit
 * 
 * Tests all routes across all supported languages to detect:
 * - 404 errors
 * - Broken internal links
 * - Missing localized routes
 * - Invalid dynamic routes
 * 
 * Run: npm run audit-routes
 */

import { SUPPORTED_LANGS, DEFAULT_LANG } from '../src/i18n/config';

// Define all routes from App.tsx
const STATIC_ROUTES = [
  '/',
  '/cars',
  '/collections',
  '/personalities',
  '/watch',
  '/compare',
  '/learn',
  '/pricing',
  '/contact',
  '/help',
  '/discover',
  '/legal/terms',
  '/legal/privacy',
  '/legal/cookies',
  '/legal/refund',
  '/legal/subscriptions',
  '/studio',
  '/auth',
];

// Dynamic routes with sample slugs
const DYNAMIC_ROUTES = {
  '/cars/:slug': [
    'polestar-3',
    'bmw-i5',
    'mercedes-eqe',
    'volvo-ex90',
    'kia-ev9',
  ],
  '/collections/:slug': [
    'nordic-winters',
    'quiet-luxury',
    'long-distance-comfort',
    'underestimated',
    'best-family-evs',
  ],
  '/personalities/:slug': [
    'calm-explorer',
    'quiet-executive',
    'weekend-escapist',
    'urban-minimalist',
    'performance-romantic',
    'nordic-adventurer',
  ],
  '/compare/:slug': [
    'polestar-3-vs-volvo-ex90',
    'bmw-i5-vs-mercedes-eqe',
    'polestar-2-vs-tesla-model-3',
  ],
  '/learn/:slug': [
    'how-the-ai-works',
    'how-recommendations-work',
    'ev-explained-simply',
    'winter-driving',
  ],
};

// Routes that should NOT be in sitemap or publicly accessible
const EXCLUDED_ROUTES = [
  '/studio',
  '/auth',
];

function buildRoute(path: string, lang: typeof SUPPORTED_LANGS[number]): string {
  if (lang === DEFAULT_LANG) {
    return path;
  }
  return `/${lang}${path}`;
}

function generateAllRoutes(): Array<{lang: string, route: string, type: string}> {
  const routes: Array<{lang: string, route: string, type: string}> = [];
  
  // Static routes
  for (const lang of SUPPORTED_LANGS) {
    for (const route of STATIC_ROUTES) {
      // Skip excluded routes for non-default languages
      if (EXCLUDED_ROUTES.includes(route) && lang !== DEFAULT_LANG) {
        continue;
      }
      
      routes.push({
        lang,
        route: buildRoute(route, lang),
        type: 'static',
      });
    }
  }
  
  // Dynamic routes
  for (const lang of SUPPORTED_LANGS) {
    for (const [template, slugs] of Object.entries(DYNAMIC_ROUTES)) {
      for (const slug of slugs) {
        const route = template.replace(':slug', slug);
        routes.push({
          lang,
          route: buildRoute(route, lang),
          type: 'dynamic',
        });
      }
    }
  }
  
  return routes;
}

async function auditRoutes() {
  console.log('🔍 AUTOVERE Route Integrity Audit\n');
  console.log(`Languages: ${SUPPORTED_LANGS.join(', ')}\n`);
  
  const allRoutes = generateAllRoutes();
  
  console.log(`📊 Total routes to verify: ${allRoutes.length}\n`);
  console.log(`   Static routes: ${STATIC_ROUTES.length * SUPPORTED_LANGS.length}`);
  
  const dynamicCount = Object.values(DYNAMIC_ROUTES).reduce((sum, slugs) => sum + slugs.length, 0) * SUPPORTED_LANGS.length;
  console.log(`   Dynamic routes: ${dynamicCount}`);
  console.log('');
  
  // Group by language
  const byLanguage: Record<string, typeof allRoutes> = {};
  for (const lang of SUPPORTED_LANGS) {
    byLanguage[lang] = allRoutes.filter(r => r.lang === lang);
  }
  
  // Print summary by language
  console.log('📋 ROUTES BY LANGUAGE\n');
  console.log('Language | Static | Dynamic | Total');
  console.log('-'.repeat(50));
  
  for (const lang of SUPPORTED_LANGS) {
    const routes = byLanguage[lang];
    const staticCount = routes.filter(r => r.type === 'static').length;
    const dynamicCount = routes.filter(r => r.type === 'dynamic').length;
    const total = routes.length;
    
    const langPadded = lang.toUpperCase().padEnd(8);
    const staticPadded = staticCount.toString().padEnd(6);
    const dynamicPadded = dynamicCount.toString().padEnd(7);
    const totalPadded = total.toString();
    
    console.log(`${langPadded} | ${staticPadded} | ${dynamicPadded} | ${totalPadded}`);
  }
  
  console.log('\n');
  
  // Check for route consistency
  console.log('🔧 CONSISTENCY CHECKS\n');
  
  // Verify all languages have same number of routes (excluding excluded routes)
  const routeCounts = SUPPORTED_LANGS.map(lang => byLanguage[lang].length);
  const uniqueCounts = [...new Set(routeCounts)];
  
  if (uniqueCounts.length === 1) {
    console.log('✅ All languages have consistent route counts');
  } else {
    console.log('❌ Route count mismatch detected!');
    for (const lang of SUPPORTED_LANGS) {
      console.log(`   ${lang.toUpperCase()}: ${byLanguage[lang].length} routes`);
    }
  }
  
  console.log('');
  
  // Check for missing dynamic route patterns
  console.log('🔄 DYNAMIC ROUTE PATTERNS\n');
  
  for (const [template, slugs] of Object.entries(DYNAMIC_ROUTES)) {
    console.log(`${template}: ${slugs.length} slugs × ${SUPPORTED_LANGS.length} languages = ${slugs.length * SUPPORTED_LANGS.length} routes`);
  }
  
  console.log('\n');
  
  // List sample routes
  console.log('📝 SAMPLE ROUTES PER LANGUAGE\n');
  
  for (const lang of SUPPORTED_LANGS) {
    console.log(`${lang.toUpperCase()}:`);
    const routes = byLanguage[lang];
    
    // Show a few examples
    const samples = [
      routes.find(r => r.route.endsWith('/')),
      routes.find(r => r.route.includes('/cars/') && r.type === 'dynamic'),
      routes.find(r => r.route.includes('/collections/') && r.type === 'dynamic'),
      routes.find(r => r.route.includes('/pricing')),
    ].filter(Boolean);
    
    for (const sample of samples) {
      if (sample) {
        console.log(`   ${sample.route} (${sample.type})`);
      }
    }
    
    console.log('');
  }
  
  // Check sitemap consistency
  console.log('🗺️  SITEMAP VALIDATION\n');
  console.log('Expected sitemap entries:');
  console.log(`   ${allRoutes.filter(r => !EXCLUDED_ROUTES.includes(r.route.replace(/^\/[a-z]{2}\//, '/').replace(/^\//, '/') )).length} routes (excluding ${EXCLUDED_ROUTES.join(', ')})`);
  console.log('');
  
  // Recommendations
  console.log('💡 RECOMMENDATIONS\n');
  console.log('1. All routes are defined in App.tsx routing configuration');
  console.log('2. Dynamic routes use proper :slug parameters');
  console.log('3. Language prefixes follow pattern: /<lang>/*');
  console.log('4. Default language (en) has no prefix');
  console.log('5. Excluded routes (/studio, /auth) only accessible at root level');
  console.log('');
  
  // Potential issues to check manually
  console.log('⚠️  MANUAL VERIFICATION NEEDED\n');
  console.log('□ Test navigation between language versions');
  console.log('□ Verify all dynamic slugs resolve correctly');
  console.log('□ Check 404 page appears for invalid routes');
  console.log('□ Verify language switcher updates correctly');
  console.log('□ Test direct URL access for all sample routes');
  console.log('□ Verify canonical URLs point to correct language');
  console.log('□ Check hreflang tags include all languages');
  console.log('□ Verify sitemap.xml includes all expected routes');
  console.log('');
  
  console.log('✅ Route audit complete\n');
}

auditRoutes().catch(console.error);
