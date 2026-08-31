import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, MapPin, Navigation, Pencil, Plus, Trash2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {

  FUEL_LABEL,
  TOLL_TAGS,
  VEHICLE_META,
  googleMapsUrl,
  loadTrips,
  loadVehicles,
  newId,
  persistTrips,
  saveVehicles,
  tripGpx,
  wazeUrl,
  type GarageVehicle,
  type SavedTrip,
  type VehicleKind,
} from "@/lib/garage";

export const Route = createFileRoute("/garage")({
  head: () => ({
    meta: [
      { title: "My Garage & Trips — Vehicles, Tags and Saved Routes | AutoVere" },
      {
        name: "description",
        content:
          "Keep your cars, campervans and motorcycles, their tank capacities and toll tags, plus every saved itinerary ready for instant GPX download.",
      },
      { property: "og:title", content: "My Garage & Trips | AutoVere" },
      {
        property: "og:description",
        content: "Your vehicles, toll tags and saved adventures in one calm place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GaragePage,
});

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

function GaragePage() {
  const [vehicles, setVehicles] = useState<GarageVehicle[]>([]);
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [draft, setDraft] = useState<GarageVehicle | null>(null);

  useEffect(() => {
    setVehicles(loadVehicles());
    setTrips(loadTrips());
  }, []);

  const commitVehicles = (next: GarageVehicle[]) => {
    setVehicles(next);
    saveVehicles(next);
  };

  const submitDraft = () => {
    if (!draft) return;
    if (!draft.name.trim()) {
      toast.error("Give your vehicle a name so you can spot it later.");
      return;
    }
    const exists = vehicles.some((v) => v.id === draft.id);
    commitVehicles(
      exists
        ? vehicles.map((v) => (v.id === draft.id ? draft : v))
        : [...vehicles, { ...draft, id: newId() }],
    );
    toast.success(exists ? "Vehicle updated." : "Vehicle added to your garage.");
    setDraft(null);
  };

  const removeVehicle = (id: string) => {
    commitVehicles(vehicles.filter((v) => v.id !== id));
    toast.success("Vehicle removed.");
  };

  const downloadGpx = (trip: SavedTrip) => {
    const blob = new Blob([tripGpx(trip)], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `autovere-${trip.name.toLowerCase().replace(/\W+/g, "-")}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("GPX exported — load it straight into your sat-nav.");
  };

  const deleteTrip = (id: string) => {
    const next = trips.filter((t) => t.id !== id);
    setTrips(next);
    persistTrips(next);
    toast.success("Trip removed from your garage.");
  };

  const toggleTag = (tag: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      tags: draft.tags.includes(tag) ? draft.tags.filter((t) => t !== tag) : [...draft.tags, tag],
    });
  };

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          My Garage &amp; Trips
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Welcome back — your road is ready.
        </h1>
        <p className="mt-4 max-w-2xl text-foreground/75">
          Your vehicles, toll tags and every adventure you've costed, saved and ready to roll again.
        </p>

        <Tabs defaultValue="vehicles" className="mt-10">
          <TabsList className="bg-background/50">
            <TabsTrigger value="vehicles">🏍️ Vehicle garage</TabsTrigger>
            <TabsTrigger value="trips">🗺️ Saved trips</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-tight">My vehicle profiles</h2>
              <Button size="sm" onClick={() => setDraft({ ...EMPTY_VEHICLE, id: "" })}>
                <Plus className="size-4" /> Add vehicle
              </Button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {vehicles.map((v) => (
                <article key={v.id} className="glass-panel flex gap-4 rounded-2xl p-5">
                  <span className="text-3xl">{VEHICLE_META[v.kind].emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold tracking-tight">{v.name}</h3>
                        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          {VEHICLE_META[v.kind].label}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setDraft(v)} aria-label="Edit vehicle">
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeVehicle(v.id)}
                          aria-label="Delete vehicle"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-foreground/70">
                      {FUEL_LABEL[v.fuel]}
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
                        <span className="text-xs text-muted-foreground">No toll tags linked yet</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trips" className="mt-6">
            <h2 className="text-lg font-semibold tracking-tight">Saved adventures</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {trips.map((t) => (
                <article key={t.id} className="glass-panel rounded-2xl p-5">
                  <h3 className="font-semibold tracking-tight">{t.name}</h3>
                  <p className="text-sm text-foreground/70">{t.detail}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.when}</p>
                  {(t.tolls !== undefined || t.energyCost !== undefined) && (
                    <dl className="mt-4 grid grid-cols-3 gap-3 rounded-xl border border-border bg-background/40 p-3 text-center">
                      <div>
                        <dt className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">Tolls</dt>
                        <dd className="text-sm font-semibold">{fmt(t.currency, t.tolls)}</dd>
                      </div>
                      <div>
                        <dt className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">Ferries</dt>
                        <dd className="text-sm font-semibold">{fmt(t.currency, t.ferries)}</dd>
                      </div>
                      <div>
                        <dt className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">Energy</dt>
                        <dd className="text-sm font-semibold">{fmt(t.currency, t.energyCost)}</dd>
                      </div>
                    </dl>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => downloadGpx(t)}>
                      <Download className="size-4" /> GPX
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={googleMapsUrl(t)} target="_blank" rel="noreferrer">
                        <MapPin className="size-4" /> Google Maps
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={wazeUrl(t)} target="_blank" rel="noreferrer">
                        <Navigation className="size-4" /> Waze
                      </a>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteTrip(t.id)}>
                      <Trash2 className="size-4" /> Delete
                    </Button>
                  </div>
                </article>
              ))}
              {trips.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No saved trips yet — plan one and hit “Save to My Garage”.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <Dialog open={draft !== null} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Edit vehicle" : "Add a vehicle"}</DialogTitle>
            <DialogDescription>
              Tank size, consumption and toll tags make every estimate sharper.
            </DialogDescription>
          </DialogHeader>
          {draft && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Vehicle type</Label>
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
                      {VEHICLE_META[k].emoji} {VEHICLE_META[k].label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="v-name">Name</Label>
                <Input
                  id="v-name"
                  value={draft.name}
                  placeholder="e.g. BMW R 1250 GS Adventure"
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Fuel / power type</Label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(FUEL_LABEL) as (keyof typeof FUEL_LABEL)[]).map((f) => (
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
                      {FUEL_LABEL[f]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="v-tank">{draft.fuel === "ev" ? "Battery size" : "Tank capacity"}</Label>
                  <Input
                    id="v-tank"
                    value={draft.tank}
                    placeholder={draft.fuel === "ev" ? "75 kWh" : "60 L"}
                    onChange={(e) => setDraft({ ...draft, tank: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="v-cons">Average consumption</Label>
                  <Input
                    id="v-cons"
                    value={draft.consumption}
                    placeholder={draft.fuel === "ev" ? "18 kWh/100 km" : "6.4 L/100 km"}
                    onChange={(e) => setDraft({ ...draft, consumption: e.target.value })}
                  />
                </div>
              </div>
              {draft.kind === "motorhome" && (
                <div className="grid gap-2">
                  <Label htmlFor="v-height">Height &amp; weight</Label>
                  <Input
                    id="v-height"
                    value={draft.height ?? ""}
                    placeholder="3.05 m · 3.5 t"
                    onChange={(e) => setDraft({ ...draft, height: e.target.value })}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label>Linked electronic toll tags</Label>
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
              Cancel
            </Button>
            <Button onClick={submitDraft}>Save vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function fmt(currency: string | undefined, value: number | undefined) {
  if (value === undefined) return "—";
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency ?? "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value}`;
  }
}

