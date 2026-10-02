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

## Status 25.09 – hva som er bygd

| Punkt | Status |
|---|---|
| 2a Norske rutesider | **Gjort:** 14 norske sider (7 nye: Bergen–Stavanger, Bergen–Voss, Stavanger–Sirdal, Trondheim–Ålesund, Oslo–Lillehammer, Oslo–Røros, Oslo–Ålesund). Utland (Göteborg, Hirtshals, Alpene) ikke gjort, se under. |
| 2b Hyttekalkulator | **Gjort** på alle norske rutesider: turer i året × bom + drivstoff/strøm, bensin eller elbil |
| 2c AutoPASS-sparing på ferje | **Ikke gjort:** rabatten varierer per ferjeselskap, og jeg fant ingen kilde jeg kan stå inne for |
| 2d Elbil som standard på /no | **Gjort** (med feilretting: elbil brukte tidligere bensinforbruket 7,4 som kWh, og undervurderte lading med ca. 60 %) |
| 3a Delebilde med pris | **Delvis:** hver rute har eget bilde med prisspenn (`public/og/routes`). Bilde med den *enkelte* turens pris kan ikke lages uten at hele beregningsmotoren kjører på serveren |
| 3b Splitt regningen | **Gjort** (pris per person følger med delingen) |
| 3c WhatsApp og SMS | **Gjort** (egne knapper, teksten inneholder pris per person) |
| 4a «Hva kostet det egentlig?» | **Første versjon:** feltet «Kjørt denne turen?» på resultatet sender faktisk bom og beregnet bom som hendelse `actual_cost_submitted` |
| 4b Kostnadsindeks | **Første versjon:** side `/cost-index` med de 14 norske rutene rangert etter bom per 100 km. Pressemelding og utvalg av ruter bestemmer dere |
| 4c Ferske data | **Gjort:** «bomdata kontrollert 13. sep. 2026» under totalen, og «Verifisert / Estimert» per land |
| 5 Partnerboks | **Gjort:** `/embed`, se [PARTNERBOKS.md](PARTNERBOKS.md) |
| 6 Reiseregning | **Gjort:** CSV med én linje per bomstasjon/ferje og totaler (eksportpanelet) |
| 7 Åpent pris-API | **Gjort:** `/api/public/costs`, nevnt i llms.txt |
| 11b Kr per km, prisspenn, kilde/dato, landsmerke | **Gjort** |
| 11c Tur/retur | Fantes allerede («Tur-retur / ferie») |
| 11c Sammenligning av tre ruter | Fantes allerede (tre rader øverst på resultatet) |
| 11c Dagsplan | **Gjort** for turer over 6 timer: jevn deling i dager, hver dag ender nær et ekte punkt på ruten (ikke overnattingssteder) |
| 11c Offline (PWA) | **Ikke gjort:** manifest og ikon finnes, men servicearbeider kan gi gamle bomsatser i cache. Bør vurderes sammen med endringslogg |
| 1a–1c Stripe, sesongpass, gavekort | **Ikke gjort:** krever produkter og priser i Stripe (din beslutning) |
| 11d Hvitmerket dossier | **Gjort:** legg `?logo=https://…&brand=Navn` på adressen, så får utskriften partnerens logo og navn |

Andre feil rettet underveis: KML-eksporten lagde falske koordinater i Sveits (nå ekte rute), engelsk tekst på norsk resultatside (tre linjer, nå én linje på riktig språk), og ruteberegning som hang i 45 sekunder når stedsoppslaget (Photon) var nede (nå pause i 6 sekunder og reserve).

SoMe-innhold på engelsk: [SOME-EN.md](SOME-EN.md).

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

---

## 11. Fra presentasjonen (03.09) og benchmarken (02.09)

Begge filene er lest i sin helhet og sammenlignet med koden. Her er det som ikke var i planen, og det som må rettes før noen andre får se dem.

### 11a. Rett dette før filene deles [deg]

- **Benchmarken rangerer AutoVere som nr. 1 (8.8), men den er skrevet av oss, og AutoVere er selv en av de vurderte.** Rapporten sier selv at poengene er «provisional». Ikke bruk «nr. 1» utad før en uavhengig test er gjort. Bruk heller tallene under.
- **Den reelle konkurrenten er Trip Cost Calculator**: gratis, uten konto, 30+ land og 30+ språk. Vi kan ikke selge «finnes ikke noe annet». Vi må vinne på det den ikke har: norske bomstasjoner, ferjer, elbilrabatt og bobil.
- **Rovee** (bobil, Europa) lanserte 10.09.2026. Det er direkte konkurranse på bobilsegmentet i planen (punkt 2).
- **Presentasjonen har utdaterte påstander:** «11 språk» (nå 14), «75 % rekkeviddebuffer» (Grok fant både 25 % og 75 %, sjekk hva motoren faktisk bruker), «Google Places» (vi bruker Photon), «Fleet fra 29 €», «€49/år» (benchmarken) mot 39 € i dag. Rett tallene i begge dokumentene.
- **Prisnivå mot markedet:** Furkot 14 $/år, Rovee 18–30 €/år, Roadtrippers 36–60 $/år, TollGuru 199 $/år, Trip Cost Calculator gratis. Vår Pro på 490 kr/år ligger midt i feltet og Trip Pass på 79 kr er billig. Konklusjon: ikke øk prisene. Sesongpass (1b) er riktig grep.

