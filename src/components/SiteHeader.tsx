import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Sparkles, Zap, Menu, X, Warehouse, LogIn, ChevronDown,
  Map, Route, Calculator, BookOpen, Car, Database, GitCompare,
  Brain, Star, Globe, Rss, Wifi,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { detectLangFromPath, localizePath } from "@/i18n/routing";
import { VehicleSearch } from "@/components/VehicleSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PreferencesDrawer } from "@/components/PreferencesDrawer";
import { useGarage } from "@/hooks/useGarage";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { useEVNav } from "@/contexts/EVNavContext";

const evPathCheck = (pathname: string, lang: string) => {
  const clean = lang !== "en" ? pathname.replace(`/${lang}`, "") || "/" : pathname;
  return clean === "/ev" || clean.startsWith("/ev/");
};

export const SiteHeader = () => {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalCount } = useGarage();
  const { isAuthenticated } = useSupabaseUser();
  const { open: evOpen, toggle: evToggle, setOpen: setEvOpen } = useEVNav();

  // Auto-open EV nav on EV routes; auto-close when leaving
  useEffect(() => {
    setEvOpen(evPathCheck(pathname, lang));
  }, [pathname, lang, setEvOpen]);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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

  const EV_CHIPS = [
    { to: "/ev", label: t("ev.nav.hub"), icon: Zap, exact: true },
    { to: "/ev/models", label: t("ev.nav.models"), icon: Car },
    { to: "/ev/database", label: t("ev.nav.database"), icon: Database },
    { to: "/ev/compare", label: t("ev.nav.compare"), icon: GitCompare },
    { to: "/ev/charging", label: t("ev.nav.charging"), icon: Map },
    { to: "/ev/networks", label: t("ev.nav.networks"), icon: Wifi },
    { to: "/ev/route-planner", label: t("ev.nav.planner"), icon: Route },
    { to: "/ev/calculator", label: t("ev.nav.calculator"), icon: Calculator },
    { to: "/ev/advisor", label: t("ev.nav.advisor"), icon: Brain },
    { to: "/ev/guides", label: t("ev.nav.guides"), icon: BookOpen },
    { to: "/ev/reviews", label: t("ev.nav.reviews"), icon: Star },
    { to: "/ev/markets", label: t("ev.nav.markets"), icon: Globe },
    { to: "/ev/news", label: t("ev.nav.news"), icon: Rss },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `hover:text-foreground transition-colors ${isActive ? "text-foreground" : ""}`;

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-white/5">

        {/* ── Row 1: Main navigation ─────────────────────────── */}
        <div className="container flex items-center justify-between h-[68px]">
          <Link to={L("/")} className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold tracking-tight uppercase">AUTOVERE</span>
          </Link>

          {/* Desktop nav — EV Hub lives in the strip below */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide text-muted-foreground">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={L(n.to)}
                className={({ isActive }) =>
                  `relative py-1 transition-colors duration-200 hover:text-foreground ${
                    isActive ? "text-foreground" : ""
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <VehicleSearch compact className="hidden md:inline-flex" />

            {/* Grouped action pill */}
            <div className="hidden sm:flex items-center gap-0.5 p-1 rounded-xl bg-white/[0.03] border border-white/5">
              <Link
                to={L("/garage")}
                className="relative w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                aria-label={t("ev.nav.garage")}
              >
                <Warehouse className="w-4 h-4" />
                {totalCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[9px] font-bold flex items-center justify-center ring-2 ring-background">
                    {totalCount > 9 ? "9+" : totalCount}
                  </span>
                )}
              </Link>
              <PreferencesDrawer />
              <ThemeToggle />
            </div>

            <LanguageSwitcher />

            {isAuthenticated ? (
              <Link
                to={L("/pricing")}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-accent/40 hover:bg-white/5 text-xs font-semibold tracking-wide transition-all"
              >
                {t("ev.nav.account")}
              </Link>
            ) : (
              <Button
                asChild
                size="sm"
                className="hidden sm:flex h-9 px-5 bg-gradient-primary hover:opacity-90 rounded-xl text-[13px] font-semibold shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                <Link to={L("/auth")}>
                  <LogIn className="w-3.5 h-3.5 mr-1.5" />
                  {t("nav.cta")}
                </Link>
              </Button>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center"
              aria-label={t("ev.nav.toggle_menu")}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── Row 2: EV Hub trigger — always visible ──────────── */}
        <div className="border-t border-white/5 bg-[hsl(var(--background))]/40">
          <div className="container py-2">
            <button
              onClick={evToggle}
              aria-expanded={evOpen}
              aria-controls="ev-nav-chips"
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-200 select-none ${
                evOpen
                  ? "text-cyan-400"
                  : "text-cyan-500/60 hover:text-cyan-400"
              }`}
            >
              <Zap className="w-3 h-3" />
              {t("ev.nav.hub")}
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-300 ease-in-out ${evOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* ── Row 3: EV chips — collapsible ───────────────────── */}
        <div
          id="ev-nav-chips"
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            evOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden min-h-0">
            <div className="container">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-2.5 pt-0.5 border-l-0">
                {EV_CHIPS.map(({ to, label, icon: Icon, exact }) => (
                  <NavLink
                    key={to}
                    to={L(to)}
                    end={exact}
                    className={({ isActive }) =>
                      `flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium tracking-wide transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 shadow-[0_0_18px_-4px_rgba(34,211,238,0.35)]"
                          : "text-muted-foreground border border-transparent hover:text-foreground hover:bg-white/[0.04]"
                      }`
                    }
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>

      </header>

      {/* ── Mobile menu overlay ─────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
          <nav className="absolute top-0 right-0 h-full w-72 glass border-l border-border/40 flex flex-col pt-24 pb-8 px-6 overflow-y-auto">
            <div className="space-y-1 flex-1">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={L(n.to)}
                  className={({ isActive }) =>
                    `flex items-center py-3 px-3 rounded-xl text-sm transition-colors ${
                      isActive
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}

              {/* EV section — 2-column compact grid */}
              <div className="pt-3 pb-1 px-3">
                <span className="text-[10px] uppercase tracking-[0.18em] text-cyan-500/60 font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3" />{t("ev.nav.hub")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {EV_CHIPS.map(({ to, label, icon: Icon, exact }) => (
                  <NavLink
                    key={to}
                    to={L(to)}
                    end={exact}
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-2 px-3 rounded-xl text-xs transition-colors ${
                        isActive
                          ? "bg-cyan-400/10 text-cyan-400"
                          : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                      }`
                    }
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{label}</span>
                  </NavLink>
                ))}
              </div>

              {/* Garage */}
              <Link
                to={L("/garage")}
                className="flex items-center gap-2 py-3 px-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-card/50 transition-colors"
              >
                <Warehouse className="w-4 h-4" />
                {t("ev.nav.garage")}
                {totalCount > 0 && (
                  <span className="ml-auto text-[10px] font-medium text-accent">{totalCount}</span>
                )}
              </Link>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/30">
              <div className="flex items-center gap-2">
                <ThemeToggle className="flex-1 justify-center rounded-xl" />
                <span className="text-xs text-muted-foreground flex-1 text-center">{t("ev.nav.theme")}</span>
              </div>
              {isAuthenticated ? (
                <Link
                  to={L("/pricing")}
                  className="w-full flex items-center justify-center py-2.5 rounded-xl glass border border-border/40 text-sm font-medium"
                >
                  {t("ev.nav.my_account")}
                </Link>
              ) : (
                <Button asChild className="w-full bg-gradient-primary hover:opacity-90 rounded-xl">
                  <Link to={L("/auth")}>{t("nav.cta")}</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
