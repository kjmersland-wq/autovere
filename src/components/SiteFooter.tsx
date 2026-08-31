import { Link, useRouterState } from "@tanstack/react-router";

import { regionFromPath } from "@/lib/trip-data";

const YEAR = new Date().getFullYear();

export function SiteFooter() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const region = regionFromPath(pathname);
  const isFrench = pathname.startsWith("/ca/fr");

  const base = region === "us" ? "/us" : "/ca";
  const infoBase = region === "ca" && isFrench ? "/ca/fr" : base;

  const regionalLinks =
    region === "eu"
      ? []
      : [
          { to: `${infoBase}/how-it-works`, label: isFrench ? "Comment ça marche" : "How it works" },
          { to: `${infoBase}/faq`, label: "FAQ" },
          { to: `${infoBase}/partners`, label: isFrench ? "Partenaires" : "Partners" },
          {
            to: `${infoBase}/legal`,
            label: isFrench ? "Mentions légales & vie privée" : "Legal & privacy",
          },
        ];

  return (
    <footer className="border-t border-white/10 bg-[hsl(var(--background))]/95 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold tracking-tight text-foreground">AutoVere</p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Cross-border road trip intelligence — tolls, vignettes, fuel, charging and ferries for
            cars, motorhomes and touring motorcycles.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            A product by
          </p>
          <p className="text-sm font-semibold text-foreground">KM TECH LABS</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">Quick links</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/planner" className="transition-colors hover:text-foreground">
                Road Trip Planner
              </Link>
            </li>
            <li>
              <Link to="/tolls" className="transition-colors hover:text-foreground">
                Tolls &amp; Vignettes
              </Link>
            </li>
            <li>
              <Link to="/scenic" className="transition-colors hover:text-foreground">
                Scenic Passes &amp; Ferries
              </Link>
            </li>
            <li>
              <Link to="/garage" className="transition-colors hover:text-foreground">
                My Garage
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">
            {region === "us" ? "United States" : region === "ca" ? "Canada" : "Regions"}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {regionalLinks.length > 0 ? (
              regionalLinks.map((l) => (
                <li key={l.to}>
                  <a href={l.to} className="transition-colors hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))
            ) : (
              <>
                <li>
                  <Link to="/" className="transition-colors hover:text-foreground">
                    🇪🇺 Europe
                  </Link>
                </li>
                <li>
                  <a href="/us" className="transition-colors hover:text-foreground">
                    🇺🇸 United States
                  </a>
                </li>
                <li>
                  <a href="/ca" className="transition-colors hover:text-foreground">
                    🇨🇦 Canada
                  </a>
                </li>
              </>
            )}
          </ul>
          {region === "ca" ? (
            <a
              href={isFrench ? "/ca/faq" : "/ca/fr/faq"}
              className="mt-4 inline-block text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              {isFrench ? "🇬🇧 English" : "🇫🇷 Français (Québec)"}
            </a>
          ) : null}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {YEAR} KM TECH LABS. All rights reserved.</p>
          <p className="font-medium text-amber-300/90">
            Indicative estimates only — verify with official portals.
          </p>
        </div>
      </div>
    </footer>
  );
}
