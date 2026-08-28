import type { Locale } from "./i18n";

export type AccountCopy = {
  nav: { overview: string; trips: string; vehicles: string; preferences: string; billing: string; places: string; profile: string; help: string };
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
  trips: {
    title: string;
    emptyTitle: string;
    emptyBody: string;
    repeat: string;
    useAsStart: string;
    print: string;
    days: string;
    created: string;
    estimate: string;
    rename: string;
    duplicate: string;
    delete: string;
    deleteConfirm: string;
    save: string;
    cancel: string;
    savedOn: (date: string) => string;
  };
  vehicles: {
    title: string;
    emptyTitle: string;
    emptyBody: string;
    add: string;
    name: string;
    namePlaceholder: string;
    type: string;
    typePetrol: string;
    typeDiesel: string;
    typeEv: string;
    consumption: string;
    range: string;
    default: string;
    setDefault: string;
    edit: string;
    delete: string;
    deleteConfirm: string;
    save: string;
    cancel: string;
  };
  places: {
    title: string;
    emptyTitle: string;
    emptyBody: string;
    add: string;
    name: string;
    namePlaceholder: string;
    category: string;
    categoryCharging: string;
    categoryCamping: string;
    categoryAttraction: string;
    categoryOther: string;
    notes: string;
    save: string;
    cancel: string;
    delete: string;
  };
  preferences: {
    title: string;
    language: string;
    currency: string;
    units: string;
    unitsMetric: string;
    unitsImperial: string;
    notifications: string;
    notificationsEmail: string;
    save: string;
    saved: string;
    more: string;
  };
  profile: {
    title: string;
    email: string;
    security: string;
    securityBody: string;
    exportData: string;
    exportDataBody: string;
    dangerTitle: string;
    deleteAccount: string;
    deleteConfirm: string;
    deleteCancel: string;
  };
  help: { title: string; subtitle: string; faqTitle: string; faqBody: string; faqLink: string; contactTitle: string; contactBody: string; contactLink: string };
};

const en: AccountCopy = {
  nav: { overview: "Overview", trips: "My Trips", vehicles: "My Vehicles", preferences: "Settings", billing: "Subscription & Billing", places: "Saved Places", profile: "Profile & Security", help: "Help & Support" },
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
  trips: { title: "My Trips", emptyTitle: "No saved trips yet", emptyBody: "Save a trip to find it again when you need it.", repeat: "Repeat trip", useAsStart: "Use as starting point", print: "Print / Save as PDF", days: "Days", created: "Created", estimate: "Estimate", rename: "Rename", duplicate: "Duplicate", delete: "Delete", deleteConfirm: "Delete this trip? This cannot be undone.", save: "Save", cancel: "Cancel", savedOn: (date) => `Saved ${date}` },
  vehicles: { title: "My Vehicles", emptyTitle: "No saved vehicles yet", emptyBody: "Add a vehicle to reuse it directly on the planner.", add: "Add vehicle", name: "Name", namePlaceholder: "e.g. Family EV", type: "Type", typePetrol: "Petrol", typeDiesel: "Diesel", typeEv: "Electric (EV)", consumption: "Consumption (L or kWh /100km)", range: "Real-world range (km)", default: "Default", setDefault: "Set as default", edit: "Edit", delete: "Delete", deleteConfirm: "Delete this vehicle?", save: "Save", cancel: "Cancel" },
  places: { title: "Saved Places", emptyTitle: "No saved places yet", emptyBody: "Save chargers, stays and stops you want to find again.", add: "Add place", name: "Name", namePlaceholder: "e.g. Fjord View Campsite", category: "Category", categoryCharging: "Charging", categoryCamping: "Camping / overnight", categoryAttraction: "Attraction", categoryOther: "Other", notes: "Notes", save: "Save", cancel: "Cancel", delete: "Delete" },
  preferences: { title: "Settings", language: "Language", currency: "Currency", units: "Measurement units", unitsMetric: "Metric (km, litres)", unitsImperial: "Imperial (miles, gallons)", notifications: "Notifications", notificationsEmail: "Email me about my account and billing", save: "Save settings", saved: "Settings saved", more: "These apply as your defaults across AutoVere." },
  profile: { title: "Profile & Security", email: "Email", security: "Sign-in", securityBody: "AutoVere uses secure email sign-in links instead of a password — there's nothing to remember, and nothing that can be guessed.", exportData: "Export my data", exportDataBody: "Download a copy of everything linked to your account (profile, subscription, trips, vehicles, places).", dangerTitle: "Danger zone", deleteAccount: "Delete account", deleteConfirm: "This cancels your subscription, deletes your saved data and signs you out everywhere. Are you sure?", deleteCancel: "Cancel" },
  help: { title: "Help & Support", subtitle: "We're here if something isn't working the way it should.", faqTitle: "Frequently asked questions", faqBody: "Answers to the most common questions about routes, tolls, vignettes and charging.", faqLink: "Open Help & FAQ", contactTitle: "Contact support", contactBody: "Send us a message and we'll get back to you — this is also the right place to report a problem.", contactLink: "Send a message" },
};

