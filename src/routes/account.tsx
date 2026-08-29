import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Car,
  Check,
  CreditCard,
  Download,
  HelpCircle,
  LayoutDashboard,
  Lock,
  Pencil,
  Printer,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/ContactModal";
import { marketingCopy, type PricingFeature } from "@/lib/marketing-i18n";
import { useLocale } from "@/lib/i18n";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { getAccountCopy } from "@/lib/account-i18n";
import { partnerCopy } from "@/lib/partner-i18n";
import { openPrintReport } from "@/lib/print-report";
import { AccountShell, EmptyState, type AccountNavItem } from "@/components/account/AccountFrame";

export const Route = createFileRoute("/account")({ component: AccountPage });

type Invoice = { id: string; amount: number; currency: string; date: string; url: string | null; pdfUrl: string | null };
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
  manageable: boolean;
};
type Membership = {
  partnerId: string;
  partnerName: string;
  partnerLogo: string | null;
  partnerWebsite: string;
  discountPercent: number;
  validUntil: string;
  status: "active" | "expired";
};
type MeResponse = { email: string; isAdmin: boolean; subscription: Subscription | null; membership: Membership | null } | { error: string };
type Section = "overview" | "trips" | "vehicles" | "preferences" | "billing" | "places" | "profile" | "help";

type Trip = { id: string; name: string; fromPlace: string | null; toPlace: string | null; vehicleType: string | null; currency: string | null; days: number | null; estimate: unknown; createdAt: string; updatedAt: string };
type Vehicle = { id: string; name: string; vehicleType: "petrol" | "diesel" | "ev"; consumption: number | null; rangeKm: number | null; isDefault: boolean; createdAt: string };
type SavedPlace = { id: string; name: string; category: "charging" | "camping" | "attraction" | "other"; lat: number | null; lon: number | null; notes: string | null; createdAt: string };
type Settings = { language: string | null; currency: CurrencyCode | null; units: "metric" | "imperial" | null; notificationsEmail: boolean; displayName: string | null };

const proPlan = marketingCopy.en.plans[1]!;
const businessPlan = marketingCopy.en.plans[2]!;

