import { ShieldCheck, ExternalLink } from "lucide-react";
import { COUNTRY_NAMES, FLAGS } from "@/lib/countries";
import { DISTANCE_TOLLS, LEZ_STICKERS, NORWAY_AUTOPASS, VIGNETTES, vignetteFor } from "@/lib/tolls";
import { type Estimate } from "@/lib/calc";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";
import { countryName, dynamicText, useLocale, useT } from "@/lib/i18n";

export function VignetteChecklist({
  est,
  days,
  currency,
  startCountry,
  endCountry,
}: {
  est: Estimate;
  days: number;
  currency: CurrencyCode;
  startCountry?: string;
  endCountry?: string;
}) {
  const t = useT();
  const { locale } = useLocale();
  const hasNorway = est.legs.some((leg) => leg.code === "NO");
  const lezCountries = [...new Set([startCountry, endCountry].filter((code): code is string => !!code && !!LEZ_STICKERS[code]))];
  const items = est.legs
    .map((leg) => {
      const v = VIGNETTES[leg.code];
      const d = DISTANCE_TOLLS[leg.code];
      if (v) {
        const tier = vignetteFor(leg.code, days);
        return {
          code: leg.code,
          kind: t.vignetteStatus,
          title: tier?.label ?? t.vignettes,
          price: tier?.price ?? 0,
          authority: v.authority,
          url: v.url,
          note: v.note,
        };
      }
      if (d)
        return {
          code: leg.code,
          kind: t.tollStatus,
          title: t.tollBooths,
          price: d.perKm * leg.km * 0.85,
          authority: d.authority,
          url: d.url,
          note: undefined,
        };
      return null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
        <div>
          <h2 className="text-lg font-bold text-foreground">{t.checklist}</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{t.checklistSub}</p>
        </div>
      </div>

      {hasNorway && (
        <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm font-bold text-foreground">{t.norwayAutopassTitle}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.norwayAutopassDescription}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
            <a href={NORWAY_AUTOPASS.visitorUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{t.visitEpass24}</a>
            <a href={NORWAY_AUTOPASS.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{t.visitAutopass}</a>
          </div>
        </div>
      )}

      {lezCountries.length > 0 && (
        <div className="mt-4 rounded-lg border border-signal/30 bg-signal/10 px-3 py-2 text-xs text-signal">
          {t.lezWarning(lezCountries.map((code) => LEZ_STICKERS[code]!.label).join(" and "))}
        </div>
      )}

      {items.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">{t.noVignettes}</p>
      ) : (
        <ul className="mt-5 space-y-2.5">
          {items.map((i) => (
            <li key={i.code + i.kind}>
              <a
                href={i.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-border bg-surface-raised p-4 transition-all hover:border-primary/50 hover:panel-glow"
              >
                <span className="text-2xl" aria-hidden>
                  {FLAGS[i.code]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                    {countryName(i.code, locale, COUNTRY_NAMES[i.code] ?? i.code)}
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-accent-foreground">
                      {i.kind}
                    </span>
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {dynamicText(i.title, locale)} · {dynamicText(i.authority, locale)}
                  </p>
                  {i.note && <p className="mt-1 text-xs text-signal">{i.note}</p>}
                </div>
                <span className="numeric shrink-0 text-sm font-bold text-foreground">
                  ≈ {formatCurrency(i.price, currency)}
                </span>
                <ExternalLink className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
