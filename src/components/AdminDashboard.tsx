import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowLeft, Printer, RefreshCcw, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminOverview, type AdminOverview } from "@/lib/admin.functions";

const COUNTRY_NO: Record<string, string> = {
  NO: "🇳🇴 Norge",
  SE: "🇸🇪 Sverige",
  DK: "🇩🇰 Danmark",
  FI: "🇫🇮 Finland",
  DE: "🇩🇪 Tyskland",
  NL: "🇳🇱 Nederland",
  BE: "🇧🇪 Belgia",
  FR: "🇫🇷 Frankrike",
  IT: "🇮🇹 Italia",
  ES: "🇪🇸 Spania",
  PT: "🇵🇹 Portugal",
  AT: "🇦🇹 Østerrike",
  CH: "🇨🇭 Sveits",
  PL: "🇵🇱 Polen",
  CZ: "🇨🇿 Tsjekkia",
  GB: "🇬🇧 Storbritannia",
  IE: "🇮🇪 Irland",
  US: "🇺🇸 USA",
  CA: "🇨🇦 Canada",
  Ukjent: "🌍 Ukjent",
};

const REGION_NO: Record<string, string> = {
  eu: "🇪🇺 Europa",
  us: "🇺🇸 USA",
  ca: "🇨🇦 Canada",
};

const PIE_COLORS = ["#f59e0b", "#38bdf8", "#a78bfa", "#34d399", "#fb7185", "#facc15"];

const nf = new Intl.NumberFormat("nb-NO");
const cf = new Intl.NumberFormat("nb-NO", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="glass-panel rounded-2xl p-5 print:border print:border-neutral-300 print:bg-white">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground print:text-neutral-600">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight print:text-neutral-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-foreground/60 print:text-neutral-600">{hint}</p>}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass-panel rounded-2xl p-5 print:break-inside-avoid print:border print:border-neutral-300 print:bg-white">
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary print:text-neutral-900">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const OWNER_EMAIL = "kjmersland@gmail.com";

function OwnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (signInError) setError("Feil e-post eller passord.");
    else if (email.trim().toLowerCase() !== OWNER_EMAIL) setError("Kun eierkontoen har tilgang.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <form onSubmit={submit} className="glass-panel w-full max-w-sm space-y-4 rounded-2xl p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Admin-innlogging</h1>
        <p className="text-sm text-foreground/60">Kun for eierkontoen.</p>
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm"
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="Passord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Logger inn…" : "Logg inn"}
        </Button>
      </form>
    </main>
  );
}

