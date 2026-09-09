import type { Locale } from "@/lib/i18n";

/**
 * Self-contained per-locale copy for the pSEO corridor route pages
 * (/routes/:slug). Mirrors the pattern already used by tour.ts and
 * garage-i18n.ts — a small, hand-translated, self-contained module rather
 * than routing every string through tr(), since the title/meta description
 * need real template functions (word order differs too much between
 * languages for string concatenation to read naturally, especially
 * Japanese/Chinese).
 */
export type SeoRouteCopy = {
  eyebrow: string;
  pageTitle: (origin: string, destination: string, year: number) => string;
  metaDescription: (origin: string, destination: string) => string;
  costSummaryTitle: string;
  costSummaryIntro: string;
  checklistTitle: string;
  vignettesLabel: string;
  ferryLabel: string;
  borderAlertsLabel: string;
  noVignetteNote: string;
  ctaButton: string;
  ferryCardTitle: string;
  ferryCardCta: string;
  distanceLabel: string;
  countriesLabel: string;
  estimateDisclaimer: string;
  faqTitle: string;
  faqQuestions: (origin: string, destination: string) => { q: string; a: string }[];
};

const en: SeoRouteCopy = {
  eyebrow: "Route Cost Guide",
  pageTitle: (o, d, y) => `Toll & Vignette Costs: ${o} to ${d} (${y})`,
  metaDescription: (o, d) =>
    `Plan your ${o} to ${d} road trip with exact tolls, vignettes, fuel and ferry costs for car, RV, EV and motorcycle.`,
  costSummaryTitle: "Cost Summary",
  costSummaryIntro: "Indicative ranges for this corridor — open the planner for an exact, routed cost.",
  checklistTitle: "Checklist",
  vignettesLabel: "Vignettes required",
  ferryLabel: "Ferry options",
  borderAlertsLabel: "Border alerts",
  noVignetteNote: "No vignette required on this corridor.",
  ctaButton: "Open in AutoVere Planner",
  ferryCardTitle: "Book Ferry Crossing",
  ferryCardCta: "Check ferry times & prices",
  distanceLabel: "Distance",
  countriesLabel: "Countries crossed",
  estimateDisclaimer: "Estimates only — your exact route, vehicle and dates will change the real cost. Open the planner above for a precise, routed calculation.",
  faqTitle: "Frequently asked questions",
  faqQuestions: (o, d) => [
    {
      q: `How much are tolls from ${o} to ${d}?`,
      a: `It depends on your vehicle and exact route — see the cost summary above for an indicative range, or open the AutoVere planner for a precise, routed total.`,
    },
    {
      q: `Do I need a vignette for this route?`,
      a: `Check the checklist above — some countries on this corridor require a prepaid vignette instead of (or alongside) distance-based tolls.`,
    },
    {
      q: `Is this route different for an RV or motorhome?`,
      a: `Yes — heavier vehicles usually pay a higher toll and vignette class. The cost summary above breaks this out separately for car, RV, EV and motorcycle.`,
    },
  ],
};

const no: SeoRouteCopy = {
  eyebrow: "Reisekostnadsguide",
  pageTitle: (o, d, y) => `Bompenger og vignetter: ${o} til ${d} (${y})`,
  metaDescription: (o, d) =>
    `Planlegg bilturen fra ${o} til ${d} med nøyaktige bompenger, vignetter, drivstoff og fergekostnader for bil, bobil, elbil og motorsykkel.`,
  costSummaryTitle: "Kostnadsoversikt",
  costSummaryIntro: "Veiledende priser for denne strekningen — åpne planleggeren for en nøyaktig, ruteberegnet kostnad.",
  checklistTitle: "Sjekkliste",
  vignettesLabel: "Nødvendige vignetter",
  ferryLabel: "Fergealternativer",
  borderAlertsLabel: "Grenseinformasjon",
  noVignetteNote: "Ingen vignett kreves på denne strekningen.",
  ctaButton: "Åpne i AutoVere-planleggeren",
  ferryCardTitle: "Bestill fergeovergang",
  ferryCardCta: "Sjekk fergetider og priser",
  distanceLabel: "Distanse",
  countriesLabel: "Land på ruten",
  estimateDisclaimer: "Kun estimater — din egen rute, kjøretøy og datoer endrer den faktiske kostnaden. Åpne planleggeren over for en nøyaktig, ruteberegnet kostnad.",
  faqTitle: "Ofte stilte spørsmål",
  faqQuestions: (o, d) => [
    {
      q: `Hvor mye koster bompenger fra ${o} til ${d}?`,
      a: `Det avhenger av kjøretøy og nøyaktig rute — se kostnadsoversikten over for et veiledende anslag, eller åpne AutoVere-planleggeren for en nøyaktig, ruteberegnet totalsum.`,
    },
    {
      q: `Trenger jeg vignett på denne ruten?`,
      a: `Sjekk sjekklisten over — enkelte land på strekningen krever en forhåndskjøpt vignett i tillegg til eller i stedet for distansebaserte bompenger.`,
    },
    {
      q: `Er ruten annerledes for bobil eller motorsykkel?`,
      a: `Ja — tyngre kjøretøy betaler vanligvis en høyere bom- og vignettklasse. Kostnadsoversikten over viser dette separat for bil, bobil, elbil og motorsykkel.`,
    },
  ],
};

