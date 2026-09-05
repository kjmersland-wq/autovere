import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * /partners/in-car auth: standard Supabase Auth (real auth.users accounts),
 * restricted to a single configured administrator email. Supabase's own
 * built-in email delivery sends the invite / magic sign-in links — no
 * custom SMTP transport involved, so delivery no longer depends on
 * GMAIL_USER/GMAIL_APP_PASSWORD being configured.
 *
 * The browser holds the resulting session exactly like any other AutoVere
 * account (src/lib/auth.tsx's useAuth() / supabase.auth), since this is now
 * the same Supabase Auth system the public site uses. Because of that, this
 * file's job is narrow:
 *   - requestInCarAccess: checks the submitted email against
 *     IN_CAR_ADMIN_EMAIL, then asks Supabase to email either an invite
 *     (brand-new admin — link lets them set an initial password) or a magic
 *     sign-in link (returning admin who already has one).
 *   - checkInCarAuthorized: server-side re-verification, via the existing
 *     requireSupabaseAuth middleware, that the signed-in Supabase user
 *     really is the configured admin. This must never be trusted from the
 *     client alone — the same Supabase project also serves regular AutoVere
 *     customer accounts, and a customer who happens to be logged in
 *     elsewhere must not be treated as authorized here.
 *
 * Changing email/password once inside is just supabase.auth.updateUser(),
 * called directly from the client (InCarShowcase.tsx) — no server function
 * needed for that.
 */

/** Owner account, plus any extra emails configured via IN_CAR_ADMIN_EMAIL (comma-separated). */
const DEFAULT_ADMIN_EMAILS = ["kjmersland@gmail.com"];

function getAdminEmails(): string[] {
  const configured = (process.env["IN_CAR_ADMIN_EMAIL"] ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...configured]));
}

function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email.trim().toLowerCase());
}

const requestAccessSchema = z.object({
  email: z.string().trim().email().max(200),
});

export const requestInCarAccess = createServerFn({ method: "POST" })
  .validator((data: unknown) => requestAccessSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const adminEmail = data.email.trim().toLowerCase();
    const restricted = { ok: false, error: "Access restricted to authorized executive emails." } as const;
    if (!isAdminEmail(adminEmail)) return restricted;


    try {
      const { absUrl } = await import("@/lib/seo");
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const redirectTo = absUrl("/partners/in-car");

      // Brand-new admin: this creates the account and emails an invite link
      // that lets them set their initial password. If the account already
      // exists, inviteUserByEmail errors — fall back to a magic sign-in
      // link for a returning admin who already has a password set.
      const invite = await supabaseAdmin.auth.admin.inviteUserByEmail(adminEmail, { redirectTo });
      if (invite.error) {
        const otp = await supabaseAdmin.auth.signInWithOtp({
          email: adminEmail,
          options: { emailRedirectTo: redirectTo, shouldCreateUser: false },
        });
        if (otp.error) {
          return { ok: false, error: "Couldn't send the access link — please try again shortly." };
        }
      }
    } catch {
      return { ok: false, error: "Couldn't send the access link — please try again shortly." };
    }

    return { ok: true };
  });

export const checkInCarAuthorized = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<boolean> => {
    const email = context.claims.email;
    return typeof email === "string" && isAdminEmail(email);
  });
