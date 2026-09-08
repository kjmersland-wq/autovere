/**
 * Opt-in product tour (driver.js).
 * Never auto-starts: `startTour()` is only called from the "Quick tour" pill.
 *
 * Unified 5-step flow for every locale:
 *   1 route + vehicle → 2 official tolls → 3 travel party & stops (14 categories)
 *   → 4 export & navigate → 5 My Garage (save vehicles, saved interests, trips)
 */
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

export const TOUR_SEEN_KEY = "autovere_tour_seen";

type Step = { title: string; description: string };
export type TourCopy = {
  trigger: string;
  next: string;
  prev: string;
  done: string;
  close: string;
  steps: Step[];
};

const EN_STEPS: Step[] = [
  {
    title: "1. Getting Started",
    description:
      "Enter your departure and destination, then select your vehicle type (EV, Motorhome, or Car). We automatically adjust toll classes, weight categories, and range calculations for your route.",
  },
  {
    title: "2. Official Tolls & Vignettes",
    description:
      "Calculate your full trip budget for free with official, verified toll rates and direct links to authorized government vignette portals — no middleman markups.",
  },
  {
    title: "3. Personalize Your Stops (Trip Pass)",
    description:
      "Traveling with family or in an RV? Pick from 14 interest categories — RV services, camping, scenic drives, viewpoints, castles, kids' play, wildlife, food, beaches, adventure and more. Pro and Trip Pass users get those stops injected into the route corridor, the offline PDF kit and every export.",
  },
  {
    title: "4. Export & Navigate",
    description:
      "Take your calculated journey with you. Export turn-by-turn waypoints and official pass warnings directly to Google Maps, Apple Maps, or GPX devices.",
  },
  {
    title: "5. My Garage keeps it all",
    description:
      "Save your vehicles with the Save vehicles button, set your travel party under the “Travel party & stops” tab so every new route reuses those interests, and keep your calculated trips ready to reopen with fresh prices.",
  },
];

