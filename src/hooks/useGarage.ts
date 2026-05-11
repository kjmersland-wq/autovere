import { useState, useCallback, useEffect, useMemo } from "react";
import type { GarageEntry, GarageSlot } from "@/data/ownership-tracking";
import { EV_MODELS } from "@/data/ev-models";
import { getVehicleIntelligence } from "@/data/vehicle-intelligence";
import { getSignalsForVehicle } from "@/data/automotive-signals";

const GARAGE_KEY = "autovere_garage_v1";

function load(): GarageEntry[] {
  try {
    const raw = localStorage.getItem(GARAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(entries: GarageEntry[]): void {
  try {
    localStorage.setItem(GARAGE_KEY, JSON.stringify(entries));
  } catch { /* degrade silently */ }
}

export interface EnrichedGarageEntry {
  entry: GarageEntry;
  model: (typeof EV_MODELS)[0] | null;
  intelligence: ReturnType<typeof getVehicleIntelligence>;
  signals: ReturnType<typeof getSignalsForVehicle>;
}

export function useGarage() {
  const [entries, setEntries] = useState<GarageEntry[]>(load);

  useEffect(() => persist(entries), [entries]);

  const addToGarage = useCallback((slug: string, slot: GarageSlot = "dream") => {
    setEntries((prev) => {
      if (prev.some((e) => e.slug === slug)) {
        return prev.map((e) => e.slug === slug ? { ...e, slot } : e);
      }
      return [...prev, { slug, slot, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeFromGarage = useCallback((slug: string) => {
    setEntries((prev) => prev.filter((e) => e.slug !== slug));
  }, []);

  const updateSlot = useCallback((slug: string, slot: GarageSlot) => {
    setEntries((prev) => prev.map((e) => e.slug === slug ? { ...e, slot } : e));
  }, []);

  const updateEntry = useCallback((slug: string, patch: Partial<GarageEntry>) => {
    setEntries((prev) => prev.map((e) => e.slug === slug ? { ...e, ...patch } : e));
  }, []);

  const isInGarage = useCallback((slug: string) => entries.some((e) => e.slug === slug), [entries]);
  const getSlot = useCallback((slug: string) => entries.find((e) => e.slug === slug)?.slot ?? null, [entries]);

  const enriched: EnrichedGarageEntry[] = useMemo(() =>
    entries.map((entry) => ({
      entry,
      model: EV_MODELS.find((m) => m.slug === entry.slug) ?? null,
      intelligence: getVehicleIntelligence(entry.slug),
      signals: getSignalsForVehicle(entry.slug),
    })),
    [entries]
  );

  const bySlot = useCallback(
    (slot: GarageSlot) => enriched.filter((e) => e.entry.slot === slot),
    [enriched]
  );

  return {
    entries,
    enriched,
    bySlot,
    addToGarage,
    removeFromGarage,
    updateSlot,
    updateEntry,
    isInGarage,
    getSlot,
    totalCount: entries.length,
    dreamCount: entries.filter((e) => e.slot === "dream").length,
    ownedCount: entries.filter((e) => e.slot === "owned").length,
    comparingCount: entries.filter((e) => e.slot === "comparing").length,
  };
}
