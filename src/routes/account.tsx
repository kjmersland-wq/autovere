import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, Car, CreditCard, LayoutDashboard, Route as RouteIcon, ShieldCheck, Sparkles, SlidersHorizontal, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { marketingCopy } from "@/lib/marketing-i18n";
import { useLocale } from "@/lib/i18n";
import { getAccountCopy } from "@/lib/account-i18n";

export const Route = createFileRoute("/account")({ component: AccountPage });

type Invoice = { id: string; amount: number; currency: string; date: string; url: string | null };
type PaymentMethod = { brand: string; last4: string } | null;
type Subscription = {
  status: string;
  plan: string;
  tier: "pro" | "business" | null;
  interval: string | null;
  cancelAtPeriodEnd: boolean;
  renewsAt: string | null;
  paymentMethod: PaymentMethod;
  invoices: Invoice[];
};
type MeResponse = { email: string; subscription: Subscription | null } | { error: string };
type Section = "overview" | "trips" | "vehicles" | "preferences" | "billing" | "places" | "profile";

const proPlan = marketingCopy.en.plans[1]!;
const businessPlan = marketingCopy.en.plans[2]!;

function featuresForTier(tier: Subscription["tier"]): string[] {
  if (tier === "business") return [...proPlan.features, ...businessPlan.features];
  if (tier === "pro") return proPlan.features;
  return [];
}

