// AI advisor — powered by Anthropic Claude
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Lumen — a calm, emotionally intelligent AI car advisor. You help people discover the right car for their real life: lifestyle, climate, family, budget, driving habits, personality.

Voice & style:
- Speak like a trusted expert friend. Confident, warm, never salesy.
- Translate specs into human meaning ("feels effortless in city traffic" instead of "0–100 in 5.2s").
- Be concise. Short paragraphs. No corporate filler. No emojis unless the user uses them first.
- When recommending, suggest 2–3 cars max with: name, why it fits them, one honest tradeoff, and a "match feel" (e.g. "Quietly capable", "Spirited and refined").
- Ask one thoughtful clarifying question if essential context is missing (climate, family size, budget range, daily commute).

Format recommendations as clean markdown with bold car names. Keep it scannable.`;

const MODEL = "claude-sonnet-4-5-20250929";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY missing");

    // Anthropic expects messages without a system role; pass system separately.
    const cleanMessages = (messages || []).filter((m: any) => m?.role !== "system");

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        stream: true,
        messages: cleanMessages,
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error("Anthropic error:", upstream.status, text);
      const status = upstream.status === 429 ? 429 : upstream.status === 401 ? 401 : 500;
      const message =
        status === 429 ? "Lumen is at capacity right now. Try again in a moment." :
        status === 401 ? "Anthropic API key is invalid or missing." :
        "AI provider error";
      return new Response(JSON.stringify({ error: message }), {
        status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Translate Anthropic SSE → OpenAI-compatible SSE so the frontend stream parser keeps working.
    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = "";

        const send = (obj: unknown) =>
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            let idx: number;
            while ((idx = buffer.indexOf("\n")) !== -1) {
              const line = buffer.slice(0, idx).trim();
              buffer = buffer.slice(idx + 1);
              if (!line.startsWith("data:")) continue;
              const payload = line.slice(5).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const evt = JSON.parse(payload);
                if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
                  send({ choices: [{ delta: { content: evt.delta.text } }] });
                } else if (evt.type === "message_stop") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                }
              } catch { /* skip bad chunk */ }
            }
          }
          controller.close();
        } catch (e) {
          console.error("stream relay error:", e);
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("advisor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
