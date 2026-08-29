import { createFileRoute } from "@tanstack/react-router";
import { AppLink as Link } from "@/components/AppLink";
import { useState } from "react";
import {
  Bookmark,
  Car,
  Check,
  CreditCard,
  Download,
  Handshake,
  HelpCircle,
  LayoutDashboard,
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
import { marketingCopy } from "@/lib/marketing-i18n";
import { openPrintReport } from "@/lib/print-report";
import { AccountShell, EmptyState, type AccountNavItem } from "@/components/account/AccountFrame";
import { URL_LANG_TO_LOCALE } from "@/lib/i18n";
import { demoSeoTitles } from "@/lib/seo";

export const Route = createFileRoute("/{-$lang}/demo")({
  component: DemoPage,
  head: (ctx) => {
    const lang = (ctx.params as { lang?: string }).lang;
    const locale = lang ? (URL_LANG_TO_LOCALE[lang] ?? "en") : "en";
    return { meta: [{ title: demoSeoTitles[locale] ?? demoSeoTitles.en }, { name: "robots", content: "noindex" }] };
  },
});

type Section = "overview" | "trips" | "vehicles" | "preferences" | "billing" | "places" | "profile" | "help";

type DemoTrip = {
  id: string;
  name: string;
  from: string;
  to: string;
  vehicle: string;
  days: number;
  savedOn: string;
  summary: { label: string; value: string }[];
  stops: string[];
};

const proPlan = marketingCopy.en.plans[1]!;

const demoTrips: DemoTrip[] = [
  {
    id: "oslo-garda",
    name: "Oslo → Lake Garda",
    from: "Oslo, Norway",
    to: "Lake Garda, Italy",
    vehicle: "Electric (EV)",
    days: 6,
    savedOn: "3 days ago",
    summary: [
      { label: "Distance", value: "2,180 km · 22h 40m" },
      { label: "Fuel / Charging", value: "€96 (charging)" },
      { label: "Tolls", value: "€78" },
      { label: "Vignettes", value: "€40" },
      { label: "Total trip cost", value: "€214" },
    ],
    stops: ["Gothenburg overnight", "Hamburg charging stop", "Nuremberg scenic detour", "Brenner Pass crossing"],
  },
  {
    id: "munich-split",
    name: "Munich → Split",
    from: "Munich, Germany",
    to: "Split, Croatia",
    vehicle: "Diesel",
    days: 4,
    savedOn: "1 week ago",
    summary: [
      { label: "Distance", value: "940 km · 9h 50m" },
      { label: "Fuel", value: "€121" },
      { label: "Tolls", value: "€34" },
      { label: "Vignettes", value: "€32 (Slovenia + Croatia)" },
      { label: "Total trip cost", value: "€187" },
    ],
    stops: ["Ljubljana coffee stop", "Plitvice Lakes detour"],
  },
  {
    id: "paris-nice",
    name: "Paris → Nice",
    from: "Paris, France",
    to: "Nice, France",
    vehicle: "Electric (EV)",
    days: 3,
    savedOn: "2 weeks ago",
    summary: [
      { label: "Distance", value: "930 km · 8h 15m" },
      { label: "Fuel / Charging", value: "€52 (charging)" },
      { label: "Tolls", value: "€79" },
      { label: "Vignettes", value: "None required" },
      { label: "Total trip cost", value: "€142" },
    ],
    stops: ["Lyon lunch stop", "Avignon old town"],
  },
];

const demoVehicles = [
  { id: "v1", name: "Family EV", type: "Electric (EV)", detail: "18 kWh/100km · 420 km real-world range", isDefault: true },
  { id: "v2", name: "Weekend Tourer", type: "Diesel", detail: "6.1 L/100km", isDefault: false },
];

const demoPlaces = [
  { id: "p1", name: "Ionity Brenner Pass", category: "Charging", notes: "350 kW, rarely busy before 9am" },
  { id: "p2", name: "Fjord View Campsite", category: "Camping / overnight", notes: "Great for EV overnight charging" },
  { id: "p3", name: "Plitvice Lakes", category: "Attraction", notes: "Book entry tickets ahead in summer" },
  { id: "p4", name: "Lyon Old Town", category: "Attraction", notes: "Good lunch stop, 20 min off the A6" },
];

const demoInvoices = [
  { id: "inv1", date: "1 Aug 2026", amount: "€90.00" },
  { id: "inv2", date: "1 Aug 2025", amount: "€90.00" },
];

function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
      Demo — Fictional Data
    </span>
  );
}

