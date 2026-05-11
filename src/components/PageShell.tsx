import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { stripLocalizedPath } from "@/i18n/routing";
import { EVSubNav } from "@/components/EVSubNav";

export const PageShell = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const normalizedPath = stripLocalizedPath(pathname);
  const showEvSubNav = normalizedPath === "/ev" || normalizedPath.startsWith("/ev/");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      <SiteHeader />
      {showEvSubNav && <EVSubNav />}
      <main className="flex-1 pt-24">{children}</main>
      <SiteFooter />
    </div>
  );
};
