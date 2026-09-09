import type { RegionKey } from "@/lib/trip-data";

/**
 * Central, data-driven registry of AutoVere regions.
 *
 * Adding a future destination (Japan, China, India, …) is a matter of adding
 * one entry here — no JSX or layout changes required. Entries with
 * `status: "soon"` render as non-interactive "Coming soon" rows.
 */
export type MacroRegionId = "north-america" | "europe" | "asia-pacific";

export type RegionEntry = {
  /** Routing key — must exist in RegionKey for live regions. */
  key: RegionKey | string;
  /** Short code tag shown in the trigger and menu, e.g. "US". */
  code: string;
  /** Full display name, e.g. "United States". */
  name: string;
  flag: string;
  macro: MacroRegionId;
  status: "live" | "soon";
};

export const MACRO_REGIONS: { id: MacroRegionId; label: string }[] = [
  { id: "europe", label: "Europe" },
  { id: "north-america", label: "North America" },
  { id: "asia-pacific", label: "Asia-Pacific" },
];

export const REGION_ENTRIES: RegionEntry[] = [
  { key: "eu", code: "EU", name: "Europe", flag: "🇪🇺", macro: "europe", status: "live" },
  { key: "us", code: "US", name: "United States", flag: "🇺🇸", macro: "north-america", status: "live" },
  { key: "ca", code: "CA", name: "Canada", flag: "🇨🇦", macro: "north-america", status: "live" },
];

export function regionEntry(key: string): RegionEntry | undefined {
  return REGION_ENTRIES.find((r) => r.key === key);
}

/** Macro groups that actually contain entries, in display order. */
export function groupedRegions(): { id: MacroRegionId; label: string; items: RegionEntry[] }[] {
  return MACRO_REGIONS.map((m) => ({
    ...m,
    items: REGION_ENTRIES.filter((r) => r.macro === m.id),
  })).filter((g) => g.items.length > 0);
}
