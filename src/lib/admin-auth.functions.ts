import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

export type AdminAccessResult =
  | { status: "unauthenticated" }
  | { status: "unauthorized" }
  | { status: "ok" }
  | { status: "error"; message: string };

/**
 * Standalone Admin access check, independent of any dashboard/data code.
 * Deliberately never throws: every outcome — no session, invalid token,
 * valid session but not an admin, or an unexpected failure — comes back as
 * a plain, explicit result instead of relying on server-fn error
 * propagation (thrown errors inside a server function are transported
 * inside a normal 200 response by this framework, which is what made the
 * previous Admin's failures indistinguishable from the client). Returning
 * a discriminated result here keeps the four states testable on their own.
 */
export const checkAdminAccess = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminAccessResult> => {
    try {
      const SUPABASE_URL = process.env["SUPABASE_URL"];
      const SUPABASE_PUBLISHABLE_KEY = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["SUPABASE_ANON_KEY"];
      if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
        return { status: "error", message: "Supabase er ikke riktig konfigurert på serveren." };
      }

      const authHeader = getRequest()?.headers.get("authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return { status: "unauthenticated" };
      }
      const token = authHeader.slice("Bearer ".length);
      if (!token) {
        return { status: "unauthenticated" };
      }

      const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        global: {
          fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
          headers: { Authorization: `Bearer ${token}` },
        },
        auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      });

      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (userError || !userData.user) {
        return { status: "unauthenticated" };
      }

      const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      if (roleError) {
        return { status: "error", message: "Kunne ikke bekrefte admin-rollen." };
      }

      return isAdmin ? { status: "ok" } : { status: "unauthorized" };
    } catch {
      return { status: "error", message: "Uventet feil under autentisering." };
    }
  },
);
