import type { InfoPageContent } from "@/lib/info-content";

const DISCLAIMER = "Alleen indicatieve schattingen — controleer altijd de officiële portalen.";

export const NL_HOW_IT_WORKS: InfoPageContent = {
  eyebrow: "Hoe het werkt",
  title: "Van een los idee naar een volledig berekende road trip in drie rustige stappen.",
  intro:
    "AutoVere vertaalt een vertrekpunt en een bestemming naar een transparant, grensoverschrijdend kostenoverzicht — tol, vignetten, brandstof, laden en veerboten — voor auto's, campers en toermotoren.",
  sections: [
    {
      heading: "1 — Vertel ons over de reis",
      body: "Vul je vertrekpunt en bestemming in, kies je voertuigtype en brandstof- of energiesoort, en stel routevoorkeuren in zoals panoramische omwegen, tol vermijden of veerboten meenemen.",
      items: [
        "Profielen voor auto, camper/campervan en toermotor",
        "Benzine, diesel of elektrisch met je eigen tank-, batterij- en verbruiksgegevens",
        "Toltags zoals AutoPASS, Telepass, Bip&Go, SunPass of E-ZPass",
      ],
    },
    {
      heading: "2 — Wij berekenen de werkelijke kosten van elke kilometer",
      body: "Elk land of elke staat op je route wordt afzonderlijk berekend, volgens het eigen tolsysteem — elektronische vignetten, afstandsgebonden poorten, stadsringen of tolvrije snelwegen — plus lokale brandstof- en snellaadprijzen.",
      items: [
        "Overzicht van tol en vignetten per land, met details per controlepunt",
        "Motorkortingen waar exploitanten eigen tarieven aanbieden",
        "Veerboten en bergpassen apart weergegeven als aparte kostenposten",
        "Slimme optimalisatie van brandstof en laden met 75% bereikbuffer",
      ],
    },
    {
      heading: "3 — Neem het mee de weg op",
      body: "Download een GPX-bestand voor je navigatie, sla de reis op in Mijn Garage, of deel hem met je reisgenoten. Elke tolpost linkt naar het officiële portaal, zodat je kunt betalen voordat je de grens oversteekt.",
      links: [
        { label: "ASFINAG (Oostenrijk)", url: "https://www.asfinag.at/" },
        { label: "AutoPASS (Noorwegen)", url: "https://www.autopass.no/" },
        { label: "Telepass (Italië)", url: "https://www.telepass.com/" },
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Hoe AutoVere werkt — Kostenplanning voor grensoverschrijdende road trips",
    description:
      "Ontdek hoe AutoVere per land tol, vignetten, brandstof, EV-laden en veerboten berekent voor auto's, campers en toermotoren.",
  },
};

export const NL_PRICING: InfoPageContent = {
  eyebrow: "Prijzen",
  title: "Plan vrij. Upgrade pas wanneer de reis ambitieuzer wordt.",
  intro:
    "Dagelijkse reisplanning is gratis. Betaalde abonnementen zijn voor reizigers die weken achtereen in hun voertuig leven en behoefte hebben aan diepere routeplanning, offline exports en onbeperkt opgeslagen avonturen.",
  sections: [
    {
      heading: "Explorer — Gratis",
      body: "Alles wat je nodig hebt voor een weekendje weg of een reis door twee landen.",
      items: [
        "Onbeperkt aantal reisschattingen in Europa, de VS en Canada",
        "Overzichten van tol, vignetten en veerboten per land en staat",
        "Schattingen van brandstof- en laadkosten met links naar officiële portalen",
        "Tot 3 opgeslagen voertuigen en 5 opgeslagen reizen in Mijn Garage",
      ],
    },
    {
      heading: "Voyager — € 4,90 / maand",
      body: "Voor de lange zomerreis, de fjordentocht en de kust-tot-kustrit.",
      items: [
        "Onbeperkt aantal opgeslagen voertuigen en avonturen",
        "GPX-export met tol- en laadpunten",
        "Slimme tips over brandstofarbitrage en waarschuwingen voor lange trajecten",
        "Prioritaire meldingen bij wijzigingen in tol- of vignetprijzen",
      ],
    },
    {
      heading: "Fleet & Partners — vanaf € 29 / maand",
      body: "Voor verhuurvloten, camperdealers, motorclubs en touroperators.",
      items: [
        "Profielen voor meerdere voertuigen en gedeelde reisplannen voor je team",
        "Reisoverzichten met eigen huisstijl om aan klanten te geven",
        "API-toegang tot kostenschattingen (momenteel in besloten preview)",
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Prijzen — Gratis reisplanning, optioneel Voyager-abonnement | AutoVere",
    description:
      "AutoVere is gratis voor dagelijkse reisplanning. Voyager- en Fleet-abonnementen bieden onbeperkt opgeslagen reizen, GPX-export en partnertools.",
  },
};

export const NL_FAQ: InfoPageContent = {
  eyebrow: "Veelgestelde vragen",
  title: "Alles waar reizigers ons naar vragen voordat ze vertrekken.",
  intro:
    "Eerlijke antwoorden over hoe onze schattingen tot stand komen, waar de data vandaan komt en wat je nog zelf moet regelen.",
  sections: [
    {
      heading: "Hoe nauwkeurig zijn de kostenschattingen?",
      body: "We baseren ons op gepubliceerde toltarieven, vignetprijzen en gemiddelde regionale brandstof- en laadprijzen. Werkelijke kosten veranderen door brandstofmarkten, seizoenstarieven, tijdstip van de dag en voertuigklasse-regels — beschouw elk cijfer dus als een goed onderbouwde indicatie en bevestig het via het officiële portaal voordat je vertrekt.",
    },
    {
      heading: "Verkopen jullie vignetten of tolpassen?",
      body: "Nee. Wij verkopen ze bewust nooit door. Elke tolpost linkt rechtstreeks naar de officiële exploitant — ASFINAG, via.admin.ch, AutoPASS, Telepass, 407 ETR, SunPass en anderen — zodat je altijd de echte prijs betaalt, zonder wederverkopersopslag.",
    },
    {
      heading: "Hoe worden motoren behandeld?",
      body: "Toermotoren worden als eigen voertuigklasse berekend. Waar exploitanten verlaagde motortarieven publiceren, passen we een indicatieve korting toe, Noorse stadsringen worden getoond als gratis voor tweewielers, en je krijgt een speciale veiligheids- en uitrustingsradar voor bergpassen.",
    },
    {
      heading: "Hoe zit het met campers en kampeerauto's?",
      body: "Campers worden waar van toepassing berekend op basis van gewicht en asklasse, en we tonen waarschuwingen voor hoogte, lengte en gewicht bij tunnels, bergpassen en lage bruggen langs de route.",
    },
    {
      heading: "Ondersteunen jullie elektrische voertuigen?",
      body: "Ja. Kies Elektrisch (EV) en voer je batterijcapaciteit en verbruik in. We plannen snellaadstops met een 75% bereikbuffer en tonen de netwerken die je tegenkomt — Ionity, Fastned, Tesla Supercharger, Electrify America en FLO.",
    },
    {
      heading: "Heb ik een account nodig?",
      body: "Nee. Je kunt plannen en exporteren zonder je te registreren. Mijn Garage bewaart je voertuigen en reizen lokaal op je eigen apparaat, zodat er niets je browser verlaat, tenzij je ervoor kiest om het te delen.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "FAQ — Vragen over tol, vignetten, brandstof en EV-laden | AutoVere",
    description:
      "Antwoorden over de nauwkeurigheid van schattingen, officiële tolportalen, motor- en camperklassen, EV-laadplanning en accounts.",
  },
};

export const NL_PARTNERS: InfoPageContent = {
  eyebrow: "Partners",
  title: "Wij werken samen met wie de weg in beweging houdt.",
  intro:
    "AutoVere linkt naar officiële tolexploitanten en werkt samen met reis-, verhuur- en motorbedrijven in Europa, de VS en Canada.",
  sections: [
    {
      heading: "Officiële tol- en vignetexploitanten waarnaar we linken",
      body: "Elke aankoop vindt plaats op de eigen site van de exploitant. Wij treden nooit op als wederverkoper.",
      links: [
        { label: "ASFINAG — Oostenrijk", url: "https://www.asfinag.at/" },
        { label: "via.admin.ch — Zwitserland", url: "https://via.admin.ch/" },
        { label: "AutoPASS — Noorwegen", url: "https://www.autopass.no/" },
        { label: "Telepass — Italië", url: "https://www.telepass.com/" },
        { label: "DARS — Slovenië", url: "https://www.dars.si/" },
        { label: "407 ETR — Ontario", url: "https://www.407etr.com/" },
        { label: "SunPass — Florida", url: "https://www.sunpass.com/" },
      ],
    },
    {
      heading: "Wie er met ons samenwerkt",
      items: [
        "Verhuurvloten van campers en kampeerauto's die transparante reisoffertes willen bieden",
        "Touroperators en motorclubs die alpine en fjordroutes plannen",
        "EV-laadnetwerken en route-planning-apps",
        "Toerismebureaus die panoramische passen, kustwegen en veerbootoversteken promoten",
      ],
    },
    {
      heading: "Werk met ons samen",
      body: "KM TECH LABS is gevestigd in Kristiansand, Noorwegen. Beheer je een vloot, een reisbedrijf of een toldienst en wil je praten over integratie, co-marketing of datapartnerschappen, neem dan contact op via partners@autovere.com.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Partners — Officiële tolexploitanten en reispartners | AutoVere",
    description:
      "AutoVere linkt rechtstreeks naar officiële tol- en vignetexploitanten en werkt samen met verhuurvloten, touroperators en laadnetwerken.",
  },
};

export const NL_PRIVACY: InfoPageContent = {
  eyebrow: "Privacybeleid",
  title: "Jouw route is jouw zaak.",
  intro:
    "AutoVere wordt beheerd door KM TECH LABS, Kristiansand, Noorwegen. We beperken gegevensverzameling tot het minimum dat nodig is om je een nauwkeurige kostenschatting te geven.",
  sections: [
    {
      heading: "Wat we bewaren",
      items: [
        "Reisgegevens (vertrekpunt, bestemming, voertuig en voorkeuren) gebruikt om je schatting te maken",
        "Opgeslagen voertuigen en reizen — lokaal bewaard in je eigen browser, niet op onze servers",
        "Geaggregeerde, niet-identificeerbare gebruiksstatistieken om de planner te verbeteren",
      ],
    },
    {
      heading: "Wat we niet doen",
      items: [
        "We verkopen of verhuren nooit persoonsgegevens",
        "We volgen je live locatie niet",
        "We vereisen geen account om een reis te plannen, exporteren of delen",
      ],
    },
    {
      heading: "Jouw rechten onder de AVG",
      body: "Als aanbieder gevestigd in Noorwegen/EER volgen we de AVG. Je kunt inzage, correctie, verwijdering, beperking, overdraagbaarheid aanvragen, of bezwaar maken tegen verwerking. Het wissen van je browseropslag verwijdert je opgeslagen voertuigen en reizen onmiddellijk.",
    },
    {
      heading: "Cookies en analytics",
      body: "We gebruiken essentiële opslag om je regio, taal en garage te onthouden. Alle analytics die we uitvoeren zijn geaggregeerd en kunnen jou niet individueel identificeren.",
    },
    {
      heading: "Contact",
      body: "Privacyvragen: privacy@autovere.com — KM TECH LABS, Kristiansand, Noorwegen. Regionale kennisgevingen: Amerikaanse privacy staat beschreven op /us/legal, en Canadese PIPEDA- en Québec Wet 25-rechten staan op /ca/legal.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Privacy — AVG, lokale opslag en jouw gegevens | AutoVere",
    description:
      "Hoe KM TECH LABS omgaat met reisgegevens, lokaal opgeslagen garagedata, cookies en jouw AVG-rechten bij AutoVere.",
  },
};

export const NL_TERMS: InfoPageContent = {
  eyebrow: "Gebruiksvoorwaarden",
  title: "Duidelijke voorwaarden, zodat je met vertrouwen kunt plannen.",
  intro:
    "Door AutoVere te gebruiken, ga je akkoord met deze voorwaarden. Ze bestaan om eerlijk uit te leggen wat een kostenschatting is — en wat niet.",
  sections: [
    {
      heading: "Schattingen, geen facturen",
      body: "Alle getoonde kosten zijn indicatieve schattingen gebaseerd op gepubliceerde tarieven en gemiddelde regionale prijzen. Werkelijke tol, vignetten, brandstof, laden en veerboottarieven kunnen verschillen per voertuigklasse, seizoen, tijdstip van de dag en wijzigingen bij exploitanten. Controleer altijd het officiële portaal voordat je vertrekt.",
    },
    {
      heading: "Veilig en wettelijk gebruik",
      items: [
        "Gebruik AutoVere niet tijdens het rijden — plan voordat je vertrekt",
        "Volg de lokale verkeersregels, voertuigklasse-regels en tunnel- of passbeperkingen",
        "Geautomatiseerd scrapen, doorverkopen van onze content of het voorstellen ervan als officiële prijzen is niet toegestaan",
      ],
    },
    {
      heading: "Links en diensten van derden",
      body: "Links naar tolexploitanten, veerbootmaatschappijen en laadnetwerken worden voor het gemak aangeboden. Deze diensten hebben eigen voorwaarden en prijzen, en KM TECH LABS is niet verantwoordelijk voor hun inhoud of transacties.",
    },
    {
      heading: "Aansprakelijkheid",
      body: "AutoVere wordt geleverd \u201czoals het is\u201d. Voor zover wettelijk toegestaan, is KM TECH LABS niet aansprakelijk voor kosten, boetes, gemiste oversteken of verliezen die voortvloeien uit het vertrouwen op een schatting.",
    },
    {
      heading: "Toepasselijk recht",
      body: "Deze voorwaarden worden beheerst door Noors recht, met Kristiansand als overeengekomen locatie, onverminderd dwingende consumentenbescherming in jouw woonland.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Gebruiksvoorwaarden — Disclaimer over schattingen en eerlijk gebruik | AutoVere",
    description:
      "De gebruiksvoorwaarden van AutoVere door KM TECH LABS: indicatieve schattingen, veilig gebruik, links van derden, aansprakelijkheid en toepasselijk recht.",
  },
};
