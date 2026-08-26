import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account")({ component: AccountPage });

type MeResponse =
  | { email: string; subscription: { status: string; plan: string; interval: string | null; cancelAtPeriodEnd: boolean } | null }
  | { error: string };

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

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="panel w-full max-w-md p-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          Back to planner
        </Link>
        <h1 className="mt-8 text-3xl font-extrabold">My AutoVere</h1>

        {state === "loading" && <p className="mt-6 text-sm text-muted-foreground">Loading your account…</p>}

        {state === "loggedOut" && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">You are not signed in, or your link has expired.</p>
            <Link to="/login">
              <Button className="w-full">Sign in</Button>
            </Link>
          </div>
        )}

        {state === "loggedIn" && data && "email" in data && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="font-semibold text-foreground">{data.email}</span>
            </p>
            {data.subscription ? (
              <div className="rounded-lg border border-border bg-surface-raised p-4">
                <p className="text-sm font-semibold">
                  {data.subscription.plan}
                  {data.subscription.interval ? ` — ${data.subscription.interval}ly` : ""}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Status: {data.subscription.status}
                  {data.subscription.cancelAtPeriodEnd ? " (cancels at period end)" : ""}
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-surface-raised p-4">
                <p className="text-sm">No active subscription found for this email.</p>
                <Link to="/pricing" className="mt-2 inline-block text-sm text-primary hover:underline">
                  View plans
                </Link>
              </div>
            )}
            <Button variant="outline" className="w-full" disabled={loggingOut} onClick={logout}>
              {loggingOut ? "Signing out…" : "Sign out"}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
