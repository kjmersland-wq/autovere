import { useEffect, useState } from "react";

export type CarImage = {
  url: string;
  thumb: string;
  credit: string;
  creditUrl: string;
  source: "unsplash" | "pexels" | "pixabay" | "wikipedia";
};

const memCache = new Map<string, CarImage | null>();

function readSession(key: string): CarImage | null | undefined {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return undefined;
    return JSON.parse(raw) as CarImage | null;
  } catch {
    return undefined;
  }
}

function writeSession(key: string, val: CarImage | null) {
  try { sessionStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
}

const SUPA_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPA_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const HEADERS = { Authorization: `Bearer ${SUPA_KEY}`, apikey: SUPA_KEY as string };

async function fetchWikipediaImage(brand: string, model: string): Promise<CarImage | null> {
  const url = `${SUPA_URL}/functions/v1/model-image?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`;
  const r = await fetch(url, { headers: HEADERS });
  if (!r.ok) return null;
  const data = await r.json();
  if (!data || !data.url) return null;
  return data as CarImage;
}

async function fetchStockImage(query: string): Promise<CarImage | null> {
  const url = `${SUPA_URL}/functions/v1/image-search?q=${encodeURIComponent(query)}`;
  const r = await fetch(url, { headers: HEADERS });
  if (!r.ok) return null;
  return (await r.json()) as CarImage;
}

/**
 * Fetch the canonical photo for a specific car model.
 * Priority: Wikipedia infobox (always the actual model) → stock search fallback.
 *
 * Pass either:
 *   useCarImage("Tesla Model Y")              // generic query (stock search only)
 *   useCarImage({ brand: "Tesla", model: "Model Y" })  // Wikipedia first
 */
export function useCarImage(query: string | undefined | null | { brand: string; model: string }) {
  const [image, setImage] = useState<CarImage | null>(null);
  const [loading, setLoading] = useState(false);

  const key = !query
    ? null
    : typeof query === "string"
      ? `img:${query.toLowerCase()}`
      : `img:wiki2:${query.brand.toLowerCase()}:${query.model.toLowerCase()}`;

  useEffect(() => {
    if (!query || !key) { setImage(null); return; }

    if (memCache.has(key)) { setImage(memCache.get(key) ?? null); return; }
    const cached = readSession(key);
    if (cached !== undefined) { memCache.set(key, cached); setImage(cached); return; }

    let cancelled = false;
    setLoading(true);

    const run = async () => {
      let hit: CarImage | null = null;
      if (typeof query === "object") {
        // Wikipedia ONLY — guaranteed to be the correct model.
        // If Wikipedia has no article/photo, we intentionally show no image
        // rather than risk an unrelated/wrongly-licensed stock photo.
        hit = await fetchWikipediaImage(query.brand, query.model).catch(() => null);
      } else {
        hit = await fetchStockImage(query).catch(() => null);
      }
      if (cancelled) return;
      memCache.set(key, hit);
      writeSession(key, hit);
      setImage(hit);
      setLoading(false);
    };
    run();

    return () => { cancelled = true; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return { image, loading };
}
