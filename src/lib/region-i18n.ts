import type { Locale } from "@/lib/i18n";
import type { FuelKey, RegionKey, VehicleKey } from "@/lib/trip-data";

/**
 * Region-specific UI strings, translated per language.
 * Region (eu/us/ca) and language are independent — every region reads from here.
 *
 * `fuels`/`vehicles` are optional per-region overrides of the base locale dict's
 * `hero.fuels`/`hero.vehicles` labels — used so the same language can call the same
 * concept by its correct regional term (e.g. English "Petrol" in Europe vs "Gas" in the
 * US; a motorhome bridged as "Autocaravana / RV" for Spanish speakers driving in the US).
 */
export type RegionStrings = {
  eyebrow: string;
  originHint: string;
  destinationHint: string;
  tollSystems: string[];
  nav: { planner: string; tolls: string; scenic: string; garage: string };
  fuels?: Partial<Record<FuelKey, string>>;
  vehicles?: Partial<Record<VehicleKey, string>>;
};

type RegionPack = Record<RegionKey, RegionStrings>;

const en: RegionPack = {
  eu: {
    eyebrow: "Europe · 30+ countries",
    originHint: "Where are you picking up the car?",
    destinationHint: "Where is the road taking you?",
    tollSystems: ["Vignettes & e-vignettes", "Ticket-based motorway tolls", "Urban low-emission zones"],
    nav: { planner: "Road Trip Planner", tolls: "Tolls & Vignettes", scenic: "Scenic Passes & Ferries", garage: "My Garage" },
  },
  us: {
    eyebrow: "United States · 50 states",
    originHint: "Where are you picking up the car?",
    destinationHint: "Where is the road taking you?",
    tollSystems: ["State toll roads & turnpikes", "HOV / Express lanes", "Bridge & tunnel tolls"],
    nav: { planner: "Road Trip Planner", tolls: "Tolls & Express Lanes", scenic: "Scenic Byways & Ferries", garage: "My Garage" },
    fuels: { petrol: "Gas" },
    vehicles: { motorhome: "RV / Motorhome" },
  },
  ca: {
    eyebrow: "Canada · coast to coast",
    originHint: "Where are you picking up the car?",
    destinationHint: "Where is the road taking you?",
    tollSystems: ["Highway 407 ETR bypass", "Provincial tolls & bridges", "BC Ferries crossings"],
    nav: { planner: "Road Trip Planner", tolls: "Tolls & Bridges", scenic: "Scenic Routes & Ferries", garage: "My Garage" },
    fuels: { petrol: "Gas" },
    vehicles: { motorhome: "RV / Motorhome" },
  },
};

const no: RegionPack = {
  eu: {
    eyebrow: "Europa · 30+ land",
    originHint: "Hvor henter du bilen?",
    destinationHint: "Hvor tar veien deg?",
    tollSystems: ["Vignetter og e-vignetter", "Billettbaserte motorveiavgifter", "Lavutslippssoner i byer"],
    nav: { planner: "Ruteplanlegger", tolls: "Bompenger og vignetter", scenic: "Naturskjønne fjelloverganger og ferger", garage: "Min garasje" },
  },
  us: {
    eyebrow: "USA · 50 delstater",
    originHint: "Hvor henter du bilen?",
    destinationHint: "Hvor tar veien deg?",
    tollSystems: ["Bomveier og turnpikes i delstatene", "HOV-/ekspressfelt", "Bro- og tunnelbompenger"],
    nav: { planner: "Ruteplanlegger", tolls: "Bompenger og ekspressfelt", scenic: "Naturskjønne veier og ferger", garage: "Min garasje" },
    fuels: { petrol: "Bensin" },
    vehicles: { motorhome: "Bobil / RV" },
  },
  ca: {
    eyebrow: "Canada · kyst til kyst",
    originHint: "Hvor henter du bilen?",
    destinationHint: "Hvor tar veien deg?",
    tollSystems: ["Highway 407 ETR-omkjøring", "Provinsielle bompenger og broer", "BC Ferries-overfarter"],
    nav: { planner: "Ruteplanlegger", tolls: "Bompenger og bruer", scenic: "Naturskjønne ruter og ferger", garage: "Min garasje" },
    fuels: { petrol: "Bensin" },
    vehicles: { motorhome: "Bobil / RV" },
  },
};

