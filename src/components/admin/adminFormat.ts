export const COUNTRY_NO: Record<string, string> = {
  NO: "🇳🇴 Norge",
  SE: "🇸🇪 Sverige",
  DK: "🇩🇰 Danmark",
  FI: "🇫🇮 Finland",
  DE: "🇩🇪 Tyskland",
  NL: "🇳🇱 Nederland",
  BE: "🇧🇪 Belgia",
  FR: "🇫🇷 Frankrike",
  IT: "🇮🇹 Italia",
  ES: "🇪🇸 Spania",
  PT: "🇵🇹 Portugal",
  AT: "🇦🇹 Østerrike",
  CH: "🇨🇭 Sveits",
  PL: "🇵🇱 Polen",
  CZ: "🇨🇿 Tsjekkia",
  GB: "🇬🇧 Storbritannia",
  IE: "🇮🇪 Irland",
  US: "🇺🇸 USA",
  CA: "🇨🇦 Canada",
  JP: "🇯🇵 Japan",
  CN: "🇨🇳 Kina",
  Ukjent: "🌍 Ukjent",
};

export const REGION_NO: Record<string, string> = {
  eu: "🇪🇺 Europa",
  us: "🇺🇸 USA",
  ca: "🇨🇦 Canada",
};

export const PIE_COLORS = ["#f59e0b", "#38bdf8", "#a78bfa", "#34d399", "#fb7185", "#facc15"];

export const nf = new Intl.NumberFormat("nb-NO");
export const cf = new Intl.NumberFormat("nb-NO", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });

/** Formats a count that may genuinely be unavailable (e.g. missing service-role
 * key) — never renders "null"/NaN, and never silently substitutes 0. */
export function nfOrUnavailable(value: number | null): string {
  return value === null ? "Ikke tilgjengelig" : nf.format(value);
}

/** Admin's display currency selector. All revenue is computed/stored in EUR —
 * these are display-only options, never a base for conversion in the other
 * direction. */
export const ADMIN_CURRENCIES = ["NOK", "EUR", "USD"] as const;
export type AdminCurrency = (typeof ADMIN_CURRENCIES)[number];
