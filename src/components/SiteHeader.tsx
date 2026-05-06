import { Link, NavLink, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

import { detectLangFromPath, localizePath } from "@/i18n/routing";

export const SiteHeader = () => {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const { t } = useTranslation();

  const NAV = [
    { to: "/discover", label: t("nav.discover") },
    { to: "/cars", label: t("nav.cars") },
    { to: "/collections", label: t("nav.collections") },
    { to: "/personalities", label: t("nav.personalities") },
    { to: "/watch", label: t("nav.watch") },
    { to: "/compare", label: t("nav.compare") },
    { to: "/learn", label: t("nav.learn") },
    { to: "/pricing", label: t("nav.pricing") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass border-b border-border/30">
      <div className="container flex items-center justify-between py-4">
        <Link to={L("/")} className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          AUTOVERE
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={L(n.to)}
              className={({ isActive }) =>
                `hover:text-foreground transition-colors ${isActive ? "text-foreground" : ""}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button asChild size="sm" className="bg-gradient-primary hover:opacity-90 rounded-xl">
            <Link to={`${L("/")}#advisor`}>{t("nav.cta")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
