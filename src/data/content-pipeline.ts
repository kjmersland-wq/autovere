/**
 * Content Pipeline Architecture
 *
 * Defines the type system for automated content ingestion, normalization,
 * duplicate detection and source trust scoring. English-first for now;
 * locale variants are reserved in interfaces for future multilingual rollout.
 */

// ---------------------------------------------------------------------------
// Source registry
// ---------------------------------------------------------------------------

export type SourceFormat = "rss" | "atom" | "api" | "html" | "json" | "manual";
export type SourceCategory = "oem-press" | "charging-network" | "market-data" | "industry-news" | "youtube" | "government" | "research";

export interface ContentSource {
  id: string;
  name: string;
  homepage: string;
  feedUrl?: string;
  format: SourceFormat;
  category: SourceCategory;
  trustScore: number;
  language: string;
  active: boolean;
  requiresAuth: boolean;
  rateLimit?: { requestsPerHour: number };
  lastChecked?: string;
  notes?: string;
}

export const TRUSTED_SOURCES: ContentSource[] = [
  {
    id: "ionity-press",
    name: "Ionity Press",
    homepage: "https://ionity.eu/en/news",
    format: "html",
    category: "charging-network",
    trustScore: 98,
    language: "en",
    active: true,
    requiresAuth: false,
  },
  {
    id: "fastned-press",
    name: "Fastned Press",
    homepage: "https://investor.fastned.nl/news",
    format: "html",
    category: "charging-network",
    trustScore: 97,
    language: "en",
    active: true,
    requiresAuth: false,
  },
  {
    id: "tesla-press",
    name: "Tesla Newsroom",
    homepage: "https://www.tesla.com/en_eu/blog",
    format: "html",
    category: "oem-press",
    trustScore: 95,
    language: "en",
    active: true,
    requiresAuth: false,
  },
  {
    id: "hyundai-press",
    name: "Hyundai Motor Group Newsroom",
    homepage: "https://www.hyundainewsroom.com",
    format: "html",
    category: "oem-press",
    trustScore: 94,
    language: "en",
    active: true,
    requiresAuth: false,
  },
  {
    id: "vw-group-press",
    name: "Volkswagen Group Newsroom",
    homepage: "https://www.volkswagen-group.com/en/press-releases",
    format: "rss",
    category: "oem-press",
    trustScore: 94,
    language: "en",
    active: true,
    requiresAuth: false,
  },
  {
    id: "bmw-press",
    name: "BMW Group PressClub",
    homepage: "https://www.press.bmwgroup.com",
    format: "html",
    category: "oem-press",
    trustScore: 94,
    language: "en",
    active: true,
    requiresAuth: false,
  },
  {
    id: "polestar-press",
    name: "Polestar Newsroom",
    homepage: "https://media.polestar.com",
    format: "html",
    category: "oem-press",
    trustScore: 93,
    language: "en",
    active: true,
    requiresAuth: false,
  },
  {
    id: "acea-press",
    name: "ACEA — European Automobile Manufacturers' Association",
    homepage: "https://www.acea.auto/news",
    format: "rss",
    category: "industry-news",
    trustScore: 96,
    language: "en",
    active: true,
    requiresAuth: false,
  },
  {
    id: "ev-volumes",
    name: "EV-Volumes",
    homepage: "https://www.ev-volumes.com",
    format: "html",
    category: "market-data",
    trustScore: 91,
    language: "en",
    active: true,
    requiresAuth: false,
  },
  {
    id: "eu-commission-transport",
    name: "European Commission — Transport",
    homepage: "https://transport.ec.europa.eu/news",
    format: "rss",
    category: "government",
    trustScore: 99,
    language: "en",
    active: true,
    requiresAuth: false,
  },
  {
    id: "electrek",
    name: "Electrek",
    homepage: "https://electrek.co",
    feedUrl: "https://electrek.co/feed",
    format: "rss",
    category: "industry-news",
    trustScore: 82,
    language: "en",
    active: false,
    requiresAuth: false,
    notes: "High volume — filter to Europe-relevant content only before ingesting",
  },
  {
    id: "pushevs",
    name: "PushEVs",
    homepage: "https://pushevs.com",
    feedUrl: "https://pushevs.com/feed",
    format: "rss",
    category: "market-data",
    trustScore: 85,
    language: "en",
    active: false,
    requiresAuth: false,
    notes: "Sales data focused — excellent for market intelligence articles",
  },
  {
    id: "youtube-bjorn-nyland",
    name: "Bjørn Nyland (YouTube)",
    homepage: "https://www.youtube.com/@BjornNyland",
    format: "api",
    category: "youtube",
    trustScore: 90,
    language: "en",
    active: false,
    requiresAuth: true,
    rateLimit: { requestsPerHour: 50 },
    notes: "Real-world range tests, Norwegian perspective",
  },
  {
    id: "youtube-out-of-spec",
    name: "Out of Spec Reviews (YouTube)",
    homepage: "https://www.youtube.com/@OutofSpecReviews",
    format: "api",
    category: "youtube",
    trustScore: 88,
    language: "en",
    active: false,
    requiresAuth: true,
    rateLimit: { requestsPerHour: 50 },
    notes: "In-depth ownership analysis, charging speed tests",
  },
  {
    id: "youtube-fully-charged",
    name: "Fully Charged Show (YouTube)",
    homepage: "https://www.youtube.com/@FullyChargedShow",
    format: "api",
    category: "youtube",
    trustScore: 87,
    language: "en",
    active: false,
    requiresAuth: true,
    rateLimit: { requestsPerHour: 50 },
    notes: "UK/European perspective, broad EV coverage",
  },
];

