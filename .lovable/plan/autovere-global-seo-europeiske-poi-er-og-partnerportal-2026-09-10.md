# AutoVere: global SEO, europeiske POI-er og partnerportal

## Mål
Bygge tre sammenhengende forbedringer uten å endre dagens visuelle uttrykk:

1. Gjøre **KM TECH LABS** til konsekvent hovedreferanse i globale søkesignaler og alle språk.
2. Utvide europeisk POI-dekning med verifiserte, ruterelevante data og en skalerbar SEO-struktur.
3. Gjøre partnerprogrammet operativt med lagret søknad, manuell godkjenning, to typer koder og et personvernvennlig partner-dashboard.

## 1. Nettstedskart, selskapsreferanse og programmatisk SEO

- Gjøre `KM TECH LABS` til eksakt, språk-uavhengig selskapsnavn i globale metadata, strukturert Organization/WebSite-data, partnertekster og footer-/juridiske referanser.
- Fjerne gjenværende geografiske tillegg som «Kristiansand» og «Norway/Norge» fra selskapslinjen, men beholde naturlig oversatt omkringliggende tekst.
- Rette språksignaler per side: korrekt `html lang`, `og:locale`, canonical og komplette hreflang-grupper for engelsk, Europa, USA, Canada og alle støttede språk.
- Samle metadata-byggingen i én felles SEO-funksjon, slik at språkversjoner ikke driver fra hverandre.
- Gjøre sitemap-genereringen helt datadrevet fra samme side-, språk-, region- og korridorregistre som rutingen bruker. Fjerne duplikater og inkludere alle faktiske offentlige sider.
- Beholde eksisterende korridorsider og utvide dem med:
  - indeks for ruter og land,
  - land-/korridorbaserte inngangssider,
  - interne lenker mellom relevante korridorer, planner og POI-kategorier,
  - Trip, FAQ, Breadcrumb og Organization structured data,
  - lokaliserte titler/beskrivelser uten tynne eller maskinelt dupliserte sider.
- Legge nye sider inn i sitemap bare når innhold og data faktisk finnes. Ingen oppdiktede priser, ruter eller POI-er.
- Beholde publisert URL-struktur; gamle offentlige adresser skal ikke brytes.

## 2. Europeiske POI-er: hybrid dekning

Dagens kuraterte lag har 3 416 stopp i 16 land. Første komplette utvidelse dekker også Storbritannia, Irland, Portugal, Finland, Ungarn, Romania, Bulgaria, Hellas, Estland, Latvia, Litauen, Luxembourg og Island.

- Beholde dagens kuraterte høydepunkter og eksisterende separate drivstoff-/ladedatasett.
- Bygge en serverstyrt live-fallback mot åpne kartdata for den aktive rutekorridoren når den lokale listen ikke har nok relevante treff.
- Søke bare innenfor en begrenset korridor rundt den ekte rutepolylinjen og mappe resultatene til dagens interessekategorier.
- Kvalitetssikre hvert treff med ekte koordinater, navn, kilde-ID, kategori og land; avvise treff uten nødvendig identitet eller geografi.
- Slå sammen lokal og live kilde med deduplisering på kilde-ID, koordinat og navn. Kuraterte treff rangeres først, deretter avstand og relevans for kjøretøy/reisefølge.
- Skjule tomme kategorier som i dag, og aldri fylle seksjoner med syntetiske stopp.
- Cache live-resultater per korridor og kategorisett for stabil ytelse og skånsom bruk av datakilden.
- Vise nødvendig OpenStreetMap-bidrag/attribusjon der live-data brukes.
- Legge til automatiske dekningskontroller slik at alle land brukt av SEO-korridorer har POI-data eller fungerende live-fallback.

## 3. Partnerprogram: søknad, godkjenning og medlemskap

### Offentlig partnerside

