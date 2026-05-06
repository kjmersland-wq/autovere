import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Curated trusted reviewer channel signals — name fragments matched against channelTitle.
// Higher score = more trusted.
const TRUSTED: Array<{ pattern: RegExp; score: number }> = [
  { pattern: /carwow/i, score: 5 },
  { pattern: /top\s*gear/i, score: 5 },
  { pattern: /out\s*of\s*spec/i, score: 5 },
  { pattern: /fully\s*charged/i, score: 5 },
  { pattern: /autotrader/i, score: 4 },
  { pattern: /auto\s*express/i, score: 4 },
  { pattern: /motortrend/i, score: 4 },
  { pattern: /edmunds/i, score: 4 },
  { pattern: /the\s*straight\s*pipes/i, score: 4 },
  { pattern: /savagegeese/i, score: 4 },
  { pattern: /doug\s*demuro/i, score: 4 },
  { pattern: /electrifying/i, score: 4 },
  { pattern: /inside\s*evs/i, score: 4 },
  { pattern: /autogef/i, score: 3 },
  { pattern: /bjørn\s*nyland/i, score: 5 },
  { pattern: /bjorn\s*nyland/i, score: 5 },
  { pattern: /transport\s*evolved/i, score: 3 },
  { pattern: /everyday\s*driver/i, score: 3 },
];

// Hard-block obvious low-quality patterns
const BANNED = /reaction|tier\s*list|insane|shocking|destroyed|exposed|💥|🔥{2,}/i;

const trustScore = (channel: string, title: string): number => {
  const base = TRUSTED.find((t) => t.pattern.test(channel))?.score ?? 0;
  if (BANNED.test(title)) return -10;
  // Comparison-specific boost
  const compBoost = /\bvs\.?\b|\bvs\b|comparison|head[\s-]?to[\s-]?head/i.test(title) ? 2 : 0;
  return base + compBoost;
};