// ---------------------------------------------------------------------------
// Ingestion types
// ---------------------------------------------------------------------------

export type ContentProcessingStatus =
  | "queued"
  | "fetching"
  | "normalizing"
  | "deduplicating"
  | "tagging"
  | "matching"
  | "categorizing"
  | "scoring"
  | "ready"
  | "rejected"
  | "published";

export interface RawContentItem {
  id: string;
  sourceId: string;
  fetchedAt: string;
  rawTitle: string;
  rawBody: string;
  rawUrl: string;
  rawAuthor?: string;
  rawPublishedAt?: string;
  rawImageUrl?: string;
  rawTags?: string[];
  language: string;
  status: ContentProcessingStatus;
}

export interface NormalizedContentItem {
  id: string;
  sourceId: string;
  sourceTrustScore: number;
  title: string;
  summary: string;
  body: string[];
  url: string;
  publishedAt: string;
  language: string;
  detectedCategory: string;
  detectedTags: string[];
  matchedVehicles: string[];
  matchedNetworks: string[];
  duplicateOf?: string;
  similarTo?: string[];
  contentHash: string;
  status: ContentProcessingStatus;
}

// ---------------------------------------------------------------------------
// Duplicate detection
// ---------------------------------------------------------------------------

export interface DuplicateSignal {
  contentHash: string;
  titleFingerprint: string;
  publishedAt: string;
  sourceId: string;
}

export function buildTitleFingerprint(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .sort()
    .join("-");
}

// ---------------------------------------------------------------------------
// Source trust utilities
// ---------------------------------------------------------------------------

export function getSourceTrustScore(sourceId: string): number {
  return TRUSTED_SOURCES.find((s) => s.id === sourceId)?.trustScore ?? 50;
}

export function getActiveSources(category?: SourceCategory): ContentSource[] {
  return TRUSTED_SOURCES.filter(
    (s) => s.active && (!category || s.category === category)
  );
}

export function getTrustTier(score: number): "verified" | "trusted" | "monitored" | "unverified" {
  if (score >= 95) return "verified";
  if (score >= 85) return "trusted";
  if (score >= 70) return "monitored";
  return "unverified";
}

// ---------------------------------------------------------------------------
// Content tagging — keyword-to-category mappings for auto-categorization
// ---------------------------------------------------------------------------

export const AUTO_TAG_RULES: { pattern: RegExp; tags: string[] }[] = [
  { pattern: /ionity|fastned|supercharger|chargepoint|shell recharge|bp pulse/i, tags: ["charging network", "infrastructure"] },
  { pattern: /winter|cold|\-\d+.?c|snow|freeze|frost|heat pump/i, tags: ["winter range", "cold weather"] },
  { pattern: /range|wltp|real.?world|km|mile|battery capacity/i, tags: ["range", "battery"] },
  { pattern: /depreciation|residual|resale|trade.in|value/i, tags: ["depreciation", "tco"] },
  { pattern: /subsid|grant|incentiv|vat exemp|tax credit/i, tags: ["policy", "incentives"] },
  { pattern: /sodium.?ion|solid.?state|lfp|nmc|nca|chemistry/i, tags: ["battery technology"] },
  { pattern: /norway|sweden|denmark|finland|nordic/i, tags: ["nordic", "norway", "europe"] },
  { pattern: /germany|deutschland|german/i, tags: ["Germany", "Europe"] },
  { pattern: /v2g|vehicle.to.grid|bidirectional/i, tags: ["V2G", "grid"] },
  { pattern: /ota|software|update|fsd|autopilot|android auto/i, tags: ["software", "technology"] },
  { pattern: /route|trip|journey|cross.border|motorway/i, tags: ["long-distance", "route planning"] },
];

export function autoTagContent(title: string, body: string): string[] {
  const text = `${title} ${body}`;
  const tags = new Set<string>();
  for (const rule of AUTO_TAG_RULES) {
    if (rule.pattern.test(text)) rule.tags.forEach((t) => tags.add(t));
  }
  return [...tags];
}

// ---------------------------------------------------------------------------
// Locale preparation — English-first; reserved for future multilingual rollout
// ---------------------------------------------------------------------------

export type SupportedLocale = "en" | "no" | "de" | "sv" | "fr" | "pl" | "it" | "es";

export interface LocalizedContentVariant {
  locale: SupportedLocale;
  title: string;
  summary: string;
  status: "draft" | "translated" | "reviewed" | "published";
  translatedAt?: string;
  translatorNotes?: string;
}

export interface MultilocaleContent {
  slug: string;
  canonical: LocalizedContentVariant;
  variants: Partial<Record<SupportedLocale, LocalizedContentVariant>>;
}
