/**
 * Content Aggregation Types
 * TypeScript interfaces for AUTOVERE's multi-source content intelligence system
 */

import { SUPPORTED_LANGS } from "@/i18n/config";

// =====================================================
// CONTENT SOURCE TYPES
// =====================================================

export type ContentSource = {
  id: string;
  name: string; // "Car and Driver", "Top Gear"
  slug: string; // "car-and-driver", "top-gear"
  domain: string; // "caranddriver.com"
  logo_url?: string;
  description?: string;
  trust_score: number; // 0-100
  languages: string[]; // ['en', 'de']
  content_types: ContentType[];
  rss_feeds: RSSFeed[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type RSSFeed = {
  url: string;
  language: string;
  category?: string;
  enabled: boolean;
};

// =====================================================
// CONTENT TYPE TAXONOMY
// =====================================================

export type ContentType =
  | "article"
  | "review"
  | "comparison"
  | "test"
  | "ranking"
  | "ownership"
  | "launch"
  | "ev_test"
  | "winter_test"
  | "track_test"
  | "longterm"
  | "reliability"
  | "guide"
  | "video"
  | "mixed";

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  article: "Article",
  review: "Review",
  comparison: "Comparison Test",
  test: "Test",
  ranking: "Ranking",
  ownership: "Ownership Experience",
  launch: "Launch Coverage",
  ev_test: "EV Testing",
  winter_test: "Winter Testing",
  track_test: "Track Testing",
  longterm: "Long-term Test",
  reliability: "Reliability Report",
  guide: "Buying Guide",
  video: "Video",
  mixed: "Mixed Media",
};

// =====================================================
// CONTENT ITEM TYPES
// =====================================================

export type ContentItem = {
  id: string;
  source_id: string;
  content_type: ContentType;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  url: string; // Original article/video URL
  url_hash: string; // For deduplication
  thumbnail_url?: string;
  author?: string;
  published_at: string;
  language: string; // en|no|de|fr|sv|pl|it|es
  categories: string[]; // ['ev', 'winter-testing']
  car_slugs: string[]; // ['polestar-3', 'bmw-i5']
  metadata: ContentMetadata;
  quality_score?: number; // 0-100
  is_featured: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

// Flexible metadata storage for different content types
export type ContentMetadata = {
  // For videos
  duration?: string; // "12:34"
  view_count?: number;
  channel?: string;
  channel_id?: string;
  
  // For articles
  word_count?: number;
  read_time?: number; // minutes
  
  // For all content
  image_urls?: string[];
  tags?: string[];
  
  // Social engagement
  likes?: number;
  comments?: number;
  shares?: number;
  
  // Custom fields per source
  [key: string]: unknown;
};

// =====================================================
// CONTENT CATEGORY TYPES
// =====================================================

export type ContentCategory = {
  id: string;
  slug: string;
  name_en: string;
  name_no?: string;
  name_de?: string;
  name_sv?: string;
  name_fr?: string;
  name_pl?: string;
  name_it?: string;
  name_es?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Helper to get localized category name
export function getCategoryName(category: ContentCategory, lang: string): string {
  const key = `name_${lang}` as keyof ContentCategory;
  return (category[key] as string) || category.name_en;
}

// =====================================================
// CONTENT ITEM WITH SOURCE (Joined Query)
// =====================================================

export type ContentItemWithSource = ContentItem & {
  source: ContentSource;
};

// =====================================================
// CONTENT FILTERING & QUERY TYPES
// =====================================================

export type ContentFilter = {
  language?: string;
  content_type?: ContentType | ContentType[];
  source_id?: string | string[];
  categories?: string[];
  car_slugs?: string[];
  is_featured?: boolean;
  published_after?: Date;
  published_before?: Date;
  min_quality_score?: number;
  search?: string;
};

export type ContentSortBy = "published_at" | "quality_score" | "created_at";
export type ContentSortOrder = "asc" | "desc";

export type ContentQueryOptions = {
  filter?: ContentFilter;
  sort_by?: ContentSortBy;
  sort_order?: ContentSortOrder;
  limit?: number;
  offset?: number;
};

// =====================================================
// CONTENT FEED TYPES (for UI)
// =====================================================

export type ContentFeed = {
  title: string;
  subtitle?: string;
  items: ContentItemWithSource[];
  total_count?: number;
  has_more?: boolean;
};

// =====================================================
// CONTENT SOURCE STATISTICS
// =====================================================

export type SourceStats = {
  source_id: string;
  total_items: number;
  items_last_24h: number;
  items_last_7d: number;
  avg_quality_score: number;
  last_updated: string;
};

// =====================================================
// VALIDATION HELPERS
// =====================================================

export function isValidContentType(type: string): type is ContentType {
  return [
    "article",
    "review",
    "comparison",
    "test",
    "ranking",
    "ownership",
    "launch",
    "ev_test",
    "winter_test",
    "track_test",
    "longterm",
    "reliability",
    "guide",
    "video",
    "mixed",
  ].includes(type);
}

export function isValidLanguage(lang: string): boolean {
  return SUPPORTED_LANGS.includes(lang);
}

// =====================================================
// CONTENT DEDUPLICATION
// =====================================================

export function generateUrlHash(url: string): string {
  // Simple hash function for client-side deduplication checking
  // Matches the server-side md5(lower(trim(url))) function
  return url.toLowerCase().trim();
}

// =====================================================
// CONTENT QUALITY SCORING
// =====================================================

export type QualityFactors = {
  source_trust_score: number; // 0-100 from source
  has_author: boolean;
  has_thumbnail: boolean;
  has_excerpt: boolean;
  word_count?: number;
  is_recent: boolean; // Published within 30 days
};

export function calculateQualityScore(factors: QualityFactors): number {
  let score = factors.source_trust_score * 0.5; // 50% weight to source trust
  
  if (factors.has_author) score += 10;
  if (factors.has_thumbnail) score += 10;
  if (factors.has_excerpt) score += 5;
  if (factors.is_recent) score += 10;
  
  if (factors.word_count) {
    // Bonus for substantial content (300-2000 words ideal)
    if (factors.word_count >= 300 && factors.word_count <= 2000) {
      score += 15;
    } else if (factors.word_count > 2000) {
      score += 10;
    } else {
      score += 5;
    }
  }
  
  return Math.min(100, Math.round(score));
}

// =====================================================
// CONTENT ATTRIBUTION (Legal Compliance)
// =====================================================

export type ContentAttribution = {
  source_name: string;
  source_url: string;
  published_at: string;
  author?: string;
};

export function getContentAttribution(item: ContentItemWithSource): ContentAttribution {
  return {
    source_name: item.source.name,
    source_url: item.url,
    published_at: item.published_at,
    author: item.author,
  };
}

// =====================================================
// EXCERPT GENERATION (Legal Compliance)
// =====================================================

export function generateExcerpt(description: string, maxLength: number = 150): string {
  if (!description) return "";
  if (description.length <= maxLength) return description;
  
  // Cut at last complete word before maxLength
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + "..." : truncated + "...";
}
