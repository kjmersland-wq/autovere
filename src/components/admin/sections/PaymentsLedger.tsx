import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useServerFn } from "@tanstack/react-start";

import { Metric, Panel } from "@/components/admin/AdminUi";
import { nf } from "@/components/admin/adminFormat";
import { useAdminQuery, statusMessage } from "@/components/admin/useAdminQuery";
import { getPaymentLedger, type PaymentRow } from "@/lib/admin-data.functions";

const DAY_MS = 1000 * 60 * 60 * 24;

const STATUS_LABEL: Record<string, string> = {
  completed: "Fullført",
  paid: "Fullført",
  draft: "Utkast",
  ready: "Klar",
  canceled: "Kansellert",
  past_due: "Forfalt",
};

const currencyFmt = (currency: string) =>
  new Intl.NumberFormat("nb-NO", { style: "currency", currency, maximumFractionDigits: 2 });

const eurFmt = new Intl.NumberFormat("nb-NO", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });

function toEur(row: PaymentRow, rates: Record<string, number> | null): number | null {
  const rate = rates?.[row.currency];
  return typeof rate === "number" && rate > 0 ? row.amount / rate : null;
}

export function PaymentsLedger() {
  const fetchLedger = useServerFn(getPaymentLedger);
  const ledger = useAdminQuery(fetchLedger);
  const [envOverride, setEnvOverride] = useState<"live" | "sandbox" | null>(null);

  // All hooks run unconditionally; guards below only change what renders.
  const data = ledger.result?.status === "ok" ? ledger.result.data : null;
  const rows = data?.rows ?? [];
  const envAvailable = useMemo(() => {
    const set = new Set(rows.map((r) => r.environment));
    return (["live", "sandbox"] as const).filter((e) => set.has(e));
  }, [rows]);
  const env = envOverride && envAvailable.includes(envOverride) ? envOverride : envAvailable[0] ?? "sandbox";
  const envRows = useMemo(() => rows.filter((r) => r.environment === env), [rows, env]);
  const completed = useMemo(
    () => envRows.filter((r) => r.status === "completed" || r.status === "paid"),
    [envRows],
  );

  const totals = useMemo(() => {
    if (!data) return { allTime: 0, last30: 0, prev30: 0, unconvertible: 0, count: 0 };
    const now = Date.now();
    let allTime = 0;
    let last30 = 0;
    let prev30 = 0;
    let unconvertible = 0;
    for (const row of completed) {
      const eur = toEur(row, data.rates);
      if (eur === null) {
        unconvertible += 1;
        continue;
      }
      allTime += eur;
      const age = row.billedAt ? now - new Date(row.billedAt).getTime() : Infinity;
      if (age <= 30 * DAY_MS) last30 += eur;
      else if (age <= 60 * DAY_MS) prev30 += eur;
    }
    return {
      allTime: Math.round(allTime * 100) / 100,
      last30: Math.round(last30 * 100) / 100,
      prev30: Math.round(prev30 * 100) / 100,
      unconvertible,
      count: completed.length,
    };
  }, [completed, data]);

  const monthly = useMemo(() => {
    const buckets = new Map<string, number>();
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getFullYear(), now.getMonth() - i, 1));
      buckets.set(d.toISOString().slice(0, 7), 0);
    }
    if (data) {
      for (const row of completed) {
        const eur = toEur(row, data.rates);
        if (eur === null || !row.billedAt) continue;
        const key = row.billedAt.slice(0, 7);
        if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + eur);
      }
    }
    return [...buckets.entries()].map(([month, eur]) => ({ month, eur: Math.round(eur * 100) / 100 }));
  }, [completed, data]);

  const recent = useMemo(
    () =>
      [...envRows]
        .sort((a, b) => (b.billedAt ?? "").localeCompare(a.billedAt ?? ""))
        .slice(0, 30),
    [envRows],
  );

  if (ledger.loading || !ledger.result) return <p className="text-sm text-muted-foreground">Henter innbetalinger …</p>;
  if (!data) {
    return (
      <p className="text-sm text-destructive">
        {statusMessage(
          ledger.result.status === "ok" ? "error" : ledger.result.status,
          "message" in ledger.result ? ledger.result.message : undefined,
        )}
      </p>
    );
  }

  const avg = totals.count ? Math.round((totals.allTime / totals.count) * 100) / 100 : 0;
  const trend =
    totals.prev30 > 0 ? Math.round(((totals.last30 - totals.prev30) / totals.prev30) * 1000) / 10 : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Innbetalinger fra kundene</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Alle registrerte kjøp og abonnement, hentet fra databasen (skrevet inn av Creem-webhooken).
          </p>
        </div>
        <div className="flex gap-2">
          {envAvailable.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEnvOverride(e)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                env === e
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground/70 hover:bg-primary/10"
              }`}
            >
              {e === "live" ? "🟢 Live" : "🧪 Test"}
            </button>
          ))}
        </div>
      </div>

      {env === "sandbox" && (
        <p className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
          Testbetalinger — dette er ikke ekte penger, kun kjøp utført med testkort.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Innbetalt siste 30 dager"
          value={eurFmt.format(totals.last30)}
          hint={trend !== null ? `${trend > 0 ? "+" : ""}${trend} % mot forrige 30 dager` : "≈ EUR, omregnet til dagens kurs"}
        />
        <Metric label="Innbetalt totalt" value={eurFmt.format(totals.allTime)} hint="≈ EUR, alle fullførte betalinger" />
        <Metric label="Antall betalinger" value={nf.format(totals.count)} hint="Fullførte betalinger" />
        <Metric label="Snitt per betaling" value={eurFmt.format(avg)} hint="≈ EUR" />
      </div>

      {totals.unconvertible > 0 && (
        <p className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
          {totals.unconvertible} betalinger i valuta uten tilgjengelig kurs er ikke telt med i summene — de vises
          fortsatt i listen under.
        </p>
      )}

      <Panel title="Innbetalinger per måned (≈ EUR)">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [eurFmt.format(v), "Innbetalt"]} />
              <Bar dataKey="eur" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Siste innbetalinger">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Dato</th>
                <th className="py-2 pr-3 font-medium">Plan</th>
                <th className="py-2 pr-3 font-medium">Beløp</th>
                <th className="py-2 pr-3 font-medium">≈ EUR</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 font-medium">Kunde</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => {
                const eur = toEur(row, data.rates);
                return (
                  <tr key={`${row.environment}-${row.id}`} className="border-b border-border/50">
                    <td className="py-2.5 pr-3 whitespace-nowrap">
                      {row.billedAt ? new Date(row.billedAt).toLocaleDateString("nb-NO") : "—"}
                    </td>
                    <td className="py-2.5 pr-3">{row.planLabel}</td>
                    <td className="py-2.5 pr-3 font-semibold">{currencyFmt(row.currency).format(row.amount)}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">{eur !== null ? eurFmt.format(eur) : "—"}</td>
                    <td className="py-2.5 pr-3">{STATUS_LABEL[row.status] ?? row.status}</td>
                    <td className="py-2.5 max-w-52 truncate">{row.customerEmail ?? "—"}</td>
                  </tr>
                );
              })}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-muted-foreground">
                    Ingen innbetalinger registrert ennå.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <p className="text-xs text-muted-foreground print:text-neutral-600">
        EUR-summene er veiledende og omregnet med
        dagens kurs fra Den europeiske sentralbanken (via frankfurter.dev{data.ratesAsOf ? `, ${data.ratesAsOf}` : ""}).
        Creem er Merchant of Record og håndterer mva, utbetalinger og kvitteringer.
      </p>
    </div>
  );
}
