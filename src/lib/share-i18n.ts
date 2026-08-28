import type { Locale } from "./i18n";

export const shareLinkCopy: Record<Locale, { copyLink: string; linkCopied: string }> = {
  en: { copyLink: "Copy link to this section", linkCopied: "Link copied" },
  de: { copyLink: "Link zu diesem Abschnitt kopieren", linkCopied: "Link kopiert" },
  nl: { copyLink: "Link naar dit onderdeel kopiëren", linkCopied: "Link gekopieerd" },
  no: { copyLink: "Kopier lenke til denne delen", linkCopied: "Lenke kopiert" },
  pl: { copyLink: "Kopiuj link do tej sekcji", linkCopied: "Link skopiowany" },
  sv: { copyLink: "Kopiera länk till detta avsnitt", linkCopied: "Länk kopierad" },
  fr: { copyLink: "Copier le lien vers cette section", linkCopied: "Lien copié" },
  da: { copyLink: "Kopiér link til dette afsnit", linkCopied: "Link kopieret" },
};