const de: AccountCopy = {
  nav: { overview: "Übersicht", trips: "Meine Reisen", vehicles: "Meine Fahrzeuge", preferences: "Einstellungen", billing: "Abo & Zahlung", places: "Gespeicherte Orte", profile: "Profil & Sicherheit", help: "Hilfe & Support" },
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
  trips: { title: "Meine Reisen", emptyTitle: "Noch keine gespeicherten Reisen", emptyBody: "Speichere eine Reise, damit du sie wiederfindest, wenn du sie brauchst.", repeat: "Reise wiederholen", useAsStart: "Als Ausgangspunkt verwenden", print: "Drucken / Als PDF speichern", days: "Tage", created: "Erstellt", estimate: "Kostenschätzung", rename: "Umbenennen", duplicate: "Duplizieren", delete: "Löschen", deleteConfirm: "Diese Reise löschen? Das kann nicht rückgängig gemacht werden.", save: "Speichern", cancel: "Abbrechen", savedOn: (date) => `Gespeichert am ${date}` },
  vehicles: { title: "Meine Fahrzeuge", emptyTitle: "Noch keine gespeicherten Fahrzeuge", emptyBody: "Füge ein Fahrzeug hinzu, um es direkt im Planer zu nutzen.", add: "Fahrzeug hinzufügen", name: "Name", namePlaceholder: "z. B. Familien-EV", type: "Typ", typePetrol: "Benzin", typeDiesel: "Diesel", typeEv: "Elektro (EV)", consumption: "Verbrauch (L oder kWh /100km)", range: "Reale Reichweite (km)", default: "Standard", setDefault: "Als Standard festlegen", edit: "Bearbeiten", delete: "Löschen", deleteConfirm: "Dieses Fahrzeug löschen?", save: "Speichern", cancel: "Abbrechen" },
  places: { title: "Gespeicherte Orte", emptyTitle: "Noch keine gespeicherten Orte", emptyBody: "Speichere Ladepunkte, Unterkünfte und Stopps, die du wiederfinden willst.", add: "Ort hinzufügen", name: "Name", namePlaceholder: "z. B. Fjordblick-Campingplatz", category: "Kategorie", categoryCharging: "Laden", categoryCamping: "Camping / Übernachtung", categoryAttraction: "Sehenswürdigkeit", categoryOther: "Sonstiges", notes: "Notizen", save: "Speichern", cancel: "Abbrechen", delete: "Löschen" },
  preferences: { title: "Einstellungen", language: "Sprache", currency: "Währung", units: "Maßeinheiten", unitsMetric: "Metrisch (km, Liter)", unitsImperial: "Imperial (Meilen, Gallonen)", notifications: "Benachrichtigungen", notificationsEmail: "Per E-Mail über Konto und Abrechnung informieren", save: "Einstellungen speichern", saved: "Einstellungen gespeichert", more: "Diese gelten als deine Standardwerte in ganz AutoVere." },
  profile: { title: "Profil & Sicherheit", email: "E-Mail", security: "Anmeldung", securityBody: "AutoVere verwendet sichere Anmelde-Links per E-Mail statt eines Passworts — nichts zu merken, nichts zu erraten.", exportData: "Meine Daten exportieren", exportDataBody: "Lade eine Kopie aller mit deinem Konto verknüpften Daten herunter (Profil, Abo, Reisen, Fahrzeuge, Orte).", dangerTitle: "Gefahrenzone", deleteAccount: "Konto löschen", deleteConfirm: "Dies kündigt dein Abo, löscht deine gespeicherten Daten und meldet dich überall ab. Bist du sicher?", deleteCancel: "Abbrechen" },
  help: { title: "Hilfe & Support", subtitle: "Wir sind da, wenn etwas nicht wie erwartet funktioniert.", faqTitle: "Häufig gestellte Fragen", faqBody: "Antworten auf die häufigsten Fragen zu Routen, Maut, Vignetten und Laden.", faqLink: "Hilfe & FAQ öffnen", contactTitle: "Support kontaktieren", contactBody: "Schick uns eine Nachricht — hier meldest du auch Probleme.", contactLink: "Nachricht senden" },
};

