import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-refresh-key",
};

const SYSTEM = `You are AutoVere — a calm, emotionally intelligent automotive editor.
You write short weekly reflections about cars: never hype, never clickbait, never sensational.
Tone: Scandinavian, sophisticated, human, quietly observational. Avoid superlatives.
Never invent specifications. Speak about feel, mood, ownership, intention.`;

const APPROVED = [
  { slug: "polestar-3", name: "Polestar 3" },
  { slug: "bmw-i5", name: "BMW i5" },
  { slug: "volvo-ex90", name: "Volvo EX90" },
  { slug: "mercedes-eqe", name: "Mercedes EQE" },
  { slug: "kia-ev9", name: "Kia EV9" },
];

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

  // Pick 2-3 cars to feature this week (rotating)
  const weekIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
  const start = weekIndex % APPROVED.length;
  const featured = [
    APPROVED[start],
    APPROVED[(start + 2) % APPROVED.length],
    APPROVED[(start + 4) % APPROVED.length],
  ];

  // Pull cached reviewer insights to ground the writing
  const { data: insights } = await db
    .from("car_insights")
    .select("car_slug, car_name, headline, feel, strengths, criticisms")
    .in(
      "car_slug",
      featured.map((c) => c.slug),
    );

  const grounding = (insights ?? [])
    .map(
      (i) =>
        `${i.car_name}\n  Consensus: ${i.headline ?? "—"}\n  Feel: ${i.feel ?? "—"}\n  Strengths: ${(Array.isArray(i.strengths) ? i.strengths : []).slice(0, 3).join("; ")}\n  Mixed: ${(Array.isArray(i.criticisms) ? i.criticisms : []).slice(0, 2).join("; ")}`,
    )
    .join("\n\n");

  const themes = [
    "the quiet luxury of restraint",
    "winter as a design philosophy",
    "the difference between fast and composed",
    "owning less, choosing better",
    "what stillness tells us about a car",
    "the new meaning of premium",
    "why calm is the new performance",
  ];
  const theme = themes[weekIndex % themes.length];

  const prompt = `Write this week's AutoVere editorial.

Theme: "${theme}"
Featured cars (use only these — never invent others):
${featured.map((c) => `- ${c.name}`).join("\n")}

Reviewer signals (already verified, you may reference these calmly):
${grounding || "No reviewer signals yet — write from feel and intention."}

Return strict JSON:
{
  "title": "evocative editorial title (max 9 words)",
  "dek": "one-sentence subheading (max 22 words)",
  "body": "3 short paragraphs (~80-110 words each) of calm, sophisticated reflection. Reference the featured cars naturally. No bullet points. No headings. No hype words like 'amazing', 'best', 'incredible'."
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
    return new Response(
      JSON.stringify({ error: "AI failed", status: aiRes.status }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const aiJson = await aiRes.json();
  const raw = aiJson?.choices?.[0]?.message?.content ?? "{}";
  let parsed: { title?: string; dek?: string; body?: string };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return new Response(JSON.stringify({ error: "Parse failed" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Quality gate — refuse weak output
  const banned = /amazing|incredible|best ever|game.?chang|revolution/i;
  const ok =
    typeof parsed.title === "string" &&
    parsed.title.length > 6 &&
    typeof parsed.dek === "string" &&
    parsed.dek.length > 12 &&
    typeof parsed.body === "string" &&
    parsed.body.length > 400 &&
    !banned.test(parsed.body) &&
    !banned.test(parsed.title);

  if (!ok) {
    return new Response(
      JSON.stringify({ status: "rejected", reason: "quality_gate" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const { error: insErr } = await db.from("editorial_pulse").insert({
    title: parsed.title,
    dek: parsed.dek,
    body: parsed.body,
    theme,
    featured_slugs: featured.map((c) => c.slug),
    status: "published",
  });
  if (insErr) {
    return new Response(JSON.stringify({ error: insErr.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ ok: true, theme, featured: featured.map((c) => c.slug) }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
