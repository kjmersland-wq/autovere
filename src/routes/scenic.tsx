import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/scenic")({
  head: () => ({
    meta: [
      { title: "Scenic Passes & Ferries — The Roads Worth the Detour | AutoVere" },
      {
        name: "description",
        content:
          "Alpine passes, coastal highways and vehicle ferries across Europe, the USA and Canada, with opening seasons, clearances and booking tips.",
      },
      { property: "og:title", content: "Scenic Passes & Ferries | AutoVere" },
      {
        property: "og:description",
        content: "The passes and crossings worth planning your whole trip around.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScenicPage,
});

const PASSES = [
  { name: "Furka Pass", place: "🇨🇭 Switzerland", note: "Open now · 2,429 m · dry tarmac today", type: "Pass" },
  { name: "Stelvio Pass", place: "🇮🇹 Italy", note: "Open June–October · 48 hairpins", type: "Pass" },
  { name: "Atlantic Road", place: "🇳🇴 Norway", note: "Open all year · toll-free since 2011", type: "Coastal" },
  { name: "Going-to-the-Sun Road", place: "🇺🇸 Montana", note: "Vehicles under 21ft · timed entry", type: "Pass" },
  { name: "Icefields Parkway", place: "🇨🇦 Alberta", note: "Park pass required · 232 km of glaciers", type: "Coastal" },
  { name: "Tsawwassen → Swartz Bay", place: "🇨🇦 BC Ferries", note: "Reserve ahead in summer · 1h 35m", type: "Ferry" },
  { name: "Anacortes → Friday Harbor", place: "🇺🇸 Washington", note: "Vehicle deck fills fast on weekends", type: "Ferry" },
  { name: "Naples → Capri", place: "🇮🇹 Italy", note: "Limited vehicle permits · book early", type: "Ferry" },
];

function ScenicPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Scenic passes &amp; ferries
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          The detours you'll still talk about years later.
        </h1>
        <p className="mt-4 max-w-2xl text-foreground/75">
          Live-season passes, coastal highways and vehicle ferries — with the clearances and booking
          notes that keep the day stress-free.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PASSES.map((p) => (
            <article key={p.name} className="glass-panel rounded-2xl p-5 transition-transform hover:-translate-y-1">
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                {p.type}
              </span>
              <h2 className="mt-3 text-lg font-semibold tracking-tight">{p.name}</h2>
              <p className="text-sm text-foreground/70">{p.place}</p>
              <p className="mt-3 text-sm text-foreground/85">{p.note}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
