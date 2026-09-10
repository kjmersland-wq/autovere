# Toll & road-charge data

How AutoVere prices tolls/vignettes per country, and how to add a new one.

## Two kinds of country

**Static countries** (most of them): a country's toll data is a curated table in
`../tolls.ts` (`VIGNETTES` for flat-fee vignette countries, `DISTANCE_TOLLS` for a rough
€/km average) plus an entry in `registry.ts` saying where that data came from and how much
to trust it (`accuracy`). `calc.ts`'s `estimate()` loop looks the country up in those tables
directly — there's no separate "provider" file for these, because there's no real logic beyond
"look up the number and attach a source".

**Live countries** (currently just Norway): a real per-route calculation against a live
official data source. These get their own module under `providers/`, wired into `calc.ts`
explicitly (see `norwayTollLine()` in `calc.ts`).

## Adding a static country

1. Add its price data to `VIGNETTES` or `DISTANCE_TOLLS` in `../tolls.ts`.
2. Add an entry to `TOLL_COUNTRY_REGISTRY` in `registry.ts` with the official source name/URL
   and an honest `accuracy` (`"medium"` for an official vignette price that isn't route-matched,
   `"low"` for a per-km average — never `"high"` unless the number is actually matched against
   real route data).
3. Done — `calc.ts` and the FAQ "data sources" table both pick it up automatically.

## Adding a live/route-matched country

Norway (`providers/norway.ts` + `api/tolls/norway.ts`) is the reference implementation:

1. A Vercel function (`api/tolls/<country>.ts`) fetches candidate toll points/segments for a
   bounding box from the official source and returns them **unfiltered** — matching against the
   actual route happens client-side so one fetch can be reused across all three route variants
   (fastest/bypass/tollfree) instead of re-fetching per variant.
2. A client module (`providers/<country>.ts`) does the route-matching (candidate points within
   some radius of the route polyline — see `MATCH_RADIUS_KM` in `providers/norway.ts` and its
   comment for why 100m and name-based de-duplication were chosen) and pricing, and exposes a
   fallback (`estimated<Country>Toll`) for when the fetch fails or nothing matched.
3. Wire it into `calc.ts` next to `norwayTollLine()`, following the same pattern: fetch candidates
   once in the route component (`{-$lang}.index.tsx`, alongside the existing charger/scenic
   fetches), pass them into `estimate()`, match per variant inside `calc.ts`.
4. Register it in `registry.ts` with `accuracy: "high"` — that's the whole point of doing the
   extra work of a live provider instead of a static table.

## Known limitations (honest, not hidden)

- No motorcycle/motorhome vehicle class yet — `VehicleType` is `petrol | diesel | ev`. NVDB
  exposes a "Takst stor bil" (large-vehicle) rate that a future motorhome class could use.
- Norway rush-hour rates are fetched and shown in the station breakdown/notes but not applied to
  the total — there's no departure-time input in the trip form yet.
- The Norway toll candidate cache (`api/tolls/norway.ts`) is in-memory only — it resets on a
  cold Vercel function start. Fine for now; a KV-backed cache would be the natural upgrade.
- Toll accuracy is only as good as the underlying route geometry. AutoVere routes via the public
  OSRM demo instance (`src/lib/geo.ts`), which has no Norway-specific tuning — for terrain with a
  clear "normal" route and a longer geometrically-shorter alternative (e.g. Oslo→Bergen: E16 vs.
  a Rv7/Rv13 mountain-pass path), OSRM can pick the atypical one, which changes which toll
  stations actually get crossed. This is a routing-quality issue, not a toll-matching bug.
