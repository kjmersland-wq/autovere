/**
 * Centralized affiliate configuration.
 *
 * ─────────────────────────────────────────────────────────────────────
 * HOW TO ADD / UPDATE A LINK
 * ─────────────────────────────────────────────────────────────────────
 * Every entry is `{ url, active }`:
 *   • url    — your full affiliate tracking URL (paste it here, nothing else to change)
 *   • active — false renders the plain provider URL (or hides the offer);
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
/* Travelpayouts — live programs                                       */
/* Replace "YOUR_MARKER" once with your Travelpayouts marker and all   */
/* programs below activate at the same time.                           */
/* ------------------------------------------------------------------ */
const TP_MARKER = "YOUR_MARKER";

const tp = (promoId: string, fallback: string): AffiliateEntry =>
  entry(
    TP_MARKER === "YOUR_MARKER"
      ? ""
      : `https://c55.travelpayouts.com/click?shmarker=${TP_MARKER}&promo_id=${promoId}&source_type=customlink&type=click`,
    fallback,
  );

export const AFFILIATES = {
  carRental: {
    /** Travelpayouts — live */
    autoEurope: tp("4490", "https://www.autoeurope.com/"),
    /** Travelpayouts — live */
    economyBookings: tp("4491", "https://www.economybookings.com/"),
    /** Travelpayouts — live */
    localrent: tp("4522", "https://localrent.com/"),
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
    bikesBooking: tp("4534", "https://www.bikesbooking.com/"),
  },

  connectivity: {
    /** Travelpayouts — live */
    yesim: tp("4615", "https://yesim.app/"),
    /** Travelpayouts — live */
    saily: tp("4656", "https://saily.com/"),
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
