import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Plus } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/garage")({
  head: () => ({
    meta: [
      { title: "My Garage & Trips — Vehicles, Tags and Saved Routes | AutoVere" },
      {
        name: "description",
        content:
          "Keep your cars, campervans and motorcycles, their tank capacities and toll tags, plus every saved itinerary ready for instant GPX download.",
      },
      { property: "og:title", content: "My Garage & Trips | AutoVere" },
      {
        property: "og:description",
        content: "Your vehicles, toll tags and saved adventures in one calm place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GaragePage,
});

const VEHICLES = [
  {
    emoji: "🏍️",
    name: "BMW R 1250 GS Adventure",
    spec: "30 L tank · 4.8 L/100 km · 2 riders",
    tags: ["AutoPASS", "Telepass"],
  },
  {
    emoji: "🚐",
    name: "Hymer B-Klasse ML-T 580",
    spec: "3.5 t · 3.05 m height · 90 L tank",
    tags: ["Telepass", "Bip&Go"],
  },
  {
    emoji: "🚗",
    name: "Tesla Model Y Long Range",
    spec: "75 kWh · 18 kWh/100 km · CCS",
    tags: ["AutoPASS", "SunPass"],
  },
];

const TRIPS = [
  { name: "Munich → Amalfi Coast", detail: "1,420 km · 14h 30m · €318 budget", when: "Saved 12 Aug" },
  { name: "Oslo → Lofoten", detail: "1,380 km · 19h 05m · NOK 4,210 budget", when: "Saved 2 Jul" },
  { name: "Seattle → Big Sur", detail: "1,890 km · 20h 40m · $412 budget", when: "Saved 18 Jun" },
  { name: "Toronto → Banff", detail: "3,420 km · 34h 10m · C$890 budget", when: "Saved 4 May" },
];

function GaragePage() {
  const [saved, setSaved] = useState<typeof TRIPS>([]);
  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem("autovere.savedTrips") ?? "[]"));
    } catch {
      setSaved([]);
    }
  }, []);
  const trips = [...saved, ...TRIPS];

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          My Garage &amp; Trips
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Welcome back — your road is ready.
        </h1>
        <p className="mt-4 max-w-2xl text-foreground/75">
          Your vehicles, toll tags and every adventure you've costed, saved and ready to roll again.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-tight">🏍️ / 🚗 My Vehicle Profiles</h2>
              <Button size="sm" variant="secondary">
                <Plus className="size-4" /> Add vehicle
              </Button>
            </div>
            <div className="mt-4 grid gap-4">
              {VEHICLES.map((v) => (
                <article key={v.name} className="glass-panel flex gap-4 rounded-2xl p-5">
                  <span className="text-3xl">{v.emoji}</span>
                  <div>
                    <h3 className="font-semibold tracking-tight">{v.name}</h3>
                    <p className="text-sm text-foreground/70">{v.spec}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {v.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight">🗺️ Saved Adventures</h2>
            <div className="mt-4 grid gap-4">
              {trips.map((t) => (
                <article
                  key={t.name}
                  className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5"
                >
                  <div>
                    <h3 className="font-semibold tracking-tight">{t.name}</h3>
                    <p className="text-sm text-foreground/70">{t.detail}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t.when}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="size-4" /> GPX
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
