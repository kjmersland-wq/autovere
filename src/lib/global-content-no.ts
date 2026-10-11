import type { InfoPageContent } from "@/lib/info-content";

const DISCLAIMER = "Kun veiledende estimater — kontroller alltid med offisielle portaler.";

export const NO_HOW_IT_WORKS: InfoPageContent = {
  eyebrow: "Slik fungerer det",
  title: "Fra en løs idé til en ferdig kostnadsberegnet biltur i tre rolige steg.",
  intro:
    "AutoVere gjør start og destinasjon om til et tydelig kostnadsbilde på tvers av landegrenser — bompenger, vignetter, drivstoff, lading og ferjer — for bil, bobil og turmotorsykkel.",
  sections: [
    {
      heading: "1 — Fortell oss om reisen",
      body: "Legg inn start og mål, velg kjøretøytype og drivstoff eller strøm, og velg rutepreferanser som naturskjønne omveier, unngå bom eller ta med ferjer.",
      items: [
        "Profiler for bil, bobil/campingbil og turmotorsykkel",
        "Bensin, diesel eller elektrisk med dine egne tall for tank, batteri og forbruk",
        "Bombrikker som AutoPASS, Telepass, Bip&Go, SunPass eller E-ZPass",
      ],
    },
    {
      heading: "2 — Vi beregner den reelle kostnaden per kilometer",
      body: "Hvert land og hver delstat på ruten beregnes for seg, med sitt eget bomsystem — elektroniske vignetter, avstandsbaserte bomstasjoner, bomringer eller gratis motorveier — pluss lokale priser på drivstoff og hurtiglading.",
      items: [
        "Land-for-land-oversikt over bom og vignetter med detaljer per bomstasjon",
        "Motorsykkelrabatter der operatørene har egne satser",
        "Ferjer og fjelloverganger vises som egne linjer",
        "Smart optimalisering av drivstoff og lading med 75 % rekkeviddebuffer",
      ],
    },
    {
      heading: "3 — Ta det med på veien",
      body: "Last ned GPX-fil til GPS-en, lagre turen i Min Garasje, eller del den med reisefølget. Hver bomlinje lenker til den offisielle portalen så du kan kjøpe før du krysser grensen.",
      links: [
        { label: "ASFINAG (Østerrike)", url: "https://www.asfinag.at/" },
        { label: "AutoPASS (Norge)", url: "https://www.autopass.no/" },
        { label: "Telepass (Italia)", url: "https://www.telepass.com/" },
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Slik fungerer AutoVere — Reisekostnader på tvers av grenser",
    description:
      "Se hvordan AutoVere beregner bompenger, vignetter, drivstoff, lading og ferjer land for land for bil, bobil og turmotorsykkel.",
  },
};

export const NO_PRICING: InfoPageContent = {
  eyebrow: "Priser",
  title: "Planlegg fritt. Oppgrader først når turen blir ambisiøs.",
  intro:
    "Vanlig turplanlegging er gratis. Betalte planer er for deg som bor i kjøretøyet i ukevis og vil ha dypere ruteplanlegging, offline-eksport og ubegrenset lagring.",
  sections: [
    {
      heading: "Explorer — Gratis",
      body: "Alt du trenger for en helgetur eller en tur gjennom to land.",
      items: [
        "Ubegrenset antall estimater i Europa, USA og Canada",
        "Oversikt over bom, vignetter og ferjer per land og delstat",
        "Estimater for drivstoff og lading med lenker til offisielle portaler",
        "Inntil 3 lagrede kjøretøy og 5 lagrede turer i Min Garasje",
      ],
    },
    {
      heading: "Voyager — 4,90 € / måned",
      body: "For den lange sommerturen, fjordrunden og kyst-til-kyst.",
      items: [
        "Ubegrenset antall kjøretøy og lagrede turer",
        "GPX-eksport med bom- og ladepunkter",
        "Smarte tips om drivstoffpriser og varsler på lange strekk",
        "Prioriterte varsler når bom- eller vignettpriser endres",
      ],
    },
    {
      heading: "Fleet & Partners — fra 29 € / måned",
      body: "For utleieflåter, bobilforhandlere, MC-klubber og turoperatører.",
      items: [
        "Flere kjøretøyprofiler og delte reiseruter for teamet",
        "Turark med egen merkevare til kundene dine",
        "API-tilgang til kostnadsestimater (i lukket forhåndsvisning)",
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Priser — Gratis, Trip Pass, Pro og Business | AutoVere",
    description:
      "Planlegg bilturen gratis. Trip Pass låser opp eksport i 14 dager med én betaling. Pro og Business gir ubegrensede lagrede turer, kjøretøy og teamverktøy.",
  },
};

export const NO_FAQ: InfoPageContent = {
  eyebrow: "Ofte stilte spørsmål",
  title: "Alt reisende spør oss om før avreise.",
  intro:
    "Ærlige svar om hvordan estimatene lages, hvor dataene kommer fra og hva du fortsatt må kjøpe selv.",
  sections: [
    {
      heading: "Hvor nøyaktige er kostnadsestimatene?",
      body: "Vi bruker publiserte bomsatser, vignettpriser og gjennomsnittlige regionale priser på drivstoff og lading. Reelle kostnader endres med drivstoffmarkedet, sesongtakster, tidspunkt på døgnet og kjøretøyklasser — så se tallene som godt begrunnede indikasjoner og bekreft med den offisielle portalen før du reiser.",
    },
    {
      heading: "Selger dere vignetter eller bompasseringer?",
      body: "Nei. Vi videreselger dem bevisst aldri. Hver bomlinje lenker rett til operatøren — ASFINAG, via.admin.ch, AutoPASS, Telepass, 407 ETR, SunPass og flere — slik at du alltid betaler riktig pris uten påslag.",
    },
    {
      heading: "Hvordan håndteres motorsykler?",
      body: "Turmotorsykler beregnes som egen kjøretøyklasse. Der operatørene har reduserte MC-satser bruker vi en veiledende rabatt, norske byringer vises som gratis for tohjulinger, og du får en egen sikkerhets- og utstyrsradar for fjelloverganger.",
    },
    {
      heading: "Hva med bobiler og campingbiler?",
      body: "Bobiler beregnes etter vekt og akselklasse der det gjelder, og vi varsler om høyde, lengde og vekt for tunneler, fjelloverganger og lave broer langs ruten.",
    },
    {
      heading: "Støtter dere elbiler?",
      body: "Ja. Velg Elektrisk (EV) og legg inn batteristørrelse og forbruk. Vi planlegger hurtigladestopp med 75 % rekkeviddebuffer og viser nettverkene du møter — Ionity, Fastned, Tesla Supercharger, Electrify America og FLO.",
    },
    {
      heading: "Hvor finner jeg filteret for reisefølge og stopp?",
      body: "To steder, og det er aldri gjemt bort. I Min Garasje åpner du fanen «Reisefølge og stopp» i menyen til venstre for å lagre hvem som reiser og hvilke av de 14 interessekategoriene dere bryr dere om. I ruteplanleggeren, rett under kostnadsoversikten, åpner du «Personalize stops for your travel party» for å velge de samme kategoriene for akkurat den turen. Begge stedene deler samme lagrede valg.",
    },
    {
      heading: "Hva er unikt for Pro og Trip Pass?",
      body: "Bare AutoVere lar deg forme ruten etter hvem som faktisk sitter i bilen. Velg blant 14 kategorier — bobilservice, camping og overnatting, naturskjønne veier, utsiktspunkter, historie og kultur, slott, natur og friluft, barn og lek, dyreliv, mat, strand og vann, byer, aktiv ferie og rolige stopp — så legger Pro eller Trip Pass matchende stopp inn i korridoren din, i kartet, i PDF-turmappen og i GPX-, Google Maps- og Apple Maps-eksporten.",
    },
    {
      heading: "Trenger jeg en konto?",
      body: "Nei. Umiddelbar beregning — ingen konto nødvendig for å forhåndsvise. Min Garasje lagrer kjøretøy og turer lokalt på din egen enhet; eksport (GPX, PDF-turbeskrivelse, send-til-bil) låses opp med engangskjøpet Trip Pass (14 dager) eller Pro.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "FAQ — Bompenger, vignetter, drivstoff og lading | AutoVere",
    description:
      "Svar om nøyaktighet, offisielle bomportaler, MC- og bobilklasser, ladeplanlegging for elbil og konto.",
  },
};

export const NO_PARTNERS: InfoPageContent = {
  eyebrow: "Partnere",
  title: "Vi går sammen med dem som holder reisen i gang.",
  intro:
    "Vi lenker alltid rett til de offisielle bomselskapene, og vi setter stor pris på å samarbeide med reiseliv, utleie og MC-miljøet i Europa, USA og Canada.",
  sections: [
    {
      heading: "Offisielle bomselskaper og vignettutstedere vi lenker til",
      body: "Alt kjøp skjer direkte hos operatøren selv — vi tar aldri et mellomlegg.",
      links: [
        { label: "ASFINAG — Østerrike", url: "https://www.asfinag.at/" },
        { label: "via.admin.ch — Sveits", url: "https://via.admin.ch/" },
        { label: "AutoPASS — Norge", url: "https://www.autopass.no/" },
        { label: "Telepass — Italia", url: "https://www.telepass.com/" },
        { label: "DARS — Slovenia", url: "https://www.dars.si/" },
        { label: "407 ETR — Ontario", url: "https://www.407etr.com/" },
        { label: "SunPass — Florida", url: "https://www.sunpass.com/" },
      ],
    },
    {
      heading: "Disse samarbeider vi med",
      items: [
        "Utleieflåter for bobil og campingvogn som vil gi kundene sine ærlige og oversiktlige reisepriser",
        "MC-turoperatører og klubber som planlegger turer i Alpene og langs norske fjorder",
        "Ladenettverk for elbil og apper for ruteplanlegging",
        "Reiselivsorganisasjoner som vil vise fram flotte fjelloverganger, kystveier og ferjesamband",
      ],
    },
    {
      heading: "Bli en del av nettverket",
      body: "Vi samarbeider gjerne med partnere uansett hvor de er. Driver du en flåte, en turvirksomhet eller en bomtjeneste og har lyst til å snakke om integrasjon, samarbeid eller datadeling? Send oss en e-post på kjell@autovere.com — vi gleder oss til å høre fra deg.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Partnere — Offisielle bomoperatører og reisepartnere | AutoVere",
    description:
      "AutoVere lenker direkte til offisielle bom- og vignettoperatører og samarbeider med utleieflåter, turoperatører og ladenettverk.",
  },
};

export const NO_PRIVACY: InfoPageContent = {
  eyebrow: "Personvernerklæring",
  title: "Ruten din er din sak.",
  intro:
    "AutoVere drives av KM TECH LABS. Vi samler inn minst mulig data — kun det som trengs for et presist kostnadsestimat.",
  sections: [
    {
      heading: "Hva vi lagrer",
      items: [
        "Turdata (start, mål, kjøretøy og preferanser) som brukes til å lage estimatet",
        "Lagrede kjøretøy og turer — lagret lokalt i din egen nettleser, ikke på våre servere",
        "Aggregert, ikke-identifiserbar bruksstatistikk for å forbedre planleggeren",
      ],
    },
    {
      heading: "Hva vi ikke gjør",
      items: [
        "Vi selger eller leier aldri ut personopplysninger",
        "Vi sporer ikke posisjonen din i sanntid",
        "Vi krever ikke konto for å planlegge, eksportere eller dele en tur",
      ],
    },
    {
      heading: "Dine rettigheter etter GDPR",
      body: "Som en norsk/EØS-basert aktør følger vi GDPR. Du kan be om innsyn, retting, sletting, begrensning, dataportabilitet eller motsette deg behandling. Tømmer du nettleserlagringen, forsvinner lagrede kjøretøy og turer umiddelbart.",
    },
    {
      heading: "Informasjonskapsler og analyse",
      body: "Vi bruker nødvendig lagring for å huske region, språk og garasje. All analyse er aggregert og kan ikke identifisere deg.",
    },
    {
      heading: "Kontakt",
      body: "Personvernspørsmål: kjell@autovere.com — KM TECH LABS. Regionale vilkår: amerikansk personvern dekkes på /us/legal, og kanadiske PIPEDA- og Québec Lov 25-rettigheter på /ca/legal.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Personvern — GDPR, lokal lagring og dine data | AutoVere",
    description:
      "Hvordan KM TECH LABS håndterer turdata, lokalt lagret garasje, informasjonskapsler og dine GDPR-rettigheter.",
  },
};

export const NO_TERMS: InfoPageContent = {
  eyebrow: "Vilkår for bruk",
  title: "Tydelige vilkår, så du kan planlegge trygt.",
  intro:
    "Ved å bruke AutoVere godtar du disse vilkårene. De finnes for å være ærlige om hva et kostnadsestimat er — og ikke er.",
  sections: [
    {
      heading: "Estimater, ikke fakturaer",
      body: "Alle kostnader er veiledende, basert på publiserte satser og gjennomsnittlige regionale priser. Faktiske bompenger, vignetter, drivstoff, lading og ferjebilletter kan avvike etter kjøretøyklasse, sesong, tidspunkt og operatørendringer. Kontroller alltid med den offisielle portalen før avreise.",
    },
    {
      heading: "Trygg og lovlig bruk",
      items: [
        "Ikke bruk AutoVere mens du kjører — planlegg før du starter",
        "Følg lokale trafikkregler, kjøretøyklasser og restriksjoner i tunneler og fjelloverganger",
        "Automatisk innhenting, videresalg av innholdet vårt eller å fremstille det som offisielle priser er ikke tillatt",
      ],
    },
    {
      heading: "Tredjepartslenker og tjenester",
      body: "Lenker til bomoperatører, ferjeselskaper og ladenettverk er kun for enkelhets skyld. Disse tjenestene har egne vilkår og priser, og KM TECH LABS er ikke ansvarlig for innholdet eller transaksjonene deres.",
    },
    {
      heading: "Betaling og abonnement",
      body: "Bestillingen gjennomføres av vår nettforhandler Paddle.com. Paddle.com er Merchant of Record for alle bestillinger, besvarer alle kundehenvendelser og håndterer returer. Betaling, fakturering, avgifter, oppsigelse og refusjon følger Paddles kjøpsvilkår (paddle.com/legal/checkout-buyer-terms). Abonnementer fornyes automatisk til du sier opp, og du kan når som helst administrere eller si opp via Paddles kundeportal. Se også refusjonsreglene våre på /refund.",
    },
    {
      heading: "Ansvar",
      body: "AutoVere leveres «som det er». Så langt loven tillater er KM TECH LABS ikke ansvarlig for kostnader, gebyrer, tapte avganger eller tap som følge av at man har stolt på et estimat.",
    },
    {
      heading: "Lovvalg",
      body: "Vilkårene er underlagt norsk rett, uten at det berører ufravikelige forbrukerrettigheter i landet du bor i.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Vilkår for bruk — Estimatforbehold og rimelig bruk | AutoVere",
    description:
      "AutoVeres vilkår fra KM TECH LABS: veiledende estimater, trygg bruk, tredjepartslenker, ansvar og lovvalg.",
  },
};
