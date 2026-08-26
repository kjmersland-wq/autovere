import type { Locale } from "./i18n";

export type AccountCopy = {
  nav: { overview: string; trips: string; vehicles: string; preferences: string; billing: string; places: string; profile: string };
  backToPlanner: string;
  eyebrow: string;
  title: string;
  welcome: (name: string) => string;
  subtitleActive: string;
  subtitleFree: string;
  loading: string;
  loggedOut: { message: string; signIn: string };
  plan: { free: string; status: string; active: string; trialing: string; billedMonthly: string; billedYearly: string; cancelsAtPeriodEnd: string; renewsOn: (date: string) => string; noSubscription: string };
  actions: { viewPlans: string; manageBilling: string; signOut: string; signingOut: string };
  unlocked: { title: string; upgradeTitle: string; upgradeCta: string };
  billing: { title: string; plan: string; price: string; renewsOn: string; paymentMethod: string; noPaymentMethod: string; manage: string; history: string; noHistory: string; viewInvoice: string; noSubscription: string };
  trips: { title: string; emptyTitle: string; emptyBody: string };
  vehicles: { title: string; emptyTitle: string; emptyBody: string };
  places: { title: string; emptyTitle: string; emptyBody: string };
  preferences: { title: string; language: string; more: string };
  profile: { title: string; email: string; security: string; securityBody: string; dangerTitle: string; deleteAccount: string; deleteConfirm: string; deleteCancel: string };
};

const en: AccountCopy = {
  nav: { overview: "Overview", trips: "My Trips", vehicles: "My Vehicles", preferences: "Preferences", billing: "Subscription & Billing", places: "Saved Places", profile: "Profile & Security" },
  backToPlanner: "Back to planner",
  eyebrow: "AUTOVERE",
  title: "My AutoVere",
  welcome: (name) => `Welcome back, ${name}`,
  subtitleActive: "Everything your plan unlocks, in one place.",
  subtitleFree: "Sign-in and subscription status for your AutoVere account.",
  loading: "Loading your account…",
  loggedOut: { message: "You are not signed in, or your link has expired.", signIn: "Sign in" },
  plan: { free: "Free / Standard", status: "Status", active: "Active", trialing: "Trial active", billedMonthly: "billed monthly", billedYearly: "billed yearly", cancelsAtPeriodEnd: "cancels at period end", renewsOn: (date) => `Renews on ${date}`, noSubscription: "No active subscription on this account." },
  actions: { viewPlans: "View plans", manageBilling: "Manage billing", signOut: "Sign out", signingOut: "Signing out…" },
  unlocked: { title: "What's unlocked on your plan", upgradeTitle: "Upgrade for more confidence on the road", upgradeCta: "See Pro & Business plans" },
  billing: { title: "Subscription & Billing", plan: "Plan", price: "Price", renewsOn: "Next renewal", paymentMethod: "Payment method", noPaymentMethod: "No payment method on file.", manage: "Manage plan, payment method & invoices", history: "Billing history", noHistory: "No invoices yet.", viewInvoice: "View", noSubscription: "You don't have an active subscription yet." },
  trips: { title: "My Trips", emptyTitle: "No saved trips yet", emptyBody: "Trip saving isn't connected to your account yet — this section is ready and waiting for that feature. Your calculations on the planner still work as normal." },
  vehicles: { title: "My Vehicles", emptyTitle: "No saved vehicles yet", emptyBody: "Saving vehicle profiles to your account isn't connected yet. This section is ready for it — for now, set your vehicle directly on the planner for each trip." },
  places: { title: "Saved Places", emptyTitle: "No saved places yet", emptyBody: "Saving hotels, chargers and other stops to your account isn't connected yet. This section is ready and waiting for that feature." },
  preferences: { title: "Preferences", language: "Language", more: "Currency and route preferences are set per trip on the planner for now — account-wide defaults are on the way." },
  profile: { title: "Profile & Security", email: "Email", security: "Sign-in", securityBody: "AutoVere uses secure email sign-in links instead of a password — there's nothing to remember, and nothing that can be guessed.", dangerTitle: "Danger zone", deleteAccount: "Delete account", deleteConfirm: "This cancels your subscription and signs you out everywhere. Are you sure?", deleteCancel: "Cancel" },
};

