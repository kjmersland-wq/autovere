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
      {/* Skip-to-content — visible only on keyboard focus (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent focus:text-accent-foreground focus:font-medium focus:text-sm focus:shadow-lg"
      >
        Skip to main content
      </a>
      <SiteHeader />
      {/*
        pt-24  (6rem  / 96px)  — header closed: ~98px
        pt-36  (9rem  / 144px) — header open:  ~136px
        transition-[padding-top] matches the 300ms chips animation
      */}
      <main
        id="main-content"
        tabIndex={-1}
        className={`flex-1 transition-[padding-top] duration-300 ease-in-out ${open ? "pt-36" : "pt-24"}`}
      >
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