const nl: AccountCopy = {
  nav: { overview: "Overzicht", trips: "Mijn Reizen", vehicles: "Mijn Voertuigen", preferences: "Instellingen", billing: "Abonnement & Facturatie", places: "Opgeslagen Plekken", profile: "Profiel & Beveiliging", help: "Help & Ondersteuning" },
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
  trips: { title: "Mijn Reizen", emptyTitle: "Nog geen opgeslagen reizen", emptyBody: "Sla een reis op zodat je hem later makkelijk terugvindt.", repeat: "Reis herhalen", useAsStart: "Gebruiken als startpunt", print: "Afdrukken / Opslaan als PDF", days: "Dagen", created: "Aangemaakt", estimate: "Schatting", rename: "Naam wijzigen", duplicate: "Dupliceren", delete: "Verwijderen", deleteConfirm: "Deze reis verwijderen? Dit kan niet ongedaan worden gemaakt.", save: "Opslaan", cancel: "Annuleren", savedOn: (date) => `Opgeslagen op ${date}` },
  vehicles: { title: "Mijn Voertuigen", emptyTitle: "Nog geen opgeslagen voertuigen", emptyBody: "Voeg een voertuig toe om het direct in de planner te gebruiken.", add: "Voertuig toevoegen", name: "Naam", namePlaceholder: "bijv. Gezins-EV", type: "Type", typePetrol: "Benzine", typeDiesel: "Diesel", typeEv: "Elektrisch (EV)", consumption: "Verbruik (L of kWh /100km)", range: "Praktijkbereik (km)", default: "Standaard", setDefault: "Als standaard instellen", edit: "Bewerken", delete: "Verwijderen", deleteConfirm: "Dit voertuig verwijderen?", save: "Opslaan", cancel: "Annuleren" },
  places: { title: "Opgeslagen Plekken", emptyTitle: "Nog geen opgeslagen plekken", emptyBody: "Sla laders, overnachtingen en stops op die je wilt terugvinden.", add: "Plek toevoegen", name: "Naam", namePlaceholder: "bijv. Fjordzicht Camping", category: "Categorie", categoryCharging: "Laden", categoryCamping: "Camping / overnachting", categoryAttraction: "Attractie", categoryOther: "Overig", notes: "Notities", save: "Opslaan", cancel: "Annuleren", delete: "Verwijderen" },
  preferences: { title: "Instellingen", language: "Taal", currency: "Valuta", units: "Meeteenheden", unitsMetric: "Metrisch (km, liter)", unitsImperial: "Imperiaal (mijlen, gallons)", notifications: "Meldingen", notificationsEmail: "Mail me over mijn account en facturering", save: "Instellingen opslaan", saved: "Instellingen opgeslagen", more: "Dit zijn je standaardwaarden in heel AutoVere." },
  profile: { title: "Profiel & Beveiliging", email: "E-mail", security: "Inloggen", securityBody: "AutoVere gebruikt beveiligde inloglinks via e-mail in plaats van een wachtwoord — niets om te onthouden, niets te raden.", exportData: "Mijn gegevens exporteren", exportDataBody: "Download een kopie van alles wat aan je account gekoppeld is (profiel, abonnement, reizen, voertuigen, plekken).", dangerTitle: "Gevarenzone", deleteAccount: "Account verwijderen", deleteConfirm: "Dit zegt je abonnement op, verwijdert je opgeslagen gegevens en logt je overal uit. Weet je het zeker?", deleteCancel: "Annuleren" },
  help: { title: "Help & Ondersteuning", subtitle: "We staan klaar als iets niet werkt zoals het hoort.", faqTitle: "Veelgestelde vragen", faqBody: "Antwoorden op de meest gestelde vragen over routes, tol, vignetten en laden.", faqLink: "Open Help & FAQ", contactTitle: "Contact met support", contactBody: "Stuur ons een bericht — dit is ook de juiste plek om een probleem te melden.", contactLink: "Bericht sturen" },
};