const de: AccountCopy = {
  nav: { overview: "Übersicht", trips: "Meine Reisen", vehicles: "Meine Fahrzeuge", preferences: "Einstellungen", billing: "Abo & Zahlung", places: "Gespeicherte Orte", profile: "Profil & Sicherheit" },
  backToPlanner: "Zurück zum Routenplaner",
  eyebrow: "AUTOVERE",
  title: "Mein AutoVere",
  welcome: (name) => `Willkommen zurück, ${name}`,
  subtitleActive: "Alles, was dein Plan freischaltet, an einem Ort.",
  subtitleFree: "Anmelde- und Abo-Status für dein AutoVere-Konto.",
  loading: "Konto wird geladen…",
  loggedOut: { message: "Du bist nicht angemeldet oder dein Link ist abgelaufen.", signIn: "Anmelden" },
  plan: { free: "Kostenlos / Standard", status: "Status", active: "Aktiv", trialing: "Testphase aktiv", billedMonthly: "monatliche Abrechnung", billedYearly: "jährliche Abrechnung", cancelsAtPeriodEnd: "endet am Periodenende", renewsOn: (date) => `Verlängert sich am ${date}`, noSubscription: "Kein aktives Abo auf diesem Konto." },
  actions: { viewPlans: "Pläne ansehen", manageBilling: "Zahlung verwalten", signOut: "Abmelden", signingOut: "Wird abgemeldet…" },
  unlocked: { title: "Das schaltet dein Plan frei", upgradeTitle: "Mehr Sicherheit unterwegs mit einem Upgrade", upgradeCta: "Pro- & Business-Pläne ansehen" },
  billing: { title: "Abo & Zahlung", plan: "Plan", price: "Preis", renewsOn: "Nächste Verlängerung", paymentMethod: "Zahlungsmethode", noPaymentMethod: "Keine Zahlungsmethode hinterlegt.", manage: "Plan, Zahlungsmethode & Rechnungen verwalten", history: "Rechnungsverlauf", noHistory: "Noch keine Rechnungen.", viewInvoice: "Ansehen", noSubscription: "Du hast noch kein aktives Abo." },
  trips: { title: "Meine Reisen", emptyTitle: "Noch keine gespeicherten Reisen", emptyBody: "Das Speichern von Reisen ist noch nicht mit deinem Konto verbunden — dieser Bereich ist bereit dafür. Berechnungen im Planer funktionieren weiterhin normal." },
  vehicles: { title: "Meine Fahrzeuge", emptyTitle: "Noch keine gespeicherten Fahrzeuge", emptyBody: "Das Speichern von Fahrzeugprofilen ist noch nicht verbunden. Lege dein Fahrzeug vorerst direkt im Planer für jede Reise fest." },
  places: { title: "Gespeicherte Orte", emptyTitle: "Noch keine gespeicherten Orte", emptyBody: "Das Speichern von Hotels, Ladepunkten und anderen Stopps ist noch nicht mit deinem Konto verbunden." },
  preferences: { title: "Einstellungen", language: "Sprache", more: "Währung und Routeneinstellungen werden vorerst pro Reise im Planer festgelegt — kontoweite Standards folgen." },
  profile: { title: "Profil & Sicherheit", email: "E-Mail", security: "Anmeldung", securityBody: "AutoVere verwendet sichere Anmelde-Links per E-Mail statt eines Passworts — nichts zu merken, nichts zu erraten.", dangerTitle: "Gefahrenzone", deleteAccount: "Konto löschen", deleteConfirm: "Dies kündigt dein Abo und meldet dich überall ab. Bist du sicher?", deleteCancel: "Abbrechen" },
};