- Beholde dagens partnerdesign og lokaliserte sider.
- Erstatte e-post-only-søknaden med en lagret, validert søknad som fortsatt sender varsel til `kjell@autovere.com`.
- Søknaden inneholder organisasjon, land, nettsted, kontaktperson, e-post og beskrivelse. Status vises som mottatt uten å love automatisk opptak.
- Beskytte mot spam, doble søknader og lesing av andre søkeres data.

### Manuell godkjenning

- Legge en Partnerseksjon i eksisterende Admin med ventende/godkjente/avslåtte søknader.
- Ved godkjenning opprettes partnerprofil og to separate koder:
  1. **Engangs tilgangskode** knyttet til søkerens e-post for å aktivere partner-dashboardet etter innlogging.
  2. **Delbar kundekode og unik lenke** for 25 % AutoVere Pro-fordel og måling av innløsninger.
- Godkjenning sender kode og sikker aktiveringslenke til søkerens registrerte e-post. Avslag lagres uten å eksponere intern informasjon.
- Koder blir tilfeldige, ikke-sekvensielle, kan deaktiveres, og tilgangskoden kan bare brukes én gang.

### Partner-dashboard

- Lage et beskyttet partner-dashboard med samme AutoVere-stil og lokaliserte tekster.
- Første versjon inneholder de tre avtalte områdene:
  - **Koder og bruk:** kundekode, kopierbar delingslenke, status og antall innløsninger.
  - **Partnerprofil:** se/redigere firmanavn, logo, nettsted og kontaktinformasjon.
  - **Resultater:** aggregerte klikk, registreringer og konverteringer uten navn, e-post eller annen kundeliste.
- Legge inn lokal partner-PDF og logoressurser som tilgjengelig materiell inne i dashboardet, uten å gjøre dette til et eget hovedområde.
- Registrere klikk, kodeinnløsning og konvertering som aggregerbare partnerhendelser.

## Data og sikkerhet

- Nye tabeller for partnersøknader, partnerprofiler, dashboardbrukere, tilgangskoder, kundekoder/innløsninger og aggregerbare partnerhendelser.
- Alle nye tabeller får eksplisitte grants, RLS og minst mulig tilgang i samme migrasjon.
- Roller/partnertilknytning lagres i en separat tilgangstabell, aldri på brukerprofilen.
- Søkerdata og koder er aldri offentlig lesbare. Partnerbrukere kan bare se og redigere sin egen organisasjon.
- Admin-godkjenning valideres på serveren med eksisterende admin-rolle. Partner-dashboardet valideres på serveren for hver beskyttet handling.
- Kodeinnløsning skjer atomisk i databasen for å hindre dobbel bruk og konkurrerende forespørsler.
- Logo lastes til et avgrenset lagringsområde med filtype-/størrelsesregler; dashboardet får kun tilgang til egen partnerlogo.
- Kundestatistikk er aggregert og avslører aldri personopplysninger.

## Teknisk gjennomføring

- TanStack Start-ruter for offentlige SEO-sider og partnerflater; ingen ny rammeverkstruktur.
- Serverfunksjoner for søknad, godkjenning, kodeaktivering, profil og dashboarddata.
- Én database-migrasjon for partner- og POI-cache-strukturen, kjørt gjennom eksisterende Lovable Cloud-tilkobling.
- Eksisterende autentisering og e-postoppsett gjenbrukes; ingen nye credentials.
- Partner- og POI-hendelser kobles til eksisterende analysemodell der det passer.
- Selektive tester for kodeinnløsning, RLS/tilgang, sitemap/hreflang, POI-deduplisering og korridorfiltrering.
- Verifisere offentlig partnerflyt, admin-godkjenning, aktivering, dashboard, lokaliserte SEO-signaler og mobil/desktop-visning før ferdigmelding.

## Avgrensning

- Ingen automatisk partnergodkjenning.
- Ingen visning av individuelle kunders identitet i partner-dashboardet.
- Ingen løfte om rangering i søkemotorer; leveransen gjør sidene teknisk søkbare, strukturerte og interne lenkbare.
- Ingen oppdiktede POI-er, priser eller partnerresultater.
