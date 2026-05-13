import { useEffect, useState } from "react";

export type CarImage = {
  url: string;
  thumb: string;
  credit: string;
  creditUrl: string;
  source: "unsplash" | "pexels" | "pixabay";
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

/**
 * Fetch a cinematic stock photo for the given query (e.g. "Tesla Model Y").
 * Uses a session cache so the same query is requested at most once per tab.
 */
export function useCarImage(query: string | undefined | null) {
  const [image, setImage] = useState<CarImage | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) { setImage(null); return; }
    const key = `img:${query.toLowerCase()}`;

    if (memCache.has(key)) { setImage(memCache.get(key) ?? null); return; }
    const cached = readSession(key);
    if (cached !== undefined) { memCache.set(key, cached); setImage(cached); return; }

    let cancelled = false;
    setLoading(true);
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/image-search?q=${encodeURIComponent(query)}`;
    fetch(url, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    })
      .then(async (r) => (r.ok ? (await r.json()) as CarImage : null))
      .then((hit) => {
        if (cancelled) return;
        memCache.set(key, hit);
        writeSession(key, hit);
        setImage(hit);
      })
      .catch(() => { if (!cancelled) setImage(null); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [query]);

  return { image, loading };
}
