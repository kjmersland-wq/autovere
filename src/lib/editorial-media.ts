import type { ArticleCategory, ArticleData, MediaAttribution } from "@/data/articles";

type MediaCandidate = {
  id: string;
  source: string;
  sourceUrl: string;
  license: string;
  attribution: string;
  baseUrl: string;
  alt: string;
  gradient: string;
  categories: ArticleCategory[];
  tags: string[];
  vehicles?: string[];
  networks?: string[];
  countries?: string[];
};

const CANDIDATES: MediaCandidate[] = [
  {
    id: "tesla-supercharger-night",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/5fNmWej4tAA",
    license: "Unsplash License",
    attribution: "Photo by CHUTTERSNAP on Unsplash",
    baseUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf",
    alt: "Tesla-style high-power charging station at dusk",
    gradient: "from-red-950 to-rose-950",
    categories: ["infrastructure"],
    tags: ["tesla", "supercharger", "charging", "infrastructure", "hpc"],
    networks: ["tesla-supercharger", "ionity"],
    countries: ["norway", "sweden", "denmark", "germany"],
  },
  {
    id: "ionity-highway-corridor",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/m3m-lnR90uM",
    license: "Unsplash License",
    attribution: "Photo by Alejandro Luengo on Unsplash",
    baseUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    alt: "European motorway EV charging corridor scene",
    gradient: "from-cyan-950 to-blue-950",
    categories: ["infrastructure", "market"],
    tags: ["ionity", "fastned", "recharge", "motorway", "corridor", "charging"],
    networks: ["ionity", "fastned", "recharge"],
    countries: ["norway", "germany", "france", "netherlands"],
  },
  {
    id: "bmw-ev-studio",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/HN-5Z6AmxrM",
    license: "Unsplash License",
    attribution: "Photo by Patrick Langwallner on Unsplash",
    baseUrl: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982",
    alt: "Premium European electric sedan in studio light",
    gradient: "from-indigo-950 to-violet-950",
    categories: ["comparison", "market"],
    tags: ["bmw", "mercedes", "volkswagen", "porsche", "premium", "ev"],
    vehicles: ["bmw-i5", "volkswagen-id-7"],
  },
  {
    id: "nordic-winter-road",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/7H77FWkK_x4",
    license: "Unsplash License",
    attribution: "Photo by Tim Foster on Unsplash",
    baseUrl: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66",
    alt: "Electric car route through Nordic winter conditions",
    gradient: "from-slate-900 to-blue-950",
    categories: ["comparison", "ownership", "market"],
    tags: ["winter", "snow", "norway", "cold", "range"],
    countries: ["norway", "sweden", "finland"],
  },
  {
    id: "battery-lab-closeup",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/3MAmj1ZKSZA",
    license: "Unsplash License",
    attribution: "Photo by ThisisEngineering on Unsplash",
    baseUrl: "https://images.unsplash.com/photo-1581092335397-9fa341108fdb",
    alt: "Battery engineering and EV energy system detail",
    gradient: "from-violet-950 to-indigo-950",
    categories: ["technology"],
    tags: ["battery", "technology", "sodium", "degradation", "engineering"],
  },
  {
    id: "eu-policy-brussels",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/B6JINerWMz0",
    license: "Unsplash License",
    attribution: "Photo by Guillaume Périgois on Unsplash",
    baseUrl: "https://images.unsplash.com/photo-1543357480-c60d400e2ef9",
    alt: "European Parliament district representing EU transport policy",
    gradient: "from-blue-950 to-indigo-950",
    categories: ["policy"],
    tags: ["eu", "policy", "regulation", "brussels", "europe"],
    countries: ["belgium", "france", "germany", "poland", "spain", "italy"],
  },
  {
    id: "home-charging-wallbox",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/u3ajSXhZM_U",
    license: "Unsplash License",
    attribution: "Photo by Possessed Photography on Unsplash",
    baseUrl: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b",
    alt: "Residential EV wallbox charging setup",
    gradient: "from-teal-950 to-cyan-950",
    categories: ["ownership", "infrastructure"],
    tags: ["home charging", "wallbox", "ownership", "charging"],
  },
  {
    id: "market-factory-line",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/jFCViYFYcus",
    license: "Unsplash License",
    attribution: "Photo by Maxim Hopman on Unsplash",
    baseUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    alt: "Electric vehicle production and market supply chain scene",
    gradient: "from-emerald-950 to-slate-950",
    categories: ["market", "technology"],
    tags: ["market", "production", "supply", "european", "oem"],
  },
  {
    id: "charging-urban-night",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/2AovfzYV3rc",
    license: "Unsplash License",
    attribution: "Photo by CHUTTERSNAP on Unsplash",
    baseUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
    alt: "Urban high-power charging at night",
    gradient: "from-cyan-950 to-slate-950",
    categories: ["infrastructure", "ownership"],
    tags: ["charging", "city", "network", "infrastructure"],
  },
  {
    id: "long-range-europe-route",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/sA3wymYqyaI",
    license: "Unsplash License",
    attribution: "Photo by Claudio Schwarz on Unsplash",
    baseUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    alt: "Long-distance EV road trip through Europe",
    gradient: "from-zinc-900 to-slate-900",
    categories: ["comparison", "ownership", "market"],
    tags: ["route", "long-distance", "motorway", "europe"],
  },
];

