# Europeisk EV-ruteplanlegger

Eksisterende `/ev/route-planner` har bare hardkodede eksempler. Bygges om til en ekte planlegger som funker mellom hvilke som helst byer i Europa.

## Hva brukeren får

- Skriv inn **fra** og **til** (alle europeiske byer/adresser, autocomplete)
- Velg avreisetidspunkt og EV-modell (eller skriv inn rekkevidde + forbruk selv)
- Resultat:
  - Total distanse, kjøretid, ladetid, **ankomsttidspunkt**
  - Liste over **ladestopp** (omtrentlig posisjon, ladetid, kWh, kostnad)
  - **Total ladekostnad** (€)
  - **Sammenligning mot bensin/diesel-bil** (forbruk + drivstoffpris per land)
  - **Bompenger** estimert per land, med EV-rabatt der det gjelder (NO, FR, AT, ES osv.)
  - **Totalpris** for turen (lading + bom)
  - Besparelse vs ICE-bil
- Kart som viser ruten og ladestopp

## Datakilder (gratis, ingen API-nøkkel)

- **Geocoding/autocomplete**: Photon (`photon.komoot.io`) — CORS-vennlig, gratis
- **Ruteberegning**: OSRM (`router.project-osrm.org`) — gratis, returnerer distanse, kjøretid, geometri
- **Land-deteksjon for bom/drivstoff**: reverse geocoding på rutepunkter

## Kostnadsmodell (innebygde defaults, kan overstyres)

- EV: 18 kWh/100km, 350 km rekkevidde, lade fra 15→80 % på 25 min, €0.45/kWh
- ICE: 6.5 L/100km, €1.85/L diesel
- Bom per land (€/100 km motorvei, EV-faktor):
  - NO: €0.12, EV 0.5×
  - FR: €9.50, EV 1.0×  (autoroute)
  - IT: €7.00, EV 1.0×
  - ES: €8.00, EV 1.0×
  - AT: €0.10/km vignett, EV 1.0×
  - PT: €6.50, EV 0.75×
  - DE/SE/DK/NL/BE/CH/FI: €0 personbil
- Antall ladestopp = `floor(distanse / brukbar_rekkevidde)`, energi per stopp = `(SoC_diff/100) × batteri`

Tallene er åpenlyst estimater og merkes tydelig i UI som "estimert".

## Filer

```text
src/components/RoutePlanner.tsx         (ny — hele interaktiv UI + logikk + kart)
src/lib/route-cost.ts                   (ny — kostnadsmodell, bom-tabell)
src/pages/ev/EVRoutePlanner.tsx         (skriv om — bruker ny komponent, fjerner hardkodede eksempler)
src/pages/ev/EVCharging.tsx             (legg til CTA-kort øverst som lenker til ruteplanleggeren)
src/components/EuropeChargingMap.tsx    (legg til "Planlegg rute"-knapp i filterlinjen)
```

Ruteplanleggeren plasseres på sin egen side `/ev/route-planner` (eksisterende rute) og får tydelige inngangspunkter fra **/ev/networks** (der brukeren er nå) og **/ev/charging**.

## Tekniske detaljer

- Bruker `react-leaflet` (allerede installert) til å rendre rute-polylinje + stopp-markører
- Photon autocomplete med 250ms debounce, viser by + land
- OSRM call: `https://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=full&geometries=geojson`
- Ladestopp plasseres jevnt langs polylinjen (geometrisk interpolering på rutekoordinatene); reverse-geocodes ikke per stopp (for fart) — viser bare "Stopp N · ~km X"
- Bom estimeres ved å sample 5–10 punkter langs ruten, reverse-geocode landkode, summere distanse per land × bomtariff
- Alle kostnader vises i € (forenklet, kan utvides senere)
- Resultater lagres i URL query-string så ruter kan deles

## Ut av scope (forenklinger)

- Ingen sanntids strømpriser per stasjon — bruker gjennomsnittstariff
- Ingen reell ladestasjon-matching (bare estimerte stopp langs ruten); kart-laget med ekte stasjoner finnes allerede på `/ev/networks`
- Ingen været/temperatur-justering i v1
- Ingen multi-waypoint i v1 (kun A→B)
