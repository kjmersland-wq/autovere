// Shared rate limiter — service-role only.
// Uses the public.check_rate_limit() Postgres function.
import { createClient } from "npm:@supabase/supabase-js@2";

let _client: ReturnType<typeof createClient> | null = null;
function getServiceClient() {
  if (_client) return _client;
  _client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
  return _client;
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
}

/**
 * Returns true if the request is allowed; false if the limit was exceeded.
 * Fails open on infrastructure errors (so a DB hiccup doesn't break the function).
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds = 60,
): Promise<boolean> {
  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      _key: key,
      _max_requests: maxRequests,
      _window_seconds: windowSeconds,
    });
    if (error) {
      console.error("rate-limit rpc error:", error);
      return true; // fail open
    }
    return data === true;
  } catch (e) {
    console.error("rate-limit exception:", e);
    return true;
  }
}

export function rateLimitResponse(corsHeaders: Record<string, string>, retryAfter = 60) {
  return new Response(
    JSON.stringify({ ok: false, error: "Too many requests. Please try again in a moment." }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
      },
    },
  );
}