export const TOUR_COPY: Record<string, TourCopy> = {
  en: {
    trigger: "💡 Quick tour",
    next: "Next",
    prev: "Back",
    done: "Done",
    close: "Close / Skip",
    steps: EN_STEPS,
  },
  us: {
    trigger: "💡 Quick tour",
    next: "Next",
    prev: "Back",
    done: "Done",
    close: "Close / Skip",
    steps: [
      {
        title: "1. Getting Started",
        description:
          "Enter your departure and destination, then select your vehicle type (EV, RV, or Car). We automatically adjust toll classes, weight categories, and range calculations for your route.",
      },
      EN_STEPS[1]!,
      EN_STEPS[2]!,
      EN_STEPS[3]!,
      EN_STEPS[4]!,
    ],
  },
  no: {
    trigger: "💡 Slik virker det",
    next: "Neste",
    prev: "Tilbake",
    done: "Ferdig",
    close: "Lukk / Hopp over",
    steps: [
      {
        title: "1. Hvor går turen?",
        description:
          "Skriv inn start og mål, og velg kjøretøy — elbil, bobil eller bil. Vi justerer automatisk bomklasse, vektgruppe og rekkeviddeberegning for ruten din.",
      },
      {
        title: "2. Offisielle bompenger og oblater",
        description:
          "Regn ut hele reisebudsjettet gratis, med verifiserte bomsatser og direktelenker til de offisielle portalene — ingen påslag fra mellomledd.",
      },
      {
        title: "3. Reisefølge og stopp (Trip Pass)",
        description:
          "Reiser du med familie eller bobil? Velg blant 14 interessekategorier — bobilservice, camping, naturskjønne veier, utsiktspunkter, slott, lekeplasser, dyreliv, mat, strender, aktiv ferie og mer. Pro og Trip Pass legger stoppene rett inn i ruten, offline-PDF-en og alle eksporter.",
      },
      {
        title: "4. Eksport og navigasjon",
        description:
          "Ta turen med deg. Send veipunkter og varsler om fjelloverganger rett til Google Maps, Apple Maps, Tesla-appen eller GPS-en din som GPX.",
      },
      {
        title: "5. Min Garasje samler alt",
        description:
          "Lagre kjøretøyene med «Lagre kjøretøy»-knappen, velg reisefølget under fanen «Reisefølge og stopp» så interessene brukes på alle nye ruter, og hent frem lagrede turer igjen med ferske priser.",
      },
    ],
  },
  sv: {
    trigger: "💡 Snabbguide",
    next: "Nästa",
    prev: "Tillbaka",
    done: "Klar",
    close: "Stäng / Hoppa över",
    steps: [
      {
        title: "1. Vart går resan?",
        description:
          "Ange start och mål och välj fordon — elbil, husbil eller bil. Vi justerar automatiskt vägtullsklass, viktgrupp och räckvidd för din rutt.",
      },
      {
        title: "2. Officiella vägtullar och vinjetter",
        description:
          "Räkna ut hela resebudgeten gratis, med verifierade tullsatser och direktlänkar till de officiella portalerna — utan mellanhänder.",
      },
      {
        title: "3. Ressällskap och stopp (Trip Pass)",
        description:
          "Reser du med familj eller husbil? Välj bland 14 intressekategorier — husbilsservice, camping, natursköna vägar, utsiktsplatser, slott, lekplatser, djurliv, mat, stränder, äventyr och mer. Pro och Trip Pass lägger in stoppen i rutten, offline-PDF:en och alla exporter.",
      },
      {
        title: "4. Export och navigation",
        description:
          "Ta med dig resan. Skicka waypoints och varningar om bergspass direkt till Google Maps, Apple Maps, Tesla-appen eller din GPS som GPX.",
      },
      {
        title: "5. Mitt Garage samlar allt",
        description:
          "Spara dina fordon med Spara-knappen, välj ressällskap under fliken ”Ressällskap och stopp” så återanvänds intressena på varje ny rutt, och öppna sparade resor igen med aktuella priser.",
      },
    ],
  },
  da: {
    trigger: "💡 Hurtig rundvisning",
    next: "Næste",
    prev: "Tilbage",
    done: "Færdig",
    close: "Luk / Spring over",
    steps: [
      {
        title: "1. Hvor går turen hen?",
        description:
          "Indtast start og destination, og vælg køretøj — elbil, autocamper eller bil. Vi justerer automatisk afgiftsklasse, vægtgruppe og rækkevidde for din rute.",
      },
      {
        title: "2. Officielle vejafgifter og vignetter",
        description:
          "Beregn hele rejsebudgettet gratis med verificerede takster og direkte links til de officielle portaler — uden mellemled.",
      },
      {
        title: "3. Rejsefølge og stop (Trip Pass)",
        description:
          "Rejser du med familie eller autocamper? Vælg mellem 14 interessekategorier — autocamperservice, camping, naturskønne veje, udsigtspunkter, slotte, legepladser, dyreliv, mad, strande, aktiv ferie og mere. Pro og Trip Pass lægger stoppene ind i ruten, offline-PDF'en og alle eksporter.",
      },
      {
        title: "4. Eksport og navigation",
        description:
          "Tag turen med dig. Send waypoints og advarsler om bjergpas direkte til Google Maps, Apple Maps, Tesla-appen eller din GPS som GPX.",
      },
      {
        title: "5. Min Garage samler det hele",
        description:
          "Gem dine køretøjer med Gem-knappen, vælg rejsefølge under fanen “Rejsefølge og stop”, så interesserne bruges på alle nye ruter, og åbn gemte ture igen med friske priser.",
      },
    ],
  },
  de: {
    trigger: "💡 Kurze Tour",
    next: "Weiter",
    prev: "Zurück",
    done: "Fertig",
    close: "Schließen / Überspringen",
    steps: [
      {
        title: "1. Wohin geht die Reise?",
        description:
          "Geben Sie Start und Ziel ein und wählen Sie Ihr Fahrzeug — E-Auto, Wohnmobil oder Pkw. Mautklasse, Gewichtsklasse und Reichweite passen wir automatisch an.",
      },
      {
        title: "2. Offizielle Maut & Vignetten",
        description:
          "Berechnen Sie das komplette Reisebudget kostenlos — mit geprüften Mautsätzen und Direktlinks zu den offiziellen Portalen, ganz ohne Aufschlag.",
      },
      {
        title: "3. Reisegruppe & Stopps (Trip Pass)",
        description:
          "Mit Familie oder Wohnmobil unterwegs? Wählen Sie aus 14 Interessenkategorien — Wohnmobilservice, Camping, Panoramastrecken, Aussichtspunkte, Burgen, Spielplätze, Tierwelt, Essen, Strände, Aktivurlaub und mehr. Pro und Trip Pass fügen diese Stopps in die Route, das Offline-PDF und jeden Export ein.",
      },
      {
        title: "4. Export & Navigation",
        description:
          "Nehmen Sie die Reise mit: Wegpunkte und Passwarnungen direkt an Google Maps, Apple Maps, die Tesla-App oder als GPX an Ihr Navi.",
      },
      {
        title: "5. Meine Garage bewahrt alles",
        description:
          "Speichern Sie Fahrzeuge mit der Speichern-Schaltfläche, legen Sie Ihre Reisegruppe im Tab „Reisegruppe & Stopps“ fest, damit jede neue Route diese Interessen nutzt, und öffnen Sie gespeicherte Reisen jederzeit mit aktuellen Preisen.",
      },
    ],
  },
  nl: {
    trigger: "💡 Korte rondleiding",
    next: "Volgende",
    prev: "Terug",
    done: "Klaar",
    close: "Sluiten / Overslaan",
    steps: [
      {
        title: "1. Waar gaat de reis heen?",
        description:
          "Vul start en bestemming in en kies je voertuig — EV, camper of auto. Tolklasse, gewichtsklasse en actieradius passen we automatisch aan.",
      },
      {
        title: "2. Officiële tol & vignetten",
        description:
          "Bereken je hele reisbudget gratis, met geverifieerde tarieven en directe links naar de officiële portalen — zonder tussenhandel.",
      },
      {
        title: "3. Reisgezelschap & stops (Trip Pass)",
        description:
          "Reis je met familie of een camper? Kies uit 14 interessecategorieën — camperservice, camping, mooie routes, uitzichtpunten, kastelen, speeltuinen, natuur, eten, stranden, avontuur en meer. Pro en Trip Pass zetten die stops in de route, de offline-PDF en elke export.",
      },
      {
        title: "4. Export & navigatie",
        description:
          "Neem de rit mee: waypoints en waarschuwingen voor bergpassen rechtstreeks naar Google Maps, Apple Maps, de Tesla-app of als GPX naar je navigatie.",
      },
      {
        title: "5. Mijn Garage bewaart alles",
        description:
          "Bewaar voertuigen met de opslaan-knop, stel je reisgezelschap in op het tabblad “Reisgezelschap & stops” zodat elke nieuwe route die interesses gebruikt, en open bewaarde ritten opnieuw met actuele prijzen.",
      },
    ],
  },
  fr: {
    trigger: "💡 Visite rapide",
    next: "Suivant",
    prev: "Retour",
    done: "Terminé",
    close: "Fermer / Passer",
    steps: [
      {
        title: "1. Où allez-vous ?",
        description:
          "Saisissez le départ et la destination, puis choisissez votre véhicule — électrique, camping-car ou voiture. Classe de péage, catégorie de poids et autonomie s'ajustent automatiquement.",
      },
      {
        title: "2. Péages et vignettes officiels",
        description:
          "Calculez tout le budget gratuitement, avec des tarifs vérifiés et des liens directs vers les portails officiels — sans intermédiaire ni majoration.",
      },
      {
        title: "3. Compagnons de route et arrêts (Trip Pass)",
        description:
          "Vous voyagez en famille ou en camping-car ? Choisissez parmi 14 catégories d'intérêts — services camping-car, camping, routes panoramiques, points de vue, châteaux, aires de jeux, faune, gastronomie, plages, aventure et plus. Pro et Trip Pass insèrent ces arrêts dans l'itinéraire, le PDF hors ligne et chaque export.",
      },
      {
        title: "4. Export et navigation",
        description:
          "Emportez le voyage : points de passage et alertes de cols directement vers Google Maps, Apple Maps, l'app Tesla ou votre GPS au format GPX.",
      },
      {
        title: "5. Mon Garage garde tout",
        description:
          "Enregistrez vos véhicules avec le bouton dédié, définissez vos compagnons de route dans l'onglet « Compagnons et arrêts » pour que chaque nouvel itinéraire reprenne ces intérêts, et rouvrez vos trajets avec des prix actualisés.",
      },
    ],
  },
  pl: {
    trigger: "💡 Szybki przewodnik",
    next: "Dalej",
    prev: "Wstecz",
    done: "Gotowe",
    close: "Zamknij / Pomiń",
    steps: [
      {
        title: "1. Dokąd jedziesz?",
        description:
          "Wpisz start i cel, a potem wybierz pojazd — elektryk, kamper lub auto. Klasę opłat, kategorię masy i zasięg dobieramy automatycznie.",
      },
      {
        title: "2. Oficjalne opłaty i winiety",
        description:
          "Policz cały budżet podróży za darmo — zweryfikowane stawki i bezpośrednie linki do oficjalnych portali, bez pośredników i narzutów.",
      },
      {
        title: "3. Towarzysze podróży i przystanki (Trip Pass)",
        description:
          "Jedziesz z rodziną albo kamperem? Wybierz spośród 14 kategorii — serwis kamperowy, kempingi, trasy widokowe, punkty widokowe, zamki, place zabaw, przyroda, jedzenie, plaże, aktywny wypoczynek i więcej. Pro i Trip Pass wstawiają te przystanki do trasy, PDF-a offline i każdego eksportu.",
      },
      {
        title: "4. Eksport i nawigacja",
        description:
          "Zabierz trasę ze sobą: punkty i ostrzeżenia o przełęczach prosto do Google Maps, Apple Maps, aplikacji Tesla lub jako GPX do nawigacji.",
      },
      {
        title: "5. Mój Garaż trzyma wszystko",
        description:
          "Zapisz pojazdy przyciskiem zapisu, ustaw towarzyszy podróży w zakładce „Towarzysze i przystanki”, aby każda nowa trasa korzystała z tych zainteresowań, i otwieraj zapisane podróże z aktualnymi cenami.",
      },
    ],
  },
  es: {
    trigger: "💡 Tour rápido",
    next: "Siguiente",
    prev: "Atrás",
    done: "Listo",
    close: "Cerrar / Omitir",
    steps: [
      {
        title: "1. ¿Adónde vas?",
        description:
          "Introduce origen y destino y elige tu vehículo — eléctrico, autocaravana o coche. Ajustamos automáticamente la clase de peaje, la categoría de peso y la autonomía.",
      },
      {
        title: "2. Peajes y viñetas oficiales",
        description:
          "Calcula todo el presupuesto gratis, con tarifas verificadas y enlaces directos a los portales oficiales — sin intermediarios ni recargos.",
      },
      {
        title: "3. Acompañantes y paradas (Trip Pass)",
        description:
          "¿Viajas en familia o en autocaravana? Elige entre 14 categorías de interés — servicios para autocaravana, camping, rutas panorámicas, miradores, castillos, zonas infantiles, naturaleza, gastronomía, playas, aventura y más. Pro y Trip Pass insertan esas paradas en la ruta, el PDF sin conexión y cada exportación.",
      },
      {
        title: "4. Exportar y navegar",
        description:
          "Llévate el viaje: puntos de paso y avisos de puertos de montaña directamente a Google Maps, Apple Maps, la app de Tesla o tu GPS en GPX.",
      },
      {
        title: "5. Mi Garaje lo guarda todo",
        description:
          "Guarda tus vehículos con el botón de guardar, define a tus acompañantes en la pestaña «Acompañantes y paradas» para que cada nueva ruta use esos intereses, y reabre tus viajes con precios actualizados.",
      },
    ],
  },
  it: {
    trigger: "💡 Tour rapido",
    next: "Avanti",
    prev: "Indietro",
    done: "Fatto",
    close: "Chiudi / Salta",
    steps: [
      {
        title: "1. Dove vuoi andare?",
        description:
          "Inserisci partenza e destinazione e scegli il veicolo — elettrico, camper o auto. Classe di pedaggio, categoria di peso e autonomia si adattano da soli.",
      },
      {
        title: "2. Pedaggi e vignette ufficiali",
        description:
          "Calcola gratis l'intero budget, con tariffe verificate e link diretti ai portali ufficiali — senza intermediari né ricarichi.",
      },
      {
        title: "3. Compagni di viaggio e soste (Trip Pass)",
        description:
          "Viaggi in famiglia o in camper? Scegli tra 14 categorie di interesse — servizi camper, campeggi, strade panoramiche, punti panoramici, castelli, aree giochi, natura, cibo, spiagge, avventura e altro. Pro e Trip Pass inseriscono le soste nell'itinerario, nel PDF offline e in ogni esportazione.",
      },
      {
        title: "4. Esporta e naviga",
        description:
          "Porta il viaggio con te: waypoint e avvisi sui valichi direttamente su Google Maps, Apple Maps, app Tesla o come GPX sul navigatore.",
      },
      {
        title: "5. Il Mio Garage conserva tutto",
        description:
          "Salva i veicoli con l'apposito pulsante, imposta i compagni di viaggio nella scheda «Compagni e soste» così ogni nuovo itinerario riusa quegli interessi, e riapri i viaggi salvati con prezzi aggiornati.",
      },
    ],
  },
  fi: {
    trigger: "💡 Pikaopas",
    next: "Seuraava",
    prev: "Takaisin",
    done: "Valmis",
    close: "Sulje / Ohita",
    steps: [
      {
        title: "1. Minne matka?",
        description:
          "Syötä lähtöpaikka ja määränpää ja valitse ajoneuvo — sähköauto, matkailuauto tai auto. Tulliluokka, painoluokka ja toimintamatka säätyvät automaattisesti.",
      },
      {
        title: "2. Viralliset tietullit ja vinjetit",
        description:
          "Laske koko matkabudjetti ilmaiseksi vahvistetuilla maksuilla ja suorilla linkeillä virallisiin portaaleihin — ilman välikäsiä.",
      },
      {
        title: "3. Matkaseurue ja pysähdykset (Trip Pass)",
        description:
          "Matkustatko perheen kanssa tai matkailuautolla? Valitse 14 kiinnostuskategoriasta — matkailuautopalvelut, leirintä, maisematiet, näköalapaikat, linnat, leikkipaikat, luonto, ruoka, rannat, seikkailu ja muut. Pro ja Trip Pass lisäävät pysähdykset reitille, offline-PDF:ään ja jokaiseen vientiin.",
      },
      {
        title: "4. Vienti ja navigointi",
        description:
          "Ota matka mukaan: reittipisteet ja solavaroitukset suoraan Google Mapsiin, Apple Mapsiin, Tesla-sovellukseen tai GPX-tiedostona navigaattoriin.",
      },
      {
        title: "5. Oma Autotalli säilyttää kaiken",
        description:
          "Tallenna ajoneuvot tallennuspainikkeella, valitse matkaseurue ”Matkaseurue ja pysähdykset” -välilehdellä, jolloin jokainen uusi reitti käyttää samoja kiinnostuksia, ja avaa tallennetut matkat uudelleen tuorein hinnoin.",
      },
    ],
  },
  pt: {
    trigger: "💡 Tour rápido",
    next: "Seguinte",
    prev: "Anterior",
    done: "Concluído",
    close: "Fechar / Saltar",
    steps: [
      {
        title: "1. Para onde vai?",
        description:
          "Indique partida e destino e escolha o veículo — elétrico, autocaravana ou automóvel. Classe de portagem, categoria de peso e autonomia ajustam-se automaticamente.",
      },
      {
        title: "2. Portagens e vinhetas oficiais",
        description:
          "Calcule todo o orçamento gratuitamente, com tarifas verificadas e ligações diretas aos portais oficiais — sem intermediários.",
      },
      {
        title: "3. Companheiros e paragens (Trip Pass)",
        description:
          "Viaja em família ou de autocaravana? Escolha entre 14 categorias de interesse — serviços de autocaravana, campismo, estradas panorâmicas, miradouros, castelos, parques infantis, natureza, gastronomia, praias, aventura e mais. Pro e Trip Pass inserem essas paragens na rota, no PDF offline e em todas as exportações.",
      },
      {
        title: "4. Exportar e navegar",
        description:
          "Leve a viagem consigo: pontos de passagem e avisos de passagens de montanha diretamente para Google Maps, Apple Maps, app Tesla ou GPX.",
      },
      {
        title: "5. A Minha Garagem guarda tudo",
        description:
          "Guarde os veículos com o botão de guardar, defina os companheiros no separador “Companheiros e paragens” para que cada nova rota use esses interesses, e reabra viagens guardadas com preços atualizados.",
      },
    ],
  },
  ja: {
    trigger: "💡 使い方ガイド",
    next: "次へ",
    prev: "戻る",
    done: "完了",
    close: "閉じる／スキップ",
    steps: [
      {
        title: "1. 出発地と目的地",
        description:
          "出発地と目的地を入力し、車両（EV・キャンピングカー・乗用車）を選ぶだけです。通行料区分・重量クラス・航続距離は自動で調整されます。",
      },
      {
        title: "2. 公式の通行料とビニエット",
        description:
          "旅費の総額を無料で計算できます。確認済みの料金と、公式ポータルへの直接リンクをご案内します（手数料の上乗せはありません）。",
      },
      {
        title: "3. 同行者と立ち寄り先（Trip Pass）",
        description:
          "家族旅行やキャンピングカーの旅なら、14種類の興味カテゴリー（RV設備、キャンプ、絶景ルート、展望台、城、遊び場、自然、グルメ、ビーチ、アクティビティなど）から選べます。ProとTrip Passでは、選んだ立ち寄り先がルート・オフラインPDF・各種エクスポートに反映されます。",
      },
      {
        title: "4. エクスポートとナビ",
        description:
          "経由地や峠の注意情報を、Google マップ、Apple マップ、Teslaアプリ、GPX対応機器へそのまま送れます。",
      },
      {
        title: "5. マイガレージにすべて保存",
        description:
          "保存ボタンで車両を登録し、「同行者と立ち寄り先」タブで好みを設定すると、次回以降のルートにも自動で反映されます。保存した旅程は最新料金でいつでも再表示できます。",
      },
    ],
  },
  zh: {
    trigger: "💡 使用指南",
    next: "下一步",
    prev: "上一步",
    done: "完成",
    close: "关闭／跳过",
    steps: [
      {
        title: "1. 输入行程",
        description:
          "填写出发地和目的地，并选择车辆类型（电动车、房车或普通轿车）。收费等级、重量分类和续航计算都会自动调整。",
      },
      {
        title: "2. 官方过路费与通行证",
        description: "免费计算完整旅行预算，采用核实过的费率，并直达官方购买portal，绝无中间加价。",
      },
      {
        title: "3. 同行者与途中停靠（Trip Pass）",
        description:
          "与家人同行或开房车？可从 14 类兴趣中选择：房车服务、露营地、风景公路、观景点、城堡、儿童游乐、自然野趣、美食、海滩、户外活动等。Pro 与 Trip Pass 会把这些停靠点直接加入路线、离线 PDF 和所有导出文件。",
      },
      {
        title: "4. 导出与导航",
        description:
          "把行程带上路：途经点和山口提醒可直接发送到 Google 地图、Apple 地图、Tesla 应用，或导出为 GPX。",
      },
      {
        title: "5. 我的车库全部留存",
        description:
          "用保存按钮保存车辆，在“同行者与停靠”标签中设置兴趣，之后每条新路线都会沿用；保存的行程随时可用最新价格重新打开。",
      },
    ],
  },
};

