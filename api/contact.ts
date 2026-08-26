import nodemailer from "nodemailer";
import type { IncomingMessage, ServerResponse } from "node:http";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

type VercelRequest = IncomingMessage & { body?: ContactBody | string };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => VercelResponse;
};

const recipient = "kjmersland@gmail.com";

function textValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}

function parseBody(body: VercelRequest["body"]): ContactBody {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as ContactBody;
    } catch {
      return {};
    }
  }
  return body ?? {};
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = parseBody(request.body);
  const name = textValue(body.name);
  const email = textValue(body.email);
  const subject = textValue(body.subject) || "Ingen emne";
  const message = textValue(body.message);

  if (!name || !email || !message) {
    response.status(400).json({ error: "Navn, e-post og melding er påkrevd." });
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 320) {
    response.status(400).json({ error: "Oppgi en gyldig e-postadresse." });
    return;
  }
  if (name.length > 160 || subject.length > 200 || message.length > 10000) {
    response.status(400).json({ error: "Meldingen er for lang." });
    return;
  }
  if (!process.env["GMAIL_USER"] || !process.env["GMAIL_APP_PASSWORD"]) {
    console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variable");
    response.status(500).json({ error: "E-posttjenesten er ikke konfigurert ennå." });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env["GMAIL_USER"],
      pass: process.env["GMAIL_APP_PASSWORD"],
    },
  });
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br />");

  try {
    await transporter.sendMail({
      from: process.env["GMAIL_USER"],
      to: recipient,
      replyTo: email,
      subject: `[AUTOVERE Henvendelse] ${subject}`,
      text: `Navn: ${name}\nE-post: ${email}\n\n${message}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033"><h2>AutoVere-henvendelse</h2><p><strong>Navn:</strong> ${safeName}</p><p><strong>E-post:</strong> ${safeEmail}</p><p><strong>Emne:</strong> ${safeSubject}</p><hr /><p>${safeMessage}</p></div>`,
    });
    response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact email failed", error);
    response.status(500).json({ error: "Kunne ikke sende meldingen akkurat nå." });
  }
}