const nl: AccountCopy = {
  nav: { overview: "Overzicht", trips: "Mijn Reizen", vehicles: "Mijn Voertuigen", preferences: "Voorkeuren", billing: "Abonnement & Facturatie", places: "Opgeslagen Plekken", profile: "Profiel & Beveiliging" },
  backToPlanner: "Terug naar de planner",
  eyebrow: "AUTOVERE",
  title: "Mijn AutoVere",
  welcome: (name) => `Welkom terug, ${name}`,
  subtitleActive: "Alles wat je abonnement ontgrendelt, op één plek.",
  subtitleFree: "Inlog- en abonnementsstatus voor je AutoVere-account.",
  loading: "Account wordt geladen…",
  loggedOut: { message: "Je bent niet ingelogd, of je link is verlopen.", signIn: "Inloggen" },
  plan: { free: "Gratis / Standaard", status: "Status", active: "Actief", trialing: "Proefperiode actief", billedMonthly: "maandelijks gefactureerd", billedYearly: "jaarlijks gefactureerd", cancelsAtPeriodEnd: "stopt aan einde periode", renewsOn: (date) => `Vernieuwt op ${date}`, noSubscription: "Geen actief abonnement op dit account." },
  actions: { viewPlans: "Bekijk abonnementen", manageBilling: "Facturatie beheren", signOut: "Uitloggen", signingOut: "Bezig met uitloggen…" },
  unlocked: { title: "Dit ontgrendelt je abonnement", upgradeTitle: "Upgrade voor meer zekerheid onderweg", upgradeCta: "Bekijk Pro- & Business-abonnementen" },
  billing: { title: "Abonnement & Facturatie", plan: "Abonnement", price: "Prijs", renewsOn: "Volgende verlenging", paymentMethod: "Betaalmethode", noPaymentMethod: "Geen betaalmethode bekend.", manage: "Beheer abonnement, betaalmethode & facturen", history: "Factuurgeschiedenis", noHistory: "Nog geen facturen.", viewInvoice: "Bekijken", noSubscription: "Je hebt nog geen actief abonnement." },
  trips: { title: "Mijn Reizen", emptyTitle: "Nog geen opgeslagen reizen", emptyBody: "Reizen opslaan is nog niet gekoppeld aan je account — dit onderdeel staat klaar. Berekeningen in de planner werken gewoon door." },
  vehicles: { title: "Mijn Voertuigen", emptyTitle: "Nog geen opgeslagen voertuigen", emptyBody: "Voertuigprofielen opslaan is nog niet gekoppeld. Stel je voertuig voorlopig per reis in op de planner." },
  places: { title: "Opgeslagen Plekken", emptyTitle: "Nog geen opgeslagen plekken", emptyBody: "Hotels, laadpunten en andere stops opslaan is nog niet gekoppeld aan je account." },
  preferences: { title: "Voorkeuren", language: "Taal", more: "Valuta en routevoorkeuren stel je voorlopig per reis in op de planner — accountbrede standaardinstellingen volgen nog." },
  profile: { title: "Profiel & Beveiliging", email: "E-mail", security: "Inloggen", securityBody: "AutoVere gebruikt beveiligde inloglinks via e-mail in plaats van een wachtwoord — niets om te onthouden, niets te raden.", dangerTitle: "Gevarenzone", deleteAccount: "Account verwijderen", deleteConfirm: "Dit zegt je abonnement op en logt je overal uit. Weet je het zeker?", deleteCancel: "Annuleren" },
};

