import type { ArticleCategory, ArticleData } from "@/data/articles";

// Curated Unsplash photo pools per editorial category.
// Each pool has 4 images so different articles within the same category get variety.
// Selection is deterministic (slug hash → pool index) so an article always shows the same image.
const POOLS: Record<ArticleCategory, string[]> = {
  infrastructure: [
    "1593941707882-a5bba14938c7", // EV charging cable close-up
    "1571987502227-9231b837d92a", // Modern fast-charging station
    "1558618047-3c8c76ca7d13",   // Multi-bay charging hub
    "1647890255875-1b5b6a0e0571", // Highway charging canopy
  ],
  technology: [
    "1558618666-fcd25c85cd64",   // Battery cell technology
    "1589293672001-5b5ef26e6b97", // EV battery module
    "1581092921461-39b2fc5c5870", // EV factory production line
    "1518770660439-4636190af475", // Electronics / hardware macro
  ],
  market: [
    "1449824913935-59a10b8d2000", // European city at night
    "1488628176578-4fff5107a8e3", // German autobahn
    "1467269204594-9661b134dd2b", // European street scene
    "1486325212027-8081e485255e", // Modern urban architecture
  ],
  comparison: [
    "1494976388531-d1058494cdd8", // Premium EV on open road
    "1617886322168-72b886573c35", // Modern electric car night
    "1503376780353-7e6692767b70", // Luxury vehicle driving
    "1549317661-bd32c8ce0db2",   // EV exterior detail
  ],
  ownership: [
    "1621600411688-4be93cd68504", // Home EV charging driveway
    "1551434678-e076c223a692",   // Smart home / lifestyle tech
    "1460925895917-afdab827c52f", // Financial data analytics
    "1561016444-14f747499547",   // Family SUV EV lifestyle
  ],
  policy: [
    "1541888946425-d81bb19240f5", // European institutional building
    "1529107386315-e1a2ed48a620", // Governmental / formal setting
    "1604328698692-f76ea9498e76", // Clean energy transition
    "1526304640581-d334cdbbf45e", // Policy documentation
  ],
};

function slugHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const BASE = "https://images.unsplash.com/photo-";

export function resolveArticleImage(article: ArticleData, w = 1200): string {
  if (article.media.url) return article.media.url;
  const pool = POOLS[article.category];
  const id = pool[slugHash(article.slug) % pool.length];
  return `${BASE}${id}?auto=format&fit=crop&w=${w}&q=80`;
}
