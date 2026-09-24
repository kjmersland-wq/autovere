# AutoVere – vekstplan (høst 2026 → sommer 2027)

Produktet virker. Denne planen handler om neste steg: flere besøkende, flere som betaler og bedre tillit.
Den bygger på Grok-rapporten (23.09), men tar bare med det som ikke allerede finnes.
Punkt merket **[kode]** kan bygges uten deg. **[deg]** betyr at du må gjøre det selv.

Kortversjon:

1. **Rydd betalingen først** (Stripe og pris). Uten det lekker alt annet.
2. **Eie Norge** før Europa: hyttetur, ferje, elbil og bobil. Her har konkurrentene lite.
3. **La hver tur reklamere for seg selv**: delelenke med pris i forhåndsvisningen, og «splitt regningen».
4. **Selg sesong, ikke abonnement**. Folk kjører på ferie noen uker i året, ikke hver måned.
5. **Tillit som motor**: faktisk kostnad mot estimat, publisert åpent.

---

## Det som allerede finnes (ikke bygg på nytt)

| Idé fra rapporten | Status i koden |
|---|---|
| Del / kopier turlenke | Finnes (Del-knapp på resultat, lenken inneholder ruten) |
| Rute-landingssider | 23 sider under `/routes/…`, hvorav 7 norske (Oslo–Bergen, –Trondheim, –Kristiansand, –Hemsedal, –Geilo, –Trysil, –Hafjell) |
| PDF / utskrift | Finnes (Skriv ut på resultat) |
| «Hva må jeg kjøpe før grensen» | Delvis: vignett- og grenseinfo, lavutslippssoner og bombrikker finnes som moduler |
| Partnerkit | Finnes (`/partners`, `public/partner-kit`, partnerdashboard) |
| llms.txt / strukturerte data | Finnes |

Det som mangler er å **pakke** dette tydeligere, ikke å lage det.

---

## 1. Penger først (uke 1–2)

### 1a. Stripe = skjerm [deg]
Betaling er på (`PURCHASES_ENABLED = true` i `src/lib/purchases.ts`). Checkout bruker Stripe-prisene som ligger i Lovable.
Når prisene i 1b er bestemt, legg dem inn i Stripe med én pris per valuta, så skjermen og kvitteringen alltid viser samme beløp.

- Bestem prisene (1b) før de legges inn i Stripe.
- Opprett hvert produkt med én grunnpris og `currency_options` for NOK, SEK, DKK, EUR, GBP, USD, CAD og PLN, med samme beløp som på skjermen.
- Behold oppslagsnøklene (`trip_pass`, `pro_yearly` …), så trenger koden ikke å endres.
- Test i testmodus før du endrer noe i live-modus.

Se også [HANDLINGSPLAN.md](HANDLINGSPLAN.md) punkt 2–3.

### 1b. Prisstrategi: forslag
Prisene er i dag satt per språk og henger ikke sammen (se STATUS). Forslag:

| | Trip Pass (14 d) | **Sesongpass (90 d) – nytt** | Pro / år | Business / mnd |
|---|---|---|---|---|
| Norge | 79 kr | **149 kr** | 490 kr | 199 kr |
| Sverige | 89 kr | 169 kr | 490 kr | 199 kr |
| Danmark | 59 kr | 109 kr | 349 kr | 139 kr |
| Euro | 7,99 € | 13,99 € | 39 € | 19 € |
| UK | £6.99 | £11.99 | £35 | £17 |
| USA | $8.99 | $14.99 | $49 | $24 |
| Polen | 34,99 zł | 59,99 zł | 169 zł | 79 zł |

- **Hvorfor sesongpass:** en feriebilist trenger AutoVere i juni–august, ikke hele året. Månedsabonnement på et ferieprodukt gir mye frafall og dårlig samvittighet hos kunden. 90 dager til omtrent dobbel Trip Pass-pris er lett å si ja til.
- **Pro-måned kan fjernes** for privatpersoner. Da blir stigen Gratis → Trip Pass → Sesong → År. Enklere tekst og færre Stripe-priser.
- **Norsk Pro 99 kr/mnd** forsvinner da naturlig, i stedet for å forklares.
- Uansett valg: én pris per valuta i Stripe (`currency_options`), samme tall som på skjermen.

### 1c. Gavekort [kode + deg]
«Gi bort en Trip Pass / et sesongpass»: en kode som løses inn i Garage. Passer til farsdag (november), jul og bursdag til bobil-foreldre. Det er lite kode (Stripe-betaling og en innløsningskode).

---

## 2. Eie Norge (uke 2–8)

Konkurrentene (TollGuru, ViaMichelin) er bygd for Frankrike og motorvei. Norge har bomringer, ferjer, elbilrabatt og hytter. Her kan AutoVere være best på kort tid.