export function tourCopy(locale: string): TourCopy {
  return TOUR_COPY[locale] ?? TOUR_COPY["en"]!;
}

function tourTargets(copy: TourCopy): DriveStep[] {
  const s = (i: number) => copy.steps[i]!;
  return [
    {
      element: '[data-tour="places"]',
      popover: { title: s(0).title, description: s(0).description, side: "bottom" },
    },
    {
      element: '[data-tour="calculate"]',
      popover: { title: s(1).title, description: s(1).description, side: "top", align: "end" },
    },
    {
      element: '[data-tour="personalize-stops"]',
      popover: { title: s(2).title, description: s(2).description, side: "top" },
    },
    {
      element: '[data-tour="export-actions"]',
      popover: { title: s(3).title, description: s(3).description, side: "top" },
    },
    // No element: driver.js centres this final summary card on screen, so it works
    // whether or not the garage link is visible in the current header state.
    {
      popover: { title: s(4).title, description: s(4).description },
    },
  ];
}

/** Launches the tour. Strictly opt-in — call only from an explicit user action. */
export function startTour(locale: string) {
  const copy = tourCopy(locale);
  const markSeen = () => {
    try {
      localStorage.setItem(TOUR_SEEN_KEY, "true");
    } catch {
      /* storage unavailable — tour still works */
    }
  };

  const d = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayOpacity: 0.72,
    stagePadding: 8,
    stageRadius: 16,
    popoverClass: "autovere-tour",
    nextBtnText: copy.next,
    prevBtnText: copy.prev,
    doneBtnText: copy.done,
    progressText: "{{current}} / {{total}}",
    showButtons: ["previous", "next", "close"],
    overlayClickBehavior: "close",
    onPopoverRender: (popover) => {
      const btn = popover.closeButton;
      btn.textContent = copy.close;
      btn.setAttribute("aria-label", copy.close);
      btn.style.width = "auto";
      btn.style.fontSize = "0.75rem";
      btn.style.padding = "0 0.35rem";
    },
    onDestroyed: markSeen,
    steps: tourTargets(copy),
  });

  d.drive();
}
