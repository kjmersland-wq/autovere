import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { marketingCopy } from "@/lib/marketing-i18n";

export const Route = createFileRoute("/account")({ component: AccountPage });

type Subscription = { status: string; plan: string; tier: "pro" | "business" | null; interval: string | null; cancelAtPeriodEnd: boolean };
type MeResponse = { email: string; subscription: Subscription | null } | { error: string };

const [, proPlan, businessPlan] = marketingCopy.en.plans;

function featuresForTier(tier: Subscription["tier"]): string[] {
  if (tier === "business") return [...proPlan.features, ...businessPlan.features];
  if (tier === "pro") return proPlan.features;
  return [];
}

function AccountPage() {
  const [state, setState] = useState<"loading" | "loggedOut" | "loggedIn">("loading");
  const [data, setData] = useState<MeResponse | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me")
      .then(async (response) => {
        const body = (await response.json()) as MeResponse;
        if (cancelled) return;
        if (!response.ok) {
          setState("loggedOut");
          return;
        }
        setData(body);
        setState("loggedIn");
      })
      .catch(() => {
        if (!cancelled) setState("loggedOut");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      window.location.href = "/";
    }
  }

  const subscription = data && "subscription" in data ? data.subscription : null;
  const email = data && "email" in data ? data.email : null;
  const features = featuresForTier(subscription?.tier ?? null);

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to planner
        </Link>

        <header className="mt-10 max-w-3xl">
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-primary">AUTOVERE</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">My AutoVere</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {state === "loggedIn" && subscription ? "Everything your plan unlocks, in one place." : "Sign-in and subscription status for your AutoVere account."}
          </p>
        </header>

        {state === "loading" && <p className="mt-10 text-sm text-muted-foreground">Loading your account…</p>}

        {state === "loggedOut" && (
          <div className="mt-10 panel max-w-md p-6">
            <p className="text-sm text-muted-foreground">You are not signed in, or your link has expired.</p>
            <Link to="/login">
              <Button className="mt-5 w-full">Sign in</Button>
            </Link>
          </div>
        )}

        {state === "loggedIn" && email && (
          <div className="mt-10 space-y-6">
            <div className={`panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7 ${subscription ? "border-primary/60 panel-glow" : ""}`}>
              <div>
                {subscription ? (
                  <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                    <Sparkles className="size-3.5" /> {subscription.plan}
                  </span>
                ) : (
                  <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">Free / Standard</span>
                )}
                <p className="text-lg font-bold">{email}</p>
                {subscription ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {subscription.status === "trialing" ? "Trial active" : "Active"}
                    {subscription.interval ? ` — billed ${subscription.interval}ly` : ""}
                    {subscription.cancelAtPeriodEnd ? " · cancels at period end" : ""}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">No active subscription on this account.</p>
                )}
              </div>
              <div className="flex shrink-0 gap-3">
                {!subscription && (
                  <Link to="/pricing">
                    <Button>View plans</Button>
                  </Link>
                )}
                <Button variant="secondary" disabled={loggingOut} onClick={logout}>
                  {loggingOut ? "Signing out…" : "Sign out"}
                </Button>
              </div>
            </div>

            {subscription ? (
              <section className="panel p-5 sm:p-7">
                <h2 className="text-xl font-bold">What's unlocked on your plan</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" /> <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <section className="panel p-5 sm:p-7">
                <h2 className="text-xl font-bold">Upgrade for more confidence on the road</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {proPlan.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" /> <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/pricing">
                  <Button className="mt-6">See Pro & Business plans</Button>
                </Link>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
