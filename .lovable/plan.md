# Norsk lokalisering av bil-innhold

## Hva det handler om
Sidene `/cars`, `/cars/:slug`, sammenligning og "match"-kortene henter all redaksjonell tekst fra dataobjekter — ikke fra i18n-filene. Derfor står `tagline`, `summary`, `lifestyle`, `personality`, `comfort`, `climate`, `practicality`, `ownership`, `strengths[]`, `tradeoffs[]`, `fit`, `tag` ("Best for cold climates"), pris-strenger, "AI Value Insight"-blokker, "Safety & Confidence"-prosa osv. på engelsk uansett språkvalg.

## Omfang
- **39 biler** i `src/data/cars.ts` — ~12 tekstfelt per bil
- `src/data/vehicle-intelligence.ts` (268 linjer) — "AI Value Insight", "Charging life", "Maintenance" osv.
- Hardkodede engelske etiketter i `PricingOwnership.tsx`, `SafetyOwnershipBlock.tsx`, `ContinueExploringSection.tsx`, `CarMediaSection.tsx`, `CarCard.tsx`
- Pris-strenger som `"from €78,000"`, `"560 km WLTP"`, `"Dual-motor AWD"` — strukturerbare, men i dag rene strenger

Til sammen ca. **500–600 unike strenger** som må eksistere i begge språk.

## Valgt arkitektur

### 1. Datatype-endring
Bytt strengfelter til `LocalizedString = string | { en: string; no: string }`. En `loc(value, lang)`-helper returnerer riktig språk og faller tilbake til EN hvis NO mangler. Dette unngår å bryte eksisterende kode — gamle strenger fortsetter å virke.

```ts
export type L = string | { en: string; no: string };
export const loc = (v: L, lang: "en" | "no") =>
  typeof v === "string" ? v : (v[lang] ?? v.en);
```

### 2. Bil-dataene
Hver bil får NO-versjoner for de 12 tekstfeltene + `tag` + `strengths[]` + `tradeoffs[]`. Pris/rekkevidde/drivverk får også NO-formatering (`"fra 850 000 kr"`, `"560 km WLTP"`, `"Tomotors AWD"`).

### 3. Komponenter
`CarDetail`, `CarCard`, `PricingOwnership`, `SafetyOwnershipBlock`, `ContinueExploringSection`, `CarMediaSection`, `Compare`, hub-sider — leser via `loc(...)` med språk fra `useTranslation().i18n.language`.

### 4. Hardkodede etiketter
Flyttes til `pages.car.*` i `en.ts` / `no.ts` (eyebrows, "AI Value Insight", "Charging life", "Maintenance", "Long-term confidence", "Comfort-to-price ratio", "Estimated pricing", "Safety & Confidence", "Pricing & Ownership", "Starting price · regional estimate · before incentives", osv.).

## Bølger (anbefalt rekkefølge)

**Bølge 1 — infrastruktur + topp 8 biler** (det brukerne ser oftest)
- Innfør `LocalizedString` + `loc()` helper
- Migrer `CarDetail`, `CarCard`, `PricingOwnership`, `SafetyOwnershipBlock`, `ContinueExploringSection`, `CarMediaSection` til å bruke helperen
- Oversett alle hardkodede UI-etiketter
- Oversett innhold for de 8 mest synlige bilene (Polestar 3, BMW i5, Volvo EX90, Tesla Model Y, Hyundai Ioniq 5, Kia EV6, Mercedes EQE, Audi Q6 e-tron)

**Bølge 2 — resterende 31 biler** + `vehicle-intelligence.ts` + Compare-side

**Bølge 3 — `ev-models.ts`, `ev-markets.ts`, `articles.ts` redaksjonelle tekster** (hvis disse også skal være tospråklige)

## Tone
"Jeremy Miner"-stilen vi har brukt ellers — direkte, menneskelig, ikke kald markedsføring. Eksempler:
- EN: *"The Polestar 3 doesn't try to impress you — it tries to settle you."*
- NO: *"Polestar 3 prøver ikke å imponere deg — den prøver å roe deg ned."*

## Tekniske notater
- Ingen brytende endringer: `loc()` på en ren streng returnerer samme streng, så data som ennå ikke er lokalisert fortsetter å vises på EN inntil oversatt.
- JSON-LD/SEO-felter på bil-detaljsiden lokaliseres også (description, breadcrumbs).
- Tall, valuta og enheter formateres språk-bevisst der det gir mening (kr vs €), men startpris kan beholdes som forfattet streng for enkelhets skyld i denne runden.

## Spørsmål før jeg starter
1. **Skal jeg kjøre alle tre bølgene i ett**, eller stoppe etter Bølge 1 så du kan se resultatet på Polestar 3 / BMW i5 / Volvo EX90 før vi ruller ut til resten?
2. **Pris-formatering**: beholde `€78,000` på begge språk, eller konvertere til `850 000 kr` på NO?
