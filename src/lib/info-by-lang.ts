import {
  GLOBAL_FAQ,
  GLOBAL_HOW_IT_WORKS,
  GLOBAL_PARTNERS,
  GLOBAL_PRICING,
  GLOBAL_PRIVACY,
  GLOBAL_TERMS,
} from "@/lib/global-content";
import { DA_FAQ, DA_HOW_IT_WORKS, DA_PARTNERS, DA_PRICING, DA_PRIVACY, DA_TERMS } from "@/lib/global-content-da";
import { DE_FAQ, DE_HOW_IT_WORKS, DE_PARTNERS, DE_PRICING, DE_PRIVACY, DE_TERMS } from "@/lib/global-content-de";
import { ES_FAQ, ES_HOW_IT_WORKS, ES_PARTNERS, ES_PRICING, ES_PRIVACY, ES_TERMS } from "@/lib/global-content-es";
import { FI_FAQ, FI_HOW_IT_WORKS, FI_PARTNERS, FI_PRIVACY, FI_TERMS } from "@/lib/global-content-fi";
import { FR_FAQ, FR_HOW_IT_WORKS, FR_PARTNERS, FR_PRICING, FR_PRIVACY, FR_TERMS } from "@/lib/global-content-fr";
import { IT_FAQ, IT_HOW_IT_WORKS, IT_PARTNERS, IT_PRICING, IT_PRIVACY, IT_TERMS } from "@/lib/global-content-it";
import { JA_FAQ, JA_HOW_IT_WORKS, JA_PARTNERS, JA_PRICING, JA_PRIVACY, JA_TERMS } from "@/lib/global-content-ja";
import { NO_FAQ, NO_HOW_IT_WORKS, NO_PARTNERS, NO_PRICING, NO_PRIVACY, NO_TERMS } from "@/lib/global-content-no";
import { NL_FAQ, NL_HOW_IT_WORKS, NL_PARTNERS, NL_PRICING, NL_PRIVACY, NL_TERMS } from "@/lib/global-content-nl";
import { PL_FAQ, PL_HOW_IT_WORKS, PL_PARTNERS, PL_PRICING, PL_PRIVACY, PL_TERMS } from "@/lib/global-content-pl";
import { PT_FAQ, PT_HOW_IT_WORKS, PT_PARTNERS, PT_PRICING, PT_PRIVACY, PT_TERMS } from "@/lib/global-content-pt";
import { SV_FAQ, SV_HOW_IT_WORKS, SV_PARTNERS, SV_PRICING, SV_PRIVACY, SV_TERMS } from "@/lib/global-content-sv";
import { ZH_FAQ, ZH_HOW_IT_WORKS, ZH_PARTNERS, ZH_PRICING, ZH_PRIVACY, ZH_TERMS } from "@/lib/global-content-zh";

const EN = {
  faq: GLOBAL_FAQ,
  "how-it-works": GLOBAL_HOW_IT_WORKS,
  pricing: GLOBAL_PRICING,
  partners: GLOBAL_PARTNERS,
  privacy: GLOBAL_PRIVACY,
  terms: GLOBAL_TERMS,
} as const;

export type InfoSet = typeof EN;

/** Info-page content keyed by URL language prefix. */
export const INFO_BY_LANG: Record<string, InfoSet> = {
  pl: { faq: PL_FAQ, "how-it-works": PL_HOW_IT_WORKS, pricing: PL_PRICING, partners: PL_PARTNERS, privacy: PL_PRIVACY, terms: PL_TERMS },
  se: { faq: SV_FAQ, "how-it-works": SV_HOW_IT_WORKS, pricing: SV_PRICING, partners: SV_PARTNERS, privacy: SV_PRIVACY, terms: SV_TERMS },
  dk: { faq: DA_FAQ, "how-it-works": DA_HOW_IT_WORKS, pricing: DA_PRICING, partners: DA_PARTNERS, privacy: DA_PRIVACY, terms: DA_TERMS },
  de: { faq: DE_FAQ, "how-it-works": DE_HOW_IT_WORKS, pricing: DE_PRICING, partners: DE_PARTNERS, privacy: DE_PRIVACY, terms: DE_TERMS },
  no: { faq: NO_FAQ, "how-it-works": NO_HOW_IT_WORKS, pricing: NO_PRICING, partners: NO_PARTNERS, privacy: NO_PRIVACY, terms: NO_TERMS },
  nl: { faq: NL_FAQ, "how-it-works": NL_HOW_IT_WORKS, pricing: NL_PRICING, partners: NL_PARTNERS, privacy: NL_PRIVACY, terms: NL_TERMS },
  fr: { faq: FR_FAQ, "how-it-works": FR_HOW_IT_WORKS, pricing: FR_PRICING, partners: FR_PARTNERS, privacy: FR_PRIVACY, terms: FR_TERMS },
  es: { faq: ES_FAQ, "how-it-works": ES_HOW_IT_WORKS, pricing: ES_PRICING, partners: ES_PARTNERS, privacy: ES_PRIVACY, terms: ES_TERMS },
  it: { faq: IT_FAQ, "how-it-works": IT_HOW_IT_WORKS, pricing: IT_PRICING, partners: IT_PARTNERS, privacy: IT_PRIVACY, terms: IT_TERMS },
  fi: { faq: FI_FAQ, "how-it-works": FI_HOW_IT_WORKS, pricing: GLOBAL_PRICING, partners: FI_PARTNERS, privacy: FI_PRIVACY, terms: FI_TERMS },
  pt: { faq: PT_FAQ, "how-it-works": PT_HOW_IT_WORKS, pricing: PT_PRICING, partners: PT_PARTNERS, privacy: PT_PRIVACY, terms: PT_TERMS },
  ja: { faq: JA_FAQ, "how-it-works": JA_HOW_IT_WORKS, pricing: JA_PRICING, partners: JA_PARTNERS, privacy: JA_PRIVACY, terms: JA_TERMS },
  zh: { faq: ZH_FAQ, "how-it-works": ZH_HOW_IT_WORKS, pricing: ZH_PRICING, partners: ZH_PARTNERS, privacy: ZH_PRIVACY, terms: ZH_TERMS },
};

export function infoForLang(lang: string, page: string) {
  const set = INFO_BY_LANG[lang] ?? EN;
  return set[page as keyof InfoSet] ?? null;
}
