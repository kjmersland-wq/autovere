// Model image — fetches the Wikipedia infobox photo for a specific car model.
// Wikipedia infoboxes always show the actual model (not a random tagged photo),
// so this is the only reliable way to get correct images for specific EV models.
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
  source: "wikipedia";
};

async function wikiSummary(title: string): Promise<Hit | null> {
  // REST API: /page/summary/{title} — returns originalimage + thumbnail when present.
  const u = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`;
  const r = await fetch(u, {
    headers: {
      "Api-User-Agent": "AUTOVERE/1.0 (https://autovere.com)",
      "Accept": "application/json",
    },
    redirect: "follow",
  });
  if (!r.ok) return null;
  const j = await r.json();
  // type "disambiguation" → wrong article; skip
  if (j?.type === "disambiguation") return null;
  const original = j?.originalimage?.source;
  const thumb = j?.thumbnail?.source;
  if (!original) return null;
  return {
    url: original,
    thumb: thumb ?? original,
    credit: `Wikipedia — ${j?.title ?? title}`,
    creditUrl: j?.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    source: "wikipedia",
  };
}

async function wikiSearch(query: string): Promise<string | null> {
  // Fallback: use the search API to find the most relevant article title.
  const u = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=3&format=json&origin=*`;
  const r = await fetch(u, { headers: { "Api-User-Agent": "AUTOVERE/1.0" } });
  if (!r.ok) return null;
  const j = await r.json();
  return j?.query?.search?.[0]?.title ?? null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const brand = (url.searchParams.get("brand") ?? "").trim();
    const model = (url.searchParams.get("model") ?? "").trim();
    if (!brand || !model || (brand + model).length > 120) {
      return new Response(JSON.stringify({ error: "Missing brand or model" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Try direct article titles in priority order.
    const candidates = [
      `${brand} ${model}`,
      `${brand}_${model.replace(/ /g, "_")}`,
      model, // e.g. "Polestar 2" works alone
    ];
    for (const c of candidates) {
      const hit = await wikiSummary(c).catch(() => null);
      if (hit) {
        return new Response(JSON.stringify(hit), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=604800, s-maxage=604800", // 7 days
          },
        });
      }
    }

    // Fallback: search Wikipedia, take the top hit, then fetch its summary.
    const searched = await wikiSearch(`${brand} ${model} car`).catch(() => null);
    if (searched) {
      const hit = await wikiSummary(searched).catch(() => null);
      if (hit) {
        return new Response(JSON.stringify(hit), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=604800, s-maxage=604800",
          },
        });
      }
    }

    return new Response(JSON.stringify({ error: "No image found" }), {
      status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("model-image error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
