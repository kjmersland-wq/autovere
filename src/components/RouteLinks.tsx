import { SEO_CORRIDORS } from "@/data/seo-corridors";
import { LOCALE_ROUTES } from "@/lib/locales";
import { useLocale } from "@/lib/i18n";

const COPY: Record<string, { title: string; body: string }> = {
  se: { title: "Vägtullar på populära sträckor", body: "Avstånd, restid och ca vägtullar för bil och elbil på några av de mest körda rutterna." },
  da: { title: "Vejafgifter på populære strækninger", body: "Afstand, køretid og ca. vejafgifter for bil og elbil på nogle af de mest kørte ruter." },
  de: { title: "Maut auf beliebten Strecken", body: "Entfernung, Fahrzeit und ungefähre Maut für Auto und E-Auto auf einigen der meistgefahrenen Routen." },
  nl: { title: "Tol op populaire routes", body: "Afstand, reistijd en ca. tol voor auto en elektrische auto op enkele van de meest gereden routes." },
  pl: { title: "Opłaty drogowe na popularnych trasach", body: "Dystans, czas jazdy i orientacyjne opłaty dla auta i elektryka na kilku z najczęściej wybieranych tras." },
  fr: { title: "Péages sur les trajets populaires", body: "Distance, durée et péages approximatifs en voiture et en électrique sur quelques-uns des trajets les plus fréquents." },
};

/** Which corridors to show first, per reader's language: the trips that market actually drives. */
const FIRST: Record<string, string[]> = {
  se: ["oslo-stockholm-malmo-copenhagen", "oslo-hamburg", "hamburg-flensburg-bergen", "oslo-hafjell", "oslo-trysil", "oslo-hemsedal"],
  da: ["oslo-stockholm-malmo-copenhagen", "hamburg-flensburg-bergen", "oslo-hamburg", "oslo-hafjell", "oslo-trysil", "oslo-hemsedal"],
  de: ["munich-brenner-lake-garda", "frankfurt-gotthard-milano", "berlin-prague-vienna", "zurich-san-bernardino-florence", "hamburg-flensburg-bergen", "oslo-hamburg"],
  nl: ["amsterdam-brussels-paris-bordeaux", "paris-lyon-barcelona", "munich-brenner-lake-garda", "frankfurt-gotthard-milano", "dover-calais-paris-nice", "berlin-prague-vienna"],
  pl: ["berlin-prague-vienna", "vienna-maribor-zagreb-split", "munich-brenner-lake-garda", "frankfurt-gotthard-milano", "zurich-san-bernardino-florence", "paris-lyon-barcelona"],
  fr: ["paris-lyon-barcelona", "dover-calais-paris-nice", "amsterdam-brussels-paris-bordeaux", "zurich-san-bernardino-florence", "munich-brenner-lake-garda", "frankfurt-gotthard-milano"],
};

/**
 * Plain links from the tolls guide to the route pages people in this
 * language search for. Renders nothing for languages without copy (the
 * Norwegian tree has its own, NorwayRouteLinks).
 */
export function RouteLinks() {
  const locale = useLocale();
  const entry = LOCALE_ROUTES.find((l) => l.code === locale);
  const copy = entry ? COPY[entry.prefix] : undefined;
  if (!entry || !copy) return null;
  const wanted = FIRST[entry.prefix] ?? [];
  const routes = wanted
    .map((slug) => SEO_CORRIDORS.find((c) => c.slug === slug))
    .filter((c): c is (typeof SEO_CORRIDORS)[number] => Boolean(c));
  if (!routes.length) return null;
  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold tracking-tight">{copy.title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-foreground/70">{copy.body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {routes.map((c) => (
          <a
            key={c.slug}
            href={`/${entry.prefix}/routes/${c.slug}`}
            className="rounded-full border border-border bg-background/40 px-4 py-2 text-sm transition-colors hover:bg-background/70"
          >
            {c.origin.name} – {c.destination.name}
          </a>
        ))}
      </div>
    </section>
  );
}
