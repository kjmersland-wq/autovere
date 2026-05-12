import { NavLink, useLocation } from "react-router-dom";
import { Zap, Map, Route, Calculator, BookOpen, Car, Database, GitCompare, Brain, Star, Globe, Rss, Wifi } from "lucide-react";
import { useTranslation } from "react-i18next";
import { detectLangFromPath, localizePath } from "@/i18n/routing";

export function EVSubNav() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  const CHIPS = [
    { to: "/ev", label: t("ev.nav.hub"), icon: Zap, exact: true },
    { to: "/ev/models", label: t("ev.nav.models"), icon: Car },
    { to: "/ev/database", label: t("ev.nav.database"), icon: Database },
    { to: "/ev/compare", label: t("ev.nav.compare"), icon: GitCompare },
    { to: "/ev/charging", label: t("ev.nav.charging"), icon: Map },
    { to: "/ev/networks", label: "Networks", icon: Wifi },
    { to: "/ev/route-planner", label: t("ev.nav.planner"), icon: Route },
    { to: "/ev/calculator", label: t("ev.nav.calculator"), icon: Calculator },
    { to: "/ev/advisor", label: t("ev.nav.advisor"), icon: Brain },
    { to: "/ev/guides", label: t("ev.nav.guides"), icon: BookOpen },
    { to: "/ev/reviews", label: t("ev.nav.reviews"), icon: Star },
    { to: "/ev/markets", label: t("ev.nav.markets"), icon: Globe },
    { to: "/ev/news", label: t("ev.nav.news"), icon: Rss },
  ];

  return (
    <div className="fixed top-[4.5rem] inset-x-0 z-40 glass border-b border-border/20 bg-background/60 backdrop-blur-xl">
      <div className="container">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2 -mx-1 px-1">
          {CHIPS.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={L(to)}
              end={exact}
              className={({ isActive }) =>
                `flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                }`
              }
            >
              <Icon className="w-3 h-3" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
