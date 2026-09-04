import { Metric } from "@/components/admin/AdminUi";
import { cf, nf } from "@/components/admin/adminFormat";
import type { AdminOverview } from "@/lib/admin.functions";
import type { AdminSectionId } from "@/components/admin/adminNav";
import { ADMIN_NAV } from "@/components/admin/adminNav";

export function OverviewPanel({
  data,
  onNavigate,
}: {
  data: AdminOverview;
  onNavigate: (section: AdminSectionId) => void;
}) {
  const trend =
    data.traffic.prev7 > 0
      ? Math.round(((data.traffic.last7 - data.traffic.prev7) / data.traffic.prev7) * 1000) / 10
      : null;

  const shortcuts = ADMIN_NAV.filter((item) => item.id !== "oversikt");

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
          Admin · kun for eier
        </span>
        <h2 className="mt-3 text-xl font-semibold tracking-tight">AutoVere kontrollpanel</h2>
        <p className="text-sm text-muted-foreground">
          Trafikk, abonnementer, markeder og økonomi — oppdatert{" "}
          {new Date(data.generatedAt).toLocaleString("nb-NO")}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Besøk siste 7 dager"
          value={nf.format(data.traffic.last7)}
          hint={
            trend === null
              ? "Ingen sammenligningsgrunnlag ennå"
              : `${trend >= 0 ? "▲" : "▼"} ${Math.abs(trend)} % mot forrige uke`
          }
        />
        <Metric
          label="Besøk siste 30 dager"
          value={nf.format(data.traffic.last30)}
          hint={`${nf.format(data.traffic.total)} totalt siste 90 dager`}
        />
        <Metric
          label="Aktive abonnenter"
          value={nf.format(data.subscriptions.active)}
          hint={`${data.subscriptions.trialing} på prøve · ${data.subscriptions.pastDue} forfalt`}
        />
        <Metric
          label="Månedlig inntekt (MRR)"
          value={cf.format(data.finance.mrr)}
          hint={`ARR ${cf.format(data.finance.arr)} · ARPU ${cf.format(data.finance.arpu)}`}
        />
      </div>

      <div className="glass-panel rounded-2xl p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Snarveier</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {shortcuts.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-background/60"
            >
              <item.icon className="size-4" /> {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