### 11b. Hoppet i tillit (lite kode, stor effekt) [kode]

Presentasjonen peker på dette som viktigste punkt, og det er ikke bygd:

1. **Kilde og dato per kostnadslinje:** «Bom: Fjellinjen/NVDB, kontrollert 12.09.2026». Bruk `updatedAt` som allerede ligger i bomdataene, ellers en felles konstant. En liten grå linje, ikke en tabell.
2. **Konfidensnivå per land:** Verifisert / Estimert / Snitt som ett lite merke ved landet. Norge = Verifisert (NVDB). Land uten live-data = Estimert.
3. **Prisspenn i stedet for ett tall** (f.eks. «1 240–1 380 kr»). Behold ett stort tall øverst, og vis spennet som liten tekst under. Grunnlag: drivstoffpris ±, bom med og uten AutoPASS-rabatt.
4. **Kroner per kilometer** («2,45 kr/km») ved siden av totalen. Presentasjonen vil at AutoVere skal eie «reell kostnad per km». Tallet finnes allerede (total ÷ distanse), så dette er én linje.
5. **Offentlig endringslogg** («Bomsatser endret 01.10: E18 Vestfold …»). Kilde til pressesaker og lenker. Start manuelt, automatiser senere.

### 11c. Bruk det som allerede er bygd [kode]

- **Tre ruter side om side** finnes som rutevalg. Gjør dem til én sammenligning på tre linjer (tid, bom, total) øverst på resultatet. Det er «aha»-øyeblikket presentasjonen ber om.
- **Dagsplan for lange turer:** «Dag 1: Oslo → Hemsedal (3 t 20 min). Dag 2: …» kun når turen er over ca. 6 timer. Skal ikke vises for korte turer (less is more).
- **Retur/rundtur** med ett valg («Tur/retur»), spesielt viktig for hytteturer og vignettperioder utenfor Norge.
- **Innebygd kostnadsboks (widget)** for bloggere, campingplasser og foreninger: én `<iframe>`-linje. Dette er samme boks som i partnerplanen (punkt 5). Bygg den én gang.
- **Offline (PWA):** manifest og ikon er på plass. Mangler servicearbeider som mellomlagrer siste beregnede tur, slik at den virker på fjellet uten dekning.

### 11d. Forretning: B2B foran B2C [deg + kode]

Presentasjonen mener flåte/utleie er den mest lønnsomme inntekten, og at dagens Business-pris er for lav. Jeg er enig i retningen, men ikke i tallene før noen har betalt:

- **Ikke sett opp prisen på Business før første kunde har sagt ja.** Ring 5 bobil- og bilutleiere i stedet, og spør hva de ville betalt for kostnadsestimat i bookingen og hvitmerket A4-ark med eget logo.
- **Hvitmerket dossier** er nesten ferdig (PDF finnes). Mangler bare logo-felt per partner.
- **Offisielt samarbeid med bomselskapene** (Fjellinjen, AutoPASS, ASFINAG): en henvisning fra én av dem er verdt mer enn all SEO. Send én kort e-post per selskap med lenken til rutesiden og datakilden.
- **Affiliate bare på det ærlige:** ferje, forsikring, bobilutleie. Aldri bom. Dette står allerede i planen (punkt 5), og presentasjonen støtter det.

### 11e. Det jeg ikke anbefaler fra filene

- **«Topp 2 000 ruter per språk»** (programmatisk SEO): for tidlig og risikabelt. Tynne, like sider straffes av Google. Hold deg til 20–30 norske ruter med ekte tall (punkt 2a), og utvid først når disse får trafikk.
- **Flere land (Australia, Øst-Europa), infotainment, forsikring/leasing, «referansekilde for bomdata»:** samme svar som i punkt 8. Norge først.
- **Sanntids drivstoff for flere land:** bra på sikt, men Norge har ingen åpen pris-API. Bruk i stedet SSB/snitt med tydelig merking (11b-2).

### 11f. Prioritert rekkefølge for kode

| # | Hva | Størrelse | Effekt |
|---|---|---|---|
| 1 | Kr/km og «sist kontrollert»-linje (11b-1, 11b-4) | liten | tillit, deling |
| 2 | Konfidensmerke per land (11b-2) | liten | tillit |
| 3 | Sammenligning av tre ruter på tre linjer (11c) | liten–middels | «aha» |
| 4 | Tur/retur (11c) | middels | hytteturer, vignett |
| 5 | Innebygd boks (11c) | middels | distribusjon, lenker |
| 6 | Prisspenn (11b-3) | middels | ærlighet |
| 7 | Dagsplan på lange turer (11c) | middels | verdi for bobil |
| 8 | Servicearbeider, offline (11c) | middels | fjellturer |
| 9 | Hvitmerket dossier (11d) | middels | B2B |

Punkt 1–3 kan gjøres i én runde uten å legge til noe nytt på skjermen. Det er én linje og ett merke, resten er tydeligere pakking av det som finnes.