const no: AccountCopy = {
  nav: { overview: "Oversikt", trips: "Mine reiser", vehicles: "Mine kjøretøy", preferences: "Innstillinger", billing: "Abonnement og fakturering", places: "Lagrede steder", profile: "Profil og sikkerhet", help: "Hjelp og support" },
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
  trips: { title: "Mine reiser", emptyTitle: "Ingen lagrede reiser ennå", emptyBody: "Lagre en reise for å finne den igjen når du trenger den.", repeat: "Gjenta tur", useAsStart: "Bruk dette som utgangspunkt", print: "Skriv ut / Lagre som PDF", days: "Dager", created: "Opprettet", estimate: "Kostnadsestimat", rename: "Gi nytt navn", duplicate: "Dupliser", delete: "Slett", deleteConfirm: "Slette denne reisen? Dette kan ikke angres.", save: "Lagre", cancel: "Avbryt", savedOn: (date) => `Lagret ${date}` },
  vehicles: { title: "Mine kjøretøy", emptyTitle: "Ingen lagrede kjøretøy ennå", emptyBody: "Legg til et kjøretøy for å bruke det direkte i ruteplanleggeren.", add: "Legg til kjøretøy", name: "Navn", namePlaceholder: "f.eks. Familie-elbil", type: "Type", typePetrol: "Bensin", typeDiesel: "Diesel", typeEv: "Elektrisk (EV)", consumption: "Forbruk (L eller kWh /100km)", range: "Reell rekkevidde (km)", default: "Standard", setDefault: "Sett som standard", edit: "Rediger", delete: "Slett", deleteConfirm: "Slette dette kjøretøyet?", save: "Lagre", cancel: "Avbryt" },
  places: { title: "Lagrede steder", emptyTitle: "Ingen lagrede steder ennå", emptyBody: "Lagre ladestasjoner, overnattinger og stopp du vil finne igjen.", add: "Legg til sted", name: "Navn", namePlaceholder: "f.eks. Fjordutsikt Camping", category: "Kategori", categoryCharging: "Lading", categoryCamping: "Camping / overnatting", categoryAttraction: "Attraksjon", categoryOther: "Annet", notes: "Notater", save: "Lagre", cancel: "Avbryt", delete: "Slett" },
  preferences: { title: "Innstillinger", language: "Språk", currency: "Valuta", units: "Måleenheter", unitsMetric: "Metrisk (km, liter)", unitsImperial: "Imperisk (miles, gallons)", notifications: "Varsler", notificationsEmail: "Send meg e-post om konto og fakturering", save: "Lagre innstillinger", saved: "Innstillinger lagret", more: "Disse gjelder som standardvalgene dine i hele AutoVere." },
  profile: { title: "Profil og sikkerhet", email: "E-post", security: "Innlogging", securityBody: "AutoVere bruker sikre innloggingslenker på e-post i stedet for passord — ingenting å huske, ingenting å gjette.", exportData: "Eksporter dataene mine", exportDataBody: "Last ned en kopi av alt som er knyttet til kontoen din (profil, abonnement, reiser, kjøretøy, steder).", dangerTitle: "Faresone", deleteAccount: "Slett konto", deleteConfirm: "Dette avslutter abonnementet ditt, sletter lagrede data og logger deg ut overalt. Er du sikker?", deleteCancel: "Avbryt" },
  help: { title: "Hjelp og support", subtitle: "Vi er her hvis noe ikke fungerer som det skal.", faqTitle: "Ofte stilte spørsmål", faqBody: "Svar på de vanligste spørsmålene om ruter, bompenger, vignetter og lading.", faqLink: "Åpne hjelp og FAQ", contactTitle: "Kontakt support", contactBody: "Send oss en melding, så svarer vi deg — dette er også riktig sted å melde fra om et problem.", contactLink: "Send melding" },
};

