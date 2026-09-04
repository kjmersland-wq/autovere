import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportDocument } from "@/components/admin/reports/ReportDocument";
import { REPORT_PERIODS, periodView, type ReportPeriod } from "@/components/admin/reports/reportPeriod";
import type { AdminOverview } from "@/lib/admin.functions";

export function ReportsPanel({ data }: { data: AdminOverview }) {
  const [period, setPeriod] = useState<ReportPeriod>("30");
  const [exporting, setExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const periodLabel = REPORT_PERIODS.find((p) => p.value === period)?.label ?? "";
  const generatedAtLabel = new Date(data.generatedAt).toLocaleString("nb-NO");
  const { dailyForPeriod, headlineViews } = periodView(data, period);

  const exportPdf = async () => {
    const container = containerRef.current;
    if (!container) return;
    setExporting(true);
    try {
      const { generateReportPdf } = await import("@/components/admin/reports/generateReportPdf");
      await generateReportPdf({ container, data, periodLabel, generatedAtLabel, headlineViews });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground/70">Rapportperiode</span>
          <Select value={period} onValueChange={(v) => setPeriod(v as ReportPeriod)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REPORT_PERIODS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => void exportPdf()} disabled={exporting}>
          {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          {exporting ? "Genererer PDF…" : "Eksporter PDF"}
        </Button>
      </div>

      <ReportDocument
        ref={containerRef}
        data={data}
        period={period}
        periodLabel={periodLabel}
        generatedAtLabel={generatedAtLabel}
        dailyForPeriod={dailyForPeriod}
        headlineViews={headlineViews}
      />
    </div>
  );
}