const fr: RegionPack = {
  eu: {
    eyebrow: "Europe · plus de 30 pays",
    originHint: "Où récupérez-vous la voiture ?",
    destinationHint: "Où la route vous mène-t-elle ?",
    tollSystems: ["Vignettes et e-vignettes", "Péages autoroutiers à ticket", "Zones à faibles émissions urbaines"],
    nav: { planner: "Planificateur de road trip", tolls: "Péages et vignettes", scenic: "Cols panoramiques et ferries", garage: "Mon garage" },
  },
  us: {
    eyebrow: "États-Unis · 50 États",
    originHint: "Où récupérez-vous la voiture ?",
    destinationHint: "Où la route vous mène-t-elle ?",
    tollSystems: ["Autoroutes à péage des États", "Voies HOV / express", "Péages de ponts et tunnels"],
    nav: { planner: "Planificateur de road trip", tolls: "Péages et voies express", scenic: "Routes panoramiques et ferries", garage: "Mon garage" },
    fuels: { petrol: "Essence" },
    vehicles: { motorhome: "Camping-car / RV" },
  },
  ca: {
    eyebrow: "Canada · d'un océan à l'autre",
    originHint: "Où récupérez-vous la voiture ?",
    destinationHint: "Où la route vous mène-t-elle ?",
    tollSystems: ["Contournement de l'autoroute 407 ETR", "Péages et ponts provinciaux", "Traversées BC Ferries"],
    nav: { planner: "Planificateur de road trip", tolls: "Péages et ponts", scenic: "Routes panoramiques et traversiers", garage: "Mon garage" },
    fuels: { petrol: "Essence" },
    vehicles: { motorhome: "VR / Camping-car" },
  },
};

const de: RegionPack = {
  eu: {
    eyebrow: "Europa · über 30 Länder",
    originHint: "Wo holst du das Auto ab?",
    destinationHint: "Wohin führt dich die Straße?",
    tollSystems: ["Vignetten & E-Vignetten", "Ticketbasierte Autobahnmaut", "Städtische Umweltzonen"],
    nav: { planner: "Roadtrip-Planer", tolls: "Maut & Vignetten", scenic: "Panoramapässe & Fähren", garage: "Meine Garage" },
  },
  us: {
    eyebrow: "USA · 50 Bundesstaaten",
    originHint: "Wo holst du das Auto ab?",
    destinationHint: "Wohin führt dich die Straße?",
    tollSystems: ["Mautstraßen & Turnpikes der Bundesstaaten", "HOV-/Express-Spuren", "Brücken- und Tunnelmaut"],
    nav: { planner: "Roadtrip-Planer", tolls: "Maut & Express-Spuren", scenic: "Panoramastraßen & Fähren", garage: "Meine Garage" },
    fuels: { petrol: "Benzin" },
    vehicles: { motorhome: "Wohnmobil / RV" },
  },
  ca: {
    eyebrow: "Kanada · von Küste zu Küste",
    originHint: "Wo holst du das Auto ab?",
    destinationHint: "Wohin führt dich die Straße?",
    tollSystems: ["Highway 407 ETR – Umfahrung", "Provinzielle Maut & Brücken", "BC-Ferries-Überfahrten"],
    nav: { planner: "Roadtrip-Planer", tolls: "Maut & Brücken", scenic: "Panoramarouten & Fähren", garage: "Meine Garage" },
    fuels: { petrol: "Benzin" },
    vehicles: { motorhome: "Wohnmobil / RV" },
  },
};

const nl: RegionPack = {
  eu: {
    eyebrow: "Europa · 30+ landen",
    originHint: "Waar haal je de auto op?",
    destinationHint: "Waar brengt de weg je?",
    tollSystems: ["Vignetten & e-vignetten", "Tolwegen met ticket", "Stedelijke milieuzones"],
    nav: { planner: "Roadtripplanner", tolls: "Tol & vignetten", scenic: "Panoramapassen & veerboten", garage: "Mijn garage" },
  },
  us: {
    eyebrow: "Verenigde Staten · 50 staten",
    originHint: "Waar haal je de auto op?",
    destinationHint: "Waar brengt de weg je?",
    tollSystems: ["Tolwegen & turnpikes per staat", "HOV-/expressstroken", "Brug- en tunneltol"],
    nav: { planner: "Roadtripplanner", tolls: "Tol & expressstroken", scenic: "Panoramaroutes & veerboten", garage: "Mijn garage" },
    fuels: { petrol: "Benzine" },
    vehicles: { motorhome: "Camper / RV" },
  },
  ca: {
    eyebrow: "Canada · van kust tot kust",
    originHint: "Waar haal je de auto op?",
    destinationHint: "Waar brengt de weg je?",
    tollSystems: ["Highway 407 ETR-omleiding", "Provinciale tol & bruggen", "BC Ferries-overtochten"],
    nav: { planner: "Roadtripplanner", tolls: "Tol & bruggen", scenic: "Panoramaroutes & veerboten", garage: "Mijn garage" },
    fuels: { petrol: "Benzine" },
    vehicles: { motorhome: "Camper / RV" },
  },
};

