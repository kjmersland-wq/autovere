/**
 * Centralized affiliate configuration.
 *
 * ─────────────────────────────────────────────────────────────────────
 * HOW TO ADD / UPDATE A LINK
 * ─────────────────────────────────────────────────────────────────────
 * Every entry is `{ url, active, fallback }`:
 *   • url    — your full affiliate tracking URL (paste it here, nothing else to change)
 *   • active — false renders the plain provider URL instead;
 *              flip to true the moment your tracking link goes live.
 *
 * UI components read ONLY from this file — you never touch components
 * to swap links.
 *
 * All outbound affiliate links render with
 *   target="_blank" rel="noopener noreferrer nofollow"
 * via the shared <AffiliateLink /> helper in src/components/AffiliateLink.tsx.
 * ─────────────────────────────────────────────────────────────────────
 */

export type AffiliateEntry = {
  /** Affiliate tracking URL. Paste the full URL from your partner dashboard. */
  url: string;
  /** true = use `url`; false = fall back to the provider's public site. */
  active: boolean;
  /** Public provider site used when `active` is false. */
  fallback: string;
};

const entry = (url: string, fallback: string): AffiliateEntry => ({ url, active: Boolean(url), fallback });

/** Resolve the URL a component should link to for an entry. */
export function affiliateUrl(e: AffiliateEntry): string {
  return e.active ? e.url : e.fallback;
}

/* ------------------------------------------------------------------ */
/* Travelpayouts — LIVE (marker 704131)                                */
/* ------------------------------------------------------------------ */
export const AFFILIATE_CONFIG = {
  carRental: {
    autoEurope:
      "https://tp.media/r?marker=704131&trs=284910&p=4114&u=https%3A%2F%2Fwww.autoeurope.com",
    economyBookings:
      "https://tp.media/r?marker=704131&trs=284910&p=4477&u=https%3A%2F%2Fwww.economybookings.com",
    localrent:
      "https://tp.media/r?marker=704131&trs=284910&p=4238&u=https%3A%2F%2Flocalrent.com",
  },
  motorcycle: {
    bikesBooking:
      "https://tp.media/r?marker=704131&trs=284910&p=680&u=https%3A%2F%2Fbikesbooking.com",
  },
  connectivity: {
    yesim: "https://tp.media/r?marker=704131&trs=284910&p=8544&u=https%3A%2F%2Fyesim.app",
    saily: "https://tp.media/r?marker=704131&trs=284910&p=8921&u=https%3A%2F%2Fsaily.com",
  },
} as const;

export const AFFILIATES = {
  carRental: {
    /** Travelpayouts — live */
    autoEurope: entry(AFFILIATE_CONFIG.carRental.autoEurope, "https://www.autoeurope.com/"),
    /** Travelpayouts — live */
    economyBookings: entry(AFFILIATE_CONFIG.carRental.economyBookings, "https://www.economybookings.com/"),
    /** Travelpayouts — live */
    localrent: entry(AFFILIATE_CONFIG.carRental.localrent, "https://localrent.com/"),
    /** Awin — pending: paste affiliate URL to activate */
    europcar: entry("", "https://www.europcar.com/"),
    /** Awin — pending */
    sixt: entry("", "https://www.sixt.com/"),
  },

  ferries: {
    /** Direct Ferries — pending: paste affiliate URL to activate */
    directFerries: entry("", "https://www.directferries.com/"),
    /** Awin — pending */
    poFerries: entry("", "https://www.poferries.com/"),
    /** Awin — pending */
    stenaLine: entry("", "https://www.stenaline.com/"),
    /** Awin — pending */
    dfds: entry("", "https://www.dfds.com/"),
  },

  twoWheelers: {
    /** Travelpayouts — live */
    bikesBooking: entry(AFFILIATE_CONFIG.motorcycle.bikesBooking, "https://www.bikesbooking.com/"),
  },

  connectivity: {
    /** Travelpayouts — live */
    yesim: entry(AFFILIATE_CONFIG.connectivity.yesim, "https://yesim.app/"),
    /** Travelpayouts — live */
    saily: entry(AFFILIATE_CONFIG.connectivity.saily, "https://saily.com/"),
  },

  tours: {
    /** Pending: paste affiliate URL to activate */
    viator: entry("", "https://www.viator.com/"),
    getYourGuide: entry("", "https://www.getyourguide.com/"),
  },

  camping: {
    eurocamp: entry("", "https://www.eurocamp.com/"),
    campspace: entry("", "https://campspace.com/"),
  },
} as const;
