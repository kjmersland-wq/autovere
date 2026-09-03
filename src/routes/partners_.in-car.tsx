import { useEffect } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { InCarShowcase } from "@/components/InCarShowcase";
import { checkInCarSession, verifyInCarMagicLink } from "@/lib/in-car-auth.functions";

/**
 * Confidential OEM/fleet executive-preview showcase. Deliberately not linked
 * from any public nav, footer, or sitemap — self-contained and gated by a
 * standalone credential check (src/lib/in-car-auth.functions.ts), independent
 * of the public Supabase user-auth system. Login is a passwordless magic
 * link: a `?token=` search param is verified server-side in the loader
 * before the page ever renders.
 */
export const Route = createFileRoute("/partners_/in-car")({
  validateSearch: (search: Record<string, unknown>): { token?: string } =>
    typeof search["token"] === "string" ? { token: search["token"] } : {},
  loaderDeps: ({ search }) => ({ token: search.token }),
  loader: async ({ deps }) => {
    let authorized = await checkInCarSession();
    let linkInvalid = false;
    if (!authorized && deps.token) {
      const result = await verifyInCarMagicLink({ data: { token: deps.token } });
      authorized = result.ok;
      linkInvalid = !result.ok;
    }
    return { authorized, hadToken: Boolean(deps.token), linkInvalid };
  },
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
  const { authorized, hadToken, linkInvalid } = Route.useLoaderData();

  useEffect(() => {
    if (hadToken && typeof window !== "undefined") {
      window.history.replaceState(null, "", "/partners/in-car");
    }
  }, [hadToken]);

  return <InCarShowcase initialAuthorized={authorized} linkInvalid={linkInvalid} />;
}
