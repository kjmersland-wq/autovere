import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Sparkles, Zap, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { detectLangFromPath, localizePath } from "@/i18n/routing";

export const SiteHeader = () => {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when menu is open
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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `hover:text-foreground transition-colors ${isActive ? "text-foreground" : ""}`;

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-border/30">
        <div className="container flex items-center justify-between py-4">
          {/* Logo */}
          <Link to={L("/")} className="flex items-center gap-2 font-semibold tracking-tight flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            AUTOVERE
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm text-muted-foreground">
            {NAV.map((n) => (
              <NavLink key={n.to} to={L(n.to)} className={navLinkClass}>
                {n.label}
              </NavLink>
            ))}
            {/* EV Hub — distinct accent */}
            <NavLink
              to={L("/ev")}
              className={({ isActive }) =>
                `flex items-center gap-1 font-medium transition-colors ${isActive ? "text-cyan-400" : "text-cyan-500/80 hover:text-cyan-400"}`
              }
            >
              <Zap className="w-3.5 h-3.5" /> EV Hub
            </NavLink>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button asChild size="sm" className="hidden sm:flex bg-gradient-primary hover:opacity-90 rounded-xl">
              <Link to={`${L("/")}#advisor`}>{t("nav.cta")}</Link>
            </Button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-lg glass border border-border/40 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
          {/* Drawer */}
          <nav className="absolute top-0 right-0 h-full w-72 glass border-l border-border/40 flex flex-col pt-24 pb-8 px-6 overflow-y-auto">
            <div className="space-y-1 flex-1">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={L(n.to)}
                  className={({ isActive }) =>
                    `flex items-center py-3 px-3 rounded-xl text-sm transition-colors ${isActive ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-card/50"}`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              {/* EV Hub in mobile */}
              <NavLink
                to={L("/ev")}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-3 px-3 rounded-xl text-sm font-medium transition-colors ${isActive ? "bg-cyan-400/10 text-cyan-400" : "text-cyan-500/80 hover:text-cyan-400 hover:bg-cyan-400/5"}`
                }
              >
                <Zap className="w-4 h-4" /> EV Hub
              </NavLink>
            </div>
            {/* CTA in mobile */}
            <Button asChild className="mt-6 bg-gradient-primary hover:opacity-90 rounded-xl w-full">
              <Link to={`${L("/")}#advisor`}>{t("nav.cta")}</Link>
            </Button>
          </nav>
        </div>
      )}
    </>
  );
};
