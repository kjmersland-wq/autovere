import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EVSubNav } from "@/components/EVSubNav";
import { detectLangFromPath } from "@/i18n/routing";

const isEvPath = (pathname: string) => {
  const lang = detectLangFromPath(pathname);
  const stripped = lang !== "en" ? pathname.replace(`/${lang}`, "") || "/" : pathname;
  return stripped === "/ev" || stripped.startsWith("/ev/");
};

export const PageShell = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const evPage = isEvPath(pathname);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      <SiteHeader />
      {evPage && <EVSubNav />}
      <main className={`flex-1 ${evPage ? "pt-36" : "pt-24"}`}>{children}</main>
      <SiteFooter />
    </div>
  );
};