const sv: RegionPack = {
  eu: {
    eyebrow: "Europa · 30+ länder",
    originHint: "Var hämtar du bilen?",
    destinationHint: "Vart tar vägen dig?",
    tollSystems: ["Vinjetter och e-vinjetter", "Biljettbaserade motorvägsavgifter", "Miljözoner i städer"],
    nav: { planner: "Roadtrip-planerare", tolls: "Vägavgifter och vinjetter", scenic: "Panoramapass och färjor", garage: "Mitt garage" },
  },
  us: {
    eyebrow: "USA · 50 delstater",
    originHint: "Var hämtar du bilen?",
    destinationHint: "Vart tar vägen dig?",
    tollSystems: ["Delstatliga betalvägar och turnpikes", "HOV-/expressfiler", "Bro- och tunnelavgifter"],
    nav: { planner: "Roadtrip-planerare", tolls: "Vägavgifter och expressfiler", scenic: "Natursköna vägar och färjor", garage: "Mitt garage" },
    fuels: { petrol: "Bensin" },
    vehicles: { motorhome: "Husbil / RV" },
  },
  ca: {
    eyebrow: "Kanada · kust till kust",
    originHint: "Var hämtar du bilen?",
    destinationHint: "Vart tar vägen dig?",
    tollSystems: ["Highway 407 ETR-förbifart", "Provinsiella vägavgifter och broar", "BC Ferries-överfarter"],
    nav: { planner: "Roadtrip-planerare", tolls: "Vägavgifter och broar", scenic: "Natursköna rutter och färjor", garage: "Mitt garage" },
    fuels: { petrol: "Bensin" },
    vehicles: { motorhome: "Husbil / RV" },
  },
};

const da: RegionPack = {
  eu: {
    eyebrow: "Europa · 30+ lande",
    originHint: "Hvor henter du bilen?",
    destinationHint: "Hvor bringer vejen dig?",
    tollSystems: ["Vignetter og e-vignetter", "Billetbaserede motorvejsafgifter", "Miljøzoner i byerne"],
    nav: { planner: "Roadtrip-planlægger", tolls: "Vejafgifter og vignetter", scenic: "Panoramapas og færger", garage: "Min garage" },
  },
  us: {
    eyebrow: "USA · 50 delstater",
    originHint: "Hvor henter du bilen?",
    destinationHint: "Hvor bringer vejen dig?",
    tollSystems: ["Delstatslige betalingsveje og turnpikes", "HOV-/ekspresbaner", "Bro- og tunnelafgifter"],
    nav: { planner: "Roadtrip-planlægger", tolls: "Vejafgifter og ekspresbaner", scenic: "Naturskønne veje og færger", garage: "Min garage" },
    fuels: { petrol: "Benzin" },
    vehicles: { motorhome: "Autocamper / RV" },
  },
  ca: {
    eyebrow: "Canada · kyst til kyst",
    originHint: "Hvor henter du bilen?",
    destinationHint: "Hvor bringer vejen dig?",
    tollSystems: ["Highway 407 ETR-omfartsvej", "Provinsielle vejafgifter og broer", "BC Ferries-overfarter"],
    nav: { planner: "Roadtrip-planlægger", tolls: "Vejafgifter og broer", scenic: "Naturskønne ruter og færger", garage: "Min garage" },
    fuels: { petrol: "Benzin" },
    vehicles: { motorhome: "Autocamper / RV" },
  },
};

