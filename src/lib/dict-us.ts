/**
 * American English terminology & tone overrides for European road trip copy.
 * Layered over the base English (`en`) dict via `withFallback` — only the words
 * that read differently to a US audience are overridden here.
 */
export const US_DICT: Record<string, unknown> = {
  header: {
    nav: {
      "/tolls": "Tolls & Toll Passes",
    } as Record<string, string>,
  },
  hero: {
    vehicles: { motorhome: "RV / Camper" },
    fuels: { petrol: "Gas" },
    submit: "Get My Road Trip Cost →",
    footnote:
      "Tolls, toll passes & stickers, gas, charging and ferries — priced to the exact route, so you can roll out with total peace of mind.",
  },
  results: {
    variants: {
      tollfree: {
        blurb: "Strictly avoids every toll road, gantry and toll-pass zone.",
      },
    },
    tollsBadge: "Tolls & Toll Passes",
    vignetteTitle: "🏷️ Smart Toll Pass Period Optimizer",
    vignetteTotal: "Optimized toll pass cover for this route:",
  },
  drawer: {
    title: "Tolls, Toll Passes & Gas Costs by Country / State",
    petrol: "Gas",
  },
  compliance: {
    clearanceTitle: "🚐 RV weight & clearance radar",
    heavyToggle: "My RV is over 3.5 t",
    heavyWarning:
      "⚠️ Over 3.5 t your standard car toll pass isn't valid. Switch to the heavy-vehicle system in each country below before your first mile on the motorway.",
    lezTitle: "Restricted City Zones (ZTL / Clean Air) monitor",
  },
  map: {
    campTitle: "🚐 RV & camping radar",
    evAlready: "You're already planning electric — here's what gas would have cost.",
  },
};
