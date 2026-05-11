import type { ArticleData, ArticleCategory } from "@/data/articles";

export interface ArticleScore {
  slug: string;
  total: number;
  freshness: number;
  trending: number;
  evRelevance: number;
  winterRelevance: number;
  chargingRelevance: number;
  ownershipImpact: number;
  europeanRelevance: number;
  longRangeRelevance: number;
}

const FRESHNESS_HALF_LIFE_DAYS = 90;

function daysSince(dateStr: string, now: Date): number {
  return (now.getTime() - new Date(dateStr).getTime()) / 86_400_000;
}

function freshnessScore(dateStr: string, now: Date): number {
  const d = daysSince(dateStr, now);
  return Math.max(0, Math.round(100 * Math.pow(2, -d / FRESHNESS_HALF_LIFE_DAYS)));
}

const CATEGORY_BASE: Record<ArticleCategory, number> = {
  infrastructure: 85,
  technology: 80,
  market: 75,
  comparison: 70,
  ownership: 68,
  policy: 60,
};

const WINTER_TAGS = ["winter", "cold", "heat pump", "snow", "temperature", "range loss", "nordic"];
const CHARGING_TAGS = ["charging", "ionity", "fastned", "supercharger", "infrastructure", "fast charging", "dc", "v2g", "kw", "wallbox"];
const OWNERSHIP_TAGS = ["tco", "depreciation", "ownership", "cost", "residual", "finance", "home charging", "value", "insurance"];
const EV_TAGS = ["ev", "electric", "battery", "range", "bev", "kwh", "wltp", "sodium", "degradation"];
const EUROPEAN_TAGS = ["europe", "norway", "germany", "france", "eu", "nordic", "sweden", "uk", "netherlands", "european"];
const LONG_RANGE_TAGS = ["range", "long-distance", "motorway", "highway", "route", "wltp", "real-world range", "efficiency"];

function tagScore(tags: string[], targets: string[]): number {
  const lower = tags.map((t) => t.toLowerCase());
  const hits = targets.filter((t) => lower.some((tag) => tag.includes(t) || t.includes(tag)));
  return Math.min(100, hits.length * 28);
}

export function scoreArticle(article: ArticleData, now: Date = new Date()): ArticleScore {
  const freshness = freshnessScore(article.publishedAt, now);
  const base = CATEGORY_BASE[article.category] ?? 60;
  const trending = Math.min(100, Math.round(base * 0.6 + freshness * 0.4));

  const evRelevance = Math.min(100, tagScore(article.tags, EV_TAGS) + article.relatedVehicles.length * 8);
  const winterRelevance = tagScore(article.tags, WINTER_TAGS);
  const chargingRelevance = Math.min(100, tagScore(article.tags, CHARGING_TAGS) + article.relatedNetworks.length * 18);
  const ownershipImpact = Math.min(100, tagScore(article.tags, OWNERSHIP_TAGS) + (article.category === "ownership" ? 35 : 0));
  const europeanRelevance = Math.min(100, tagScore(article.tags, EUROPEAN_TAGS) + 20);
  const longRangeRelevance = tagScore(article.tags, LONG_RANGE_TAGS);

  const total = Math.round(
    freshness * 0.22 +
    trending * 0.18 +
    evRelevance * 0.18 +
    europeanRelevance * 0.12 +
    chargingRelevance * 0.10 +
    ownershipImpact * 0.10 +
    (winterRelevance + longRangeRelevance) * 0.05
  );

  return { slug: article.slug, total, freshness, trending, evRelevance, winterRelevance, chargingRelevance, ownershipImpact, europeanRelevance, longRangeRelevance };
}

export function rankArticles(
  articles: ArticleData[],
  by: keyof Omit<ArticleScore, "slug"> = "total",
  now: Date = new Date()
): { article: ArticleData; score: ArticleScore }[] {
  return articles
    .map((a) => ({ article: a, score: scoreArticle(a, now) }))
    .sort((a, b) => b.score[by] - a.score[by]);
}

function topBy(
  articles: ArticleData[],
  by: keyof Omit<ArticleScore, "slug">,
  n: number,
  minScore = 1,
  now: Date = new Date()
): ArticleData[] {
  return rankArticles(articles, by, now)
    .filter((r) => r.score[by] >= minScore)
    .slice(0, n)
    .map((r) => r.article);
}

export const getTrending = (a: ArticleData[], n = 4, now = new Date()) => topBy(a, "trending", n, 1, now);
export const getChargingUpdates = (a: ArticleData[], n = 3, now = new Date()) => topBy(a, "chargingRelevance", n, 20, now);
export const getOwnershipPicks = (a: ArticleData[], n = 3, now = new Date()) => topBy(a, "ownershipImpact", n, 20, now);
export const getWinterRelevant = (a: ArticleData[], n = 3, now = new Date()) => topBy(a, "winterRelevance", n, 20, now);
export const getLongRangeTests = (a: ArticleData[], n = 3, now = new Date()) => topBy(a, "longRangeRelevance", n, 20, now);
export const getMostImportant = (a: ArticleData[], n = 5, now = new Date()) => topBy(a, "total", n, 1, now);

export interface HomepageSections {
  mostImportant: ArticleData | null;
  trending: ArticleData[];
  chargingUpdates: ArticleData[];
  ownershipPicks: ArticleData[];
  winterReady: ArticleData[];
  longRangeTests: ArticleData[];
}

export function buildHomepageSections(articles: ArticleData[], now: Date = new Date()): HomepageSections {
  const important = getMostImportant(articles, 1, now);
  return {
    mostImportant: important[0] ?? null,
    trending: getTrending(articles, 4, now),
    chargingUpdates: getChargingUpdates(articles, 3, now),
    ownershipPicks: getOwnershipPicks(articles, 3, now),
    winterReady: getWinterRelevant(articles, 3, now),
    longRangeTests: getLongRangeTests(articles, 3, now),
  };
}
