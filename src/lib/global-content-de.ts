import type { InfoPageContent } from "@/lib/info-content";

const DISCLAIMER = "Nur Richtwerte — bitte immer auf den offiziellen Portalen überprüfen.";

export const DE_HOW_IT_WORKS: InfoPageContent = {
  eyebrow: "So funktioniert's",
  title: "Von einer groben Idee zu einer durchgerechneten Autoreise in drei ruhigen Schritten.",
  intro:
    "AutoVere verwandelt Start und Ziel in ein transparentes, grenzüberschreitendes Kostenbild — Maut, Vignetten, Kraftstoff, Laden und Fähren — für Autos, Wohnmobile und Reisemotorräder.",
  sections: [
    {
      heading: "1 — Erzählen Sie uns von der Reise",
      body: "Geben Sie Start und Ziel ein, wählen Sie Ihren Fahrzeugtyp sowie Kraftstoff- oder Antriebsart, und legen Sie Routenpräferenzen wie malerische Umwege, Mautvermeidung oder Fähren fest.",
      items: [
        "Profile für Auto, Wohnmobil/Campervan oder Reisemotorrad",
        "Benzin, Diesel oder Elektro mit eigenen Angaben zu Tank, Batterie und Verbrauch",
        "Mauttransponder wie AutoPASS, Telepass, Bip&Go, SunPass oder E-ZPass",
      ],
    },
    {
      heading: "2 — Wir berechnen die tatsächlichen Kosten jedes Kilometers",
      body: "Jedes Land und jeder Bundesstaat auf Ihrer Route wird einzeln nach seinem eigenen Mautsystem berechnet — elektronische Vignetten, Streckenmaut, Stadtringe oder mautfreie Autobahnen — dazu lokale Kraftstoff- und Schnellladepreise.",
      items: [
        "Aufschlüsselung von Maut und Vignetten Land für Land, mit Details zu jedem Kontrollpunkt",
        "Motorrad-Rabatte, wo Betreiber eigene Tarife anbieten",
        "Fähren und Bergpässe als eigene Posten aufgeführt",
        "Intelligente Kraftstoff- und Ladeoptimierung mit 75 % Reichweitenpuffer",
      ],
    },
    {
      heading: "3 — Nehmen Sie es mit auf die Straße",
      body: "Laden Sie eine GPX-Datei für Ihr Navigationsgerät herunter, speichern Sie die Route in Meiner Garage oder teilen Sie sie mit Ihren Mitreisenden. Jeder Mautposten führt direkt zum offiziellen Portal, sodass Sie vor der Grenze bezahlen können.",
      links: [
        { label: "ASFINAG (Österreich)", url: "https://www.asfinag.at/" },
        { label: "AutoPASS (Norwegen)", url: "https://www.autopass.no/" },
        { label: "Telepass (Italien)", url: "https://www.telepass.com/" },
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "So funktioniert AutoVere — Kostenplanung für grenzüberschreitende Autoreisen",
    description:
      "Erfahren Sie, wie AutoVere Maut, Vignetten, Kraftstoff, Laden und Fähren Land für Land für Autos, Wohnmobile und Reisemotorräder berechnet.",
  },
};

export const DE_PRICING: InfoPageContent = {
  eyebrow: "Preise",
  title: "Planen Sie frei. Upgraden Sie erst, wenn die Reise ambitionierter wird.",
  intro:
    "Die alltägliche Reiseplanung ist kostenlos. Kostenpflichtige Pläne sind für Reisende gedacht, die wochenlang in ihrem Fahrzeug leben und tiefere Routenplanung, Offline-Exporte und unbegrenzt gespeicherte Abenteuer möchten.",
  sections: [
    {
      heading: "Explorer — Kostenlos",
      body: "Alles, was Sie für einen Wochenendausflug oder eine Fahrt durch zwei Länder brauchen.",
      items: [
        "Unbegrenzte Reisekostenschätzungen für Europa, die USA und Kanada",
        "Aufschlüsselungen von Maut, Vignetten und Fähren nach Land und Bundesstaat",
        "Kraftstoff- und Ladekostenschätzungen mit Links zu offiziellen Portalen",
        "Bis zu 3 gespeicherte Fahrzeuge und 5 gespeicherte Reisen in Meiner Garage",
      ],
    },
    {
      heading: "Voyager — 4,90 € / Monat",
      body: "Für die lange Sommertour, die Fahrt entlang der Fjorde und die Reise von Küste zu Küste.",
      items: [
        "Unbegrenzt gespeicherte Fahrzeuge und Abenteuer",
        "GPX-Export mit Maut- und Ladepunkten",
        "Intelligente Hinweise zu Kraftstoffpreisen und Warnungen bei langen Abschnitten",
        "Bevorzugte Benachrichtigungen bei Änderungen der Maut- oder Vignettenpreise",
      ],
    },
    {
      heading: "Fleet & Partners — ab 29 € / Monat",
      body: "Für Mietflotten, Wohnmobilhändler, Motorradclubs und Reiseveranstalter.",
      items: [
        "Profile für mehrere Fahrzeuge und gemeinsame Routen für Ihr Team",
        "Individuell gebrandete Reiseübersichten für Ihre Kunden",
        "API-Zugang zu Kostenschätzungen (derzeit in privater Vorschau)",
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Preise — Kostenlos, Trip Pass, Pro und Business | AutoVere",
    description:
      "Roadtrips kostenlos planen. Der Trip Pass schaltet Exporte 14 Tage lang mit einer Zahlung frei; Pro und Business bieten unbegrenzt gespeicherte Reisen, Fahrzeuge und Team-Tools.",
  },
};

export const DE_FAQ: InfoPageContent = {
  eyebrow: "Häufig gestellte Fragen",
  title: "Alles, was Reisende uns fragen, bevor sie losfahren.",
  intro:
    "Ehrliche Antworten dazu, wie unsere Schätzungen entstehen, woher die Daten stammen und was Sie noch selbst kaufen müssen.",
  sections: [
    {
      heading: "Wie genau sind die Kostenschätzungen?",
      body: "Wir stützen uns auf veröffentlichte Mauttarife, Vignettenpreise sowie durchschnittliche regionale Kraftstoff- und Ladepreise. Die tatsächlichen Kosten schwanken mit den Kraftstoffmärkten, saisonalen Tarifen, Tageszeit-Preisen und Fahrzeugklassen — betrachten Sie jede Zahl also als gut fundierten Anhaltspunkt und bestätigen Sie sie vor der Reise auf dem offiziellen Portal.",
    },
    {
      heading: "Verkaufen Sie Vignetten oder Mautkarten?",
      body: "Nein. Wir verkaufen sie bewusst nie weiter. Jeder Mautposten führt direkt zum offiziellen Betreiber — ASFINAG, via.admin.ch, AutoPASS, Telepass, 407 ETR, SunPass und andere — sodass Sie immer den echten Preis ohne Wiederverkaufsaufschlag zahlen.",
    },
    {
      heading: "Wie werden Motorräder behandelt?",
      body: "Reisemotorräder werden als eigene Fahrzeugklasse berechnet. Wo Betreiber ermäßigte Motorradtarife veröffentlichen, wenden wir einen Richtwert-Rabatt an, norwegische Stadtringe werden für Zweiräder als kostenlos ausgewiesen, und Sie erhalten einen speziellen Sicherheits- und Ausrüstungsradar für Bergpässe.",
    },
    {
      heading: "Was ist mit Wohnmobilen und Campervans?",
      body: "Wohnmobile werden, wo zutreffend, nach Gewicht und Achsklasse berechnet, und wir zeigen Warnungen zu Durchfahrtshöhe, Länge und Gewicht bei Tunneln, Pässen und niedrigen Brücken entlang der Route.",
    },
    {
      heading: "Unterstützen Sie Elektrofahrzeuge?",
      body: "Ja. Wählen Sie Elektro (EV) und geben Sie Ihre Batteriegröße und Ihren Verbrauch ein. Wir planen Schnellladestopps mit einem 75 % Reichweitenpuffer und zeigen Ihnen die Netzwerke, die Sie treffen werden — Ionity, Fastned, Tesla Supercharger, Electrify America und FLO.",
    },
    {
      heading: "Brauche ich ein Konto?",
      body: "Nein. Sofortige Berechnung — für die Vorschau ist kein Konto nötig. Meine Garage speichert Ihre Fahrzeuge und Reisen lokal auf Ihrem eigenen Gerät; Exporte (GPX, PDF-Reiseplan, Send-to-Car) werden mit dem einmaligen 14-Tage-Trip Pass oder Pro freigeschaltet.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "FAQ — Maut, Vignetten, Kraftstoff und EV-Laden | AutoVere",
    description:
      "Antworten zur Genauigkeit der Schätzungen, offiziellen Mautportalen, Motorrad- und Wohnmobilklassen, EV-Ladeplanung und Konten.",
  },
};

export const DE_PARTNERS: InfoPageContent = {
  eyebrow: "Partner",
  title: "Wir arbeiten mit denen zusammen, die Menschen in Bewegung bringen.",
  intro:
    "Wir verlinken grundsätzlich direkt zu den offiziellen Maut- und Vignettenbetreibern und arbeiten gerne mit Reise-, Vermietungs- und Motorradunternehmen in ganz Europa, den USA und Kanada zusammen.",
  sections: [
    {
      heading: "Offizielle Maut- und Vignettenanbieter, mit denen wir verlinkt sind",
      body: "Jeder Kauf läuft direkt über die eigene Website des Anbieters — wir schlagen nie etwas oben drauf.",
      links: [
        { label: "ASFINAG — Österreich", url: "https://www.asfinag.at/" },
        { label: "via.admin.ch — Schweiz", url: "https://via.admin.ch/" },
        { label: "AutoPASS — Norwegen", url: "https://www.autopass.no/" },
        { label: "Telepass — Italien", url: "https://www.telepass.com/" },
        { label: "DARS — Slowenien", url: "https://www.dars.si/" },
        { label: "407 ETR — Ontario", url: "https://www.407etr.com/" },
        { label: "SunPass — Florida", url: "https://www.sunpass.com/" },
      ],
    },
    {
      heading: "Diese Partner arbeiten mit uns zusammen",
      items: [
        "Vermieter von Wohnmobilen und Wohnwagen, die ihren Kunden ehrliche, transparente Reisekosten bieten möchten",
        "Motorrad-Reiseveranstalter und Clubs, die Touren durch die Alpen oder entlang norwegischer Fjorde planen",
        "Ladenetzwerke für Elektrofahrzeuge und Routenplanungs-Apps",
        "Tourismusverbände, die malerische Passstraßen, Küstenstraßen und Fährverbindungen bekannt machen möchten",
      ],
    },
    {
      heading: "Werden Sie Teil des Netzwerks",
      body: "Wir arbeiten gerne mit Partnern überall zusammen. Betreiben Sie eine Fahrzeugflotte, ein Reiseunternehmen oder einen Mautdienst und möchten über Integration, gemeinsames Marketing oder eine Datenpartnerschaft sprechen? Schreiben Sie uns einfach an kjell@autovere.com — wir freuen uns, von Ihnen zu hören.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Partner — Offizielle Mautbetreiber und Reisepartner | AutoVere",
    description:
      "AutoVere verlinkt direkt zu offiziellen Maut- und Vignettenbetreibern und arbeitet mit Mietflotten, Reiseveranstaltern und Ladenetzwerken zusammen.",
  },
};

export const DE_PRIVACY: InfoPageContent = {
  eyebrow: "Datenschutzerklärung",
  title: "Ihre Route ist Ihre Sache.",
  intro:
    "AutoVere wird von KM TECH LABS betrieben. Wir beschränken die Datenerhebung auf das Minimum, das für eine genaue Kostenschätzung nötig ist.",
  sections: [
    {
      heading: "Was wir speichern",
      items: [
        "Reiseeingaben (Start, Ziel, Fahrzeug und Präferenzen), die für Ihre Schätzung verwendet werden",
        "Gespeicherte Fahrzeuge und Reisen — lokal in Ihrem eigenen Browser gespeichert, nicht auf unseren Servern",
        "Aggregierte, nicht identifizierbare Nutzungsstatistiken zur Verbesserung des Planers",
      ],
    },
    {
      heading: "Was wir nicht tun",
      items: [
        "Wir verkaufen oder vermieten niemals personenbezogene Daten",
        "Wir verfolgen nicht Ihren Live-Standort",
        "Wir verlangen kein Konto, um eine Reise zu planen, zu exportieren oder zu teilen",
      ],
    },
    {
      heading: "Ihre Rechte nach der DSGVO",
      body: "Als Betreiber mit Sitz in Norwegen/EWR halten wir uns an die DSGVO. Sie können Zugang, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit beantragen oder der Verarbeitung widersprechen. Das Löschen Ihres Browserspeichers entfernt sofort Ihre gespeicherten Fahrzeuge und Reisen.",
    },
    {
      heading: "Cookies und Analytik",
      body: "Wir verwenden essenzielle Speicherung, um Ihre Region, Sprache und Garage zu merken. Jede Analytik, die wir durchführen, ist aggregiert und kann Sie nicht individuell identifizieren.",
    },
    {
      heading: "Kontakt",
      body: "Fragen zum Datenschutz: kjell@autovere.com — KM TECH LABS. Regionale Hinweise: US-Datenschutz finden Sie unter /us/legal, und kanadische PIPEDA- sowie Québec-Gesetz-25-Rechte unter /ca/legal.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Datenschutz — DSGVO, lokale Speicherung und Ihre Daten | AutoVere",
    description:
      "Wie KM TECH LABS mit Reiseeingaben, lokal gespeicherten Garagendaten, Cookies und Ihren DSGVO-Rechten bei AutoVere umgeht.",
  },
};

export const DE_TERMS: InfoPageContent = {
  eyebrow: "Nutzungsbedingungen",
  title: "Klare Bedingungen, damit Sie mit Zuversicht planen können.",
  intro:
    "Durch die Nutzung von AutoVere stimmen Sie diesen Bedingungen zu. Sie sollen ehrlich klären, was eine Kostenschätzung ist — und was nicht.",
  sections: [
    {
      heading: "Schätzungen, keine Rechnungen",
      body: "Alle angezeigten Kosten sind Richtwerte auf Basis veröffentlichter Tarife und durchschnittlicher regionaler Preise. Tatsächliche Maut, Vignetten, Kraftstoff, Ladekosten und Fährpreise können je nach Fahrzeugklasse, Saison, Tageszeit und Änderungen der Betreiber abweichen. Bestätigen Sie Informationen immer vor der Reise auf dem offiziellen Portal.",
    },
    {
      heading: "Sichere und rechtmäßige Nutzung",
      items: [
        "Nutzen Sie AutoVere nicht während der Fahrt — planen Sie, bevor Sie losfahren",
        "Beachten Sie lokale Verkehrsvorschriften, Fahrzeugklassen sowie Tunnel- und Pass-Beschränkungen",
        "Automatisiertes Auslesen von Daten, der Weiterverkauf unserer Inhalte oder deren Darstellung als offizielle Preise sind nicht gestattet",
      ],
    },
    {
      heading: "Links und Dienste Dritter",
      body: "Links zu Mautbetreibern, Fährunternehmen und Ladenetzwerken dienen ausschließlich der Bequemlichkeit. Diese Dienste haben eigene Bedingungen und Preise, und KM TECH LABS übernimmt keine Verantwortung für deren Inhalte oder Transaktionen.",
    },
    {
      heading: "Haftung",
      body: "AutoVere wird „wie besehen“ bereitgestellt. Soweit gesetzlich zulässig, haftet KM TECH LABS nicht für Kosten, Bußgelder, verpasste Überfahrten oder Verluste, die sich aus dem Vertrauen auf eine Schätzung ergeben.",
    },
    {
      heading: "Anwendbares Recht",
      body: "Diese Bedingungen unterliegen norwegischem Recht, unbeschadet zwingender Verbraucherschutzrechte in Ihrem Wohnsitzland.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Nutzungsbedingungen — Haftungsausschluss für Schätzungen und faire Nutzung | AutoVere",
    description:
      "Die Nutzungsbedingungen von AutoVere durch KM TECH LABS: Richtwerte, sichere Nutzung, Links Dritter, Haftung und anwendbares Recht.",
  },
};
