import type { IncomingMessage, ServerResponse } from "node:http";
import nodemailer from "nodemailer";
import { authBaseUrl, createMagicToken } from "../src/lib/auth";

type Request = IncomingMessage & { body?: { email?: unknown } | string };
type Response = ServerResponse & { status: (code: number) => Response; json: (body: unknown) => void };

function parseBody(body: Request["body"]): { email?: unknown } {
  if (typeof body === "string") {
    try { return JSON.parse(body) as { email?: unknown }; } catch { return {}; }
  }
  return body ?? {};
}

export default async function handler(request: Request, response: Response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { email: rawEmail } = parseBody(request.body);
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 320) {
    response.status(400).json({ error: "Enter a valid email address." });
    return;
  }
  if (!process.env["GMAIL_USER"] || !process.env["GMAIL_APP_PASSWORD"] || !process.env["AUTH_TOKEN_SECRET"]) {
    response.status(500).json({ error: "Login email is not configured." });
    return;
  }
  const link = `${authBaseUrl(new RequestObject(request))}/api/verify-login?token=${encodeURIComponent(createMagicToken(email))}`;
  try {
    await nodemailer.createTransport({ service: "gmail", auth: { user: process.env["GMAIL_USER"], pass: process.env["GMAIL_APP_PASSWORD"] } }).sendMail({
      from: process.env["GMAIL_USER"],
      to: email,
      subject: "Your AutoVere login link",
      text: `Use this link to sign in to AutoVere. It expires in 15 minutes:\n\n${link}`,
      html: `<p>Use this link to sign in to AutoVere. It expires in 15 minutes:</p><p><a href="${link}">Sign in to AutoVere</a></p>`,
    });
    response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Magic link email failed", error);
    response.status(500).json({ error: "Could not send the login email." });
  }
}

class RequestObject extends Request {
  constructor(request: Request) {
    super(request);
  }
}
