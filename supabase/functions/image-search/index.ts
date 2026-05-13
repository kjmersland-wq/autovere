// Image search — fetches a cinematic photo for a query (e.g. car name).
// Tries Unsplash → Pexels → Pixabay until one returns a result.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

type Hit = {
  url: string;        // full-size image
  thumb: string;      // smaller preview
  credit: string;     // photographer / source label
  creditUrl: string;  // link back to source page
  source: "unsplash" | "pexels" | "pixabay";
};

async function fromUnsplash(q: string): Promise<Hit | null> {
  const key = Deno.env.get("UNSPLASH_ACCESS_KEY");
  if (!key) return null;
  const u = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape&content_filter=high`;
  const r = await fetch(u, { headers: { Authorization: `Client-ID ${key}` } });
  if (!r.ok) return null;
  const j = await r.json();
  const p = j?.results?.[0];
  if (!p) return null;
  return {
    url: p.urls?.regular,
    thumb: p.urls?.small,
    credit: p.user?.name ?? "Unsplash",
    creditUrl: p.links?.html ?? "https://unsplash.com",
    source: "unsplash",
  };
}

async function fromPexels(q: string): Promise<Hit | null> {
  const key = Deno.env.get("PEXELS_API_KEY");
  if (!key) return null;
  const u = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape`;
  const r = await fetch(u, { headers: { Authorization: key } });
  if (!r.ok) return null;
  const j = await r.json();
  const p = j?.photos?.[0];
  if (!p) return null;
  return {
    url: p.src?.large2x ?? p.src?.large,
    thumb: p.src?.medium,
    credit: p.photographer ?? "Pexels",
    creditUrl: p.url ?? "https://pexels.com",
    source: "pexels",
  };
}

async function fromPixabay(q: string): Promise<Hit | null> {
  const key = Deno.env.get("PIXABAY_API_KEY");
  if (!key) return null;
  const u = `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(q)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=3`;
  const r = await fetch(u);
  if (!r.ok) return null;
  const j = await r.json();
  const p = j?.hits?.[0];
  if (!p) return null;
  return {
    url: p.largeImageURL ?? p.webformatURL,
    thumb: p.previewURL ?? p.webformatURL,
    credit: p.user ?? "Pixabay",
    creditUrl: p.pageURL ?? "https://pixabay.com",
    source: "pixabay",
  };
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

    const providers = [fromUnsplash, fromPexels, fromPixabay];
    for (const p of providers) {
      try {
        const hit = await p(q);
        if (hit?.url) {
          return new Response(JSON.stringify(hit), {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
              // Cache at the edge for 24h — same query rarely changes meaning
              "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
          });
        }
      } catch (e) {
        console.error("provider error:", e);
      }
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
