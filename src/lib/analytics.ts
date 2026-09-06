import { supabase } from "@/integrations/supabase/client";
import { getVisitorGeo } from "@/lib/admin.functions";

const SESSION_KEY = "autovere.sessionId";

let geoPromise: Promise<{ country: string | null; city: string | null }> | null = null;

function sessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

function regionFor(path: string) {
  if (path === "/us" || path.startsWith("/us/")) return "us";
  if (path === "/ca" || path.startsWith("/ca/")) return "ca";
  return "eu";
}

function localeFor(path: string) {
  const seg = path.split("/")[1] ?? "";
  return ["no", "se", "dk", "fi", "us", "de", "nl", "fr", "pl", "es", "it", "pt"].includes(seg) ? seg : "en";
}

function deviceType() {
  if (typeof window === "undefined") return null;
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

/** Records one page view. Safe to call on every client-side navigation. */
export async function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  try {
    geoPromise ??= getVisitorGeo().catch(() => ({ country: null, city: null }));
    const geo = await geoPromise;
    await supabase.from("page_views").insert({
      path,
      region: regionFor(path),
      locale: localeFor(path),
      country: geo.country,
      city: geo.city,
      referrer: document.referrer ? new URL(document.referrer).hostname : null,
      device: deviceType(),
      session_id: sessionId(),
    });
  } catch {
    /* analytics must never break the app */
  }
}