const sv: SeoRouteCopy = {
  eyebrow: "Reskostnadsguide",
  pageTitle: (o, d, y) => `Vägtullar och vinjetter: ${o} till ${d} (${y})`,
  metaDescription: (o, d) =>
    `Planera bilresan från ${o} till ${d} med exakta vägtullar, vinjetter, bränsle- och färjekostnader för bil, husbil, elbil och motorcykel.`,
  costSummaryTitle: "Kostnadsöversikt",
  costSummaryIntro: "Vägledande priser för den här sträckan — öppna planeraren för en exakt, ruttberäknad kostnad.",
  checklistTitle: "Checklista",
  vignettesLabel: "Vinjetter som krävs",
  ferryLabel: "Färjealternativ",
  borderAlertsLabel: "Gränsinformation",
  noVignetteNote: "Ingen vinjett krävs på den här sträckan.",
  ctaButton: "Öppna i AutoVere-planeraren",
  ferryCardTitle: "Boka färjeöverfart",
  ferryCardCta: "Kolla färjetider och priser",
  distanceLabel: "Avstånd",
  countriesLabel: "Länder på rutten",
  estimateDisclaimer: "Endast uppskattningar — din egen rutt, fordon och datum påverkar den faktiska kostnaden. Öppna planeraren ovan för en exakt, ruttberäknad kostnad.",
  faqTitle: "Vanliga frågor",
  faqQuestions: (o, d) => [
    {
      q: `Hur mycket kostar vägtullar från ${o} till ${d}?`,
      a: `Det beror på fordon och exakt rutt — se kostnadsöversikten ovan för en vägledande uppskattning, eller öppna AutoVere-planeraren för en exakt, ruttberäknad totalsumma.`,
    },
    {
      q: `Behöver jag vinjett på den här rutten?`,
      a: `Kolla checklistan ovan — vissa länder på sträckan kräver en förköpt vinjett utöver eller istället för avståndsbaserade vägtullar.`,
    },
    {
      q: `Skiljer sig rutten för husbil eller motorcykel?`,
      a: `Ja — tyngre fordon betalar vanligtvis en högre tull- och vinjettklass. Kostnadsöversikten ovan visar det separat för bil, husbil, elbil och motorcykel.`,
    },
  ],
};