const no: AccountCopy = {
  nav: { overview: "Oversikt", trips: "Mine reiser", vehicles: "Mine kjøretøy", preferences: "Innstillinger", billing: "Abonnement og fakturering", places: "Lagrede steder", profile: "Profil og sikkerhet" },
  backToPlanner: "Tilbake til ruteplanleggeren",
  eyebrow: "AUTOVERE",
  title: "Min AutoVere",
  welcome: (name) => `Velkommen tilbake, ${name}`,
  subtitleActive: "Alt abonnementet ditt låser opp, samlet på ett sted.",
  subtitleFree: "Innloggings- og abonnementsstatus for AutoVere-kontoen din.",
  loading: "Laster kontoen din…",
  loggedOut: { message: "Du er ikke innlogget, eller lenken din er utløpt.", signIn: "Logg inn" },
  plan: { free: "Gratis / Standard", status: "Status", active: "Aktivt", trialing: "Prøveperiode aktiv", billedMonthly: "faktureres månedlig", billedYearly: "faktureres årlig", cancelsAtPeriodEnd: "avsluttes ved periodeslutt", renewsOn: (date) => `Fornyes ${date}`, noSubscription: "Ingen aktivt abonnement på denne kontoen." },
  actions: { viewPlans: "Se abonnementer", manageBilling: "Administrer fakturering", signOut: "Logg ut", signingOut: "Logger ut…" },
  unlocked: { title: "Dette låser abonnementet ditt opp", upgradeTitle: "Oppgrader for mer trygghet på veien", upgradeCta: "Se Pro- og Bedrift-abonnement" },
  billing: { title: "Abonnement og fakturering", plan: "Abonnement", price: "Pris", renewsOn: "Neste fornyelse", paymentMethod: "Betalingsmetode", noPaymentMethod: "Ingen betalingsmetode registrert.", manage: "Administrer abonnement, betalingsmetode og fakturaer", history: "Fakturahistorikk", noHistory: "Ingen fakturaer ennå.", viewInvoice: "Vis", noSubscription: "Du har ikke noe aktivt abonnement ennå." },
  trips: { title: "Mine reiser", emptyTitle: "Ingen lagrede reiser ennå", emptyBody: "Lagring av reiser er ikke koblet til kontoen din ennå — denne seksjonen står klar for det. Beregninger i ruteplanleggeren fungerer som normalt." },
  vehicles: { title: "Mine kjøretøy", emptyTitle: "Ingen lagrede kjøretøy ennå", emptyBody: "Lagring av kjøretøyprofiler er ikke koblet til kontoen din ennå. Sett kjøretøyet direkte i ruteplanleggeren for hver tur i mellomtiden." },
  places: { title: "Lagrede steder", emptyTitle: "Ingen lagrede steder ennå", emptyBody: "Lagring av hoteller, ladestasjoner og andre stopp er ikke koblet til kontoen din ennå." },
  preferences: { title: "Innstillinger", language: "Språk", more: "Valuta og rutepreferanser settes foreløpig per tur i ruteplanleggeren — kontobaserte standardvalg kommer." },
  profile: { title: "Profil og sikkerhet", email: "E-post", security: "Innlogging", securityBody: "AutoVere bruker sikre innloggingslenker på e-post i stedet for passord — ingenting å huske, ingenting å gjette.", dangerTitle: "Faresone", deleteAccount: "Slett konto", deleteConfirm: "Dette avslutter abonnementet ditt og logger deg ut overalt. Er du sikker?", deleteCancel: "Avbryt" },
};

const pl: AccountCopy = {
  nav: { overview: "Przegląd", trips: "Moje podróże", vehicles: "Moje pojazdy", preferences: "Preferencje", billing: "Subskrypcja i płatności", places: "Zapisane miejsca", profile: "Profil i bezpieczeństwo" },
  backToPlanner: "Powrót do planera",
  eyebrow: "AUTOVERE",
  title: "Moje AutoVere",
  welcome: (name) => `Witaj ponownie, ${name}`,
  subtitleActive: "Wszystko, co odblokowuje Twój plan, w jednym miejscu.",
  subtitleFree: "Status logowania i subskrypcji dla Twojego konta AutoVere.",
  loading: "Ładowanie konta…",
  loggedOut: { message: "Nie jesteś zalogowany lub Twój link wygasł.", signIn: "Zaloguj się" },
  plan: { free: "Darmowy / Standard", status: "Status", active: "Aktywny", trialing: "Okres próbny aktywny", billedMonthly: "rozliczane miesięcznie", billedYearly: "rozliczane rocznie", cancelsAtPeriodEnd: "zakończy się na koniec okresu", renewsOn: (date) => `Odnawia się ${date}`, noSubscription: "Brak aktywnej subskrypcji na tym koncie." },
  actions: { viewPlans: "Zobacz plany", manageBilling: "Zarządzaj płatnościami", signOut: "Wyloguj się", signingOut: "Wylogowywanie…" },
  unlocked: { title: "To odblokowuje Twój plan", upgradeTitle: "Ulepsz plan dla większej pewności w podróży", upgradeCta: "Zobacz plany Pro i Business" },
  billing: { title: "Subskrypcja i płatności", plan: "Plan", price: "Cena", renewsOn: "Kolejne odnowienie", paymentMethod: "Metoda płatności", noPaymentMethod: "Brak zapisanej metody płatności.", manage: "Zarządzaj planem, metodą płatności i fakturami", history: "Historia płatności", noHistory: "Brak faktur.", viewInvoice: "Zobacz", noSubscription: "Nie masz jeszcze aktywnej subskrypcji." },
  trips: { title: "Moje podróże", emptyTitle: "Brak zapisanych podróży", emptyBody: "Zapisywanie podróży nie jest jeszcze połączone z Twoim kontem — ta sekcja jest na to gotowa. Obliczenia w planerze nadal działają normalnie." },
  vehicles: { title: "Moje pojazdy", emptyTitle: "Brak zapisanych pojazdów", emptyBody: "Zapisywanie profili pojazdów nie jest jeszcze połączone. Na razie ustaw pojazd bezpośrednio w planerze dla każdej podróży." },
  places: { title: "Zapisane miejsca", emptyTitle: "Brak zapisanych miejsc", emptyBody: "Zapisywanie hoteli, ładowarek i innych przystanków nie jest jeszcze połączone z Twoim kontem." },
  preferences: { title: "Preferencje", language: "Język", more: "Waluta i preferencje trasy są na razie ustawiane dla każdej podróży w planerze — ustawienia domyślne konta pojawią się wkrótce." },
  profile: { title: "Profil i bezpieczeństwo", email: "E-mail", security: "Logowanie", securityBody: "AutoVere używa bezpiecznych linków logowania e-mail zamiast hasła — nic do zapamiętania, nic do odgadnięcia.", dangerTitle: "Strefa zagrożenia", deleteAccount: "Usuń konto", deleteConfirm: "To anuluje Twoją subskrypcję i wyloguje Cię wszędzie. Czy na pewno?", deleteCancel: "Anuluj" },
};

