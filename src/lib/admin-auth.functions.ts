import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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

export type AdminSupabaseContext =
  | { ok: true; supabase: SupabaseClient<Database>; userId: string }
  | { ok: false; result: Exclude<AdminAccessResult, { status: "ok" }> };

/**
 * Shared Admin authorization check, reused by checkAdminAccess() and every
 * Admin data function in admin-data.functions.ts. Deliberately never throws:
 * every outcome — no session, invalid token, valid session but not an admin,
 * or an unexpected failure — comes back as a plain, explicit result instead
 * of relying on server-fn error propagation (thrown errors inside a server
 * function are transported inside a normal 200 response by this framework,
 * which is what made the previous Admin's failures indistinguishable from
 * the client). This keeps every caller's four states testable on their own,
 * and centralizes the auth/role check in one place instead of duplicating
 * it per data function.
 */
export const getAdminSupabaseContext = createServerOnlyFn(async (): Promise<AdminSupabaseContext> => {
  try {
    // The reserved SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY runtime secrets are not
    // provisioned in this Lovable Cloud project (confirmed: the Secrets UI rejects
    // creating them, and the plain process.env lookup below is empty in production).
    // VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY are the Lovable-managed values
    // that already work for the browser client (src/integrations/supabase/client.ts
    // uses the same import.meta.env-first pattern). Neither value is secret — the
    // publishable/anon key and project URL are meant to be public by Supabase's own
    // design (unlike the service-role key) and are already shipped, in the clear,
    // inside every visitor's browser bundle. The literal fallback below is that same
    // already-public value, used only so this admin-only check never depends on
    // guessing which env var name a given build/runtime environment happens to expose.
    const SUPABASE_URL =
      import.meta.env["VITE_SUPABASE_URL"] ||
      process.env["SUPABASE_URL"] ||
      "https://idjkeokjhfusbwrnfkat.supabase.co";
    const SUPABASE_PUBLISHABLE_KEY =
      import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
      process.env["SUPABASE_PUBLISHABLE_KEY"] ||
      process.env["SUPABASE_ANON_KEY"] ||
      "sb_publishable_Uo59cZvvR8vZpJyXR1gp0w_3vmKXO55";
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      return {
        ok: false,
        result: { status: "error", message: "Supabase er ikke riktig konfigurert på serveren." },
      };
    }

    const authHeader = getRequest()?.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return { ok: false, result: { status: "unauthenticated" } };
    }
    const token = authHeader.slice("Bearer ".length);
    if (!token) {
      return { ok: false, result: { status: "unauthenticated" } };
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
      return { ok: false, result: { status: "unauthenticated" } };
    }

    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (roleError) {
      return { ok: false, result: { status: "error", message: "Kunne ikke bekrefte admin-rollen." } };
    }
    if (!isAdmin) {
      return { ok: false, result: { status: "unauthorized" } };
    }

    return { ok: true, supabase, userId: userData.user.id };
  } catch {
    return { ok: false, result: { status: "error", message: "Uventet feil under autentisering." } };
  }
});

export const checkAdminAccess = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminAccessResult> => {
    const ctx = await getAdminSupabaseContext();
    return ctx.ok ? { status: "ok" } : ctx.result;
  },
);
