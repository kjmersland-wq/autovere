import type { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID, randomBytes, scryptSync } from "node:crypto";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { neon } from "@neondatabase/serverless";

type VercelRequest = IncomingMessage & { body?: unknown };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

export const config = { api: { bodyParser: false } };

function getStripe() {
  const secret = process.env["STRIPE_SECRET_KEY"];
  return secret ? new Stripe(secret) : null;
}

function authBaseUrl(): string {
  const raw = (process.env["AUTH_BASE_URL"] || process.env["NEXT_PUBLIC_SITE_URL"] || "https://autovere.com").trim();
  const embedded = raw.match(/https?:\/\/[^\s\])'"]+/);
  const configured = (embedded ? embedded[0] : raw.replace(/^['"]|['"]$/g, "").trim()).replace(/\/$/, "");
  return /^https?:\/\//.test(configured) ? configured : `https://${configured}`;
}

function escapeHtmlAttr(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function generateTempPassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = randomBytes(14);
  let out = "";
  for (const byte of bytes) out += alphabet[byte % alphabet.length];
  return out;
}

type WelcomeCopy = { subject: string; heading: string; intro: string; emailLabel: string; passwordLabel: string; loginButton: string; changePasswordNote: string; footer: string };

const WELCOME_COPY: Record<string, WelcomeCopy> = {
  en: {
    subject: "Welcome to AutoVere Pro — your login details",
    heading: "Welcome to AutoVere Pro",
    intro: "Your subscription is active. Here is your AutoVere account:",
    emailLabel: "Email",
    passwordLabel: "Temporary password",
    loginButton: "Log in to AutoVere",
    changePasswordNote: "For your security, please log in and set your own password under Account → Profile & Security.",
    footer: "If you did not make this purchase, please contact support immediately.",
  },
  de: {
    subject: "Willkommen bei AutoVere Pro — deine Zugangsdaten",
    heading: "Willkommen bei AutoVere Pro",
    intro: "Dein Abo ist aktiv. Hier sind deine AutoVere-Zugangsdaten:",
    emailLabel: "E-Mail",
    passwordLabel: "Temporäres Passwort",
    loginButton: "Bei AutoVere anmelden",
    changePasswordNote: "Bitte melde dich an und lege aus Sicherheitsgründen unter Konto → Profil & Sicherheit dein eigenes Passwort fest.",
    footer: "Falls du diesen Kauf nicht getätigt hast, kontaktiere bitte umgehend den Support.",
  },
  nl: {
    subject: "Welkom bij AutoVere Pro — je inloggegevens",
    heading: "Welkom bij AutoVere Pro",
    intro: "Je abonnement is actief. Dit zijn je AutoVere-inloggegevens:",
    emailLabel: "E-mail",
    passwordLabel: "Tijdelijk wachtwoord",
    loginButton: "Inloggen bij AutoVere",
    changePasswordNote: "Log voor je veiligheid in en stel je eigen wachtwoord in via Account → Profiel & beveiliging.",
    footer: "Heb je deze aankoop niet gedaan, neem dan direct contact op met support.",
  },
  no: {
    subject: "Velkommen til AutoVere Pro — innloggingen din",
    heading: "Velkommen til AutoVere Pro",
    intro: "Abonnementet ditt er aktivt. Her er AutoVere-kontoen din:",
    emailLabel: "E-post",
    passwordLabel: "Midlertidig passord",
    loginButton: "Logg inn på AutoVere",
    changePasswordNote: "Av sikkerhetshensyn bør du logge inn og sette ditt eget passord under Min side → Profil og sikkerhet.",
    footer: "Hvis du ikke har gjort dette kjøpet, ta kontakt med support umiddelbart.",
  },
  pl: {
    subject: "Witamy w AutoVere Pro — dane logowania",
    heading: "Witamy w AutoVere Pro",
    intro: "Twoja subskrypcja jest aktywna. Oto dane do Twojego konta AutoVere:",
    emailLabel: "E-mail",
    passwordLabel: "Hasło tymczasowe",
    loginButton: "Zaloguj się do AutoVere",
    changePasswordNote: "Dla bezpieczeństwa zaloguj się i ustaw własne hasło w sekcji Konto → Profil i bezpieczeństwo.",
    footer: "Jeśli nie dokonałeś/aś tego zakupu, natychmiast skontaktuj się z pomocą techniczną.",
  },
  sv: {
    subject: "Välkommen till AutoVere Pro — dina inloggningsuppgifter",
    heading: "Välkommen till AutoVere Pro",
    intro: "Din prenumeration är aktiv. Här är ditt AutoVere-konto:",
    emailLabel: "E-post",
    passwordLabel: "Tillfälligt lösenord",
    loginButton: "Logga in på AutoVere",
    changePasswordNote: "Av säkerhetsskäl bör du logga in och ange ett eget lösenord under Mitt konto → Profil och säkerhet.",
    footer: "Om du inte gjorde det här köpet, kontakta supporten omedelbart.",
  },
  fr: {
    subject: "Bienvenue sur AutoVere Pro — vos identifiants",
    heading: "Bienvenue sur AutoVere Pro",
    intro: "Votre abonnement est actif. Voici votre compte AutoVere :",
    emailLabel: "E-mail",
    passwordLabel: "Mot de passe temporaire",
    loginButton: "Se connecter à AutoVere",
    changePasswordNote: "Par sécurité, connectez-vous et définissez votre propre mot de passe dans Compte → Profil et sécurité.",
    footer: "Si vous n'êtes pas à l'origine de cet achat, contactez immédiatement le support.",
  },
  da: {
    subject: "Velkommen til AutoVere Pro — dine loginoplysninger",
    heading: "Velkommen til AutoVere Pro",
    intro: "Dit abonnement er aktivt. Her er din AutoVere-konto:",
    emailLabel: "E-mail",
    passwordLabel: "Midlertidig adgangskode",
    loginButton: "Log ind på AutoVere",
    changePasswordNote: "Af sikkerhedsmæssige årsager bør du logge ind og angive din egen adgangskode under Konto → Profil og sikkerhed.",
    footer: "Hvis du ikke har foretaget dette køb, bedes du straks kontakte support.",
  },
};

const DEFAULT_WELCOME_COPY = WELCOME_COPY["en"] as WelcomeCopy;

function welcomeCopyFor(locale: string | undefined): WelcomeCopy {
  return WELCOME_COPY[locale ?? ""] ?? DEFAULT_WELCOME_COPY;
}

async function provisionPasswordAccount(email: string, locale: string | undefined) {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) return;
  try {
    const sql = neon(databaseUrl);
    const rows = (await sql`SELECT password_hash FROM users WHERE email = ${email}`) as { password_hash: string | null }[];
    if (rows[0]?.password_hash) {
      // An account with a password already exists (from an earlier purchase, or a self-service
      // password set via the reset flow) — never overwrite it or re-send credentials.
      await sql`UPDATE users SET last_seen_at = now() WHERE email = ${email}`;
      return;
    }
    const tempPassword = generateTempPassword();
    const tempHash = hashPassword(tempPassword);
    await sql`
      INSERT INTO users (email, first_seen_at, last_seen_at, password_hash, must_change_password)
      VALUES (${email}, now(), now(), ${tempHash}, true)
      ON CONFLICT (email) DO UPDATE SET password_hash = ${tempHash}, must_change_password = true, last_seen_at = now()
    `;
    if (!process.env["GMAIL_USER"] || !process.env["GMAIL_APP_PASSWORD"]) return;
    const copy = welcomeCopyFor(locale);
    const loginUrl = `${authBaseUrl()}/login`;
    const transport = nodemailer.createTransport({ service: "gmail", auth: { user: process.env["GMAIL_USER"], pass: process.env["GMAIL_APP_PASSWORD"] } });
    await transport.sendMail({
      from: process.env["GMAIL_USER"],
      to: email,
      subject: copy.subject,
      text: `${copy.heading}\n\n${copy.intro}\n\n${copy.emailLabel}: ${email}\n${copy.passwordLabel}: ${tempPassword}\n\n${copy.loginButton}: ${loginUrl}\n\n${copy.changePasswordNote}\n\n${copy.footer}`,
      html: `<h2>${escapeHtmlAttr(copy.heading)}</h2><p>${escapeHtmlAttr(copy.intro)}</p><p><strong>${escapeHtmlAttr(copy.emailLabel)}:</strong> ${escapeHtmlAttr(email)}<br/><strong>${escapeHtmlAttr(copy.passwordLabel)}:</strong> ${escapeHtmlAttr(tempPassword)}</p><p><a href="${escapeHtmlAttr(loginUrl)}">${escapeHtmlAttr(copy.loginButton)}</a></p><p>${escapeHtmlAttr(copy.changePasswordNote)}</p><p style="color:#666;font-size:12px">${escapeHtmlAttr(copy.footer)}</p>`,
    });
  } catch (error) {
    console.error("Provisioning password account failed", error);
  }
}

async function rawBody(request: VercelRequest): Promise<Buffer> {
  if (Buffer.isBuffer(request.body)) return request.body;
  if (typeof request.body === "string") return Buffer.from(request.body);
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  const secret = process.env["STRIPE_WEBHOOK_SECRET"];
  const signature = request.headers["stripe-signature"];
  const stripe = getStripe();
  if (!stripe || !secret || typeof signature !== "string") {
    response.status(400).json({ error: "Missing Stripe webhook configuration." });
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await rawBody(request), signature, secret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    response.status(400).json({ error: "Invalid webhook signature." });
    return;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.info("Stripe checkout completed", { sessionId: session.id, customerId: session.customer, subscriptionId: session.subscription });
      const partnerId = session.metadata?.["partnerId"];
      const databaseUrl = process.env["DATABASE_URL"];
      const email = session.customer_details?.email ?? null;
      if (partnerId && databaseUrl) {
        try {
          const sql = neon(databaseUrl);
          await sql`
            INSERT INTO partner_referrals (id, partner_id, email, stripe_customer_id, stripe_subscription_id)
            VALUES (${randomUUID()}, ${partnerId}, ${email}, ${typeof session.customer === "string" ? session.customer : null}, ${typeof session.subscription === "string" ? session.subscription : null})
          `;
          // A completed, discounted checkout is the only server-verified moment we trust to
          // register a partner membership — never taken from the client or the URL alone.
          if (email) {
            const partnerRows = (await sql`SELECT discount_percent FROM partners WHERE id = ${partnerId}`) as { discount_percent: number }[];
            const discountPercent = partnerRows[0]?.discount_percent;
            if (discountPercent) {
              const validUntil = new Date();
              validUntil.setFullYear(validUntil.getFullYear() + 1);
              await sql`
                INSERT INTO partner_memberships (user_email, partner_id, discount_percent, valid_until, linked_at, source)
                VALUES (${email}, ${partnerId}, ${discountPercent}, ${validUntil.toISOString().slice(0, 10)}, now(), 'checkout')
                ON CONFLICT (user_email) DO UPDATE SET
                  partner_id = ${partnerId}, discount_percent = ${discountPercent}, valid_until = ${validUntil.toISOString().slice(0, 10)}, linked_at = now(), source = 'checkout'
              `;
            }
          }
        } catch (error) {
          console.error("Recording partner referral or membership failed", error);
        }
      }
      if (email) await provisionPasswordAccount(email, session.metadata?.["locale"]);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.info("Stripe subscription deleted", { subscriptionId: subscription.id, customerId: subscription.customer });
      // TODO: Revoke the customer's plan access when accounts are added.
      break;
    }
    default:
      break;
  }

  response.status(200).json({ received: true });
}
