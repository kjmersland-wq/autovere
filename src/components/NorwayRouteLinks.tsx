import { SEO_CORRIDORS } from "@/data/seo-corridors";

/** Routes people search for first — the rest of the Norwegian corridors follow in data order. */
const FIRST = ["oslo-hafjell", "bergen-voss", "oslo-alesund", "trondheim-alesund", "oslo-lillehammer"];

/**
 * Plain links to the Norwegian route pages, for the pages that already get
 * visits (Norwegian home, bompenger-guiden). Real anchor text, real hrefs.
 */
export function NorwayRouteLinks({ limit = 12 }: { limit?: number }) {
  const domestic = SEO_CORRIDORS.filter((c) => c.countriesTraversed.length === 1 && c.countriesTraversed[0] === "NO");
  const rank = (slug: string) => {
    const i = FIRST.indexOf(slug);
    return i === -1 ? FIRST.length : i;
  };
  const routes = [...domestic].sort((a, b) => rank(a.slug) - rank(b.slug)).slice(0, limit);
  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold tracking-tight">Bompenger på populære strekninger</h2>
      <p className="mt-2 max-w-2xl text-sm text-foreground/70">
        Avstand, kjøretid og ca. bompenger for bil og elbil på noen av de mest kjørte turene i Norge.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {routes.map((c) => (
          <a
            key={c.slug}
            href={`/no/routes/${c.slug}`}
            className="rounded-full border border-border bg-background/40 px-4 py-2 text-sm transition-colors hover:bg-background/70"
          >
            {c.origin.name} – {c.destination.name}
          </a>
        ))}
      </div>
    </section>
  );
}
