import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/no/scenic")({
  head: () => ({
    meta: [
      { title: "Fjelloverganger og ferjer — Omveiene som er verdt det | AutoVere" },
      {
        name: "description",
        content:
          "Alpepass, kystveier og bilferjer i Europa, USA og Canada, med åpningssesong, høydebegrensninger og bookingtips.",
      },
      { property: "og:title", content: "Fjelloverganger og ferjer | AutoVere" },
      {
        property: "og:description",
        content: "Overgangene og overfartene som er verdt å planlegge hele turen rundt.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NoScenicPage,
});

const PASSES = [
  { name: "Furkapasset", place: "🇨🇭 Sveits", note: "Åpent nå · 2 429 m · tørr asfalt i dag", type: "Fjellovergang" },
  { name: "Stelviopasset", place: "🇮🇹 Italia", note: "Åpent juni–oktober · 48 hårnålssvinger", type: "Fjellovergang" },
  { name: "Atlanterhavsveien", place: "🇳🇴 Norge", note: "Åpen hele året · bomfri siden 2011", type: "Kystvei" },
  { name: "Going-to-the-Sun Road", place: "🇺🇸 Montana", note: "Kjøretøy under 6,4 m · tidsbestilt innkjøring", type: "Fjellovergang" },
  { name: "Icefields Parkway", place: "🇨🇦 Alberta", note: "Krever parkbillett · 232 km med breer", type: "Kystvei" },
  { name: "Tsawwassen → Swartz Bay", place: "🇨🇦 BC Ferries", note: "Bestill i god tid om sommeren · 1t 35m", type: "Ferje" },
  { name: "Anacortes → Friday Harbor", place: "🇺🇸 Washington", note: "Bildekket fylles fort i helgene", type: "Ferje" },
  { name: "Napoli → Capri", place: "🇮🇹 Italia", note: "Begrenset antall bilplasser · bestill tidlig", type: "Ferje" },
];

function NoScenicPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Fjelloverganger og ferjer
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Omveiene du fortsatt snakker om flere år etterpå.
        </h1>
        <p className="mt-4 max-w-2xl text-foreground/75">
          Fjelloverganger med sesongstatus, kystveier og bilferjer — med høydebegrensninger og
          bookingtips som gjør dagen stressfri.
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
