/**
 * Master switch for all paid checkouts (Trip Pass, Pro, Fleet).
 * Used by the frontend buttons, the server checkout function and the
 * site-wide "payments paused" banner (PurchasesPausedBanner).
 * Set to `true` to re-enable purchases and hide the banner — nothing else needs to change.
 */
export const PURCHASES_ENABLED = false;

const PAUSED: Record<string, string> = {
  en: "We are upgrading the site and preparing for our move to Poland. New purchases and subscriptions are temporarily paused, and some features may not work fully right now. Existing users continue as normal. Everything will be online and updated in December/January. Thank you for your patience.",
  no: "Vi oppgraderer nettstedet og forbereder flyttingen vår til Polen. Nye kjøp og abonnementer er midlertidig pausert, og noen funksjoner fungerer ikke fullt ut akkurat nå. Eksisterende brukere fortsetter som normalt. Alt vil være på nett og oppdatert i desember/januar. Takk for tålmodigheten.",
  sv: "Vi uppgraderar webbplatsen och förbereder vår flytt till Polen. Nya köp och prenumerationer är tillfälligt pausade, och vissa funktioner fungerar kanske inte fullt ut just nu. Befintliga användare fortsätter som vanligt. Allt kommer att vara online och uppdaterat i december/januari. Tack för ditt tålamod.",
  da: "Vi opgraderer webstedet og forbereder vores flytning til Polen. Nye køb og abonnementer er midlertidigt sat på pause, og nogle funktioner fungerer muligvis ikke fuldt ud lige nu. Eksisterende brugere fortsætter som normalt. Alt vil være online og opdateret i december/januar. Tak for din tålmodighed.",
  fi: "Päivitämme sivustoa ja valmistaudumme muuttoon Puolaan. Uudet ostot ja tilaukset ovat väliaikaisesti tauolla, ja osa ominaisuuksista ei välttämättä toimi täysin juuri nyt. Nykyiset käyttäjät jatkavat normaalisti. Kaikki on käytössä ja päivitetty joulukuussa/tammikuussa. Kiitos kärsivällisyydestä.",
  de: "Wir aktualisieren die Website und bereiten unseren Umzug nach Polen vor. Neue Käufe und Abonnements sind vorübergehend pausiert, und einige Funktionen funktionieren derzeit möglicherweise nicht vollständig. Bestehende Nutzer machen wie gewohnt weiter. Alles wird im Dezember/Januar wieder online und aktualisiert sein. Danke für Ihre Geduld.",
  nl: "We upgraden de website en bereiden onze verhuizing naar Polen voor. Nieuwe aankopen en abonnementen zijn tijdelijk gepauzeerd, en sommige functies werken op dit moment mogelijk niet volledig. Bestaande gebruikers gaan gewoon door. Alles is in december/januari weer online en bijgewerkt. Bedankt voor uw geduld.",
  fr: "Nous mettons le site à niveau et préparons notre déménagement en Pologne. Les nouveaux achats et abonnements sont temporairement suspendus, et certaines fonctionnalités peuvent ne pas fonctionner pleinement pour le moment. Les utilisateurs existants continuent normalement. Tout sera en ligne et à jour en décembre/janvier. Merci de votre patience.",
  pl: "Ulepszamy stronę i przygotowujemy się do przeprowadzki do Polski. Nowe zakupy i subskrypcje są tymczasowo wstrzymane, a niektóre funkcje mogą obecnie nie działać w pełni. Obecni użytkownicy korzystają normalnie. Wszystko będzie dostępne online i zaktualizowane w grudniu/styczniu. Dziękujemy za cierpliwość.",
  es: "Estamos mejorando el sitio y preparando nuestra mudanza a Polonia. Las nuevas compras y suscripciones están pausadas temporalmente, y algunas funciones pueden no funcionar por completo en este momento. Los usuarios actuales continúan con normalidad. Todo estará en línea y actualizado en diciembre/enero. Gracias por su paciencia.",
  it: "Stiamo aggiornando il sito e preparando il nostro trasferimento in Polonia. I nuovi acquisti e abbonamenti sono temporaneamente sospesi e alcune funzioni potrebbero non funzionare pienamente al momento. Gli utenti esistenti continuano normalmente. Tutto sarà online e aggiornato a dicembre/gennaio. Grazie per la pazienza.",
  pt: "Estamos a atualizar o site e a preparar a nossa mudança para a Polónia. As novas compras e subscrições estão temporariamente em pausa, e algumas funcionalidades podem não funcionar totalmente neste momento. Os utilizadores existentes continuam normalmente. Tudo estará online e atualizado em dezembro/janeiro. Obrigado pela sua paciência.",
  ja: "サイトのアップグレードとポーランドへの移転準備を進めています。新規購入とサブスクリプションは一時停止中で、一部の機能が現在完全に動作しない場合があります。既存のユーザーはこれまでどおりご利用いただけます。12月〜1月にすべてがオンラインで更新される予定です。ご理解とご協力に感謝いたします。",
  zh: "我们正在升级网站并为迁往波兰做准备。新的购买和订阅暂时暂停，部分功能目前可能无法完全使用。现有用户可照常使用。一切将于12月/1月恢复在线并完成更新。感谢您的耐心等待。",
};

export function purchasesPausedMessage(locale?: string): string {
  const key = (locale ?? "en").toLowerCase().split(/[-_]/)[0] ?? "en";
  return PAUSED[key] ?? PAUSED["en"]!;
}
