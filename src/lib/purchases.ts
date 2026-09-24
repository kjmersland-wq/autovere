/**
 * Master switch for all paid checkouts (Trip Pass, Pro, Fleet).
 * Used by both the frontend buttons and the server checkout function.
 * Set to `true` to re-enable purchases — nothing else needs to change.
 */
export const PURCHASES_ENABLED = true;

const PAUSED: Record<string, string> = {
  en: "Paid plans are paused for a short while as we set up in Poland. Everything free works as normal.",
  no: "Betalte planer er midlertidig satt på pause mens vi etablerer oss i Polen. Alt som er gratis fungerer som normalt.",
  sv: "Betalplaner är pausade en kort tid medan vi etablerar oss i Polen. Allt som är gratis fungerar som vanligt.",
  da: "Betalte planer er sat på pause i en kort periode, mens vi etablerer os i Polen. Alt gratis fungerer som normalt.",
  fi: "Maksulliset tilaukset ovat hetken tauolla, kun perustamme toimintaa Puolaan. Kaikki ilmainen toimii normaalisti.",
  de: "Bezahlpläne sind kurzzeitig pausiert, während wir uns in Polen aufstellen. Alles Kostenlose funktioniert wie gewohnt.",
  nl: "Betaalde abonnementen zijn even gepauzeerd terwijl we ons in Polen vestigen. Alles wat gratis is werkt gewoon.",
  fr: "Les offres payantes sont suspendues pour une courte période, le temps de notre installation en Pologne. Tout ce qui est gratuit fonctionne normalement.",
  pl: "Płatne plany są na krótko wstrzymane, ponieważ zakładamy działalność w Polsce. Wszystko, co darmowe, działa normalnie.",
  es: "Los planes de pago están en pausa por poco tiempo mientras nos establecemos en Polonia. Todo lo gratuito funciona con normalidad.",
  it: "I piani a pagamento sono sospesi per un breve periodo mentre ci stabiliamo in Polonia. Tutto ciò che è gratuito funziona normalmente.",
  pt: "Os planos pagos estão em pausa por pouco tempo enquanto nos estabelecemos na Polónia. Tudo o que é gratuito funciona normalmente.",
  ja: "ポーランドでの事業準備のため、有料プランを一時的に停止しています。無料機能はこれまでどおりご利用いただけます。",
  zh: "由于我们正在波兰设立业务，付费方案暂时暂停。所有免费功能照常可用。",
};

export function purchasesPausedMessage(locale?: string): string {
  const key = (locale ?? "en").toLowerCase().split(/[-_]/)[0] ?? "en";
  return PAUSED[key] ?? PAUSED["en"]!;
}
