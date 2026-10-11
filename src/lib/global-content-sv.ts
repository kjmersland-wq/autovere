import type { InfoPageContent } from "@/lib/info-content";

const DISCLAIMER = "Endast vägledande uppskattningar — kontrollera alltid med officiella portaler.";

export const SV_HOW_IT_WORKS: InfoPageContent = {
  eyebrow: "Så funkar det",
  title: "Från en lös idé till en fullständigt kostnadsberäknad bilresa i tre lugna steg.",
  intro:
    "AutoVere Sverige omvandlar en start och en destination till en tydlig, gränsöverskridande kostnadsbild — vägtullar, vinjetter, bränsle, laddning och färjor — för bilar, husbilar och turmotorcyklar.",
  sections: [
    {
      heading: "1 — Berätta om resan",
      body: "Ange var du startar och vart du ska, välj fordonstyp och bränsle eller drivmedel, och välj ruttinställningar som natursköna omvägar, undvika vägtullar eller inkludera färjor.",
      items: [
        "Profiler för bil, husbil/campingbil och turmotorcykel",
        "Bensin, diesel eller elektrisk med dina egna uppgifter om tank, batteri och förbrukning",
        "Vägtullbrickor som AutoPASS, Telepass, Bip&Go, SunPass eller E-ZPass",
      ],
    },
    {
      heading: "2 — Vi räknar fram den verkliga kostnaden för varje kilometer",
      body: "Varje land och delstat på din rutt beräknas separat, enligt sitt eget avgiftssystem — elektroniska vinjetter, distansbaserade bommar, stadsringar eller avgiftsfria motorvägar — plus lokala bränsle- och snabbladdningspriser.",
      items: [
        "Sammanställning av vägtullar och vinjetter land för land, med detaljer för varje betalstation",
        "Motorcykelrabatter där operatörerna erbjuder egna taxor",
        "Färjor och bergspass visas som separata poster",
        "Smart optimering av bränsle och laddning med 75 % räckviddsbuffert",
      ],
    },
    {
      heading: "3 — Ta med dig resan",
      body: "Ladda ner en GPX-fil för navigationen, spara resan i Mitt Garage eller dela den med dina medresenärer. Varje avgiftspost länkar till den officiella portalen så att du kan betala innan du korsar gränsen.",
      links: [
        { label: "ASFINAG (Österrike)", url: "https://www.asfinag.at/" },
        { label: "AutoPASS (Norge)", url: "https://www.autopass.no/" },
        { label: "Telepass (Italien)", url: "https://www.telepass.com/" },
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Så funkar AutoVere — Planering av gränsöverskridande resekostnader",
    description:
      "Se hur AutoVere beräknar vägtullar, vinjetter, bränsle, laddning och färjor land för land för bilar, husbilar och turmotorcyklar.",
  },
};

export const SV_PRICING: InfoPageContent = {
  eyebrow: "Priser",
  title: "Planera fritt. Uppgradera bara när resan blir mer ambitiös.",
  intro:
    "Vardaglig reseplanering är gratis. Betalplanerna är för dig som bor i fordonet i veckor och vill ha djupare ruttplanering, offline-export och obegränsat antal sparade äventyr.",
  sections: [
    {
      heading: "Explorer — Gratis",
      body: "Allt du behöver för en helgresa eller en resa genom två länder.",
      items: [
        "Obegränsat antal reseuppskattningar i Europa, USA och Kanada",
        "Sammanställningar av vägtullar, vinjetter och färjor per land och delstat",
        "Uppskattningar av bränsle- och laddningskostnader med länkar till officiella portaler",
        "Upp till 3 sparade fordon och 5 sparade resor i Mitt Garage",
      ],
    },
    {
      heading: "Voyager — 49 kr / månad",
      body: "För den långa sommarturnén, färden längs fjordarna och resan från kust till kust.",
      items: [
        "Obegränsat antal sparade fordon och äventyr",
        "GPX-export med vägtulls- och laddningspunkter",
        "Smarta tips om bränslepriser och varningar för långa sträckor",
        "Prioriterade meddelanden när avgifter eller vinjettpriser ändras",
      ],
    },
    {
      heading: "Fleet & Partners — från 299 kr / månad",
      body: "För uthyrningsflottor, husbilsåterförsäljare, motorcykelklubbar och researrangörer.",
      items: [
        "Profiler för flera fordon och delade resplaner för hela teamet",
        "Egna varumärkta resekort att dela med kunder",
        "API-åtkomst till kostnadsuppskattningar (för närvarande i privat förhandsversion)",
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Priser — Gratis, Trip Pass, Pro och Business | AutoVere",
    description:
      "Planera bilresan gratis. Trip Pass låser upp export i 14 dagar med en enda betalning. Pro och Business ger obegränsat med sparade resor, fordon och teamverktyg.",
  },
};

export const SV_FAQ: InfoPageContent = {
  eyebrow: "Vanliga frågor",
  title: "Allt resenärer frågar oss innan de ger sig av.",
  intro:
    "Ärliga svar om hur våra uppskattningar tas fram, var uppgifterna kommer ifrån och vad du fortfarande behöver köpa själv.",
  sections: [
    {
      heading: "Hur exakta är kostnadsuppskattningarna?",
      body: "Vi utgår från publicerade avgiftstaxor, vinjettpriser och genomsnittliga regionala bränsle- och laddningspriser. De verkliga kostnaderna förändras med bränslemarknaden, säsongstaxor, tid på dygnet och fordonsklassregler — se därför varje siffra som en välgrundad indikation och bekräfta den på den officiella portalen innan du reser.",
    },
    {
      heading: "Säljer ni vinjetter eller vägtullar?",
      body: "Nej. Vi säljer aldrig sådant vidare med flit. Varje avgiftspost länkar direkt till den officiella operatören — ASFINAG, via.admin.ch, AutoPASS, Telepass, 407 ETR, SunPass med flera — så att du alltid betalar det verkliga priset utan mellanhandspåslag.",
    },
    {
      heading: "Hur hanteras motorcyklar?",
      body: "Turingmotorcyklar beräknas som en egen fordonsklass. Där operatörer erbjuder reducerade motorcykeltaxor tillämpar vi en vägledande rabatt, norska stadsringar visas som gratis för tvåhjulingar, och du får en egen säkerhets- och utrustningsradar för bergspass.",
    },
    {
      heading: "Vad gäller för husbilar och husvagnar?",
      body: "Husbilar beräknas efter vikt och axelklass där det gäller, och vi visar varningar om höjd, längd och vikt vid tunnlar, pass och låga broar längs vägen.",
    },
    {
      heading: "Har ni stöd för elbilar?",
      body: "Ja. Välj Elektrisk (EV) och ange batteristorlek och förbrukning. Vi planerar snabbladdningsstopp med 75 % räckviddsbuffert och visar de nätverk du kommer att möta — Ionity, Fastned, Tesla Supercharger, Electrify America och FLO.",
    },
    {
      heading: "Behöver jag ett konto?",
      body: "Nej. Direktberäkning — inget konto behövs för att förhandsgranska. Mitt Garage sparar dina fordon och resor lokalt på din egen enhet; export (GPX, PDF-resebeskrivning, skicka-till-bil) låses upp med engångsköpet Trip Pass (14 dagar) eller Pro.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Vanliga frågor — Vägtullar, vinjetter, bränsle och elbilsladdning | AutoVere",
    description:
      "Svar om uppskattningarnas noggrannhet, officiella avgiftsportaler, motorcykel- och husbilsklasser, planering av elbilsladdning och konton.",
  },
};

export const SV_PARTNERS: InfoPageContent = {
  eyebrow: "Partners",
  title: "Vi samarbetar med dem som får resan att rulla.",
  intro:
    "Vi länkar alltid direkt till de officiella avgifts- och vinjettoperatörerna, och vi är stolta över att samarbeta med rese-, uthyrnings- och motorcykelföretag i hela Europa, USA och Kanada.",
  sections: [
    {
      heading: "Officiella vägtulls- och vinjettoperatörer vi länkar till",
      body: "Alla betalningar sker direkt hos operatören — vi lägger aldrig på något mellanled.",
      links: [
        { label: "ASFINAG — Österrike", url: "https://www.asfinag.at/" },
        { label: "via.admin.ch — Schweiz", url: "https://via.admin.ch/" },
        { label: "AutoPASS — Norge", url: "https://www.autopass.no/" },
        { label: "Telepass — Italien", url: "https://www.telepass.com/" },
        { label: "DARS — Slovenien", url: "https://www.dars.si/" },
        { label: "407 ETR — Ontario", url: "https://www.407etr.com/" },
        { label: "SunPass — Florida", url: "https://www.sunpass.com/" },
      ],
    },
    {
      heading: "De här samarbetar vi med",
      items: [
        "Uthyrare av husbilar och husvagnar som vill ge sina kunder tydliga och ärliga resepriser",
        "Motorcykelresearrangörer och klubbar som planerar turer i Alperna och längs de norska fjordarna",
        "Laddnätverk för elbilar och appar för ruttplanering",
        "Turistorganisationer som vill visa upp natursköna vägar, kustvägar och färjeleder",
      ],
    },
    {
      heading: "Bli en del av nätverket",
      body: "Vi samarbetar gärna med er var ni än finns. Driver ni en bilflotta, ett researrangörsföretag eller en avgiftstjänst och vill prata om integration, gemensam marknadsföring eller datasamarbete – hör av er till kjell@autovere.com, vi ser fram emot att höra från er.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Partners — Officiella avgiftsoperatörer och resepartners | AutoVere",
    description:
      "AutoVere länkar direkt till officiella avgifts- och vinjettoperatörer och samarbetar med uthyrningsflottor, researrangörer och laddningsnätverk.",
  },
};

export const SV_PRIVACY: InfoPageContent = {
  eyebrow: "Integritetspolicy",
  title: "Din rutt är din egen sak.",
  intro:
    "AutoVere drivs av KM TECH LABS. Vi håller datainsamlingen till ett minimum — bara det som behövs för en korrekt kostnadsuppskattning.",
  sections: [
    {
      heading: "Vad vi sparar",
      items: [
        "Reseuppgifter (start, mål, fordon och preferenser) som används för att skapa din uppskattning",
        "Sparade fordon och resor — lagras lokalt i din egen webbläsare, inte på våra servrar",
        "Aggregerad, icke-identifierbar användningsstatistik för att förbättra planeraren",
      ],
    },
    {
      heading: "Vad vi inte gör",
      items: [
        "Vi säljer eller hyr aldrig ut personuppgifter",
        "Vi spårar inte din plats i realtid",
        "Vi kräver inget konto för att planera, exportera eller dela en resa",
      ],
    },
    {
      heading: "Dina rättigheter enligt GDPR",
      body: "Som en aktör baserad i Norge/EES följer vi GDPR. Du kan begära tillgång, rättelse, radering, begränsning av behandling, dataportabilitet eller invända mot behandling. Om du rensar din webbläsares lagring tas dina sparade fordon och resor bort omedelbart.",
    },
    {
      heading: "Cookies och analys",
      body: "Vi använder nödvändig lagring för att komma ihåg din region, ditt språk och ditt garage. All analys vi utför är aggregerad och kan inte identifiera dig personligen.",
    },
    {
      heading: "Kontakt",
      body: "Frågor om integritet: kjell@autovere.com — KM TECH LABS. Regionala meddelanden: integritet i USA beskrivs på /us/legal, och kanadensiska PIPEDA- och Québec Law 25-rättigheter beskrivs på /ca/legal.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Integritetspolicy — GDPR, lokal lagring och dina uppgifter | AutoVere",
    description:
      "Hur KM TECH LABS hanterar reseuppgifter, lokalt lagrat garage, cookies och dina rättigheter enligt GDPR på AutoVere.",
  },
};

export const SV_TERMS: InfoPageContent = {
  eyebrow: "Användarvillkor",
  title: "Tydliga villkor, så att du kan planera med förtroende.",
  intro:
    "Genom att använda AutoVere godkänner du dessa villkor. De finns för att ärligt förklara vad en kostnadsuppskattning är — och vad den inte är.",
  sections: [
    {
      heading: "Uppskattningar, inte fakturor",
      body: "Alla kostnader som visas är vägledande uppskattningar baserade på publicerade taxor och genomsnittliga regionala priser. Faktiska vägtullar, vinjetter, bränsle, laddning och färjebiljetter kan variera beroende på fordonsklass, säsong, tid på dygnet och ändringar hos operatörerna. Kontrollera alltid med den officiella portalen innan du reser.",
    },
    {
      heading: "Säker och laglig användning",
      items: [
        "Använd inte AutoVere medan du kör — planera innan du ger dig av",
        "Följ lokala trafikregler, fordonsklassregler samt begränsningar för tunnlar och bergspass",
        "Automatiserad datainsamling, återförsäljning av vårt innehåll eller att framställa det som officiell prissättning är inte tillåtet",
      ],
    },
    {
      heading: "Länkar och tredjepartstjänster",
      body: "Länkar till avgiftsoperatörer, färjebolag och laddningsnätverk ges enbart som en bekvämlighet. Dessa tjänster har egna villkor och priser, och KM TECH LABS ansvarar inte för deras innehåll eller transaktioner.",
    },
    {
      heading: "Ansvar",
      body: "AutoVere tillhandahålls \u201csom det är\u201d. I den utsträckning lagen tillåter ansvarar KM TECH LABS inte för kostnader, böter, missade överfarter eller förluster som uppstår på grund av tillit till en uppskattning.",
    },
    {
      heading: "Tillämplig lag",
      body: "Dessa villkor styrs av norsk lag, utan att det påverkar tvingande konsumentskyddsregler i ditt hemland.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Användarvillkor — Ansvarsfriskrivning för uppskattningar och skälig användning | AutoVere",
    description:
      "AutoVeres användarvillkor från KM TECH LABS: vägledande uppskattningar, säker användning, tredjepartslänkar, ansvar och tillämplig lag.",
  },
};
