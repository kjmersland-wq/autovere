/**
 * Full UI dictionaries for the additional language routes (/se, /dk, /de, /nl, /fr, /pl).
 * Anything missing falls back to English at merge time.
 */

import { DA_DICT } from "@/lib/dict-da";
import { DE_DICT } from "@/lib/dict-de";
import { ES_DICT } from "@/lib/dict-es";
import { FI_DICT } from "@/lib/dict-fi";
import { FR_DICT } from "@/lib/dict-fr";
import { IT_DICT } from "@/lib/dict-it";
import { JA_DICT } from "@/lib/dict-ja";
import { NL_DICT } from "@/lib/dict-nl";
import { PL_DICT } from "@/lib/dict-pl";
import { PT_DICT } from "@/lib/dict-pt";
import { SV_DICT } from "@/lib/dict-sv";
import { US_DICT } from "@/lib/dict-us";
import { ZH_DICT } from "@/lib/dict-zh";

type Dict = Record<string, unknown>;

export const PARTIAL_DICTS: Record<string, Dict> = {
  sv: SV_DICT,
  da: DA_DICT,
  de: DE_DICT,
  nl: NL_DICT,
  fr: FR_DICT,
  pl: PL_DICT,
  es: ES_DICT,
  it: IT_DICT,
  pt: PT_DICT,
  us: US_DICT,
  fi: FI_DICT,
  ja: JA_DICT,
  zh: ZH_DICT,
};

/** Hero copy per language for the localized landing page. */
export const LOCALE_LANDING: Record<
  string,
  { eyebrow: string; title: string; subtitle: string; metaTitle: string; metaDescription: string }
