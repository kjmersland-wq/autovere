import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, RefreshCcw } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { getAdminOverview, type AdminOverview } from "@/lib/admin.functions";
import { ADMIN_NAV, type AdminSectionId } from "@/components/admin/adminNav";
import { OverviewPanel } from "@/components/admin/sections/OverviewPanel";
import { TrafficPanel } from "@/components/admin/sections/TrafficPanel";
import { MarketsPanel } from "@/components/admin/sections/MarketsPanel";
import { SubscriptionsPanel } from "@/components/admin/sections/SubscriptionsPanel";
import { FinancePanel } from "@/components/admin/sections/FinancePanel";
import { ReportsPanel } from "@/components/admin/reports/ReportsPanel";

function Section({ data, section, onNavigate }: { data: AdminOverview; section: AdminSectionId; onNavigate: (s: AdminSectionId) => void }) {
  switch (section) {
    case "oversikt":
      return <OverviewPanel data={data} onNavigate={onNavigate} />;
    case "trafikk":
      return <TrafficPanel data={data} />;
    case "markeder":
      return <MarketsPanel data={data} />;
    case "abonnement":
      return <SubscriptionsPanel data={data} />;
    case "okonomi":
      return <FinancePanel data={data} />;
    case "rapporter":
      return <ReportsPanel data={data} />;
    default:
      return null;
  }
}

export function AdminShell() {
  const fetchOverview = useServerFn(getAdminOverview);
  const [section, setSection] = useState<AdminSectionId>("oversikt");
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const result = await fetchOverview();
        setData(result);
      } catch {
        setError("Kunne ikke hente data. Prøv å oppdatere siden.");
      } finally {
        setLoading(false);
      }
    })();
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen print:bg-white">
      <div className="print:hidden">
        <SiteHeader />
      </div>

      <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 print:max-w-none print:px-0 print:py-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Admin · kun for eier</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight print:text-neutral-900">
              AutoVere kontrollpanel
            </h1>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" asChild>
              <Link to="/garage">
                <ArrowLeft className="size-4" /> Min garasje
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={load}>
              <RefreshCcw className="size-4" /> Oppdater
            </Button>
          </div>
        </div>

        {loading && <p className="mt-10 text-sm text-muted-foreground">Henter tall …</p>}
        {error && <p className="mt-10 text-sm text-destructive">{error}</p>}

        {data && !data.isAdmin && !loading && (
          <div className="glass-panel mt-10 rounded-2xl p-6">
            <p className="text-sm text-foreground/80">
              Denne siden er forbeholdt eier av AutoVere. Kontoen din har ikke admin-tilgang.
            </p>
          </div>
        )}

        {data?.isAdmin && (
          <div className="mt-8 grid gap-6 md:grid-cols-[16rem_1fr]">
            <nav className="flex flex-col gap-1 print:hidden">
              {ADMIN_NAV.map((item) => {
                const Icon = item.icon;
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground/75 hover:bg-background/60"
                    }`}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="min-w-0">
              <Section data={data} section={section} onNavigate={setSection} />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