const formatDuration = (iso: string): string => {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  const h = parseInt(m[1] ?? "0", 10);
  const min = parseInt(m[2] ?? "0", 10);
  const s = parseInt(m[3] ?? "0", 10);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(min)}:${pad(s)}` : `${min}:${pad(s)}`;
};

const SYSTEM = `You are AutoVere — calm, sophisticated automotive editor.
Synthesise honest comparison consensus from reviewer video titles and descriptions.
Tone: Scandinavian, human, observational, never sensational.
Never invent specifications. Speak about feel, character, ownership, mood.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const aSlug = url.searchParams.get("a")?.trim();
    const bSlug = url.searchParams.get("b")?.trim();
    const aName = url.searchParams.get("aName")?.trim();
    const bName = url.searchParams.get("bName")?.trim();
    if (!aSlug || !bSlug || !aName || !bName) {
      return new Response(JSON.stringify({ error: "Missing a/b/aName/bName" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stable pair key (alphabetised so a-vs-b == b-vs-a)
    const [k1, k2] = [aSlug, bSlug].sort();
    const pairKey = `${k1}__${k2}`;

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const YT = Deno.env.get("YOUTUBE_API_KEY");
    const LOVABLE = Deno.env.get("LOVABLE_API_KEY");
    if (!YT || !LOVABLE) {
      return new Response(JSON.stringify({ error: "Missing keys" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const db = createClient(SUPABASE_URL, SERVICE_KEY);

    // 14-day cache
    const { data: existing } = await db
      .from("compare_insights")
      .select("*")
      .eq("pair_key", pairKey)
      .maybeSingle();
    if (
      existing &&
      Date.now() - new Date(existing.refreshed_at).getTime() < 1000 * 60 * 60 * 24 * 14
    ) {
      return new Response(JSON.stringify({ insight: existing, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Search YouTube for comparison content
    const q = `${aName} vs ${bName} review comparison`;
    const searchParams = new URLSearchParams({
      key: YT,
      part: "snippet",
      type: "video",
      maxResults: "20",
      q,
      order: "relevance",
      safeSearch: "moderate",
      relevanceLanguage: "en",
      videoEmbeddable: "true",
    });
    const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams}`);
    if (!ytRes.ok) {
      return new Response(JSON.stringify({ error: "YouTube failed" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const ytJson = await ytRes.json();
    const items = (ytJson.items ?? []) as Array<{
      id: { videoId: string };
      snippet: {
        title: string;
        description: string;
        channelTitle: string;
        publishedAt: string;
        thumbnails: { high?: { url: string }; medium?: { url: string } };
      };
    }>;

    // 2. Score & filter
    const scored = items
      .map((i) => ({
        id: i.id.videoId,
        title: i.snippet.title,
        description: i.snippet.description ?? "",
        channel: i.snippet.channelTitle,
        publishedAt: i.snippet.publishedAt,
        thumbnail:
          i.snippet.thumbnails.high?.url ?? i.snippet.thumbnails.medium?.url ?? "",
        trust: trustScore(i.snippet.channelTitle, i.snippet.title),
      }))
      .filter(
        (v) =>
          v.trust > -10 &&
          // Must mention BOTH cars (loose check) or be from a trusted source
          (v.trust >= 3 ||
            (new RegExp(aName.split(" ")[0], "i").test(v.title) &&
              new RegExp(bName.split(" ")[0], "i").test(v.title))),
      )
      .sort((a, b) => b.trust - a.trust)
      .slice(0, 8);

    // 3. Fetch durations for the curated set
    if (scored.length > 0) {
      const ids = scored.map((s) => s.id).join(",");
      const dRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=${YT}&part=contentDetails,statistics&id=${ids}`,
      );
      if (dRes.ok) {
        const dJson = await dRes.json();
        const map = new Map<string, { duration: string; views: string }>();
        for (const v of dJson.items ?? []) {
          map.set(v.id, {
            duration: formatDuration(v.contentDetails?.duration ?? ""),
            views: v.statistics?.viewCount ?? "",
          });
        }
        scored.forEach((s) => {
          const d = map.get(s.id);
          if (d) Object.assign(s, d);
        });
      }
    }

    const curatedVideos = scored.slice(0, 6);

    // 4. AI consensus
    const reviewBlock = scored
      .slice(0, 12)
      .map((v, i) => `${i + 1}. [${v.channel}] ${v.title} — ${v.description.slice(0, 240)}`)
      .join("\n");

    const prompt = `Comparison: ${aName} vs ${bName}

Reviewer comparison signals:
${reviewBlock || "(few signals available)"}

Return strict JSON:
{
  "summary": "1-2 sentence calm overview of how reviewers compare them (max 50 words)",
  "contrasts": [
    { "dimension": "e.g. Driving feel / Comfort / Family use / Charging / Quietness",
      "a": "what reviewers say about ${aName} on this dimension",
      "b": "what reviewers say about ${bName} on this dimension" }
  ]
}
Provide 4-6 contrasts. Each "a"/"b" is one calm sentence (max 20 words).
Only the JSON.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    let summary = "Reviewers have not yet built a strong consensus on this exact pairing.";
    let contrasts: Array<{ dimension: string; a: string; b: string }> = [];
    if (aiRes.ok) {
      const j = await aiRes.json();
      try {
        const parsed = JSON.parse(j?.choices?.[0]?.message?.content ?? "{}");
        if (typeof parsed.summary === "string" && parsed.summary.length > 12) {
          summary = parsed.summary;
        }
        if (Array.isArray(parsed.contrasts)) {
          contrasts = parsed.contrasts
            .filter(
              (c: { dimension?: string; a?: string; b?: string }) =>
                c?.dimension && c?.a && c?.b,
            )
            .slice(0, 6);
        }
      } catch {
        /* keep defaults */
      }
    }

    const record = {
      pair_key: pairKey,
      car_a_slug: aSlug,
      car_b_slug: bSlug,
      car_a_name: aName,
      car_b_name: bName,
      summary,
      contrasts,
      videos: curatedVideos,
      source_count: scored.length,
      refreshed_at: new Date().toISOString(),
    };

    await db.from("compare_insights").upsert(record, { onConflict: "pair_key" });

    return new Response(JSON.stringify({ insight: record, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
