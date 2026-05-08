import { CARS, COLLECTIONS, PERSONALITIES, LEARN } from '../src/data/cars.ts';

const base = 'https://autovere.com';
const langs = ['en', 'no', 'de', 'sv', 'fr'] as const;
const DEFAULT = 'en';

const paths = [
  '/', '/cars', '/collections', '/personalities', '/learn', '/watch',
  '/pricing', '/contact', '/help', '/discover',
  '/legal/terms','/legal/privacy','/legal/cookies','/legal/refund','/legal/subscriptions',
];
CARS.forEach(c => paths.push('/cars/' + c.slug));
COLLECTIONS.forEach(c => paths.push('/collections/' + c.slug));
PERSONALITIES.forEach(p => paths.push('/personalities/' + p.slug));
LEARN.forEach(a => paths.push('/learn/' + a.slug));

const localize = (path: string, lang: string) => {
  if (path === '/') return lang === DEFAULT ? `${base}/` : `${base}/${lang}`;
  return lang === DEFAULT ? `${base}${path}` : `${base}/${lang}${path}`;
};

const today = new Date().toISOString().slice(0, 10);

const entries: string[] = [];
for (const path of paths) {
  for (const lang of langs) {
    const loc = localize(path, lang);
    const alternates = langs
      .map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${localize(path, l)}"/>`)
      .join('\n');
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${localize(path, DEFAULT)}"/>`;
    entries.push(
      `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n${alternates}\n${xDefault}\n  </url>`
    );
  }
}

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  entries.join('\n') +
  '\n</urlset>\n';

await Bun.write('public/sitemap.xml', xml);
console.log('wrote', entries.length, 'urls across', langs.length, 'languages');
