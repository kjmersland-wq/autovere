import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Compass } from "lucide-react";
import { useEffect, useState } from "react";
import { getCheckoutStatus } from "@/utils/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { useAuth } from "@/lib/auth";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

const SESSION_ID = /^cs_(test_|live_)?[a-zA-Z0-9]+$/;

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => {
    const id = search["session_id"];
    return typeof id === "string" && SESSION_ID.test(id) ? { session_id: id } : {};
  },
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
  const { user } = useAuth();
  const [paid, setPaid] = useState(false);
  const [message, setMessage] = useState("Checking your payment…");
  useEffect(() => {
    if (!sessionId || !user) return;
    let active = true;
    void (async () => {
      try {
        const result = await getCheckoutStatus({ data: { sessionId, environment: getStripeEnvironment() } });
        if ("error" in result) throw new Error(result.error);
        if (active) { setPaid(result.paid); setMessage(result.paid ? "Your payment is confirmed. Your plan will appear in My Garage as soon as payment processing finishes." : "Your payment is still processing. Access activates when payment is confirmed."); }
      } catch (error) { if (active) setMessage(error instanceof Error ? error.message : "Payment could not be confirmed."); }
    })();
    return () => { active = false; };
  }, [sessionId, user]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-20 text-center">
        {sessionId && paid ? (
          <>
            <CheckCircle2 className="mx-auto size-14 text-primary" />
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">You're all set — welcome aboard!</h1>
            <p className="mt-3 text-foreground/70">
              {message}
            </p>
          </>
        ) : (
          <>
            <Compass className="mx-auto size-14 text-muted-foreground" />
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">{sessionId ? "Payment confirmation" : "Nothing to confirm here"}</h1>
            <p className="mt-3 text-foreground/70">
              {sessionId ? user ? message : "Sign in to check your payment and access in My Garage." : "We couldn't find a checkout session. If you just paid, give it a moment and check your garage."}
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
