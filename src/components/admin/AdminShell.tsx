import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, RefreshCcw } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ADMIN_NAV, type AdminSectionId } from "@/components/admin/adminNav";
import { SITE_OPTIONS } from "@/components/admin/siteOptions";
import { OverviewPanel } from "@/components/admin/sections/OverviewPanel";
import { TrafficPanel } from "@/components/admin/sections/TrafficPanel";
import { MarketsPanel } from "@/components/admin/sections/MarketsPanel";
import { SubscriptionsPanel } from "@/components/admin/sections/SubscriptionsPanel";
import { FinancePanel } from "@/components/admin/sections/FinancePanel";
import { ReportsPanel } from "@/components/admin/reports/ReportsPanel";

const ALL_SITES = "__all__";

function Section({
  section,
  site,
  onNavigate,
}: {
  section: AdminSectionId;
  site: string | null;
  onNavigate: (s: AdminSectionId) => void;
}) {
  switch (section) {
    case "oversikt":
      return <OverviewPanel onNavigate={onNavigate} />;
    case "trafikk":
      return <TrafficPanel site={site} />;
    case "markeder":
      return <MarketsPanel site={site} />;
    case "abonnement":
      return <SubscriptionsPanel site={site} />;
    case "okonomi":
      return <FinancePanel site={site} />;
    case "rapporter":
      return <ReportsPanel site={site} />;
    default:
      return null;
  }
}

export function AdminShell() {
  const [section, setSection] = useState<AdminSectionId>("oversikt");
  const [siteValue, setSiteValue] = useState<string>(ALL_SITES);
  const [refreshKey, setRefreshKey] = useState(0);

  const site = siteValue === ALL_SITES ? null : siteValue;

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
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <Select value={siteValue} onValueChange={setSiteValue}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_SITES}>🌐 Alle AutoVere</SelectItem>
                {SITE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.flag} {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" asChild>
              <Link to="/garage">
                <ArrowLeft className="size-4" /> Min garasje
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
              <RefreshCcw className="size-4" /> Oppdater
            </Button>
          </div>
        </div>

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

          <div key={`${section}-${site}-${refreshKey}`} className="min-w-0">
            <Section section={section} site={site} onNavigate={setSection} />
          </div>
        </div>
      </section>
    </main>
  );
}