const pl: RegionPack = {
  eu: {
    eyebrow: "Europa · ponad 30 krajów",
    originHint: "Gdzie odbierasz auto?",
    destinationHint: "Dokąd prowadzi Cię droga?",
    tollSystems: ["Winiety i e-winiety", "Autostrady biletowe", "Miejskie strefy czystego transportu"],
    nav: { planner: "Planer podróży", tolls: "Opłaty i winiety", scenic: "Widokowe przełęcze i promy", garage: "Mój garaż" },
  },
  us: {
    eyebrow: "USA · 50 stanów",
    originHint: "Gdzie odbierasz auto?",
    destinationHint: "Dokąd prowadzi Cię droga?",
    tollSystems: ["Stanowe drogi płatne i turnpike", "Pasy HOV / ekspresowe", "Opłaty za mosty i tunele"],
    nav: { planner: "Planer podróży", tolls: "Opłaty i pasy ekspresowe", scenic: "Trasy widokowe i promy", garage: "Mój garaż" },
    fuels: { petrol: "Benzyna" },
    vehicles: { motorhome: "Kamper / RV" },
  },
  ca: {
    eyebrow: "Kanada · od oceanu do oceanu",
    originHint: "Gdzie odbierasz auto?",
    destinationHint: "Dokąd prowadzi Cię droga?",
    tollSystems: ["Objazd autostradą 407 ETR", "Prowincjonalne opłaty i mosty", "Przeprawy BC Ferries"],
    nav: { planner: "Planer podróży", tolls: "Opłaty i mosty", scenic: "Trasy widokowe i promy", garage: "Mój garaż" },
    fuels: { petrol: "Benzyna" },
    vehicles: { motorhome: "Kamper / RV" },
  },
};

const es: RegionPack = {
  eu: {
    eyebrow: "Europa · más de 30 países",
    originHint: "¿Dónde recoges el coche?",
    destinationHint: "¿Adónde te lleva la carretera?",
    tollSystems: ["Viñetas y viñetas electrónicas", "Peajes de autopista por ticket", "Zonas urbanas de bajas emisiones"],
    nav: { planner: "Planificador de viajes", tolls: "Peajes y viñetas", scenic: "Puertos panorámicos y ferris", garage: "Mi garaje" },
  },
  us: {
    eyebrow: "Estados Unidos · 50 estados",
    originHint: "¿Dónde recoges el coche?",
    destinationHint: "¿Adónde te lleva la carretera?",
    tollSystems: ["Autopistas de peaje estatales y turnpikes", "Carriles HOV / exprés", "Peajes de puentes y túneles"],
    nav: { planner: "Planificador de viajes", tolls: "Peajes y carriles exprés", scenic: "Rutas panorámicas y ferris", garage: "Mi garaje" },
    fuels: { petrol: "Gasolina" },
    vehicles: { motorhome: "Autocaravana / RV" },
  },
  ca: {
    eyebrow: "Canadá · de costa a costa",
    originHint: "¿Dónde recoges el coche?",
    destinationHint: "¿Adónde te lleva la carretera?",
    tollSystems: ["Circunvalación de peaje Highway 407 ETR", "Peajes y puentes provinciales", "Travesías de BC Ferries"],
    nav: { planner: "Planificador de viajes", tolls: "Peajes y puentes", scenic: "Rutas panorámicas y ferris", garage: "Mi garaje" },
    fuels: { petrol: "Gasolina" },
    vehicles: { motorhome: "Autocaravana / RV" },
  },
};

const it: RegionPack = {
  eu: {
    eyebrow: "Europa · oltre 30 paesi",
    originHint: "Dove ritiri l'auto?",
    destinationHint: "Dove ti porta la strada?",
    tollSystems: ["Vignette ed e-vignette", "Pedaggi autostradali a biglietto", "Zone a basse emissioni urbane"],
    nav: { planner: "Pianificatore di viaggio", tolls: "Pedaggi e vignette", scenic: "Passi panoramici e traghetti", garage: "Il mio garage" },
  },
  us: {
    eyebrow: "Stati Uniti · 50 stati",
    originHint: "Dove ritiri l'auto?",
    destinationHint: "Dove ti porta la strada?",
    tollSystems: ["Autostrade a pedaggio statali e turnpike", "Corsie HOV / express", "Pedaggi di ponti e tunnel"],
    nav: { planner: "Pianificatore di viaggio", tolls: "Pedaggi e corsie express", scenic: "Strade panoramiche e traghetti", garage: "Il mio garage" },
    fuels: { petrol: "Benzina" },
    vehicles: { motorhome: "Camper / RV" },
  },
  ca: {
    eyebrow: "Canada · da costa a costa",
    originHint: "Dove ritiri l'auto?",
    destinationHint: "Dove ti porta la strada?",
    tollSystems: ["Circonvallazione a pedaggio Highway 407 ETR", "Pedaggi e ponti provinciali", "Traversate BC Ferries"],
    nav: { planner: "Pianificatore di viaggio", tolls: "Pedaggi e ponti", scenic: "Percorsi panoramici e traghetti", garage: "Il mio garage" },
    fuels: { petrol: "Benzina" },
    vehicles: { motorhome: "Camper / RV" },
  },
};

