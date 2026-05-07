/**
 * RSS/Feed Aggregator - Supabase Edge Function
 * Fetches and parses RSS feeds from trusted automotive sources
 * Stores aggregated content in content_items table
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory cache (per isolate)
const cache = new Map<string, { at: number; data: unknown }>();
const TTL_MS = 1000 * 60 * 60 * 2; // 2 hours

type RSSItem = {
  title: string;
  url: string;
  description?: string;
  author?: string;
  publishedAt: Date;
  thumbnail?: string;
  categories?: string[];
};

type ContentSourceWithFeeds = {
  id: string;
  name: string;
  slug: string;
  domain: string;
  trust_score: number;
  languages: string[];
  rss_feeds: Array<{
    url: string;
    language: string;
    category?: string;
    enabled: boolean;
  }>;
};

/**
 * Parse RSS/Atom feed XML and extract items
 */
function parseFeed(xmlText: string): RSSItem[] {
  const doc = new DOMParser().parseFromString(xmlText, "text/xml");
  if (!doc) return [];

  const items: RSSItem[] = [];

  // Try RSS 2.0 format first
  const rssItems = doc.querySelectorAll("item");
  if (rssItems.length > 0) {
    rssItems.forEach((item) => {
      const title = item.querySelector("title")?.textContent?.trim();
      const link = item.querySelector("link")?.textContent?.trim();
      const description =
        item.querySelector("description")?.textContent?.trim() ||
        item.querySelector("content\\:encoded")?.textContent?.trim();
      const author =
        item.querySelector("author")?.textContent?.trim() ||
        item.querySelector("dc\\:creator")?.textContent?.trim();
      const pubDate = item.querySelector("pubDate")?.textContent?.trim();
      
      // Extract thumbnail from media:content or enclosure
      let thumbnail =
        item.querySelector("media\\:content")?.getAttribute("url") ||
        item.querySelector("media\\:thumbnail")?.getAttribute("url");
      
      if (!thumbnail) {
        const enclosure = item.querySelector("enclosure");
        const type = enclosure?.getAttribute("type") || "";
        if (type.startsWith("image/")) {
          thumbnail = enclosure?.getAttribute("url") || undefined;
        }
      }

      // Extract categories
      const categoryNodes = item.querySelectorAll("category");
      const categories: string[] = [];
      categoryNodes.forEach((cat) => {
        const text = cat.textContent?.trim();
        if (text) categories.push(text.toLowerCase());
      });

      if (title && link) {
        items.push({
          title,
          url: link,
          description,
          author,
          publishedAt: pubDate ? new Date(pubDate) : new Date(),
          thumbnail,
          categories: categories.length > 0 ? categories : undefined,
        });
      }
    });
  }

  // Try Atom format
  const atomEntries = doc.querySelectorAll("entry");
  if (atomEntries.length > 0) {
    atomEntries.forEach((entry) => {
      const title = entry.querySelector("title")?.textContent?.trim();
      const linkEl = entry.querySelector("link[rel='alternate']") ||
        entry.querySelector("link");
      const link = linkEl?.getAttribute("href");
      const summary = entry.querySelector("summary")?.textContent?.trim();
      const content = entry.querySelector("content")?.textContent?.trim();
      const description = content || summary;
      const authorEl = entry.querySelector("author name");
      const author = authorEl?.textContent?.trim();
      const published =
        entry.querySelector("published")?.textContent?.trim() ||
        entry.querySelector("updated")?.textContent?.trim();

      if (title && link) {
        items.push({
          title,
          url: link,
          description,
          author,
          publishedAt: published ? new Date(published) : new Date(),
        });
      }
    });
  }

  return items;
}

/**
 * Fetch and parse a single RSS feed
 */
