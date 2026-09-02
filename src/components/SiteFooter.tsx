import { Link, useRouterState } from "@tanstack/react-router";

import { useT, useLocale } from "@/lib/i18n";
import { prefixFromPath } from "@/lib/locales";
import { regionFromPath } from "@/lib/trip-data";

const YEAR = new Date().getFullYear();

export function SiteFooter() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const region = regionFromPath(pathname);
  const t = useT();
  const locale = useLocale();
  const langPrefix = prefixFromPath(pathname);
  const euHome = langPrefix ? `/${langPrefix}` : "/";
  const isFrench = pathname.startsWith("/ca/fr");

  const noPrefix = langPrefix ? `/${langPrefix}` : region === "us" ? "/us" : region === "ca" ? "/ca" : "";
  const base = region === "us" ? "/us" : "/ca";
  const infoBase = region === "ca" && isFrench ? "/ca/fr" : base;

  const regionalLinks =
    region === "eu"
      ? []
      : [
          { to: `${infoBase}/how-it-works`, label: isFrench ? "Comment ça marche" : t.footer.howItWorks },
          { to: `${infoBase}/faq`, label: t.footer.faq },
          { to: `${infoBase}/partners`, label: isFrench ? "Partenaires" : t.footer.partners },
          {
            to: `${infoBase}/legal`,
            label: isFrench ? "Mentions légales & vie privée" : t.footer.privacy,
          },
        ];

  const companyLinks = [
    {
      to: region === "eu" ? `${noPrefix}/how-it-works` : `${infoBase}/how-it-works`,
      label: isFrench ? "Comment ça marche" : t.footer.howItWorks,
    },
    { to: `${noPrefix}/pricing`, label: isFrench ? "Tarifs" : t.footer.pricing },
    { to: region === "eu" ? `${noPrefix}/faq` : `${infoBase}/faq`, label: t.footer.faq },
    {
      to: region === "eu" ? `${noPrefix}/partners` : `${infoBase}/partners`,
      label: isFrench ? "Partenaires" : t.footer.partners,
    },
    {
      to: region === "eu" ? `${noPrefix}/privacy` : `${infoBase}/legal`,
      label: isFrench ? "Politique de confidentialité" : t.footer.privacy,
    },
    {
      to: region === "eu" ? `${noPrefix}/terms` : `${infoBase}/legal`,
      label: isFrench ? "Conditions d'utilisation" : t.footer.terms,
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-[hsl(var(--background))]/95 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="text-lg font-semibold tracking-tight text-foreground">AutoVere</p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            {t.footer.tagline}
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {t.footer.productBy}
          </p>
          <p className="text-sm font-semibold text-foreground">KM TECH LABS</p>
          <p className="text-sm text-muted-foreground">{locale === "no" || locale === "sv" || locale === "da" ? "Kristiansand, Norge" : locale === "pl" ? "Kristiansand, Norwegia" : "Kristiansand, Norway"}</p>
          <p className="mt-5 inline-flex max-w-xs items-start gap-2 rounded-xl border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-xs leading-relaxed text-amber-200">
            <span aria-hidden="true">🛡️</span>
            <span>
              {t.footer.shield}
            </span>
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">{t.footer.quickLinks}</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to={`${noPrefix}/planner` as "/planner"} className="transition-colors hover:text-foreground">
                {t.header.nav["/planner"]}
              </Link>
            </li>
            <li>
              <Link to={`${noPrefix}/tolls` as "/tolls"} className="transition-colors hover:text-foreground">
                {region === "us" ? "Tolls & Express Lanes" : t.header.nav["/tolls"]}
              </Link>
            </li>
            <li>
              <Link to={`${noPrefix}/scenic` as "/scenic"} className="transition-colors hover:text-foreground">
                {region === "us" ? "Scenic Byways & Ferries" : t.header.nav["/scenic"]}
              </Link>
            </li>
            <li>
              <Link to={`${noPrefix}/garage` as "/garage"} className="transition-colors hover:text-foreground">
                {t.header.nav["/garage"]}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">{t.footer.company}</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {companyLinks.map((l) => (
              <li key={l.label}>
                <a href={l.to} className="transition-colors hover:text-foreground">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">
            {region === "us" ? "United States" : region === "ca" ? "Canada" : t.footer.regions}
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
                  <Link to={euHome} className="transition-colors hover:text-foreground">
                    🇪🇺 {t.header.regions.eu}
                  </Link>
                </li>
                <li>
                  <a href="/us" className="transition-colors hover:text-foreground">
                    🇺🇸 USA
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
          <p>© {YEAR} KM TECH LABS. {t.footer.rights}</p>
          <p className="font-medium text-amber-300/90">
            {t.footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