const da: SeoRouteCopy = {
  eyebrow: "Rejseomkostningsguide",
  pageTitle: (o, d, y) => `Vejafgifter og vignetter: ${o} til ${d} (${y})`,
  metaDescription: (o, d) =>
    `Planlæg bilturen fra ${o} til ${d} med præcise vejafgifter, vignetter, brændstof- og færgeomkostninger for bil, autocamper, elbil og motorcykel.`,
  costSummaryTitle: "Omkostningsoversigt",
  costSummaryIntro: "Vejledende priser for denne strækning — åbn planlæggeren for en præcis, ruteberegnet pris.",
  checklistTitle: "Tjekliste",
  vignettesLabel: "Nødvendige vignetter",
  ferryLabel: "Færgemuligheder",
  borderAlertsLabel: "Grænseinformation",
  noVignetteNote: "Ingen vignet kræves på denne strækning.",
  ctaButton: "Åbn i AutoVere-planlæggeren",
  ferryCardTitle: "Book færgeoverfart",
  ferryCardCta: "Tjek færgetider og priser",
  distanceLabel: "Distance",
  countriesLabel: "Lande på ruten",
  estimateDisclaimer: "Kun estimater — din egen rute, køretøj og datoer ændrer den faktiske pris. Åbn planlæggeren ovenfor for en præcis, ruteberegnet pris.",
  faqTitle: "Ofte stillede spørgsmål",
  faqQuestions: (o, d) => [
    {
      q: `Hvor meget koster vejafgifter fra ${o} til ${d}?`,
      a: `Det afhænger af køretøj og præcis rute — se omkostningsoversigten ovenfor for et vejledende estimat, eller åbn AutoVere-planlæggeren for en præcis, ruteberegnet totalsum.`,
    },
    {
      q: `Skal jeg bruge vignet på denne rute?`,
      a: `Tjek tjeklisten ovenfor — nogle lande på strækningen kræver en forudkøbt vignet ud over eller i stedet for distancebaserede vejafgifter.`,
    },
    {
      q: `Er ruten anderledes for autocamper eller motorcykel?`,
      a: `Ja — tungere køretøjer betaler normalt en højere afgifts- og vignetklasse. Omkostningsoversigten ovenfor viser det separat for bil, autocamper, elbil og motorcykel.`,
    },
  ],
};

const de: SeoRouteCopy = {
  eyebrow: "Reisekosten-Ratgeber",
  pageTitle: (o, d, y) => `Maut & Vignette: ${o} nach ${d} (${y})`,
  metaDescription: (o, d) =>
    `Planen Sie Ihre Autoreise von ${o} nach ${d} mit exakter Maut, Vignetten, Kraftstoff- und Fährkosten für Auto, Wohnmobil, Elektroauto und Motorrad.`,
  costSummaryTitle: "Kostenübersicht",
  costSummaryIntro: "Richtwerte für diese Strecke — öffnen Sie den Planer für eine exakte, streckenbezogene Berechnung.",
  checklistTitle: "Checkliste",
  vignettesLabel: "Benötigte Vignetten",
  ferryLabel: "Fähroptionen",
  borderAlertsLabel: "Grenzhinweise",
  noVignetteNote: "Auf dieser Strecke ist keine Vignette erforderlich.",
  ctaButton: "Im AutoVere-Planer öffnen",
  ferryCardTitle: "Fährüberfahrt buchen",
  ferryCardCta: "Fährzeiten & Preise prüfen",
  distanceLabel: "Entfernung",
  countriesLabel: "Durchquerte Länder",
  estimateDisclaimer: "Nur Richtwerte — Ihre genaue Route, Ihr Fahrzeug und Ihr Reisedatum verändern die tatsächlichen Kosten. Öffnen Sie den Planer oben für eine exakte, streckenbezogene Berechnung.",
  faqTitle: "Häufig gestellte Fragen",
  faqQuestions: (o, d) => [
    {
      q: `Wie viel kostet die Maut von ${o} nach ${d}?`,
      a: `Das hängt von Fahrzeug und genauer Route ab — die Kostenübersicht oben zeigt einen Richtwert, oder öffnen Sie den AutoVere-Planer für eine exakte, streckenbezogene Gesamtsumme.`,
    },
    {
      q: `Brauche ich auf dieser Strecke eine Vignette?`,
      a: `Prüfen Sie die Checkliste oben — manche Länder auf dieser Strecke verlangen zusätzlich zur oder statt der streckenbezogenen Maut eine im Voraus gekaufte Vignette.`,
    },
    {
      q: `Ist die Strecke für Wohnmobil oder Motorrad anders?`,
      a: `Ja — schwerere Fahrzeuge zahlen meist eine höhere Maut- und Vignettenklasse. Die Kostenübersicht oben zeigt das getrennt für Auto, Wohnmobil, Elektroauto und Motorrad.`,
    },
  ],
};