function DemoPage() {
  const [section, setSection] = useState<Section>("overview");
  const [openTripId, setOpenTripId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  const nav: AccountNavItem<Section>[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "trips", label: "My Trips", icon: RouteIcon },
    { key: "vehicles", label: "My Vehicles", icon: Car },
    { key: "preferences", label: "Settings", icon: SlidersHorizontal },
    { key: "billing", label: "Subscription & Billing", icon: CreditCard },
    { key: "places", label: "Saved Places", icon: Bookmark },
    { key: "profile", label: "Profile & Security", icon: ShieldCheck },
    { key: "help", label: "Help & Support", icon: HelpCircle },
  ];

  function printTrip(trip: DemoTrip) {
    openPrintReport({
      title: trip.name,
      subtitle: `${trip.from} → ${trip.to}`,
      generatedAtLabel: new Intl.DateTimeFormat("en", { dateStyle: "long", timeStyle: "short" }).format(new Date()),
      sections: [
        { heading: "Trip", rows: [{ label: "Vehicle", value: trip.vehicle }, { label: "Duration", value: `${trip.days} days` }] },
        { heading: "Estimate", rows: trip.summary },
        { heading: "Stops", rows: trip.stops.map((stop, index) => ({ label: `Stop ${index + 1}`, value: stop })) },
      ],
      disclaimer: "This is a demo report using fictional data for illustration purposes only. It is not a real AutoVere calculation.",
    });
  }

  return (
    <AccountShell
      backLabel="Explore AutoVere"
      eyebrow="AUTOVERE"
      title="Welcome back, Alex"
      subtitle="This demonstration uses fictional data and is for illustration purposes only — every screen below works exactly like a real AutoVere Pro account."
      badge={<DemoBadge />}
      nav={nav}
      active={section}
      onSelect={setSection}
    >
      {section === "overview" && (
        <>
          <div className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7 border-primary/60 panel-glow">
            <div>
              <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                <Sparkles className="size-3.5" /> AutoVere Pro
              </span>
              <p className="text-lg font-bold">Alex Morgan</p>
              <p className="mt-1 text-sm text-muted-foreground">Active — billed yearly · Renews in 214 days</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link to="/pricing">
                <Button>Start your own journey</Button>
              </Link>
            </div>
          </div>

          <section className="panel p-5 sm:p-7">
            <h2 className="text-xl font-bold">What's unlocked on this plan</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {proPlan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {typeof feature === "string" ? <span>{feature}</span> : <span><span className="block font-semibold text-foreground">{feature.title}</span><span className="mt-0.5 block text-xs leading-relaxed">{feature.detail}</span></span>}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {section === "billing" && (
        <section className="panel p-5 sm:p-7">
          <h2 className="text-xl font-bold">Subscription & Billing</h2>
          <div className="mt-5 space-y-5">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Plan</dt>
                <dd className="mt-1 text-sm font-semibold">AutoVere Pro</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Next renewal</dt>
                <dd className="mt-1 text-sm font-semibold">14 March 2027</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Payment method</dt>
                <dd className="mt-1 text-sm font-semibold">VISA •••• 4242</dd>
              </div>
            </dl>
            <Button disabled>Manage plan, payment method & invoices</Button>
            <div>
              <h3 className="text-sm font-bold">Billing history</h3>
              <ul className="mt-3 divide-y divide-border">
                {demoInvoices.map((invoice) => (
                  <li key={invoice.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span className="text-muted-foreground">{invoice.date}</span>
                    <span className="font-semibold">{invoice.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {section === "trips" && (
        <section className="panel p-5 sm:p-7">
          <h2 className="text-xl font-bold">My Trips</h2>
          <ul className="mt-5 divide-y divide-border">
            {demoTrips.map((trip) => (
              <li key={trip.id} className="py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    {renamingId === trip.id ? (
                      <input autoFocus defaultValue={trip.name} onBlur={() => setRenamingId(null)} onKeyDown={(event) => event.key === "Enter" && setRenamingId(null)} className="w-full rounded-md border border-border bg-surface-raised px-2 py-1 text-sm outline-none focus:border-primary/60" />
                    ) : (
                      <p className="truncate font-semibold">{trip.name}</p>
                    )}
                    <p className="truncate text-xs text-muted-foreground">
                      {trip.from} → {trip.to} · Saved {trip.savedOn}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setOpenTripId(openTripId === trip.id ? null : trip.id)}>
                      {openTripId === trip.id ? "Close" : "Open"}
                    </Button>
                    <Button size="sm" variant="ghost" title="Print / Save as PDF" onClick={() => printTrip(trip)}>
                      <Printer className="size-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setRenamingId(trip.id)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      Duplicate
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                {openTripId === trip.id && (
                  <dl className="mt-4 grid gap-3 rounded-lg border border-border bg-surface-raised p-4 sm:grid-cols-2">
                    {trip.summary.map((row) => (
                      <div key={row.label}>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{row.label}</dt>
                        <dd className="text-sm font-semibold">{row.value}</dd>
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <dt className="text-xs uppercase tracking-wide text-muted-foreground">Stops</dt>
                      <dd className="mt-1 flex flex-wrap gap-2">
                        {trip.stops.map((stop) => (
                          <span key={stop} className="inline-flex items-center rounded-full bg-background px-2.5 py-1 text-xs">
                            {stop}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {section === "vehicles" && (
        <section className="panel p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">My Vehicles</h2>
            <Button size="sm">Add vehicle</Button>
          </div>
          <ul className="mt-5 divide-y divide-border">
            {demoVehicles.map((vehicle) => (
              <li key={vehicle.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    {vehicle.name}
                    {vehicle.isDefault && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">Default</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {vehicle.type} · {vehicle.detail}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {!vehicle.isDefault && (
                    <Button size="sm" variant="secondary">
                      <Star className="mr-1 size-3.5" /> Set as default
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {section === "places" && (
        <section className="panel p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Saved Places</h2>
            <Button size="sm">Add place</Button>
          </div>
          <ul className="mt-5 divide-y divide-border">
            {demoPlaces.map((place) => (
              <li key={place.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{place.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {place.category} · {place.notes}
                  </p>
                </div>
                <Button size="sm" variant="ghost">
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
          {demoPlaces.length === 0 && <EmptyState title="No saved places yet" body="Save chargers, stays and stops you want to find again." icon={Bookmark} />}
        </section>
      )}

      {section === "preferences" && (
        <section className="panel p-5 sm:p-7">
          <h2 className="text-xl font-bold">Settings</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Language</label>
              <select disabled value="en" className="mt-1 w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-foreground outline-none">
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Currency</label>
              <select disabled value="EUR" className="mt-1 w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-foreground outline-none">
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Measurement units</label>
              <div className="mt-1 flex gap-2">
                <span className="flex-1 rounded-lg border border-primary bg-primary/10 px-3 py-2 text-center text-sm text-primary">Metric (km, litres)</span>
                <span className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm text-muted-foreground">Imperial (miles, gallons)</span>
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Notifications</label>
              <label className="mt-1 flex items-center gap-2 text-sm">
                <input type="checkbox" checked readOnly /> Email me about my account and billing
              </label>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">Settings are illustrative in this demo — nothing here is saved.</p>
        </section>
      )}

      {section === "profile" && (
        <section className="space-y-6">
          <div className="panel p-5 sm:p-7">
            <h2 className="text-xl font-bold">Profile & Security</h2>
            <div className="mt-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
              <p className="mt-1 text-sm font-semibold">alex.morgan@example.com</p>
            </div>
            <div className="mt-5 rounded-lg border border-border bg-surface-raised p-4">
              <p className="text-sm font-semibold">Sign-in</p>
              <p className="mt-1 text-sm text-muted-foreground">AutoVere uses secure email sign-in links instead of a password — there's nothing to remember, and nothing that can be guessed.</p>
            </div>
            <div className="mt-5 rounded-lg border border-border bg-surface-raised p-4">
              <p className="text-sm font-semibold">Export my data</p>
              <p className="mt-1 text-sm text-muted-foreground">Download a copy of everything linked to your account.</p>
              <Button variant="secondary" className="mt-3" disabled>
                <Download className="mr-1.5 size-4" /> Export my data
              </Button>
            </div>
          </div>
          <div className="panel border-destructive/40 p-5 sm:p-7">
            <h2 className="text-xl font-bold text-destructive">Danger zone</h2>
            <Button variant="destructive" className="mt-5" disabled>
              Delete account
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">Disabled in this demo — no real account exists to delete.</p>
          </div>
        </section>
      )}

      {section === "help" && (
        <section className="space-y-6">
          <div className="panel p-5 sm:p-7">
            <h2 className="text-xl font-bold">Help & Support</h2>
            <p className="mt-2 text-sm text-muted-foreground">The same help centre and support channel every AutoVere subscriber uses.</p>
          </div>
          <div className="panel p-5 sm:p-7">
            <h3 className="text-lg font-bold">Frequently asked questions</h3>
            <p className="mt-2 text-sm text-muted-foreground">Answers to the most common questions about routes, tolls, vignettes and charging.</p>
            <Link to="/faq">
              <Button className="mt-4">Open Help & FAQ</Button>
            </Link>
          </div>
          <div className="panel p-5 sm:p-7">
            <h3 className="text-lg font-bold">Contact support</h3>
            <p className="mt-2 text-sm text-muted-foreground">Send us a message and we'll get back to you.</p>
            <Button className="mt-4" onClick={() => setContactOpen(true)}>
              Send a message
            </Button>
          </div>
        </section>
      )}

      <section className="panel overflow-hidden p-6 sm:p-8 border-primary/40">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Handshake className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Clubs & Organisations</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                AutoVere offers members of selected partner organizations 25% off their AutoVere subscription. EV, touring, camping, mobility and
                other relevant automotive organizations can get in touch to discuss a member partnership.
              </p>
            </div>
          </div>
          <Button variant="secondary" className="shrink-0" onClick={() => setContactOpen(true)}>
            Become a partner
          </Button>
        </div>
      </section>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </AccountShell>
  );
}
