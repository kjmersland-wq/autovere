#!/usr/bin/env tsx

/**
 * AUTOVERE Translation Validation Tool
 * 
 * Validates translation completeness across all supported languages.
 * Detects missing keys, English fallbacks, and inconsistencies.
 * 
 * Run: npm run validate-translations
 */

import { SUPPORTED_LANGS, DEFAULT_LANG } from '../src/i18n/config';
import en from '../src/i18n/locales/en';

// Import all locale files
const locales: Record<string, any> = {
  en,
};

// Dynamically import other locales
async function loadLocales() {
  for (const lang of SUPPORTED_LANGS) {
    if (lang === DEFAULT_LANG) continue;
    try {
      const module = await import(`../src/i18n/locales/${lang}.ts`);
      locales[lang] = module.default;
    } catch (e) {
      console.error(`❌ Failed to load locale: ${lang}`);
    }
  }
}

function getAllKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

function getValueByPath(obj: any, path: string): any {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return current;
}

function isEnglishText(text: string): boolean {
  // Simple heuristic: check for common English words
  const englishPatterns = [
    /\b(the|a|an|is|are|was|were|be|have|has|do|does|will|would|should|could)\b/i,
    /\b(this|that|these|those|what|which|who|when|where|why|how)\b/i,
    /\b(can|cannot|may|might|must|shall|should|will|would)\b/i,
  ];
  
  return englishPatterns.some(pattern => pattern.test(text));
}

async function validateTranslations() {
  console.log('🔍 AUTOVERE Translation Validation\n');
  console.log(`Languages: ${SUPPORTED_LANGS.join(', ')}\n`);
  
  await loadLocales();
  
  const baseKeys = getAllKeys(en);
  console.log(`📊 Total translation keys in base (en): ${baseKeys.length}\n`);
  
  const results: Record<string, any> = {};
  
  for (const lang of SUPPORTED_LANGS) {
    if (lang === DEFAULT_LANG) continue;
    
    const locale = locales[lang];
    if (!locale) {
      console.log(`❌ ${lang.toUpperCase()}: Locale file not found\n`);
      continue;
    }
    
    const localeKeys = getAllKeys(locale);
    const missingKeys: string[] = [];
    const englishFallbacks: Array<{key: string, value: string}> = [];
    const extraKeys: string[] = [];
    
    // Check for missing keys
    for (const key of baseKeys) {
      const value = getValueByPath(locale, key);
      const enValue = getValueByPath(en, key);
      
      if (value === undefined) {
        missingKeys.push(key);
      } else if (typeof value === 'string' && typeof enValue === 'string') {
        // Check if translation is identical to English (potential untranslated)
        if (value === enValue && value.length > 3) {
          englishFallbacks.push({ key, value });
        } else if (lang !== 'en' && isEnglishText(value) && value.length > 20) {
          // Check for English-looking text in non-English locales
          englishFallbacks.push({ key, value });
        }
      }
    }
    
    // Check for extra keys not in base
    for (const key of localeKeys) {
      if (!baseKeys.includes(key)) {
        extraKeys.push(key);
      }
    }
    
    const totalKeys = baseKeys.length;
    const translatedKeys = totalKeys - missingKeys.length - englishFallbacks.length;
    const completeness = ((translatedKeys / totalKeys) * 100).toFixed(1);
    
    results[lang] = {
      total: totalKeys,
      translated: translatedKeys,
      missing: missingKeys.length,
      englishFallbacks: englishFallbacks.length,
      extra: extraKeys.length,
      completeness,
      missingKeys,
      englishFallbacks,
      extraKeys,
    };
    
    // Print summary
    const status = parseFloat(completeness) >= 95 ? '✅' : parseFloat(completeness) >= 70 ? '⚠️' : '🔴';
    console.log(`${status} ${lang.toUpperCase()}: ${completeness}% complete`);
    console.log(`   Translated: ${translatedKeys}/${totalKeys}`);
    console.log(`   Missing: ${missingKeys.length}`);
    console.log(`   English fallbacks: ${englishFallbacks.length}`);
    if (extraKeys.length > 0) {
      console.log(`   Extra keys: ${extraKeys.length}`);
    }
    console.log('');
  }
  
  // Print detailed report
  console.log('\n📋 DETAILED REPORT\n');
  console.log('='.repeat(80));
  
  for (const lang of SUPPORTED_LANGS) {
    if (lang === DEFAULT_LANG) continue;
    
    const result = results[lang];
    if (!result) continue;
    
    console.log(`\n${lang.toUpperCase()} - ${result.completeness}% Complete\n`);
    
    if (result.missing > 0) {
      console.log(`Missing Keys (${result.missing}):`);
      result.missingKeys.slice(0, 10).forEach((key: string) => {
        console.log(`  - ${key}`);
      });
      if (result.missing > 10) {
        console.log(`  ... and ${result.missing - 10} more`);
      }
      console.log('');
    }
    
    if (result.englishFallbacks.length > 0) {
      console.log(`Potential English Fallbacks (${result.englishFallbacks.length}):`);
      result.englishFallbacks.slice(0, 5).forEach((item: any) => {
        console.log(`  - ${item.key}: "${item.value.substring(0, 60)}..."`);
      });
      if (result.englishFallbacks.length > 5) {
        console.log(`  ... and ${result.englishFallbacks.length - 5} more`);
      }
      console.log('');
    }
    
    if (result.extra > 0) {
      console.log(`Extra Keys (${result.extra}):`);
      result.extraKeys.slice(0, 5).forEach((key: string) => {
        console.log(`  - ${key}`);
      });
      if (result.extra > 5) {
        console.log(`  ... and ${result.extra - 5} more`);
      }
      console.log('');
    }
  }
  
  // Print summary table
  console.log('\n📊 SUMMARY TABLE\n');
  console.log('Language | Completeness | Translated | Missing | English Fallbacks');
  console.log('-'.repeat(80));
  
  for (const lang of SUPPORTED_LANGS) {
    if (lang === DEFAULT_LANG) continue;
    
    const result = results[lang];
    if (!result) continue;
    
    const langPadded = lang.toUpperCase().padEnd(8);
    const completePadded = `${result.completeness}%`.padEnd(12);
    const translatedPadded = `${result.translated}/${result.total}`.padEnd(10);
    const missingPadded = result.missing.toString().padEnd(7);
    const fallbacksPadded = result.englishFallbacks.toString();
    
    console.log(`${langPadded} | ${completePadded} | ${translatedPadded} | ${missingPadded} | ${fallbacksPadded}`);
  }
  
  console.log('\n✅ Validation complete\n');
  
  // Exit with error if any language is below 70% complete
  const criticalIssues = Object.values(results).some((r: any) => parseFloat(r.completeness) < 70);
  if (criticalIssues) {
    console.log('⚠️  WARNING: Some languages have critical translation gaps (< 70% complete)\n');
    process.exit(1);
  }
}

validateTranslations().catch(console.error);
