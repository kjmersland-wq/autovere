/**
 * Master switch for all paid checkouts (Trip Pass, Pro, Fleet).
 * Used by the frontend buttons, the server checkout function and the
 * site-wide "payments paused" banner (PurchasesPausedBanner).
 * Set to `true` to re-enable purchases and hide the banner — nothing else needs to change.
 */
export const PURCHASES_ENABLED = false;

const PAUSED: Record<string, string> = {
  en: "New purchases and subscriptions are temporarily paused while we relocate to Poland and set up our new company. Existing users continue as normal. We will reopen in November/December 2026.",
  no: "Nye kjøp og abonnementer er midlertidig satt på pause mens vi flytter til Polen og etablerer vårt nye selskap. Eksisterende brukere fortsetter som normalt. Vi åpner igjen i november/desember 2026.",
  sv: "Nya köp och prenumerationer är tillfälligt pausade medan vi flyttar till Polen och startar vårt nya bolag. Befintliga användare fortsätter som vanligt. Vi öppnar igen i november/december 2026.",
  da: "Nye køb og abonnementer er midlertidigt sat på pause, mens vi flytter til Polen og etablerer vores nye selskab. Eksisterende brugere fortsætter som normalt. Vi åbner igen i november/december 2026.",
  fi: "Uudet ostot ja tilaukset ovat väliaikaisesti tauolla, kun muutamme Puolaan ja perustamme uuden yrityksemme. Nykyiset käyttäjät jatkavat normaalisti. Avaamme uudelleen marras-/joulukuussa 2026.",
  de: "Neue Käufe und Abonnements sind vorübergehend pausiert, während wir nach Polen umziehen und unser neues Unternehmen gründen. Bestehende Nutzer machen wie gewohnt weiter. Wir öffnen wieder im November/Dezember 2026.",
  nl: "Nieuwe aankopen en abonnementen zijn tijdelijk gepauzeerd terwijl we naar Polen verhuizen en ons nieuwe bedrijf opzetten. Bestaande gebruikers gaan gewoon door. We openen weer in november/december 2026.",
  fr: "Les nouveaux achats et abonnements sont temporairement suspendus pendant notre déménagement en Pologne et la création de notre nouvelle société. Les utilisateurs existants continuent normalement. Réouverture en novembre/décembre 2026.",
  pl: "Nowe zakupy i subskrypcje są tymczasowo wstrzymane, ponieważ przenosimy się do Polski i zakładamy nową firmę. Obecni użytkownicy korzystają normalnie. Wznowimy sprzedaż w listopadzie/grudniu 2026.",
  es: "Las nuevas compras y suscripciones están pausadas temporalmente mientras nos trasladamos a Polonia y creamos nuestra nueva empresa. Los usuarios actuales continúan con normalidad. Reabriremos en noviembre/diciembre de 2026.",
  it: "I nuovi acquisti e abbonamenti sono temporaneamente sospesi mentre ci trasferiamo in Polonia e avviamo la nostra nuova società. Gli utenti esistenti continuano normalmente. Riapriremo a novembre/dicembre 2026.",
  pt: "As novas compras e subscrições estão temporariamente em pausa enquanto nos mudamos para a Polónia e criamos a nossa nova empresa. Os utilizadores existentes continuam normalmente. Reabrimos em novembro/dezembro de 2026.",
  ja: "ポーランドへの移転と新会社設立のため、新規購入とサブスクリプションを一時停止しています。既存のユーザーはこれまでどおりご利用いただけます。2026年11月〜12月に再開予定です。",
  zh: "由于我们正在迁往波兰并设立新公司，新的购买和订阅暂时暂停。现有用户可照常使用。我们将于2026年11月/12月重新开放。",
};

export function purchasesPausedMessage(locale?: string): string {
  const key = (locale ?? "en").toLowerCase().split(/[-_]/)[0] ?? "en";
  return PAUSED[key] ?? PAUSED["en"]!;
}