const us: RegionPack = {
  eu: {
    eyebrow: "Europe · 30+ countries",
    originHint: "Where are you picking up the car?",
    destinationHint: "Where is the road taking you?",
    tollSystems: [
      "Digital vignettes & toll stickers",
      "Ticket-based motorway tolls",
      "Restricted City Zones (ZTL / Clean Air)",
    ],
    nav: { planner: "Road Trip Planner", tolls: "Tolls & Toll Passes", scenic: "Scenic Passes & Ferries", garage: "My Garage" },
    fuels: { petrol: "Gas" },
    vehicles: { motorhome: "RV / Camper" },
  },
  us: {
    eyebrow: "United States · 50 states",
    originHint: "Where are you picking up the car?",
    destinationHint: "Where is the road taking you?",
    tollSystems: ["State toll roads & turnpikes", "HOV / Express lanes", "Bridge & tunnel tolls"],
    nav: { planner: "Road Trip Planner", tolls: "Tolls & Express Lanes", scenic: "Scenic Byways & Ferries", garage: "My Garage" },
    fuels: { petrol: "Gas" },
    vehicles: { motorhome: "RV / Camper" },
  },
  ca: {
    eyebrow: "Canada · coast to coast",
    originHint: "Where are you picking up the car?",
    destinationHint: "Where is the road taking you?",
    tollSystems: ["Highway 407 ETR bypass", "Provincial tolls & bridges", "BC Ferries crossings"],
    nav: { planner: "Road Trip Planner", tolls: "Tolls & Bridges", scenic: "Scenic Routes & Ferries", garage: "My Garage" },
    fuels: { petrol: "Gas" },
    vehicles: { motorhome: "RV / Camper" },
  },
};

const fi: RegionPack = {
  eu: {
    eyebrow: "Eurooppa · yli 30 maata",
    originHint: "Mistä haet auton?",
    destinationHint: "Minne tie sinut vie?",
    tollSystems: ["Vinjetit ja e-vinjetit", "Lipulliset moottoritietullit", "Kaupunkien matalapäästöalueet"],
    nav: { planner: "Suunnittele oma matkasi", tolls: "Tietullit ja vinjetit", scenic: "Maisemareitit ja lautat", garage: "Oma autotalli" },
  },
  us: {
    eyebrow: "Yhdysvallat · 50 osavaltiota",
    originHint: "Mistä haet auton?",
    destinationHint: "Minne tie sinut vie?",
    tollSystems: ["Osavaltioiden maksulliset moottoritiet", "HOV- / pikakaistat", "Silta- ja tunnelitullit"],
    nav: { planner: "Suunnittele oma matkasi", tolls: "Tietullit ja pikakaistat", scenic: "Maisemareitit ja lautat", garage: "Oma autotalli" },
    fuels: { petrol: "Bensiini" },
    vehicles: { motorhome: "Matkailuauto / RV" },
  },
  ca: {
    eyebrow: "Kanada · rannikolta rannikolle",
    originHint: "Mistä haet auton?",
    destinationHint: "Minne tie sinut vie?",
    tollSystems: ["Highway 407 ETR -kiertotie", "Provinssien tullit ja sillat", "BC Ferries -ylitykset"],
    nav: { planner: "Suunnittele oma matkasi", tolls: "Tietullit ja sillat", scenic: "Maisemareitit ja lautat", garage: "Oma autotalli" },
    fuels: { petrol: "Bensiini" },
    vehicles: { motorhome: "Matkailuauto / RV" },
  },
};

const pt: RegionPack = {
  eu: {
    eyebrow: "Europa · mais de 30 países",
    originHint: "Onde vai levantar o carro?",
    destinationHint: "Para onde o leva a estrada?",
    tollSystems: ["Vinhetas e vinhetas eletrónicas", "Portagens de autoestrada com bilhete", "Zonas urbanas de baixas emissões"],
    nav: { planner: "Planeador de Viagens", tolls: "Portagens e Vinhetas", scenic: "Passos Panorâmicos e Ferries", garage: "A Minha Garagem" },
  },
  us: {
    eyebrow: "Estados Unidos · 50 estados",
    originHint: "Onde vai levantar o carro?",
    destinationHint: "Para onde o leva a estrada?",
    tollSystems: ["Autoestradas com portagem estatais", "Vias HOV / Express", "Portagens de pontes e túneis"],
    nav: { planner: "Planeador de Viagens", tolls: "Portagens e Vias Express", scenic: "Estradas Panorâmicas e Ferries", garage: "A Minha Garagem" },
    fuels: { petrol: "Gasolina" },
    vehicles: { motorhome: "Autocaravana / RV" },
  },
  ca: {
    eyebrow: "Canadá · de costa a costa",
    originHint: "Onde vai levantar o carro?",
    destinationHint: "Para onde o leva a estrada?",
    tollSystems: ["Contorno com portagem da Highway 407 ETR", "Portagens e pontes provinciais", "Travessias da BC Ferries"],
    nav: { planner: "Planeador de Viagens", tolls: "Portagens e Pontes", scenic: "Rotas Panorâmicas e Ferries", garage: "A Minha Garagem" },
    fuels: { petrol: "Gasolina" },
    vehicles: { motorhome: "Autocaravana / RV" },
  },
};