const pl: AccountCopy = {
  nav: { overview: "Przegląd", trips: "Moje podróże", vehicles: "Moje pojazdy", preferences: "Ustawienia", billing: "Subskrypcja i płatności", places: "Zapisane miejsca", profile: "Profil i bezpieczeństwo", help: "Pomoc i wsparcie" },
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
  trips: { title: "Moje podróże", emptyTitle: "Brak zapisanych podróży", emptyBody: "Zapisz podróż, aby łatwo ją odnaleźć, gdy będzie potrzebna.", repeat: "Powtórz podróż", useAsStart: "Użyj jako punktu wyjścia", print: "Drukuj / Zapisz jako PDF", days: "Dni", created: "Utworzono", estimate: "Szacunek", rename: "Zmień nazwę", duplicate: "Duplikuj", delete: "Usuń", deleteConfirm: "Usunąć tę podróż? Tej czynności nie można cofnąć.", save: "Zapisz", cancel: "Anuluj", savedOn: (date) => `Zapisano ${date}` },
  vehicles: { title: "Moje pojazdy", emptyTitle: "Brak zapisanych pojazdów", emptyBody: "Dodaj pojazd, aby użyć go bezpośrednio w planerze.", add: "Dodaj pojazd", name: "Nazwa", namePlaceholder: "np. Rodzinny EV", type: "Typ", typePetrol: "Benzyna", typeDiesel: "Diesel", typeEv: "Elektryczny (EV)", consumption: "Zużycie (L lub kWh /100km)", range: "Rzeczywisty zasięg (km)", default: "Domyślny", setDefault: "Ustaw jako domyślny", edit: "Edytuj", delete: "Usuń", deleteConfirm: "Usunąć ten pojazd?", save: "Zapisz", cancel: "Anuluj" },
  places: { title: "Zapisane miejsca", emptyTitle: "Brak zapisanych miejsc", emptyBody: "Zapisz ładowarki, noclegi i przystanki, które chcesz łatwo odnaleźć.", add: "Dodaj miejsce", name: "Nazwa", namePlaceholder: "np. Kemping z widokiem na fiord", category: "Kategoria", categoryCharging: "Ładowanie", categoryCamping: "Kemping / nocleg", categoryAttraction: "Atrakcja", categoryOther: "Inne", notes: "Notatki", save: "Zapisz", cancel: "Anuluj", delete: "Usuń" },
  preferences: { title: "Ustawienia", language: "Język", currency: "Waluta", units: "Jednostki miary", unitsMetric: "Metryczne (km, litry)", unitsImperial: "Imperialne (mile, galony)", notifications: "Powiadomienia", notificationsEmail: "Wysyłaj e-mail o koncie i płatnościach", save: "Zapisz ustawienia", saved: "Ustawienia zapisane", more: "Te ustawienia obowiązują jako domyślne w całym AutoVere." },
  profile: { title: "Profil i bezpieczeństwo", email: "E-mail", security: "Logowanie", securityBody: "AutoVere używa bezpiecznych linków logowania e-mail zamiast hasła — nic do zapamiętania, nic do odgadnięcia.", exportData: "Eksportuj moje dane", exportDataBody: "Pobierz kopię wszystkiego powiązanego z Twoim kontem (profil, subskrypcja, podróże, pojazdy, miejsca).", dangerTitle: "Strefa zagrożenia", deleteAccount: "Usuń konto", deleteConfirm: "To anuluje Twoją subskrypcję, usunie zapisane dane i wyloguje Cię wszędzie. Czy na pewno?", deleteCancel: "Anuluj" },
  help: { title: "Pomoc i wsparcie", subtitle: "Jesteśmy tutaj, jeśli coś nie działa tak, jak powinno.", faqTitle: "Najczęściej zadawane pytania", faqBody: "Odpowiedzi na najczęstsze pytania o trasy, opłaty drogowe, winiety i ładowanie.", faqLink: "Otwórz pomoc i FAQ", contactTitle: "Kontakt z pomocą", contactBody: "Napisz do nas, a odpowiemy — to też właściwe miejsce, aby zgłosić problem.", contactLink: "Wyślij wiadomość" },
};