function AccountPage() {
  const { locale, setLocale } = useLocale();
  const copy = getAccountCopy(locale);
  const [state, setState] = useState<"loading" | "loggedOut" | "loggedIn">("loading");
  const [data, setData] = useState<MeResponse | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [openingBilling, setOpeningBilling] = useState(false);
  const [section, setSection] = useState<Section>("overview");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  async function openBillingPortal() {
    setOpeningBilling(true);
    try {
      const response = await fetch("/api/billing-portal", { method: "POST" });
      const body = (await response.json()) as { url?: string; error?: string };
      if (response.ok && body.url) {
        window.location.href = body.url;
        return;
      }
    } finally {
      setOpeningBilling(false);
    }
  }

  async function deleteAccount() {
    setDeleting(true);
    try {
      await fetch("/api/delete-account", { method: "POST" });
    } finally {
      window.location.href = "/";
    }
  }

  if (state === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">{copy.loading}</p>
      </main>
    );
  }

  if (state === "loggedOut" || !data || "error" in data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="panel w-full max-w-md p-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 inline size-4" /> {copy.backToPlanner}
          </Link>
          <p className="mt-8 text-sm text-muted-foreground">{copy.loggedOut.message}</p>
          <Link to="/login">
            <Button className="mt-5 w-full">{copy.loggedOut.signIn}</Button>
          </Link>
        </div>
      </main>
    );
  }

  const email = data.email;
  const subscription = data.subscription;
  const firstName = email.split("@")[0] ?? email;
  const features = featuresForTier(subscription?.tier ?? null);
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  const nav: { key: Section; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "overview", label: copy.nav.overview, icon: LayoutDashboard },
    { key: "trips", label: copy.nav.trips, icon: RouteIcon },
    { key: "vehicles", label: copy.nav.vehicles, icon: Car },
    { key: "preferences", label: copy.nav.preferences, icon: SlidersHorizontal },
    { key: "billing", label: copy.nav.billing, icon: CreditCard },
    { key: "places", label: copy.nav.places, icon: Bookmark },
    { key: "profile", label: copy.nav.profile, icon: ShieldCheck },
  ];

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" /> {copy.backToPlanner}
        </Link>

        <header className="mt-10 max-w-3xl">
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-primary">{copy.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">{copy.welcome(firstName)}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{subscription ? copy.subtitleActive : copy.subtitleFree}</p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
            {nav.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSection(key)}
                className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold transition-colors ${
                  section === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface-raised hover:text-foreground"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span className="whitespace-nowrap lg:whitespace-normal">{label}</span>
              </button>
            ))}
          </nav>

          <div className="min-w-0 space-y-6">
            {section === "overview" && (
              <>
                <div className={`panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7 ${subscription ? "border-primary/60 panel-glow" : ""}`}>
                  <div>
                    {subscription ? (
                      <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                        <Sparkles className="size-3.5" /> {subscription.plan}
                      </span>
                    ) : (
                      <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">{copy.plan.free}</span>
                    )}
                    <p className="text-lg font-bold">{email}</p>
                    {subscription ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {subscription.status === "trialing" ? copy.plan.trialing : copy.plan.active}
                        {subscription.interval ? ` — ${subscription.interval === "year" ? copy.plan.billedYearly : copy.plan.billedMonthly}` : ""}
                        {subscription.renewsAt ? ` · ${copy.plan.renewsOn(dateFormatter.format(new Date(subscription.renewsAt)))}` : ""}
                        {subscription.cancelAtPeriodEnd ? ` · ${copy.plan.cancelsAtPeriodEnd}` : ""}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">{copy.plan.noSubscription}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-3">
                    {subscription ? (
                      <Button variant="secondary" disabled={openingBilling} onClick={openBillingPortal}>
                        {copy.actions.manageBilling}
                      </Button>
                    ) : (
                      <Link to="/pricing">
                        <Button>{copy.actions.viewPlans}</Button>
                      </Link>
                    )}
                    <Button variant="secondary" disabled={loggingOut} onClick={logout}>
                      {loggingOut ? copy.actions.signingOut : copy.actions.signOut}
                    </Button>
                  </div>
                </div>

                {subscription ? (
                  <section className="panel p-5 sm:p-7">
                    <h2 className="text-xl font-bold">{copy.unlocked.title}</h2>
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
                    <h2 className="text-xl font-bold">{copy.unlocked.upgradeTitle}</h2>
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {proPlan.features.map((feature) => (
                        <li key={feature} className="flex gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" /> <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/pricing">
                      <Button className="mt-6">{copy.unlocked.upgradeCta}</Button>
                    </Link>
                  </section>
                )}
              </>
            )}

            {section === "billing" && (
              <section className="panel p-5 sm:p-7">
                <h2 className="text-xl font-bold">{copy.billing.title}</h2>
                {subscription ? (
                  <div className="mt-5 space-y-5">
                    <dl className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{copy.billing.plan}</dt>
                        <dd className="mt-1 text-sm font-semibold">{subscription.plan}</dd>
                      </div>
                      {subscription.renewsAt && (
                        <div>
                          <dt className="text-xs uppercase tracking-wide text-muted-foreground">{copy.billing.renewsOn}</dt>
                          <dd className="mt-1 text-sm font-semibold">{dateFormatter.format(new Date(subscription.renewsAt))}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{copy.billing.paymentMethod}</dt>
                        <dd className="mt-1 text-sm font-semibold">
                          {subscription.paymentMethod ? `${subscription.paymentMethod.brand.toUpperCase()} •••• ${subscription.paymentMethod.last4}` : copy.billing.noPaymentMethod}
                        </dd>
                      </div>
                    </dl>
                    <Button disabled={openingBilling} onClick={openBillingPortal}>
                      {copy.billing.manage}
                    </Button>
                    <div>
                      <h3 className="text-sm font-bold">{copy.billing.history}</h3>
                      {subscription.invoices.length > 0 ? (
                        <ul className="mt-3 divide-y divide-border">
                          {subscription.invoices.map((invoice) => (
                            <li key={invoice.id} className="flex items-center justify-between py-2.5 text-sm">
                              <span className="text-muted-foreground">{dateFormatter.format(new Date(invoice.date))}</span>
                              <span className="font-semibold">
                                {invoice.amount.toFixed(2)} {invoice.currency}
                              </span>
                              {invoice.url ? (
                                <a href={invoice.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                  {copy.billing.viewInvoice}
                                </a>
                              ) : (
                                <span />
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-muted-foreground">{copy.billing.noHistory}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-5">
                    <p className="text-sm text-muted-foreground">{copy.billing.noSubscription}</p>
                    <Link to="/pricing">
                      <Button className="mt-4">{copy.actions.viewPlans}</Button>
                    </Link>
                  </div>
                )}
              </section>
            )}

            {section === "trips" && <EmptySection title={copy.trips.title} emptyTitle={copy.trips.emptyTitle} emptyBody={copy.trips.emptyBody} icon={RouteIcon} />}
            {section === "vehicles" && <EmptySection title={copy.vehicles.title} emptyTitle={copy.vehicles.emptyTitle} emptyBody={copy.vehicles.emptyBody} icon={Car} />}
            {section === "places" && <EmptySection title={copy.places.title} emptyTitle={copy.places.emptyTitle} emptyBody={copy.places.emptyBody} icon={Bookmark} />}

            {section === "preferences" && (
              <section className="panel p-5 sm:p-7">
                <h2 className="text-xl font-bold">{copy.preferences.title}</h2>
                <div className="mt-5 max-w-xs">
                  <label className="text-xs uppercase tracking-wide text-muted-foreground" htmlFor="account-language">
                    {copy.preferences.language}
                  </label>
                  <select
                    id="account-language"
                    value={locale}
                    onChange={(event) => setLocale(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-foreground outline-none focus:border-primary/60"
                  >
                    <option value="en">English</option>
                    <option value="no">Norsk</option>
                    <option value="de">Deutsch</option>
                    <option value="nl">Nederlands</option>
                    <option value="pl">Polski</option>
                    <option value="sv">Svenska</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                <p className="mt-5 text-sm text-muted-foreground">{copy.preferences.more}</p>
              </section>
            )}

            {section === "profile" && (
              <section className="space-y-6">
                <div className="panel p-5 sm:p-7">
                  <h2 className="text-xl font-bold">{copy.profile.title}</h2>
                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{copy.profile.email}</p>
                    <p className="mt-1 text-sm font-semibold">{email}</p>
                  </div>
                  <div className="mt-5 rounded-lg border border-border bg-surface-raised p-4">
                    <p className="text-sm font-semibold">{copy.profile.security}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{copy.profile.securityBody}</p>
                  </div>
                </div>
                <div className="panel border-destructive/40 p-5 sm:p-7">
                  <h2 className="text-xl font-bold text-destructive">{copy.profile.dangerTitle}</h2>
                  {!confirmingDelete ? (
                    <Button variant="destructive" className="mt-5" onClick={() => setConfirmingDelete(true)}>
                      {copy.profile.deleteAccount}
                    </Button>
                  ) : (
                    <div className="mt-5 space-y-3">
                      <p className="text-sm text-muted-foreground">{copy.profile.deleteConfirm}</p>
                      <div className="flex gap-3">
                        <Button variant="destructive" disabled={deleting} onClick={deleteAccount}>
                          {copy.profile.deleteAccount}
                        </Button>
                        <Button variant="secondary" disabled={deleting} onClick={() => setConfirmingDelete(false)}>
                          {copy.profile.deleteCancel}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function EmptySection({ title, emptyTitle, emptyBody, icon: Icon }: { title: string; emptyTitle: string; emptyBody: string; icon: typeof LayoutDashboard }) {
  return (
    <section className="panel p-5 sm:p-7">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-border py-12 text-center">
        <Icon className="size-8 text-muted-foreground/50" />
        <p className="mt-4 text-sm font-semibold">{emptyTitle}</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{emptyBody}</p>
      </div>
    </section>
  );
}
