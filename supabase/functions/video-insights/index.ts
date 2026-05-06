const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Per-isolate cache to keep things calm and cheap
const cache = new Map<string, { at: number; data: unknown }>();
const TTL_MS = 1000 * 60 * 60 * 24; // 24h

type ReqBody = {
  carName: string;
  videos: { title: string; channel: string; description?: string }[];
};

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

    const cacheKey = `${body.carName}|${body.videos.map((v) => v.title).join("|").slice(0, 400)}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.at < TTL_MS) {
      return new Response(JSON.stringify({ ...(cached.data as object), cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const reviewBlock = body.videos
      .slice(0, 12)
      .map(
        (v, i) =>
          `${i + 1}. [${v.channel}] ${v.title}${v.description ? ` — ${v.description.slice(0, 280)}` : ""}`,
      )
      .join("\n");

    const system = `You are Lumen, a calm, emotionally intelligent automotive advisor.
You synthesise honest reviewer consensus from YouTube titles and descriptions.
Tone: human, calm, sophisticated, never robotic, never marketing-speak.
Never invent facts not implied by the inputs. If unsure, say "reviewers are mixed".`;

    const user = `Car: ${body.carName}

Recent expert review signals from YouTube (titles + short descriptions):
${reviewBlock}

Return strict JSON with this shape:
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
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { strengths: [], criticisms: [], feel: "", headline: "" };
    }

    cache.set(cacheKey, { at: Date.now(), data: parsed });

    return new Response(JSON.stringify({ ...(parsed as object), cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