const sv: AccountCopy = {
  nav: { overview: "Översikt", trips: "Mina resor", vehicles: "Mina fordon", preferences: "Inställningar", billing: "Prenumeration och fakturering", places: "Sparade platser", profile: "Profil och säkerhet" },
  backToPlanner: "Tillbaka till resruttplaneraren",
  eyebrow: "AUTOVERE",
  title: "Mitt AutoVere",
  welcome: (name) => `Välkommen tillbaka, ${name}`,
  subtitleActive: "Allt din plan låser upp, på ett ställe.",
  subtitleFree: "Inloggnings- och prenumerationsstatus för ditt AutoVere-konto.",
  loading: "Laddar ditt konto…",
  loggedOut: { message: "Du är inte inloggad, eller så har din länk gått ut.", signIn: "Logga in" },
  plan: { free: "Gratis / Standard", status: "Status", active: "Aktiv", trialing: "Provperiod aktiv", billedMonthly: "faktureras månadsvis", billedYearly: "faktureras årsvis", cancelsAtPeriodEnd: "avslutas vid periodens slut", renewsOn: (date) => `Förnyas ${date}`, noSubscription: "Ingen aktiv prenumeration på det här kontot." },
  actions: { viewPlans: "Se planer", manageBilling: "Hantera fakturering", signOut: "Logga ut", signingOut: "Loggar ut…" },
  unlocked: { title: "Det här låser din plan upp", upgradeTitle: "Uppgradera för mer trygghet på vägen", upgradeCta: "Se Pro- och Business-planer" },
  billing: { title: "Prenumeration och fakturering", plan: "Plan", price: "Pris", renewsOn: "Nästa förnyelse", paymentMethod: "Betalmetod", noPaymentMethod: "Ingen betalmetod registrerad.", manage: "Hantera plan, betalmetod och fakturor", history: "Fakturahistorik", noHistory: "Inga fakturor än.", viewInvoice: "Visa", noSubscription: "Du har ingen aktiv prenumeration än." },
  trips: { title: "Mina resor", emptyTitle: "Inga sparade resor än", emptyBody: "Att spara resor är inte kopplat till ditt konto än — den här sektionen är redo för det. Beräkningar i planeraren fungerar som vanligt." },
  vehicles: { title: "Mina fordon", emptyTitle: "Inga sparade fordon än", emptyBody: "Att spara fordonsprofiler är inte kopplat än. Ställ in ditt fordon direkt i planeraren för varje resa tills vidare." },
  places: { title: "Sparade platser", emptyTitle: "Inga sparade platser än", emptyBody: "Att spara hotell, laddare och andra stopp är inte kopplat till ditt konto än." },
  preferences: { title: "Inställningar", language: "Språk", more: "Valuta och ruttinställningar sätts tills vidare per resa i planeraren — kontoomfattande standardval kommer snart." },
  profile: { title: "Profil och säkerhet", email: "E-post", security: "Inloggning", securityBody: "AutoVere använder säkra inloggningslänkar via e-post istället för lösenord — inget att komma ihåg, inget att gissa.", dangerTitle: "Farlig zon", deleteAccount: "Ta bort konto", deleteConfirm: "Det här avslutar din prenumeration och loggar ut dig överallt. Är du säker?", deleteCancel: "Avbryt" },
};

