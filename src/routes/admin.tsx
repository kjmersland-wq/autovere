import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useState, type FormEvent } from "react";
import { Check, Pencil, Plus, Power, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "AutoVere Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminPage,
});

type PartnerType = "member_organisation" | "car_dealer" | "motorhome_dealer";

const PARTNER_TYPE_LABELS: Record<PartnerType, string> = {
  member_organisation: "Medlemsorganisasjon",
  car_dealer: "Bilforhandler",
  motorhome_dealer: "Bobilforhandler",
};

type AdminPartner = {
  id: string;
  name: string;
  country: string | null;
  logo: string | null;
  website: string;
  discountPercent: number;
  discountCode: string;
  active: boolean;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  type: PartnerType;
  referralCount: number;
};

type PartnerForm = {
  partnerId: string;
  name: string;
  country: string;
  logo: string;
  website: string;
  discountPercent: number;
  discountCode: string;
  active: boolean;
  startDate: string;
  endDate: string;
  notes: string;
  type: PartnerType;
};

type ApplicationStatus = "pending" | "approved" | "rejected";

type AdminApplication = {
  id: string;
  type: PartnerType;
  organisationName: string;
  country: string | null;
  website: string;
  contactName: string;
  contactEmail: string;
  logo: string | null;
  message: string | null;
  locale: string;
  status: ApplicationStatus;
  partnerId: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

type ApprovalForm = {
  discountPercent: number;
  startDate: string;
  endDate: string;
  partnerId: string;
  discountCode: string;
  notes: string;
};

const emptyApprovalForm: ApprovalForm = { discountPercent: 25, startDate: "", endDate: "", partnerId: "", discountCode: "", notes: "" };

const STATUS_LABELS: Record<ApplicationStatus, string> = { pending: "Venter", approved: "Godkjent", rejected: "Avslått" };

type Metrics = {
  users: { total: number; newLast30Days: number; weeklySignups: { week: string; count: number }[] };
  subscriptions: { free: number; pro: number; business: number; activeTotal: number };
  revenue: { mrrEur: number; recentPaidInvoicesEur: number; recentPaidInvoicesWindowDays: number };
  partners: { id: string; name: string; country: string | null; active: boolean; memberCount: number; referralCount: number }[];
  discountUsage: { totalMembers: number; totalReferrals: number };
};

const emptyForm: PartnerForm = {
  partnerId: "",
  name: "",
  country: "",
  logo: "",
  website: "",
  discountPercent: 25,
  discountCode: "",
  active: true,
  startDate: "",
  endDate: "",
  notes: "",
  type: "member_organisation",
};

const inputClass = "mt-1 w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60";
const labelClass = "text-xs uppercase tracking-wide text-muted-foreground";

function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [secret, setSecret] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [tab, setTab] = useState<"metrics" | "partners" | "applications">("metrics");
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<PartnerForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [approvalForm, setApprovalForm] = useState<ApprovalForm>(emptyApprovalForm);
  const [approvalError, setApprovalError] = useState("");
  const [approving, setApproving] = useState(false);
  const pendingCount = applications.filter((application) => application.status === "pending").length;

  async function loadPartners() {
    const response = await fetch("/api/partners?admin=1");
    if (response.status === 401) {
      setAuthed(false);
      return;
    }
    if (response.ok) {
      const data = (await response.json()) as { partners?: AdminPartner[] };
      setPartners(data.partners ?? []);
      setAuthed(true);
    }
  }

  async function loadMetrics() {
    const response = await fetch("/api/partners?admin=1&view=metrics");
    if (response.status === 401) {
      setAuthed(false);
      return;
    }
    if (response.ok) {
      setMetrics((await response.json()) as Metrics);
      setAuthed(true);
    }
  }

  async function loadApplications() {
    const response = await fetch("/api/partners?admin=1&view=applications");
    if (response.status === 401) {
      setAuthed(false);
      return;
    }
    if (response.ok) {
      const data = (await response.json()) as { applications?: AdminApplication[] };
      setApplications(data.applications ?? []);
      setAuthed(true);
    }
  }

  useEffect(() => {
    void loadMetrics();
    void loadPartners();
    void loadApplications();
  }, []);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    const response = await fetch("/api/partners?action=admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    setLoggingIn(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setLoginError(data.error ?? "Feil admin-nøkkel.");
      return;
    }
    setSecret("");
    void loadMetrics();
    void loadPartners();
    void loadApplications();
  }

  async function handleLogout() {
    await fetch("/api/partners?action=admin-logout", { method: "POST" });
    setAuthed(false);
    setPartners([]);
    setMetrics(null);
    setApplications([]);
  }

  function openNew() {
    setForm(emptyForm);
    setFormError("");
    setEditing("new");
  }

  function openEdit(partner: AdminPartner) {
    setForm({
      partnerId: partner.id,
      name: partner.name,
      country: partner.country ?? "",
      logo: partner.logo ?? "",
      website: partner.website,
      discountPercent: partner.discountPercent,
      discountCode: partner.discountCode,
      active: partner.active,
      startDate: partner.startDate ?? "",
      endDate: partner.endDate ?? "",
      notes: partner.notes ?? "",
      type: partner.type,
    });
    setFormError("");
    setEditing(partner.id);
  }

  function handleLogoFile(file: File) {
    if (file.size > 250_000) {
      setFormError("Logofilen er for stor (maks 250 KB). SVG anbefales.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, logo: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    const isNew = editing === "new";
    const url = isNew ? "/api/partners" : `/api/partners?id=${encodeURIComponent(form.partnerId)}`;
    const response = await fetch(url, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partnerId: form.partnerId,
        name: form.name,
        country: form.country || null,
        logo: form.logo || null,
        website: form.website,
        discountPercent: Number(form.discountPercent),
        discountCode: form.discountCode || (form.type !== "member_organisation" ? form.partnerId : ""),
        active: form.active,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        notes: form.notes || null,
        type: form.type,
      }),
    });
    setSaving(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setFormError(data.error ?? "Kunne ikke lagre denne partneren.");
      return;
    }
    setEditing(null);
    void loadPartners();
    void loadMetrics();
  }

  async function toggleActive(partner: AdminPartner) {
    await fetch(`/api/partners?id=${encodeURIComponent(partner.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: partner.name,
        country: partner.country,
        logo: partner.logo,
        website: partner.website,
        discountPercent: partner.discountPercent,
        discountCode: partner.discountCode,
        active: !partner.active,
        startDate: partner.startDate,
        endDate: partner.endDate,
        notes: partner.notes,
        type: partner.type,
      }),
    });
    void loadPartners();
  }

  function openReview(applicationId: string) {
    setApprovalForm(emptyApprovalForm);
    setApprovalError("");
    setReviewing(applicationId);
  }

  async function handleApprove(event: FormEvent, applicationId: string) {
    event.preventDefault();
    setApproving(true);
    setApprovalError("");
    const response = await fetch(`/api/partners?action=approve&id=${encodeURIComponent(applicationId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        discountPercent: Number(approvalForm.discountPercent),
        startDate: approvalForm.startDate || null,
        endDate: approvalForm.endDate || null,
        partnerId: approvalForm.partnerId || null,
        discountCode: approvalForm.discountCode || null,
        notes: approvalForm.notes || null,
      }),
    });
    setApproving(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setApprovalError(data.error ?? "Kunne ikke godkjenne søknaden.");
      return;
    }
    setReviewing(null);
    void loadApplications();
    void loadPartners();
    void loadMetrics();
  }

  async function handleReject(applicationId: string) {
    await fetch(`/api/partners?action=reject&id=${encodeURIComponent(applicationId)}`, { method: "POST" });
    void loadApplications();
  }

  if (authed === null) {
    return <main className="flex min-h-screen items-center justify-center bg-background text-foreground" />;
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <form onSubmit={handleLogin} className="panel w-full max-w-sm p-6">
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-primary">AUTOVERE ADMIN</p>
          <h1 className="mt-2 text-xl font-bold">Logg inn</h1>
          <label className="mt-6 block">
            <span className={labelClass}>Admin-nøkkel</span>
            <input type="password" autoFocus value={secret} onChange={(event) => setSecret(event.target.value)} className={inputClass} />
          </label>
          {loginError && <p className="mt-2 text-sm text-destructive">{loginError}</p>}
          <Button type="submit" className="mt-5 w-full" disabled={loggingIn || !secret}>
            {loggingIn ? "Sjekker…" : "Logg inn"}
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">Du kan også logge inn med din vanlige AutoVere-e-post hvis den er registrert som admin-konto.</p>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-primary">AUTOVERE ADMIN</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{tab === "metrics" ? "Nøkkeltall" : tab === "partners" ? "Partnere" : "Søknader"}</h1>
          </div>
          <div className="flex gap-2">
            <div className="flex rounded-lg border border-border bg-surface-raised p-1">
              <button type="button" onClick={() => setTab("metrics")} className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${tab === "metrics" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Nøkkeltall</button>
              <button type="button" onClick={() => setTab("partners")} className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${tab === "partners" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Partnere</button>
              <button type="button" onClick={() => setTab("applications")} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${tab === "applications" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                Søknader
                {pendingCount > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${tab === "applications" ? "bg-primary-foreground/20" : "bg-primary/15 text-primary"}`}>{pendingCount}</span>
                )}
              </button>
            </div>
            <Button variant="secondary" size="sm" onClick={() => void handleLogout()}>Logg ut</Button>
          </div>
        </div>

        {tab === "metrics" && (
          <div className="mt-8 space-y-6">
            {!metrics ? (
              <p className="text-sm text-muted-foreground">Laster nøkkeltall…</p>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <KpiCard label="Registrerte brukere" value={metrics.users.total} sub={`+${metrics.users.newLast30Days} siste 30 dager`} />
                  <KpiCard label="Aktive abonnement" value={metrics.subscriptions.activeTotal} sub={`${metrics.subscriptions.pro} Pro · ${metrics.subscriptions.business} Business`} />
                  <KpiCard label="Anslått MRR" value={`€${metrics.revenue.mrrEur.toLocaleString("no-NO")}`} sub="Normalisert til per måned" />
                  <KpiCard label="Betalt siste 30 dager" value={`€${metrics.revenue.recentPaidInvoicesEur.toLocaleString("no-NO")}`} sub="Fra betalte Stripe-fakturaer" />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <KpiCard label="Free-brukere" value={metrics.subscriptions.free} sub="Ingen aktivt abonnement" />
                  <KpiCard label="Pro-abonnenter" value={metrics.subscriptions.pro} />
                  <KpiCard label="Business-abonnenter" value={metrics.subscriptions.business} />
                </div>

                <section className="panel p-5 sm:p-7">
                  <h2 className="text-lg font-bold">Nye brukere per uke</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Siste {metrics.users.weeklySignups.length} uker, basert på første innlogging.</p>
                  <div className="mt-5 space-y-2">
                    {metrics.users.weeklySignups.map((week) => {
                      const max = Math.max(...metrics.users.weeklySignups.map((w) => w.count), 1);
                      return (
                        <div key={week.week} className="flex items-center gap-3">
                          <span className="w-24 shrink-0 text-xs text-muted-foreground">{week.week}</span>
                          <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-raised">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max((week.count / max) * 100, week.count > 0 ? 4 : 0)}%` }} />
                          </div>
                          <span className="w-8 shrink-0 text-right text-xs font-semibold">{week.count}</span>
                        </div>
                      );
                    })}
                    {metrics.users.weeklySignups.length === 0 && <p className="text-sm text-muted-foreground">Ingen data ennå.</p>}
                  </div>
                </section>

                <section className="panel overflow-x-auto p-5 sm:p-7">
                  <h2 className="text-lg font-bold">Partnere og medlemsfordeler</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Totalt {metrics.discountUsage.totalMembers} medlemmer registrert via partnere · {metrics.discountUsage.totalReferrals} fullførte kjøp med partnerkobling.
                  </p>
                  <table className="mt-5 w-full min-w-[560px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-3 py-3 font-semibold">Partner</th>
                        <th className="px-3 py-3 font-semibold">Land</th>
                        <th className="px-3 py-3 font-semibold">Status</th>
                        <th className="px-3 py-3 font-semibold">Medlemmer</th>
                        <th className="px-3 py-3 font-semibold">Henvisninger</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.partners.map((partner) => (
                        <tr key={partner.id} className="border-b border-border/60 last:border-0">
                          <td className="px-3 py-3 font-semibold">{partner.name}</td>
                          <td className="px-3 py-3 text-muted-foreground">{partner.country ?? "—"}</td>
                          <td className="px-3 py-3">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${partner.active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{partner.active ? "Aktiv" : "Inaktiv"}</span>
                          </td>
                          <td className="px-3 py-3">{partner.memberCount}</td>
                          <td className="px-3 py-3">{partner.referralCount}</td>
                        </tr>
                      ))}
                      {metrics.partners.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-3 py-8 text-center text-sm text-muted-foreground">Ingen partnere registrert ennå.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </section>
              </>
            )}
          </div>
        )}

        {tab === "partners" && (
          <>
            <div className="mt-8 flex justify-end">
              <Button size="sm" onClick={openNew}><Plus className="mr-1.5 size-4" /> Legg til partner</Button>
            </div>

            <section className="panel mt-4 overflow-x-auto p-5 sm:p-7">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-3 font-semibold">Partner</th>
                    <th className="px-3 py-3 font-semibold">Type</th>
                    <th className="px-3 py-3 font-semibold">Land</th>
                    <th className="px-3 py-3 font-semibold">Rabatt</th>
                    <th className="px-3 py-3 font-semibold">Kode</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Henvisninger</th>
                    <th className="px-3 py-3 font-semibold" />
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <tr key={partner.id} className="border-b border-border/60 last:border-0">
                      <td className="px-3 py-4">
                        <p className="font-semibold">{partner.name}</p>
                        <p className="text-xs text-muted-foreground">{partner.id}</p>
                      </td>
                      <td className="px-3 py-4 text-muted-foreground">{PARTNER_TYPE_LABELS[partner.type]}</td>
                      <td className="px-3 py-4 text-muted-foreground">{partner.country ?? "—"}</td>
                      <td className="px-3 py-4">{partner.discountPercent}%</td>
                      <td className="px-3 py-4 font-mono text-xs">{partner.discountCode}</td>
                      <td className="px-3 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${partner.active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {partner.active ? "Aktiv" : "Inaktiv"}
                        </span>
                      </td>
                      <td className="px-3 py-4">{partner.referralCount}</td>
                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(partner)}><Pencil className="size-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => void toggleActive(partner)} title={partner.active ? "Deaktiver" : "Aktiver"}>
                            <Power className={`size-4 ${partner.active ? "text-primary" : "text-muted-foreground"}`} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {partners.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-3 py-10 text-center text-sm text-muted-foreground">Ingen partnere ennå. Legg til den første over.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>

            {editing && (
              <section className="panel mt-8 p-5 sm:p-7">
                <h2 className="text-lg font-bold">{editing === "new" ? "Legg til partner" : `Rediger ${form.name}`}</h2>
                <form onSubmit={handleSave} className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label>
                    <span className={labelClass}>Partnertype</span>
                    <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as PartnerType })} className={inputClass}>
                      {(Object.entries(PARTNER_TYPE_LABELS) as [PartnerType, string][]).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className={labelClass}>{form.type === "member_organisation" ? "Organisasjonsnavn" : "Forhandlernavn"}</span>
                    <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Land</span>
                    <input value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} className={inputClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Partner-ID (f.eks. ETA)</span>
                    <input
                      required
                      disabled={editing !== "new"}
                      value={form.partnerId}
                      onChange={(event) => setForm({ ...form, partnerId: event.target.value.toUpperCase() })}
                      className={`${inputClass} ${editing !== "new" ? "opacity-60" : ""}`}
                    />
                  </label>
                  <label>
                    <span className={labelClass}>Offisiell nettside</span>
                    <input required type="url" placeholder="https://" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} className={inputClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Rabatt %</span>
                    <input required type="number" min={1} max={100} value={form.discountPercent} onChange={(event) => setForm({ ...form, discountPercent: Number(event.target.value) })} className={inputClass} />
                  </label>
                  <label>
                    <span className={labelClass}>{form.type === "member_organisation" ? "Medlemskode" : "Kode (valgfritt — bruker partner-ID hvis tom)"}</span>
                    <input
                      required={form.type === "member_organisation"}
                      placeholder={form.type !== "member_organisation" ? form.partnerId : undefined}
                      value={form.discountCode}
                      onChange={(event) => setForm({ ...form, discountCode: event.target.value.toUpperCase() })}
                      className={inputClass}
                    />
                  </label>
                  <label>
                    <span className={labelClass}>Startdato (valgfritt)</span>
                    <input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} className={inputClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Sluttdato (valgfritt)</span>
                    <input type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} className={inputClass} />
                  </label>
                  <label className="sm:col-span-2">
                    <span className={labelClass}>Logo (SVG eller lite bilde, maks 250 KB)</span>
                    <input type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) handleLogoFile(file); }} className="mt-1 w-full text-sm" />
                    {form.logo && <img src={form.logo} alt="Forhåndsvisning av logo" className="mt-3 h-10 w-auto max-w-[160px] object-contain" />}
                  </label>
                  <label className="sm:col-span-2">
                    <span className={labelClass}>Interne notater (valgfritt)</span>
                    <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className={`${inputClass} min-h-20`} />
                  </label>
                  <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Aktiv — gir rett på rabatt
                    {form.type === "member_organisation" ? " og er synlig på partnersiden" : " via partnerlenken (vises ikke på den offentlige partnersiden)"}
                  </label>

                  {formError && <p className="text-sm text-destructive sm:col-span-2">{formError}</p>}

                  <div className="flex gap-3 sm:col-span-2">
                    <Button type="submit" disabled={saving}>{saving ? "Lagrer…" : "Lagre"}</Button>
                    <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Avbryt</Button>
                  </div>
                </form>

                <details className="mt-6 rounded-lg border border-border bg-surface-raised px-4 py-3 text-xs text-muted-foreground">
                  <summary className="cursor-pointer select-none font-semibold text-foreground">Eksempler og hjelp</summary>
                  <div className="mt-3 space-y-1.5">
                    <p><span className="font-semibold text-foreground">Partner-ID:</span> <span className="font-mono">NORDIC-CAMP-NO</span>, <span className="font-mono">ADRIA-DEALER-DE</span>, <span className="font-mono">CAMPING-SE</span> osv.</p>
                    <p><span className="font-semibold text-foreground">Landkode:</span> <span className="font-mono">NO, SE, DK, EN, DE, NL, FR, PL</span></p>
                    <p><span className="font-semibold text-foreground">Medlemskode:</span> f.eks. <span className="font-mono">NORDIC25</span></p>
                    <p><span className="font-semibold text-foreground">Rabatt:</span> f.eks. <span className="font-mono">25</span></p>
                    <p><span className="font-semibold text-foreground">Logo:</span> SVG anbefales, alternativt PNG/JPG, maks 250 KB — f.eks. <span className="font-mono">eksempel-dealer.svg</span></p>
                    <p><span className="font-semibold text-foreground">Offisielt nettsted:</span> full URL, f.eks. <span className="font-mono">https://www.example.no</span></p>
                    <p><span className="font-semibold text-foreground">Start-/sluttdato:</span> valgfritt — styrer kun hvor lenge avtalen (og dermed rabatten) er aktiv.</p>
                    <p><span className="font-semibold text-foreground">Interne notater:</span> kun synlig for Admin, vises aldri for partneren eller kunden.</p>
                  </div>
                  <div className="mt-4 rounded-md border border-border/70 bg-surface px-3 py-2.5">
                    <p className="font-semibold text-foreground">Eksempel — komplett forhandlerpartner</p>
                    <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
                      <dt className="text-muted-foreground">Partner</dt><dd>Eksempel Bil &amp; Bobil</dd>
                      <dt className="text-muted-foreground">Type</dt><dd>Bil-/bobilforhandler</dd>
                      <dt className="text-muted-foreground">Land</dt><dd className="font-mono">NO</dd>
                      <dt className="text-muted-foreground">Partner-ID</dt><dd className="font-mono">EKSEMPEL-DEALER-NO</dd>
                      <dt className="text-muted-foreground">Medlemskode</dt><dd className="font-mono">EKSEMPEL25</dd>
                      <dt className="text-muted-foreground">Rabatt</dt><dd>25 %</dd>
                      <dt className="text-muted-foreground">Logo</dt><dd className="font-mono">eksempel-dealer.svg</dd>
                    </dl>
                  </div>
                </details>
              </section>
            )}
          </>
        )}

        {tab === "applications" && (
          <section className="panel mt-8 overflow-x-auto p-5 sm:p-7">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-3 font-semibold">Organisasjon</th>
                  <th className="px-3 py-3 font-semibold">Type</th>
                  <th className="px-3 py-3 font-semibold">Land</th>
                  <th className="px-3 py-3 font-semibold">Kontakt</th>
                  <th className="px-3 py-3 font-semibold">Nettsted</th>
                  <th className="px-3 py-3 font-semibold">Innsendt</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <Fragment key={application.id}>
                    <tr className="border-b border-border/60 last:border-0 align-top">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2">
                          {application.logo && <img src={application.logo} alt="" className="h-6 w-auto max-w-[64px] shrink-0 object-contain" />}
                          <p className="font-semibold">{application.organisationName}</p>
                        </div>
                        {application.message && <p className="mt-1 max-w-xs text-xs text-muted-foreground">{application.message}</p>}
                      </td>
                      <td className="px-3 py-4 text-muted-foreground">{PARTNER_TYPE_LABELS[application.type]}</td>
                      <td className="px-3 py-4 text-muted-foreground">{application.country ?? "—"}</td>
                      <td className="px-3 py-4">
                        <p>{application.contactName}</p>
                        <p className="text-xs text-muted-foreground">{application.contactEmail}</p>
                      </td>
                      <td className="px-3 py-4">
                        <a href={application.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{application.website.replace(/^https?:\/\//, "")}</a>
                      </td>
                      <td className="px-3 py-4 text-muted-foreground">{new Date(application.createdAt).toLocaleDateString("no-NO")}</td>
                      <td className="px-3 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${application.status === "pending" ? "bg-primary/15 text-primary" : application.status === "approved" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {STATUS_LABELS[application.status]}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        {application.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={() => openReview(application.id)}><Check className="size-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => void handleReject(application.id)} title="Avslå">
                              <X className="size-4 text-destructive" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                    {reviewing === application.id && (
                      <tr>
                        <td colSpan={8} className="bg-surface-raised px-3 py-5">
                          <form onSubmit={(event) => void handleApprove(event, application.id)} className="grid gap-4 sm:grid-cols-3">
                            <label>
                              <span className={labelClass}>Rabatt %</span>
                              <input required type="number" min={1} max={100} value={approvalForm.discountPercent} onChange={(event) => setApprovalForm({ ...approvalForm, discountPercent: Number(event.target.value) })} className={inputClass} />
                            </label>
                            <label>
                              <span className={labelClass}>Startdato (valgfritt)</span>
                              <input type="date" value={approvalForm.startDate} onChange={(event) => setApprovalForm({ ...approvalForm, startDate: event.target.value })} className={inputClass} />
                            </label>
                            <label>
                              <span className={labelClass}>Sluttdato (valgfritt)</span>
                              <input type="date" value={approvalForm.endDate} onChange={(event) => setApprovalForm({ ...approvalForm, endDate: event.target.value })} className={inputClass} />
                            </label>
                            <label>
                              <span className={labelClass}>Partner-ID (valgfritt — genereres automatisk fra navnet hvis tom)</span>
                              <input value={approvalForm.partnerId} onChange={(event) => setApprovalForm({ ...approvalForm, partnerId: event.target.value.toUpperCase() })} className={inputClass} />
                            </label>
                            <label>
                              <span className={labelClass}>Medlemskode (valgfritt — bruker Partner-ID hvis tom)</span>
                              <input value={approvalForm.discountCode} onChange={(event) => setApprovalForm({ ...approvalForm, discountCode: event.target.value.toUpperCase() })} className={inputClass} />
                            </label>
                            <label>
                              <span className={labelClass}>Interne notater (valgfritt)</span>
                              <input value={approvalForm.notes} onChange={(event) => setApprovalForm({ ...approvalForm, notes: event.target.value })} className={inputClass} />
                            </label>
                            {approvalError && <p className="text-sm text-destructive sm:col-span-3">{approvalError}</p>}
                            <div className="flex gap-3 sm:col-span-3">
                              <Button type="submit" disabled={approving}>{approving ? "Godkjenner…" : "Bekreft godkjenning"}</Button>
                              <Button type="button" variant="secondary" onClick={() => setReviewing(null)}>Avbryt</Button>
                            </div>
                            <p className="text-xs text-muted-foreground sm:col-span-3">
                              Ved godkjenning opprettes partneren automatisk, koden genereres og kobles til rabattlogikken, og en bekreftelse sendes til {application.contactEmail} på {application.locale.toUpperCase()}.
                            </p>
                          </form>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-3 py-10 text-center text-sm text-muted-foreground">Ingen søknader ennå.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </main>
  );
}

function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="panel p-4 sm:p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="numeric mt-2 text-2xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