const FALLBACK_BY_CATEGORY: Record<ArticleCategory, { gradient: string; alt: string }> = {
  infrastructure: { gradient: "from-cyan-950 to-blue-950", alt: "European EV charging infrastructure overview" },
  technology: { gradient: "from-violet-950 to-indigo-950", alt: "Electric vehicle technology visual" },
  market: { gradient: "from-emerald-950 to-slate-950", alt: "European electric vehicle market scene" },
  ownership: { gradient: "from-amber-950 to-slate-950", alt: "Electric vehicle ownership and cost intelligence" },
  policy: { gradient: "from-blue-950 to-indigo-950", alt: "European EV policy and regulation context" },
  comparison: { gradient: "from-slate-950 to-violet-950", alt: "Premium electric vehicle comparison scene" },
};

const IMG_PARAMS_HERO = "?auto=format&fit=crop&w=1920&q=78";
const IMG_PARAMS_CARD = "?auto=format&fit=crop&w=880&q=72";
const IMG_PARAMS_OG = "?auto=format&fit=crop&w=1200&h=630&q=78";

function tokenize(article: ArticleData): Set<string> {
  const text = `${article.title} ${article.summary} ${article.tags.join(" ")} ${article.relatedVehicles.join(" ")} ${article.relatedNetworks.join(" ")}`.toLowerCase();
  return new Set(text.split(/[^a-z0-9\.\-]+/).filter(Boolean));
}

function overlapCount(a: Set<string>, b: string[]) {
  return b.reduce((sum, token) => sum + (a.has(token.toLowerCase()) ? 1 : 0), 0);
}

function scoreCandidate(article: ArticleData, tokens: Set<string>, candidate: MediaCandidate, recentlyUsed: Set<string>) {
  let score = 0;
  if (candidate.categories.includes(article.category)) score += 36;
  score += overlapCount(tokens, candidate.tags) * 8;
  if (candidate.vehicles?.length) {
    score += candidate.vehicles.filter((v) => article.relatedVehicles.includes(v)).length * 22;
  }
  if (candidate.networks?.length) {
    score += candidate.networks.filter((n) => article.relatedNetworks.includes(n)).length * 20;
  }
  if (candidate.countries?.length) score += overlapCount(tokens, candidate.countries) * 6;
  if (recentlyUsed.has(candidate.id)) score -= 24;
  return score;
}

function toMedia(candidate: MediaCandidate): MediaAttribution {
  return {
    source: candidate.source,
    license: candidate.license,
    sourceUrl: candidate.sourceUrl,
    attribution: candidate.attribution,
    imageId: candidate.id,
    fallbackStatus: "matched",
    url: `${candidate.baseUrl}${IMG_PARAMS_HERO}`,
    heroUrl: `${candidate.baseUrl}${IMG_PARAMS_HERO}`,
    thumbnailUrl: `${candidate.baseUrl}${IMG_PARAMS_CARD}`,
    ogImageUrl: `${candidate.baseUrl}${IMG_PARAMS_OG}`,
    alt: candidate.alt,
    gradient: candidate.gradient,
  };
}

export function resolveArticleMedia(article: ArticleData, recentlyUsed = new Set<string>()): MediaAttribution {
  const tokens = tokenize(article);
  const ranked = CANDIDATES
    .map((candidate) => ({
      candidate,
      score: scoreCandidate(article, tokens, candidate, recentlyUsed),
    }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (best && best.score > 20) return toMedia(best.candidate);

  const fallback = CANDIDATES.find((c) => c.categories.includes(article.category)) ?? CANDIDATES[0];
  if (fallback) {
    return { ...toMedia(fallback), fallbackStatus: "generic-fallback" };
  }

  const gradientFallback = FALLBACK_BY_CATEGORY[article.category];
  return {
    source: "AUTOVERE Gradient Fallback",
    license: "Internal fallback",
    sourceUrl: "",
    attribution: "",
    imageId: `gradient-${article.category}`,
    fallbackStatus: "gradient-fallback",
    url: "",
    alt: gradientFallback.alt,
    gradient: gradientFallback.gradient,
  };
}

export function enrichArticlesWithResolvedMedia(articles: ArticleData[]): ArticleData[] {
  const recentlyUsed = new Set<string>();
  return articles.map((article) => {
    const resolved = resolveArticleMedia(article, recentlyUsed);
    if (resolved.imageId) recentlyUsed.add(resolved.imageId);
    return { ...article, media: { ...article.media, ...resolved } };
  });
}