const ja: RegionPack = {
  eu: {
    eyebrow: "ヨーロッパ・30か国以上",
    originHint: "車の受け取り場所はどちらですか？",
    destinationHint: "この旅は、どこへ向かいますか？",
    tollSystems: ["ビニエット・電子ビニエット", "チケット制の高速道路料金", "都市部の低排出ガスゾーン"],
    nav: { planner: "ロードトリッププランナー", tolls: "通行料金・ビニエット", scenic: "絶景の峠道・フェリー", garage: "マイガレージ" },
  },
  us: {
    eyebrow: "アメリカ・50州",
    originHint: "車の受け取り場所はどちらですか？",
    destinationHint: "この旅は、どこへ向かいますか？",
    tollSystems: ["州営の有料道路・ターンパイク", "HOV・エクスプレスレーン", "橋・トンネルの通行料金"],
    nav: { planner: "ロードトリッププランナー", tolls: "通行料金・エクスプレスレーン", scenic: "絶景ルート・フェリー", garage: "マイガレージ" },
    fuels: { petrol: "ガソリン" },
    vehicles: { motorhome: "キャンピングカー" },
  },
  ca: {
    eyebrow: "カナダ・大西洋から太平洋まで",
    originHint: "車の受け取り場所はどちらですか？",
    destinationHint: "この旅は、どこへ向かいますか？",
    tollSystems: ["ハイウェイ407 ETRのバイパス", "州・準州の通行料金と橋", "BCフェリーの航路"],
    nav: { planner: "ロードトリッププランナー", tolls: "通行料金・橋", scenic: "絶景ルート・フェリー", garage: "マイガレージ" },
    fuels: { petrol: "ガソリン" },
    vehicles: { motorhome: "キャンピングカー" },
  },
};

const zh: RegionPack = {
  eu: {
    eyebrow: "欧洲 · 30多个国家",
    originHint: "您计划在哪里取车？",
    destinationHint: "这段旅程将带您去向何方？",
    tollSystems: ["电子通行证与纸质通行证", "按票计费的高速公路过路费", "城市低排放限行区"],
    nav: { planner: "自驾路线规划", tolls: "过路费与电子通行证", scenic: "绝美山口与渡轮", garage: "我的车库" },
  },
  us: {
    eyebrow: "美国 · 50个州",
    originHint: "您计划在哪里取车？",
    destinationHint: "这段旅程将带您去向何方？",
    tollSystems: ["各州收费公路", "HOV/快速通道", "桥梁与隧道过路费"],
    nav: { planner: "自驾路线规划", tolls: "过路费与快速通道", scenic: "绝美景观公路与渡轮", garage: "我的车库" },
    fuels: { petrol: "汽油" },
    vehicles: { motorhome: "房车" },
  },
  ca: {
    eyebrow: "加拿大 · 横跨东西海岸",
    originHint: "您计划在哪里取车？",
    destinationHint: "这段旅程将带您去向何方？",
    tollSystems: ["407高速公路ETR绕行路段", "省级过路费与桥梁", "卑诗渡轮（BC Ferries）航线"],
    nav: { planner: "自驾路线规划", tolls: "过路费与桥梁", scenic: "绝美景观路线与渡轮", garage: "我的车库" },
    fuels: { petrol: "汽油" },
    vehicles: { motorhome: "房车" },
  },
};

const PACKS: Record<Locale, RegionPack> = { en, no, sv, da, de, nl, fr, pl, es, it, us, fi, pt, ja, zh };

export function regionStrings(locale: Locale, region: RegionKey): RegionStrings {
  return (PACKS[locale] ?? en)[region];
}
