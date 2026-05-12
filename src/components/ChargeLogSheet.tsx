import { useState } from "react";
import { Zap, Wrench, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { useChargeLog } from "@/hooks/useChargeLog";
import type { ChargeSession, ServiceEntry } from "@/data/ownership-tracking";
import { toast } from "sonner";

// ─── Charge session form ─────────────────────────────────────────────────────

function ChargeForm({ slug, onDone }: { slug: string; onDone: () => void }) {
  const { addChargeSession } = useChargeLog();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    date: today,
    locationName: "",
    kwhAdded: "",
    costEur: "",
    chargerTypeKw: "50",
    durationMinutes: "",
    stateOfChargeStart: "20",
    stateOfChargeEnd: "80",
  });

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.locationName || !form.kwhAdded) return;
    addChargeSession({
      vehicleSlug: slug,
      date: form.date,
      locationName: form.locationName,
      kwhAdded: parseFloat(form.kwhAdded),
      costEur: parseFloat(form.costEur) || 0,
      chargerTypeKw: parseInt(form.chargerTypeKw) || 50,
      durationMinutes: parseInt(form.durationMinutes) || 0,
      stateOfChargeStart: parseInt(form.stateOfChargeStart) || 20,
      stateOfChargeEnd: parseInt(form.stateOfChargeEnd) || 80,
    });
    toast.success("Charge session logged.");
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Date</label>
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:border-accent/50" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Charger kW</label>
          <input type="number" value={form.chargerTypeKw} onChange={(e) => set("chargerTypeKw", e.target.value)}
            placeholder="50" min="1" max="400"
            className="w-full px-3 py-2 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:border-accent/50" />
        </div>
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Location</label>
        <input type="text" value={form.locationName} onChange={(e) => set("locationName", e.target.value)}
          placeholder="e.g. Ionity A1 München Nord" required
          className="w-full px-3 py-2 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:border-accent/50" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">kWh added</label>
          <input type="number" value={form.kwhAdded} onChange={(e) => set("kwhAdded", e.target.value)}
            placeholder="45.0" min="0.1" step="0.1" required
            className="w-full px-3 py-2 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:border-accent/50" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Cost (€)</label>
          <input type="number" value={form.costEur} onChange={(e) => set("costEur", e.target.value)}
            placeholder="18.50" min="0" step="0.01"
            className="w-full px-3 py-2 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:border-accent/50" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">SoC start %</label>
          <input type="number" value={form.stateOfChargeStart} onChange={(e) => set("stateOfChargeStart", e.target.value)}
            min="0" max="100"
            className="w-full px-3 py-2 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:border-accent/50" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">SoC end %</label>
          <input type="number" value={form.stateOfChargeEnd} onChange={(e) => set("stateOfChargeEnd", e.target.value)}
            min="0" max="100"
            className="w-full px-3 py-2 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:border-accent/50" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Duration min</label>
          <input type="number" value={form.durationMinutes} onChange={(e) => set("durationMinutes", e.target.value)}
            min="0"
            className="w-full px-3 py-2 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:border-accent/50" />
        </div>
      </div>
      <button type="submit"
        className="w-full py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-colors">
        Log session
      </button>
    </form>
  );
}

// ─── Service entry form ──────────────────────────────────────────────────────

const SERVICE_TYPES = [
  "Annual service", "Tyre change", "Brake check", "Software update",
  "Battery check", "Windshield / wipers", "Other",
] as const;

