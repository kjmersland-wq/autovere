import type { ArticleCategory, ArticleData } from "@/data/articles";

/**
 * Per-slug image overrides — hand-picked Unsplash photos chosen to match
 * the specific article topic. Falls back to the category POOL below when a
 * slug is not listed here.
 *
 * Photo IDs are the part after "photo-" in an Unsplash URL.
 */
const SLUG_OVERRIDES: Record<string, string> = {
  "ionity-gen2-chargers-rollout-2025": "1647500666543-0d6f1f7e0c3e", // charging canopy
  "real-world-winter-range-2025": "1517732306149-e8f829eb588a", // car in snowy nordic landscape
  "germany-ev-market-2025": "1467269204594-9661b134dd2b", // german city scene
  "sodium-ion-battery-2026-preview": "1620714223084-8fcacc6dfd8d", // battery cells / chemistry
  "fastned-expansion-nordics-2025": "1697470919265-d7e3d05fbf18", // fastned-style yellow charger
  "ev-depreciation-2025-data": "1554224155-6726b3ff858f", // financial chart / data
  "eu-2035-ice-ban-update": "1529107386315-e1a2ed48a620", // EU parliament style building
  "home-charging-installation-guide-2025": "1633332755192-727a05c4013d", // home wallbox / driveway
  "polestar-2-vs-model-3-2025": "1617704548623-340376564e68", // premium sedan EV
  "norway-ev-88-percent-2025": "1601999050923-7e62c8a13b80", // norwegian fjord road
  "ev-battery-degradation-real-data": "1620714223084-8fcacc6dfd8d", // battery cells
  "v2g-vehicle-to-grid-2025": "1473341304170-971dccb5ac1e", // power grid / pylons
  "tesla-supercharger-open-network-europe": "1560958089-b8a1929cea89", // tesla charging
  "skoda-enyaq-value-case-2025": "1606664515524-ed2f786a0bd6", // family SUV side profile
  "public-charging-reliability-europe-2025": "1558618047-3c8c76ca7d13", // multi-bay charging hub
};

/**
 * Curated Unsplash photo pools per editorial category. Selection is
 * deterministic (slug hash → pool index) so an article always shows the
 * same image. Used as fallback when a slug isn't in SLUG_OVERRIDES.
 *
 * All IDs verified against images.unsplash.com.
 */
const POOLS: Record<ArticleCategory, string[]> = {
  infrastructure: [
    "1593941707882-a5bba14938c7", // EV charging cable close-up
    "1558618047-3c8c76ca7d13",   // Multi-bay charging hub
    "1647500666543-0d6f1f7e0c3e", // Highway charging canopy
    "1697470919265-d7e3d05fbf18", // Fastned-style station
  ],
  technology: [
    "1620714223084-8fcacc6dfd8d", // Battery cells
    "1581092921461-39b2fc5c5870", // EV factory production line
    "1518770660439-4636190af475", // Electronics / hardware macro
    "1473341304170-971dccb5ac1e", // Power grid pylons
  ],
  market: [
    "1449824913935-59a10b8d2000", // European city at night
    "1488628176578-4fff5107a8e3", // German autobahn
    "1467269204594-9661b134dd2b", // European street scene
    "1486325212027-8081e485255e", // Modern urban architecture
  ],
  comparison: [
    "1494976388531-d1058494cdd8", // Premium EV on open road
    "1617704548623-340376564e68", // Modern electric sedan
    "1503376780353-7e6692767b70", // Luxury vehicle driving
    "1606664515524-ed2f786a0bd6", // SUV side profile
  ],
  ownership: [
    "1633332755192-727a05c4013d", // Home wallbox driveway
    "1554224155-6726b3ff858f",   // Financial chart
    "1460925895917-afdab827c52f", // Data analytics
    "1606664515524-ed2f786a0bd6", // Family SUV
  ],
  policy: [
    "1541888946425-d81bb19240f5", // European institutional building
    "1529107386315-e1a2ed48a620", // EU parliament style
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
  const override = SLUG_OVERRIDES[article.slug];
  if (override) return `${BASE}${override}?auto=format&fit=crop&w=${w}&q=80`;
  const pool = POOLS[article.category];
  const id = pool[slugHash(article.slug) % pool.length];
  return `${BASE}${id}?auto=format&fit=crop&w=${w}&q=80`;
}
