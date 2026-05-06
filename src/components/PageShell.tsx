import { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const PageShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
    <SiteHeader />
    <main className="flex-1 pt-24">{children}</main>
    <SiteFooter />
  </div>
);