const sv: AccountCopy = {
  nav: { overview: "Översikt", trips: "Mina resor", vehicles: "Mina fordon", preferences: "Inställningar", billing: "Prenumeration och fakturering", places: "Sparade platser", profile: "Profil och säkerhet", help: "Hjälp och support" },
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
  trips: { title: "Mina resor", emptyTitle: "Inga sparade resor än", emptyBody: "Spara en resa så att du hittar den igen när du behöver den.", repeat: "Upprepa resan", useAsStart: "Använd som utgångspunkt", print: "Skriv ut / Spara som PDF", days: "Dagar", created: "Skapad", estimate: "Kostnadsuppskattning", rename: "Byt namn", duplicate: "Duplicera", delete: "Ta bort", deleteConfirm: "Ta bort den här resan? Detta kan inte ångras.", save: "Spara", cancel: "Avbryt", savedOn: (date) => `Sparad ${date}` },
  vehicles: { title: "Mina fordon", emptyTitle: "Inga sparade fordon än", emptyBody: "Lägg till ett fordon för att använda det direkt i planeraren.", add: "Lägg till fordon", name: "Namn", namePlaceholder: "t.ex. Familje-EV", type: "Typ", typePetrol: "Bensin", typeDiesel: "Diesel", typeEv: "Elektrisk (EV)", consumption: "Förbrukning (L eller kWh /100km)", range: "Verklig räckvidd (km)", default: "Standard", setDefault: "Ange som standard", edit: "Redigera", delete: "Ta bort", deleteConfirm: "Ta bort det här fordonet?", save: "Spara", cancel: "Avbryt" },
  places: { title: "Sparade platser", emptyTitle: "Inga sparade platser än", emptyBody: "Spara laddare, boenden och stopp du vill hitta igen.", add: "Lägg till plats", name: "Namn", namePlaceholder: "t.ex. Fjordutsikt Camping", category: "Kategori", categoryCharging: "Laddning", categoryCamping: "Camping / övernattning", categoryAttraction: "Sevärdhet", categoryOther: "Övrigt", notes: "Anteckningar", save: "Spara", cancel: "Avbryt", delete: "Ta bort" },
  preferences: { title: "Inställningar", language: "Språk", currency: "Valuta", units: "Måttenheter", unitsMetric: "Metriskt (km, liter)", unitsImperial: "Brittiskt (miles, gallons)", notifications: "Notiser", notificationsEmail: "Mejla mig om konto och fakturering", save: "Spara inställningar", saved: "Inställningar sparade", more: "Dessa gäller som dina standardval i hela AutoVere." },
  profile: { title: "Profil och säkerhet", email: "E-post", security: "Inloggning", securityBody: "AutoVere använder säkra inloggningslänkar via e-post istället för lösenord — inget att komma ihåg, inget att gissa.", exportData: "Exportera mina data", exportDataBody: "Ladda ner en kopia av allt som är kopplat till ditt konto (profil, prenumeration, resor, fordon, platser).", dangerTitle: "Farlig zon", deleteAccount: "Ta bort konto", deleteConfirm: "Det här avslutar din prenumeration, tar bort dina sparade data och loggar ut dig överallt. Är du säker?", deleteCancel: "Avbryt" },
  help: { title: "Hjälp och support", subtitle: "Vi finns här om något inte fungerar som det ska.", faqTitle: "Vanliga frågor", faqBody: "Svar på de vanligaste frågorna om rutter, vägavgifter, vinjetter och laddning.", faqLink: "Öppna hjälp och FAQ", contactTitle: "Kontakta support", contactBody: "Skicka ett meddelande till oss — det är också rätt ställe att rapportera ett problem.", contactLink: "Skicka meddelande" },
};

