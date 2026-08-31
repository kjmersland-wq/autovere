import { SiteHeader } from "@/components/SiteHeader";
import { useTr } from "@/lib/i18n";


const GUIDES = [
  {
    region: "🇪🇺 Europe",
    items: [
      { name: "Austria digital vignette", detail: "10-day, 2-month or annual. Plate-linked, activates instantly." },
      { name: "Switzerland e-vignette", detail: "Annual only, valid 14 months. Motorcycles need their own." },
      { name: "France & Italy ticket tolls", detail: "Take a ticket, pay on exit. Telepass and Bip&Go tags speed it up." },
      { name: "Norway AutoPASS", detail: "Automatic plate billing with discounts for registered EVs." },
    ],
  },
  {
    region: "🇺🇸 United States",
    items: [
      { name: "E-ZPass network", detail: "One transponder covers 19 states from Maine to Illinois." },
      { name: "SunPass (Florida)", detail: "Best value for Turnpike and Miami express lanes." },
      { name: "FasTrak (California)", detail: "Required for bridge and express-lane discounts." },
      { name: "Plate-pay tolling", detail: "Rental cars often add a daily admin fee — worth checking first." },
    ],
  },
  {
    region: "🇨🇦 Canada",
    items: [
      { name: "Highway 407 ETR", detail: "Ontario's all-electronic toll road. A transponder beats camera billing." },
      { name: "Cobequid Pass", detail: "Nova Scotia's only mainline toll — cash and card accepted." },
      { name: "Bridge tolls", detail: "Confederation Bridge is charged on the way off PEI only." },
    ],
  },
];

export function TollsGuide() {
  const tr = useTr();
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          {tr("Tolls & vignettes")}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {tr("Every barrier, badge and sticker — made simple.")}
        </h1>
        <p className="mt-4 max-w-2xl text-foreground/75">
          {tr("No guesswork, no fines. Here's what you need in each country, and how to get it before you set off.")}
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <div key={g.region} className="glass-panel rounded-2xl p-6">
              <h2 className="text-lg font-semibold tracking-tight">{tr(g.region)}</h2>
              <ul className="mt-4 grid gap-3">
                {g.items.map((i) => (
                  <li key={i.name} className="rounded-xl border border-border bg-background/40 p-4">
                    <p className="text-sm font-medium">{tr(i.name)}</p>
                    <p className="mt-1 text-sm text-foreground/70">{tr(i.detail)}</p>
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