const nl: SeoRouteCopy = {
  eyebrow: "Reiskostengids",
  pageTitle: (o, d, y) => `Tol & vignet: ${o} naar ${d} (${y})`,
  metaDescription: (o, d) =>
    `Plan je autorit van ${o} naar ${d} met precieze tol-, vignet-, brandstof- en veerbootkosten voor auto, camper, elektrische auto en motor.`,
  costSummaryTitle: "Kostenoverzicht",
  costSummaryIntro: "Indicatieve bedragen voor dit traject — open de planner voor een exacte, geroute kostenberekening.",
  checklistTitle: "Checklist",
  vignettesLabel: "Vereiste vignetten",
  ferryLabel: "Veerbootopties",
  borderAlertsLabel: "Grensinformatie",
  noVignetteNote: "Op dit traject is geen vignet vereist.",
  ctaButton: "Openen in AutoVere-planner",
  ferryCardTitle: "Boek veerbootovertocht",
  ferryCardCta: "Bekijk veerboottijden & prijzen",
  distanceLabel: "Afstand",
  countriesLabel: "Doorkruiste landen",
  estimateDisclaimer: "Alleen indicaties — je eigen route, voertuig en data veranderen de werkelijke kosten. Open de planner hierboven voor een exacte, geroute berekening.",
  faqTitle: "Veelgestelde vragen",
  faqQuestions: (o, d) => [
    {
      q: `Hoeveel kost tol van ${o} naar ${d}?`,
      a: `Dat hangt af van je voertuig en exacte route — zie het kostenoverzicht hierboven voor een indicatie, of open de AutoVere-planner voor een exact, geroute totaalbedrag.`,
    },
    {
      q: `Heb ik een vignet nodig op dit traject?`,
      a: `Bekijk de checklist hierboven — sommige landen op dit traject vereisen een vooraf gekocht vignet naast of in plaats van afstandsgebonden tol.`,
    },
    {
      q: `Is de route anders voor een camper of motor?`,
      a: `Ja — zwaardere voertuigen betalen meestal een hogere tol- en vignetklasse. Het kostenoverzicht hierboven toont dit apart voor auto, camper, elektrische auto en motor.`,
    },
  ],
};

const fr: SeoRouteCopy = {
  eyebrow: "Guide des coûts de trajet",
  pageTitle: (o, d, y) => `Péages et vignettes : ${o} à ${d} (${y})`,
  metaDescription: (o, d) =>
    `Planifiez votre trajet de ${o} à ${d} avec des péages, vignettes, coûts de carburant et de ferry précis pour voiture, camping-car, véhicule électrique et moto.`,
  costSummaryTitle: "Résumé des coûts",
  costSummaryIntro: "Fourchettes indicatives pour cet itinéraire — ouvrez le planificateur pour un coût exact et calculé sur votre trajet.",
  checklistTitle: "Liste de contrôle",
  vignettesLabel: "Vignettes requises",
  ferryLabel: "Options de ferry",
  borderAlertsLabel: "Alertes frontalières",
  noVignetteNote: "Aucune vignette requise sur cet itinéraire.",
  ctaButton: "Ouvrir dans le planificateur AutoVere",
  ferryCardTitle: "Réserver la traversée en ferry",
  ferryCardCta: "Consulter horaires et tarifs du ferry",
  distanceLabel: "Distance",
  countriesLabel: "Pays traversés",
  estimateDisclaimer: "Estimations uniquement — votre itinéraire, véhicule et dates exacts modifieront le coût réel. Ouvrez le planificateur ci-dessus pour un calcul exact et routé.",
  faqTitle: "Questions fréquentes",
  faqQuestions: (o, d) => [
    {
      q: `Combien coûtent les péages de ${o} à ${d} ?`,
      a: `Cela dépend de votre véhicule et de l'itinéraire exact — consultez le résumé des coûts ci-dessus pour une fourchette indicative, ou ouvrez le planificateur AutoVere pour un total exact et routé.`,
    },
    {
      q: `Ai-je besoin d'une vignette sur cet itinéraire ?`,
      a: `Consultez la liste de contrôle ci-dessus — certains pays de cet itinéraire exigent une vignette prépayée en plus ou à la place des péages basés sur la distance.`,
    },
    {
      q: `L'itinéraire est-il différent pour un camping-car ou une moto ?`,
      a: `Oui — les véhicules plus lourds paient généralement une classe de péage et de vignette plus élevée. Le résumé des coûts ci-dessus le détaille séparément pour voiture, camping-car, véhicule électrique et moto.`,
    },
  ],
};