> = {
  sv: {
    eyebrow: "Europa · 30+ länder",
    title: "Planera en gång. Njut av varje kilometer.",
    subtitle:
      "Berätta var du startar och vart du drömmer dig bort — vi sköter vägtullar, vinjetter, bränsle, laddning och färjor.",
    metaTitle: "AutoVere Sverige — Vägtullar, vinjetter och reskostnader",
    metaDescription:
      "Planera bilsemestern med exakta vägtullar, vinjetter, bränsle, laddning och färjor för bil, husbil och motorcykel.",
  },
  da: {
    eyebrow: "Europa · 30+ lande",
    title: "Planlæg én gang. Nyd hver eneste kilometer.",
    subtitle:
      "Fortæl os hvor du starter, og hvor du drømmer dig hen — vi klarer vejafgifter, vignetter, brændstof, opladning og færger.",
    metaTitle: "AutoVere Danmark — Vejafgifter, vignetter og rejseomkostninger",
    metaDescription:
      "Planlæg bilferien med præcise vejafgifter, vignetter, brændstof, opladning og færger for bil, autocamper og motorcykel.",
  },
  de: {
    eyebrow: "Europa · 30+ Länder",
    title: "Einmal planen. Jeden Kilometer genießen.",
    subtitle:
      "Sagen Sie uns, wo Sie starten und wovon Sie träumen — wir übernehmen Maut, Vignetten, Kraftstoff, Laden und Fähren.",
    metaTitle: "AutoVere Deutschland — Maut, Vignetten und Reisekosten",
    metaDescription:
      "Planen Sie Ihre Autoreise mit exakter Maut, Vignetten, Kraftstoff, Ladekosten und Fähren für Auto, Wohnmobil und Motorrad.",
  },
  nl: {
    eyebrow: "Europa · 30+ landen",
    title: "Eén keer plannen. Van elke kilometer genieten.",
    subtitle:
      "Vertel ons waar je start en waar je van droomt — wij regelen tol, vignetten, brandstof, laden en veerboten.",
    metaTitle: "AutoVere Nederland — Tol, vignetten en reiskosten",
    metaDescription:
      "Plan je autovakantie met precieze tol, vignetten, brandstof, laadkosten en veerboten voor auto, camper en motor.",
  },
  fr: {
    eyebrow: "Europe · 30+ pays",
    title: "Planifiez une fois. Savourez chaque kilomètre.",
    subtitle:
      "Dites-nous d'où vous partez et où vous rêvez d'aller — nous gérons péages, vignettes, carburant, recharge et ferries.",
    metaTitle: "AutoVere France — Péages, vignettes et coûts de voyage",
    metaDescription:
      "Planifiez votre road trip avec des péages, vignettes, carburant, recharge et ferries précis pour voiture, camping-car et moto.",
  },
  pl: {
    eyebrow: "Europa · 30+ krajów",
    title: "Zaplanuj raz. Ciesz się każdym kilometrem.",
    subtitle:
      "Powiedz nam, skąd ruszasz i dokąd marzysz dojechać — zajmiemy się opłatami, winietami, paliwem, ładowaniem i promami.",
    metaTitle: "AutoVere Polska — Opłaty drogowe, winiety i koszty podróży",
    metaDescription:
      "Zaplanuj podróż samochodem z dokładnymi opłatami, winietami, paliwem, ładowaniem i promami dla auta, kampera i motocykla.",
  },
  es: {
    eyebrow: "Europa · más de 30 países",
    title: "Planifícalo una vez. Disfruta de cada kilómetro.",
    subtitle:
      "Cuéntanos dónde empiezas y adónde sueñas con llegar — nosotros nos encargamos de los peajes, las viñetas, el combustible, la carga y los ferris.",
    metaTitle: "AutoVere España — Peajes, viñetas y costes de viaje",
    metaDescription:
      "Planifica tu viaje por carretera con peajes, viñetas, combustible, carga y ferris exactos para coches, autocaravanas y motos.",
  },
  it: {
    eyebrow: "Europa · oltre 30 paesi",
    title: "Pianificalo una volta. Goditi ogni chilometro.",
    subtitle:
      "Dicci da dove parti e dove sogni di arrivare — pensiamo noi a pedaggi, vignette, carburante, ricarica e traghetti.",
    metaTitle: "AutoVere Italia — Pedaggi, vignette e costi di viaggio",
    metaDescription:
      "Pianifica il tuo viaggio su strada con pedaggi, vignette, carburante, ricarica e traghetti precisi per auto, camper e moto.",
  },
  no: {
    eyebrow: "Europa · 30+ land",
    title: "Planlegg én gang. Nyt hver kilometer.",
    subtitle:
      "Fortell oss hvor du starter og hvor du drømmer om å reise – vi tar oss av bompenger, ekspressfelt, drivstoff, lading og ferger.",
    metaTitle: "AutoVere Norge — Bompenger, vignetter og reisekostnader",
    metaDescription:
      "Planlegg bilferien med nøyaktige bompenger, vignetter, drivstoff, lading og ferger for bil, bobil og motorsykkel.",
  },
  us: {
    eyebrow: "Europe · 30+ countries",
    title: "Plan it once. Enjoy every mile of the road trip.",
    subtitle:
      "Tell us where you're rolling out from and where you're dreaming of — we'll handle highway passes & toll tags, gas, charging and ferries, so you can hit the road with total peace of mind.",
    metaTitle: "AutoVere — American English Europe Road Trip Planner",
    metaDescription:
      "Plan your European road trip in plain American English — highway passes & toll tags, gas, charging and ferries mapped out for your car, RV or motorcycle.",
  },
  pt: {
    eyebrow: "Europa · mais de 30 países",
    title: "Planeie uma vez. Aproveite cada quilómetro.",
    subtitle:
      "Diga-nos de onde parte e para onde sonha chegar — nós tratamos de portagens, vinhetas, combustível, carregamento e ferries.",
    metaTitle: "AutoVere Portugal — Portagens, vinhetas e custos de viagem",
    metaDescription:
      "Planeie a sua viagem de carro com portagens, vinhetas, combustível, carregamento e ferries calculados com precisão para automóvel, autocaravana e mota.",
  },
  fi: {
    eyebrow: "Eurooppa · yli 30 maata",
    title: "Tee unelmiesi autoreissusta totta – ilman yllätyksiä",
    subtitle:
      "Kaikki tietullit, vinjetit, polttoaine- ja latauskulut selkeästi laskettuna ennen matkaan lähtöä.",
    metaTitle: "AutoVere Suomi – Suunnittele täydellinen automatka Eurooppaan",
    metaDescription:
      "Unohda tietullien ja latauskulujen arvuuttelu. AutoVere laskee koko matkasi kulut etukäteen – helppoa, tarkkaa ja vaivatonta.",
  },
  ja: {
    eyebrow: "ヨーロッパ・カナダ・アメリカ 30か国以上",
    title: "計画は一度、旅の喜びはどこまでも。",
    subtitle:
      "出発地と憧れの目的地を教えてください。通行料金、ビニエット、燃料費、充電費、フェリー代まで、AutoVereがまとめて計算します。",
    metaTitle: "AutoVere 日本語版 — 海外ロードトリップの通行料金・燃料費プランナー",
    metaDescription:
      "ヨーロッパ、カナダ、アメリカのロードトリップを日本語で計画。通行料金、ビニエット、燃料費、充電費、フェリー代まで、車・キャンピングカー・バイク向けに正確に算出します。",
  },
  zh: {
    eyebrow: "欧洲 · 加拿大 · 美国，30 多个国家和地区",
    title: "一次规划，处处安心上路。",
    subtitle: "告诉我们你从哪里出发、想去哪里——过路费、电子通行凭证、燃油、充电和渡轮费用，AutoVere 都帮你提前算好。",
    metaTitle: "AutoVere 中文版 — 海外自驾过路费与油耗规划",
    metaDescription:
      "为你在欧洲、加拿大和美国的自驾之旅提供中文服务，精准计算过路费、电子通行凭证、燃油、充电和渡轮费用，覆盖轿车、房车与摩托车。",
  },
};
