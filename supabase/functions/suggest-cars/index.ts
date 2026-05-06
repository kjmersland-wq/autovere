import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-refresh-key",
};

const SYSTEM = `You are AutoVere — calm, sophisticated automotive curator.
Your job is to propose a few NEW vehicles that would belong in AutoVere's library.
Criteria: vehicles must feel emotionally intelligent, refined, calm, premium, or quietly capable.
Reject: hype cars, gimmicky EVs, anything sensational, anything not currently sold or imminently launching.
Tone of every "why_it_fits": Scandinavian, observational, never marketing speak.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const REFRESH_KEY = Deno.env.get("INSIGHTS_REFRESH_KEY");
  const provided =
    req.headers.get("x-refresh-key") ?? new URL(req.url).searchParams.get("key");
  if (!REFRESH_KEY || provided !== REFRESH_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!LOVABLE_API_KEY || !SUPABASE_URL || !SERVICE_KEY) {
    return new Response(JSON.stringify({ error: "Missing environment" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const db = createClient(SUPABASE_URL, SERVICE_KEY);

  // Pull existing brand/model fingerprints to avoid duplicates
  const { data: pending } = await db
    .from("car_suggestions")
    .select("brand, name");
  const existingFingerprints = new Set(
    (pending ?? []).map((p) => `${p.brand} ${p.name}`.toLowerCase()),
  );

  const prompt = `Propose 3 new vehicles to add to AutoVere.
Avoid these (already pending or in library): ${[...existingFingerprints].slice(0, 30).join(", ") || "(none yet)"}

Return strict JSON:
{
  "suggestions": [
    {
      "brand": "Manufacturer",
      "name": "Model name only (no brand prefix)",
      "type": "e.g. Executive EV Sedan / Family Electric SUV / Luxury Hybrid Sedan",
      "why_it_fits": "2-3 calm sentences, AutoVere voice",
      "fit_themes": ["quiet-luxury", "winter-confidence", ...],
      "confidence": 0.0-1.0
    }
  ]
}
Only the JSON.`;

  const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!aiRes.ok) {
    return new Response(JSON.stringify({ error: "AI failed", status: aiRes.status }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const aiJson = await aiRes.json();
  const raw = aiJson?.choices?.[0]?.message?.content ?? "{}";
  let parsed: { suggestions?: Array<{ brand?: string; name?: string; type?: string; why_it_fits?: string; fit_themes?: string[]; confidence?: number }> };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return new Response(JSON.stringify({ error: "Parse failed" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const inserted: string[] = [];
  for (const s of parsed.suggestions ?? []) {
    if (!s.brand || !s.name || !s.type || !s.why_it_fits) continue;
    if (typeof s.confidence === "number" && s.confidence < 0.6) continue;
    const fp = `${s.brand} ${s.name}`.toLowerCase();
    if (existingFingerprints.has(fp)) continue;

    const { error } = await db.from("car_suggestions").insert({
      brand: s.brand,
      name: s.name,
      type: s.type,
      why_it_fits: s.why_it_fits,
      fit_themes: Array.isArray(s.fit_themes) ? s.fit_themes : [],
      confidence: s.confidence ?? 0.7,
      status: "pending",
    });
    if (!error) {
      inserted.push(fp);
      existingFingerprints.add(fp);
    }
  }

  return new Response(
    JSON.stringify({ ok: true, inserted_count: inserted.length, inserted }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