const pl: SeoRouteCopy = {
  eyebrow: "Przewodnik po kosztach trasy",
  pageTitle: (o, d, y) => `Opłaty drogowe i winiety: ${o} – ${d} (${y})`,
  metaDescription: (o, d) =>
    `Zaplanuj podróż z ${o} do ${d} z dokładnymi opłatami drogowymi, winietami, kosztami paliwa i promu dla samochodu, kampera, auta elektrycznego i motocykla.`,
  costSummaryTitle: "Podsumowanie kosztów",
  costSummaryIntro: "Orientacyjne widełki dla tej trasy — otwórz planer, aby uzyskać dokładny koszt obliczony dla Twojej trasy.",
  checklistTitle: "Lista kontrolna",
  vignettesLabel: "Wymagane winiety",
  ferryLabel: "Opcje promu",
  borderAlertsLabel: "Informacje graniczne",
  noVignetteNote: "Na tej trasie winieta nie jest wymagana.",
  ctaButton: "Otwórz w planerze AutoVere",
  ferryCardTitle: "Zarezerwuj przeprawę promową",
  ferryCardCta: "Sprawdź godziny i ceny promu",
  distanceLabel: "Dystans",
  countriesLabel: "Kraje na trasie",
  estimateDisclaimer: "To tylko szacunki — Twoja dokładna trasa, pojazd i daty zmienią rzeczywisty koszt. Otwórz planer powyżej, aby uzyskać dokładne obliczenie dla Twojej trasy.",
  faqTitle: "Najczęściej zadawane pytania",
  faqQuestions: (o, d) => [
    {
      q: `Ile kosztują opłaty drogowe z ${o} do ${d}?`,
      a: `To zależy od pojazdu i dokładnej trasy — zobacz podsumowanie kosztów powyżej, aby poznać orientacyjny przedział, lub otwórz planer AutoVere, aby uzyskać dokładną sumę obliczoną dla trasy.`,
    },
    {
      q: `Czy na tej trasie potrzebuję winiety?`,
      a: `Sprawdź listę kontrolną powyżej — niektóre kraje na tej trasie wymagają wykupionej wcześniej winiety oprócz lub zamiast opłat naliczanych za dystans.`,
    },
    {
      q: `Czy trasa jest inna dla kampera lub motocykla?`,
      a: `Tak — cięższe pojazdy zwykle płacą wyższą klasę opłat i winiety. Podsumowanie kosztów powyżej pokazuje to osobno dla samochodu, kampera, auta elektrycznego i motocykla.`,
    },
  ],
};

const es: SeoRouteCopy = {
  eyebrow: "Guía de costes de ruta",
  pageTitle: (o, d, y) => `Peajes y viñetas: ${o} a ${d} (${y})`,
  metaDescription: (o, d) =>
    `Planifica tu viaje de ${o} a ${d} con peajes, viñetas, combustible y costes de ferry exactos para coche, autocaravana, coche eléctrico y moto.`,
  costSummaryTitle: "Resumen de costes",
  costSummaryIntro: "Rangos orientativos para este trayecto — abre el planificador para un coste exacto según tu ruta.",
  checklistTitle: "Lista de comprobación",
  vignettesLabel: "Viñetas necesarias",
  ferryLabel: "Opciones de ferry",
  borderAlertsLabel: "Avisos fronterizos",
  noVignetteNote: "No se necesita viñeta en este trayecto.",
  ctaButton: "Abrir en el planificador de AutoVere",
  ferryCardTitle: "Reservar travesía en ferry",
  ferryCardCta: "Consultar horarios y precios del ferry",
  distanceLabel: "Distancia",
  countriesLabel: "Países atravesados",
  estimateDisclaimer: "Solo son estimaciones — tu ruta, vehículo y fechas exactas cambiarán el coste real. Abre el planificador de arriba para un cálculo exacto según tu ruta.",
  faqTitle: "Preguntas frecuentes",
  faqQuestions: (o, d) => [
    {
      q: `¿Cuánto cuestan los peajes de ${o} a ${d}?`,
      a: `Depende del vehículo y de la ruta exacta — consulta el resumen de costes de arriba para un rango orientativo, o abre el planificador de AutoVere para un total exacto según tu ruta.`,
    },
    {
      q: `¿Necesito viñeta en esta ruta?`,
      a: `Consulta la lista de comprobación de arriba — algunos países de este trayecto exigen una viñeta prepagada además de, o en lugar de, los peajes por distancia.`,
    },
    {
      q: `¿La ruta es diferente para una autocaravana o una moto?`,
      a: `Sí — los vehículos más pesados suelen pagar una clase de peaje y viñeta más alta. El resumen de costes de arriba lo muestra por separado para coche, autocaravana, coche eléctrico y moto.`,
    },
  ],
};

