import type { Locale } from "./i18n";

type PartnerEmailCopy = {
  subject: (organisationName: string) => string;
  heading: string;
  intro: (organisationName: string) => string;
  codeLabel: string;
  discountLabel: string;
  linkLabel: string;
  instructions: string;
  footerLink: string;
  supportLine: string;
};

const en: PartnerEmailCopy = {
  subject: (org) => `AutoVere Partner Program — ${org} is approved!`,
  heading: "Welcome to the AutoVere Partner Program!",
  intro: (org) => `We're delighted to confirm that ${org} is now an official AutoVere partner.`,
  codeLabel: "Your partner code",
  discountLabel: "Member discount",
  linkLabel: "Your partner link",
  instructions: "Share your partner link or code with your members. Anyone who signs up for AutoVere Pro through the link, or enters the code at checkout, automatically gets the discount above — there's nothing for you to set up.",
  footerLink: "Visit AutoVere",
  supportLine: "Questions? Just reply to this email, or reach us at contact@autovere.com.",
};

const de: PartnerEmailCopy = {
  subject: (org) => `AutoVere Partnerprogramm — ${org} ist freigeschaltet!`,
  heading: "Willkommen im AutoVere Partnerprogramm!",
  intro: (org) => `Wir freuen uns, dir zu bestätigen, dass ${org} jetzt offizieller AutoVere-Partner ist.`,
  codeLabel: "Dein Partnercode",
  discountLabel: "Mitgliederrabatt",
  linkLabel: "Dein Partnerlink",
  instructions: "Teile deinen Partnerlink oder -code mit deinen Mitgliedern. Wer sich über den Link für AutoVere Pro anmeldet oder den Code beim Bezahlen eingibt, erhält automatisch den oben genannten Rabatt — du musst nichts weiter einrichten.",
  footerLink: "AutoVere besuchen",
  supportLine: "Fragen? Antworte einfach auf diese E-Mail, oder schreib uns an contact@autovere.com.",
};

const nl: PartnerEmailCopy = {
  subject: (org) => `AutoVere Partnerprogramma — ${org} is goedgekeurd!`,
  heading: "Welkom bij het AutoVere Partnerprogramma!",
  intro: (org) => `We bevestigen graag dat ${org} nu een officiële AutoVere-partner is.`,
  codeLabel: "Jouw partnercode",
  discountLabel: "Ledenkorting",
  linkLabel: "Jouw partnerlink",
  instructions: "Deel je partnerlink of -code met je leden. Iedereen die zich via de link aanmeldt voor AutoVere Pro, of de code invoert bij het afrekenen, krijgt automatisch de korting hierboven — er is niets voor je in te stellen.",
  footerLink: "Bezoek AutoVere",
  supportLine: "Vragen? Beantwoord deze e-mail gewoon, of mail ons op contact@autovere.com.",
};

const no: PartnerEmailCopy = {
  subject: (org) => `AutoVere Partnerprogram — ${org} er godkjent!`,
  heading: "Velkommen til AutoVere Partnerprogram!",
  intro: (org) => `Vi bekrefter med glede at ${org} nå er en offisiell AutoVere-partner.`,
  codeLabel: "Din partnerkode",
  discountLabel: "Medlemsrabatt",
  linkLabel: "Din partnerlenke",
  instructions: "Del partnerlenken eller -koden med medlemmene dine. Alle som melder seg på AutoVere Pro via lenken, eller taster inn koden ved kjøp, får automatisk rabatten over — det er ingenting du trenger å sette opp.",
  footerLink: "Besøk AutoVere",
  supportLine: "Spørsmål? Bare svar på denne e-posten, eller skriv til contact@autovere.com.",
};

const pl: PartnerEmailCopy = {
  subject: (org) => `Program Partnerski AutoVere — ${org} zatwierdzony!`,
  heading: "Witamy w Programie Partnerskim AutoVere!",
  intro: (org) => `Z przyjemnością potwierdzamy, że ${org} jest teraz oficjalnym partnerem AutoVere.`,
  codeLabel: "Twój kod partnera",
  discountLabel: "Zniżka dla członków",
  linkLabel: "Twój link partnerski",
  instructions: "Udostępnij swój link partnerski lub kod swoim członkom. Każdy, kto zarejestruje się w AutoVere Pro przez link lub wpisze kod przy płatności, automatycznie otrzyma powyższą zniżkę — nie musisz nic konfigurować.",
  footerLink: "Odwiedź AutoVere",
  supportLine: "Masz pytania? Po prostu odpowiedz na tego e-maila, lub napisz do nas na contact@autovere.com.",
};

