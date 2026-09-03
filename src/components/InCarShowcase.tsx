import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Battery,
  Building2,
  Car,
  Fuel,
  Gauge,
  KeyRound,
  LogOut,
  MapPin,
  Radar,
  Satellite,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkInCarAuthorized, requestInCarAccess } from "@/lib/in-car-auth.functions";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { sendContactMessage } from "@/lib/contact.functions";
import {
  COCKPIT_STRINGS,
  getSnapshot,
  ROUTES,
  VEHICLES,
  type LangKey,
  type RouteKey,
  type VehicleKey,
} from "@/lib/in-car-showcase-data";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Auth gate                                                           */
/* ------------------------------------------------------------------ */

/** True once, on first render, if we've landed via a Supabase invite/recovery link. */
function landedViaAuthLink(): boolean {
  if (typeof window === "undefined") return false;
  const hash = window.location.hash;
  return hash.includes("type=invite") || hash.includes("type=recovery");
}

function LoginGate({ onAuthorized }: { onAuthorized: () => void }) {
  const { user } = useAuth();

  const [needsPassword, setNeedsPassword] = useState(landedViaAuthLink);
  const [checking, setChecking] = useState(false);
  const [restricted, setRestricted] = useState(false);

  // Supabase fires this event specifically when a session was just
  // established from an invite/recovery link — a more reliable signal than
  // the URL hash alone, since detectSessionInUrl may consume it before this
  // component mounts.
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setNeedsPassword(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || needsPassword) return;
    let alive = true;
    setChecking(true);
    setRestricted(false);
    checkInCarAuthorized()
      .then((ok) => {
        if (!alive) return;
        setChecking(false);
        if (ok) onAuthorized();
        else setRestricted(true);
      })
      .catch(() => {
        if (alive) {
          setChecking(false);
          setRestricted(true);
        }
      });
    return () => {
      alive = false;
    };
  }, [user, needsPassword, onAuthorized]);

  // Step 1: request an access link.
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const result = await requestInCarAccess({ data: { email } });
      if (result.ok) {
        setSent(true);
      } else {
        setError(result.error ?? "Access restricted to authorized executive emails.");
      }
    } catch {
      setError("Access restricted to authorized executive emails.");
    } finally {
      setSending(false);
    }
  };

  // Steps 3–4: set the initial (or new) password after clicking the link.
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [settingPassword, setSettingPassword] = useState(false);

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (password !== confirmPassword) {
      setPasswordError("Password and confirmation do not match.");
      return;
    }

    setSettingPassword(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setPasswordError(updateError.message);
        return;
      }
      if (typeof window !== "undefined") window.history.replaceState(null, "", "/partners/in-car");
      setNeedsPassword(false);
    } catch {
      setPasswordError("Couldn't set your password — please try again.");
    } finally {
      setSettingPassword(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070c] px-5 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60rem 40rem at 15% -10%, rgba(56,189,248,0.10), transparent 60%), radial-gradient(50rem 30rem at 110% 10%, rgba(245,158,11,0.08), transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:44px_44px]"
      />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-10">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-300/80">
          KM TECH LABS
        </p>
        <h1 className="mt-4 text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          AutoVere In-Car Intelligence <span className="text-primary">•</span> Executive Preview
        </h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-white/55">
          Confidential demonstration portal for OEM &amp; Fleet partners.
        </p>

        {needsPassword ? (
          <form onSubmit={submitPassword} className="mt-8 space-y-4">
            <p className="text-center text-sm text-white/60">Create your password to enter the cockpit simulator.</p>
            <div className="space-y-1.5">
              <Label htmlFor="incar-new-password" className="text-xs uppercase tracking-[0.14em] text-white/50">
                Password
              </Label>
              <Input
                id="incar-new-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-white/15 bg-white/[0.04] text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="incar-confirm-password" className="text-xs uppercase tracking-[0.14em] text-white/50">
                Confirm password
              </Label>
              <Input
                id="incar-confirm-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 border-white/15 bg-white/[0.04] text-white placeholder:text-white/30"
              />
            </div>

            {passwordError && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {passwordError}
              </p>
            )}

            <Button
              type="submit"
              disabled={settingPassword}
              className="h-12 w-full bg-primary text-base font-semibold text-primary-foreground shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:opacity-90"
            >
              {settingPassword ? "Setting password…" : "Set password & enter"}
            </Button>
          </form>
        ) : restricted ? (
          <div className="mt-8 space-y-4 text-center">
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              Access restricted to authorized executive emails.
            </p>
            <button
              type="button"
              onClick={() => void supabase.auth.signOut()}
              className="text-xs text-white/40 underline-offset-4 transition-colors hover:text-white/70 hover:underline"
            >
              Sign out and try a different account
            </button>
          </div>
        ) : checking ? (
          <p className="mt-8 text-center text-sm text-white/50">Checking access…</p>
        ) : sent ? (
          <div className="mt-8 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-5 text-center">
            <p className="text-sm font-semibold text-emerald-200">Secure access link sent to {email}.</p>
            <p className="mt-1.5 text-xs leading-relaxed text-emerald-200/70">
              Check your inbox to enter the cockpit simulator.
            </p>
          </div>
        ) : (
          <form onSubmit={submitEmail} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="incar-email" className="text-xs uppercase tracking-[0.14em] text-white/50">
                Corporate email
              </Label>
              <Input
                id="incar-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@oem.com"
                className="h-11 border-white/15 bg-white/[0.04] text-white placeholder:text-white/30"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={sending}
              className="h-12 w-full bg-primary text-base font-semibold text-primary-foreground shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:opacity-90"
            >
              {sending ? "Sending…" : "Send Access Link"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-[11px] text-white/30">
          Access is restricted to authorized executive accounts only.
        </p>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Cockpit simulator                                                   */
/* ------------------------------------------------------------------ */

const VEHICLE_ICON: Record<VehicleKey, typeof Car> = {
  ev: Car,
  motorhome: Gauge,
  motorcycle: Gauge,
};

function CockpitSimulator() {
  const [route, setRoute] = useState<RouteKey>("a");
  const [vehicle, setVehicle] = useState<VehicleKey>("ev");
  const [lang, setLang] = useState<LangKey>("en");
  const [clock, setClock] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const [qrSvg, setQrSvg] = useState("");

  useEffect(() => {
    const update = () =>
      setClock(new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }));
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!qrOpen) return;
    let alive = true;
    void import("qrcode").then(async (mod) => {
      const out = await mod.default.toString("https://www.autovere.com/partners/in-car", {
        type: "svg",
        margin: 1,
        width: 176,
        color: { dark: "#05070c", light: "#ffffff" },
      });
      if (alive) setQrSvg(out);
    });
    return () => {
      alive = false;
    };
  }, [qrOpen]);

  const routeData = ROUTES.find((r) => r.key === route)!;
  const snapshot = useMemo(() => getSnapshot(route, vehicle), [route, vehicle]);
  const t = COCKPIT_STRINGS[lang];
  const tollTotal = snapshot.tolls.reduce((sum, l) => sum + l.amount, 0) + snapshot.energy.amount;

  return (
    <div id="incar-cockpit-demo" className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      {/* Scenario selector */}
      <div className="flex flex-wrap gap-2">
        {ROUTES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRoute(r.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              route === r.key
                ? "border-primary bg-primary/15 text-white"
                : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white",
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Vehicle profile switch */}
      <div className="mt-3 flex flex-wrap gap-2">
        {VEHICLES.map((v) => {
          const Icon = VEHICLE_ICON[v.key];
          return (
            <button
              key={v.key}
              type="button"
              onClick={() => setVehicle(v.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                vehicle === v.key
                  ? "border-amber-400/60 bg-amber-400/10 text-amber-200"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white",
              )}
            >
              <Icon className="size-4" /> {v.label}
            </button>
          );
        })}
      </div>

      {/* The cockpit frame */}
      <div className="relative mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-[#05070c] shadow-[0_0_120px_rgba(0,0,0,0.55)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(40rem 22rem at 0% 0%, rgba(56,189,248,0.10), transparent 60%), radial-gradient(30rem 18rem at 100% 100%, rgba(245,158,11,0.08), transparent 55%)",
          }}
        />

        {/* Top status bar */}
        <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] px-5 py-3">
          <div className="flex items-center gap-4 text-xs font-medium text-white/60">
            <span className="tabular-nums text-white/85">{clock || "--:--"}</span>
            <span className="inline-flex items-center gap-1.5">
              <Satellite className="size-3.5 text-emerald-400" /> {t.gpsLocked}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wifi className="size-3.5 text-emerald-400" /> {t.vehicleOnline}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {(Object.keys(COCKPIT_STRINGS) as LangKey[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-label={COCKPIT_STRINGS[code].name}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                  lang === code ? "bg-primary text-primary-foreground" : "text-white/50 hover:text-white",
                )}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Split screen */}
        <div className="relative grid gap-px sm:grid-cols-2" style={{ aspectRatio: "16 / 9" }}>
          {/* Left: route overview */}
          <div className="flex flex-col justify-between overflow-y-auto bg-black/20 p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                {t.routeOverview}
              </p>
              <p className="mt-1 text-lg font-semibold text-white">{routeData.short}</p>
              <p className="text-xs text-white/40">{routeData.distanceKm} km</p>
            </div>

            <div className="mt-6 space-y-0">
              {routeData.milestones.map((m, i) => (
                <div key={m} className="relative flex items-start gap-3 pb-6 last:pb-0">
                  {i < routeData.milestones.length - 1 && (
                    <span aria-hidden className="absolute left-[7px] top-4 h-full w-px bg-white/15" />
                  )}
                  <span
                    className={cn(
                      "relative z-10 mt-1 size-[15px] shrink-0 rounded-full border-2",
                      i === 0
                        ? "border-emerald-400 bg-emerald-400/30"
                        : i === routeData.milestones.length - 1
                          ? "border-amber-400 bg-amber-400/30"
                          : "border-white/40 bg-white/10",
                    )}
                  />
                  <span className="text-sm text-white/75">{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: cost & compliance */}
          <div className="flex flex-col gap-4 overflow-y-auto bg-white/[0.015] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
              {t.liveCostCompliance}
            </p>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                <MapPin className="size-3.5" /> {t.tollsVignettes}
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {snapshot.tolls.map((line) => (
                  <li key={`${line.country}-${line.operator}`} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-white/60">
                      {line.country} <span className="text-white/30">·</span> {line.operator}
                    </span>
                    <span className="shrink-0 font-medium tabular-nums text-white">€{line.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                {snapshot.energy.unit === "kWh" ? (
                  <Battery className="size-3.5" />
                ) : (
                  <Fuel className="size-3.5" />
                )}{" "}
                {t.energyOptimizer}
              </p>
              <p className="mt-2 text-sm text-white/70">{snapshot.energy.stop}</p>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-white/50">
                  {snapshot.energy.qty} {snapshot.energy.unit}
                  {snapshot.energy.bufferPct ? ` · ${snapshot.energy.bufferPct}% buffer` : ""}
                </span>
                <span className="font-medium tabular-nums text-white">€{snapshot.energy.amount.toFixed(2)}</span>
              </div>
            </div>

            <div
              className={cn(
                "rounded-2xl border p-4",
                snapshot.compliance.level === "warn"
                  ? "border-amber-400/30 bg-amber-400/10"
                  : "border-emerald-400/30 bg-emerald-400/10",
              )}
            >
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                <Radar className="size-3.5" /> {t.complianceRadar}
              </p>
              <p
                className={cn(
                  "mt-2 text-sm font-semibold",
                  snapshot.compliance.level === "warn" ? "text-amber-200" : "text-emerald-200",
                )}
              >
                {snapshot.compliance.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/60">{snapshot.compliance.detail}</p>
            </div>

            <div className="mt-auto flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">{t.total}</span>
              <span className="text-lg font-semibold tabular-nums text-amber-200">€{tollTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Send-to-mobile */}
      <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{t.sendToMobile}</p>
        <button
          type="button"
          onClick={() => setQrOpen((v) => !v)}
          className="flex size-40 items-center justify-center rounded-xl bg-white p-2"
        >
          {qrOpen && qrSvg ? (
            <div className="size-full [&_svg]:size-full" dangerouslySetInnerHTML={{ __html: qrSvg }} />
          ) : (
            <span className="text-xs font-medium text-black/60">Tap to reveal QR</span>
          )}
        </button>
        <p className="max-w-xs text-xs text-white/50">{t.scanCaption}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pillars                                                             */
/* ------------------------------------------------------------------ */

const PILLARS = [
  {
    icon: BadgeCheck,
    title: "Algorithmic Precision (Zero LLM Hallucinations)",
    body: "Same vehicle, same route, same day = identical, verifiable cost down to the cent. Linked directly to official toll authorities.",
  },
  {
    icon: Sparkles,
    title: "Smart Vignette Optimization",
    body: "Calculates the optimal validity window — e.g. 10-day vs. 2-month vignette — based on the vehicle's actual trip length.",
  },
  {
    icon: ShieldCheck,
    title: "Autonomous Compliance Engine",
    body: "Pre-border warnings for Low Emission Zones (ZTL), environmental stickers, axle classes, and tunnel restrictions.",
  },
  {
    icon: Building2,
    title: "Native Integration Flexibility",
    body: "Deployable as an Android Automotive (AAOS) native app, an Apple CarPlay companion, or a headless REST API directly into OEM navigation stacks.",
  },
] as const;

function Pillars() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300/80">The four disruptive pillars</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {PILLARS.map((p) => (
          <div key={p.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p.icon className="size-6 text-primary" />
            <h3 className="mt-4 text-lg font-semibold text-white">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* B2B value section                                                   */
/* ------------------------------------------------------------------ */

const B2B = [
  {
    title: "Car Rental Fleets",
    subtitle: "Hertz / Sixt",
    body: "Eliminate post-trip toll dispute fees and provide branded customer trip summaries at drop-off.",
  },
  {
    title: "Camper & RV Manufacturers",
    subtitle: "Hymer and peers",
    body: "A complete \"Adventure Budgeting\" suite baked directly into the vehicle — tolls, ferries, fuel and camp stops.",
  },
  {
    title: "EV Brands",
    subtitle: "Polestar / Volvo",
    body: "Eliminate charging price anxiety across Europe's fragmented charging networks with one deterministic estimate.",
  },
] as const;

function B2BSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300/80">Commercial value</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {B2B.map((b) => (
          <div key={b.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80">{b.subtitle}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{b.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Contact form                                                        */
/* ------------------------------------------------------------------ */

function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [interest, setInterest] = useState("OEM In-Car");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await sendContactMessage({
        data: {
          kind: "partner",
          name,
          email,
          organisation: organization,
          subject: `In-Car Intelligence pilot — ${interest}`,
          message: `Integration interest: ${interest}\n\n${message}`,
        },
      });
      setSent(true);
    } catch {
      toast.error("Couldn't send your request — please try again or email partners@autovere.com directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="incar-contact" className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300/80">Executive contact</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Request a pilot</h2>
      <p className="mt-2 text-sm text-white/55">
        Tell us about your fleet, platform or navigation stack — we'll follow up with an integration brief.
      </p>

      {sent ? (
        <div className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-emerald-200">
          <p className="font-semibold">Request received.</p>
          <p className="mt-1 text-sm text-emerald-200/80">
            Thank you — our partnerships team will be in touch shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="ic-name" className="text-white/60">Name</Label>
            <Input
              id="ic-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-white/15 bg-white/[0.04] text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ic-email" className="text-white/60">Business email</Label>
            <Input
              id="ic-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white/15 bg-white/[0.04] text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ic-org" className="text-white/60">Organization</Label>
            <Input
              id="ic-org"
              required
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="border-white/15 bg-white/[0.04] text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/60">Integration interest</Label>
            <Select value={interest} onValueChange={setInterest}>
              <SelectTrigger className="border-white/15 bg-white/[0.04] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OEM In-Car">OEM In-Car</SelectItem>
                <SelectItem value="Rental Fleet">Rental Fleet</SelectItem>
                <SelectItem value="API Licensing">API Licensing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="ic-message" className="text-white/60">Message</Label>
            <Textarea
              id="ic-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border-white/15 bg-white/[0.04] text-white"
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={sending}
              className="h-12 w-full bg-primary text-base font-semibold text-primary-foreground hover:opacity-90 sm:w-auto"
            >
              {sending ? "Sending…" : "Request pilot access"}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Account credentials modal                                           */
/* ------------------------------------------------------------------ */

function CredentialsModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setNewEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setInfo(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!newEmail && !newPassword) {
      setError("Enter a new email and/or a new password.");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSaving(true);
    try {
      const attrs: { email?: string; password?: string } = {};
      if (newEmail) attrs.email = newEmail;
      if (newPassword) attrs.password = newPassword;
      const { error: updateError } = await supabase.auth.updateUser(attrs);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      toast.success("Credentials updated successfully.");
      if (newEmail) setInfo("Check your new email inbox to confirm the change.");
      setNewPassword("");
      setConfirmPassword("");
      setNewEmail("");
    } catch {
      setError("Couldn't update credentials — please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="border-white/10 bg-[#0a0e17] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account Credentials</DialogTitle>
          <DialogDescription className="text-white/50">
            Update the email or password used to access this portal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cc-email" className="text-white/60">New email (optional)</Label>
            <Input
              id="cc-email"
              type="email"
              autoComplete="username"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="border-white/15 bg-white/[0.04] text-white"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cc-new" className="text-white/60">New password (optional)</Label>
              <Input
                id="cc-new"
                type="password"
                autoComplete="new-password"
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-white/15 bg-white/[0.04] text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cc-confirm" className="text-white/60">Confirm password</Label>
              <Input
                id="cc-confirm"
                type="password"
                autoComplete="new-password"
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-white/15 bg-white/[0.04] text-white"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
              {info}
            </p>
          )}

          <Button type="submit" disabled={saving} className="h-11 w-full bg-primary font-semibold text-primary-foreground hover:opacity-90">
            {saving ? "Saving…" : "Update credentials"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Root showcase                                                       */
/* ------------------------------------------------------------------ */

export function InCarShowcase() {
  const { signOut } = useAuth();
  const [authorized, setAuthorized] = useState(false);
  const [credentialsOpen, setCredentialsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setAuthorized(false);
    toast.success("Logged out.");
  };

  if (!authorized) {
    return <LoginGate onAuthorized={() => setAuthorized(true)} />;
  }

  return (
    <main className="min-h-screen bg-[#05070c] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(55rem 32rem at 20% -10%, rgba(56,189,248,0.10), transparent 60%), radial-gradient(45rem 28rem at 100% 0%, rgba(245,158,11,0.10), transparent 55%)",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl items-start justify-between gap-4">
          <Badge className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-amber-200">
            KM TECH LABS • NEXT-GEN AUTOMOTIVE INTELLIGENCE
          </Badge>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setCredentialsOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              <KeyRound className="size-3.5" /> Account Credentials
            </button>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              <LogOut className="size-3.5" /> Log out
            </button>
          </div>
        </div>

        <CredentialsModal open={credentialsOpen} onOpenChange={setCredentialsOpen} />

        <div className="relative mx-auto mt-8 max-w-4xl">
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
            The Missing Layer in Connected Cars:{" "}
            <span className="bg-gradient-to-r from-amber-300 to-primary bg-clip-text text-transparent">
              Real-Time Cost &amp; Compliance.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            While other systems show the road, AutoVere models the true economics of every kilometer. Deterministic
            tolls, dynamic vignette optimization, smart EV tariffs, and cross-border compliance — directly on the
            vehicle's display.
          </p>
          <a
            href="#incar-cockpit-demo"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(245,158,11,0.25)] transition-opacity hover:opacity-90"
          >
            Jump to Live Cockpit Demo
          </a>
        </div>
      </section>

      <CockpitSimulator />
      <Pillars />
      <B2BSection />
      <ContactSection />

      <div className="border-t border-white/10 py-8 text-center text-xs text-white/30">
        Confidential — for authorized OEM &amp; fleet partners only. © KM TECH LABS.
      </div>
    </main>
  );
}
