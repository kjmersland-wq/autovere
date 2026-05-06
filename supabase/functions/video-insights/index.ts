import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const memCache = new Map<string, { at: number; data: unknown }>();
const TTL_MS = 1000 * 60 * 60 * 24; // 24h hot
const DB_REFRESH_MS = 1000 * 60 * 60 * 24 * 7; // 7d cold

type ReqBody = {
  carName: string;
  carSlug?: string;
  videos: { title: string; channel: string; description?: string }[];
};

const sigOf = (videos: ReqBody["videos"]) =>
  videos.slice(0, 8).map((v) => v.title).join("|").slice(0, 400);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as ReqBody;
    if (!body?.carName || !Array.isArray(body.videos) || body.videos.length === 0) {
      return new Response(JSON.stringify({ error: "Missing carName or videos" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const signature = sigOf(body.videos);
    const cacheKey = `${body.carName}|${signature}`;
    const hot = memCache.get(cacheKey);
    if (hot && Date.now() - hot.at < TTL_MS) {
      return new Response(JSON.stringify({ ...(hot.data as object), cached: "memory" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DB cache (per car_slug)
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const db =
      SUPABASE_URL && SERVICE_KEY ? createClient(SUPABASE_URL, SERVICE_KEY) : null;

    if (db && body.carSlug) {
      const { data: row } = await db
        .from("car_insights")
        .select("*")
        .eq("car_slug", body.carSlug)
        .maybeSingle();
      if (
        row &&
        row.source_signature === signature &&
        Date.now() - new Date(row.refreshed_at).getTime() < DB_REFRESH_MS
      ) {
        const payload = {
          headline: row.headline ?? "",
          feel: row.feel ?? "",
          strengths: row.strengths ?? [],
          criticisms: row.criticisms ?? [],
        };
        memCache.set(cacheKey, { at: Date.now(), data: payload });
        return new Response(JSON.stringify({ ...payload, cached: "db" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const reviewBlock = body.videos
      .slice(0, 12)
      .map(
        (v, i) =>
          `${i + 1}. [${v.channel}] ${v.title}${v.description ? ` — ${v.description.slice(0, 280)}` : ""}`,
      )
      .join("\n");

    const system = `You are AutoVere — a calm, emotionally intelligent automotive advisor.
You synthesise honest reviewer consensus from YouTube titles and descriptions.
Tone: human, calm, sophisticated, never robotic, never marketing-speak, never sensational.
Never invent facts not implied by the inputs. If unsure, say "reviewers are mixed".`;

    const user = `Car: ${body.carName}

Recent expert review signals from YouTube (titles + short descriptions):
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
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      const text = await aiRes.text();
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI failed", detail: text }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const raw = aiJson?.choices?.[0]?.message?.content ?? "{}";
    let parsed: { strengths?: string[]; criticisms?: string[]; feel?: string; headline?: string };
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { strengths: [], criticisms: [], feel: "", headline: "" };
    }

    const payload = {
      headline: parsed.headline ?? "",
      feel: parsed.feel ?? "",
      strengths: parsed.strengths ?? [],
      criticisms: parsed.criticisms ?? [],
    };
    memCache.set(cacheKey, { at: Date.now(), data: payload });

    if (db && body.carSlug) {
      await db.from("car_insights").upsert(
        {
          car_slug: body.carSlug,
          car_name: body.carName,
          headline: payload.headline,
          feel: payload.feel,
          strengths: payload.strengths,
          criticisms: payload.criticisms,
          source_signature: signature,
          source_count: body.videos.length,
          refreshed_at: new Date().toISOString(),
        },
        { onConflict: "car_slug" },
      );
    }

    return new Response(JSON.stringify({ ...payload, cached: "fresh" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
