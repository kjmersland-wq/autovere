import type { ArticleCategory, ArticleData } from "@/data/articles";

/**
 * Per-slug image overrides — hand-picked Unsplash photos chosen to match
 * each specific article topic. All IDs verified against images.unsplash.com.
 * Falls back to the category POOL below when a slug is not listed.
 */
const SLUG_OVERRIDES: Record<string, string> = {
  "ionity-gen2-chargers-rollout-2025": "1571987502227-9231b837d92a", // fast-charging station
  "real-world-winter-range-2025": "1517732306149-e8f829eb588a", // snowy nordic road
  "germany-ev-market-2025": "1467269204594-9661b134dd2b", // european street scene
  "sodium-ion-battery-2026-preview": "1620714223084-8fcacc6dfd8d", // battery cells
  "fastned-expansion-nordics-2025": "1593941707882-a5bba14938c7", // EV charging cable
  "ev-depreciation-2025-data": "1554224155-6726b3ff858f", // financial chart
  "eu-2035-ice-ban-update": "1529107386315-e1a2ed48a620", // EU parliament style
  "home-charging-installation-guide-2025": "1633332755192-727a05c4013d", // home wallbox
  "polestar-2-vs-model-3-2025": "1617704548623-340376564e68", // premium sedan EV
  "norway-ev-88-percent-2025": "1517732306149-e8f829eb588a", // nordic landscape
  "ev-battery-degradation-real-data": "1518770660439-4636190af475", // electronics macro
  "v2g-vehicle-to-grid-2025": "1473341304170-971dccb5ac1e", // power grid pylons
  "tesla-supercharger-open-network-europe": "1560958089-b8a1929cea89", // tesla supercharger
  "skoda-enyaq-value-case-2025": "1606664515524-ed2f786a0bd6", // family SUV
  "public-charging-reliability-europe-2025": "1632823469850-2f77dd9c7f93", // multi-bay station
};

/**
 * Curated Unsplash photo pools per editorial category. Selection is
 * deterministic (slug hash → pool index) so an article always shows the
 * same image. Used as fallback when a slug isn't in SLUG_OVERRIDES.
 *
 * All IDs verified working.
 */
const POOLS: Record<ArticleCategory, string[]> = {
  infrastructure: [
    "1593941707882-a5bba14938c7", // EV charging cable
    "1571987502227-9231b837d92a", // fast-charging station
    "1632823469850-2f77dd9c7f93", // multi-bay station
    "1560958089-b8a1929cea89",   // tesla supercharger
  ],
  technology: [
    "1620714223084-8fcacc6dfd8d", // battery cells
    "1518770660439-4636190af475", // electronics macro
    "1473341304170-971dccb5ac1e", // power grid pylons
    "1607252650355-f7fd0460ccdb", // tech detail
  ],
  market: [
    "1449824913935-59a10b8d2000", // european city at night
    "1467269204594-9661b134dd2b", // european street
    "1486325212027-8081e485255e", // modern architecture
    "1460925895917-afdab827c52f", // data analytics
  ],
  comparison: [
    "1494976388531-d1058494cdd8", // premium EV on open road
    "1617704548623-340376564e68", // modern electric sedan
    "1503376780353-7e6692767b70", // luxury vehicle driving
    "1617886322168-72b886573c35", // modern EV night
  ],
  ownership: [
    "1633332755192-727a05c4013d", // home wallbox
    "1554224155-6726b3ff858f",   // financial chart
    "1551434678-e076c223a692",   // smart home tech
    "1606664515524-ed2f786a0bd6", // family SUV
  ],
  policy: [
    "1541888946425-d81bb19240f5", // european institutional building
    "1529107386315-e1a2ed48a620", // EU parliament style
    "1604328698692-f76ea9498e76", // clean energy transition
    "1526304640581-d334cdbbf45e", // policy documentation
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
