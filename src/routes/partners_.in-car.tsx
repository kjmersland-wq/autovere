import { createFileRoute } from "@tanstack/react-router";

import { InCarShowcase } from "@/components/InCarShowcase";
import { checkInCarSession } from "@/lib/in-car-auth.functions";

/**
 * Confidential OEM/fleet executive-preview showcase. Deliberately not linked
 * from any public nav, footer, or sitemap — self-contained and gated by a
 * standalone credential check (src/lib/in-car-auth.functions.ts), independent
 * of the public Supabase user-auth system.
 */
export const Route = createFileRoute("/partners_/in-car")({
  loader: async () => ({ authorized: await checkInCarSession() }),
  head: () => ({
    meta: [
      { title: "AutoVere In-Car Intelligence — Executive Preview" },
      { name: "description", content: "Confidential demonstration portal for OEM & fleet partners." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: InCarRoute,
});

function InCarRoute() {
  const { authorized } = Route.useLoaderData();
  return <InCarShowcase initialAuthorized={authorized} />;
}
