// Smart e-post-validering med plus-alias-forslag.
// Brukes i alle skjemaer der brukeren oppgir e-post (kontakt, signup, checkout).

import { z } from "zod";

const COMMON_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmail.co": "gmail.com",
  "hotnail.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "iclod.com": "icloud.com",
  "icoud.com": "icloud.com",
};

// Domener der plus-alias er kjent støttet (leverer fortsatt til hovedinnboksen).
const PLUS_ALIAS_SUPPORTED = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "yahoo.com",
  "fastmail.com",
  "proton.me",
  "protonmail.com",
]);

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Skriv inn e-postadressen din")
  .max(254, "E-posten er for lang")
  .email("Det ser ikke ut som en gyldig e-postadresse");

export type EmailCheck = {
  valid: boolean;
  error?: string;
  // Vanlig skrivefeil → forslag til riktig domene
  typoSuggestion?: string;
  // Plus-alias-forslag dersom e-posten sannsynligvis er i bruk fra før
  aliasSuggestion?: string;
  aliasReason?: string;
};

const STORAGE_KEY = "autovere.knownEmails";

function knownEmails(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function rememberEmail(email: string) {
  if (typeof window === "undefined") return;
  try {
    const list = new Set(knownEmails());
    list.add(email.trim().toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...list].slice(-20)));
  } catch {}
}

export function buildPlusAlias(email: string, tag = "autovere"): string | null {
  const [local, domain] = email.toLowerCase().split("@");
  if (!local || !domain) return null;
  // strip eksisterende +tag for å unngå dobbel
  const base = local.split("+")[0];
  return `${base}+${tag}@${domain}`;
}

export function checkEmail(raw: string, opts?: { aliasTag?: string }): EmailCheck {
  const tag = opts?.aliasTag ?? "autovere";
  const parsed = emailSchema.safeParse(raw);
  if (!parsed.success) {
    return { valid: false, error: parsed.error.issues[0]?.message ?? "Ugyldig e-post" };
  }
  const email = parsed.data;
  const [local, domain] = email.split("@");

  // 1) Skrivefeil i domene
  if (COMMON_TYPOS[domain]) {
    return {
      valid: false,
      error: `Mente du @${COMMON_TYPOS[domain]}?`,
      typoSuggestion: `${local}@${COMMON_TYPOS[domain]}`,
    };
  }

  // 2) Sannsynligvis i bruk fra før (lagret lokalt fra tidligere skjemaer)
  const seenBefore = knownEmails().includes(email);
  if (seenBefore && !local.includes("+") && PLUS_ALIAS_SUPPORTED.has(domain)) {
    const alias = buildPlusAlias(email, tag);
    return {
      valid: true,
      aliasSuggestion: alias ?? undefined,
      aliasReason:
        "Du har brukt denne e-posten her før. Vil du bruke en plus-alias for å holde denne registreringen separat? Den leveres fortsatt til samme innboks.",
    };
  }

  // 3) Tilbyr proaktivt plus-alias for vanlige innboksleverandører i signup-flyt
  if (opts?.aliasTag && !local.includes("+") && PLUS_ALIAS_SUPPORTED.has(domain)) {
    return {
      valid: true,
      aliasSuggestion: buildPlusAlias(email, tag) ?? undefined,
      aliasReason:
        "Tips: bruk en plus-alias for enklere å filtrere e-post fra AutoVere — den havner fortsatt i innboksen din.",
    };
  }

  return { valid: true };
}
