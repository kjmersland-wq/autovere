import { createFileRoute } from "@tanstack/react-router";

import { InCarShowcase } from "@/components/InCarShowcase";

/**
 * Confidential OEM/fleet executive-preview showcase. Deliberately not linked
 * from any public nav, footer, or sitemap — self-contained and gated by
 * standard Supabase Auth, restricted to a single configured administrator
 * email (src/lib/in-car-auth.functions.ts). Supabase's own client SDK
 * detects the invite/magic-link session straight from the URL on load, so
 * this route needs no loader or search-param handling of its own.
 */
export const Route = createFileRoute("/partners_/in-car")({
  head: () => ({
    meta: [
      { title: "AutoVere In-Car Intelligence — Executive Preview" },
      { name: "description", content: "Confidential demonstration portal for OEM & fleet partners." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: InCarShowcase,
});
