import { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Lang } from "@/i18n/config";

export type LegalDocKey = "terms" | "privacy" | "cookies" | "refund" | "subscriptions";

export interface LegalDocContent {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  seoTitle: string;
  seoDescription: string;
  sections: { id: string; title: string; body: ReactNode }[];
}

const UPDATED = "May 6, 2026";
const UPDATED_NO = "6. mai 2026";
const UPDATED_DE = "6. Mai 2026";
const UPDATED_SV = "6 maj 2026";
const UPDATED_FR = "6 mai 2026";

const PADDLE_MOR = {
  en: "Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.",
  no: "Vår bestillingsprosess gjennomføres av vår nettforhandler Paddle.com. Paddle.com er Merchant of Record for alle våre bestillinger. Paddle håndterer alle kundeservicehenvendelser og returer.",
  de: "Unser Bestellprozess wird von unserem Online-Reseller Paddle.com abgewickelt. Paddle.com ist Merchant of Record für alle unsere Bestellungen. Paddle bearbeitet alle Kundenanfragen und Retouren.",
  sv: "Vår beställningsprocess hanteras av vår onlineåterförsäljare Paddle.com. Paddle.com är Merchant of Record för alla våra beställningar. Paddle hanterar alla kundtjänstärenden och returer.",
  fr: "Notre processus de commande est géré par notre revendeur en ligne Paddle.com. Paddle.com est le Merchant of Record pour toutes nos commandes. Paddle gère toutes les demandes de service client et les retours.",
};

