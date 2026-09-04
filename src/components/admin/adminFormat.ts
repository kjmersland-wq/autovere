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
