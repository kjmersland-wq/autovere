// Image search — fetches a real photo for a query (e.g. "Tesla Model Y").
// Fetches multiple candidates from each provider and scores them by how well
// the alt/description matches the requested brand + model, so we don't return
// a random "EV charger" photo when asked for a specific model.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

type Hit = {
  url: string;
  thumb: string;
  credit: string;
  creditUrl: string;
  source: "unsplash" | "pexels" | "pixabay";
  description: string;
};

// Generic words that should not count as a "match" on their own.
const STOPWORDS = new Set([
  "the", "a", "an", "of", "and", "in", "on", "at", "to", "for", "with",
  "car", "auto", "vehicle", "ev", "electric", "new", "used", "review",
]);

function tokens(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

function scoreHit(queryTokens: string[], description: string): number {
  const d = (description || "").toLowerCase();
  if (!d) return 0;
  let score = 0;
  let matched = 0;
  for (const t of queryTokens) {
    if (d.includes(t)) {
      score += t.length >= 4 ? 3 : 2; // longer tokens (e.g. "tesla", "model") weigh more
      matched++;
    }
  }
  // bonus when *all* query tokens appear (strong evidence of right model)
  if (queryTokens.length > 0 && matched === queryTokens.length) score += 5;
  // small bonus for car-like context words (avoids "model" matching fashion photos)
  if (/\b(car|suv|sedan|hatchback|coupe|electric|ev|vehicle|automotive)\b/.test(d)) score += 1;
  // negative score for clearly unrelated context
  if (/\b(woman|man|fashion|food|interior design|wedding|beach|baby)\b/.test(d)) score -= 4;
  return score;
}

function pickBest(hits: Hit[], queryTokens: string[]): Hit | null {
  if (hits.length === 0) return null;
  const scored = hits.map((h) => ({ h, s: scoreHit(queryTokens, h.description) }));
  scored.sort((a, b) => b.s - a.s);
  // require at least 1 token match; otherwise we'd serve random photos
  if (scored[0].s <= 0) return null;
  return scored[0].h;
}

async function fromUnsplash(q: string): Promise<Hit[]> {
  const key = Deno.env.get("UNSPLASH_ACCESS_KEY");
  if (!key) return [];
  const u = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=10&orientation=landscape&content_filter=high`;
  const r = await fetch(u, { headers: { Authorization: `Client-ID ${key}` } });
  if (!r.ok) return [];
  const j = await r.json();
  return (j?.results ?? []).map((p: any) => ({
    url: p.urls?.regular,
    thumb: p.urls?.small,
    credit: p.user?.name ?? "Unsplash",
    creditUrl: p.links?.html ?? "https://unsplash.com",
    source: "unsplash" as const,
    description: [p.description, p.alt_description, (p.tags ?? []).map((t: any) => t.title).join(" ")]
      .filter(Boolean).join(" "),
  })).filter((h: Hit) => h.url);
}

async function fromPexels(q: string): Promise<Hit[]> {
  const key = Deno.env.get("PEXELS_API_KEY");
  if (!key) return [];
  const u = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=15&orientation=landscape`;
  const r = await fetch(u, { headers: { Authorization: key } });
  if (!r.ok) return [];
  const j = await r.json();
  return (j?.photos ?? []).map((p: any) => ({
    url: p.src?.large2x ?? p.src?.large,
    thumb: p.src?.medium,
    credit: p.photographer ?? "Pexels",
    creditUrl: p.url ?? "https://pexels.com",
    source: "pexels" as const,
    description: [p.alt, p.url].filter(Boolean).join(" "), // pexels url contains slug words
  })).filter((h: Hit) => h.url);
}

async function fromPixabay(q: string): Promise<Hit[]> {
  const key = Deno.env.get("PIXABAY_API_KEY");
  if (!key) return [];
  const u = `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(q)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=20&category=transportation`;
  const r = await fetch(u);
  if (!r.ok) return [];
  const j = await r.json();
  return (j?.hits ?? []).map((p: any) => ({
    url: p.largeImageURL ?? p.webformatURL,
    thumb: p.previewURL ?? p.webformatURL,
    credit: p.user ?? "Pixabay",
    creditUrl: p.pageURL ?? "https://pixabay.com",
    source: "pixabay" as const,
    description: [p.tags, p.pageURL].filter(Boolean).join(" "),
  })).filter((h: Hit) => h.url);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") ?? "").trim();
    if (!q || q.length > 120) {
      return new Response(JSON.stringify({ error: "Missing or invalid q" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Anchor query with "car" so providers prefer automotive photos.
    const carQuery = /\b(car|suv|sedan|ev|electric)\b/i.test(q) ? q : `${q} car`;
    const queryTokens = tokens(q);

    // Fetch all providers in parallel, then score across the union.
    const [u, p, x] = await Promise.all([
      fromUnsplash(carQuery).catch(() => []),
      fromPexels(carQuery).catch(() => []),
      fromPixabay(carQuery).catch(() => []),
    ]);

    // Try Unsplash → Pexels → Pixabay in priority order, pick best-scoring per source,
    // then return the first one that actually scores > 0 (i.e. matches the query).
    const ordered: { name: string; hits: Hit[] }[] = [
      { name: "unsplash", hits: u },
      { name: "pexels", hits: p },
      { name: "pixabay", hits: x },
    ];
    for (const { hits } of ordered) {
      const best = pickBest(hits, queryTokens);
      if (best) {
        const { description: _d, ...payload } = best;
        return new Response(JSON.stringify(payload), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        });
      }
    }

    // Last resort: return *some* car photo from any provider rather than nothing.
    const fallback = u[0] ?? p[0] ?? x[0];
    if (fallback) {
      const { description: _d, ...payload } = fallback;
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
      });
    }

    return new Response(JSON.stringify({ error: "No image found" }), {
      status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("image-search error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
