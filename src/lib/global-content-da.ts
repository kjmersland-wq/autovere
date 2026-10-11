import type { InfoPageContent } from "@/lib/info-content";

const DISCLAIMER = "Kun vejledende overslag — bekræft altid på officielle portaler.";

export const DA_HOW_IT_WORKS: InfoPageContent = {
  eyebrow: "Sådan fungerer det",
  title: "Fra en løs idé til en fuldt prissat roadtrip i tre rolige trin.",
  intro:
    "AutoVere omdanner et udgangspunkt og et rejsemål til et gennemsigtigt, grænseoverskridende omkostningsbillede — vejafgifter, vignetter, brændstof, opladning og færger — til biler, autocampere og turmotorcykler.",
  sections: [
    {
      heading: "1 — Fortæl os om rejsen",
      body: "Angiv dit udgangspunkt og rejsemål, vælg køretøjstype og brændstof eller drivmiddel, og vælg ruteønsker som naturskønne omveje, fravalg af vejafgifter eller medtagelse af færger.",
      items: [
        "Profiler til bil, autocamper/campingvogn og turmotorcykel",
        "Benzin, diesel eller elektrisk med dine egne tal for tank, batteri og forbrug",
        "Vejafgiftsbrikker som AutoPASS, Telepass, Bip&Go, SunPass eller E-ZPass",
      ],
    },
    {
      heading: "2 — Vi beregner den reelle pris for hver kilometer",
      body: "Hvert land eller stat på ruten prissættes hver for sig efter dets eget afgiftssystem — elektroniske vignetter, afstandsbaserede bomme, byringe eller afgiftsfrie motorveje — plus lokale priser på brændstof og lynopladning.",
      items: [
        "Fordeling af vejafgifter og vignetter land for land med detaljer for hvert kontrolpunkt",
        "Motorcykelrabatter, hvor operatørerne tilbyder reducerede klasser",
        "Færge- og bjergpasomkostninger vist som separate poster",
        "Smart optimering af brændstof og elopladning med 75 % sikkerhedsmargin på rækkevidden",
      ],
    },
    {
      heading: "3 — Tag den med på vejen",
      body: "Eksportér en GPX-fil til din GPS, gem rejseplanen i Min Garage, eller del den med dine rejsefæller. Hver afgiftspost linker til den officielle portal, så du kan betale, inden du krydser grænsen.",
      links: [
        { label: "ASFINAG (Østrig)", url: "https://www.asfinag.at/" },
        { label: "AutoPASS (Norge)", url: "https://www.autopass.no/" },
        { label: "Telepass (Italien)", url: "https://www.telepass.com/" },
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Sådan fungerer AutoVere — Planlægning af omkostninger til grænseoverskridende roadtrips",
    description:
      "Se, hvordan AutoVere beregner vejafgifter, vignetter, brændstof, elopladning og færger land for land til biler, autocampere og turmotorcykler.",
  },
};

export const DA_PRICING: InfoPageContent = {
  eyebrow: "Priser",
  title: "Planlæg frit. Opgrader først, når rejsen bliver mere ambitiøs.",
  intro:
    "Almindelig rejseplanlægning er gratis. Betalte planer er til dem, der bor i deres køretøj i ugevis og ønsker dybere ruteplanlægning, offline-eksport og ubegrænset antal gemte eventyr.",
  sections: [
    {
      heading: "Explorer — Gratis",
      body: "Alt, hvad du behøver til en weekendtur eller en rejse gennem to lande.",
      items: [
        "Ubegrænset antal rejseoverslag i Europa, USA og Canada",
        "Fordeling af vejafgifter, vignetter og færger efter land og stat",
        "Overslag over brændstof- og elopladningsomkostninger med links til officielle portaler",
        "Op til 3 gemte køretøjer og 5 gemte rejser i Min Garage",
      ],
    },
    {
      heading: "Voyager — 4,90 € / måned",
      body: "Til den lange sommertur, fjordkørslen og turen fra kyst til kyst.",
      items: [
        "Ubegrænset antal gemte køretøjer og eventyr",
        "GPX-eksport med afgifts- og opladningsstop",
        "Smarte tips til brændstofarbitrage og advarsler om lange strækninger",
        "Prioriterede opdateringer, når afgifts- eller vignetpriser ændres",
      ],
    },
    {
      heading: "Fleet & Partners — fra 29 € / måned",
      body: "Til lejeflåder, autocamperforhandlere, motorcykelklubber og turoperatører.",
      items: [
        "Profiler til flere køretøjer og fælles rejseplaner for hele holdet",
        "Brandede rejseark til udlevering til jeres kunder",
        "API-adgang til omkostningsoverslag (i øjeblikket i privat preview)",
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Priser — Gratis, Trip Pass, Pro og Business | AutoVere",
    description:
      "Planlæg bilturen gratis. Trip Pass låser op for eksport i 14 dage med én betaling. Pro og Business giver ubegrænsede gemte ture, køretøjer og teamværktøjer.",
  },
};

export const DA_FAQ: InfoPageContent = {
  eyebrow: "Ofte stillede spørgsmål",
  title: "Alt det, rejsende spørger os om, før de tager af sted.",
  intro:
    "Ærlige svar på, hvordan vores overslag opbygges, hvor dataene kommer fra, og hvad du stadig selv skal købe.",
  sections: [
    {
      heading: "Hvor præcise er omkostningsoverslagene?",
      body: "Vi baserer os på offentliggjorte afgiftssatser, vignetpriser samt gennemsnitlige regionale priser for brændstof og opladning. Reelle omkostninger ændrer sig med brændstofmarkedet, sæsonpriser, tidspunkt på dagen og køretøjsklasser — så betragt hvert tal som en velfunderet indikation, og bekræft det på den officielle portal, inden du rejser.",
    },
    {
      heading: "Sælger I vignetter eller vejafgifter?",
      body: "Nej. Vi videresælger dem bevidst aldrig. Hver afgiftspost linker direkte til den officielle operatør — ASFINAG, via.admin.ch, AutoPASS, Telepass, 407 ETR, SunPass og andre — så du altid betaler den reelle pris uden forhandleravance.",
    },
    {
      heading: "Hvordan behandles motorcykler?",
      body: "Turmotorcykler prissættes som deres egen køretøjsklasse. Hvor operatørerne tilbyder reducerede motorcykeltakster, anvender vi en vejledende rabat, norske byringe vises som gratis for tohjulede, og du får en dedikeret sikkerheds- og udstyrsradar til bjergpas.",
    },
    {
      heading: "Hvad med autocampere og campingvogne?",
      body: "Autocampere prissættes efter vægt og akselklasse, hvor det er relevant, og vi viser advarsler om frihøjde, længde og vægt ved tunneler, pas og lave broer på ruten.",
    },
    {
      heading: "Understøtter I elbiler?",
      body: "Ja. Vælg Elektrisk (EV), og angiv din batteristørrelse og dit forbrug. Vi planlægger lynopladningsstop med 75 % sikkerhedsmargin på rækkevidden og viser de netværk, du vil møde — Ionity, Fastned, Tesla Supercharger, Electrify America og FLO.",
    },
    {
      heading: "Skal jeg have en konto?",
      body: "Nej. Øjeblikkelig beregning — ingen konto nødvendig for at forhåndsvise. Min Garage gemmer dine køretøjer og rejser lokalt på din egen enhed; eksport (GPX, PDF-rejseplan, send-til-bil) låses op med engangskøbet Trip Pass (14 dage) eller Pro.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "FAQ — Spørgsmål om vejafgifter, vignetter, brændstof og elopladning | AutoVere",
    description:
      "Svar om nøjagtigheden af overslag, officielle afgiftsportaler, motorcykel- og autocamperklasser, planlægning af elopladning og konti.",
  },
};

export const DA_PARTNERS: InfoPageContent = {
  eyebrow: "Partnere",
  title: "Vi samarbejder med dem, der får folk ud på vejen.",
  intro:
    "Vi linker altid direkte til de officielle vejafgifts- og vignetudbydere, og vi er stolte af at samarbejde med rejse-, udlejnings- og motorcykelvirksomheder i hele Europa, USA og Canada.",
  sections: [
    {
      heading: "Officielle vejafgifts- og vignetudbydere, vi linker til",
      body: "Alt køb foregår direkte hos udbyderen selv — vi lægger aldrig noget oveni.",
      links: [
        { label: "ASFINAG — Østrig", url: "https://www.asfinag.at/" },
        { label: "via.admin.ch — Schweiz", url: "https://via.admin.ch/" },
        { label: "AutoPASS — Norge", url: "https://www.autopass.no/" },
        { label: "Telepass — Italien", url: "https://www.telepass.com/" },
        { label: "DARS — Slovenien", url: "https://www.dars.si/" },
        { label: "407 ETR — Ontario", url: "https://www.407etr.com/" },
        { label: "SunPass — Florida", url: "https://www.sunpass.com/" },
      ],
    },
    {
      heading: "Det her er nogle af dem, vi samarbejder med",
      items: [
        "Udlejere af autocampere og campingvogne, der vil give deres kunder ærlige og gennemskuelige rejsepriser",
        "Motorcykel-turoperatører og klubber, der planlægger ture i Alperne og langs de norske fjorde",
        "Ladenetværk til elbiler og apps til ruteplanlægning",
        "Turistorganisationer, der gerne vil vise naturskønne pas, kystveje og færgeruter frem",
      ],
    },
    {
      heading: "Bliv en del af netværket",
      body: "Vi samarbejder gerne med jer, uanset hvor I er. Driver I en flåde, en turvirksomhed eller en afgiftstjeneste og har lyst til at snakke om integration, fælles markedsføring eller datadeling, så skriv endelig til os på kjell@autovere.com — vi glæder os til at høre fra jer.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Partnere — Officielle vejafgiftsoperatører og rejsepartnere | AutoVere",
    description:
      "AutoVere linker direkte til officielle vejafgifts- og vignetoperatører og samarbejder med udlejningsflåder, turoperatører og ladenetværk.",
  },
};

export const DA_PRIVACY: InfoPageContent = {
  eyebrow: "Privatlivspolitik",
  title: "Din rute er din sag.",
  intro:
    "AutoVere drives af KM TECH LABS. Vi begrænser dataindsamlingen til det minimum, der er nødvendigt for at give dig et præcist omkostningsoverslag.",
  sections: [
    {
      heading: "Hvad vi gemmer",
      items: [
        "Rejsedata (udgangspunkt, rejsemål, køretøj og præferencer) brugt til at lave dit overslag",
        "Gemte køretøjer og rejser — gemt lokalt i din egen browser, ikke på vores servere",
        "Aggregerede, ikke-identificerbare brugsstatistikker til at forbedre planlæggeren",
      ],
    },
    {
      heading: "Hvad vi ikke gør",
      items: [
        "Vi sælger eller udlejer aldrig personoplysninger",
        "Vi sporer ikke din livslokation",
        "Vi kræver ikke en konto for at planlægge, eksportere eller dele en rejse",
      ],
    },
    {
      heading: "Dine rettigheder under GDPR",
      body: "Som en operatør baseret i Norge/EØS følger vi GDPR. Du kan anmode om indsigt, berigtigelse, sletning, begrænsning, dataportabilitet eller gøre indsigelse mod behandling. Rydning af din browserlagring fjerner øjeblikkeligt dine gemte køretøjer og rejser.",
    },
    {
      heading: "Cookies og analyse",
      body: "Vi bruger essentiel lagring til at huske din region, dit sprog og din garage. Al analyse, vi gennemfører, er aggregeret og kan ikke identificere dig personligt.",
    },
    {
      heading: "Kontakt",
      body: "Spørgsmål om privatliv: kjell@autovere.com — KM TECH LABS. Regionale meddelelser: amerikanske privatlivsforhold er beskrevet på /us/legal, og canadiske PIPEDA- og Québec Lov 25-rettigheder er beskrevet på /ca/legal.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Privatlivspolitik — GDPR, lokal lagring og dine data | AutoVere",
    description:
      "Hvordan KM TECH LABS håndterer rejsedata, lokalt gemt garagedata, cookies og dine GDPR-rettigheder på AutoVere.",
  },
};

export const DA_TERMS: InfoPageContent = {
  eyebrow: "Vilkår og betingelser",
  title: "Klare vilkår, så du kan planlægge med tillid.",
  intro:
    "Ved at bruge AutoVere accepterer du disse vilkår. De findes for at holde forventningerne ærlige om, hvad et omkostningsoverslag er — og hvad det ikke er.",
  sections: [
    {
      heading: "Overslag, ikke fakturaer",
      body: "Alle viste omkostninger er vejledende overslag baseret på offentliggjorte takster og gennemsnitlige regionale priser. Faktiske vejafgifter, vignetter, brændstof, opladning og færgebilletter kan variere efter køretøjsklasse, sæson, tidspunkt på dagen og ændringer hos operatørerne. Bekræft altid med den officielle portal, inden du rejser.",
    },
    {
      heading: "Sikker og lovlig brug",
      items: [
        "Brug ikke AutoVere, mens du kører — planlæg, inden du kører af sted",
        "Følg lokal trafiklov, køretøjsklasseregler samt pas- og tunnelrestriktioner",
        "Automatiseret dataudtræk, videresalg af vores indhold eller fremstilling af det som officielle priser er ikke tilladt",
      ],
    },
    {
      heading: "Links og tjenester fra tredjepart",
      body: "Links til afgiftsoperatører, færgeselskaber og ladenetværk gives af hensyn til bekvemmelighed. Disse tjenester har egne vilkår og priser, og KM TECH LABS er ikke ansvarlig for deres indhold eller transaktioner.",
    },
    {
      heading: "Ansvar",
      body: "AutoVere leveres „som det er”. I det omfang loven tillader det, er KM TECH LABS ikke ansvarlig for omkostninger, bøder, tabte overfarter eller tab som følge af at have stolet på et overslag.",
    },
    {
      heading: "Lovvalg",
      body: "Disse vilkår er underlagt norsk lov, uden at det berører ufravigelige forbrugerbeskyttelsesregler i dit bopælsland.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Vilkår og betingelser — Ansvarsfraskrivelse for overslag og fair brug | AutoVere",
    description:
      "AutoVeres vilkår og betingelser fra KM TECH LABS: vejledende overslag, sikker brug, tredjepartslinks, ansvar og lovvalg.",
  },
};
