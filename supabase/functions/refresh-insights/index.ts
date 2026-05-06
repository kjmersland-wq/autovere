import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-refresh-key",
};

// Curated AutoVere car list — kept here so the cron job stays controlled
// and never wanders outside the approved library.
const APPROVED_CARS: { slug: string; name: string }[] = [
  { slug: "polestar-3", name: "Polestar 3" },
  { slug: "bmw-i5", name: "BMW i5" },
  { slug: "volvo-ex90", name: "Volvo EX90" },
  { slug: "mercedes-eqe", name: "Mercedes EQE" },
  { slug: "kia-ev9", name: "Kia EV9" },
];

const SYSTEM = `You are AutoVere — calm, emotionally intelligent automotive advisor.
Synthesise honest reviewer consensus from YouTube titles and descriptions.
Tone: human, calm, sophisticated. Never sensational. Never invent facts.
If signals conflict, say "reviewers are mixed".`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Natural rate-limit: at most one full sweep per 20 hours.
  // Prevents accidental abuse even though endpoint is open.

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!LOVABLE_API_KEY || !YOUTUBE_API_KEY || !SUPABASE_URL || !SERVICE_KEY) {
    return new Response(JSON.stringify({ error: "Missing required environment" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const db = createClient(SUPABASE_URL, SERVICE_KEY);
  const results: { slug: string; status: string; detail?: string }[] = [];

  // Optional single-car refresh via ?slug=
  const slugFilter = new URL(req.url).searchParams.get("slug");
  const queue = slugFilter
    ? APPROVED_CARS.filter((c) => c.slug === slugFilter)
    : APPROVED_CARS;

  for (const car of queue) {
    try {
      // 1. Pull recent expert reviews from YouTube
      const ytParams = new URLSearchParams({
        key: YOUTUBE_API_KEY,
        part: "snippet",
        type: "video",
        q: `${car.name} review`,
        maxResults: "8",
        order: "relevance",
        safeSearch: "moderate",
        relevanceLanguage: "en",
        videoEmbeddable: "true",
      });
      const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/search?${ytParams}`);
      if (!ytRes.ok) {
        results.push({ slug: car.slug, status: "yt_failed", detail: String(ytRes.status) });
        continue;
      }
      const ytJson = await ytRes.json();
      const videos = (ytJson.items ?? []).map((i: { snippet?: { title?: string; description?: string; channelTitle?: string } }) => ({
        title: i.snippet?.title ?? "",
        channel: i.snippet?.channelTitle ?? "",
        description: i.snippet?.description ?? "",
      }));
      if (videos.length === 0) {
        results.push({ slug: car.slug, status: "no_videos" });
        continue;
      }

      const signature = videos.slice(0, 8).map((v: { title: string }) => v.title).join("|").slice(0, 400);

      // 2. Skip if signature is unchanged AND record is fresh (<14 days)
      const { data: existing } = await db
        .from("car_insights")
        .select("source_signature, refreshed_at")
        .eq("car_slug", car.slug)
        .maybeSingle();
      if (
        existing &&
        existing.source_signature === signature &&
        Date.now() - new Date(existing.refreshed_at).getTime() < 1000 * 60 * 60 * 24 * 14
      ) {
        results.push({ slug: car.slug, status: "unchanged" });
        continue;
      }

      // 3. Synthesise consensus via Lovable AI
      const reviewBlock = videos
        .slice(0, 12)
        .map(
          (v: { title: string; channel: string; description?: string }, i: number) =>
            `${i + 1}. [${v.channel}] ${v.title}${v.description ? ` — ${v.description.slice(0, 280)}` : ""}`,
        )
        .join("\n");

      const prompt = `Car: ${car.name}

Recent expert review signals from YouTube:
${reviewBlock}

Return strict JSON:
{
  "strengths": [3-5 short calm sentences reviewers agree on as positives],
  "criticisms": [2-4 short calm sentences reviewers agree on as drawbacks or mixed feedback],
  "feel": "1-2 sentence emotional summary of how reviewers describe driving it",
  "headline": "one short sentence (max 14 words) capturing reviewer consensus"
}
Only the JSON, no prose.`;

      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
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

      if (!aiRes.ok) {
        results.push({ slug: car.slug, status: "ai_failed", detail: String(aiRes.status) });
        await sleep(800);
        continue;
      }

      const aiJson = await aiRes.json();
      const raw = aiJson?.choices?.[0]?.message?.content ?? "{}";
      let parsed: { strengths?: string[]; criticisms?: string[]; feel?: string; headline?: string };
      try {
        parsed = JSON.parse(raw);
      } catch {
        results.push({ slug: car.slug, status: "ai_parse_failed" });
        continue;
      }

      // 4. Quality threshold — refuse to publish empty/low-confidence outputs
      const ok =
        Array.isArray(parsed.strengths) &&
        parsed.strengths.length >= 2 &&
        typeof parsed.headline === "string" &&
        parsed.headline.length > 8;
      if (!ok) {
        results.push({ slug: car.slug, status: "low_quality_skipped" });
        continue;
      }

      // 5. Persist
      const { error: upErr } = await db.from("car_insights").upsert(
        {
          car_slug: car.slug,
          car_name: car.name,
          headline: parsed.headline,
          feel: parsed.feel ?? "",
          strengths: parsed.strengths,
          criticisms: parsed.criticisms ?? [],
          source_signature: signature,
          source_count: videos.length,
          refreshed_at: new Date().toISOString(),
        },
        { onConflict: "car_slug" },
      );
      if (upErr) {
        results.push({ slug: car.slug, status: "db_failed", detail: upErr.message });
        continue;
      }

      results.push({ slug: car.slug, status: "refreshed" });
      // be polite to AI + YouTube quota
      await sleep(1200);
    } catch (e) {
      results.push({ slug: car.slug, status: "error", detail: (e as Error).message });
    }
  }

  return new Response(JSON.stringify({ ok: true, processed: results.length, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