### 2a. Norske rutesider [kode]
Tre norske sider er laget (24.09). Legg til flere, opp mot 20–30, med ferdig beregnede tall og «sist oppdatert»:

- **Langtur:** Oslo–Bergen, Oslo–Trondheim, Oslo–Kristiansand, Bergen–Stavanger, Trondheim–Ålesund, Oslo–Tromsø, Oslo–Nordkapp.
- **Hyttetur:** Oslo–Hemsedal, Oslo–Geilo, Oslo–Trysil, Oslo–Hafjell, Bergen–Voss, Stavanger–Sirdal.
- **Utland med bil:** Oslo–Göteborg, Oslo–Hirtshals (ferje), Oslo–Alpene, Oslo–Kroatia.

Nordmenn søker på «bompenger Oslo Bergen», «hva koster det å kjøre til Hemsedal» og «ferje Hirtshals pris bil». Hver side avsluttes med én knapp: «Beregn med din bil».

### 2b. Hyttekalkulator: årskostnaden [kode]
Tenk utenfor boksen: nordmenn kjører samme hyttetur 20–40 ganger i året.
«Hva koster hytta di i kjøring per år?» = (bom + ferje + drivstoff/strøm) × antall turer.

- Svaret er ofte sjokkerende (15–30 000 kr/år). Det er delbart og gir gode medieoppslag.
- Det er et naturlig **Pro-/årsprodukt**: lagre hytteruten og få varsel når bomsatser endres.
- Hyttesider og hyttefora (Hytteliv, Finn-annonser for hytter) er gratis distribusjon.

### 2c. Ferje og AutoPASS [kode]
Mange vet ikke at AutoPASS-avtale gir rabatt på ferje, og at elbil har egen rabatt i bomringer.
Vis det i resultatet: «Med AutoPASS for ferje ville du spart ca. X kr på denne turen.»
Det gir konkret verdi, bygger tillit og er en naturlig partnerinngang til ferjeselskaper og bompengeselskaper.

### 2d. Elbil som standard i Norge [kode]
Over 90 % av nye biler i Norge er elbil. På `/no` bør «Elbil» være forhåndsvalgt eller foreslått, med ladekostnad og elbilrabatt i bom.
Nå står «Bensin» først.

---

## 3. La hver tur reklamere for seg selv (uke 3–6)

### 3a. Forhåndsvisning med pris [kode]
Delvis gjort (24.09): en delt turlenke viser nå ruten i tittelen («Oslo → Bergen · AutoVere»). Neste steg er et bilde per tur:
**«Oslo → Bergen · ca. 1 127 kr · bom, ferje og drivstoff».**
Hver deling i Messenger, WhatsApp eller Facebook blir da en annonse med ekte tall. Dette kan lages på serveren (et bilde per rute, mellomlagret).

### 3b. Splitt regningen [kode] – første versjon laget (24.09): «Del på flere» viser pris per person
Tenk utenfor boksen: den som kjører, vil ha pengene tilbake.
- «Hvor mange er dere?» → «312 kr per person».
- Knapp: «Send til de andre» gir en ferdig melding med lenke: «Bergen-turen kostet 1 127 kr, din del er 282 kr (Vipps: …)».
- Hver mottaker ser AutoVere. Det er viralt i familier, vennegjenger og idrettslag som kjører til cup.

### 3c. Del direkte til WhatsApp og Messenger [kode]
Del-knappen bruker i dag telefonens dele-meny eller kopier lenke. Legg til egne WhatsApp- og SMS-knapper med ferdig tekst på brukerens språk.

---

## 4. Tillit som motor (løpende)

### 4a. «Hva kostet det egentlig?» [kode]
Når en lagret tur er ferdig kjørt, sendes et spørsmål i Garage eller på e-post: «Hvor mye betalte du i bom og ferje?»
- Svarene gir en treffprosent per land: «Vi treffer innen 6 % på bom i Norge.»
- Det er det sterkeste salgsargumentet som finnes, og ingen konkurrenter har det.
- Challenge blir da noe som foregår i produktet, ikke bare en søknadsside.

### 4b. AutoVere Kostnadsindeks [deg + kode]
20 faste ruter, samme bil, beregnet hver måned eller hvert kvartal. Publiseres som én side og én pressemelding.
Mulige vinkler:
- «Sommerferien til Italia har blitt 14 % dyrere i bom.»
- «Europas dyreste 100 km.»
- «Norges dyreste hyttevei.»

Norske medier (VG, NRK, Motor, Broom) tar gjerne slike tall i juni og før påske. Tallene kommer fra kalkulatoren, så kostnaden er nesten null.

