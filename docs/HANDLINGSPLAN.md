# Handlingsplan for AutoVere

Dette er ting bare du kan gjøre, fordi de krever innlogging i Stripe, Google eller Vercel, eller fordi de er forretningsvalg.
Alt i koden er ferdig og ligger live på `main`. Detaljer står i [STATUS-2026-09.md](STATUS-2026-09.md).

Rekkefølgen er etter viktighet. Punkt 1–3 bør gjøres denne uken. Den lengre planen for vekst står i [VEKSTPLAN.md](VEKSTPLAN.md).

---

## 1. Kontroller at siden fungerer (10 min)

Åpne https://www.autovere.com i et **privat vindu** og sjekk:

- [ ] Trykk «Beregn» med tomme felt → det skal komme en rød melding under feltet, ingen tur.
- [ ] Trykk en populær rute (f.eks. Oslo → Bergen) → det skal ikke dukke opp forslagslister, og resultatet kommer.
- [ ] Resultatet viser et oransje Trip Pass-kort rett under tallene.
- [ ] «Flere valg» åpner mellomstopp, brytere og bombrikker.
- [ ] Min garasje som gjest viser 0 / 0 / 0.
- [ ] https://www.autovere.com/usa sender deg videre til /us.
- [ ] https://www.autovere.com/llms.txt viser en tekstfil.

Er noe feil: gå til Vercel → prosjektet → Deployments og trykk «Instant Rollback» på forrige versjon.

## 2. Bestem prisene og sjekk Stripe (30 min, viktigst for inntekt)

Siden viser forskjellige priser per språk, men checkout bruker én Stripe-pris per produkt.
Kunden kan derfor bli belastet et annet beløp eller i en annen valuta enn det som står på siden.

1. Åpne Stripe (via Lovable → Payments, eller dashboard.stripe.com).
2. Se på disse fire prisene (oppslagsnøkkel / lookup key):
   `trip_pass`, `pro_monthly`, `pro_yearly`, `business_monthly`.
3. Noter valutaen og om det finnes flere valutaer («currency options»).
4. Velg ett av to:
   - **A (anbefalt):** Legg inn valutavalg i Stripe som matcher prisene på siden (NOK, SEK, DKK, EUR, GBP, USD, CAD, PLN, JPY, CNY). Stripe velger da riktig valuta automatisk.
   - **B:** Si hvilke priser som skal gjelde, så endres tallene på siden til å matche Stripe.
5. Bestem samtidig:
   - [ ] Norsk Pro er 99 kr/mnd (ca. €8,50) mot ca. €5,20 i Sverige og Danmark. Skal det være slik?
   - [ ] Polsk, japansk og kinesisk viser Trip Pass i egen valuta, men Pro i euro. Skal alt være i én valuta?

Full pristabell står i STATUS-dokumentet.

## 3. Gjør ett testkjøp (15 min)

- [ ] Lag en testbruker, kjøp Trip Pass i **sandbox/testmodus** (Stripe testkort `4242 4242 4242 4242`).
- [ ] Sjekk at GPX-eksport låses opp etter kjøpet, og at beløpet på kvitteringen er riktig.

## 4. Google og Bing (20 min)

- [ ] Google Search Console → Sitemaps → send inn `https://www.autovere.com/sitemap.xml` på nytt.
- [ ] Search Console → URL-inspeksjon → be om indeksering av forsiden, `/no` og `/pricing`.
- [ ] Sjekk «Sider» → «Ikke funnet (404)» om 1–2 uker. `/usa`-feilene skal forsvinne.
- [ ] Bing Webmaster Tools: legg til siden og send inn samme sitemap. Bing brukes også av ChatGPT-søk.

## 5. Følg med på tallene (5 min i uken)

Admin → Produkthendelser. Sammenlign før og etter:

- **Beregn stoppet (tomt felt):** hvor mange som prøvde uten å fylle ut.
- **Beregning feilet:** bør være lav. Er den høy, er rutetjenesten treg eller nede.
- **Trip Pass-knapp på resultat trykket** → **Pro-oppgradering trykket:** dette er salgstrakten.
- **Challenge-lenke på resultat trykket.**

## 6. Vekst (løpende, når 1–3 er gjort)

- [ ] **Partnere:** kontakt NAF, Norsk Bobilforening, MC-klubber og bilforhandlere. Siden `/partners` og 25 %-rabatten er klare.
- [ ] **Del ferdige rutelenker i sosiale medier og forum.** Lenker som `https://www.autovere.com/no?origin=Oslo&destination=Bergen` regner ut turen automatisk når de åpnes.
- [ ] **Challenge:** be de første brukerne legge inn faktiske kostnader. Det bygger tillit til tallene.

## 7. Senere (ingen hast)

- **Bompenger per bomstasjon i USA/Canada.** Krever en datakilde, som i dag ikke finnes åpent.
- **Stedsforslag i feltene for mellomstopp.**
- **Egne sider per populær rute med ferdige eksempeltall på forsiden.**

---

**Viktig om koden:** Prosjektet er koblet til Lovable. Aldri «force push» eller omskriv historikk på `main`, for da mister Lovable historikken.
