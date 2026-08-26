import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Battery,
  Bookmark,
  Car,
  Check,
  Handshake,
  HelpCircle,
  LayoutDashboard,
  MapPin,
  Printer,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/ContactModal";
import { marketingCopy } from "@/lib/marketing-i18n";
import { openPrintReport } from "@/lib/print-report";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
  head: () => ({ meta: [{ title: "AutoVere Demo — See the full Pro experience" }, { name: "robots", content: "noindex" }] }),
});

type Section = "overview" | "trips" | "vehicles" | "places" | "preferences" | "profile" | "help";

type DemoTrip = {
  id: string;
  name: string;
  from: string;
  to: string;
  vehicle: string;
  days: number;
  distanceKm: number;
  driveTime: string;
  total: string;
  fuel: string;
  tolls: string;
  vignettes: string;
  charging: string;
  stops: string[];
  savedOn: string;
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
    distanceKm: 2180,
    driveTime: "22h 40m",
    total: "€214",
    fuel: "€96 (charging)",
    tolls: "€78",
    vignettes: "€40",
    charging: "6 ultra-fast stops, 75% safety buffer",
    stops: ["Gothenburg overnight", "Hamburg charging stop", "Nuremberg scenic detour", "Brenner Pass crossing"],
    savedOn: "3 days ago",
  },
  {
    id: "munich-split",
    name: "Munich → Split",
    from: "Munich, Germany",
    to: "Split, Croatia",
    vehicle: "Diesel",
    days: 4,
    distanceKm: 940,
    driveTime: "9h 50m",
    total: "€187",
    fuel: "€121",
    tolls: "€34",
    vignettes: "€32 (Slovenia + Croatia)",
    charging: "—",
    stops: ["Ljubljana coffee stop", "Plitvice Lakes detour"],
    savedOn: "1 week ago",
  },
  {
    id: "paris-nice",
    name: "Paris → Nice",
    from: "Paris, France",
    to: "Nice, France",
    vehicle: "Electric (EV)",
    days: 3,
    distanceKm: 930,
    driveTime: "8h 15m",
    total: "€142",
    fuel: "€52 (charging)",
    tolls: "€79",
    vignettes: "None required",
    charging: "3 ultra-fast stops along the A6/A7",
    stops: ["Lyon lunch stop", "Avignon old town"],
    savedOn: "2 weeks ago",
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

function DemoPage() {
  const [section, setSection] = useState<Section>("overview");
  const [openTripId, setOpenTripId] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  const nav: { key: Section; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "trips", label: "My Trips", icon: RouteIcon },
    { key: "vehicles", label: "My Vehicles", icon: Car },
    { key: "places", label: "Saved Places", icon: Bookmark },
    { key: "preferences", label: "Settings", icon: SlidersHorizontal },
    { key: "profile", label: "Profile & Security", icon: ShieldCheck },
    { key: "help", label: "Help & Support", icon: HelpCircle },
  ];

  function printTrip(trip: DemoTrip) {
    openPrintReport({
      title: trip.name,
      subtitle: `${trip.from} → ${trip.to}`,
      generatedAtLabel: new Intl.DateTimeFormat("en", { dateStyle: "long", timeStyle: "short" }).format(new Date()),
      sections: [
        {
          heading: "Trip",
          rows: [
            { label: "Vehicle", value: trip.vehicle },
            { label: "Distance", value: `${trip.distanceKm} km` },
            { label: "Drive time", value: trip.driveTime },
            { label: "Duration", value: `${trip.days} days` },
          ],
        },
        {
          heading: "Estimate",
          rows: [
            { label: "Fuel / Charging", value: trip.fuel },
            { label: "Tolls", value: trip.tolls },
            { label: "Vignettes", value: trip.vignettes },
            { label: "Total trip cost", value: trip.total },
          ],
        },
        { heading: "Stops", rows: trip.stops.map((stop, index) => ({ label: `Stop ${index + 1}`, value: stop })) },
      ],
      disclaimer: "This is a demo report using fictional data for illustration purposes only. It is not a real AutoVere calculation.",
    });
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" /> Explore AutoVere
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
            Demo — Fictional Data
          </span>
        </div>

        <header className="mt-8 max-w-3xl">
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-primary">AUTOVERE</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">See the full AutoVere Pro experience</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            This is a live walkthrough of a Pro subscriber's account, populated with fictional trips, vehicles and places so you can explore
            every screen. This demonstration uses fictional data and is for illustration purposes only.
          </p>
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
                <div className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7 border-primary/60 panel-glow">
                  <div>
                    <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                      <Sparkles className="size-3.5" /> AutoVere Pro
                    </span>
                    <p className="text-lg font-bold">Alex Morgan</p>
                    <p className="mt-1 text-sm text-muted-foreground">European road-trip profile · Active · billed yearly · renews in 214 days</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-3">
                    <Link to="/pricing">
                      <Button>Start your own journey</Button>
                    </Link>
                  </div>
                </div>

                <section className="panel p-5 sm:p-7">
                  <h2 className="text-xl font-bold">What Pro unlocks</h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {proPlan.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" /> <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="panel p-5 sm:p-7">
                  <h2 className="text-xl font-bold">Recent activity</h2>
                  <ul className="mt-4 divide-y divide-border">
                    {demoTrips.map((trip) => (
                      <li key={trip.id} className="flex items-center justify-between py-2.5 text-sm">
                        <span className="font-medium">{trip.name}</span>
                        <span className="text-muted-foreground">{trip.total} · saved {trip.savedOn}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            {section === "trips" && (
              <section className="panel p-5 sm:p-7">
                <h2 className="text-xl font-bold">My Trips</h2>
                <ul className="mt-5 space-y-3">
                  {demoTrips.map((trip) => (
                    <li key={trip.id} className="rounded-lg border border-border">
                      <button type="button" onClick={() => setOpenTripId(openTripId === trip.id ? null : trip.id)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{trip.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {trip.vehicle} · {trip.days} days · saved {trip.savedOn}
                          </p>
                        </div>
                        <span className="shrink-0 font-bold text-primary">{trip.total}</span>
                      </button>
                      {openTripId === trip.id && (
                        <div className="border-t border-border p-4 pt-4">
                          <dl className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Distance</dt>
                              <dd className="text-sm font-semibold">{trip.distanceKm} km · {trip.driveTime}</dd>
                            </div>
                            <div>
                              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Fuel / Charging</dt>
                              <dd className="text-sm font-semibold">{trip.fuel}</dd>
                            </div>
                            <div>
                              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Tolls</dt>
                              <dd className="text-sm font-semibold">{trip.tolls}</dd>
                            </div>
                            <div>
                              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Vignettes</dt>
                              <dd className="text-sm font-semibold">{trip.vignettes}</dd>
                            </div>
                            {trip.charging !== "—" && (
                              <div className="sm:col-span-2">
                                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Charging plan</dt>
                                <dd className="text-sm font-semibold">{trip.charging}</dd>
                              </div>
                            )}
                            <div className="sm:col-span-2">
                              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Stops</dt>
                              <dd className="mt-1 flex flex-wrap gap-2">
                                {trip.stops.map((stop) => (
                                  <span key={stop} className="inline-flex items-center gap-1 rounded-full bg-surface-raised px-2.5 py-1 text-xs">
                                    <MapPin className="size-3" /> {stop}
                                  </span>
                                ))}
                              </dd>
                            </div>
                          </dl>
                          <Button size="sm" variant="secondary" className="mt-4" onClick={() => printTrip(trip)}>
                            <Printer className="mr-1.5 size-4" /> Print / Save as PDF
                          </Button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {section === "vehicles" && (
              <section className="panel p-5 sm:p-7">
                <h2 className="text-xl font-bold">My Vehicles</h2>
                <ul className="mt-5 divide-y divide-border">
                  {demoVehicles.map((vehicle) => (
                    <li key={vehicle.id} className="flex items-center justify-between gap-3 py-4">
                      <div>
                        <p className="flex items-center gap-2 font-semibold">
                          {vehicle.name}
                          {vehicle.isDefault && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">Default</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {vehicle.type} · {vehicle.detail}
                        </p>
                      </div>
                      <Battery className="size-5 shrink-0 text-muted-foreground/50" />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {section === "places" && (
              <section className="panel p-5 sm:p-7">
                <h2 className="text-xl font-bold">Saved Places</h2>
                <ul className="mt-5 divide-y divide-border">
                  {demoPlaces.map((place) => (
                    <li key={place.id} className="py-4">
                      <p className="font-semibold">{place.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {place.category} · {place.notes}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {section === "preferences" && (
              <section className="panel p-5 sm:p-7">
                <h2 className="text-xl font-bold">Settings</h2>
                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Language</dt>
                    <dd className="mt-1 text-sm font-semibold">English</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Currency</dt>
                    <dd className="mt-1 text-sm font-semibold">EUR</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Units</dt>
                    <dd className="mt-1 text-sm font-semibold">Metric (km, litres)</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Notifications</dt>
                    <dd className="mt-1 text-sm font-semibold">Email updates on</dd>
                  </div>
                </dl>
                <p className="mt-5 text-sm text-muted-foreground">Settings are illustrative in this demo and are not saved anywhere.</p>
              </section>
            )}

            {section === "profile" && (
              <section className="panel p-5 sm:p-7">
                <h2 className="text-xl font-bold">Profile & Security</h2>
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Name</p>
                  <p className="mt-1 text-sm font-semibold">Alex Morgan</p>
                </div>
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                  <p className="mt-1 text-sm font-semibold">alex.morgan@example.com</p>
                </div>
                <div className="mt-5 rounded-lg border border-border bg-surface-raised p-4">
                  <p className="text-sm font-semibold">Sign-in</p>
                  <p className="mt-1 text-sm text-muted-foreground">AutoVere uses secure email sign-in links instead of a password.</p>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">This is a fictional demo profile — no real account, export or deletion actions are available here.</p>
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
                  <Link to="/faq">
                    <Button className="mt-4">Open Help & FAQ</Button>
                  </Link>
                </div>
                <div className="panel p-5 sm:p-7">
                  <h3 className="text-lg font-bold">Contact support</h3>
                  <Button className="mt-4" onClick={() => setContactOpen(true)}>
                    Send a message
                  </Button>
                </div>
              </section>
            )}
          </div>
        </div>

        <section className="mt-12 panel overflow-hidden p-6 sm:p-8 border-primary/40">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Handshake className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold">Offer AutoVere to your members</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  AutoVere offers members of selected partner organizations 25% off their AutoVere subscription. EV, touring, camping, mobility
                  and other relevant automotive organizations can get in touch to discuss a member partnership.
                </p>
              </div>
            </div>
            <Button className="shrink-0" onClick={() => setContactOpen(true)}>
              Become a partner
            </Button>
          </div>
        </section>

        <footer className="mt-10 border-t border-border pt-6">
          <div className="text-xs leading-relaxed text-muted-foreground">
            <p className="font-semibold text-foreground">AutoVere · autovere.com</p>
            <p className="mt-2">AutoVere is developed and operated by KM TECH LABS in Kristiansand, Norway. Org.nr. 934 044 029.</p>
            <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-2" aria-label="Legal links">
              <Link to="/legal" className="hover:text-foreground">Legal Notice</Link>
              <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-foreground">Terms & Disclaimer</Link>
              <Link to="/faq" className="hover:text-foreground">Help & FAQ</Link>
              <Link to="/pricing" className="hover:text-foreground">Prices & Plans</Link>
            </nav>
          </div>
        </footer>
      </div>
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </main>
  );
}