const sv: PartnerEmailCopy = {
  subject: (org) => `AutoVere Partnerprogram — ${org} är godkänt!`,
  heading: "Välkommen till AutoVere Partnerprogram!",
  intro: (org) => `Vi bekräftar gärna att ${org} nu är en officiell AutoVere-partner.`,
  codeLabel: "Din partnerkod",
  discountLabel: "Medlemsrabatt",
  linkLabel: "Din partnerlänk",
  instructions: "Dela din partnerlänk eller -kod med dina medlemmar. Alla som registrerar sig för AutoVere Pro via länken, eller anger koden i kassan, får automatiskt rabatten ovan — det finns inget du behöver ställa in.",
  footerLink: "Besök AutoVere",
  supportLine: "Frågor? Svara bara på det här mejlet, eller skriv till contact@autovere.com.",
};

const fr: PartnerEmailCopy = {
  subject: (org) => `Programme Partenaire AutoVere — ${org} est approuvé !`,
  heading: "Bienvenue dans le Programme Partenaire AutoVere !",
  intro: (org) => `Nous avons le plaisir de confirmer que ${org} est désormais partenaire officiel d'AutoVere.`,
  codeLabel: "Votre code partenaire",
  discountLabel: "Réduction membre",
  linkLabel: "Votre lien partenaire",
  instructions: "Partagez votre lien ou code partenaire avec vos membres. Toute personne qui s'inscrit à AutoVere Pro via le lien, ou saisit le code au moment du paiement, bénéficie automatiquement de la réduction ci-dessus — vous n'avez rien à configurer.",
  footerLink: "Visiter AutoVere",
  supportLine: "Des questions ? Répondez simplement à cet e-mail, ou écrivez-nous à contact@autovere.com.",
};

const da: PartnerEmailCopy = {
  subject: (org) => `AutoVere Partnerprogram — ${org} er godkendt!`,
  heading: "Velkommen til AutoVere Partnerprogram!",
  intro: (org) => `Vi bekræfter med glæde, at ${org} nu er en officiel AutoVere-partner.`,
  codeLabel: "Din partnerkode",
  discountLabel: "Medlemsrabat",
  linkLabel: "Dit partnerlink",
  instructions: "Del dit partnerlink eller din kode med dine medlemmer. Alle, der tilmelder sig AutoVere Pro via linket, eller indtaster koden ved kassen, får automatisk rabatten ovenfor — der er intet, du selv skal sætte op.",
  footerLink: "Besøg AutoVere",
  supportLine: "Spørgsmål? Svar blot på denne e-mail, eller skriv til contact@autovere.com.",
};

const partnerEmailCopy: Record<Locale, PartnerEmailCopy> = { en, de, nl, no, pl, sv, fr, da };

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

export function buildPartnerConfirmationEmail(
  locale: Locale,
  params: { organisationName: string; partnerCode: string; discountPercent: number; partnerLink: string },
): { subject: string; html: string; text: string } {
  const copy = partnerEmailCopy[locale] ?? partnerEmailCopy.en;
  const { organisationName, partnerCode, discountPercent, partnerLink } = params;
  const siteUrl = "https://www.autovere.com";

  const subject = copy.subject(organisationName);
  const text = [
    copy.heading,
    "",
    copy.intro(organisationName),
    "",
    `${copy.codeLabel}: ${partnerCode}`,
    `${copy.discountLabel}: ${discountPercent}%`,
    `${copy.linkLabel}: ${partnerLink}`,
    "",
    copy.instructions,
    "",
    `${copy.footerLink}: ${siteUrl}`,
    copy.supportLine,
  ].join("\n");

  const html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033;max-width:520px">
    <h2 style="margin-bottom:4px">${escapeHtml(copy.heading)}</h2>
    <p>${escapeHtml(copy.intro(organisationName))}</p>
    <table style="margin:20px 0;border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0;color:#667"><strong>${escapeHtml(copy.codeLabel)}</strong></td><td style="padding:4px 0;font-family:monospace;font-size:15px">${escapeHtml(partnerCode)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#667"><strong>${escapeHtml(copy.discountLabel)}</strong></td><td style="padding:4px 0">${discountPercent}%</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#667"><strong>${escapeHtml(copy.linkLabel)}</strong></td><td style="padding:4px 0"><a href="${escapeHtml(partnerLink)}">${escapeHtml(partnerLink)}</a></td></tr>
    </table>
    <p>${escapeHtml(copy.instructions)}</p>
    <hr style="border:none;border-top:1px solid #e2e5ea;margin:20px 0" />
    <p><a href="${siteUrl}">${escapeHtml(copy.footerLink)}</a></p>
    <p style="color:#667;font-size:13px">${escapeHtml(copy.supportLine)}</p>
  </div>`;

  return { subject, html, text };
}
