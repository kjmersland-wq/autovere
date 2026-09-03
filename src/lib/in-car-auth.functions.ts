import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

/**
 * Standalone credential gate for the confidential /partners/in-car showcase.
 * Deliberately independent of the Supabase user-auth system — this page is a
 * single shared executive-preview login, not a customer account.
 *
 * Login itself is passwordless: requestInCarMagicLink emails a time-limited
 * (1 hour) link to the configured admin address, and verifyInCarMagicLink
 * validates it and opens the session. The password machinery below
 * (hashPassword/verifyPasswordHash) is unrelated to logging in — it's kept
 * only for changeInCarCredentials' "current password" re-verification step.
 *
 * Credentials live in a single-row Supabase table (in_car_admin_credentials,
 * service-role only — see supabase/migrations) so an admin can change the
 * email/password from inside the dashboard and have it survive restarts and
 * redeploys. The table is lazily bootstrapped from IN_CAR_ADMIN_EMAIL /
 * IN_CAR_ADMIN_PASSWORD on first use. If Supabase isn't configured (e.g. a
 * local dev environment without SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY), the
 * gate falls back to a pure env-var check, exactly as before — credential
 * changes just aren't available in that mode.
 */
const COOKIE_NAME = "av_incar_session";
const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPasswordHash(password: string, stored: string): boolean {
  const [salt, derived] = stored.split(":");
  if (!salt || !derived) return false;
  const attempt = scryptSync(password, salt, 64).toString("hex");
  return safeEqual(attempt, derived);
}

/** Deterministic session token — no server-side session store needed. */
function sessionToken(email: string, secret: string): string {
  return createHmac("sha256", secret).update(`in-car-access:${email.trim().toLowerCase()}`).digest("hex");
}

type DbCredentials = { email: string; passwordHash: string; sessionSecret: string };

async function loadDbCredentials(): Promise<DbCredentials | null> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // `in_car_admin_credentials` is intentionally not part of the generated
    // Database type (it's unrelated to the public user-auth schema), so this
    // one call is narrowly typed by hand instead of touching the shared,
    // auto-generated src/integrations/supabase/types.ts.
    const { data, error } = await (supabaseAdmin as unknown as { from: (t: string) => any })
      .from("in_car_admin_credentials")
      .select("email, password_hash, session_secret")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return null;
    return { email: data.email as string, passwordHash: data.password_hash as string, sessionSecret: data.session_secret as string };
  } catch {
    return null;
  }
}

async function saveDbCredentials(creds: DbCredentials): Promise<boolean> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as unknown as { from: (t: string) => any })
      .from("in_car_admin_credentials")
      .upsert(
        { id: 1, email: creds.email, password_hash: creds.passwordHash, session_secret: creds.sessionSecret, updated_at: new Date().toISOString() },
        { onConflict: "id" },
      );
    return !error;
  } catch {
    return false;
  }
}

async function bootstrapDbCredentials(): Promise<DbCredentials | null> {
  const email = process.env["IN_CAR_ADMIN_EMAIL"];
  const password = process.env["IN_CAR_ADMIN_PASSWORD"];
  if (!email || !password) return null;
  const creds: DbCredentials = { email, passwordHash: hashPassword(password), sessionSecret: randomBytes(32).toString("hex") };
  const saved = await saveDbCredentials(creds);
  return saved ? creds : null;
}

type EffectiveCredentials = { email: string; sessionSecret: string; verify: (password: string) => boolean; persisted: boolean };

async function getEffectiveCredentials(): Promise<EffectiveCredentials | null> {
  const db = (await loadDbCredentials()) ?? (await bootstrapDbCredentials());
  if (db) {
    return { email: db.email, sessionSecret: db.sessionSecret, verify: (pw) => verifyPasswordHash(pw, db.passwordHash), persisted: true };
  }
  const email = process.env["IN_CAR_ADMIN_EMAIL"];
  const password = process.env["IN_CAR_ADMIN_PASSWORD"];
  if (!email || !password) return null;
  return { email, sessionSecret: password, verify: (pw) => safeEqual(pw, password), persisted: false };
}

