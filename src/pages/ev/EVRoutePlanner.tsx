import { useTranslation } from "react-i18next";
import { Route as RouteIcon } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { RoutePlanner } from "@/components/RoutePlanner";

export default function EVRoutePlanner() {
  useTranslation();
  return (
    <PageShell>
      <SEO
        title="EV Route Planner — charging stops, costs & ICE comparison | AUTOVERE"
        description="Plan any European EV trip: real driving distance, charging stops, total cost incl. tolls, and a side-by-side comparison vs diesel/petrol."
      />
      <div className="container py-10 md:py-14">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] uppercase tracking-[0.25em] text-accent mb-4">
            <RouteIcon className="w-3 h-3" /> Ruteplanlegger
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Planlegg turen din i Europa
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Skriv inn start og destinasjon. Vi beregner kjøretid, ladestopp, ankomsttid, lade­kostnader,
            bompenger per land — og sammenligner mot samme tur med diesel/bensin.
          </p>
        </div>
        <RoutePlanner />
      </div>
    </PageShell>
  );
}