export function AdminDashboard() {
  const fetchOverview = useServerFn(getAdminOverview);
  const { user, loading: authLoading } = useAuth();
  const isOwner = (user?.email ?? "").toLowerCase() === OWNER_EMAIL;
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        // Ensure the bearer token exists before the RPC, otherwise the
        // authenticated server fn rejects the request with a 401.
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session?.access_token) {
          setLoading(false);
          return;
        }
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
    if (!isOwner) {
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner]);

  if (authLoading) {
    return <main className="flex min-h-screen items-center justify-center text-foreground/60">Laster…</main>;
  }
  if (!isOwner) return <OwnerLogin />;


  const trend =
    data && data.traffic.prev7 > 0
      ? Math.round(((data.traffic.last7 - data.traffic.prev7) / data.traffic.prev7) * 1000) / 10
      : null;

  return (
    <main className="min-h-screen print:bg-white">
      <div className="print:hidden">
        <SiteHeader />
      </div>

      <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 print:max-w-none print:px-0 print:py-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Admin · kun for eier
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight print:text-neutral-900">
              AutoVere kontrollpanel
            </h1>
            <p className="mt-2 text-foreground/70 print:text-neutral-700">
              Trafikk, abonnementer, markeder og økonomi — oppdatert{" "}
              {data ? new Date(data.generatedAt).toLocaleString("nb-NO") : "…"}.
            </p>
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
            <Button size="sm" onClick={() => window.print()}>
              <Printer className="size-4" /> Skriv ut / PDF
            </Button>
          </div>
        </div>

        {loading && <p className="mt-10 text-sm text-muted-foreground">Henter tall …</p>}
        {error && <p className="mt-10 text-sm text-destructive">{error}</p>}

        {data && !data.isAdmin && !loading && (
          <div className="glass-panel mt-10 rounded-2xl p-6">
            <ShieldCheck className="size-5 text-primary" />
            <p className="mt-3 text-sm text-foreground/80">
              Denne siden er forbeholdt eier av AutoVere. Kontoen din har ikke admin-tilgang.
            </p>
          </div>
        )}

        {data?.isAdmin && (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

            <Tabs defaultValue="trafikk" className="mt-10">
              <TabsList className="bg-background/50 print:hidden">
                <TabsTrigger value="trafikk">📈 Trafikk</TabsTrigger>
                <TabsTrigger value="marked">🌍 Markeder</TabsTrigger>
                <TabsTrigger value="abonnement">💳 Abonnement</TabsTrigger>
                <TabsTrigger value="okonomi">💰 Økonomi</TabsTrigger>
              </TabsList>

              <TabsContent value="trafikk" className="mt-6 print:!block">
                <Panel title="Besøk per dag (30 dager)">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.traffic.daily}>
                        <defs>
                          <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d: string) => d.slice(5)} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ background: "#0b1220", border: "1px solid #1f2937", borderRadius: 12 }}
                          labelFormatter={(d) => `Dato ${d}`}
                          formatter={(v: number) => [nf.format(v), "Besøk"]}
                        />
                        <Area type="monotone" dataKey="views" stroke="#f59e0b" fill="url(#views)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <Panel title="Mest besøkte sider">
                    <ul className="space-y-2 text-sm">
                      {data.traffic.paths.map((p) => (
                        <li key={p.path} className="flex justify-between gap-4">
                          <span className="truncate text-foreground/80 print:text-neutral-800">{p.path}</span>
                          <span className="font-semibold">{nf.format(p.views)}</span>
                        </li>
                      ))}
                      {data.traffic.paths.length === 0 && (
                        <li className="text-muted-foreground">Ingen registrerte besøk ennå.</li>
                      )}
                    </ul>
                  </Panel>
                  <Panel title="Region">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.traffic.regions.map((r) => ({
                              name: REGION_NO[r.region] ?? r.region,
                              value: r.views,
                            }))}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={55}
                            outerRadius={90}
                            paddingAngle={3}
                          >
                            {data.traffic.regions.map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip formatter={(v: number) => nf.format(v)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Panel>
                </div>
              </TabsContent>

              <TabsContent value="marked" className="mt-6 print:!block">
                <Panel title="Besøk per land">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.traffic.countries.map((c) => ({
                          name: COUNTRY_NO[c.country] ?? c.country,
                          views: c.views,
                        }))}
                        layout="vertical"
                        margin={{ left: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                        <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: number) => [nf.format(v), "Besøk"]} />
                        <Bar dataKey="views" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {data.traffic.countries.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Land registreres automatisk så snart siden er live på eget domene.
                    </p>
                  )}
                </Panel>
              </TabsContent>

              <TabsContent value="abonnement" className="mt-6 print:!block">
                <div className="grid gap-4 lg:grid-cols-2">
                  <Panel title="Abonnement per plan">
                    <ul className="space-y-3 text-sm">
                      {data.subscriptions.byPlan.map((p) => (
                        <li key={p.plan} className="flex items-center justify-between gap-4">
                          <span className="text-foreground/85 print:text-neutral-800">{p.label}</span>
                          <span className="font-semibold">
                            {nf.format(p.count)} · {cf.format(p.mrr)}/mnd
                          </span>
                        </li>
                      ))}
                      {data.subscriptions.byPlan.length === 0 && (
                        <li className="text-muted-foreground">Ingen aktive abonnement ennå.</li>
                      )}
                    </ul>
                    <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Totalt registrert</dt>
                        <dd className="font-semibold">{nf.format(data.subscriptions.total)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Kansellert</dt>
                        <dd className="font-semibold">{nf.format(data.subscriptions.canceled)}</dd>
                      </div>
                    </dl>
                  </Panel>
                  <Panel title="Nye abonnement per måned">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.subscriptions.monthly}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                          <Tooltip formatter={(v: number) => [nf.format(v), "Nye"]} />
                          <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Panel>
                </div>
              </TabsContent>

              <TabsContent value="okonomi" className="mt-6 print:!block">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric label="MRR" value={cf.format(data.finance.mrr)} hint="Løpende månedlig inntekt" />
                  <Metric label="ARR" value={cf.format(data.finance.arr)} hint="Årlig inntektsrate" />
                  <Metric label="ARPU" value={cf.format(data.finance.arpu)} hint="Inntekt per aktiv kunde" />
                  <Metric
                    label="Churn"
                    value={`${data.finance.churnRate} %`}
                    hint="Andel kansellerte av totalt"
                  />
                </div>
                <div className="mt-4">
                  <Panel title="Inntektsfordeling per plan">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.subscriptions.byPlan}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip formatter={(v: number) => [cf.format(v), "MRR"]} />
                          <Bar dataKey="mrr" fill="#34d399" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Panel>
                </div>
                <p className="mt-4 text-xs text-muted-foreground print:text-neutral-600">
                  Beløp er beregnet fra aktive abonnement i EUR eks. Stripe-gebyr. Utbetalinger og avgifter
                  håndteres av Stripe.
                </p>
              </TabsContent>
            </Tabs>
          </>
        )}
      </section>
    </main>
  );
}