function featuresForTier(tier: Subscription["tier"]): PricingFeature[] {
  if (tier === "business") return [...proPlan.features, ...businessPlan.features];
  if (tier === "pro") return proPlan.features;
  return [];
}

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const body = (await response.json()) as T;
  if (!response.ok) throw new Error((body as { error?: string })?.error ?? "Request failed");
  return body;
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
  const [exporting, setExporting] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    jsonFetch<{ settings: Settings }>("/api/account?view=settings")
      .then((body) => {
        if (!cancelled) setDisplayName(body.settings.displayName ?? "");
      })
      .catch(() => {
        /* no saved display name yet */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveDisplayName() {
    setSavingName(true);
    setNameSaved(false);
    try {
      await jsonFetch("/api/account?view=settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: displayName.trim() }),
      });
      setNameSaved(true);
    } finally {
      setSavingName(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/account")
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
      await fetch("/api/account?action=logout", { method: "POST" });
    } finally {
      window.location.href = "/";
    }
  }

  async function openBillingPortal() {
    setOpeningBilling(true);
    try {
      const response = await fetch("/api/account?action=billing-portal", { method: "POST" });
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
      await fetch("/api/account?action=delete", { method: "POST" });
    } finally {
      window.location.href = "/";
    }
  }

  async function exportData() {
    setExporting(true);
    try {
      const response = await fetch("/api/account?view=export");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "autovere-data-export.json";
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
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
  const isAdmin = data.isAdmin;
  const subscription = data.subscription;
  const membership = data.membership;
  const partnerLabels = partnerCopy[locale] ?? partnerCopy.en;
  const firstName = email.split("@")[0] ?? email;
  const friendlyName = displayName.trim() || firstName;
  const features = featuresForTier(subscription?.tier ?? null);
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  const nav: AccountNavItem<Section>[] = [
    { key: "overview", label: copy.nav.overview, icon: LayoutDashboard },
    { key: "trips", label: copy.nav.trips, icon: RouteIcon },
    { key: "vehicles", label: copy.nav.vehicles, icon: Car },
    { key: "preferences", label: copy.nav.preferences, icon: SlidersHorizontal },
    { key: "billing", label: copy.nav.billing, icon: CreditCard },
    { key: "places", label: copy.nav.places, icon: Bookmark },
    { key: "profile", label: copy.nav.profile, icon: ShieldCheck },
    { key: "help", label: copy.nav.help, icon: HelpCircle },
  ];

  return (
    <AccountShell
      backLabel={copy.backToPlanner}
      eyebrow={copy.eyebrow}
      title={copy.welcome(friendlyName)}
      subtitle={subscription ? copy.subtitleActive : copy.subtitleFree}
      nav={nav}
      active={section}
      onSelect={setSection}
    >
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
                    <p className="text-lg font-bold">{friendlyName}</p>
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
                    {subscription?.manageable ? (
                      <Button variant="secondary" disabled={openingBilling} onClick={openBillingPortal}>
                        {copy.actions.manageBilling}
                      </Button>
                    ) : subscription ? null : (
                      <Link to="/pricing">
                        <Button>{copy.actions.viewPlans}</Button>
                      </Link>
                    )}
                    {isAdmin && (
                      <Link to="/admin">
                        <Button variant="secondary">
                          <Lock className="mr-1.5 size-3.5" /> Admin
                        </Button>
                      </Link>
                    )}
                    <Button variant="secondary" disabled={loggingOut} onClick={logout}>
                      {loggingOut ? copy.actions.signingOut : copy.actions.signOut}
                    </Button>
                  </div>
                </div>

                {membership && (
                  <section className="panel p-5 sm:p-7">
                    <h2 className="text-xl font-bold">{copy.membership.sectionTitle}</h2>
                    <a
                      href={membership.partnerWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={partnerLabels.header.visitWebsite(membership.partnerName)}
                      className="mt-4 flex max-w-full w-fit min-w-0 items-center gap-3 rounded-lg border border-border bg-surface-raised p-3 transition-colors hover:border-primary/50"
                    >
                      {membership.partnerLogo && <img src={membership.partnerLogo} alt={membership.partnerName} className="h-6 w-auto max-w-[100px] shrink-0 object-contain" />}
                      <span className="min-w-0 truncate text-sm font-semibold">{membership.partnerName}</span>
                    </a>
                    <p className="mt-3 text-lg font-bold text-primary">{copy.membership.discountLine(membership.discountPercent)}</p>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{copy.membership.validUntil}</dt>
                        <dd className="mt-1 text-sm font-semibold">{dateFormatter.format(new Date(membership.validUntil))}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{copy.membership.statusLabel}</dt>
                        <dd className="mt-1">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${membership.status === "active" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                            {membership.status === "active" ? copy.membership.statusActive : copy.membership.statusExpired}
                          </span>
                        </dd>
                      </div>
                    </dl>
                    {membership.status === "expired" && <p className="mt-4 text-sm text-muted-foreground">{copy.membership.expiredNote}</p>}
                  </section>
                )}

                {subscription ? (
                  <section className="panel p-5 sm:p-7">
                    <h2 className="text-xl font-bold">{copy.unlocked.title}</h2>
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                          {typeof feature === "string" ? <span>{feature}</span> : <span><span className="block font-semibold text-foreground">{feature.title}</span><span className="mt-0.5 block text-xs leading-relaxed">{feature.detail}</span></span>}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : (
                  <section className="panel p-5 sm:p-7">
                    <h2 className="text-xl font-bold">{copy.unlocked.upgradeTitle}</h2>
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {proPlan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
                          {typeof feature === "string" ? <span>{feature}</span> : <span><span className="block font-semibold text-foreground">{feature.title}</span><span className="mt-0.5 block text-xs leading-relaxed">{feature.detail}</span></span>}
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
                    {subscription.manageable ? (
                      <Button disabled={openingBilling} onClick={openBillingPortal}>
                        {copy.billing.manage}
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground">{copy.billing.adminNote}</p>
                    )}
                    <div>
                      <h3 className="text-sm font-bold">{copy.billing.history}</h3>
                      {subscription.invoices.length > 0 ? (
                        <ul className="mt-3 divide-y divide-border">
                          {subscription.invoices.map((invoice) => (
                            <li key={invoice.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                              <span className="text-muted-foreground">{dateFormatter.format(new Date(invoice.date))}</span>
                              <span className="font-semibold">
                                {invoice.amount.toFixed(2)} {invoice.currency}
                              </span>
                              <div className="flex shrink-0 gap-3">
                                {invoice.url && (
                                  <a href={invoice.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                    {copy.billing.viewInvoice}
                                  </a>
                                )}
                                {invoice.pdfUrl && (
                                  <a href={invoice.pdfUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                    PDF
                                  </a>
                                )}
                              </div>
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

            {section === "trips" && <TripsSection copy={copy} locale={locale} dateFormatter={dateFormatter} />}
            {section === "vehicles" && <VehiclesSection copy={copy} />}
            {section === "places" && <PlacesSection copy={copy} />}

            {section === "preferences" && <PreferencesSection copy={copy} locale={locale} setLocale={setLocale} />}

            {section === "profile" && (
              <section className="space-y-6">
                <div className="panel p-5 sm:p-7">
                  <h2 className="text-xl font-bold">{copy.profile.title}</h2>
                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{copy.profile.email}</p>
                    <p className="mt-1 text-sm font-semibold">{email}</p>
                  </div>
                  <div className="mt-5 rounded-lg border border-border bg-surface-raised p-4">
                    <p className="text-sm font-semibold">{copy.profile.displayNameLabel}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{copy.profile.displayNameBody}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <input
                        value={displayName}
                        onChange={(event) => setDisplayName(event.target.value)}
                        placeholder={copy.profile.displayNamePlaceholder}
                        maxLength={80}
                        className="w-full max-w-xs rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
                      />
                      <Button size="sm" disabled={savingName} onClick={saveDisplayName}>
                        {savingName ? copy.profile.savingName : copy.profile.saveName}
                      </Button>
                      {nameSaved && <span className="text-sm text-primary">{copy.profile.nameSaved}</span>}
                    </div>
                  </div>
                  <div className="mt-5 rounded-lg border border-border bg-surface-raised p-4">
                    <p className="text-sm font-semibold">{copy.profile.security}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{copy.profile.securityBody}</p>
                  </div>
                  <div className="mt-5 rounded-lg border border-border bg-surface-raised p-4">
                    <p className="text-sm font-semibold">{copy.profile.exportData}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{copy.profile.exportDataBody}</p>
                    <Button variant="secondary" className="mt-3" disabled={exporting} onClick={exportData}>
                      <Download className="mr-1.5 size-4" /> {copy.profile.exportData}
                    </Button>
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

            {section === "help" && (
              <section className="space-y-6">
                <div className="panel p-5 sm:p-7">
                  <h2 className="text-xl font-bold">{copy.help.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{copy.help.subtitle}</p>
                </div>
                <div className="panel p-5 sm:p-7">
                  <h3 className="text-lg font-bold">{copy.help.faqTitle}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{copy.help.faqBody}</p>
                  <Link to="/faq">
                    <Button className="mt-4">{copy.help.faqLink}</Button>
                  </Link>
                </div>
                <div className="panel p-5 sm:p-7">
                  <h3 className="text-lg font-bold">{copy.help.contactTitle}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{copy.help.contactBody}</p>
                  <Button className="mt-4" onClick={() => setContactOpen(true)}>
                    {copy.help.contactLink}
                  </Button>
                </div>
                <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
              </section>
            )}
    </AccountShell>
  );
}

type CopyProps = { copy: ReturnType<typeof getAccountCopy> };

function TripsSection({ copy, locale, dateFormatter }: CopyProps & { locale: string; dateFormatter: Intl.DateTimeFormat }) {
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    jsonFetch<{ trips: Trip[] }>("/api/trips")
      .then((body) => setTrips(body.trips))
      .catch(() => setTrips([]));
  }, []);

  async function remove(id: string) {
    if (!window.confirm(copy.trips.deleteConfirm)) return;
    setBusyId(id);
    try {
      await jsonFetch(`/api/trips?id=${id}`, { method: "DELETE" });
      setTrips((current) => (current ? current.filter((trip) => trip.id !== id) : current));
    } finally {
      setBusyId(null);
    }
  }

  async function duplicate(trip: Trip) {
    setBusyId(trip.id);
    try {
      const body = await jsonFetch<{ trip: Trip }>("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `${trip.name} (copy)`, fromPlace: trip.fromPlace, toPlace: trip.toPlace, vehicleType: trip.vehicleType, currency: trip.currency, days: trip.days, estimate: trip.estimate }),
      });
      setTrips((current) => (current ? [body.trip, ...current] : [body.trip]));
    } finally {
      setBusyId(null);
    }
  }

  async function saveRename(id: string) {
    if (!renameValue.trim()) {
      setRenamingId(null);
      return;
    }
    setBusyId(id);
    try {
      const body = await jsonFetch<{ trip: Trip }>(`/api/trips?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameValue.trim() }),
      });
      setTrips((current) => (current ? current.map((trip) => (trip.id === id ? body.trip : trip)) : current));
    } finally {
      setBusyId(null);
      setRenamingId(null);
    }
  }

  function print(trip: Trip) {
    const estimate = (trip.estimate ?? {}) as { summary?: Record<string, string | number | null | undefined> };
    const summary = estimate.summary ?? {};
    const summaryRows = Object.entries(summary)
      .filter(([, value]) => value !== null && value !== undefined && value !== "")
      .map(([label, value]) => ({ label, value: String(value) }));

    openPrintReport({
      title: trip.name,
      subtitle: [trip.fromPlace, trip.toPlace].filter(Boolean).join(" → ") || undefined,
      generatedAtLabel: new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short" }).format(new Date()),
      sections: [
        {
          heading: copy.trips.title,
          rows: [
            { label: copy.vehicles.type, value: trip.vehicleType ?? "—" },
            { label: copy.preferences.currency, value: trip.currency ?? "—" },
            { label: copy.trips.days, value: trip.days ? String(trip.days) : "—" },
            { label: copy.trips.created, value: dateFormatter.format(new Date(trip.createdAt)) },
          ],
        },
        ...(summaryRows.length > 0 ? [{ heading: copy.trips.estimate, rows: summaryRows }] : []),
      ],
      disclaimer: "Figures are estimates calculated on your device from open data (OpenStreetMap, OSRM) at the time the trip was saved. Always confirm official prices before you travel.",
    });
  }

  function reopen(trip: Trip, autoRun: boolean) {
    try {
      sessionStorage.setItem("autovere-reopen-trip", JSON.stringify({ ...trip, autoRun }));
    } catch {
      /* storage unavailable */
    }
    window.location.href = "/";
  }

  const tripVehicleLabel: Record<string, string> = { petrol: copy.vehicles.typePetrol, diesel: copy.vehicles.typeDiesel, ev: copy.vehicles.typeEv };

  return (
    <section className="panel p-5 sm:p-7">
      <h2 className="text-xl font-bold">{copy.trips.title}</h2>
      {trips === null ? (
        <p className="mt-4 text-sm text-muted-foreground">{copy.loading}</p>
      ) : trips.length === 0 ? (
        <EmptyState title={copy.trips.emptyTitle} body={copy.trips.emptyBody} icon={RouteIcon} />
      ) : (
        <ul className="mt-5 divide-y divide-border">
          {trips.map((trip) => (
            <li key={trip.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                {renamingId === trip.id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(event) => setRenameValue(event.target.value)}
                    onBlur={() => saveRename(trip.id)}
                    onKeyDown={(event) => event.key === "Enter" && saveRename(trip.id)}
                    className="w-full rounded-md border border-border bg-surface-raised px-2 py-1 text-sm outline-none focus:border-primary/60"
                  />
                ) : (
                  <p className="truncate font-semibold">{trip.name}</p>
                )}
                <p className="truncate text-xs text-muted-foreground">
                  {[trip.fromPlace, trip.toPlace].filter(Boolean).join(" → ") || "—"}
                  {trip.vehicleType && tripVehicleLabel[trip.vehicleType] ? ` · ${tripVehicleLabel[trip.vehicleType]}` : ""}
                  {trip.days ? ` · ${trip.days} ${copy.trips.days}` : ""} · {copy.trips.savedOn(dateFormatter.format(new Date(trip.updatedAt)))}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Button size="sm" variant="secondary" disabled={busyId === trip.id} onClick={() => reopen(trip, true)}>
                  {copy.trips.repeat}
                </Button>
                <Button size="sm" variant="ghost" disabled={busyId === trip.id} onClick={() => reopen(trip, false)}>
                  {copy.trips.useAsStart}
                </Button>
                <Button size="sm" variant="ghost" title={copy.trips.print} disabled={busyId === trip.id} onClick={() => print(trip)}>
                  <Printer className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={busyId === trip.id}
                  onClick={() => {
                    setRenamingId(trip.id);
                    setRenameValue(trip.name);
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button size="sm" variant="ghost" disabled={busyId === trip.id} onClick={() => duplicate(trip)}>
                  {copy.trips.duplicate}
                </Button>
                <Button size="sm" variant="ghost" disabled={busyId === trip.id} onClick={() => remove(trip.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const VEHICLE_TYPES: Vehicle["vehicleType"][] = ["petrol", "diesel", "ev"];

function VehiclesSection({ copy }: CopyProps) {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", vehicleType: "petrol" as Vehicle["vehicleType"], consumption: "", rangeKm: "" });
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    jsonFetch<{ vehicles: Vehicle[] }>("/api/vehicles")
      .then((body) => setVehicles(body.vehicles))
      .catch(() => setVehicles([]));
  }

  useEffect(load, []);

  async function add() {
    if (!form.name.trim()) return;
    setBusyId("new");
    try {
      await jsonFetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          vehicleType: form.vehicleType,
          consumption: form.consumption ? Number(form.consumption) : null,
          rangeKm: form.rangeKm ? Number(form.rangeKm) : null,
        }),
      });
      setForm({ name: "", vehicleType: "petrol", consumption: "", rangeKm: "" });
      setAdding(false);
      load();
    } finally {
      setBusyId(null);
    }
  }

  async function setDefault(id: string) {
    setBusyId(id);
    try {
      await jsonFetch(`/api/vehicles?id=${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isDefault: true }) });
      load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm(copy.vehicles.deleteConfirm)) return;
    setBusyId(id);
    try {
      await jsonFetch(`/api/vehicles?id=${id}`, { method: "DELETE" });
      load();
    } finally {
      setBusyId(null);
    }
  }

  const typeLabel: Record<Vehicle["vehicleType"], string> = { petrol: copy.vehicles.typePetrol, diesel: copy.vehicles.typeDiesel, ev: copy.vehicles.typeEv };

  return (
    <section className="panel p-5 sm:p-7">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{copy.vehicles.title}</h2>
        {!adding && (
          <Button size="sm" onClick={() => setAdding(true)}>
            {copy.vehicles.add}
          </Button>
        )}
      </div>

      {adding && (
        <div className="mt-5 space-y-3 rounded-lg border border-border bg-surface-raised p-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">{copy.vehicles.name}</label>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder={copy.vehicles.namePlaceholder} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">{copy.vehicles.type}</label>
              <select value={form.vehicleType} onChange={(event) => setForm({ ...form, vehicleType: event.target.value as Vehicle["vehicleType"] })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60">
                {VEHICLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {typeLabel[type]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">{copy.vehicles.consumption}</label>
              <input type="number" step="0.1" value={form.consumption} onChange={(event) => setForm({ ...form, consumption: event.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">{copy.vehicles.range}</label>
              <input type="number" value={form.rangeKm} onChange={(event) => setForm({ ...form, rangeKm: event.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" disabled={busyId === "new"} onClick={add}>
              {copy.vehicles.save}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setAdding(false)}>
              {copy.vehicles.cancel}
            </Button>
          </div>
        </div>
      )}

      {vehicles === null ? (
        <p className="mt-4 text-sm text-muted-foreground">{copy.loading}</p>
      ) : vehicles.length === 0 && !adding ? (
        <EmptyState title={copy.vehicles.emptyTitle} body={copy.vehicles.emptyBody} icon={Car} />
      ) : (
        <ul className="mt-5 divide-y divide-border">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-2 font-semibold">
                  {vehicle.name}
                  {vehicle.isDefault && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">{copy.vehicles.default}</span>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {typeLabel[vehicle.vehicleType]}
                  {vehicle.consumption ? ` · ${vehicle.consumption}/100km` : ""}
                  {vehicle.rangeKm ? ` · ${vehicle.rangeKm}km` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {!vehicle.isDefault && (
                  <Button size="sm" variant="secondary" disabled={busyId === vehicle.id} onClick={() => setDefault(vehicle.id)}>
                    <Star className="mr-1 size-3.5" /> {copy.vehicles.setDefault}
                  </Button>
                )}
                <Button size="sm" variant="ghost" disabled={busyId === vehicle.id} onClick={() => remove(vehicle.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const PLACE_CATEGORIES: SavedPlace["category"][] = ["charging", "camping", "attraction", "other"];

function PlacesSection({ copy }: CopyProps) {
  const [places, setPlaces] = useState<SavedPlace[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", category: "charging" as SavedPlace["category"], notes: "" });
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    jsonFetch<{ places: SavedPlace[] }>("/api/places")
      .then((body) => setPlaces(body.places))
      .catch(() => setPlaces([]));
  }

  useEffect(load, []);

  async function add() {
    if (!form.name.trim()) return;
    setBusyId("new");
    try {
      await jsonFetch("/api/places", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.trim(), category: form.category, notes: form.notes.trim() || undefined }) });
      setForm({ name: "", category: "charging", notes: "" });
      setAdding(false);
      load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    try {
      await jsonFetch(`/api/places?id=${id}`, { method: "DELETE" });
      load();
    } finally {
      setBusyId(null);
    }
  }

  const categoryLabel: Record<SavedPlace["category"], string> = {
    charging: copy.places.categoryCharging,
    camping: copy.places.categoryCamping,
    attraction: copy.places.categoryAttraction,
    other: copy.places.categoryOther,
  };

  return (
    <section className="panel p-5 sm:p-7">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{copy.places.title}</h2>
        {!adding && (
          <Button size="sm" onClick={() => setAdding(true)}>
            {copy.places.add}
          </Button>
        )}
      </div>

      {adding && (
        <div className="mt-5 space-y-3 rounded-lg border border-border bg-surface-raised p-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">{copy.places.name}</label>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder={copy.places.namePlaceholder} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">{copy.places.category}</label>
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as SavedPlace["category"] })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60">
              {PLACE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {categoryLabel[category]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">{copy.places.notes}</label>
            <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows={2} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" disabled={busyId === "new"} onClick={add}>
              {copy.places.save}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setAdding(false)}>
              {copy.places.cancel}
            </Button>
          </div>
        </div>
      )}

      {places === null ? (
        <p className="mt-4 text-sm text-muted-foreground">{copy.loading}</p>
      ) : places.length === 0 && !adding ? (
        <EmptyState title={copy.places.emptyTitle} body={copy.places.emptyBody} icon={Bookmark} />
      ) : (
        <ul className="mt-5 divide-y divide-border">
          {places.map((place) => (
            <li key={place.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{place.name}</p>
                <p className="text-xs text-muted-foreground">
                  {categoryLabel[place.category]}
                  {place.notes ? ` · ${place.notes}` : ""}
                </p>
              </div>
              <Button size="sm" variant="ghost" disabled={busyId === place.id} onClick={() => remove(place.id)}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function PreferencesSection({ copy, locale, setLocale }: CopyProps & { locale: string; setLocale: (locale: string) => void }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedFlag, setSavedFlag] = useState(false);

  useEffect(() => {
    jsonFetch<{ settings: Settings }>("/api/account?view=settings")
      .then((body) => setSettings(body.settings))
      .catch(() => setSettings({ language: null, currency: null, units: null, notificationsEmail: true, displayName: null }));
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    setSavedFlag(false);
    try {
      await jsonFetch("/api/account?view=settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...settings, language: locale }) });
      setSavedFlag(true);
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return (
      <section className="panel p-5 sm:p-7">
        <h2 className="text-xl font-bold">{copy.preferences.title}</h2>
        <p className="mt-4 text-sm text-muted-foreground">{copy.loading}</p>
      </section>
    );
  }

  return (
    <section className="panel p-5 sm:p-7">
      <h2 className="text-xl font-bold">{copy.preferences.title}</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-wide text-muted-foreground" htmlFor="account-language">
            {copy.preferences.language}
          </label>
          <select id="account-language" value={locale} onChange={(event) => setLocale(event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-foreground outline-none focus:border-primary/60">
            <option value="en">English</option>
            <option value="no">Norsk</option>
            <option value="de">Deutsch</option>
            <option value="nl">Nederlands</option>
            <option value="pl">Polski</option>
            <option value="sv">Svenska</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-muted-foreground" htmlFor="account-currency">
            {copy.preferences.currency}
          </label>
          <select
            id="account-currency"
            value={settings.currency ?? ""}
            onChange={(event) => setSettings({ ...settings, currency: (event.target.value || null) as CurrencyCode | null })}
            className="mt-1 w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-foreground outline-none focus:border-primary/60"
          >
            <option value="">—</option>
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-muted-foreground">{copy.preferences.units}</label>
          <div className="mt-1 flex gap-2">
            <button type="button" onClick={() => setSettings({ ...settings, units: "metric" })} className={`flex-1 rounded-lg border px-3 py-2 text-sm ${settings.units === "metric" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
              {copy.preferences.unitsMetric}
            </button>
            <button type="button" onClick={() => setSettings({ ...settings, units: "imperial" })} className={`flex-1 rounded-lg border px-3 py-2 text-sm ${settings.units === "imperial" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
              {copy.preferences.unitsImperial}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-muted-foreground">{copy.preferences.notifications}</label>
          <label className="mt-1 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.notificationsEmail} onChange={(event) => setSettings({ ...settings, notificationsEmail: event.target.checked })} />
            {copy.preferences.notificationsEmail}
          </label>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Button disabled={saving} onClick={save}>
          {copy.preferences.save}
        </Button>
        {savedFlag && <span className="text-sm text-primary">{copy.preferences.saved}</span>}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{copy.preferences.more}</p>
    </section>
  );
}