// =============== EN ==================
const en = (): Record<LegalDocKey, LegalDocContent> => ({
  terms: {
    eyebrow: "Terms of Service",
    title: "The agreement between you and AUTOVERE.",
    intro:
      "These terms describe how AUTOVERE works, what you can expect from us, and what we expect from you. Written in plain language — because trust starts with clarity.",
    updated: UPDATED,
    seoTitle: "Terms of Service · AUTOVERE",
    seoDescription:
      "The terms that govern your use of AUTOVERE — a calmer, intelligent way to discover your next car.",
    sections: [
      { id: "seller", title: "Who you are contracting with", body: <p>AUTOVERE is operated by <strong>Boutique24Shop v/ K.Mersland</strong> ("we", "us", "AUTOVERE"), based in Norway. By using AUTOVERE you enter into a binding agreement with Boutique24Shop v/ K.Mersland.</p> },
      { id: "acceptance", title: "Acceptance of terms", body: <p>By using AUTOVERE you agree to these terms. If you do not agree, please do not use the service. We may update these terms from time to time; we will note the date at the top whenever we do.</p> },
      { id: "service", title: "What AUTOVERE is", body: <><p>AUTOVERE is an intelligent automotive discovery platform. We help people explore, compare and understand vehicles using curated content, public data, official manufacturer resources and AI-assisted insights.</p><p>AUTOVERE is <strong>not</strong> a dealership or marketplace. We do not sell vehicles and we are not party to any purchase you make from a third party.</p></> },
      { id: "accounts", title: "Accounts and eligibility", body: <p>You must be at least 16 years old to use AUTOVERE. You are responsible for keeping your account credentials safe and for activity that takes place under your account.</p> },
      { id: "subscriptions", title: "Subscriptions and billing", body: <><p>Some AUTOVERE features are available through a paid subscription. Pricing, billing cycles and renewal terms are presented on the <Link to="/pricing">Pricing page</Link> and at checkout.</p><p>Subscriptions renew automatically until cancelled. You can cancel at any time — see the <Link to="/legal/subscriptions">Subscription Terms</Link> for details.</p><p>{PADDLE_MOR.en}</p></> },
      { id: "ai", title: "AI-assisted recommendations", body: <><p>AUTOVERE uses AI to help you compare and understand vehicles. Recommendations are generated from public sources, manufacturer information, reviewer consensus and model analysis.</p><p>AI insights are intended as guidance, not professional advice. Vehicle data, specifications and availability vary by region. Always verify final details directly with the manufacturer or seller before purchase.</p></> },
      { id: "acceptable-use", title: "Acceptable use", body: <p>Don't use AUTOVERE to break the law, infringe others' rights, scrape or resell our content at scale, attempt to disrupt the service, or misuse our AI features. We may suspend access if these terms are violated.</p> },
      { id: "ip", title: "Intellectual property", body: <p>AUTOVERE, the AutoVere advisor, our editorial content and design are protected by intellectual property laws. Vehicle names, marks and imagery belong to their respective manufacturers and are used for editorial purposes.</p> },
      { id: "warranty", title: "Disclaimers and liability", body: <p>AUTOVERE is provided "as is". To the maximum extent permitted by law, we exclude implied warranties and limit our liability to the amount you paid us in the 12 months before the event giving rise to the claim.</p> },
      { id: "law", title: "Governing law", body: <p>These terms are governed by the laws of Norway. Disputes that cannot be resolved informally fall under the jurisdiction of the Norwegian courts.</p> },
      { id: "contact", title: "Contact", body: <p>Questions about these terms? <Link to="/contact">Get in touch</Link> with our team.</p> },
    ],
  },
  privacy: {
    eyebrow: "Privacy Policy",
    title: "Your data, treated with care.",
    intro: "We collect only what's necessary to make AUTOVERE work beautifully — and we tell you exactly what that is.",
    updated: UPDATED,
    seoTitle: "Privacy Policy · AUTOVERE",
    seoDescription: "How AUTOVERE collects, uses and protects your personal data. Privacy by design, in plain language.",
    sections: [
      { id: "who", title: "Who we are", body: <p>AUTOVERE is operated by <strong>Boutique24Shop v/ K.Mersland</strong>, based in Norway. We are the data controller for the personal data described below.</p> },
      { id: "what", title: "What we collect", body: <>
        <p><strong>Account data</strong> — name, email and authentication identifiers when you create an account.</p>
        <p><strong>Usage data</strong> — pages viewed, searches, comparisons and advisor conversations, used to improve the product.</p>
        <p><strong>Billing data</strong> — when you subscribe, our payment provider <strong>Paddle.com Market Limited</strong> ("Paddle") acts as Merchant of Record. Paddle hosts the checkout, processes your payment, calculates and remits sales tax/VAT, prevents fraud, and issues invoices. We never see or store your full card details.</p>
        <p className="!mb-2"><strong>Data collected and processed by Paddle (not by us):</strong></p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Full name and email address</li>
          <li>Billing address (street, city, postal code, state/region, country)</li>
          <li>Payment method details (full card number, expiry, CVC, or PayPal/Apple Pay/Google Pay token)</li>
          <li>Bank or card-issuer information used for authorisation and 3-D Secure</li>
          <li>IP address and approximate geolocation (used for fraud scoring and tax determination)</li>
          <li>Device and browser fingerprint (user-agent, language, timezone)</li>
          <li>Tax/VAT identification number (for business customers, where provided)</li>
          <li>Business name and tax country (for B2B invoicing)</li>
          <li>Currency and converted amount</li>
          <li>Transaction history, refunds, chargebacks and dispute records</li>
          <li>Communications with Paddle's customer support</li>
        </ul>
        <p className="!mb-2"><strong>Data we receive back from Paddle and store on your account:</strong></p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Paddle customer ID and Paddle subscription ID (internal identifiers)</li>
          <li>Product ID and price ID of the plan you purchased (e.g. <code>premium_monthly</code>)</li>
          <li>Subscription status (<code>trialing</code>, <code>active</code>, <code>past_due</code>, <code>paused</code>, <code>canceled</code>)</li>
          <li>Current billing period start and end dates</li>
          <li>Whether the subscription is scheduled to cancel at period end</li>
          <li>Environment flag (<code>sandbox</code> or <code>live</code>)</li>
          <li>Country code of the billing address (for tax compliance and localised pricing)</li>
          <li>Currency and amount of each transaction</li>
          <li>Last four digits and brand of the card used (e.g. "Visa •••• 4242")</li>
          <li>Transaction timestamps (created, paid, refunded)</li>
          <li>Invoice and receipt URLs hosted by Paddle</li>
        </ul>
        <p>We use this data to provision your subscription, gate Premium features, send renewal and receipt notifications, handle support requests, and meet our accounting and tax obligations. See <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline">Paddle's Privacy Policy</a> for how Paddle handles the data it collects.</p>
        <p><strong>Messages you send us</strong> — anything you write in the contact form.</p>
      </> },
      { id: "why", title: "Why we use it", body: <p>To provide the service, personalise recommendations, prevent abuse, comply with legal obligations, and respond to you when you reach out. We do not sell personal data, ever.</p> },
      { id: "ai", title: "AI and your data", body: <p>Conversations with our AI advisor are processed through trusted AI providers to generate responses. We do not use your private conversations to train external models. Anonymised, aggregated patterns may be used to improve our own product.</p> },
      { id: "sharing", title: "Who we share with", body: <>
        <p>Carefully selected processors that help us run AUTOVERE — hosting, analytics, email delivery and AI inference. Each is bound by data-processing agreements and may only use your data on our instructions.</p>
        <p><strong>Paddle.com Market Limited</strong> — our Merchant of Record for all paid subscriptions. Paddle receives data necessary to process your payment, manage your subscription, calculate and remit sales tax/VAT, prevent fraud, and issue invoices. Paddle acts as an independent data controller for this processing. See <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline">Paddle's Privacy Policy</a>.</p>
        <p><strong>Authorities and professional advisers</strong> — where required by law or to protect our legal rights.</p>
      </> },
      { id: "retention", title: "How long we keep it", body: <p>We keep personal data only as long as needed for the purposes above, or as required by law. Contact-form messages are retained for up to 24 months.</p> },
      { id: "rights", title: "Your rights", body: <p>Under GDPR you can request access, correction, deletion, portability or restriction of your data, and object to certain processing. To exercise any of these rights, <Link to="/contact">contact us</Link>. You also have the right to lodge a complaint with the Norwegian Data Protection Authority (Datatilsynet).</p> },
      { id: "security", title: "Security", body: <p>Data is encrypted in transit and at rest. Access to production systems is restricted, logged and reviewed. No system is perfectly secure — we work continuously to keep yours protected.</p> },
      { id: "changes", title: "Changes", body: <p>We will update this policy as the product evolves. Material changes will be communicated in-app or by email.</p> },
    ],
  },
  cookies: {
    eyebrow: "Cookie Policy",
    title: "A short, honest note about cookies.",
    intro: "We use a small number of cookies to keep AUTOVERE running smoothly and to learn what's working. No tracking pixels, no surveillance.",
    updated: UPDATED,
    seoTitle: "Cookie Policy · AUTOVERE",
    seoDescription: "The cookies AUTOVERE uses, why we use them, and how you can control them.",
    sections: [
      { id: "what", title: "What cookies are", body: <p>Cookies are small text files stored on your device. We use them — and similar technologies like local storage — to make AUTOVERE work and to understand how it's used.</p> },
      { id: "essential", title: "Essential cookies", body: <p>Required for the platform to function: keeping you signed in, remembering your preferences, securing payments and preventing abuse. These cannot be turned off.</p> },
      { id: "analytics", title: "Analytics", body: <p>Privacy-respecting analytics help us understand which features people use, so we can make AUTOVERE better. We do not build advertising profiles.</p> },
      { id: "third", title: "Third parties", body: <p>Our payment partner sets cookies during checkout so that transactions are secure. Embedded video players (e.g. YouTube) may set their own cookies when you press play.</p> },
      { id: "control", title: "Your control", body: <p>You can clear or block cookies in your browser settings. Some essential cookies are required for AUTOVERE to function correctly. Questions? <Link to="/contact">Reach out</Link>.</p> },
    ],
  },
  refund: {
    eyebrow: "Refund Policy",
    title: "Fair, transparent refunds.",
    intro: "If AUTOVERE isn't right for you, we want the exit to feel as calm as the entry.",
    updated: UPDATED,
    seoTitle: "Refund Policy · AUTOVERE",
    seoDescription: "How refunds work for AUTOVERE subscriptions and one-time purchases.",
    sections: [
      { id: "subs", title: "Subscription refunds", body: <p>You may request a full refund of your most recent subscription charge within <strong>14 days</strong> of payment, provided the service hasn't been used substantially during that period. Renewals can be cancelled at any time and will not be charged again.</p> },
      { id: "eu", title: "EU & EEA right of withdrawal", body: <p>Customers in the EU and EEA have a statutory 14-day withdrawal right for digital services. By starting to use a paid feature you consent to the service beginning immediately and acknowledge that this right may be limited once the service has been performed.</p> },
      { id: "one-time", title: "One-time purchases", body: <p>One-time purchases of digital content are refundable within 14 days of purchase if the content has not been substantially accessed.</p> },
      { id: "exceptions", title: "Exceptions", body: <p>Refunds may be declined for accounts found to be in breach of our Terms of Service, or where evidence of abuse exists.</p> },
      { id: "how", title: "How to request a refund", body: <p>Send us a refund request via the <Link to="/contact">contact form</Link> with the email address used to purchase. We aim to respond within one business day. Refunds are returned to the original payment method.</p> },
    ],
  },
  subscriptions: {
    eyebrow: "Subscription Terms",
    title: "How AUTOVERE subscriptions work.",
    intro: "Predictable billing, easy cancellation, and no surprises. Here's exactly what to expect.",
    updated: UPDATED,
    seoTitle: "Subscription Terms · AUTOVERE",
    seoDescription: "Billing cycles, renewals, cancellation and changes for AUTOVERE subscriptions.",
    sections: [
      { id: "plans", title: "Plans and pricing", body: <p>Current plans, features and prices are listed on the <Link to="/pricing">Pricing page</Link>. Prices are shown inclusive of applicable taxes where required.</p> },
      { id: "billing", title: "Billing cycles", body: <p>Subscriptions are billed in advance on a monthly or yearly cycle, depending on the plan you choose. Your billing cycle starts on the day of purchase.</p> },
      { id: "renewal", title: "Automatic renewal", body: <p>Subscriptions renew automatically at the end of each billing cycle using your saved payment method, until cancelled. We will email you a receipt for every charge.</p> },
      { id: "cancel", title: "Cancellation", body: <p>You can cancel at any time from your account settings. Cancellation stops the next renewal — you keep access until the end of the current billing period.</p> },
      { id: "changes", title: "Price changes", body: <p>If we ever change the price of a plan you are on, we will notify you at least 30 days in advance. You can cancel before the change takes effect if it doesn't suit you.</p> },
      { id: "tax", title: "Taxes", body: <p>Sales tax, VAT and similar taxes are calculated at checkout based on your billing location and handled by our payment partner acting as merchant of record.</p> },
      { id: "refunds", title: "Refunds", body: <p>See our <Link to="/legal/refund">Refund Policy</Link>.</p> },
    ],
  },
});

// =============== NO ==================
const no = (): Record<LegalDocKey, LegalDocContent> => ({
  terms: {
    eyebrow: "Vilkår for tjenesten",
    title: "Avtalen mellom deg og AUTOVERE.",
    intro: "Disse vilkårene beskriver hvordan AUTOVERE fungerer, hva du kan forvente av oss, og hva vi forventer av deg. Skrevet i klart språk — fordi tillit starter med tydelighet.",
    updated: UPDATED_NO,
    seoTitle: "Vilkår for tjenesten · AUTOVERE",
    seoDescription: "Vilkårene som styrer din bruk av AUTOVERE — en roligere, intelligent måte å finne din neste bil på.",
    sections: [
      { id: "seller", title: "Hvem du inngår avtale med", body: <p>AUTOVERE drives av <strong>Boutique24Shop v/ K.Mersland</strong> ("vi", "oss", "AUTOVERE"), basert i Norge. Ved å bruke AUTOVERE inngår du en bindende avtale med Boutique24Shop v/ K.Mersland.</p> },
      { id: "acceptance", title: "Aksept av vilkår", body: <p>Ved å bruke AUTOVERE godtar du disse vilkårene. Hvis du ikke godtar dem, vennligst ikke bruk tjenesten. Vi kan oppdatere vilkårene fra tid til annen; vi noterer datoen øverst hver gang vi gjør det.</p> },
      { id: "service", title: "Hva AUTOVERE er", body: <><p>AUTOVERE er en intelligent plattform for biloppdagelse. Vi hjelper folk å utforske, sammenligne og forstå biler ved hjelp av kuratert innhold, offentlige data, offisielle produsentressurser og AI-assistert innsikt.</p><p>AUTOVERE er <strong>ikke</strong> en forhandler eller markedsplass. Vi selger ikke biler og er ikke part i kjøp du gjør fra en tredjepart.</p></> },
      { id: "accounts", title: "Konto og berettigelse", body: <p>Du må være minst 16 år for å bruke AUTOVERE. Du er ansvarlig for å holde påloggingsinformasjonen din sikker og for aktivitet som skjer på kontoen din.</p> },
      { id: "subscriptions", title: "Abonnement og fakturering", body: <><p>Noen AUTOVERE-funksjoner krever betalt abonnement. Priser, faktureringssykluser og fornyelsesvilkår vises på <Link to="/pricing">prissiden</Link> og i kassen.</p><p>Abonnementer fornyes automatisk inntil de kanselleres. Du kan kansellere når som helst — se <Link to="/legal/subscriptions">abonnementsvilkårene</Link> for detaljer.</p><p>{PADDLE_MOR.no}</p></> },
      { id: "ai", title: "AI-assisterte anbefalinger", body: <><p>AUTOVERE bruker AI for å hjelpe deg å sammenligne og forstå biler. Anbefalinger genereres fra offentlige kilder, produsentinformasjon, anmelderkonsensus og modellanalyse.</p><p>AI-innsikt er ment som veiledning, ikke profesjonell rådgivning. Bildata, spesifikasjoner og tilgjengelighet varierer mellom regioner. Verifiser alltid endelige detaljer direkte med produsent eller selger før kjøp.</p></> },
      { id: "acceptable-use", title: "Akseptabel bruk", body: <p>Ikke bruk AUTOVERE til å bryte loven, krenke andres rettigheter, skrape eller videreselge innholdet vårt i stor skala, forsøke å forstyrre tjenesten eller misbruke våre AI-funksjoner. Vi kan suspendere tilgang ved brudd på disse vilkårene.</p> },
      { id: "ip", title: "Immaterielle rettigheter", body: <p>AUTOVERE, AutoVere-rådgiveren, vårt redaksjonelle innhold og design er beskyttet av immaterialrettslige lover. Bilnavn, varemerker og bilder tilhører sine respektive produsenter og brukes til redaksjonelle formål.</p> },
      { id: "warranty", title: "Ansvarsfraskrivelser og ansvar", body: <p>AUTOVERE leveres "som det er". I den grad loven tillater, fraskriver vi oss underforståtte garantier og begrenser vårt ansvar til beløpet du har betalt oss i de 12 månedene før kravet oppsto.</p> },
      { id: "law", title: "Gjeldende lov", body: <p>Disse vilkårene er underlagt norsk lov. Tvister som ikke kan løses uformelt, faller inn under norske domstolers jurisdiksjon.</p> },
      { id: "contact", title: "Kontakt", body: <p>Spørsmål om disse vilkårene? <Link to="/contact">Ta kontakt</Link> med teamet vårt.</p> },
    ],
  },
  privacy: {
    eyebrow: "Personvernerklæring",
    title: "Dataene dine, behandlet med omsorg.",
    intro: "Vi samler kun det som er nødvendig for å få AUTOVERE til å fungere — og vi forteller deg nøyaktig hva det er.",
    updated: UPDATED_NO,
    seoTitle: "Personvernerklæring · AUTOVERE",
    seoDescription: "Hvordan AUTOVERE samler inn, bruker og beskytter dine personopplysninger. Personvern fra start, i klart språk.",
    sections: [
      { id: "who", title: "Hvem vi er", body: <p>AUTOVERE drives av <strong>Boutique24Shop v/ K.Mersland</strong>, basert i Norge. Vi er behandlingsansvarlig for personopplysningene beskrevet nedenfor.</p> },
      { id: "what", title: "Hva vi samler inn", body: <>
        <p><strong>Kontodata</strong> — navn, e-post og autentiseringsidentifikatorer når du oppretter en konto.</p>
        <p><strong>Bruksdata</strong> — sider du har sett, søk, sammenligninger og rådgiversamtaler, brukt til å forbedre produktet.</p>
        <p><strong>Faktureringsdata</strong> — når du abonnerer, opptrer vår betalingsleverandør <strong>Paddle.com Market Limited</strong> ("Paddle") som Merchant of Record. Paddle drifter kassen, behandler betalingen, beregner og innbetaler moms/VAT, forhindrer svindel og utsteder fakturaer. Vi ser eller lagrer aldri dine fullstendige kortdata.</p>
        <p className="!mb-2"><strong>Data Paddle samler inn og behandler (ikke vi):</strong></p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Fullt navn og e-postadresse</li>
          <li>Faktureringsadresse (gate, by, postnummer, fylke/region, land)</li>
          <li>Betalingsmetodedetaljer (fullt kortnummer, utløp, CVC, eller PayPal/Apple Pay/Google Pay-token)</li>
          <li>Bank- eller kortutsteders informasjon brukt for autorisering og 3-D Secure</li>
          <li>IP-adresse og omtrentlig geolokalisering (for svindelvurdering og avgiftsberegning)</li>
          <li>Enhets- og nettleserfingeravtrykk (user-agent, språk, tidssone)</li>
          <li>Skatte-/MVA-identifikasjonsnummer (for forretningskunder, der oppgitt)</li>
          <li>Firmanavn og skatteland (for B2B-fakturering)</li>
          <li>Valuta og konvertert beløp</li>
          <li>Transaksjonshistorikk, refusjoner, tilbakeføringer og tvistesaker</li>
          <li>Kommunikasjon med Paddles kundestøtte</li>
        </ul>
        <p className="!mb-2"><strong>Data vi mottar tilbake fra Paddle og lagrer på din konto:</strong></p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Paddle kunde-ID og Paddle abonnement-ID (interne identifikatorer)</li>
          <li>Produkt-ID og pris-ID for planen du kjøpte (f.eks. <code>premium_monthly</code>)</li>
          <li>Abonnementsstatus (<code>trialing</code>, <code>active</code>, <code>past_due</code>, <code>paused</code>, <code>canceled</code>)</li>
          <li>Gjeldende faktureringsperiodes start- og sluttdato</li>
          <li>Om abonnementet er planlagt kansellert ved periodeslutt</li>
          <li>Miljøflagg (<code>sandbox</code> eller <code>live</code>)</li>
          <li>Landkode for faktureringsadressen (for skatteoverholdelse og lokalisert prising)</li>
          <li>Valuta og beløp for hver transaksjon</li>
          <li>Siste fire sifre og merke på kortet brukt (f.eks. "Visa •••• 4242")</li>
          <li>Transaksjonstidsstempler (opprettet, betalt, refundert)</li>
          <li>Faktura- og kvitterings-URL-er hostet av Paddle</li>
        </ul>
        <p>Vi bruker disse dataene for å klargjøre abonnementet ditt, gi tilgang til Premium-funksjoner, sende fornyelses- og kvitteringsvarsler, håndtere supporthenvendelser og oppfylle våre regnskaps- og skatteforpliktelser. Se <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline">Paddles personvernerklæring</a> for hvordan Paddle behandler dataene de samler inn.</p>
        <p><strong>Meldinger du sender oss</strong> — alt du skriver i kontaktskjemaet.</p>
      </> },
      { id: "why", title: "Hvorfor vi bruker det", body: <p>For å levere tjenesten, personalisere anbefalinger, forhindre misbruk, oppfylle juridiske forpliktelser og svare deg når du tar kontakt. Vi selger aldri personopplysninger.</p> },
      { id: "ai", title: "AI og dine data", body: <p>Samtaler med vår AI-rådgiver behandles gjennom betrodde AI-leverandører for å generere svar. Vi bruker ikke dine private samtaler til å trene eksterne modeller. Anonymiserte, aggregerte mønstre kan brukes til å forbedre vårt eget produkt.</p> },
      { id: "sharing", title: "Hvem vi deler med", body: <>
        <p>Nøye utvalgte databehandlere som hjelper oss å drive AUTOVERE — hosting, analyse, e-postlevering og AI-inferens. Hver er bundet av databehandleravtaler og kan kun bruke dataene dine etter våre instrukser.</p>
        <p><strong>Paddle.com Market Limited</strong> — vår Merchant of Record for alle betalte abonnementer. Paddle mottar data nødvendig for å behandle betalingen din, administrere abonnementet, beregne og innbetale moms/VAT, forhindre svindel og utstede fakturaer. Paddle opptrer som selvstendig behandlingsansvarlig for denne behandlingen. Se <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline">Paddles personvernerklæring</a>.</p>
        <p><strong>Myndigheter og profesjonelle rådgivere</strong> — der det kreves av lov eller for å beskytte våre juridiske rettigheter.</p>
      </> },
      { id: "retention", title: "Hvor lenge vi oppbevarer", body: <p>Vi oppbevarer personopplysninger kun så lenge det er nødvendig for formålene over, eller som loven krever. Meldinger fra kontaktskjemaet oppbevares i opptil 24 måneder.</p> },
      { id: "rights", title: "Dine rettigheter", body: <p>I henhold til GDPR kan du be om innsyn, retting, sletting, dataportabilitet eller begrensning av dine data, og protestere mot visse behandlinger. For å utøve disse rettighetene, <Link to="/contact">kontakt oss</Link>. Du har også rett til å klage til Datatilsynet.</p> },
      { id: "security", title: "Sikkerhet", body: <p>Data krypteres under overføring og lagring. Tilgang til produksjonssystemer er begrenset, logget og gjennomgått. Ingen system er perfekt sikkert — vi jobber kontinuerlig for å beskytte ditt.</p> },
      { id: "changes", title: "Endringer", body: <p>Vi oppdaterer denne policyen etter hvert som produktet utvikler seg. Vesentlige endringer kommuniseres i appen eller via e-post.</p> },
    ],
  },
  cookies: {
    eyebrow: "Cookie-erklæring",
    title: "En kort, ærlig melding om cookies.",
    intro: "Vi bruker et lite antall cookies for å holde AUTOVERE i gang og for å lære hva som fungerer. Ingen sporingspiksler, ingen overvåkning.",
    updated: UPDATED_NO,
    seoTitle: "Cookie-erklæring · AUTOVERE",
    seoDescription: "Cookies AUTOVERE bruker, hvorfor vi bruker dem, og hvordan du kan kontrollere dem.",
    sections: [
      { id: "what", title: "Hva cookies er", body: <p>Cookies er små tekstfiler lagret på enheten din. Vi bruker dem — og lignende teknologier som lokal lagring — for å få AUTOVERE til å fungere og forstå hvordan det brukes.</p> },
      { id: "essential", title: "Nødvendige cookies", body: <p>Kreves for at plattformen skal fungere: holde deg innlogget, huske preferansene dine, sikre betalinger og forhindre misbruk. Disse kan ikke slås av.</p> },
      { id: "analytics", title: "Analyse", body: <p>Personvernrespekterende analyse hjelper oss å forstå hvilke funksjoner folk bruker, så vi kan gjøre AUTOVERE bedre. Vi bygger ikke annonseprofiler.</p> },
      { id: "third", title: "Tredjeparter", body: <p>Vår betalingspartner setter cookies under kassen for at transaksjonene skal være sikre. Innebygde videospillere (f.eks. YouTube) kan sette egne cookies når du trykker spill av.</p> },
      { id: "control", title: "Din kontroll", body: <p>Du kan slette eller blokkere cookies i nettleserens innstillinger. Noen nødvendige cookies kreves for at AUTOVERE skal fungere riktig. Spørsmål? <Link to="/contact">Ta kontakt</Link>.</p> },
    ],
  },
  refund: {
    eyebrow: "Refusjonsvilkår",
    title: "Rettferdige, transparente refusjoner.",
    intro: "Hvis AUTOVERE ikke er rett for deg, ønsker vi at utgangen skal føles like rolig som inngangen.",
    updated: UPDATED_NO,
    seoTitle: "Refusjonsvilkår · AUTOVERE",
    seoDescription: "Hvordan refusjoner fungerer for AUTOVERE-abonnementer og engangskjøp.",
    sections: [
      { id: "subs", title: "Abonnementsrefusjon", body: <p>Du kan be om full refusjon av siste abonnementsbetaling innen <strong>14 dager</strong> etter betaling, forutsatt at tjenesten ikke har vært vesentlig brukt i den perioden. Fornyelser kan kanselleres når som helst og vil ikke bli belastet igjen.</p> },
      { id: "eu", title: "EU/EØS-angrerett", body: <p>Kunder i EU og EØS har en lovfestet 14-dagers angrerett for digitale tjenester. Ved å begynne å bruke en betalt funksjon samtykker du til at tjenesten starter umiddelbart og erkjenner at retten kan begrenses når tjenesten er utført.</p> },
      { id: "one-time", title: "Engangskjøp", body: <p>Engangskjøp av digitalt innhold kan refunderes innen 14 dager etter kjøp dersom innholdet ikke er vesentlig brukt.</p> },
      { id: "exceptions", title: "Unntak", body: <p>Refusjoner kan avslås for kontoer som er funnet i brudd med våre Vilkår for tjenesten, eller hvor det er bevis på misbruk.</p> },
      { id: "how", title: "Hvordan be om refusjon", body: <p>Send oss en refusjonsforespørsel via <Link to="/contact">kontaktskjemaet</Link> med e-postadressen brukt ved kjøp. Vi sikter på svar innen én virkedag. Refusjoner returneres til opprinnelig betalingsmetode.</p> },
    ],
  },
  subscriptions: {
    eyebrow: "Abonnementsvilkår",
    title: "Slik fungerer AUTOVERE-abonnementer.",
    intro: "Forutsigbar fakturering, enkel kansellering og ingen overraskelser. Her er nøyaktig hva du kan forvente.",
    updated: UPDATED_NO,
    seoTitle: "Abonnementsvilkår · AUTOVERE",
    seoDescription: "Faktureringssykluser, fornyelser, kansellering og endringer for AUTOVERE-abonnementer.",
    sections: [
      { id: "plans", title: "Planer og priser", body: <p>Gjeldende planer, funksjoner og priser er listet på <Link to="/pricing">prissiden</Link>. Priser vises inkludert gjeldende avgifter der det kreves.</p> },
      { id: "billing", title: "Faktureringssykluser", body: <p>Abonnementer faktureres på forhånd månedlig eller årlig, avhengig av plan. Faktureringssyklusen starter på kjøpsdagen.</p> },
      { id: "renewal", title: "Automatisk fornyelse", body: <p>Abonnementer fornyes automatisk på slutten av hver faktureringssyklus med din lagrede betalingsmetode, inntil de kanselleres. Vi sender e-postkvittering for hver belastning.</p> },
      { id: "cancel", title: "Kansellering", body: <p>Du kan kansellere når som helst fra kontoinnstillingene. Kansellering stopper neste fornyelse — du beholder tilgang til slutten av gjeldende faktureringsperiode.</p> },
      { id: "changes", title: "Prisendringer", body: <p>Hvis vi endrer prisen på en plan du har, varsler vi deg minst 30 dager i forveien. Du kan kansellere før endringen trer i kraft hvis den ikke passer deg.</p> },
      { id: "tax", title: "Avgifter", body: <p>Moms, MVA og lignende avgifter beregnes i kassen basert på faktureringsstedet ditt og håndteres av vår betalingspartner som opptrer som merchant of record.</p> },
      { id: "refunds", title: "Refusjoner", body: <p>Se våre <Link to="/legal/refund">Refusjonsvilkår</Link>.</p> },
    ],
  },
});

// =============== DE ==================
const de = (): Record<LegalDocKey, LegalDocContent> => ({
  terms: {
    eyebrow: "Nutzungsbedingungen",
    title: "Die Vereinbarung zwischen Ihnen und AUTOVERE.",
    intro: "Diese Bedingungen beschreiben, wie AUTOVERE funktioniert, was Sie von uns erwarten können und was wir von Ihnen erwarten. In klarer Sprache — denn Vertrauen beginnt mit Klarheit.",
    updated: UPDATED_DE,
    seoTitle: "Nutzungsbedingungen · AUTOVERE",
    seoDescription: "Die Bedingungen, die Ihre Nutzung von AUTOVERE regeln — eine ruhigere, intelligente Art, Ihr nächstes Auto zu finden.",
    sections: [
      { id: "seller", title: "Mit wem Sie einen Vertrag schließen", body: <p>AUTOVERE wird betrieben von <strong>Boutique24Shop v/ K.Mersland</strong> ("wir", "uns", "AUTOVERE") mit Sitz in Norwegen. Mit der Nutzung von AUTOVERE schließen Sie eine verbindliche Vereinbarung mit Boutique24Shop v/ K.Mersland.</p> },
      { id: "acceptance", title: "Annahme der Bedingungen", body: <p>Mit der Nutzung von AUTOVERE stimmen Sie diesen Bedingungen zu. Wenn Sie nicht zustimmen, nutzen Sie den Dienst bitte nicht. Wir können diese Bedingungen von Zeit zu Zeit aktualisieren; das Datum oben wird entsprechend angepasst.</p> },
      { id: "service", title: "Was AUTOVERE ist", body: <><p>AUTOVERE ist eine intelligente Plattform zur Fahrzeugentdeckung. Wir helfen Menschen, Fahrzeuge mithilfe kuratierter Inhalte, öffentlicher Daten, offizieller Herstellerinformationen und KI-gestützter Einblicke zu erkunden, zu vergleichen und zu verstehen.</p><p>AUTOVERE ist <strong>kein</strong> Händler oder Marktplatz. Wir verkaufen keine Fahrzeuge und sind nicht Vertragspartei eines Kaufs bei Dritten.</p></> },
      { id: "accounts", title: "Konten und Berechtigung", body: <p>Sie müssen mindestens 16 Jahre alt sein, um AUTOVERE zu nutzen. Sie sind verantwortlich für die Sicherheit Ihrer Zugangsdaten und für Aktivitäten unter Ihrem Konto.</p> },
      { id: "subscriptions", title: "Abonnements und Abrechnung", body: <><p>Einige AUTOVERE-Funktionen sind über ein kostenpflichtiges Abonnement verfügbar. Preise, Abrechnungszyklen und Verlängerungsbedingungen werden auf der <Link to="/pricing">Preisseite</Link> und an der Kasse angezeigt.</p><p>Abonnements verlängern sich automatisch, bis sie gekündigt werden. Sie können jederzeit kündigen — Details siehe <Link to="/legal/subscriptions">Abonnementbedingungen</Link>.</p><p>{PADDLE_MOR.de}</p></> },
      { id: "ai", title: "KI-gestützte Empfehlungen", body: <><p>AUTOVERE nutzt KI, um Ihnen beim Vergleich und Verständnis von Fahrzeugen zu helfen. Empfehlungen werden aus öffentlichen Quellen, Herstellerinformationen, Rezensentenkonsens und Modellanalysen generiert.</p><p>KI-Einblicke dienen als Orientierung, nicht als professionelle Beratung. Fahrzeugdaten, Spezifikationen und Verfügbarkeit variieren regional. Überprüfen Sie endgültige Details immer direkt beim Hersteller oder Verkäufer vor dem Kauf.</p></> },
      { id: "acceptable-use", title: "Akzeptable Nutzung", body: <p>Nutzen Sie AUTOVERE nicht, um gegen Gesetze zu verstoßen, Rechte Dritter zu verletzen, unsere Inhalte in großem Umfang zu scrapen oder weiterzuverkaufen, den Dienst zu stören oder unsere KI-Funktionen zu missbrauchen. Wir können den Zugang sperren, wenn diese Bedingungen verletzt werden.</p> },
      { id: "ip", title: "Geistiges Eigentum", body: <p>AUTOVERE, der AutoVere-Berater, unsere redaktionellen Inhalte und unser Design sind durch Gesetze zum geistigen Eigentum geschützt. Fahrzeugnamen, Marken und Bilder gehören den jeweiligen Herstellern und werden zu redaktionellen Zwecken verwendet.</p> },
      { id: "warranty", title: "Haftungsausschluss und Haftung", body: <p>AUTOVERE wird "wie besehen" bereitgestellt. Soweit gesetzlich zulässig, schließen wir stillschweigende Garantien aus und beschränken unsere Haftung auf den Betrag, den Sie uns in den 12 Monaten vor dem haftungsauslösenden Ereignis gezahlt haben.</p> },
      { id: "law", title: "Anwendbares Recht", body: <p>Diese Bedingungen unterliegen norwegischem Recht. Streitigkeiten, die nicht informell gelöst werden können, fallen in die Zuständigkeit norwegischer Gerichte.</p> },
      { id: "contact", title: "Kontakt", body: <p>Fragen zu diesen Bedingungen? <Link to="/contact">Kontaktieren Sie</Link> unser Team.</p> },
    ],
  },
  privacy: {
    eyebrow: "Datenschutzerklärung",
    title: "Ihre Daten, sorgfältig behandelt.",
    intro: "Wir erheben nur, was nötig ist, damit AUTOVERE großartig funktioniert — und sagen Ihnen genau, was das ist.",
    updated: UPDATED_DE,
    seoTitle: "Datenschutzerklärung · AUTOVERE",
    seoDescription: "Wie AUTOVERE Ihre personenbezogenen Daten erhebt, verwendet und schützt. Datenschutz von Anfang an, in klarer Sprache.",
    sections: [
      { id: "who", title: "Wer wir sind", body: <p>AUTOVERE wird betrieben von <strong>Boutique24Shop v/ K.Mersland</strong> mit Sitz in Norwegen. Wir sind der Verantwortliche für die unten beschriebenen personenbezogenen Daten.</p> },
      { id: "what", title: "Was wir erheben", body: <>
        <p><strong>Kontodaten</strong> — Name, E-Mail und Authentifizierungskennungen bei der Kontoerstellung.</p>
        <p><strong>Nutzungsdaten</strong> — aufgerufene Seiten, Suchen, Vergleiche und Berater-Konversationen, zur Produktverbesserung verwendet.</p>
        <p><strong>Abrechnungsdaten</strong> — bei einem Abonnement fungiert unser Zahlungsanbieter <strong>Paddle.com Market Limited</strong> ("Paddle") als Merchant of Record. Paddle hostet die Kasse, verarbeitet Zahlungen, berechnet und führt Umsatzsteuer/MwSt. ab, verhindert Betrug und stellt Rechnungen aus. Wir sehen oder speichern niemals Ihre vollständigen Kartendaten.</p>
        <p className="!mb-2"><strong>Von Paddle (nicht von uns) erhobene und verarbeitete Daten:</strong></p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Vollständiger Name und E-Mail-Adresse</li>
          <li>Rechnungsadresse (Straße, Stadt, PLZ, Bundesland/Region, Land)</li>
          <li>Zahlungsmittel-Details (vollständige Kartennummer, Ablauf, CVC oder PayPal/Apple Pay/Google Pay-Token)</li>
          <li>Bank- oder Kartenausstellerinformationen für Autorisierung und 3-D Secure</li>
          <li>IP-Adresse und ungefähre Geolokalisierung (für Betrugsprüfung und Steuerermittlung)</li>
          <li>Geräte- und Browser-Fingerprint (User-Agent, Sprache, Zeitzone)</li>
          <li>Steuer-/USt-Identifikationsnummer (für Geschäftskunden, falls angegeben)</li>
          <li>Firmenname und Steuerland (für B2B-Rechnungen)</li>
          <li>Währung und umgerechneter Betrag</li>
          <li>Transaktionshistorie, Erstattungen, Chargebacks und Streitfälle</li>
          <li>Kommunikation mit Paddles Kundenservice</li>
        </ul>
        <p className="!mb-2"><strong>Daten, die wir von Paddle zurückerhalten und in Ihrem Konto speichern:</strong></p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Paddle-Kunden-ID und Paddle-Abonnement-ID (interne Kennungen)</li>
          <li>Produkt-ID und Preis-ID des gekauften Plans (z. B. <code>premium_monthly</code>)</li>
          <li>Abonnementstatus (<code>trialing</code>, <code>active</code>, <code>past_due</code>, <code>paused</code>, <code>canceled</code>)</li>
          <li>Aktuelles Abrechnungszeitraum-Start- und Enddatum</li>
          <li>Ob das Abonnement zum Periodenende gekündigt wird</li>
          <li>Umgebungsflag (<code>sandbox</code> oder <code>live</code>)</li>
          <li>Ländercode der Rechnungsadresse (für Steuerkonformität und lokalisierte Preise)</li>
          <li>Währung und Betrag jeder Transaktion</li>
          <li>Letzte vier Stellen und Marke der verwendeten Karte (z. B. "Visa •••• 4242")</li>
          <li>Transaktionszeitstempel (erstellt, bezahlt, erstattet)</li>
          <li>Von Paddle gehostete Rechnungs- und Beleg-URLs</li>
        </ul>
        <p>Wir verwenden diese Daten zur Bereitstellung Ihres Abonnements, zur Freischaltung von Premium-Funktionen, zum Versand von Verlängerungs- und Belegbenachrichtigungen, zur Bearbeitung von Supportanfragen und zur Erfüllung unserer Buchhaltungs- und Steuerpflichten. Siehe <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline">Paddles Datenschutzerklärung</a> für die Verarbeitung durch Paddle.</p>
        <p><strong>Nachrichten, die Sie uns senden</strong> — alles, was Sie im Kontaktformular schreiben.</p>
      </> },
      { id: "why", title: "Warum wir es nutzen", body: <p>Um den Dienst bereitzustellen, Empfehlungen zu personalisieren, Missbrauch zu verhindern, gesetzliche Pflichten zu erfüllen und auf Sie zu antworten. Wir verkaufen niemals personenbezogene Daten.</p> },
      { id: "ai", title: "KI und Ihre Daten", body: <p>Konversationen mit unserem KI-Berater werden über vertrauenswürdige KI-Anbieter verarbeitet, um Antworten zu generieren. Wir nutzen Ihre privaten Konversationen nicht, um externe Modelle zu trainieren. Anonymisierte, aggregierte Muster können zur Verbesserung unseres eigenen Produkts genutzt werden.</p> },
      { id: "sharing", title: "Mit wem wir teilen", body: <>
        <p>Sorgfältig ausgewählte Auftragsverarbeiter, die uns beim Betrieb von AUTOVERE helfen — Hosting, Analyse, E-Mail-Zustellung und KI-Inferenz. Jeder ist durch Auftragsverarbeitungsverträge gebunden und darf Ihre Daten nur nach unseren Anweisungen verwenden.</p>
        <p><strong>Paddle.com Market Limited</strong> — unser Merchant of Record für alle bezahlten Abonnements. Paddle erhält die zur Zahlungsabwicklung, Abonnementverwaltung, Steuerberechnung und -abführung, Betrugsprävention und Rechnungsstellung notwendigen Daten. Paddle handelt für diese Verarbeitung als unabhängiger Verantwortlicher. Siehe <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline">Paddles Datenschutzerklärung</a>.</p>
        <p><strong>Behörden und Berater</strong> — wo gesetzlich erforderlich oder zum Schutz unserer Rechte.</p>
      </> },
      { id: "retention", title: "Wie lange wir speichern", body: <p>Wir speichern personenbezogene Daten nur so lange, wie für die obigen Zwecke nötig oder gesetzlich vorgeschrieben. Nachrichten aus dem Kontaktformular werden bis zu 24 Monate aufbewahrt.</p> },
      { id: "rights", title: "Ihre Rechte", body: <p>Nach DSGVO können Sie Auskunft, Berichtigung, Löschung, Übertragbarkeit oder Einschränkung Ihrer Daten verlangen sowie bestimmten Verarbeitungen widersprechen. <Link to="/contact">Kontaktieren Sie uns</Link>, um diese Rechte auszuüben. Sie haben außerdem das Recht, sich bei der norwegischen Datenschutzbehörde (Datatilsynet) zu beschweren.</p> },
      { id: "security", title: "Sicherheit", body: <p>Daten werden bei der Übertragung und im Ruhezustand verschlüsselt. Der Zugriff auf Produktionssysteme ist beschränkt, protokolliert und überprüft. Kein System ist perfekt sicher — wir arbeiten kontinuierlich am Schutz Ihrer Daten.</p> },
      { id: "changes", title: "Änderungen", body: <p>Wir aktualisieren diese Erklärung mit der Produktentwicklung. Wesentliche Änderungen werden in der App oder per E-Mail kommuniziert.</p> },
    ],
  },
  cookies: {
    eyebrow: "Cookie-Richtlinie",
    title: "Eine kurze, ehrliche Notiz zu Cookies.",
    intro: "Wir verwenden eine kleine Anzahl von Cookies, damit AUTOVERE reibungslos läuft und wir lernen, was funktioniert. Keine Tracking-Pixel, keine Überwachung.",
    updated: UPDATED_DE,
    seoTitle: "Cookie-Richtlinie · AUTOVERE",
    seoDescription: "Welche Cookies AUTOVERE verwendet, warum, und wie Sie sie kontrollieren können.",
    sections: [
      { id: "what", title: "Was Cookies sind", body: <p>Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden. Wir verwenden sie — und ähnliche Technologien wie Local Storage — damit AUTOVERE funktioniert und um die Nutzung zu verstehen.</p> },
      { id: "essential", title: "Notwendige Cookies", body: <p>Erforderlich für die Funktion der Plattform: angemeldet bleiben, Einstellungen merken, Zahlungen sichern und Missbrauch verhindern. Diese können nicht deaktiviert werden.</p> },
      { id: "analytics", title: "Analyse", body: <p>Datenschutzfreundliche Analyse hilft uns zu verstehen, welche Funktionen genutzt werden, damit wir AUTOVERE verbessern können. Wir bauen keine Werbeprofile auf.</p> },
      { id: "third", title: "Dritte", body: <p>Unser Zahlungspartner setzt während der Kasse Cookies, damit Transaktionen sicher sind. Eingebettete Videoplayer (z. B. YouTube) können beim Abspielen eigene Cookies setzen.</p> },
      { id: "control", title: "Ihre Kontrolle", body: <p>Sie können Cookies in den Browsereinstellungen löschen oder blockieren. Einige notwendige Cookies sind für AUTOVERE erforderlich. Fragen? <Link to="/contact">Melden Sie sich</Link>.</p> },
    ],
  },
  refund: {
    eyebrow: "Erstattungsrichtlinie",
    title: "Faire, transparente Erstattungen.",
    intro: "Wenn AUTOVERE nichts für Sie ist, soll der Ausstieg so ruhig wie der Einstieg sein.",
    updated: UPDATED_DE,
    seoTitle: "Erstattungsrichtlinie · AUTOVERE",
    seoDescription: "Wie Erstattungen für AUTOVERE-Abonnements und Einmalkäufe funktionieren.",
    sections: [
      { id: "subs", title: "Abonnementerstattungen", body: <p>Sie können innerhalb von <strong>14 Tagen</strong> nach Zahlung eine vollständige Erstattung Ihrer letzten Abonnementgebühr verlangen, sofern der Dienst in diesem Zeitraum nicht wesentlich genutzt wurde. Verlängerungen können jederzeit gekündigt und werden dann nicht erneut berechnet.</p> },
      { id: "eu", title: "EU/EWR-Widerrufsrecht", body: <p>Kunden in EU und EWR haben ein gesetzliches 14-tägiges Widerrufsrecht für digitale Dienste. Mit Beginn der Nutzung einer kostenpflichtigen Funktion stimmen Sie dem sofortigen Beginn des Dienstes zu und erkennen an, dass dieses Recht nach Ausführung des Dienstes eingeschränkt sein kann.</p> },
      { id: "one-time", title: "Einmalkäufe", body: <p>Einmalkäufe digitaler Inhalte sind innerhalb von 14 Tagen nach Kauf erstattbar, sofern auf den Inhalt nicht wesentlich zugegriffen wurde.</p> },
      { id: "exceptions", title: "Ausnahmen", body: <p>Erstattungen können abgelehnt werden für Konten, die gegen unsere Nutzungsbedingungen verstoßen oder bei denen Hinweise auf Missbrauch vorliegen.</p> },
      { id: "how", title: "Wie eine Erstattung beantragt wird", body: <p>Senden Sie uns eine Erstattungsanfrage über das <Link to="/contact">Kontaktformular</Link> mit der für den Kauf verwendeten E-Mail. Wir streben eine Antwort innerhalb eines Werktags an. Erstattungen erfolgen auf das ursprüngliche Zahlungsmittel.</p> },
    ],
  },
  subscriptions: {
    eyebrow: "Abonnementbedingungen",
    title: "So funktionieren AUTOVERE-Abonnements.",
    intro: "Vorhersehbare Abrechnung, einfache Kündigung und keine Überraschungen. Hier ist genau, was Sie erwarten können.",
    updated: UPDATED_DE,
    seoTitle: "Abonnementbedingungen · AUTOVERE",
    seoDescription: "Abrechnungszyklen, Verlängerungen, Kündigung und Änderungen für AUTOVERE-Abonnements.",
    sections: [
      { id: "plans", title: "Pläne und Preise", body: <p>Aktuelle Pläne, Funktionen und Preise sind auf der <Link to="/pricing">Preisseite</Link> aufgeführt. Preise werden inkl. anwendbarer Steuern angezeigt, wo erforderlich.</p> },
      { id: "billing", title: "Abrechnungszyklen", body: <p>Abonnements werden im Voraus monatlich oder jährlich abgerechnet, je nach Plan. Ihr Abrechnungszyklus beginnt am Tag des Kaufs.</p> },
      { id: "renewal", title: "Automatische Verlängerung", body: <p>Abonnements verlängern sich automatisch am Ende jedes Abrechnungszyklus mit Ihrer gespeicherten Zahlungsmethode, bis sie gekündigt werden. Wir senden Ihnen für jede Belastung einen Beleg per E-Mail.</p> },
      { id: "cancel", title: "Kündigung", body: <p>Sie können jederzeit über die Kontoeinstellungen kündigen. Die Kündigung stoppt die nächste Verlängerung — Sie behalten den Zugang bis zum Ende des aktuellen Abrechnungszeitraums.</p> },
      { id: "changes", title: "Preisänderungen", body: <p>Wenn wir den Preis eines Plans ändern, den Sie nutzen, benachrichtigen wir Sie mindestens 30 Tage im Voraus. Sie können vor Inkrafttreten kündigen, falls Ihnen die Änderung nicht passt.</p> },
      { id: "tax", title: "Steuern", body: <p>Umsatzsteuer, MwSt. und ähnliche Steuern werden an der Kasse basierend auf Ihrem Rechnungsstandort berechnet und von unserem Zahlungspartner als Merchant of Record abgewickelt.</p> },
      { id: "refunds", title: "Erstattungen", body: <p>Siehe unsere <Link to="/legal/refund">Erstattungsrichtlinie</Link>.</p> },
    ],
  },
});

// =============== SV ==================
const sv = (): Record<LegalDocKey, LegalDocContent> => ({
  terms: {
    eyebrow: "Användarvillkor",
    title: "Avtalet mellan dig och AUTOVERE.",
    intro: "Dessa villkor beskriver hur AUTOVERE fungerar, vad du kan förvänta dig av oss och vad vi förväntar oss av dig. Skrivna i klarspråk — för förtroende börjar med tydlighet.",
    updated: UPDATED_SV,
    seoTitle: "Användarvillkor · AUTOVERE",
    seoDescription: "Villkoren som styr din användning av AUTOVERE — ett lugnare, intelligent sätt att hitta din nästa bil.",
    sections: [
      { id: "seller", title: "Vem du ingår avtal med", body: <p>AUTOVERE drivs av <strong>Boutique24Shop v/ K.Mersland</strong> ("vi", "oss", "AUTOVERE") med säte i Norge. Genom att använda AUTOVERE ingår du ett bindande avtal med Boutique24Shop v/ K.Mersland.</p> },
      { id: "acceptance", title: "Godkännande av villkoren", body: <p>Genom att använda AUTOVERE godkänner du dessa villkor. Om du inte godkänner dem, vänligen använd inte tjänsten. Vi kan uppdatera villkoren då och då; vi noterar datum högst upp varje gång.</p> },
      { id: "service", title: "Vad AUTOVERE är", body: <><p>AUTOVERE är en intelligent plattform för bilupptäckt. Vi hjälper människor att utforska, jämföra och förstå fordon med hjälp av kuraterat innehåll, offentlig data, officiella tillverkarresurser och AI-assisterade insikter.</p><p>AUTOVERE är <strong>ingen</strong> återförsäljare eller marknadsplats. Vi säljer inga fordon och är inte part i köp du gör från tredje part.</p></> },
      { id: "accounts", title: "Konton och behörighet", body: <p>Du måste vara minst 16 år för att använda AUTOVERE. Du ansvarar för att hålla dina inloggningsuppgifter säkra och för aktivitet på ditt konto.</p> },
      { id: "subscriptions", title: "Prenumerationer och fakturering", body: <><p>Vissa AUTOVERE-funktioner kräver betald prenumeration. Priser, faktureringscykler och förnyelsevillkor visas på <Link to="/pricing">prissidan</Link> och i kassan.</p><p>Prenumerationer förnyas automatiskt tills de sägs upp. Du kan säga upp när som helst — se <Link to="/legal/subscriptions">prenumerationsvillkoren</Link> för detaljer.</p><p>{PADDLE_MOR.sv}</p></> },
      { id: "ai", title: "AI-assisterade rekommendationer", body: <><p>AUTOVERE använder AI för att hjälpa dig jämföra och förstå fordon. Rekommendationer genereras från offentliga källor, tillverkarinformation, recensentkonsensus och modellanalys.</p><p>AI-insikter är vägledning, inte professionell rådgivning. Fordonsdata, specifikationer och tillgänglighet varierar regionalt. Verifiera alltid slutgiltiga detaljer direkt med tillverkare eller säljare före köp.</p></> },
      { id: "acceptable-use", title: "Acceptabel användning", body: <p>Använd inte AUTOVERE för att bryta mot lagen, kränka andras rättigheter, skrapa eller återförsälja vårt innehåll i stor skala, störa tjänsten eller missbruka våra AI-funktioner. Vi kan stänga av åtkomst vid brott mot dessa villkor.</p> },
      { id: "ip", title: "Immateriella rättigheter", body: <p>AUTOVERE, AutoVere-rådgivaren, vårt redaktionella innehåll och design skyddas av immaterialrättsliga lagar. Bilnamn, märken och bilder tillhör respektive tillverkare och används i redaktionellt syfte.</p> },
      { id: "warranty", title: "Friskrivningar och ansvar", body: <p>AUTOVERE tillhandahålls "i befintligt skick". I den mån lagen tillåter friskriver vi oss från underförstådda garantier och begränsar vårt ansvar till det belopp du betalat oss under de 12 månaderna före händelsen som ger upphov till anspråket.</p> },
      { id: "law", title: "Tillämplig lag", body: <p>Dessa villkor regleras av norsk lag. Tvister som inte kan lösas informellt faller under norska domstolars jurisdiktion.</p> },
      { id: "contact", title: "Kontakt", body: <p>Frågor om dessa villkor? <Link to="/contact">Kontakta</Link> vårt team.</p> },
    ],
  },
  privacy: {
    eyebrow: "Integritetspolicy",
    title: "Dina data, hanterade med omsorg.",
    intro: "Vi samlar bara in det som behövs för att AUTOVERE ska fungera vackert — och vi berättar exakt vad det är.",
    updated: UPDATED_SV,
    seoTitle: "Integritetspolicy · AUTOVERE",
    seoDescription: "Hur AUTOVERE samlar in, använder och skyddar dina personuppgifter. Integritet by design, i klarspråk.",
    sections: [
      { id: "who", title: "Vilka vi är", body: <p>AUTOVERE drivs av <strong>Boutique24Shop v/ K.Mersland</strong>, baserat i Norge. Vi är personuppgiftsansvariga för de personuppgifter som beskrivs nedan.</p> },
      { id: "what", title: "Vad vi samlar in", body: <>
        <p><strong>Kontodata</strong> — namn, e-post och autentiseringsidentifierare när du skapar konto.</p>
        <p><strong>Användningsdata</strong> — sidor som visats, sökningar, jämförelser och rådgivarsamtal, för att förbättra produkten.</p>
        <p><strong>Faktureringsdata</strong> — när du prenumererar agerar vår betalleverantör <strong>Paddle.com Market Limited</strong> ("Paddle") som Merchant of Record. Paddle driver kassan, behandlar betalningar, beräknar och betalar in moms/VAT, förhindrar bedrägerier och utfärdar fakturor. Vi ser eller lagrar aldrig dina fullständiga kortuppgifter.</p>
        <p className="!mb-2"><strong>Data som samlas in och behandlas av Paddle (inte oss):</strong></p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Fullständigt namn och e-postadress</li>
          <li>Faktureringsadress (gata, ort, postnummer, region, land)</li>
          <li>Betalmetoduppgifter (fullständigt kortnummer, utgång, CVC, eller PayPal/Apple Pay/Google Pay-token)</li>
          <li>Bank- eller kortutgivarinformation för auktorisering och 3-D Secure</li>
          <li>IP-adress och ungefärlig geolokalisering (för bedrägeribedömning och skattefastställelse)</li>
          <li>Enhets- och webbläsarfingeravtryck (user-agent, språk, tidszon)</li>
          <li>Skatte-/momsidentifikationsnummer (för företagskunder, där angivet)</li>
          <li>Företagsnamn och skatteland (för B2B-fakturering)</li>
          <li>Valuta och konverterat belopp</li>
          <li>Transaktionshistorik, återbetalningar, chargebacks och tvistefall</li>
          <li>Kommunikation med Paddles kundtjänst</li>
        </ul>
        <p className="!mb-2"><strong>Data vi får tillbaka från Paddle och lagrar på ditt konto:</strong></p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Paddle-kund-ID och Paddle-prenumerations-ID (interna identifierare)</li>
          <li>Produkt-ID och pris-ID för köpt plan (t.ex. <code>premium_monthly</code>)</li>
          <li>Prenumerationsstatus (<code>trialing</code>, <code>active</code>, <code>past_due</code>, <code>paused</code>, <code>canceled</code>)</li>
          <li>Aktuell faktureringsperiods start- och slutdatum</li>
          <li>Om prenumerationen är schemalagd att avslutas vid periodens slut</li>
          <li>Miljöflagga (<code>sandbox</code> eller <code>live</code>)</li>
          <li>Landskod för faktureringsadressen (för skatteefterlevnad och lokaliserad prissättning)</li>
          <li>Valuta och belopp för varje transaktion</li>
          <li>Sista fyra siffror och märke på använt kort (t.ex. "Visa •••• 4242")</li>
          <li>Transaktionstidsstämplar (skapad, betald, återbetald)</li>
          <li>Faktura- och kvitto-URL:er hostade av Paddle</li>
        </ul>
        <p>Vi använder dessa data för att tillhandahålla din prenumeration, ge åtkomst till Premium-funktioner, skicka förnyelse- och kvittoaviseringar, hantera supportförfrågningar och uppfylla våra bokförings- och skatteskyldigheter. Se <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline">Paddles integritetspolicy</a> för hur Paddle hanterar de data de samlar in.</p>
        <p><strong>Meddelanden du skickar oss</strong> — allt du skriver i kontaktformuläret.</p>
      </> },
      { id: "why", title: "Varför vi använder det", body: <p>För att tillhandahålla tjänsten, personalisera rekommendationer, förhindra missbruk, uppfylla rättsliga skyldigheter och svara dig när du hör av dig. Vi säljer aldrig personuppgifter.</p> },
      { id: "ai", title: "AI och dina data", body: <p>Konversationer med vår AI-rådgivare behandlas via betrodda AI-leverantörer för att generera svar. Vi använder inte dina privata samtal för att träna externa modeller. Anonymiserade, aggregerade mönster kan användas för att förbättra vår egen produkt.</p> },
      { id: "sharing", title: "Vilka vi delar med", body: <>
        <p>Noggrant utvalda databehandlare som hjälper oss driva AUTOVERE — hosting, analys, e-postleverans och AI-inferens. Var och en är bunden av personuppgiftsbiträdesavtal och får endast använda dina data efter våra instruktioner.</p>
        <p><strong>Paddle.com Market Limited</strong> — vår Merchant of Record för alla betalda prenumerationer. Paddle får data som krävs för att behandla betalningen, hantera prenumerationen, beräkna och betala moms/VAT, förhindra bedrägerier och utfärda fakturor. Paddle agerar som självständigt personuppgiftsansvarig för denna behandling. Se <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline">Paddles integritetspolicy</a>.</p>
        <p><strong>Myndigheter och rådgivare</strong> — där det krävs enligt lag eller för att skydda våra rättigheter.</p>
      </> },
      { id: "retention", title: "Hur länge vi sparar", body: <p>Vi sparar personuppgifter endast så länge som behövs för ovanstående syften, eller enligt lag. Meddelanden från kontaktformuläret sparas i upp till 24 månader.</p> },
      { id: "rights", title: "Dina rättigheter", body: <p>Enligt GDPR kan du begära åtkomst, rättelse, radering, dataportabilitet eller begränsning av dina data, samt invända mot viss behandling. För att utöva dessa rättigheter, <Link to="/contact">kontakta oss</Link>. Du har också rätt att klaga hos den norska dataskyddsmyndigheten (Datatilsynet).</p> },
      { id: "security", title: "Säkerhet", body: <p>Data krypteras vid överföring och i vila. Åtkomst till produktionssystem är begränsad, loggad och granskad. Inget system är perfekt säkert — vi arbetar kontinuerligt för att skydda ditt.</p> },
      { id: "changes", title: "Ändringar", body: <p>Vi uppdaterar denna policy i takt med produktens utveckling. Väsentliga ändringar kommuniceras i appen eller via e-post.</p> },
    ],
  },
  cookies: {
    eyebrow: "Cookiepolicy",
    title: "En kort, ärlig notis om cookies.",
    intro: "Vi använder ett litet antal cookies för att hålla AUTOVERE igång och för att lära oss vad som fungerar. Inga spårningspixlar, ingen övervakning.",
    updated: UPDATED_SV,
    seoTitle: "Cookiepolicy · AUTOVERE",
    seoDescription: "Vilka cookies AUTOVERE använder, varför, och hur du kan kontrollera dem.",
    sections: [
      { id: "what", title: "Vad cookies är", body: <p>Cookies är små textfiler som sparas på din enhet. Vi använder dem — och liknande tekniker som lokal lagring — för att AUTOVERE ska fungera och för att förstå hur det används.</p> },
      { id: "essential", title: "Nödvändiga cookies", body: <p>Krävs för att plattformen ska fungera: hålla dig inloggad, komma ihåg dina inställningar, säkra betalningar och förhindra missbruk. Dessa kan inte stängas av.</p> },
      { id: "analytics", title: "Analys", body: <p>Integritetsvänlig analys hjälper oss förstå vilka funktioner som används, så vi kan göra AUTOVERE bättre. Vi bygger inga annonsprofiler.</p> },
      { id: "third", title: "Tredje parter", body: <p>Vår betalpartner sätter cookies i kassan så att transaktionerna är säkra. Inbäddade videospelare (t.ex. YouTube) kan sätta egna cookies när du trycker spela.</p> },
      { id: "control", title: "Din kontroll", body: <p>Du kan rensa eller blockera cookies i webbläsarens inställningar. Vissa nödvändiga cookies krävs för att AUTOVERE ska fungera. Frågor? <Link to="/contact">Hör av dig</Link>.</p> },
    ],
  },
  refund: {
    eyebrow: "Återbetalningspolicy",
    title: "Rättvisa, transparenta återbetalningar.",
    intro: "Om AUTOVERE inte är rätt för dig vill vi att utgången ska kännas lika lugn som ingången.",
    updated: UPDATED_SV,
    seoTitle: "Återbetalningspolicy · AUTOVERE",
    seoDescription: "Hur återbetalningar fungerar för AUTOVERE-prenumerationer och engångsköp.",
    sections: [
      { id: "subs", title: "Prenumerationsåterbetalningar", body: <p>Du kan begära full återbetalning av din senaste prenumerationsavgift inom <strong>14 dagar</strong> efter betalning, förutsatt att tjänsten inte använts väsentligt under perioden. Förnyelser kan sägas upp när som helst och debiteras då inte igen.</p> },
      { id: "eu", title: "EU/EES-ångerrätt", body: <p>Kunder i EU och EES har lagstadgad 14-dagars ångerrätt för digitala tjänster. Genom att börja använda en betald funktion samtycker du till att tjänsten startar omedelbart och bekräftar att rätten kan begränsas när tjänsten utförts.</p> },
      { id: "one-time", title: "Engångsköp", body: <p>Engångsköp av digitalt innehåll kan återbetalas inom 14 dagar efter köp om innehållet inte använts väsentligt.</p> },
      { id: "exceptions", title: "Undantag", body: <p>Återbetalningar kan nekas för konton som bryter mot våra användarvillkor eller där det finns bevis på missbruk.</p> },
      { id: "how", title: "Hur du begär återbetalning", body: <p>Skicka en återbetalningsbegäran via <Link to="/contact">kontaktformuläret</Link> med e-postadressen som användes vid köp. Vi siktar på svar inom en arbetsdag. Återbetalningar görs till den ursprungliga betalmetoden.</p> },
    ],
  },
  subscriptions: {
    eyebrow: "Prenumerationsvillkor",
    title: "Så fungerar AUTOVERE-prenumerationer.",
    intro: "Förutsägbar fakturering, enkel uppsägning och inga överraskningar. Här är exakt vad du kan förvänta dig.",
    updated: UPDATED_SV,
    seoTitle: "Prenumerationsvillkor · AUTOVERE",
    seoDescription: "Faktureringscykler, förnyelser, uppsägning och ändringar för AUTOVERE-prenumerationer.",
    sections: [
      { id: "plans", title: "Planer och priser", body: <p>Aktuella planer, funktioner och priser listas på <Link to="/pricing">prissidan</Link>. Priser visas inklusive tillämpliga skatter där det krävs.</p> },
      { id: "billing", title: "Faktureringscykler", body: <p>Prenumerationer faktureras i förskott månadsvis eller årligen, beroende på plan. Faktureringscykeln startar på köpdagen.</p> },
      { id: "renewal", title: "Automatisk förnyelse", body: <p>Prenumerationer förnyas automatiskt vid slutet av varje faktureringscykel med din sparade betalmetod, tills de sägs upp. Vi mejlar dig kvitto för varje debitering.</p> },
      { id: "cancel", title: "Uppsägning", body: <p>Du kan säga upp när som helst från kontoinställningarna. Uppsägning stoppar nästa förnyelse — du behåller åtkomst till slutet av aktuell faktureringsperiod.</p> },
      { id: "changes", title: "Prisändringar", body: <p>Om vi ändrar priset på en plan du har meddelar vi dig minst 30 dagar i förväg. Du kan säga upp innan ändringen träder i kraft om den inte passar dig.</p> },
      { id: "tax", title: "Skatter", body: <p>Moms, VAT och liknande skatter beräknas i kassan baserat på din faktureringsplats och hanteras av vår betalpartner som agerar som merchant of record.</p> },
      { id: "refunds", title: "Återbetalningar", body: <p>Se vår <Link to="/legal/refund">återbetalningspolicy</Link>.</p> },
    ],
  },
});

// =============== FR ==================
const fr = (): Record<LegalDocKey, LegalDocContent> => ({
  terms: {
    eyebrow: "Conditions d'utilisation",
    title: "L'accord entre vous et AUTOVERE.",
    intro: "Ces conditions décrivent comment AUTOVERE fonctionne, ce que vous pouvez attendre de nous et ce que nous attendons de vous. En langage clair — car la confiance commence par la clarté.",
    updated: UPDATED_FR,
    seoTitle: "Conditions d'utilisation · AUTOVERE",
    seoDescription: "Les conditions qui régissent votre utilisation d'AUTOVERE — une façon plus sereine et intelligente de découvrir votre prochaine voiture.",
    sections: [
      { id: "seller", title: "Avec qui vous contractez", body: <p>AUTOVERE est exploité par <strong>Boutique24Shop v/ K.Mersland</strong> ("nous", "AUTOVERE"), basé en Norvège. En utilisant AUTOVERE, vous concluez un accord contraignant avec Boutique24Shop v/ K.Mersland.</p> },
      { id: "acceptance", title: "Acceptation des conditions", body: <p>En utilisant AUTOVERE, vous acceptez ces conditions. Si vous ne les acceptez pas, n'utilisez pas le service. Nous pouvons mettre à jour ces conditions ; nous indiquerons la date en haut à chaque modification.</p> },
      { id: "service", title: "Ce qu'est AUTOVERE", body: <><p>AUTOVERE est une plateforme intelligente de découverte automobile. Nous aidons les gens à explorer, comparer et comprendre les véhicules grâce à du contenu organisé, des données publiques, des ressources officielles des constructeurs et des informations assistées par IA.</p><p>AUTOVERE n'est <strong>pas</strong> un concessionnaire ni une place de marché. Nous ne vendons pas de véhicules et ne sommes pas partie à un achat effectué auprès d'un tiers.</p></> },
      { id: "accounts", title: "Comptes et éligibilité", body: <p>Vous devez avoir au moins 16 ans pour utiliser AUTOVERE. Vous êtes responsable de la sécurité de vos identifiants et de l'activité sur votre compte.</p> },
      { id: "subscriptions", title: "Abonnements et facturation", body: <><p>Certaines fonctionnalités d'AUTOVERE nécessitent un abonnement payant. Les tarifs, cycles de facturation et conditions de renouvellement sont présentés sur la <Link to="/pricing">page Tarifs</Link> et au moment du paiement.</p><p>Les abonnements se renouvellent automatiquement jusqu'à annulation. Vous pouvez annuler à tout moment — voir les <Link to="/legal/subscriptions">Conditions d'abonnement</Link> pour les détails.</p><p>{PADDLE_MOR.fr}</p></> },
      { id: "ai", title: "Recommandations assistées par IA", body: <><p>AUTOVERE utilise l'IA pour vous aider à comparer et comprendre les véhicules. Les recommandations sont générées à partir de sources publiques, d'informations constructeurs, du consensus des testeurs et de l'analyse des modèles.</p><p>Les insights IA sont à titre indicatif, pas un conseil professionnel. Les données, spécifications et disponibilités varient selon les régions. Vérifiez toujours les détails finaux directement auprès du constructeur ou du vendeur avant l'achat.</p></> },
      { id: "acceptable-use", title: "Utilisation acceptable", body: <p>N'utilisez pas AUTOVERE pour enfreindre la loi, violer les droits d'autrui, scraper ou revendre notre contenu à grande échelle, perturber le service ou abuser de nos fonctionnalités IA. Nous pouvons suspendre l'accès en cas de violation.</p> },
      { id: "ip", title: "Propriété intellectuelle", body: <p>AUTOVERE, le conseiller AutoVere, notre contenu éditorial et notre design sont protégés par les lois sur la propriété intellectuelle. Les noms, marques et images de véhicules appartiennent à leurs constructeurs respectifs et sont utilisés à des fins éditoriales.</p> },
      { id: "warranty", title: "Avertissements et responsabilité", body: <p>AUTOVERE est fourni "tel quel". Dans la mesure permise par la loi, nous excluons les garanties implicites et limitons notre responsabilité au montant que vous nous avez payé au cours des 12 mois précédant l'événement à l'origine de la réclamation.</p> },
      { id: "law", title: "Loi applicable", body: <p>Ces conditions sont régies par le droit norvégien. Les litiges qui ne peuvent être résolus à l'amiable relèvent des tribunaux norvégiens.</p> },
      { id: "contact", title: "Contact", body: <p>Des questions sur ces conditions ? <Link to="/contact">Contactez</Link> notre équipe.</p> },
    ],
  },
  privacy: {
    eyebrow: "Politique de confidentialité",
    title: "Vos données, traitées avec soin.",
    intro: "Nous ne collectons que ce qui est nécessaire pour qu'AUTOVERE fonctionne magnifiquement — et nous vous disons exactement ce que c'est.",
    updated: UPDATED_FR,
    seoTitle: "Politique de confidentialité · AUTOVERE",
    seoDescription: "Comment AUTOVERE collecte, utilise et protège vos données personnelles. Confidentialité dès la conception, en langage clair.",
    sections: [
      { id: "who", title: "Qui nous sommes", body: <p>AUTOVERE est exploité par <strong>Boutique24Shop v/ K.Mersland</strong>, basé en Norvège. Nous sommes le responsable de traitement des données personnelles décrites ci-dessous.</p> },
      { id: "what", title: "Ce que nous collectons", body: <>
        <p><strong>Données de compte</strong> — nom, e-mail et identifiants d'authentification lors de la création de compte.</p>
        <p><strong>Données d'usage</strong> — pages vues, recherches, comparaisons et conversations avec le conseiller, utilisées pour améliorer le produit.</p>
        <p><strong>Données de facturation</strong> — lorsque vous vous abonnez, notre prestataire de paiement <strong>Paddle.com Market Limited</strong> ("Paddle") agit en tant que Merchant of Record. Paddle héberge le paiement, traite votre paiement, calcule et reverse la TVA, prévient la fraude et émet les factures. Nous ne voyons ni ne stockons jamais vos coordonnées bancaires complètes.</p>
        <p className="!mb-2"><strong>Données collectées et traitées par Paddle (pas par nous) :</strong></p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Nom complet et adresse e-mail</li>
          <li>Adresse de facturation (rue, ville, code postal, région, pays)</li>
          <li>Détails du moyen de paiement (numéro de carte complet, expiration, CVC, ou jeton PayPal/Apple Pay/Google Pay)</li>
          <li>Informations de la banque ou de l'émetteur pour autorisation et 3-D Secure</li>
          <li>Adresse IP et géolocalisation approximative (pour évaluation de fraude et détermination de la taxe)</li>
          <li>Empreinte de l'appareil et du navigateur (user-agent, langue, fuseau horaire)</li>
          <li>Numéro d'identification fiscale/TVA (pour les clients professionnels, le cas échéant)</li>
          <li>Raison sociale et pays fiscal (pour la facturation B2B)</li>
          <li>Devise et montant converti</li>
          <li>Historique des transactions, remboursements, chargebacks et litiges</li>
          <li>Communications avec le support client de Paddle</li>
        </ul>
        <p className="!mb-2"><strong>Données que nous recevons de Paddle et stockons sur votre compte :</strong></p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>ID client Paddle et ID d'abonnement Paddle (identifiants internes)</li>
          <li>ID de produit et ID de prix de l'offre achetée (par ex. <code>premium_monthly</code>)</li>
          <li>Statut d'abonnement (<code>trialing</code>, <code>active</code>, <code>past_due</code>, <code>paused</code>, <code>canceled</code>)</li>
          <li>Dates de début et de fin de la période de facturation actuelle</li>
          <li>Indication si l'abonnement est programmé pour s'arrêter en fin de période</li>
          <li>Drapeau d'environnement (<code>sandbox</code> ou <code>live</code>)</li>
          <li>Code pays de l'adresse de facturation (pour conformité fiscale et tarification localisée)</li>
          <li>Devise et montant de chaque transaction</li>
          <li>Quatre derniers chiffres et marque de la carte utilisée (par ex. "Visa •••• 4242")</li>
          <li>Horodatages des transactions (créée, payée, remboursée)</li>
          <li>URL de factures et reçus hébergées par Paddle</li>
        </ul>
        <p>Nous utilisons ces données pour activer votre abonnement, déverrouiller les fonctionnalités Premium, envoyer des notifications de renouvellement et de reçus, gérer le support et respecter nos obligations comptables et fiscales. Voir <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline">la politique de confidentialité de Paddle</a> pour le traitement par Paddle.</p>
        <p><strong>Messages que vous nous envoyez</strong> — tout ce que vous écrivez dans le formulaire de contact.</p>
      </> },
      { id: "why", title: "Pourquoi nous l'utilisons", body: <p>Pour fournir le service, personnaliser les recommandations, prévenir les abus, respecter les obligations légales et vous répondre. Nous ne vendons jamais de données personnelles.</p> },
      { id: "ai", title: "L'IA et vos données", body: <p>Les conversations avec notre conseiller IA sont traitées via des fournisseurs d'IA de confiance pour générer des réponses. Nous n'utilisons pas vos conversations privées pour entraîner des modèles externes. Des modèles anonymisés et agrégés peuvent servir à améliorer notre propre produit.</p> },
      { id: "sharing", title: "Avec qui nous partageons", body: <>
        <p>Des sous-traitants soigneusement sélectionnés qui nous aident à exploiter AUTOVERE — hébergement, analyse, livraison d'e-mails et inférence IA. Chacun est lié par un accord de traitement et ne peut utiliser vos données que selon nos instructions.</p>
        <p><strong>Paddle.com Market Limited</strong> — notre Merchant of Record pour tous les abonnements payants. Paddle reçoit les données nécessaires au traitement du paiement, à la gestion de l'abonnement, au calcul et au reversement de la TVA, à la prévention de la fraude et à l'émission de factures. Paddle agit en tant que responsable de traitement indépendant pour ce traitement. Voir <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline">la politique de confidentialité de Paddle</a>.</p>
        <p><strong>Autorités et conseillers</strong> — lorsque la loi l'exige ou pour protéger nos droits.</p>
      </> },
      { id: "retention", title: "Combien de temps nous conservons", body: <p>Nous conservons les données personnelles uniquement le temps nécessaire aux finalités ci-dessus, ou comme l'exige la loi. Les messages du formulaire de contact sont conservés jusqu'à 24 mois.</p> },
      { id: "rights", title: "Vos droits", body: <p>Au titre du RGPD, vous pouvez demander l'accès, la rectification, la suppression, la portabilité ou la limitation de vos données, et vous opposer à certains traitements. Pour exercer ces droits, <Link to="/contact">contactez-nous</Link>. Vous avez également le droit de déposer une réclamation auprès de l'autorité norvégienne de protection des données (Datatilsynet).</p> },
      { id: "security", title: "Sécurité", body: <p>Les données sont chiffrées en transit et au repos. L'accès aux systèmes de production est restreint, journalisé et audité. Aucun système n'est parfaitement sûr — nous travaillons en continu pour protéger les vôtres.</p> },
      { id: "changes", title: "Modifications", body: <p>Nous mettrons à jour cette politique à mesure que le produit évolue. Les changements importants seront communiqués dans l'application ou par e-mail.</p> },
    ],
  },
  cookies: {
    eyebrow: "Politique cookies",
    title: "Une note brève et honnête sur les cookies.",
    intro: "Nous utilisons un petit nombre de cookies pour qu'AUTOVERE fonctionne et pour comprendre ce qui marche. Aucun pixel de tracking, aucune surveillance.",
    updated: UPDATED_FR,
    seoTitle: "Politique cookies · AUTOVERE",
    seoDescription: "Les cookies utilisés par AUTOVERE, pourquoi, et comment les contrôler.",
    sections: [
      { id: "what", title: "Ce que sont les cookies", body: <p>Les cookies sont de petits fichiers texte stockés sur votre appareil. Nous les utilisons — ainsi que des technologies similaires comme le local storage — pour faire fonctionner AUTOVERE et comprendre son utilisation.</p> },
      { id: "essential", title: "Cookies essentiels", body: <p>Requis pour le fonctionnement : vous garder connecté, mémoriser vos préférences, sécuriser les paiements et prévenir les abus. Ils ne peuvent pas être désactivés.</p> },
      { id: "analytics", title: "Analyse", body: <p>Une analyse respectueuse de la vie privée nous aide à comprendre les fonctionnalités utilisées, pour améliorer AUTOVERE. Nous ne construisons pas de profils publicitaires.</p> },
      { id: "third", title: "Tiers", body: <p>Notre partenaire de paiement dépose des cookies pendant le paiement pour sécuriser les transactions. Les lecteurs vidéo intégrés (par ex. YouTube) peuvent déposer leurs propres cookies à la lecture.</p> },
      { id: "control", title: "Votre contrôle", body: <p>Vous pouvez effacer ou bloquer les cookies dans les paramètres du navigateur. Certains cookies essentiels sont requis pour qu'AUTOVERE fonctionne. Des questions ? <Link to="/contact">Écrivez-nous</Link>.</p> },
    ],
  },
  refund: {
    eyebrow: "Politique de remboursement",
    title: "Des remboursements justes et transparents.",
    intro: "Si AUTOVERE ne vous convient pas, la sortie doit être aussi sereine que l'entrée.",
    updated: UPDATED_FR,
    seoTitle: "Politique de remboursement · AUTOVERE",
    seoDescription: "Comment fonctionnent les remboursements pour les abonnements et achats uniques AUTOVERE.",
    sections: [
      { id: "subs", title: "Remboursements d'abonnement", body: <p>Vous pouvez demander un remboursement complet de votre dernier paiement d'abonnement dans les <strong>14 jours</strong> suivant le paiement, à condition que le service n'ait pas été utilisé de manière substantielle. Les renouvellements peuvent être annulés à tout moment et ne seront alors pas facturés.</p> },
      { id: "eu", title: "Droit de rétractation UE/EEE", body: <p>Les clients de l'UE et de l'EEE bénéficient d'un droit de rétractation légal de 14 jours pour les services numériques. En commençant à utiliser une fonctionnalité payante, vous consentez au démarrage immédiat du service et reconnaissez que ce droit peut être limité une fois le service exécuté.</p> },
      { id: "one-time", title: "Achats uniques", body: <p>Les achats uniques de contenu numérique sont remboursables dans les 14 jours suivant l'achat si le contenu n'a pas été utilisé de manière substantielle.</p> },
      { id: "exceptions", title: "Exceptions", body: <p>Les remboursements peuvent être refusés pour les comptes en violation de nos conditions d'utilisation, ou en cas d'abus avéré.</p> },
      { id: "how", title: "Comment demander un remboursement", body: <p>Envoyez-nous une demande via le <Link to="/contact">formulaire de contact</Link> avec l'e-mail utilisé lors de l'achat. Nous visons une réponse sous un jour ouvré. Les remboursements sont versés sur le moyen de paiement d'origine.</p> },
    ],
  },
  subscriptions: {
    eyebrow: "Conditions d'abonnement",
    title: "Comment fonctionnent les abonnements AUTOVERE.",
    intro: "Facturation prévisible, annulation simple, aucune surprise. Voici exactement à quoi vous attendre.",
    updated: UPDATED_FR,
    seoTitle: "Conditions d'abonnement · AUTOVERE",
    seoDescription: "Cycles de facturation, renouvellements, annulation et changements pour les abonnements AUTOVERE.",
    sections: [
      { id: "plans", title: "Offres et tarifs", body: <p>Les offres, fonctionnalités et tarifs en vigueur figurent sur la <Link to="/pricing">page Tarifs</Link>. Les prix sont affichés taxes incluses lorsque requis.</p> },
      { id: "billing", title: "Cycles de facturation", body: <p>Les abonnements sont facturés à l'avance mensuellement ou annuellement, selon l'offre. Le cycle commence le jour de l'achat.</p> },
      { id: "renewal", title: "Renouvellement automatique", body: <p>Les abonnements se renouvellent automatiquement à la fin de chaque cycle avec votre moyen de paiement enregistré, jusqu'à annulation. Vous recevez un reçu par e-mail à chaque facturation.</p> },
      { id: "cancel", title: "Annulation", body: <p>Vous pouvez annuler à tout moment depuis les paramètres du compte. L'annulation arrête le prochain renouvellement — vous gardez l'accès jusqu'à la fin de la période en cours.</p> },
      { id: "changes", title: "Changements de prix", body: <p>Si nous modifions le prix d'une offre que vous utilisez, nous vous prévenons au moins 30 jours à l'avance. Vous pouvez annuler avant la prise d'effet si cela ne vous convient pas.</p> },
      { id: "tax", title: "Taxes", body: <p>La TVA et les taxes similaires sont calculées au paiement selon votre lieu de facturation et gérées par notre partenaire de paiement agissant comme merchant of record.</p> },
      { id: "refunds", title: "Remboursements", body: <p>Voir notre <Link to="/legal/refund">politique de remboursement</Link>.</p> },
    ],
  },
});

const REGISTRY: Record<Lang, () => Record<LegalDocKey, LegalDocContent>> = {
  en, no, de, sv, fr,
};

export function getLegalDoc(lang: Lang, key: LegalDocKey): LegalDocContent {
  const get = REGISTRY[lang] ?? REGISTRY.en;
  return get()[key];
}
