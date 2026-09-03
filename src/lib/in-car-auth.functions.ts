import { createHmac, timingSafeEqual } from "node:crypto";

import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

/**
 * Standalone credential gate for the confidential /partners/in-car showcase.
 * Deliberately independent of the Supabase user-auth system — this page is a
 * single shared executive-preview login, not a customer account.
 */
const COOKIE_NAME = "av_incar_session";
const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Deterministic, stateless session token — no server-side session store needed. */
function sessionToken(email: string, secret: string): string {
  return createHmac("sha256", secret).update(`in-car-access:${email.trim().toLowerCase()}`).digest("hex");
}

function expectedToken(): { token: string; email: string } | null {
  const email = process.env["IN_CAR_ADMIN_EMAIL"];
  const password = process.env["IN_CAR_ADMIN_PASSWORD"];
  if (!email || !password) return null;
  return { token: sessionToken(email, password), email };
}

const loginSchema = z.object({
  email: z.string().trim().min(1).max(200),
  password: z.string().min(1).max(200),
});

export const loginInCar = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => loginSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const configured = expectedToken();
    if (!configured) return { ok: false };

    const emailMatches = safeEqual(data.email.trim().toLowerCase(), configured.email.trim().toLowerCase());
    const password = process.env["IN_CAR_ADMIN_PASSWORD"] ?? "";
    const passwordMatches = safeEqual(data.password, password);
    if (!emailMatches || !passwordMatches) return { ok: false };

    setCookie(COOKIE_NAME, configured.token, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return { ok: true };
  });

export const checkInCarSession = createServerFn({ method: "GET" }).handler(async (): Promise<boolean> => {
  const configured = expectedToken();
  if (!configured) return false;
  const cookie = getCookie(COOKIE_NAME);
  if (!cookie) return false;
  return safeEqual(cookie, configured.token);
});

export const logoutInCar = createServerFn({ method: "POST" }).handler(async (): Promise<{ ok: true }> => {
  deleteCookie(COOKIE_NAME, { path: "/" });
  return { ok: true };
});