async function fetchFeed(feedUrl: string): Promise<RSSItem[]> {
  const cacheKey = `feed:${feedUrl}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.at < TTL_MS) {
    return cached.data as RSSItem[];
  }

  try {
    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent":
          "AUTOVERE Content Aggregator/1.0 (https://autovere.com)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const items = parseFeed(xmlText);

    cache.set(cacheKey, { at: Date.now(), data: items });
    return items;
  } catch (error) {
    console.error(`Error fetching feed ${feedUrl}:`, error);
    return [];
  }
}

/**
 * Generate URL hash for deduplication (matches DB function)
 */
function generateUrlHash(url: string): string {
  const cleaned = url.toLowerCase().trim();
  // Simple hash implementation (in production, use crypto)
  let hash = 0;
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Calculate quality score based on content attributes
 */
function calculateQualityScore(
  item: RSSItem,
  sourceTrustScore: number
): number {
  let score = sourceTrustScore * 0.5; // 50% weight to source trust

  if (item.author) score += 10;
  if (item.thumbnail) score += 10;
  if (item.description && item.description.length > 50) score += 5;

  // Bonus for recent content (within 30 days)
  const daysSincePublished =
    (Date.now() - item.publishedAt.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePublished <= 30) score += 10;

  // Bonus for substantial description
  if (item.description) {
    const wordCount = item.description.split(/\s+/).length;
    if (wordCount >= 50 && wordCount <= 300) {
      score += 15;
    } else if (wordCount > 300) {
      score += 10;
    } else {
      score += 5;
    }
  }

  return Math.min(100, Math.round(score));
}

/**
 * Generate slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}

/**
 * Detect content type from title/description/categories
 */
function detectContentType(
  title: string,
  description: string,
  categories: string[]
): string {
  const text = `${title} ${description}`.toLowerCase();
  const allCategories = categories.join(" ").toLowerCase();

  // EV-specific
  if (
    text.match(/\b(ev|electric vehicle|battery|charging|range test)\b/) ||
    allCategories.includes("electric")
  ) {
    return "ev_test";
  }

  // Winter testing
  if (
    text.match(/\b(winter|snow|ice|cold weather|nordic)\b/) ||
    allCategories.includes("winter")
  ) {
    return "winter_test";
  }

  // Track testing
  if (
    text.match(/\b(track|circuit|lap time|nürburgring|racing)\b/) ||
    allCategories.includes("track")
  ) {
    return "track_test";
  }

  // Comparison
  if (
    text.match(/\b(vs\.|versus|compared|comparison|head.?to.?head)\b/) ||
    allCategories.includes("comparison")
  ) {
    return "comparison";
  }

  // Long-term
  if (
    text.match(/\b(long.?term|ownership|living with|40000 miles)\b/) ||
    allCategories.includes("longterm")
  ) {
    return "longterm";
  }

  // Review
  if (
    text.match(/\b(review|tested|first drive|road test)\b/) ||
    allCategories.includes("review")
  ) {
    return "review";
  }

  // Guide
  if (
    text.match(/\b(guide|how to|buying|best|top \d+)\b/) ||
    allCategories.includes("guide")
  ) {
    return "guide";
  }

  // Default to article
  return "article";
}

/**
 * Generate excerpt from description
 */
function generateExcerpt(description: string, maxLength: number = 150): string {
  if (!description) return "";
  if (description.length <= maxLength) return description;

  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + "..."
    : truncated + "...";
}

/**
 * Main handler
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const url = new URL(req.url);
    const sourceId = url.searchParams.get("source_id");
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);

    // Get active sources with RSS feeds
    let query = supabase
      .from("content_sources")
      .select("*")
      .eq("is_active", true)
      .not("rss_feeds", "eq", "[]");

    if (sourceId) {
      query = query.eq("id", sourceId);
    }

    const { data: sources, error: sourcesError } = await query;

    if (sourcesError) {
      throw new Error(`Failed to fetch sources: ${sourcesError.message}`);
    }

    if (!sources || sources.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active sources with RSS feeds found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const results = {
      total_sources: sources.length,
      total_feeds: 0,
      total_items_fetched: 0,
      total_items_inserted: 0,
      total_items_skipped: 0,
      errors: [] as string[],
    };

    // Process each source
    for (const source of sources as ContentSourceWithFeeds[]) {
      const rssFeeds = Array.isArray(source.rss_feeds) ? source.rss_feeds : [];
      
      if (rssFeeds.length === 0) continue;

      const enabledFeeds = rssFeeds.filter((feed) => feed.enabled !== false);
      results.total_feeds += enabledFeeds.length;

      for (const feed of enabledFeeds) {
        try {
          const items = await fetchFeed(feed.url);
          results.total_items_fetched += items.length;

          // Process items (limit per feed)
          const itemsToProcess = items.slice(0, limit);

          for (const item of itemsToProcess) {
            try {
              const urlHash = generateUrlHash(item.url);
              const qualityScore = calculateQualityScore(
                item,
                source.trust_score
              );
              const contentType = detectContentType(
                item.title,
                item.description || "",
                item.categories || []
              );
              const slug = generateSlug(item.title);
              const excerpt = generateExcerpt(item.description || "");

              // Check if already exists (by URL hash)
              const { data: existing } = await supabase
                .from("content_items")
                .select("id")
                .eq("url_hash", urlHash)
                .single();

              if (existing) {
                results.total_items_skipped++;
                continue;
              }

              // Insert new content item
              const { error: insertError } = await supabase
                .from("content_items")
                .insert({
                  source_id: source.id,
                  content_type: contentType,
                  title: item.title,
                  slug,
                  description: item.description,
                  excerpt,
                  url: item.url,
                  url_hash: urlHash,
                  thumbnail_url: item.thumbnail,
                  author: item.author,
                  published_at: item.publishedAt.toISOString(),
                  language: feed.language || "en",
                  categories: item.categories || [],
                  car_slugs: [], // TODO: Extract car names from title/description
                  metadata: {},
                  quality_score: qualityScore,
                  is_featured: false,
                  is_visible: qualityScore >= 50, // Only show quality content
                });

              if (insertError) {
                results.errors.push(
                  `Failed to insert "${item.title}": ${insertError.message}`
                );
              } else {
                results.total_items_inserted++;
              }
            } catch (itemError) {
              results.errors.push(
                `Error processing item "${item.title}": ${itemError.message}`
              );
            }
          }
        } catch (feedError) {
          results.errors.push(
            `Error fetching feed ${feed.url}: ${feedError.message}`
          );
        }
      }
    }

    return new Response(JSON.stringify(results, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("RSS Aggregator error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
