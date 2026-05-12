import { Link, useLocation } from "react-router-dom";
import { Sparkles, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { detectLangFromPath, localizePath } from "@/i18n/routing";

export const SiteFooter = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  const COLS = [
    {
      label: t("footer.columns.discover"),
      links: [
        { to: "/cars", label: t("footer.links.cars") },
        { to: "/collections", label: t("footer.links.collections") },
        { to: "/personalities", label: t("footer.links.personalities") },
        { to: "/watch", label: t("footer.links.watch") },
        { to: "/compare", label: t("footer.links.compare") },
      ],
    },
    {
      label: t("footer.columns.ev"),
      links: [
        { to: "/ev", label: t("ev.nav.hub") },
        { to: "/ev/models", label: t("ev.nav.models") },
        { to: "/ev/database", label: t("ev.nav.database") },
        { to: "/ev/compare", label: t("ev.nav.compare") },
        { to: "/ev/charging", label: t("ev.nav.charging") },
        { to: "/ev/news", label: t("ev.nav.news") },
      ],
    },
    {
      label: t("footer.columns.company"),
      links: [
        { to: "/about", label: t("footer.links.about") },
        { to: "/learn", label: t("footer.links.learn") },
        { to: "/pricing", label: t("footer.links.pricing") },
        { to: "/faq", label: t("footer.links.faq") },
        { to: "/help", label: t("footer.links.help") },
        { to: "/contact", label: t("footer.links.contact") },
      ],
    },
    {
      label: t("footer.columns.legal"),
      links: [
        { to: "/legal/terms", label: t("footer.links.terms") },
        { to: "/legal/privacy", label: t("footer.links.privacy") },
        { to: "/legal/cookies", label: t("footer.links.cookies") },
        { to: "/legal/refund", label: t("footer.links.refund") },
        { to: "/legal/subscriptions", label: t("footer.links.subscriptions") },
      ],
    },
  ];

  return (
    <footer className="relative mt-32 border-t border-border/30">
      <div className="absolute inset-x-0 -top-40 h-40 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      <div className="absolute left-1/2 -translate-x-1/2 -top-24 w-[520px] h-[520px] rounded-full bg-gradient-glow blur-3xl opacity-20 pointer-events-none" />

      <div className="container relative pt-20 pb-10">
        <div className="grid lg:grid-cols-[1.3fr_2fr] gap-16 mb-16">
          <div className="max-w-sm">
            <Link to={L("/")} className="flex items-center gap-2 font-semibold tracking-tight mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              AUTOVERE
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t("footer.tagline")}</p>
            <div className="inline-flex items-start gap-2.5 text-xs text-muted-foreground/80 leading-relaxed glass rounded-xl px-4 py-3 max-w-sm">
              <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/80" />
              <span>{t("footer.disclaimer")}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {COLS.map((c) => (
              <div key={c.label}>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground/70 mb-4">
                  {c.label}
                </div>
                <ul className="space-y-3">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={L(l.to)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 grid md:grid-cols-[1fr_auto] gap-6 text-xs text-muted-foreground">
          <div className="space-y-1.5 leading-relaxed">
            <div className="text-foreground/90 font-medium">Boutique24Shop v/ K.Mersland</div>
            <div>Org.nr. 934 044 029 · Møviklia 4, 4623 Kristiansand, Norge</div>
            <div className="opacity-80">© {new Date().getFullYear()} AUTOVERE. {t("footer.rights")}</div>
          </div>
          <div className="md:text-right opacity-80 self-end">{t("footer.operated")}</div>
        </div>
      </div>
    </footer>
  );
};