function setSessionCookie(email: string, sessionSecret: string) {
  setCookie(COOKIE_NAME, sessionToken(email, sessionSecret), {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

async function requireActiveSession(): Promise<EffectiveCredentials | null> {
  const creds = await getEffectiveCredentials();
  if (!creds) return null;
  const cookie = getCookie(COOKIE_NAME);
  if (!cookie || !safeEqual(cookie, sessionToken(creds.email, creds.sessionSecret))) return null;
  return creds;
}

const MAGIC_LINK_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Stateless magic-link token: base64url(JSON payload) + HMAC signature, signed
 * with the same session secret used for the session cookie itself. No token
 * storage is needed — expiry and authenticity are both verified from the
 * token's own contents, and rotating the session secret (e.g. via
 * changeInCarCredentials) invalidates any outstanding unused links too.
 */
function createMagicLinkToken(email: string, secret: string): string {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + MAGIC_LINK_TTL_MS })).toString("base64url");
  const sig = createHmac("sha256", secret).update(`magic:${payload}`).digest("hex");
  return `${payload}.${sig}`;
}

function verifyMagicLinkToken(token: string, expectedEmail: string, secret: string): boolean {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expectedSig = createHmac("sha256", secret).update(`magic:${payload}`).digest("hex");
  if (!safeEqual(sig, expectedSig)) return false;

  let parsed: { email?: unknown; exp?: unknown };
  try {
    parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return false;
  }
  if (typeof parsed.exp !== "number" || Date.now() > parsed.exp) return false;
  if (typeof parsed.email !== "string") return false;
  return safeEqual(parsed.email.trim().toLowerCase(), expectedEmail.trim().toLowerCase());
}

const magicLinkRequestSchema = z.object({
  email: z.string().trim().min(1).max(200),
});

export const requestInCarMagicLink = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => magicLinkRequestSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const creds = await getEffectiveCredentials();
    const restricted = { ok: false, error: "Access restricted to authorized executive emails." } as const;
    if (!creds) return restricted;

    const emailMatches = safeEqual(data.email.trim().toLowerCase(), creds.email.trim().toLowerCase());
    if (!emailMatches) return restricted;

    const token = createMagicLinkToken(creds.email, creds.sessionSecret);

    try {
      const { absUrl } = await import("@/lib/seo");
      const { sendMail } = await import("@/lib/smtp.server");
      const link = `${absUrl("/partners/in-car")}?token=${token}`;
      await sendMail({
        to: creds.email,
        fromName: "AutoVere / KM TECH LABS",
        subject: "Your AutoVere In-Car Intelligence access link",
        text: [
          "AutoVere In-Car Intelligence — Executive Preview",
          "",
          "Use the secure link below to enter the cockpit simulator. It's valid for 1 hour and tied to this email address only.",
          "",
          link,
          "",
          "If you didn't request this, you can safely ignore this email.",
          "",
          "— KM TECH LABS",
        ].join("\n"),
      });
    } catch {
      return { ok: false, error: "Couldn't send the access link — please try again shortly." };
    }

    return { ok: true };
  });

const magicLinkVerifySchema = z.object({
  token: z.string().trim().min(1).max(4000),
});

export const verifyInCarMagicLink = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => magicLinkVerifySchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const creds = await getEffectiveCredentials();
    if (!creds) return { ok: false };
    if (!verifyMagicLinkToken(data.token, creds.email, creds.sessionSecret)) return { ok: false };

    setSessionCookie(creds.email, creds.sessionSecret);
    return { ok: true };
  });

export const checkInCarSession = createServerFn({ method: "GET" }).handler(async (): Promise<boolean> => {
  const active = await requireActiveSession();
  return active !== null;
});

export const logoutInCar = createServerFn({ method: "POST" }).handler(async (): Promise<{ ok: true }> => {
  deleteCookie(COOKIE_NAME, { path: "/" });
  return { ok: true };
});

const changeCredentialsSchema = z
  .object({
    currentPassword: z.string().min(1).max(200),
    newEmail: z.string().trim().email().max(200),
    newPassword: z.string().min(10).max(200),
    confirmPassword: z.string().min(1).max(200),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "New password and confirmation do not match.",
    path: ["confirmPassword"],
  });

export const changeInCarCredentials = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => changeCredentialsSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const active = await requireActiveSession();
    if (!active) return { ok: false, error: "Your session has expired — please log in again." };

    if (!active.verify(data.currentPassword)) {
      return { ok: false, error: "Current password is incorrect." };
    }

    if (!active.persisted) {
      return {
        ok: false,
        error: "Credential updates require Supabase to be configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).",
      };
    }

    const next: DbCredentials = {
      email: data.newEmail,
      passwordHash: hashPassword(data.newPassword),
      // Rotating the session secret invalidates every other active session
      // signed with the old one, while the fresh cookie set below keeps the
      // admin making this change signed in.
      sessionSecret: randomBytes(32).toString("hex"),
    };
    const saved = await saveDbCredentials(next);
    if (!saved) return { ok: false, error: "Couldn't save the new credentials — please try again." };

    setSessionCookie(next.email, next.sessionSecret);
    return { ok: true };
  });
