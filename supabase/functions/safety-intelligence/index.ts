import { PremiumAuthError, premiumJsonError, requirePremiumUser } from "../_shared/premium.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const cache = new Map<string, { at: number; data: unknown }>();
const TTL_MS = 1000 * 60 * 60 * 24 * 3; // 3 days

type ReqBody = {
  carName: string;
  carType?: string;
  context?: string; // brief lifestyle/climate context
};

const SYSTEM = `You are Lumen, a calm, emotionally intelligent automotive advisor.
You synthesise public information about a vehicle's safety performance and ownership reality
from widely-known sources (Euro NCAP, IIHS, NHTSA, owner communities, expert reviewers, recall databases).

Tone rules — these are absolute:
- Calm, sophisticated, human, never robotic.
- Never sensationalist. Never fear-based. Never dramatic.
- Translate technical safety into how it FEELS in real-world driving.
- For criticisms: balanced awareness, not warnings. Phrase as "owners occasionally mention" or "may take adjustment".
- Never invent specific recall numbers, fatality stats, or precise scores. Speak in qualitative consensus.
- Never copy reviewer wording. Synthesise.
- Always attribute implicitly: "Based on reviewer consensus", "Frequently mentioned by owners", "Based on public safety testing".`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const requestId = crypto.randomUUID();

  try {
    if (req.method !== "POST") {
      return premiumJsonError(405, "invalid_request", "Method not allowed.", requestId, undefined, corsHeaders);
    }
    const auth = await requirePremiumUser(req, requestId);
    console.info("safety-intelligence premium request", { requestId: auth.requestId, userId: auth.userId });

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return premiumJsonError(
        500,
        "provider_not_configured",
        "LOVABLE_API_KEY not configured",
        requestId,
        undefined,
        corsHeaders,
      );
    }

    const body = (await req.json()) as ReqBody;
    if (!body?.carName) {
      return premiumJsonError(400, "invalid_request", "Missing carName", requestId, undefined, corsHeaders);
    }

    const cacheKey = `${body.carName}|${body.carType ?? ""}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.at < TTL_MS) {
      return new Response(JSON.stringify({ ...(cached.data as object), cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userPrompt = `Vehicle: ${body.carName}${body.carType ? ` (${body.carType})` : ""}
${body.context ? `Context: ${body.context}` : ""}

Synthesise calm, premium-quality safety + ownership intelligence based on public consensus
from Euro NCAP / IIHS / NHTSA / owner communities / trusted reviewers.

Use the extract_intelligence tool. All strings must be calm, human, never dramatic.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_intelligence",
              description: "Return calm, synthesised safety + ownership intelligence.",
              parameters: {
                type: "object",
                properties: {
                  safetyHeadline: {
                    type: "string",
                    description: "One short calm sentence (max 18 words) capturing the safety story.",
                  },
                  safetySummary: {
                    type: "string",
                    description: "1-2 sentences translating safety performance into how it FEELS to drive.",
                  },
                  safetyDimensions: {
                    type: "array",
                    description: "5-7 calm dimensions of safety/confidence.",
                    items: {
                      type: "object",
                      properties: {
                        label: {
                          type: "string",
                          enum: [
                            "Family safety",
                            "Highway confidence",
                            "Winter confidence",
                            "City visibility",
                            "Pedestrian safety",
                            "Active assistance",
                            "Braking confidence",
                            "Child safety",
                          ],
                        },
                        rating: { type: "string", enum: ["Excellent", "Strong", "Good", "Mixed"] },
                        note: { type: "string", description: "1 short calm sentence." },
                      },
                      required: ["label", "rating", "note"],
                      additionalProperties: false,
                    },
                  },
                  ownersLove: {
                    type: "array",
                    description: "3-5 things owners frequently love (calm, specific).",
                    items: { type: "string" },
                  },
                  ownersMention: {
                    type: "array",
                    description: "2-4 commonly mentioned frustrations or considerations (balanced, not dramatic).",
                    items: { type: "string" },
                  },
                  bestSuitedFor: {
                    type: "array",
                    description: "3-4 lifestyle/use-case fits.",
                    items: { type: "string" },
                  },
                  lessIdealFor: {
                    type: "array",
                    description: "2-3 mismatches, phrased calmly.",
                    items: { type: "string" },
                  },
                  worthKnowing: {
                    type: "array",
                    description: "3-4 calm pieces of pre-purchase awareness.",
                    items: { type: "string" },
                  },
                  winterNotes: {
                    type: "string",
                    description: "1-2 sentences on winter/cold-weather behaviour.",
                  },
                  longTermOutlook: {
                    type: "string",
                    description: "1-2 sentences on long-term ownership expectations.",
                  },
                  sources: {
                    type: "array",
                    description: "Source categories used (e.g. 'Euro NCAP', 'Owner reviews', 'IIHS').",
                    items: { type: "string" },
                  },
                },
                required: [
                  "safetyHeadline",
                  "safetySummary",
                  "safetyDimensions",
                  "ownersLove",
                  "ownersMention",
                  "bestSuitedFor",
                  "lessIdealFor",
                  "worthKnowing",
                  "winterNotes",
                  "longTermOutlook",
                  "sources",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_intelligence" } },
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
    const toolCall = aiJson?.choices?.[0]?.message?.tool_calls?.[0];
    const argsRaw = toolCall?.function?.arguments ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(argsRaw);
    } catch {
      parsed = {};
    }

    cache.set(cacheKey, { at: Date.now(), data: parsed });

    console.info("safety-intelligence success", {
      requestId: auth.requestId,
      userId: auth.userId,
      carName: body.carName,
      cached: false,
    });

    return new Response(JSON.stringify({ ...(parsed as object), cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    if (e instanceof PremiumAuthError) {
      console.error("safety-intelligence premium auth failed", {
        requestId,
        code: e.code,
        details: e.details,
      });
      return premiumJsonError(e.status, e.code, e.message, requestId, e.details, corsHeaders);
    }
    console.error("safety-intelligence failed", { requestId, error: e });
    return new Response(JSON.stringify({ error: (e as Error).message, requestId }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
