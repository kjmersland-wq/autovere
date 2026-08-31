import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  Car,
  Copy,
  CreditCard,
  Download,
  HelpCircle,
  LayoutGrid,
  LifeBuoy,
  Lock,
  MapPin,
  Navigation,
  Pencil,
  Plus,
  Printer,
  Route as RouteIcon,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdmin } from "@/hooks/useAdmin";
import { useGarageText } from "@/lib/garage-i18n";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/lib/auth";
import { CURRENCIES, useCurrency } from "@/lib/currency";
import {
  FUEL_LABEL,
  TOLL_TAGS,
  VEHICLE_META,
  duplicateTrip,
  googleMapsUrl,
  loadTrips,
  loadVehicles,
  newId,
  persistTrips,
  printTripSummary,
  saveVehicles,
  tripGpx,
  wazeUrl,
  type GarageVehicle,
  type SavedTrip,
  type VehicleKind,
} from "@/lib/garage";

const EMPTY_VEHICLE: GarageVehicle = {
  id: "",
  kind: "car",
  name: "",
  fuel: "petrol",
  tank: "",
  consumption: "",
  height: "",
  tags: [],
};

const VEHICLE_NO: Record<VehicleKind, string> = {
  car: t("Bil"),
  motorhome: t("Bobil"),
  motorcycle: t("Motorsykkel"),
};

const FUEL_NO: Record<keyof typeof FUEL_LABEL, string> = {
  petrol: t("⛽ Bensin"),
  diesel: t("🛢️ Diesel"),
  ev: t("⚡ Elektrisk (EV)"),
};

type SectionId =
  | "overview"
  | "trips"
  | "vehicles"
  | "settings"
  | "billing"
  | "places"
  | "profile"
  | "admin"
  | "support";

type SavedPlace = { id: string; name: string; note: string };

const PLACES_KEY = "autovere.savedPlaces";
const SETTINGS_KEY = "autovere.accountSettings";

