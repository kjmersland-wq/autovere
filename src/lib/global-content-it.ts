import type { InfoPageContent } from "@/lib/info-content";

const DISCLAIMER = "Stime indicative — verifica sempre sui portali ufficiali.";

export const IT_HOW_IT_WORKS: InfoPageContent = {
  eyebrow: "Come funziona",
  title: "Da un'idea di massima a un viaggio su strada con i costi calcolati, in tre passaggi tranquilli.",
  intro:
    "AutoVere trasforma una partenza e una destinazione in un quadro dei costi trasparente e transfrontaliero — pedaggi, vignette, carburante, ricarica e traghetti — per auto, camper e moto da turismo.",
  sections: [
    {
      heading: "1 — Raccontaci il tuo viaggio",
      body: "Inserisci il punto di partenza e la destinazione, scegli il tipo di veicolo e la fonte di carburante o energia, e seleziona le preferenze di percorso, come deviazioni panoramiche, evitare i pedaggi o includere i traghetti.",
      items: [
        "Profili per auto, camper/camperizzato o moto da turismo",
        "Benzina, diesel o elettrico, con i tuoi dati di serbatoio, batteria e consumo",
        "Dispositivi di telepedaggio come AutoPASS, Telepass, Bip&Go, SunPass o E-ZPass",
      ],
    },
    {
      heading: "2 — Calcoliamo il costo reale di ogni chilometro",
      body: "Ogni paese o stato del tuo percorso viene calcolato separatamente, secondo il proprio modello di pedaggio — vignette elettroniche, barriere a distanza, cinture urbane o autostrade gratuite — oltre ai prezzi locali di carburante e ricarica rapida.",
      items: [
        "Ripartizione di pedaggi e vignette paese per paese, con il dettaglio di ogni casello autostradale",
        "Sconti per moto applicati dove i gestori pubblicano tariffe ridotte",
        "Costi di traghetti e passi di montagna elencati come voci separate",
        "Ottimizzatore intelligente di carburante e ricarica elettrica con un margine di sicurezza del 75% dell'autonomia",
      ],
    },
    {
      heading: "3 — Parti per il viaggio",
      body: "Esporta un file GPX per il tuo navigatore, salva l'itinerario in Il Mio Garage o condividilo con i tuoi compagni di viaggio. Ogni voce di pedaggio rimanda al portale ufficiale, così puoi pagare prima di attraversare il confine.",
      links: [
        { label: "ASFINAG (Austria)", url: "https://www.asfinag.at/" },
        { label: "AutoPASS (Norvegia)", url: "https://www.autopass.no/" },
        { label: "Telepass (Italia)", url: "https://www.telepass.com/" },
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Come funziona AutoVere — Pianificazione dei costi di viaggio transfrontalieri",
    description:
      "Scopri come AutoVere calcola pedaggi, vignette, carburante, ricarica elettrica e traghetti paese per paese per auto, camper e moto da turismo.",
  },
};

export const IT_PRICING: InfoPageContent = {
  eyebrow: "Prezzi",
  title: "Pianifica liberamente. Passa a un piano a pagamento solo quando il viaggio diventa più ambizioso.",
  intro:
    "La pianificazione dei viaggi quotidiani è gratuita. I piani a pagamento sono pensati per chi vive nel proprio veicolo per settimane e vuole un routing più avanzato, esportazioni offline e avventure salvate illimitate.",
  sections: [
    {
      heading: "Explorer — Gratis",
      body: "Tutto ciò che ti serve per una fuga di un weekend o un attraversamento tra due paesi.",
      items: [
        "Stime di viaggio illimitate in Europa, Stati Uniti e Canada",
        "Ripartizioni di pedaggi, vignette e traghetti per paese e per stato",
        "Stime di carburante e ricarica elettrica con link ai portali ufficiali",
        "Fino a 3 veicoli salvati e 5 viaggi salvati in Il Mio Garage",
      ],
    },
    {
      heading: "Voyager — 4,90 € / mese",
      body: "Per il grande tour estivo, il giro dei fiordi e la traversata da costa a costa.",
      items: [
        "Veicoli e avventure salvati illimitati",
        "Esportazione GPX con i waypoint di pedaggi e ricarica",
        "Consigli intelligenti di arbitraggio del carburante e avvisi per i tratti lunghi",
        "Aggiornamenti prioritari quando cambiano i prezzi di pedaggi o vignette",
      ],
    },
    {
      heading: "Flotta e Partner — a partire da 29 € / mese",
      body: "Per flotte a noleggio, concessionari di camper, club motociclistici e operatori turistici.",
      items: [
        "Profili multi-veicolo e itinerari condivisi per il tuo team",
        "Fogli di viaggio personalizzati da consegnare ai tuoi clienti",
        "Accesso API alle stime dei costi (attualmente in anteprima privata)",
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Prezzi — Pianificazione di viaggio gratuita, piano Voyager opzionale | AutoVere",
    description:
      "AutoVere è gratuito per la pianificazione di viaggi quotidiani. I piani Voyager e Flotta aggiungono viaggi salvati illimitati, esportazione GPX e strumenti per partner.",
  },
};

export const IT_FAQ: InfoPageContent = {
  eyebrow: "Domande frequenti",
  title: "Tutto ciò che i viaggiatori ci chiedono prima di partire.",
  intro:
    "Risposte chiare su come vengono costruite le nostre stime, da dove provengono i dati e cosa devi ancora acquistare tu stesso.",
  sections: [
    {
      heading: "Quanto sono precise le stime dei costi?",
      body: "Ci basiamo sulle tariffe di pedaggio pubblicate, sui prezzi delle vignette e sui prezzi medi regionali di carburante e ricarica. I costi reali variano in base ai mercati del carburante, alle tariffe stagionali, ai prezzi in base all'orario e alle regole di classe del veicolo, quindi considera ogni cifra come un'indicazione ben fondata e confermala sul portale ufficiale prima di viaggiare.",
    },
    {
      heading: "Vendete vignette o pass per i pedaggi?",
      body: "No. Deliberatamente non li rivendiamo mai. Ogni voce di pedaggio rimanda direttamente al gestore ufficiale — ASFINAG, via.admin.ch, AutoPASS, Telepass, 407 ETR, SunPass e altri — così paghi sempre il prezzo reale, senza sovrapprezzo di rivendita.",
    },
    {
      heading: "Come vengono gestite le moto?",
      body: "Le moto da turismo vengono calcolate come classe di veicolo a sé stante. Dove i gestori pubblicano tariffe ridotte per le moto applichiamo uno sconto indicativo, le cinture urbane norvegesi vengono mostrate come gratuite per i due ruote, e disponi di un radar di sicurezza ed equipaggiamento specifico per motociclisti sui passi di montagna.",
    },
    {
      heading: "E per camper e caravan?",
      body: "I camper vengono calcolati in base a peso e classe di assale dove applicabile, e mostriamo avvisi di altezza, lunghezza e peso per gallerie, passi e ponti bassi lungo il percorso.",
    },
    {
      heading: "Supportate i veicoli elettrici?",
      body: "Sì. Scegli Elettrico (EV) e inserisci la dimensione della batteria e il consumo. Pianifichiamo le soste di ricarica ad alta potenza con un margine di sicurezza del 75% dell'autonomia e ti mostriamo le reti che incontrerai — Ionity, Fastned, Tesla Supercharger, Electrify America e FLO.",
    },
    {
      heading: "Devo avere un account?",
      body: "No. Puoi pianificare ed esportare senza registrarti. Il Mio Garage salva i tuoi veicoli e viaggi sul tuo stesso dispositivo, quindi nulla lascia il tuo browser a meno che tu non scelga di condividerlo.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "FAQ — Domande su pedaggi, vignette, carburante e ricarica EV | AutoVere",
    description:
      "Risposte sulla precisione delle stime, i portali ufficiali dei pedaggi, le classi per moto e camper, la pianificazione della ricarica EV e gli account.",
  },
};

export const IT_PARTNERS: InfoPageContent = {
  eyebrow: "Partner",
  title: "Collaboriamo con chi tiene la strada in movimento.",
  intro:
    "AutoVere si collega ai gestori ufficiali dei pedaggi e collabora con aziende di viaggi, noleggio e motociclismo in Europa, Stati Uniti e Canada.",
  sections: [
    {
      heading: "Gestori ufficiali di pedaggi e vignette a cui ci colleghiamo",
      body: "Ogni acquisto avviene sul sito del gestore stesso. Non agiamo mai come rivenditori.",
      links: [
        { label: "ASFINAG — Austria", url: "https://www.asfinag.at/" },
        { label: "via.admin.ch — Svizzera", url: "https://via.admin.ch/" },
        { label: "AutoPASS — Norvegia", url: "https://www.autopass.no/" },
        { label: "Telepass — Italia", url: "https://www.telepass.com/" },
        { label: "DARS — Slovenia", url: "https://www.dars.si/" },
        { label: "407 ETR — Ontario", url: "https://www.407etr.com/" },
        { label: "SunPass — Florida", url: "https://www.sunpass.com/" },
      ],
    },
    {
      heading: "Chi collabora con noi",
      items: [
        "Flotte a noleggio di camper e caravan che cercano preventivi di viaggio trasparenti",
        "Operatori di tour in moto e club motociclistici che pianificano percorsi alpini e sui fiordi",
        "Reti di ricarica elettrica e app di pianificazione dei percorsi",
        "Enti del turismo che promuovono passi panoramici, strade costiere e traversate in traghetto",
      ],
    },
    {
      heading: "Collabora con noi",
      body: "KM TECH LABS ha sede a Kristiansand, Norvegia. Se gestisci una flotta, un'attività turistica o un servizio di pedaggio e vuoi parlare di integrazione, co-marketing o partnership sui dati, scrivici a partners@autovere.com.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Partner — Gestori ufficiali dei pedaggi e partner di viaggio | AutoVere",
    description:
      "AutoVere si collega direttamente ai gestori ufficiali di pedaggi e vignette e collabora con flotte a noleggio, operatori turistici e reti di ricarica.",
  },
};

export const IT_PRIVACY: InfoPageContent = {
  eyebrow: "Informativa sulla privacy",
  title: "Il tuo percorso è affar tuo.",
  intro:
    "AutoVere è gestito da KM TECH LABS, Kristiansand, Norvegia. Limitiamo la raccolta dei dati al minimo necessario per fornirti una stima dei costi accurata.",
  sections: [
    {
      heading: "Cosa memorizziamo",
      items: [
        "I dati del viaggio (partenza, destinazione, veicolo e preferenze) usati per generare la tua stima",
        "Veicoli e viaggi salvati — memorizzati localmente nel tuo browser, non sui nostri server",
        "Statistiche di utilizzo aggregate e non identificative per migliorare il pianificatore",
      ],
    },
    {
      heading: "Cosa non facciamo",
      items: [
        "Non vendiamo né affittiamo dati personali",
        "Non tracciamo la tua posizione in tempo reale",
        "Non richiediamo un account per pianificare, esportare o condividere un viaggio",
      ],
    },
    {
      heading: "I tuoi diritti secondo il GDPR",
      body: "In quanto operatore con sede in Norvegia/SEE, rispettiamo il GDPR. Puoi richiedere accesso, rettifica, cancellazione, limitazione, portabilità dei dati, oppure opporti al trattamento. Cancellare l'archiviazione del tuo browser rimuove immediatamente i tuoi veicoli e viaggi salvati.",
    },
    {
      heading: "Cookie e analisi",
      body: "Utilizziamo l'archiviazione essenziale per ricordare la tua regione, la lingua e il garage. Qualsiasi analisi che effettuiamo è aggregata e non può identificarti individualmente.",
    },
    {
      heading: "Contatti",
      body: "Domande sulla privacy: privacy@autovere.com — KM TECH LABS, Kristiansand, Norvegia. Avvisi regionali: la privacy negli Stati Uniti è trattata su /us/legal, mentre i diritti previsti dal PIPEDA canadese e dalla Legge 25 del Québec sono trattati su /ca/legal.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Informativa sulla privacy — GDPR, archiviazione locale e i tuoi dati | AutoVere",
    description:
      "Come KM TECH LABS gestisce i dati del viaggio, i dati del garage archiviati localmente, i cookie e i tuoi diritti GDPR su AutoVere.",
  },
};

export const IT_TERMS: InfoPageContent = {
  eyebrow: "Termini di servizio",
  title: "Termini chiari, per pianificare con fiducia.",
  intro:
    "Utilizzando AutoVere accetti questi termini. Esistono per mantenere aspettative oneste su cosa sia — e cosa non sia — una stima dei costi.",
  sections: [
    {
      heading: "Stime, non fatture",
      body: "Tutti i costi mostrati sono stime indicative basate su tariffe pubblicate e prezzi medi regionali. I pedaggi, le vignette, il carburante, la ricarica e le tariffe dei traghetti reali possono variare in base alla classe del veicolo, alla stagione, all'orario e a modifiche dei gestori. Verifica sempre con il portale ufficiale prima di viaggiare.",
    },
    {
      heading: "Uso sicuro e lecito",
      items: [
        "Non usare AutoVere mentre guidi — pianifica prima di partire",
        "Rispetta il codice della strada locale, le regole di classe del veicolo e le restrizioni su passi o gallerie",
        "Non è consentito lo scraping automatizzato, la rivendita dei nostri contenuti né presentarli come prezzi ufficiali",
      ],
    },
    {
      heading: "Link e servizi di terze parti",
      body: "I link a gestori di pedaggi, compagnie di traghetti e reti di ricarica sono forniti per comodità. Questi servizi hanno propri termini e prezzi, e KM TECH LABS non è responsabile del loro contenuto o delle loro transazioni.",
    },
    {
      heading: "Responsabilità",
      body: "AutoVere è fornito “così com'è”. Nella misura consentita dalla legge, KM TECH LABS non è responsabile per costi, multe, coincidenze perse o perdite derivanti dall'affidamento su una stima.",
    },
    {
      heading: "Legge applicabile",
      body: "Questi termini sono regolati dalla legge norvegese, con Kristiansand come foro competente concordato, fatte salve le tutele obbligatorie del consumatore previste dal tuo paese di residenza.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Termini di servizio — Disclaimer sulle stime e uso corretto | AutoVere",
    description:
      "I termini di servizio di AutoVere di KM TECH LABS: stime indicative, uso sicuro, link di terze parti, responsabilità e legge applicabile.",
  },
};
