import { CARS, COLLECTIONS, PERSONALITIES, LEARN } from '../src/data/cars.ts';
const base = 'https://autovere.com';
const urls = ['/', '/cars', '/collections', '/personalities', '/learn', '/watch',
  '/pricing', '/contact', '/help', '/discover',
  '/legal/terms','/legal/privacy','/legal/cookies','/legal/refund','/legal/subscriptions'];
CARS.forEach(c => urls.push('/cars/' + c.slug));
COLLECTIONS.forEach(c => urls.push('/collections/' + c.slug));
PERSONALITIES.forEach(p => urls.push('/personalities/' + p.slug));
LEARN.forEach(a => urls.push('/learn/' + a.slug));
const today = new Date().toISOString().slice(0,10);
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => `  <url><loc>${base}${u}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq></url>`).join('\n') +
  '\n</urlset>\n';
await Bun.write('public/sitemap.xml', xml);
console.log('wrote', urls.length);
