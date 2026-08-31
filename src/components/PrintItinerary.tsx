import { Printer, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CURRENCY_BY_CODE, nativeCurrencyFor, useMoney, useCurrency, RATES_UPDATED, rateNote } from "@/lib/currency";
import type { FuelKey, TripEstimate, VehicleKey } from "@/lib/trip-data";

const VEHICLE_LABEL: Record<VehicleKey, string> = {
  car: "🚗 Passenger car",
  motorhome: "🚐 Motorhome / campervan",
  motorcycle: "🏍️ Touring motorcycle",
};

const FUEL_LABEL: Record<FuelKey, string> = {
  petrol: "⛽ Petrol",
  diesel: "🛢️ Diesel",
  electric: "⚡ Electric (EV)",
};

function consumptionFor(vehicle: VehicleKey, fuel: FuelKey) {
  if (fuel === "electric") {
    const kwh = vehicle === "motorhome" ? 28 : vehicle === "motorcycle" ? 12 : 18;
    return `${kwh} kWh / 100 km`;
  }
  const l = vehicle === "motorhome" ? 11.5 : vehicle === "motorcycle" ? 4.8 : 6.6;
  return `${l.toFixed(1)} L / 100 km`;
}

export function PrintItinerary({
  trip,
  origin,
  destination,
  vehicle,
  fuel,
  onClose,
}: {
  trip: TripEstimate;
  origin: string;
  destination: string;
  vehicle: VehicleKey;
  fuel: FuelKey;
  onClose: () => void;
}) {
  const m = useMoney(trip.currency);
  const { currency } = useCurrency();
  const display = CURRENCY_BY_CODE[currency];

  const title = `${origin || "Your start"} → ${destination || "Your destination"}`;
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const summary: [string, string][] = [
    ["Total trip budget", m.fmt(trip.budget, 0)],
    ["Distance", trip.distanceLabel],
    ["Driving time", trip.driveTime],
    ["Tolls & vignettes", m.fmt(trip.tolls)],
    [trip.energyLabel, `${m.fmt(trip.energyCost)} (${trip.energyAmount})`],
    ["Ferries & passes", m.fmt(trip.ferries)],
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 p-4 backdrop-blur-sm print:static print:overflow-visible print:bg-transparent print:p-0 print:backdrop-blur-none">
      <div className="print-sheet glass-panel mx-auto my-6 w-full max-w-3xl rounded-2xl p-6 sm:p-8">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Print preview
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.print()}>
              <Printer className="size-4" /> Send to printer / PDF
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              <X className="size-4" /> Close
            </Button>
          </div>
        </div>

        <header className="border-b border-border pb-5">
          <p className="text-lg font-semibold tracking-tight">
            Auto<span className="text-primary">Vere</span>
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-foreground/70">
            Turn-by-turn cost itinerary · Prepared {date} · All figures shown in {display.code} (
            {display.label})
          </p>
        </header>

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Vehicle profile
          </h2>
          <table className="print-table mt-3 w-full text-sm">
            <tbody>
              <tr>
                <th scope="row">Vehicle</th>
                <td>{VEHICLE_LABEL[vehicle]}</td>
              </tr>
              <tr>
                <th scope="row">Fuel / power</th>
                <td>{FUEL_LABEL[fuel]}</td>
              </tr>
              <tr>
                <th scope="row">Consumption</th>
                <td>{consumptionFor(vehicle, fuel)}</td>
              </tr>
              <tr>
                <th scope="row">Route profile</th>
                <td className="capitalize">{trip.variant} · {trip.tripType === "return" ? "Return trip" : "One-way"}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Summary metrics
          </h2>
          <table className="print-table mt-3 w-full text-sm">
            <tbody>
              {summary.map(([k, v]) => (
                <tr key={k}>
                  <th scope="row">{k}</th>
                  <td className="font-semibold">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Checkpoint-by-checkpoint costs
          </h2>
          <table className="print-table mt-3 w-full text-sm">
            <thead>
              <tr>
                <th scope="col" className="text-left">Country / checkpoint</th>
                <th scope="col" className="text-left">Detail</th>
                <th scope="col" className="text-right">Local</th>
                <th scope="col" className="text-right">{display.code}</th>
              </tr>
            </thead>
            <tbody>
              {trip.segments.map((segment) => (
                <>
                  <tr key={segment.country} className="print-section-row">
                    <td colSpan={3} className="font-semibold">{segment.country}</td>
                    <td className="text-right font-semibold">{m.fmt(segment.total)}</td>
                  </tr>
                  {segment.lines.map((line) => {
                    const nat = m.native(line.amount, segment.country);
                    return (
                      <tr key={`${segment.country}-${line.place}`}>
                        <td>{line.place}</td>
                        <td className="text-foreground/70">{line.detail}</td>
                        <td className="text-right">{nat.text}</td>
                        <td className="text-right font-medium">{m.fmt(line.amount)}</td>
                      </tr>
                    );
                  })}
                </>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted-foreground">
            Local column shows the currency actually charged at the barrier. {RATES_UPDATED}
          </p>
        </section>

        {trip.vignette && trip.vignette.items.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Vignettes required before departure
            </h2>
            <ul className="mt-3 grid gap-2 text-sm">
              {trip.vignette.items.map((v) => (
                <li key={v.code}>
                  <span className="font-medium">{v.flag} {v.country}</span> — {v.system}:{" "}
                  {v.exempt ? "Exempt" : `${v.currency}${v.cost.toFixed(2)} · ${v.recommendation}`}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Recommended fuel &amp; charging stops
          </h2>
          <ol className="mt-3 grid gap-2 text-sm">
            {trip.optimizer.stops.map((s, i) => (
              <li key={`${s.name}-${i}`}>
                <span className="font-medium">{i + 1}. {s.name}</span> — at {s.atLabel} · {s.power}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6 border-t border-border pt-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            🛡️ {trip.safety.title}
          </h2>
          <div className="mt-3 grid gap-4 text-sm">
            {trip.safety.sections.map((sec) => (
              <div key={sec.heading}>
                <p className="font-semibold">{sec.heading}</p>
                <ul className="mt-1 list-disc pl-5">
                  {sec.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
          AutoVere · autovere.com — indicative planning estimates. {rateNote(m.base, currency) || "Base currency shown."}
          {" "}Verify final prices with the official toll and ferry operators before travelling.
        </footer>
      </div>
    </div>
  );
}