### 4c. Vis at dataene er ferske [kode]
Vis en liten linje i resultatet: «Bomsatser sist kontrollert: 12.09.2026 (NVDB).» Det er ærlig og bygger tillit.
Kjøretiden var for høy: bryteren «naturskjønne ruter» sto på som standard og la 18 % på tiden uten å endre ruten. Den er nå av som standard (rettet 24.09).

---

## 5. Partnere: gi dem noe å bruke, ikke bare rabatt (uke 4–12)

Rabatt åpner døren, men partneren trenger noe å legge på sin egen side.

| Partner | Hva de får | Hva AutoVere får |
|---|---|---|
| **Campingplasser / hoteller / hyttegrender** | «Hva koster det å kjøre hit?»-boks på «Veibeskrivelse»-siden (ferdig mål) | Lenker, besøk, lokal SEO |
| **Arrangører** (cuper, festivaler, skirenn) | Samme boks med arrangementet som mål | Store topper av trafikk, delinger |
| **Norsk Bobilforening / caravanklubber** | Medlemsrabatt og bobil-sjekkliste (høyde, vekt, ferjelengde) | Den mest betalingsvillige målgruppen |
| **Bilutleie / bobilutleie** | Kostnadsestimat i bookingen | Business-kunde |
| **Ferjeselskaper** (Color Line, Fjord Line, DFDS) | Trafikk til booking | Provisjon (affiliate) |
| **Elbilforeningen** | Elbilkostnad med rabatter, sammenlignet med fossilbil | Troverdighet i Norges største bilgruppe |

**Boksen er det viktigste:** én linje kode som partneren limer inn. Hver installasjon gir en lenke tilbake til AutoVere. [kode]

**Inntekt utenom abonnement:** henvisningsprovisjon på ferje, camping (ACSI) og ladebrikker. AutoVere selger fortsatt ikke vignetter selv, bare lenker til de offisielle portalene.

---

## 6. Bedrift: reiseregning (uke 8+)

Norske bedrifter må dokumentere bom og ferje i reiseregninger.
**«Eksporter turen som reiseregningsvedlegg»:** en CSV/PDF med dato, strekning, km og bom/ferje per stasjon.
- Håndverkere, selgere og servicebiler kjører mye og hater kvitteringsjakt.
- Dette gjør Business-planen (199 kr/mnd) lett å selge, og regnskapsbyråer kan anbefale den.

---

## 7. AI-søk og agenter (lite arbeid, langsiktig)

Stadig flere spør ChatGPT eller Claude i stedet for Google.
- **Faste svar med tall:** de norske rutesidene (2a) blir kildene AI-søk siterer. Hold dem statiske og datert.
- **Åpent pris-API / MCP [kode]:** la AI-assistenter hente «hva koster Oslo–Bergen i bom» direkte fra AutoVere, med navn og lenke tilbake. Tidlig ute = kilden de bruker.

---

## 8. Ikke gjør nå

- Nye land eller regioner før Norge sitter.
- Mer i Garage før det finnes betalende Pro-brukere.
- Egen app. Nettsiden på mobil holder, og delelenker er bedre enn app-installasjon.
- Betalt annonsering før du vet hva én betalende kunde er verdt.

---

## 9. Mål: hvordan vi vet at det virker

Følg med i Admin → Produkthendelser. Sett tallene fra første uke som utgangspunkt:

| Mål | Hva det viser | Mål etter 90 dager |
|---|---|---|
| Beregninger per uke | Trafikk som faktisk bruker produktet | ×3 |
| Andel som deler / splitter | Viral motor | 5 % av beregninger |
| Klikk på Trip Pass → kjøp | Salgstrakt | 2–4 % av beregninger |
| Beregning feilet | Teknisk helse | under 2 % |
| Innsendte faktiske kostnader | Tillit | 50 turer |
| Partnerbokser installert | Distribusjon | 10 |

---

## 10. Rekkefølge

| Når | Du | Kode |
|---|---|---|
| **Uke 1–2** | Stripe-sjekk, testkjøp, prisbeslutning (1a–1b), sitemap | Sesongpass og prisjustering når du har bestemt |
| **Uke 3–4** | Kontakt 5 partnere (bobil, camping, elbilforening) | Norske rutesider (2a), elbil-standard (2d), bilde per tur (3a) |
| **Uke 5–8** | Del hytte- og rutelenker i grupper og fora | Hyttekalkulator (2b), splitt regningen (3b), partnerboks (5) |
| **Uke 9–12** | Pressemelding om kostnadsindeks (4b) | «Hva kostet det?» (4a), AutoPASS-sparing (2c) |
| **Før påske og juni 2027** | Medieutspill: «Så mye koster påskefjellet / sommerferien» | Oppdatert indeks, sesongpass i front |
| **Senere** | Bedriftssalg via regnskapsbyrå | Reiseregning-eksport (6), pris-API (7) |

Si fra hvilke kodepunkter du vil ha først, så bygges de i den rekkefølgen.