const fr: AccountCopy = {
  nav: { overview: "Aperçu", trips: "Mes voyages", vehicles: "Mes véhicules", preferences: "Préférences", billing: "Abonnement et facturation", places: "Lieux enregistrés", profile: "Profil et sécurité" },
  backToPlanner: "Retour au planificateur",
  eyebrow: "AUTOVERE",
  title: "Mon AutoVere",
  welcome: (name) => `Bon retour, ${name}`,
  subtitleActive: "Tout ce que votre forfait débloque, au même endroit.",
  subtitleFree: "Statut de connexion et d'abonnement pour votre compte AutoVere.",
  loading: "Chargement de votre compte…",
  loggedOut: { message: "Vous n'êtes pas connecté, ou votre lien a expiré.", signIn: "Se connecter" },
  plan: { free: "Gratuit / Standard", status: "Statut", active: "Actif", trialing: "Essai en cours", billedMonthly: "facturé mensuellement", billedYearly: "facturé annuellement", cancelsAtPeriodEnd: "se termine en fin de période", renewsOn: (date) => `Se renouvelle le ${date}`, noSubscription: "Aucun abonnement actif sur ce compte." },
  actions: { viewPlans: "Voir les forfaits", manageBilling: "Gérer la facturation", signOut: "Se déconnecter", signingOut: "Déconnexion…" },
  unlocked: { title: "Ce que votre forfait débloque", upgradeTitle: "Passez à un forfait supérieur pour plus de sérénité", upgradeCta: "Voir les forfaits Pro et Business" },
  billing: { title: "Abonnement et facturation", plan: "Forfait", price: "Prix", renewsOn: "Prochain renouvellement", paymentMethod: "Moyen de paiement", noPaymentMethod: "Aucun moyen de paiement enregistré.", manage: "Gérer le forfait, le paiement et les factures", history: "Historique de facturation", noHistory: "Aucune facture pour l'instant.", viewInvoice: "Voir", noSubscription: "Vous n'avez pas encore d'abonnement actif." },
  trips: { title: "Mes voyages", emptyTitle: "Aucun voyage enregistré", emptyBody: "L'enregistrement des voyages n'est pas encore relié à votre compte — cette section est prête pour cela. Les calculs du planificateur fonctionnent normalement." },
  vehicles: { title: "Mes véhicules", emptyTitle: "Aucun véhicule enregistré", emptyBody: "L'enregistrement des profils de véhicule n'est pas encore relié. Définissez votre véhicule directement dans le planificateur pour chaque voyage en attendant." },
  places: { title: "Lieux enregistrés", emptyTitle: "Aucun lieu enregistré", emptyBody: "L'enregistrement des hôtels, bornes de recharge et autres arrêts n'est pas encore relié à votre compte." },
  preferences: { title: "Préférences", language: "Langue", more: "La devise et les préférences d'itinéraire se règlent pour l'instant par voyage dans le planificateur — des réglages par défaut arrivent bientôt." },
  profile: { title: "Profil et sécurité", email: "E-mail", security: "Connexion", securityBody: "AutoVere utilise des liens de connexion sécurisés par e-mail plutôt qu'un mot de passe — rien à retenir, rien à deviner.", dangerTitle: "Zone sensible", deleteAccount: "Supprimer le compte", deleteConfirm: "Cela résilie votre abonnement et vous déconnecte partout. Êtes-vous sûr ?", deleteCancel: "Annuler" },
};

export const accountCopy: Partial<Record<Locale, AccountCopy>> = { en, de, nl, no, pl, sv, fr };

export function getAccountCopy(locale: Locale): AccountCopy {
  return accountCopy[locale] ?? en;
}