function ServiceForm({ slug, onDone }: { slug: string; onDone: () => void }) {
  const { addServiceEntry } = useChargeLog();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    date: today,
    type: "Annual service",
    description: "",
    costEur: "",
    odometer: "",
    nextDueAt: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addServiceEntry({
      vehicleSlug: slug,
      date: form.date,
      type: form.type as ServiceEntry["type"],
      description: form.description || form.type,
      costEur: form.costEur ? parseFloat(form.costEur) : undefined,
      odometer: form.odometer ? parseInt(form.odometer) : undefined,
      nextDueAt: form.nextDueAt || undefined,
    });
    toast.success("Service event logged.");
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Date</label>
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:border-accent/50" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Type</label>
          <select value={form.type} onChange={(e) => set("type", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:border-accent/50">
            {SERVICE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Notes (optional)</label>
        <input type="text" value={form.description} onChange={(e) => set("description", e.target.value)}
          placeholder="e.g. Winter tyres fitted, 19 inch Nokian"
          className="w-full px-3 py-2 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:border-accent/50" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Cost (€)</label>
          <input type="number" value={form.costEur} onChange={(e) => set("costEur", e.target.value)}
            placeholder="320" min="0" step="1"
            className="w-full px-3 py-2 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:border-accent/50" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Odometer km</label>
          <input type="number" value={form.odometer} onChange={(e) => set("odometer", e.target.value)}
            placeholder="24500" min="0"
            className="w-full px-3 py-2 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:border-accent/50" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Next due</label>
          <input type="date" value={form.nextDueAt} onChange={(e) => set("nextDueAt", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:border-accent/50" />
        </div>
      </div>
      <button type="submit"
        className="w-full py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm font-medium hover:bg-violet-500/20 transition-colors">
        Log service event
      </button>
    </form>
  );
}

// ─── Session list ────────────────────────────────────────────────────────────

function SessionList({ slug }: { slug: string }) {
  const { getSessionsForVehicle, getServiceForVehicle, removeChargeSession, removeServiceEntry } = useChargeLog();
  const chargeSessions = getSessionsForVehicle(slug);
  const serviceEntries = getServiceForVehicle(slug);

  const totalKwh = chargeSessions.reduce((a, s) => a + s.kwhAdded, 0);
  const totalCost = chargeSessions.reduce((a, s) => a + s.costEur, 0);

  if (chargeSessions.length === 0 && serviceEntries.length === 0) {
    return (
      <p className="text-xs text-muted-foreground text-center py-6">
        No sessions logged yet. Use the forms above to start tracking.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {chargeSessions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Charge sessions ({chargeSessions.length})
            </p>
            <p className="text-[10px] text-cyan-400">
              {totalKwh.toFixed(1)} kWh · €{totalCost.toFixed(2)} total
            </p>
          </div>
          <div className="space-y-2">
            {chargeSessions.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/30">
                <Zap className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{s.locationName}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    {" · "}{s.kwhAdded} kWh · {s.chargerTypeKw} kW
                    {s.costEur > 0 && ` · €${s.costEur.toFixed(2)}`}
                  </p>
                </div>
                <button onClick={() => removeChargeSession(s.id)}
                  className="text-muted-foreground hover:text-rose-400 transition-colors flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {serviceEntries.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Service events ({serviceEntries.length})
          </p>
          <div className="space-y-2">
            {serviceEntries.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/30">
                <Wrench className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{s.type}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    {s.costEur != null && ` · €${s.costEur}`}
                    {s.description && s.description !== s.type && ` · ${s.description}`}
                  </p>
                </div>
                <button onClick={() => removeServiceEntry(s.id)}
                  className="text-muted-foreground hover:text-rose-400 transition-colors flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main exported sheet ─────────────────────────────────────────────────────

export function ChargeLogSheet({ slug, vehicleName }: { slug: string; vehicleName: string }) {
  const [tab, setTab] = useState<"charge" | "service" | "history">("charge");
  const [formOpen, setFormOpen] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 rounded-xl glass border border-border/40 hover:border-cyan-400/40 hover:text-cyan-400 transition-colors">
          <Zap className="w-3.5 h-3.5" /> Log & track
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col overflow-hidden">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/30 flex-shrink-0">
          <SheetTitle className="text-base">{vehicleName} — Tracking</SheetTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Log charge sessions and service events.</p>
        </SheetHeader>

        {/* Tab bar */}
        <div className="flex border-b border-border/30 flex-shrink-0">
          {(["charge", "service", "history"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-medium capitalize transition-colors border-b-2 ${
                tab === t ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "charge" ? "Charge" : t === "service" ? "Service" : "History"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === "charge" && (
            <div className="space-y-4">
              <button
                onClick={() => setFormOpen(!formOpen)}
                className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-cyan-500/8 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/15 transition-colors"
              >
                <span className="flex items-center gap-2"><Plus className="w-3.5 h-3.5" /> Log charge session</span>
                {formOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {formOpen && <ChargeForm slug={slug} onDone={() => setFormOpen(false)} />}
            </div>
          )}
          {tab === "service" && <ServiceForm slug={slug} onDone={() => {}} />}
          {tab === "history" && <SessionList slug={slug} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}