const it: SeoRouteCopy = {
  eyebrow: "Guida ai costi del percorso",
  pageTitle: (o, d, y) => `Pedaggi e vignette: ${o} – ${d} (${y})`,
  metaDescription: (o, d) =>
    `Pianifica il viaggio da ${o} a ${d} con pedaggi, vignette, carburante e costi del traghetto precisi per auto, camper, auto elettrica e moto.`,
  costSummaryTitle: "Riepilogo costi",
  costSummaryIntro: "Intervalli indicativi per questo percorso — apri il pianificatore per un costo esatto calcolato sul tuo itinerario.",
  checklistTitle: "Checklist",
  vignettesLabel: "Vignette richieste",
  ferryLabel: "Opzioni traghetto",
  borderAlertsLabel: "Avvisi di frontiera",
  noVignetteNote: "Nessuna vignetta richiesta su questo percorso.",
  ctaButton: "Apri nel pianificatore AutoVere",
  ferryCardTitle: "Prenota la traversata in traghetto",
  ferryCardCta: "Controlla orari e prezzi del traghetto",
  distanceLabel: "Distanza",
  countriesLabel: "Paesi attraversati",
  estimateDisclaimer: "Solo stime — il tuo percorso, veicolo e date esatti cambieranno il costo reale. Apri il pianificatore sopra per un calcolo esatto sul tuo itinerario.",
  faqTitle: "Domande frequenti",
  faqQuestions: (o, d) => [
    {
      q: `Quanto costano i pedaggi da ${o} a ${d}?`,
      a: `Dipende dal veicolo e dal percorso esatto — vedi il riepilogo costi sopra per un intervallo indicativo, oppure apri il pianificatore AutoVere per un totale esatto calcolato sul tuo itinerario.`,
    },
    {
      q: `Mi serve la vignetta su questo percorso?`,
      a: `Controlla la checklist sopra — alcuni paesi su questo percorso richiedono una vignetta prepagata oltre o al posto dei pedaggi basati sulla distanza.`,
    },
    {
      q: `Il percorso è diverso per un camper o una moto?`,
      a: `Sì — i veicoli più pesanti pagano di norma una classe di pedaggio e vignetta più alta. Il riepilogo costi sopra lo mostra separatamente per auto, camper, auto elettrica e moto.`,
    },
  ],
};

const pt: SeoRouteCopy = {
  eyebrow: "Guia de custos da rota",
  pageTitle: (o, d, y) => `Portagens e vinhetas: ${o} a ${d} (${y})`,
  metaDescription: (o, d) =>
    `Planeie a viagem de ${o} a ${d} com portagens, vinhetas, combustível e custos de ferry exatos para automóvel, autocaravana, automóvel elétrico e mota.`,
  costSummaryTitle: "Resumo de custos",
  costSummaryIntro: "Intervalos indicativos para este trajeto — abra o planeador para um custo exato calculado com base na sua rota.",
  checklistTitle: "Lista de verificação",
  vignettesLabel: "Vinhetas necessárias",
  ferryLabel: "Opções de ferry",
  borderAlertsLabel: "Alertas de fronteira",
  noVignetteNote: "Não é necessária vinheta neste trajeto.",
  ctaButton: "Abrir no planeador AutoVere",
  ferryCardTitle: "Reservar travessia de ferry",
  ferryCardCta: "Consultar horários e preços do ferry",
  distanceLabel: "Distância",
  countriesLabel: "Países atravessados",
  estimateDisclaimer: "Apenas estimativas — a sua rota, veículo e datas exatas alterarão o custo real. Abra o planeador acima para um cálculo exato com base na sua rota.",
  faqTitle: "Perguntas frequentes",
  faqQuestions: (o, d) => [
    {
      q: `Quanto custam as portagens de ${o} a ${d}?`,
      a: `Depende do veículo e da rota exata — consulte o resumo de custos acima para um intervalo indicativo, ou abra o planeador AutoVere para um total exato calculado com base na rota.`,
    },
    {
      q: `Preciso de vinheta nesta rota?`,
      a: `Consulte a lista de verificação acima — alguns países neste trajeto exigem uma vinheta pré-paga além de, ou em vez de, portagens baseadas na distância.`,
    },
    {
      q: `A rota é diferente para autocaravana ou mota?`,
      a: `Sim — os veículos mais pesados pagam normalmente uma classe de portagem e vinheta mais elevada. O resumo de custos acima mostra isso separadamente para automóvel, autocaravana, automóvel elétrico e mota.`,
    },
  ],
};