export function GaragePage() {
  const { user, openAuth, signOut } = useAuth();
  const { t, isNo } = useGarageText();
  const { isAdmin } = useAdmin();
  const { tier, isActive } = useSubscription();
  const { currency, setCurrency } = useCurrency();

  const [section, setSection] = useState<SectionId>("overview");
  const [vehicles, setVehicles] = useState<GarageVehicle[]>([]);
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [draft, setDraft] = useState<GarageVehicle | null>(null);
  const [renaming, setRenaming] = useState<SavedTrip | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [placeDraft, setPlaceDraft] = useState<SavedPlace | null>(null);
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    setVehicles(loadVehicles());
    setTrips(loadTrips());
    try {
      const raw = localStorage.getItem(PLACES_KEY);
      if (raw) setPlaces(JSON.parse(raw) as SavedPlace[]);
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) {
        const parsed = JSON.parse(s) as { units?: "metric" | "imperial"; displayName?: string };
        if (parsed.units) setUnits(parsed.units);
        if (parsed.displayName) setDisplayName(parsed.displayName);
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    if (!displayName && user) {
      const meta = (user.user_metadata ?? {}) as { full_name?: string; name?: string };
      setDisplayName(meta.full_name ?? meta.name ?? user.email?.split("@")[0] ?? "");
    }
  }, [user, displayName]);

  const planLabel = isAdmin
    ? t("AutoVere Pro — Admin")
    : tier === "fleet"
      ? "AutoVere Business"
      : tier === "pro"
        ? "AutoVere Pro"
        : "AutoVere Free";

  const nav = useMemo(
    () =>
      [
        { id: "overview" as const, label: t("Oversikt"), icon: LayoutGrid },
        { id: "trips" as const, label: t("Mine reiser"), icon: RouteIcon },
        { id: "vehicles" as const, label: t("Mine kjøretøy"), icon: Car },
        { id: "settings" as const, label: t("Innstillinger"), icon: SlidersHorizontal },
        { id: "billing" as const, label: t("Abonnement og fakturering"), icon: CreditCard },
        { id: "places" as const, label: t("Lagrede steder"), icon: Bookmark },
        { id: "profile" as const, label: t("Profil og sikkerhet"), icon: ShieldCheck },
        ...(isAdmin ? [{ id: "admin" as const, label: t("Admin"), icon: Lock }] : []),
        { id: "support" as const, label: t("Hjelp og support"), icon: LifeBuoy },
      ].filter(Boolean),
    [isAdmin],
  );

  const commitVehicles = (next: GarageVehicle[]) => {
    setVehicles(next);
    saveVehicles(next);
  };

  const commitTrips = (next: SavedTrip[]) => {
    setTrips(next);
    persistTrips(next);
  };

  const commitPlaces = (next: SavedPlace[]) => {
    setPlaces(next);
    try {
      localStorage.setItem(PLACES_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const submitDraft = () => {
    if (!draft) return;
    if (!draft.name.trim()) {
      toast.error(t("Gi kjøretøyet et navn så du kjenner det igjen."));
      return;
    }
    const exists = vehicles.some((v) => v.id === draft.id);
    commitVehicles(
      exists ? vehicles.map((v) => (v.id === draft.id ? draft : v)) : [...vehicles, { ...draft, id: newId() }],
    );
    toast.success(exists ? t("Kjøretøyet er oppdatert.") : t("Kjøretøyet er lagt til i garasjen."));
    setDraft(null);
  };

  const removeVehicle = (id: string) => {
    commitVehicles(vehicles.filter((v) => v.id !== id));
    toast.success(t("Kjøretøyet er fjernet."));
  };

  const downloadGpx = (trip: SavedTrip) => {
    const blob = new Blob([tripGpx(trip)], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `autovere-${trip.name.toLowerCase().replace(/\W+/g, "-")}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("GPX eksportert — last den rett inn i navigasjonen."));
  };

  const duplicate = (trip: SavedTrip) => {
    commitTrips([duplicateTrip(trip), ...trips]);
    toast.success(t("Turen er duplisert."));
  };

  const submitRename = () => {
    if (!renaming) return;
    const name = renameValue.trim();
    if (!name) {
      toast.error(t("Gi turen et navn du kjenner igjen."));
      return;
    }
    commitTrips(trips.map((t) => (t.id === renaming.id ? { ...t, name } : t)));
    setRenaming(null);
    toast.success(t("Turen er omdøpt."));
  };

  const deleteTrip = (id: string) => {
    commitTrips(trips.filter((t) => t.id !== id));
    toast.success(t("Turen er fjernet fra garasjen."));
  };

  const printTrip = (trip: SavedTrip) => {
    if (!printTripSummary(trip)) toast.error(t("Tillat popup-vinduer for å skrive ut reiseoversikten."));
  };

  const toggleTag = (tag: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      tags: draft.tags.includes(tag) ? draft.tags.filter((t) => t !== tag) : [...draft.tags, tag],
    });
  };

  const saveSettings = () => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ units, displayName }));
    } catch {
      /* storage unavailable */
    }
    toast.success(t("Innstillingene er lagret."));
  };

  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify({ profil: { displayName, epost: user?.email ?? null }, vehicles, trips, places }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "autovere-mine-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("Dataene dine er lastet ned."));
  };

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">AutoVere</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("Velkommen tilbake")}{displayName ? `, ${displayName}` : ""}.
        </h1>
        <p className="mt-4 max-w-2xl text-foreground/75">
          {t("Kjøretøyene dine, reisene og alt abonnementet ditt låser opp — samlet på ett sted.")}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-[16rem_1fr]">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => {
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

          <div className="min-w-0 space-y-6">
            {section === "overview" && (
              <>
                <div className="glass-panel rounded-2xl p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                        {planLabel}
                      </span>
                      <h2 className="mt-3 text-xl font-semibold tracking-tight">
                        {displayName || user?.email || t("Gjest")}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {user ? (isAdmin || isActive ? t("Aktivt") : t("Free-konto")) : t("Ikke innlogget")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {isAdmin && (
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/admin">
                            <Lock className="size-4" /> {t("Admin")}
                          </Link>
                        </Button>
                      )}
                      {user ? (
                        <Button variant="ghost" size="sm" onClick={() => void signOut()}>
                          {t("Logg ut")}
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => openAuth("signin")}>
                          {t("Logg inn")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Stat label={t("Lagrede reiser")} value={String(trips.length)} />
                  <Stat label={t("Kjøretøy")} value={String(vehicles.length)} />
                  <Stat label={t("Lagrede steder")} value={String(places.length)} />
                </div>

                <div className="glass-panel rounded-2xl p-6">
                  <h3 className="text-lg font-semibold tracking-tight">{t("Dette låser abonnementet ditt opp")}</h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      ["Smart drivstoff og lading", t("Finn stopp basert på kjøretøy, rute og forbruk.")],
                      ["Bom, vignetter og ferjer", t("Full oversikt over kostnader før du kjører.")],
                      ["Bobil og camping", t("Tømmestasjoner, vann, overnatting og verksted.")],
                      ["Veiarbeid og hendelser", t("Se stengninger og omkjøringer som påvirker turen.")],
                      ["Personlig kjøretøyprofil", t("Vi bruker dine data i hver beregning.")],
                      ["Tilgjengelig på alle språk", t("Hele AutoVere på ditt språk.")],
                    ].map(([title, body]) => (
                      <li key={title} className="rounded-xl border border-border bg-background/40 p-4">
                        <p className="text-sm font-semibold">{title}</p>
                        <p className="mt-1 text-sm text-foreground/70">{body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {section === "trips" && (
              <Panel title={t("Mine reiser")}>
                <div className="grid gap-4">
                  {trips.map((t) => (
                    <article key={t.id} className="rounded-xl border border-border bg-background/40 p-5">
                      <h3 className="font-semibold tracking-tight">{t.name}</h3>
                      <p className="text-sm text-foreground/70">{t.detail}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{t.when}</p>
                      {(t.tolls !== undefined || t.energyCost !== undefined) && (
                        <dl className="mt-4 grid grid-cols-3 gap-3 rounded-xl border border-border bg-background/40 p-3 text-center">
                          <Cell label={t("Bom")} value={fmt(t.currency, t.tolls)} />
                          <Cell label={t("Ferjer")} value={fmt(t.currency, t.ferries)} />
                          <Cell label={t("Energi")} value={fmt(t.currency, t.energyCost)} />
                        </dl>
                      )}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => duplicate(t)}>
                          <Copy className="size-4" /> {t("Dupliser")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRenaming(t);
                            setRenameValue(t.name);
                          }}
                        >
                          <Pencil className="size-4" /> {t("Gi nytt navn")}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => printTrip(t)}>
                          <Printer className="size-4" /> {t("Skriv ut")}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => downloadGpx(t)}>
                          <Download className="size-4" /> {t("GPX")}
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={googleMapsUrl(t)} target="_blank" rel="noreferrer">
                            <MapPin className="size-4" /> {t("Google Maps")}
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={wazeUrl(t)} target="_blank" rel="noreferrer">
                            <Navigation className="size-4" /> {t("Waze")}
                          </a>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteTrip(t.id)}>
                          <Trash2 className="size-4" /> {t("Slett")}
                        </Button>
                      </div>
                    </article>
                  ))}
                  {trips.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      {t("Ingen lagrede reiser ennå — planlegg en tur og trykk «Lagre i Min garasje».")}
                    </p>
                  )}
                </div>
              </Panel>
            )}

            {section === "vehicles" && (
              <Panel
                title={t("Mine kjøretøy")}
                action={
                  <Button size="sm" onClick={() => setDraft({ ...EMPTY_VEHICLE, id: "" })}>
                    <Plus className="size-4" /> {t("Legg til kjøretøy")}
                  </Button>
                }
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  {vehicles.map((v) => (
                    <article key={v.id} className="flex gap-4 rounded-xl border border-border bg-background/40 p-5">
                      <span className="text-3xl">{VEHICLE_META[v.kind].emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold tracking-tight">{v.name}</h3>
                            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                              {t(VEHICLE_NO[v.kind])}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => setDraft(v)} aria-label={t("Rediger kjøretøy")}>
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeVehicle(v.id)}
                              aria-label={t("Slett kjøretøy")}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-foreground/70">
                          {t(FUEL_NO[v.fuel])}
                          {v.tank ? ` · ${v.tank}` : ""}
                          {v.consumption ? ` · ${v.consumption}` : ""}
                          {v.height ? ` · ${v.height}` : ""}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {v.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary"
                            >
                              {t}
                            </span>
                          ))}
                          {v.tags.length === 0 && (
                            <span className="text-xs text-muted-foreground">{t("Ingen bombrikker koblet ennå")}</span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </Panel>
            )}

            {section === "settings" && (
              <Panel title={t("Innstillinger")}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="set-currency">{t("Valuta")}</Label>
                    <select
                      id="set-currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as typeof currency)}
                      className="h-10 rounded-lg border border-border bg-background/60 px-3 text-sm"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("Måleenheter")}</Label>
                    <div className="flex gap-2">
                      {(
                        [
                          ["metric", t("Metrisk (km, liter)")],
                          ["imperial", t("Imperisk (miles, gallons)")],
                        ] as const
                      ).map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setUnits(id)}
                          className={`rounded-full border px-3 py-1.5 text-sm transition ${
                            units === id
                              ? "border-primary bg-primary/15 text-primary"
                              : "border-border text-foreground/75 hover:bg-background/60"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <Button className="mt-6" onClick={saveSettings}>
                  {t("Lagre innstillinger")}
                </Button>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t("Disse gjelder som standardvalgene dine i hele AutoVere.")}
                </p>
              </Panel>
            )}

            {section === "billing" && (
              <Panel title={t("Abonnement og fakturering")}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{t("Abonnement")}</p>
                    <p className="mt-1 font-semibold">{planLabel}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{t("Betalingsmetode")}</p>
                    <p className="mt-1 font-semibold">{t("Ingen betalingsmetode registrert.")}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm text-foreground/70">
                  {isAdmin
                    ? t("Dette er gratis admin-tilgang, så det er ingenting å administrere her.")
                    : t("Oppgrader når du vil — du kan alltid si opp fra denne siden.")}
                </p>
                {!isAdmin && (
                  <Button className="mt-4" asChild>
                    <Link to="/no/pricing">{t("Se abonnementene")}</Link>
                  </Button>
                )}
              </Panel>
            )}

            {section === "places" && (
              <Panel
                title={t("Lagrede steder")}
                action={
                  <Button size="sm" onClick={() => setPlaceDraft({ id: "", name: "", note: "" })}>
                    <Plus className="size-4" /> {t("Legg til sted")}
                  </Button>
                }
              >
                {places.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-10 text-center">
                    <Bookmark className="mx-auto size-6 text-muted-foreground" />
                    <p className="mt-3 font-semibold">{t("Ingen lagrede steder ennå")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("Lagre ladestasjoner, overnattinger og stopp du vil finne igjen.")}
                    </p>
                  </div>
                ) : (
                  <ul className="grid gap-3">
                    {places.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background/40 p-4"
                      >
                        <div>
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-sm text-foreground/70">{p.note}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={t("Slett sted")}
                          onClick={() => commitPlaces(places.filter((x) => x.id !== p.id))}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            )}

            {section === "profile" && (
              <Panel title={t("Profil og sikkerhet")}>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{t("E-post")}</p>
                <p className="mt-1 font-semibold">{user?.email ?? t("Ikke innlogget")}</p>

                <div className="mt-6 rounded-xl border border-border bg-background/40 p-5">
                  <p className="font-semibold">{t("Visningsnavn")}</p>
                  <p className="mt-1 text-sm text-foreground/70">
                    {t("Dette er navnet som vises på kontoen din — sett det til det du vil bli kalt.")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="max-w-xs"
                      placeholder={t("Ditt navn")}
                    />
                    <Button onClick={saveSettings}>{t("Lagre navn")}</Button>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-border bg-background/40 p-5">
                  <p className="font-semibold">{t("Eksporter dataene mine")}</p>
                  <p className="mt-1 text-sm text-foreground/70">
                    {t("Last ned en kopi av alt som er knyttet til kontoen din (profil, reiser, kjøretøy, steder).")}
                  </p>
                  <Button variant="outline" className="mt-3" onClick={exportData}>
                    <Download className="size-4" /> {t("Eksporter dataene mine")}
                  </Button>
                </div>
              </Panel>
            )}

            {section === "admin" && isAdmin && (
              <Panel title={t("Admin")}>
                <p className="text-sm text-foreground/70">
                  {t("Full oversikt over trafikk, abonnementer, markeder og økonomi.")}
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/admin">
                    <Lock className="size-4" /> {t("Åpne admin-panelet")}
                  </Link>
                </Button>
              </Panel>
            )}

            {section === "support" && (
              <>
                <Panel title={t("Hjelp og support")}>
                  <p className="text-sm text-foreground/70">{t("Vi er her hvis noe ikke fungerer som det skal.")}</p>
                </Panel>
                <Panel title={t("Ofte stilte spørsmål")}>
                  <p className="text-sm text-foreground/70">
                    {t("Svar på de vanligste spørsmålene om ruter, bompenger, vignetter og lading.")}
                  </p>
                  <Button className="mt-4" asChild>
                    <Link to="/no/faq">
                      <HelpCircle className="size-4" /> {t("Åpne hjelp og FAQ")}
                    </Link>
                  </Button>
                </Panel>
                <Panel title={t("Kontakt support")}>
                  <p className="text-sm text-foreground/70">
                    {t("Send oss en melding, så svarer vi deg — dette er også riktig sted å melde fra om et problem.")}
                  </p>
                  <Button className="mt-4" asChild>
                    <a href="mailto:support@autovere.com">{t("Send melding")}</a>
                  </Button>
                </Panel>
              </>
            )}
          </div>
        </div>
      </section>

      <Dialog open={renaming !== null} onOpenChange={(open) => !open && setRenaming(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("Gi turen nytt navn")}</DialogTitle>
            <DialogDescription>{t("Gi denne turen et navn som føles som veien foran deg.")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="trip-name">{t("Turnavn")}</Label>
            <Input
              id="trip-name"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder={t("Oslo → Lofoten midnattssol")}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenaming(null)}>
              {t("Avbryt")}
            </Button>
            <Button onClick={submitRename}>{t("Lagre navn")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={placeDraft !== null} onOpenChange={(open) => !open && setPlaceDraft(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("Legg til sted")}</DialogTitle>
            <DialogDescription>{t("Lagre et stopp du vil finne igjen på neste tur.")}</DialogDescription>
          </DialogHeader>
          {placeDraft && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="place-name">{t("Navn")}</Label>
                <Input
                  id="place-name"
                  value={placeDraft.name}
                  placeholder={t("Ionity Dombås")}
                  onChange={(e) => setPlaceDraft({ ...placeDraft, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="place-note">{t("Notat")}</Label>
                <Input
                  id="place-note"
                  value={placeDraft.note}
                  placeholder={t("Lynlading · kafé · døgnåpent")}
                  onChange={(e) => setPlaceDraft({ ...placeDraft, note: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPlaceDraft(null)}>
              {t("Avbryt")}
            </Button>
            <Button
              onClick={() => {
                if (!placeDraft?.name.trim()) {
                  toast.error(t("Gi stedet et navn."));
                  return;
                }
                commitPlaces([...places, { ...placeDraft, id: newId() }]);
                setPlaceDraft(null);
                toast.success(t("Stedet er lagret."));
              }}
            >
              {t("Lagre sted")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={draft !== null} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft?.id ? t("Rediger kjøretøy") : t("Legg til kjøretøy")}</DialogTitle>
            <DialogDescription>
              {t("Tankvolum, forbruk og bombrikker gjør hvert estimat skarpere.")}
            </DialogDescription>
          </DialogHeader>
          {draft && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>{t("Kjøretøytype")}</Label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(VEHICLE_META) as VehicleKind[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setDraft({ ...draft, kind: k })}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        draft.kind === k
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border text-foreground/75 hover:bg-background/60"
                      }`}
                    >
                      {VEHICLE_META[k].emoji} {t(VEHICLE_NO[k])}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="v-name">{t("Navn")}</Label>
                <Input
                  id="v-name"
                  value={draft.name}
                  placeholder={t("f.eks. BMW R 1250 GS Adventure")}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>{t("Drivstoff / energitype")}</Label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(FUEL_NO) as (keyof typeof FUEL_NO)[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setDraft({ ...draft, fuel: f })}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        draft.fuel === f
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border text-foreground/75 hover:bg-background/60"
                      }`}
                    >
                      {t(FUEL_NO[f])}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="v-tank">{draft.fuel === "ev" ? t("Batteristørrelse") : t("Tankvolum")}</Label>
                  <Input
                    id="v-tank"
                    value={draft.tank}
                    placeholder={draft.fuel === "ev" ? t("75 kWh") : t("60 L")}
                    onChange={(e) => setDraft({ ...draft, tank: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="v-cons">{t("Gjennomsnittsforbruk")}</Label>
                  <Input
                    id="v-cons"
                    value={draft.consumption}
                    placeholder={draft.fuel === "ev" ? t("18 kWh/100 km") : t("0,64 L/mil")}
                    onChange={(e) => setDraft({ ...draft, consumption: e.target.value })}
                  />
                </div>
              </div>
              {draft.kind === "motorhome" && (
                <div className="grid gap-2">
                  <Label htmlFor="v-height">{t("Høyde og vekt")}</Label>
                  <Input
                    id="v-height"
                    value={draft.height ?? ""}
                    placeholder={t("3,05 m · 3,5 t")}
                    onChange={(e) => setDraft({ ...draft, height: e.target.value })}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label>{t("Koblede bombrikker")}</Label>
                <div className="flex flex-wrap gap-2">
                  {TOLL_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        draft.tags.includes(tag)
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border text-foreground/70 hover:bg-background/60"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDraft(null)}>
              {t("Avbryt")}
            </Button>
            <Button onClick={submitDraft}>{t("Lagre kjøretøy")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-panel rounded-2xl p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold">{value}</dd>
    </div>
  );
}

function fmt(currency: string | undefined, value: number | undefined, locale = "en-US") {
  if (value === undefined) return "—";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency ?? "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value}`;
  }
}