const fr: AccountCopy = {
  nav: { overview: "Aperçu", trips: "Mes voyages", vehicles: "Mes véhicules", preferences: "Paramètres", billing: "Abonnement et facturation", places: "Lieux enregistrés", profile: "Profil et sécurité", help: "Aide et assistance" },
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
  trips: { title: "Mes voyages", emptyTitle: "Aucun voyage enregistré", emptyBody: "Enregistrez un voyage pour le retrouver facilement quand vous en aurez besoin.", repeat: "Refaire ce voyage", useAsStart: "Utiliser comme point de départ", print: "Imprimer / Enregistrer en PDF", days: "Jours", created: "Créé", estimate: "Estimation", rename: "Renommer", duplicate: "Dupliquer", delete: "Supprimer", deleteConfirm: "Supprimer ce voyage ? Cette action est irréversible.", save: "Enregistrer", cancel: "Annuler", savedOn: (date) => `Enregistré le ${date}` },
  vehicles: { title: "Mes véhicules", emptyTitle: "Aucun véhicule enregistré", emptyBody: "Ajoutez un véhicule pour l'utiliser directement dans le planificateur.", add: "Ajouter un véhicule", name: "Nom", namePlaceholder: "ex. VE familial", type: "Type", typePetrol: "Essence", typeDiesel: "Diesel", typeEv: "Électrique (VE)", consumption: "Consommation (L ou kWh /100km)", range: "Autonomie réelle (km)", default: "Par défaut", setDefault: "Définir par défaut", edit: "Modifier", delete: "Supprimer", deleteConfirm: "Supprimer ce véhicule ?", save: "Enregistrer", cancel: "Annuler" },
  places: { title: "Lieux enregistrés", emptyTitle: "Aucun lieu enregistré", emptyBody: "Enregistrez bornes de recharge, hébergements et arrêts à retrouver facilement.", add: "Ajouter un lieu", name: "Nom", namePlaceholder: "ex. Camping vue fjord", category: "Catégorie", categoryCharging: "Recharge", categoryCamping: "Camping / étape nocturne", categoryAttraction: "Attraction", categoryOther: "Autre", notes: "Notes", save: "Enregistrer", cancel: "Annuler", delete: "Supprimer" },
  preferences: { title: "Paramètres", language: "Langue", currency: "Devise", units: "Unités de mesure", unitsMetric: "Métrique (km, litres)", unitsImperial: "Impérial (miles, gallons)", notifications: "Notifications", notificationsEmail: "M'envoyer des e-mails sur mon compte et ma facturation", save: "Enregistrer les paramètres", saved: "Paramètres enregistrés", more: "Ces réglages s'appliquent par défaut dans tout AutoVere." },
  profile: { title: "Profil et sécurité", email: "E-mail", security: "Connexion", securityBody: "AutoVere utilise des liens de connexion sécurisés par e-mail plutôt qu'un mot de passe — rien à retenir, rien à deviner.", exportData: "Exporter mes données", exportDataBody: "Téléchargez une copie de tout ce qui est lié à votre compte (profil, abonnement, voyages, véhicules, lieux).", dangerTitle: "Zone sensible", deleteAccount: "Supprimer le compte", deleteConfirm: "Cela résilie votre abonnement, supprime vos données enregistrées et vous déconnecte partout. Êtes-vous sûr ?", deleteCancel: "Annuler" },
  help: { title: "Aide et assistance", subtitle: "Nous sommes là si quelque chose ne fonctionne pas comme prévu.", faqTitle: "Questions fréquentes", faqBody: "Réponses aux questions les plus courantes sur les itinéraires, péages, vignettes et recharge.", faqLink: "Ouvrir l'aide et la FAQ", contactTitle: "Contacter le support", contactBody: "Envoyez-nous un message, nous vous répondrons — c'est aussi l'endroit pour signaler un problème.", contactLink: "Envoyer un message" },
};