const fi: SeoRouteCopy = {
  eyebrow: "Matkakuluopas",
  pageTitle: (o, d, y) => `Tietullit ja vinjetit: ${o} – ${d} (${y})`,
  metaDescription: (o, d) =>
    `Suunnittele automatka kohteesta ${o} kohteeseen ${d} tarkoilla tietulli-, vinjetti-, polttoaine- ja lauttakuluilla autolle, matkailuautolle, sähköautolle ja moottoripyörälle.`,
  costSummaryTitle: "Kuluyhteenveto",
  costSummaryIntro: "Suuntaa-antavat hintahaarukat tälle reitille — avaa suunnittelija saadaksesi tarkan, reitin mukaan lasketun kustannuksen.",
  checklistTitle: "Tarkistuslista",
  vignettesLabel: "Tarvittavat vinjetit",
  ferryLabel: "Lauttavaihtoehdot",
  borderAlertsLabel: "Rajahuomiot",
  noVignetteNote: "Tälle reitille ei tarvita vinjettiä.",
  ctaButton: "Avaa AutoVere-suunnittelijassa",
  ferryCardTitle: "Varaa lauttamatka",
  ferryCardCta: "Tarkista lauttojen aikataulut ja hinnat",
  distanceLabel: "Etäisyys",
  countriesLabel: "Matkan varrella olevat maat",
  estimateDisclaimer: "Vain arvioita — oma reittisi, ajoneuvosi ja matkapäiväsi muuttavat todellista hintaa. Avaa yllä oleva suunnittelija saadaksesi tarkan, reitin mukaan lasketun hinnan.",
  faqTitle: "Usein kysytyt kysymykset",
  faqQuestions: (o, d) => [
    {
      q: `Paljonko tietullit maksavat väliltä ${o}–${d}?`,
      a: `Se riippuu ajoneuvosta ja tarkasta reitistä — katso yllä oleva kuluyhteenveto suuntaa-antavaa haarukkaa varten, tai avaa AutoVere-suunnittelija saadaksesi tarkan, reitin mukaan lasketun summan.`,
    },
    {
      q: `Tarvitsenko vinjettiä tällä reitillä?`,
      a: `Katso yllä oleva tarkistuslista — jotkin reitin varrella olevat maat edellyttävät etukäteen ostettua vinjettiä matkakohtaisten tietullien lisäksi tai sijaan.`,
    },
    {
      q: `Onko reitti erilainen matkailuautolle tai moottoripyörälle?`,
      a: `Kyllä — painavammat ajoneuvot maksavat yleensä korkeamman tulli- ja vinjettiluokan. Yllä oleva kuluyhteenveto näyttää tämän erikseen autolle, matkailuautolle, sähköautolle ja moottoripyörälle.`,
    },
  ],
};

