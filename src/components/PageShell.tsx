import { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EVNavProvider, useEVNav } from "@/contexts/EVNavContext";

// EVSubNav is preserved at src/components/EVSubNav.tsx for easy rollback.
// The chip-strip functionality now lives inside SiteHeader (Row 3).

const PageShellInner = ({ children }: { children: ReactNode }) => {
  const { open } = useEVNav();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      <SiteHeader />
      {/*
        pt-24  (6rem  / 96px)  — header closed: ~98px
        pt-36  (9rem  / 144px) — header open:  ~136px
        transition-[padding-top] matches the 300ms chips animation
      */}
      <main className={`flex-1 transition-[padding-top] duration-300 ease-in-out ${open ? "pt-36" : "pt-24"}`}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
};

export const PageShell = ({ children }: { children: ReactNode }) => (
  <EVNavProvider>
    <PageShellInner>{children}</PageShellInner>
  </EVNavProvider>
);
