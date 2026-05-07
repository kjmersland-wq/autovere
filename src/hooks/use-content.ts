import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  ContentItem,
  ContentItemWithSource,
  ContentSource,
  ContentQueryOptions,
} from "@/types/content";

/**
 * Fetch content items with source information
 */
export function useContentFeed(options: ContentQueryOptions = {}) {
  const {
    filter = {},
    sort_by = "published_at",
    sort_order = "desc",
    limit = 20,
    offset = 0,
  } = options;

  return useQuery({
    queryKey: ["content-feed", filter, sort_by, sort_order, limit, offset],
    queryFn: async () => {
      let query = supabase
        .from("content_items")
        .select(`
          *,
          source:content_sources(*)
        `)
        .eq("is_visible", true);

      // Apply filters
      if (filter.language) {
        query = query.eq("language", filter.language);
      }

      if (filter.content_type) {
        if (Array.isArray(filter.content_type)) {
          query = query.in("content_type", filter.content_type);
        } else {
          query = query.eq("content_type", filter.content_type);
        }
      }

      if (filter.source_id) {
        if (Array.isArray(filter.source_id)) {
          query = query.in("source_id", filter.source_id);
        } else {
          query = query.eq("source_id", filter.source_id);
        }
      }

      if (filter.categories && filter.categories.length > 0) {
        query = query.contains("categories", filter.categories);
      }

      if (filter.car_slugs && filter.car_slugs.length > 0) {
        query = query.contains("car_slugs", filter.car_slugs);
      }

      if (filter.is_featured !== undefined) {
        query = query.eq("is_featured", filter.is_featured);
      }

      if (filter.min_quality_score !== undefined) {
        query = query.gte("quality_score", filter.min_quality_score);
      }

      if (filter.published_after) {
        query = query.gte("published_at", filter.published_after.toISOString());
      }

      if (filter.published_before) {
        query = query.lte("published_at", filter.published_before.toISOString());
      }

      // Apply sorting
      query = query.order(sort_by, { ascending: sort_order === "asc" });

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) throw error;

      return data as ContentItemWithSource[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch featured content for homepage
 */
export function useFeaturedContent(language?: string, limit: number = 6) {
  return useContentFeed({
    filter: {
      is_featured: true,
      language,
      min_quality_score: 70,
    },
    sort_by: "published_at",
    sort_order: "desc",
    limit,
  });
}

/**
 * Fetch content for a specific car
 */
export function useCarContent(carSlug: string, limit: number = 10) {
  return useContentFeed({
    filter: {
      car_slugs: [carSlug],
      min_quality_score: 60,
    },
    sort_by: "published_at",
    sort_order: "desc",
    limit,
  });
}

/**
 * Fetch all content sources
 */
export function useContentSources() {
  return useQuery({
    queryKey: ["content-sources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_sources")
        .select("*")
        .eq("is_active", true)
        .order("trust_score", { ascending: false });

      if (error) throw error;

      return data as ContentSource[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch content categories
 */
export function useContentCategories() {
  return useQuery({
    queryKey: ["content-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;

      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Trigger RSS aggregation for a specific source or all sources
 */
export async function triggerRSSAggregation(sourceId?: string) {
  const url = new URL(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rss-aggregator`
  );
  
  if (sourceId) {
    url.searchParams.set("source_id", sourceId);
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`RSS aggregation failed: ${response.statusText}`);
  }

  return response.json();
}