const ja: SeoRouteCopy = {
  eyebrow: "ルート費用ガイド",
  pageTitle: (o, d, y) => `通行料金・ビニエット：${o}から${d}まで（${y}年）`,
  metaDescription: (o, d) =>
    `${o}から${d}までのドライブを、車・キャンピングカー・EV・バイクそれぞれの正確な通行料金、ビニエット、燃料費、フェリー代とともに計画しましょう。`,
  costSummaryTitle: "料金サマリー",
  costSummaryIntro: "このルートの目安価格です——正確なルート別費用はプランナーでご確認ください。",
  checklistTitle: "チェックリスト",
  vignettesLabel: "必要なビニエット",
  ferryLabel: "フェリーの選択肢",
  borderAlertsLabel: "国境越えの注意事項",
  noVignetteNote: "このルートではビニエットは不要です。",
  ctaButton: "AutoVereプランナーで開く",
  ferryCardTitle: "フェリーを予約する",
  ferryCardCta: "フェリーの時刻表と料金を確認",
  distanceLabel: "距離",
  countriesLabel: "通過する国",
  estimateDisclaimer: "あくまで目安です——実際のルート、車両、日程によって費用は変わります。正確なルート別費用は上のプランナーでご確認ください。",
  faqTitle: "よくある質問",
  faqQuestions: (o, d) => [
    {
      q: `${o}から${d}までの通行料金はいくらですか？`,
      a: `車両や実際のルートによって異なります。上の料金サマリーで目安をご確認いただくか、AutoVereプランナーで正確なルート別合計金額をご確認ください。`,
    },
    {
      q: `このルートでビニエットは必要ですか？`,
      a: `上のチェックリストをご確認ください——このルート上の一部の国では、距離制の通行料金に加えて、または代わりに、事前購入のビニエットが必要です。`,
    },
    {
      q: `キャンピングカーやバイクではルートが異なりますか？`,
      a: `はい——車両重量が大きいほど、通行料金・ビニエットの区分が高くなるのが一般的です。上の料金サマリーで、車・キャンピングカー・EV・バイクごとの料金を個別にご確認いただけます。`,
    },
  ],
};

const zh: SeoRouteCopy = {
  eyebrow: "路线费用指南",
  pageTitle: (o, d, y) => `过路费与电子通行证：${o}至${d}（${y}年）`,
  metaDescription: (o, d) =>
    `规划从${o}到${d}的自驾之旅，获取轿车、房车、电动车和摩托车的精确过路费、电子通行证、燃油及渡轮费用。`,
  costSummaryTitle: "费用概览",
  costSummaryIntro: "以下为本路线的参考区间——请打开规划工具获取按实际路线计算的精确费用。",
  checklistTitle: "出行清单",
  vignettesLabel: "所需电子通行证",
  ferryLabel: "渡轮选择",
  borderAlertsLabel: "边境提示",
  noVignetteNote: "本路线无需电子通行证。",
  ctaButton: "在AutoVere规划工具中打开",
  ferryCardTitle: "预订渡轮",
  ferryCardCta: "查看渡轮时间与票价",
  distanceLabel: "距离",
  countriesLabel: "途经国家",
  estimateDisclaimer: "以上仅为估算——实际路线、车辆及出行日期都会影响真实费用。请使用上方规划工具获取按路线计算的精确费用。",
  faqTitle: "常见问题",
  faqQuestions: (o, d) => [
    {
      q: `从${o}到${d}的过路费大约是多少？`,
      a: `具体费用取决于车辆类型和实际路线——可参考上方费用概览获取大致区间，或打开AutoVere规划工具获取按路线计算的精确总额。`,
    },
    {
      q: `这条路线需要电子通行证吗？`,
      a: `请查看上方出行清单——该路线沿途部分国家除按距离收取的过路费外，还要求提前购买电子通行证，或以其替代过路费。`,
    },
    {
      q: `房车或摩托车的路线费用是否不同？`,
      a: `是的——较重的车辆通常需要支付更高等级的过路费和电子通行证费用。上方费用概览已分别列出轿车、房车、电动车和摩托车的费用。`,
    },
  ],
};

export const SEO_ROUTE_COPY: Partial<Record<Locale, SeoRouteCopy>> = {
  en,
  us: en,
  no,
  sv,
  da,
  de,
  nl,
  fr,
  pl,
  es,
  it,
  pt,
  fi,
  ja,
  zh,
};

export function seoRouteCopy(locale: Locale): SeoRouteCopy {
  return SEO_ROUTE_COPY[locale] ?? en;
}
