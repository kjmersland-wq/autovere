import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";

/**
 * cached_place_reviews exists in the database (see migration
 * 20260908151151_create_cached_place_reviews.sql) but is not present in the
 * auto-generated types yet, so this table is accessed through a loosely typed
 * view of the client.
 */
type CachedReviewRow = {
  poi_id: string;
  place_id: string | null;
  rating: number | null;
  review_count: number | null;
  top_review: string | null;
  photo_url: string | null;
  fetched_at: string;
};
const reviewsTable = () =>
  (supabase as unknown as {
    from: (t: string) => {
      select: (q: string) => {
        in: (col: string, vals: string[]) => Promise<{ data: CachedReviewRow[] | null }>;
      };
      upsert: (row: CachedReviewRow) => Promise<unknown>;
    };
  }).from("cached_place_reviews");


/**
 * On-demand Google Places rating/review enrichment for corridor POI cards.
 * Strictly for the small set of candidates a trip actually renders (capped
 * at MAX_CANDIDATES) — never the full curated dataset. Checks
 * cached_place_reviews first; only calls Google Places for a row that's
 * missing or older than CACHE_TTL_DAYS. Same Lovable connector gateway used
 * by geo-search.functions.ts for the origin/destination autocomplete.
 */

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";
const MAX_CANDIDATES = 8;
const CACHE_TTL_DAYS = 30;

const candidateSchema = z.object({
  id: z.string().min(1).max(80),
  name: z.string().min(1).max(200),
  lat: z.number(),
  lng: z.number(),
});

export type PlaceReview = {
  poiId: string;
  placeId: string | null;
  rating: number | null;
  reviewCount: number | null;
  topReview: string | null;
  photoUrl: string | null;
};

type GoogleFetched = Omit<PlaceReview, "poiId">;

type GooglePlace = {
  id?: string;
  rating?: number;
  userRatingCount?: number;
  reviews?: { text?: { text?: string } }[];
  photos?: { name?: string }[];
};

async function fetchFromGoogle(name: string, lat: number, lng: number): Promise<GoogleFetched | null> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_MAPS_API_KEY"];
  if (!lovableKey || !connectionKey) return null;

  const res = await fetch(`${GATEWAY_URL}/places/v1/places:searchText`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
      "Content-Type": "application/json",
      "X-Goog-FieldMask": "places.id,places.rating,places.userRatingCount,places.reviews,places.photos",
    },
    body: JSON.stringify({
      textQuery: name,
      maxResultCount: 1,
      locationBias: { circle: { center: { latitude: lat, longitude: lng }, radius: 500 } },
    }),
  });
  if (!res.ok) return null;

  const json = (await res.json()) as { places?: GooglePlace[] };
  const place = json.places?.[0];
  if (!place) return null;

  return {
    placeId: place.id ?? null,
    rating: place.rating ?? null,
    reviewCount: place.userRatingCount ?? null,
    topReview: place.reviews?.[0]?.text?.text ?? null,
    photoUrl: place.photos?.[0]?.name
      ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxWidthPx=480&key=${connectionKey}`
      : null,
  };
}

export const getPlaceReviews = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ candidates: z.array(candidateSchema).max(MAX_CANDIDATES) }).parse(data),
  )
  .handler(async ({ data }): Promise<PlaceReview[]> => {
    const candidates = data.candidates.slice(0, MAX_CANDIDATES);
    if (!candidates.length) return [];

    const { data: cachedRows } = await supabase
      .from("cached_place_reviews")
      .select("*")
      .in(
        "poi_id",
        candidates.map((c) => c.id),
      );

    const freshCutoff = Date.now() - CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;
    const cachedById = new Map((cachedRows ?? []).map((r) => [r.poi_id, r]));

    const results: PlaceReview[] = [];
    for (const c of candidates) {
      const cached = cachedById.get(c.id);
      if (cached && new Date(cached.fetched_at).getTime() > freshCutoff) {
        results.push({
          poiId: c.id,
          placeId: cached.place_id,
          rating: cached.rating,
          reviewCount: cached.review_count,
          topReview: cached.top_review,
          photoUrl: cached.photo_url,
        });
        continue;
      }

      const fetched = await fetchFromGoogle(c.name, c.lat, c.lng);
      if (!fetched) {
        // Never fabricate — fall back to a stale cache row rather than a guess.
        if (cached) {
          results.push({
            poiId: c.id,
            placeId: cached.place_id,
            rating: cached.rating,
            reviewCount: cached.review_count,
            topReview: cached.top_review,
            photoUrl: cached.photo_url,
          });
        }
        continue;
      }

      await supabase.from("cached_place_reviews").upsert({
        poi_id: c.id,
        place_id: fetched.placeId,
        rating: fetched.rating,
        review_count: fetched.reviewCount,
        top_review: fetched.topReview,
        photo_url: fetched.photoUrl,
        fetched_at: new Date().toISOString(),
      });

      results.push({ poiId: c.id, ...fetched });
    }

    return results;
  });
