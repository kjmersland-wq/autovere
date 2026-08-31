import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Compass } from "lucide-react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search["session_id"] === "string" ? search["session_id"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Checkout complete — AutoVere" },
      {
        name: "description",
        content: "Your AutoVere plan is confirmed. Head back to the planner and start mapping your next crossing.",
      },
      { property: "og:title", content: "Checkout complete — AutoVere" },
      {
        property: "og:description",
        content: "Your AutoVere plan is confirmed. Start planning tolls, vignettes, fuel and ferries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { session_id: sessionId } = Route.useSearch();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-20 text-center">
        {sessionId ? (
          <>
            <CheckCircle2 className="mx-auto size-14 text-primary" />
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">You're all set — welcome aboard!</h1>
            <p className="mt-3 text-foreground/70">
              Your plan is confirmed and your garage has been unlocked. A receipt is on its way to your inbox.
            </p>
          </>
        ) : (
          <>
            <Compass className="mx-auto size-14 text-muted-foreground" />
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">Nothing to confirm here</h1>
            <p className="mt-3 text-foreground/70">
              We couldn't find a checkout session. If you just paid, give it a moment and check your garage.
            </p>
          </>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link to="/planner">Plan a road trip</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/garage">Open My Garage</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
