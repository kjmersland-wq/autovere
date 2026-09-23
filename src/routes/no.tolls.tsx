import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";
import { absUrl, appPageHreflangLinks } from "@/lib/seo";

export const Route = createFileRoute("/no/tolls")({
  head: () => ({
    meta: [
      { title: "Bompenger og vignetter forklart — Europa, USA og Canada | AutoVere" },
      {
        name: "description",
        content:
          "Oppdatert og vennlig veiledning om bompenger, vignetter og bombrikker i Europa, USA og Canada for bil, bobil og motorsykkel.",
      },
      { property: "og:title", content: "Bompenger og vignetter forklart | AutoVere" },
      {
        property: "og:description",
        content: "Vit hvilken vignett eller brikke du trenger — før du er ved grensen.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "nb_NO" },
      { property: "og:url", content: absUrl("/no/tolls") },
      { property: "og:image", content: "https://www.autovere.com/og/og-no.jpg" },
      { property: "og:image:secure_url", content: "https://www.autovere.com/og/og-no.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://www.autovere.com/og/og-no.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absUrl("/no/tolls") }, ...appPageHreflangLinks("tolls")],
  }),
  component: NoTollsPage,
});

const GUIDES = [
  {
    region: "🇪🇺 Europa",
    items: [
      { name: "Digital vignett i Østerrike", detail: "10 dager, 2 måneder eller ett år. Knyttet til skiltet, aktiveres straks." },
      { name: "Sveitsisk e-vignett", detail: "Kun årsvignett, gyldig i 14 måneder. Motorsykler trenger sin egen." },
      { name: "Billettbom i Frankrike og Italia", detail: "Ta billett, betal ved utkjøring. Telepass og Bip&Go går raskere." },
      { name: "AutoPASS i Norge", detail: "Automatisk skiltavlesning med rabatter for registrerte elbiler." },
    ],
  },
  {
    region: "🇺🇸 USA",
    items: [
      { name: "E-ZPass-nettverket", detail: "Én brikke dekker 19 delstater fra Maine til Illinois." },
      { name: "SunPass (Florida)", detail: "Best pris på Turnpike og ekspressfelt i Miami." },
      { name: "FasTrak (California)", detail: "Kreves for rabatt på broer og ekspressfelt." },
      { name: "Skiltbasert betaling", detail: "Leiebiler legger ofte på et daglig gebyr — sjekk før du henter bilen." },
    ],
  },
  {
    region: "🇨🇦 Canada",
    items: [
      { name: "Highway 407 ETR", detail: "Ontarios helelektroniske bomvei. Brikke er billigere enn kamerafaktura." },
      { name: "Cobequid Pass", detail: "Nova Scotias eneste bomvei på hovedveien — kontant og kort." },
      { name: "Bomavgift på broer", detail: "Confederation Bridge betales kun når du kjører ut fra PEI." },
    ],
  },
];

function NoTollsPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Bompenger og vignetter
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Hver bomstasjon, oblat og brikke — gjort enkelt.
        </h1>
        <p className="mt-4 max-w-2xl text-foreground/75">
          Ingen gjetting, ingen gebyrer. Her er hva du trenger i hvert land, og hvordan du skaffer
          det før du kjører.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <div key={g.region} className="glass-panel rounded-2xl p-6">
              <h2 className="text-lg font-semibold tracking-tight">{g.region}</h2>
              <ul className="mt-4 grid gap-3">
                {g.items.map((i) => (
                  <li key={i.name} className="rounded-xl border border-border bg-background/40 p-4">
                    <p className="text-sm font-medium">{i.name}</p>
                    <p className="mt-1 text-sm text-foreground/70">{i.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