const da: AccountCopy = {
  nav: { overview: "Oversigt", trips: "Mine rejser", vehicles: "Mine køretøjer", preferences: "Indstillinger", billing: "Abonnement og fakturering", places: "Gemte steder", profile: "Profil og sikkerhed", help: "Hjælp og support" },
  backToPlanner: "Tilbage til planlæggeren",
  eyebrow: "AUTOVERE",
  title: "Min AutoVere",
  welcome: (name) => `Velkommen tilbage, ${name}`,
  subtitleActive: "Alt din plan låser op for, samlet ét sted.",
  subtitleFree: "Log ind- og abonnementsstatus for din AutoVere-konto.",
  loading: "Indlæser din konto…",
  loggedOut: { message: "Du er ikke logget ind, eller dit link er udløbet.", signIn: "Log ind" },
  plan: { free: "Gratis / Standard", status: "Status", active: "Aktiv", trialing: "Prøveperiode aktiv", billedMonthly: "faktureres månedligt", billedYearly: "faktureres årligt", cancelsAtPeriodEnd: "afsluttes ved periodens udgang", renewsOn: (date) => `Fornyes ${date}`, noSubscription: "Intet aktivt abonnement på denne konto." },
  actions: { viewPlans: "Se planer", manageBilling: "Administrer betaling", signOut: "Log ud", signingOut: "Logger ud…" },
  unlocked: { title: "Det, din plan låser op for", upgradeTitle: "Opgrader for mere tryghed på vejen", upgradeCta: "Se Pro- og Business-planer" },
  billing: { title: "Abonnement og fakturering", plan: "Plan", price: "Pris", renewsOn: "Næste fornyelse", paymentMethod: "Betalingsmetode", noPaymentMethod: "Ingen betalingsmetode registreret.", manage: "Administrer plan, betalingsmetode og fakturaer", history: "Faktureringshistorik", noHistory: "Ingen fakturaer endnu.", viewInvoice: "Vis", noSubscription: "Du har ikke noget aktivt abonnement endnu." },
  trips: { title: "Mine rejser", emptyTitle: "Ingen gemte rejser endnu", emptyBody: "Gem en rejse for at finde den igen, når du får brug for den.", repeat: "Gentag turen", useAsStart: "Brug som udgangspunkt", print: "Udskriv / Gem som PDF", days: "Dage", created: "Oprettet", estimate: "Prisoverslag", rename: "Omdøb", duplicate: "Dupliker", delete: "Slet", deleteConfirm: "Slet denne rejse? Dette kan ikke fortrydes.", save: "Gem", cancel: "Annuller", savedOn: (date) => `Gemt ${date}` },
  vehicles: { title: "Mine køretøjer", emptyTitle: "Ingen gemte køretøjer endnu", emptyBody: "Tilføj et køretøj for at bruge det direkte i planlæggeren.", add: "Tilføj køretøj", name: "Navn", namePlaceholder: "f.eks. Familie-elbil", type: "Type", typePetrol: "Benzin", typeDiesel: "Diesel", typeEv: "Elbil (EV)", consumption: "Forbrug (L eller kWh /100km)", range: "Reel rækkevidde (km)", default: "Standard", setDefault: "Angiv som standard", edit: "Rediger", delete: "Slet", deleteConfirm: "Slet dette køretøj?", save: "Gem", cancel: "Annuller" },
  places: { title: "Gemte steder", emptyTitle: "Ingen gemte steder endnu", emptyBody: "Gem ladestandere, overnatninger og stop, du gerne vil finde igen.", add: "Tilføj sted", name: "Navn", namePlaceholder: "f.eks. Fjordudsigt Camping", category: "Kategori", categoryCharging: "Opladning", categoryCamping: "Camping / overnatning", categoryAttraction: "Seværdighed", categoryOther: "Andet", notes: "Noter", save: "Gem", cancel: "Annuller", delete: "Slet" },
  preferences: { title: "Indstillinger", language: "Sprog", currency: "Valuta", units: "Måleenheder", unitsMetric: "Metrisk (km, liter)", unitsImperial: "Imperial (miles, gallons)", notifications: "Notifikationer", notificationsEmail: "Send mig e-mail om min konto og fakturering", save: "Gem indstillinger", saved: "Indstillinger gemt", more: "Disse gælder som dine standardvalg i hele AutoVere." },
  profile: { title: "Profil og sikkerhed", email: "E-mail", security: "Log ind", securityBody: "AutoVere bruger sikre login-links via e-mail i stedet for en adgangskode — intet at huske, intet at gætte.", exportData: "Eksporter mine data", exportDataBody: "Download en kopi af alt, der er knyttet til din konto (profil, abonnement, rejser, køretøjer, steder).", dangerTitle: "Farezone", deleteAccount: "Slet konto", deleteConfirm: "Dette opsiger dit abonnement, sletter dine gemte data og logger dig ud alle steder. Er du sikker?", deleteCancel: "Annuller" },
  help: { title: "Hjælp og support", subtitle: "Vi er her, hvis noget ikke fungerer, som det skal.", faqTitle: "Ofte stillede spørgsmål", faqBody: "Svar på de mest almindelige spørgsmål om ruter, vejafgifter, vignetter og opladning.", faqLink: "Åbn hjælp og FAQ", contactTitle: "Kontakt support", contactBody: "Send os en besked, så svarer vi dig — det er også det rette sted at rapportere et problem.", contactLink: "Send besked" },
};

export const accountCopy: Record<Locale, AccountCopy> = { en, de, nl, no, pl, sv, fr, da };

export function getAccountCopy(locale: Locale): AccountCopy {
  return accountCopy[locale] ?? en;
}
