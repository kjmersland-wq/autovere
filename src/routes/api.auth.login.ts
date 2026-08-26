import { createFileRoute } from "@tanstack/react-router";
import nodemailer from "nodemailer";
import { authBaseUrl, createMagicToken } from "@/lib/auth";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { email?: unknown };
        try { body = (await request.json()) as { email?: unknown }; } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 320) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.AUTH_TOKEN_SECRET) return Response.json({ error: "Login email is not configured." }, { status: 500 });
        const link = `${authBaseUrl(request)}/api/auth/verify?token=${encodeURIComponent(createMagicToken(email))}`;
        try {
          await nodemailer.createTransport({ service: "gmail", auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } }).sendMail({ from: process.env.GMAIL_USER, to: email, subject: "Your AutoVere login link", text: `Use this link to sign in to AutoVere. It expires in 15 minutes:\n\n${link}`, html: `<p>Use this link to sign in to AutoVere. It expires in 15 minutes:</p><p><a href="${link}">Sign in to AutoVere</a></p>` });
          return Response.json({ ok: true });
        } catch (error) { console.error("Magic link email failed", error); return Response.json({ error: "Could not send the login email." }, { status: 500 }); }
      },
    },
  },
});