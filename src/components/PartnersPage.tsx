import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  BadgePercent,
  Building2,
  CheckCircle2,
  Download,
  FileText,
  Gift,
  ImageIcon,
  Handshake,
  Lock,
  Mail,
  Route as RouteIcon,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import dealerHandoverImage from "@/assets/partners-dealer-handover.jpg";
import travellerAutovereImage from "@/assets/partners-traveller-autovere.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage } from "@/lib/contact.functions";

type Lang = "no" | "en" | "pl" | "se" | "dk" | "fi" | "de" | "nl" | "fr" | "es" | "it" | "pt" | "ja" | "zh";

const COPY = {
  no: {
    eyebrow: "AutoVere Partnere",
    title: "Gi medlemmene dine 25 % rabatt på AutoVere Pro.",
    intro:
      "AutoVere gjør det enkelt for motorklubber, elbilforeninger, bobil- og campingvognforbund og reiseorganisasjoner — samt forhandlere av nye og brukte biler — å gi medlemmene og kundene sine noe de faktisk vil bruke: ekte reisekostnader før de kjører, pluss 25 % rabatt på AutoVere Pro.",
    lead: "Vi er stolte av å samarbeide med folk som hjelper andre å reise lenger, smartere og med færre overraskelser.",
    howItLooks: "SLIK SER DET UT",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Demonstrasjon — kun eksempel. Denne organisasjonen er fiktiv.",
    heroAlt: "Reisende som ser på en AutoVere-rute og reisekostnader fra bilen",
    heroTagline: "La oss gjøre planleggingen enklere for dem dere bryr dere om.",
    dealerEyebrow: "For uavhengige forhandlere",
    dealerTitle: "Gjør hver biloverlevering litt mer komplett.",
    dealerBody:
      "Gi kundene en praktisk reisefølgesvenn sammen med den nye bilen. AutoVere hjelper dem å forstå bompenger, vignetter, drivstoff og ladekostnader før den første lange turen — og forhandleren gir dem 25 % rabatt på Pro.",
    dealerAlt: "Bilforhandler som presenterer AutoVere for en kunde ved overlevering av bil",
    dealerCaption: "En nyttig reisefordel, presentert på akkurat riktig tidspunkt.",
    dealerBullets: [
      "Et gjennomtenkt ekstra for kunder som kjøper ny eller brukt bil",
      "Relevant for elbil-, bobil- og turkjøpere",
      "Ingen programvare, abonnement eller fakturering for teamet deres",
    ],
    dealerCta: "Tilby AutoVere til kundene dine",
    whyTitle: "Hvorfor samarbeide med AutoVere?",
    why: [
      {
        icon: Gift,
        heading: "En fordel medlemmene faktisk setter pris på",
        body: "Medlemmene får noe de virkelig bruker før hver eneste tur: ekte bom-, vignett-, drivstoff- og ladekostnader — aldri gjetting.",
      },
      {
        icon: Zap,
        heading: "Enkelt for dere",
        body: "Vi tar oss av teknologien, abonnementene og medlemsopplevelsen. Ingenting å bygge, og ingen fakturering å holde styr på.",
      },
      {
        icon: RouteIcon,
        heading: "Bygget for folk som reiser — og for dem som hjelper dem ut på veien",
        body: "Klubber, forbund og forhandlere kan vise reisende hva en tur faktisk vil koste — fra bom og vignetter til drivstoff og lading — lenge før de forlater hjemmet.",
      },
    ],
    howTitle: "Slik fungerer det",
    how: [
      {
        icon: Handshake,
        heading: "1. Vi setter opp fordelen for dere",
        body: "Fortell oss litt om organisasjonen, så ordner vi partneravtalen og medlemstilgangen. Ingenting dere trenger å sette opp selv.",
      },
      {
        icon: Share2,
        heading: "2. Dere deler den slik det passer dere",
        body: "Dere får en medlemslenke og -kode. Del dem i nyhetsbrevet, på nettsiden, eller gi dem ut personlig — akkurat slik det passer best.",
      },
      {
        icon: BadgePercent,
        heading: "3. Medlemmene får 25 % rabatt på AutoVere Pro",
        body: "Det fungerer fra dag én, og vi er her hvis noen skulle ha spørsmål underveis.",
      },
    ],
    partnersTitle: "Våre organisasjonspartnere",
    partnersEmpty:
      "Partnerlogoer vises her etter hvert som avtalene signeres. Vi vil gjerne ha dere blant de første.",
    trustTitle: "Trygt, transparent og uten videresalg",
    trust: [
      "Alle bom- og vignettkjøp skjer direkte hos den offisielle operatøren — vi er aldri videreselger, og vi legger aldri på noe påslag.",
      "Medlemsdataene forblir private; vi deler dem aldri med tredjepart til markedsføring.",
      "Én tjeneste som dekker Europa, USA og Canada.",
      "Laget med omhu av KM TECH LABS i Kristiansand.",
    ],
    ctaTitle: "Vi vil gjerne høre fra dere",
    ctaHeading: "Bli AutoVere-partner",
    ctaBody: "Registrer organisasjonen direkte hos AutoVere — det tar bare noen minutter, og det forplikter ingenting å spørre.",
    ctaButton: "Bli AutoVere-partner",
    ctaFine:
      "Dere oppgir organisasjonsdetaljer, logo, land, kontaktinformasjon og litt om medlemsfordelen. Etter godkjenning sender vi partnerkode og partnerlenke på e-post — og vi hjelper gjerne til med å presentere den for medlemmene deres.",
    talkBody:
      "Ikke helt klare til å melde dere på ennå? Bare si hei. Vi blir alltid glade for å snakke om hvordan AutoVere kan hjelpe dem dere har ansvar for.",
    talkButton: "La oss snakke",
    applyTitle: "Søk om å bli partner",
    applyBody:
      "Fortell oss om organisasjonen, så tar vi kontakt. Etter godkjenning er medlemskoden og lenken klar umiddelbart — ingenting for dere å sette opp.",
    fields: {
      org: "Organisasjonsnavn",
      orgPh: "f.eks. Norsk Motorklubb",
      country: "Land",
      countryPh: "f.eks. Norge",
      site: "Offisiell nettside",
      name: "Ditt navn",
      namePh: "Fullt navn",
      email: "Din e-post",
      emailPh: "navn@organisasjon.no",
      members: "Fortell litt om medlemmene (valgfritt)",
      membersPh: "Hvem er medlemmene, og omtrent hvor mange?",
      submit: "Send søknad",
      msgTitle: "Send oss en melding",
      msgBody:
        "Har dere et spørsmål eller noe vi bør forbedre? Skriv til oss, så svarer vi så raskt vi kan.",
      yourName: "Navn",
      subject: "Emne",
      subjectPh: "Hva gjelder det?",
      message: "Melding",
      messagePh: "Fortell oss hva du tenker på …",
      send: "Send melding",
    },
  },
  en: {
    eyebrow: "AutoVere Partners",
    title: "Give your members 25% off AutoVere Pro.",
    intro:
      "AutoVere gives motoring clubs, EV groups, motorhome and caravan associations, touring and travel organisations — and independent new- and used-car dealers — a simple way to offer their members and customers something they will actually use: real trip costs before they set off, plus 25% off AutoVere Pro.",
    lead: "We're proud to work with people who help others travel further, smarter and with fewer surprises.",
    howItLooks: "HERE'S HOW IT LOOKS",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Demonstration — example only. This organisation is fictional.",
    heroAlt: "Traveller reviewing an AutoVere route and trip costs from a parked car",
    heroTagline: "Let's make planning easier for the people you care about.",
    dealerEyebrow: "For independent dealers",
    dealerTitle: "Make every vehicle handover feel more complete.",
    dealerBody:
      "Offer customers a practical travel companion alongside their new car. AutoVere helps them understand tolls, vignettes, fuel or charging costs before their first long journey — while your dealership gives them 25% off Pro.",
    dealerAlt: "Independent car dealer introducing AutoVere to a customer during a vehicle handover",
    dealerCaption: "A useful travel benefit, introduced at exactly the right moment.",
    dealerBullets: [
      "A thoughtful extra for new and used-car customers",
      "Relevant for EV, motorhome and touring buyers",
      "No software, subscriptions or customer billing for your team",
    ],
    dealerCta: "Offer AutoVere to your customers",
    whyTitle: "Why partner with AutoVere?",
    why: [
      {
        icon: Gift,
        heading: "A benefit people are glad to receive",
        body: "Your members get something they'll genuinely reach for before every journey: real toll, vignette, fuel and charging costs — never guesswork.",
      },
      {
        icon: Zap,
        heading: "Easy on your side",
        body: "We look after the technology, the subscriptions and the member experience. There's nothing to build, and no billing for you to keep track of.",
      },
      {
        icon: RouteIcon,
        heading: "Built for people who travel — and for those who help them get on the road",
        body: "Clubs, associations and independent dealers alike can show travellers what a journey will really cost, from tolls and vignettes to fuel and EV charging, long before they leave home.",
      },
    ],
    howTitle: "How it works",
    how: [
      {
        icon: Handshake,
        heading: "1. We set the benefit up for you",
        body: "Tell us a little about your organisation and we'll take care of the partner arrangement and member access. Nothing to configure at your end.",
      },
      {
        icon: Share2,
        heading: "2. You share it in your own way",
        body: "You'll get a member link and code. Share them in a newsletter, on your site, or hand them over in person — whatever suits you best.",
      },
      {
        icon: BadgePercent,
        heading: "3. Your members enjoy 25% off AutoVere Pro",
        body: "It works from day one, and we're here if anyone has a question along the way.",
      },
    ],
    partnersTitle: "Our organisation partners",
    partnersEmpty:
      "Partner logos will appear here as agreements are signed. We'd love to have you among the first.",
    trustTitle: "Safe, transparent and never a reseller",
    trust: [
      "Every toll and vignette purchase happens directly with the official operator — we never resell, and we never add a markup.",
      "Member data stays private; we never share it with third parties for marketing.",
      "One service covering Europe, the USA and Canada.",
      "Made with care by KM TECH LABS in Kristiansand, Norway.",
    ],
    ctaTitle: "We'd love to hear from you",
    ctaHeading: "Become an AutoVere Partner",
    ctaBody:
      "Register your organisation directly with AutoVere — it only takes a few minutes, and there's no commitment in asking.",
    ctaButton: "Become an AutoVere Partner",
    ctaFine:
      "You share your organisation details, logo, country, contact information and a little about the member benefit. Once approved, we'll email your partner code and partner link — and we're happy to help you present it to your members.",
    talkBody:
      "Not quite ready to sign up? Just say hello. We're always glad to talk through how AutoVere could help the people you look after.",
    talkButton: "Let's talk",
    applyTitle: "Apply to become a partner",
    applyBody:
      "Tell us about your organisation and we'll be in touch. Once approved, your member code and link are ready immediately — nothing for you to configure.",
    fields: {
      org: "Organisation name",
      orgPh: "e.g. European Touring Association",
      country: "Country",
      countryPh: "e.g. Norway",
      site: "Official website",
      name: "Your name",
      namePh: "Full name",
      email: "Your email",
      emailPh: "name@organisation.org",
      members: "Tell us a bit about your members (optional)",
      membersPh: "Who are your members, and roughly how many?",
      submit: "Submit application",
      msgTitle: "Send us a message",
      msgBody: "Have a question or spotted something we should improve? Write to us and we will get back to you.",
      yourName: "Name",
      subject: "Subject",
      subjectPh: "What is this about?",
      message: "Message",
      messagePh: "Tell us what is on your mind…",
      send: "Send message",
    },
  },
  pl: {
    eyebrow: "Partnerzy AutoVere",
    title: "Daj swoim członkom 25% zniżki na AutoVere Pro.",
    intro:
      "AutoVere daje klubom motoryzacyjnym, organizacjom EV, kamperowym i karawaningowym oraz organizacjom turystycznym — a także niezależnym dealerom nowych i używanych samochodów — prosty sposób, by zaoferować swoim członkom i klientom coś, z czego naprawdę skorzystają: realne koszty podróży jeszcze przed wyjazdem, plus 25% zniżki na AutoVere Pro.",
    lead: "Z dumą współpracujemy z ludźmi, którzy pomagają innym podróżować dalej, mądrzej i bez przykrych niespodzianek.",
    howItLooks: "TAK TO WYGLĄDA",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Demonstracja — wyłącznie przykład. Ta organizacja jest fikcyjna.",
    heroAlt: "Podróżny sprawdzający trasę i koszty podróży w AutoVere z fotela samochodu",
    heroTagline: "Ułatwmy planowanie osobom, na których Wam zależy.",
    dealerEyebrow: "Dla niezależnych dealerów",
    dealerTitle: "Spraw, by każde wydanie samochodu było pełniejsze.",
    dealerBody:
      "Zaoferuj klientom praktycznego towarzysza podróży razem z nowym autem. AutoVere pomaga zrozumieć opłaty drogowe, winiety oraz koszty paliwa i ładowania jeszcze przed pierwszą długą trasą — a Wasz salon daje 25% zniżki na Pro.",
    dealerAlt: "Dealer samochodowy prezentujący AutoVere klientowi podczas wydania auta",
    dealerCaption: "Przydatna korzyść podróżna, przedstawiona w idealnym momencie.",
    dealerBullets: [
      "Przemyślany dodatek dla kupujących auta nowe i używane",
      "Istotne dla klientów EV, kamperów i podróżujących",
      "Żadnego oprogramowania, subskrypcji ani rozliczeń po Waszej stronie",
    ],
    dealerCta: "Zaproponuj AutoVere swoim klientom",
    whyTitle: "Dlaczego warto zostać partnerem AutoVere?",
    why: [
      {
        icon: Gift,
        heading: "Korzyść, z której członkowie naprawdę się cieszą",
        body: "Członkowie dostają coś, po co sami sięgną przed każdą podróżą: prawdziwe koszty opłat, winiet, paliwa i ładowania — nigdy zgadywanie.",
      },
      {
        icon: Zap,
        heading: "Prosto po Waszej stronie",
        body: "My zajmujemy się technologią, subskrypcjami i obsługą członków. Nie musicie niczego budować ani rozliczać.",
      },
      {
        icon: RouteIcon,
        heading: "Stworzone dla podróżujących — i dla tych, którzy pomagają im wyruszyć w drogę",
        body: "Kluby, stowarzyszenia i niezależni dealerzy mogą pokazać podróżnym, ile naprawdę będzie kosztować trasa — od opłat i winiet po paliwo i ładowanie — na długo, zanim ktokolwiek wyjedzie z domu.",
      },
    ],
    howTitle: "Jak to działa",
    how: [
      {
        icon: Handshake,
        heading: "1. Przygotowujemy dla Was tę korzyść",
        body: "Opowiedzcie nam trochę o swojej organizacji, a my zajmiemy się umową partnerską i dostępem dla członków. Po Waszej stronie nic nie trzeba konfigurować.",
      },
      {
        icon: Share2,
        heading: "2. Udostępniacie ją, jak Wam wygodnie",
        body: "Otrzymujecie link i kod dla członków. Udostępnijcie je w newsletterze, na stronie albo osobiście — jak najlepiej pasuje.",
      },
      {
        icon: BadgePercent,
        heading: "3. Członkowie cieszą się 25% zniżki na AutoVere Pro",
        body: "Działa od pierwszego dnia, a my jesteśmy pod ręką, gdyby ktoś miał pytanie po drodze.",
      },
    ],
    partnersTitle: "Nasi partnerzy organizacyjni",
    partnersEmpty:
      "Loga partnerów pojawią się tutaj wraz z podpisywaniem umów. Bardzo chcielibyśmy mieć Was wśród pierwszych.",
    trustTitle: "Bezpiecznie, przejrzyście i nigdy w odsprzedaży",
    trust: [
      "Każdy zakup opłaty i winiety odbywa się bezpośrednio u oficjalnego operatora — nigdy nie jesteśmy pośrednikiem i nigdy nie doliczamy marży.",
      "Dane członków pozostają prywatne; nigdy nie udostępniamy ich stronom trzecim w celach marketingowych.",
      "Jedna usługa obejmująca Europę, USA i Kanadę.",
      "Stworzone z dbałością przez KM TECH LABS w Kristiansand, w Norwegii.",
    ],
    ctaTitle: "Chętnie usłyszymy, co macie do powiedzenia",
    ctaHeading: "Zostań partnerem AutoVere",
    ctaBody: "Zarejestrujcie organizację bezpośrednio w AutoVere — to zajmuje tylko kilka minut i do niczego nie zobowiązuje.",
    ctaButton: "Zostań partnerem AutoVere",
    ctaFine:
      "Podajecie dane organizacji, logo, kraj, dane kontaktowe oraz kilka słów o korzyści dla członków. Po akceptacji wyślemy Wam kod i link partnerski e-mailem — i chętnie pomożemy przedstawić go Waszym członkom.",
    talkBody:
      "Jeszcze nie jesteście gotowi się zarejestrować? Po prostu się przywitajcie. Zawsze chętnie porozmawiamy o tym, jak AutoVere może pomóc osobom, którymi się opiekujecie.",
    talkButton: "Porozmawiajmy",
    applyTitle: "Zgłoś się na partnera",
    applyBody:
      "Opowiedzcie nam o swojej organizacji, a my się odezwiemy. Po akceptacji kod i link dla członków są gotowe od razu — nic nie musicie konfigurować.",
    fields: {
      org: "Nazwa organizacji",
      orgPh: "np. Polski Związek Motorowy",
      country: "Kraj",
      countryPh: "np. Polska",
      site: "Oficjalna strona",
      name: "Twoje imię i nazwisko",
      namePh: "Imię i nazwisko",
      email: "Twój e-mail",
      emailPh: "imie@organizacja.pl",
      members: "Opowiedz krótko o członkach (opcjonalnie)",
      membersPh: "Kim są członkowie i mniej więcej ilu ich jest?",
      submit: "Wyślij zgłoszenie",
      msgTitle: "Napisz do nas",
      msgBody:
        "Masz pytanie albo pomysł, co moglibyśmy poprawić? Napisz — odpowiemy tak szybko, jak to możliwe.",
      yourName: "Imię i nazwisko",
      subject: "Temat",
      subjectPh: "Czego dotyczy wiadomość?",
      message: "Wiadomość",
      messagePh: "Napisz, co Ci chodzi po głowie …",
      send: "Wyślij wiadomość",
    },
  },
  se: {
    eyebrow: "AutoVere Partners",
    title: "Ge era medlemmar 25 % rabatt på AutoVere Pro.",
    intro:
      "AutoVere ger bilklubbar, elbilsföreningar, husbils- och husvagnsförbund, rese- och turistorganisationer — och fristående bilhandlare för nya och begagnade bilar — ett enkelt sätt att ge sina medlemmar och kunder något de faktiskt kommer att använda: verkliga resekostnader innan de ger sig av, plus 25 % rabatt på AutoVere Pro.",
    lead: "Vi är stolta över att samarbeta med människor som hjälper andra att resa längre, smartare och med färre överraskningar.",
    howItLooks: "SÅ HÄR SER DET UT",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Demonstration — endast exempel. Organisationen är fiktiv.",
    heroAlt: "Resenär som tittar på en AutoVere-rutt och resekostnader från en parkerad bil",
    heroTagline: "Låt oss göra planeringen enklare för dem ni bryr er om.",
    dealerEyebrow: "För fristående bilhandlare",
    dealerTitle: "Gör varje bilöverlämning lite mer komplett.",
    dealerBody:
      "Ge kunderna en praktisk reskamrat tillsammans med den nya bilen. AutoVere hjälper dem att förstå vägtullar, vinjetter, bränsle- och laddningskostnader redan innan den första långresan — medan er anläggning ger dem 25 % rabatt på Pro.",
    dealerAlt: "Fristående bilhandlare som presenterar AutoVere för en kund vid bilöverlämning",
    dealerCaption: "En användbar resefördel, presenterad vid precis rätt tillfälle.",
    dealerBullets: [
      "Ett genomtänkt extra för kunder som köper ny eller begagnad bil",
      "Relevant för elbils-, husbils- och turistköpare",
      "Ingen programvara, prenumeration eller fakturering för ert team",
    ],
    dealerCta: "Erbjud AutoVere till era kunder",
    whyTitle: "Varför samarbeta med AutoVere?",
    why: [
      {
        icon: Gift,
        heading: "En förmån medlemmarna verkligen uppskattar",
        body: "Medlemmarna får något de faktiskt tar till inför varje resa: verkliga kostnader för vägtullar, vinjetter, bränsle och laddning — aldrig gissningar.",
      },
      {
        icon: Zap,
        heading: "Enkelt för er",
        body: "Vi sköter tekniken, prenumerationerna och medlemsupplevelsen. Inget att bygga, och ingen fakturering att hålla reda på.",
      },
      {
        icon: RouteIcon,
        heading: "Byggt för dem som reser — och för dem som hjälper dem ut på vägen",
        body: "Klubbar, förbund och bilhandlare kan visa resenärer vad en resa verkligen kommer att kosta — från vägtullar och vinjetter till bränsle och elbilsladdning — långt innan de lämnar hemmet.",
      },
    ],
    howTitle: "Så fungerar det",
    how: [
      {
        icon: Handshake,
        heading: "1. Vi sätter upp förmånen åt er",
        body: "Berätta lite om er organisation, så tar vi hand om partneravtalet och medlemstillgången. Inget ni behöver konfigurera själva.",
      },
      {
        icon: Share2,
        heading: "2. Ni delar den på ert eget sätt",
        body: "Ni får en medlemslänk och kod. Dela dem i nyhetsbrevet, på er webbplats eller personligen — precis som det passar er bäst.",
      },
      {
        icon: BadgePercent,
        heading: "3. Medlemmarna får 25 % rabatt på AutoVere Pro",
        body: "Det fungerar från dag ett, och vi finns här om någon skulle ha en fråga längs vägen.",
      },
    ],
    partnersTitle: "Våra organisationspartners",
    partnersEmpty:
      "Partnerlogotyper visas här efter hand som avtal skrivs under. Vi skulle gärna vilja ha er bland de första.",
    trustTitle: "Tryggt, transparent och aldrig återförsäljning",
    trust: [
      "Alla köp av vägtullar och vinjetter sker direkt hos den officiella operatören — vi är aldrig återförsäljare, och vi lägger aldrig på ett påslag.",
      "Medlemsdata förblir privat; vi delar den aldrig med tredje part för marknadsföring.",
      "En tjänst som täcker Europa, USA och Kanada.",
      "Skapat med omsorg av KM TECH LABS i Kristiansand, Norge.",
    ],
    ctaTitle: "Vi skulle gärna höra från er",
    ctaHeading: "Bli en AutoVere-partner",
    ctaBody: "Registrera er organisation direkt hos AutoVere — det tar bara några minuter, och det är inte bindande att fråga.",
    ctaButton: "Bli en AutoVere-partner",
    ctaFine:
      "Ni delar organisationens uppgifter, logotyp, land, kontaktinformation och lite om medlemsförmånen. När ni är godkända mejlar vi er partnerkod och partnerlänk — och vi hjälper gärna till att presentera den för era medlemmar.",
    talkBody:
      "Inte riktigt redo att registrera er än? Säg bara hej. Vi pratar alltid gärna om hur AutoVere kan hjälpa dem ni ansvarar för.",
    talkButton: "Låt oss prata",
    applyTitle: "Ansök om att bli partner",
    applyBody:
      "Berätta om er organisation, så hör vi av oss. När ni är godkända är medlemskoden och länken klara direkt — inget för er att konfigurera.",
    fields: {
      org: "Organisationens namn",
      orgPh: "t.ex. European Touring Association",
      country: "Land",
      countryPh: "t.ex. Sverige",
      site: "Officiell webbplats",
      name: "Ditt namn",
      namePh: "Fullständigt namn",
      email: "Din e-post",
      emailPh: "namn@organisation.se",
      members: "Berätta lite om era medlemmar (valfritt)",
      membersPh: "Vilka är era medlemmar, och ungefär hur många?",
      submit: "Skicka ansökan",
      msgTitle: "Skicka oss ett meddelande",
      msgBody: "Har ni en fråga eller upptäckt något vi borde förbättra? Skriv till oss så återkommer vi.",
      yourName: "Namn",
      subject: "Ämne",
      subjectPh: "Vad gäller det?",
      message: "Meddelande",
      messagePh: "Berätta vad ni tänker på …",
      send: "Skicka meddelande",
    },
  },
  dk: {
    eyebrow: "AutoVere Partnere",
    title: "Giv jeres medlemmer 25 % rabat på AutoVere Pro.",
    intro:
      "AutoVere giver bilklubber, elbilsforeninger, autocamper- og campingvognsforbund, rejse- og turistorganisationer — og uafhængige forhandlere af nye og brugte biler — en enkel måde at give deres medlemmer og kunder noget, de rent faktisk vil bruge: ægte rejseomkostninger, inden de kører — plus 25 % rabat på AutoVere Pro.",
    lead: "Vi er stolte af at samarbejde med folk, der hjælper andre med at rejse længere, klogere og med færre overraskelser.",
    howItLooks: "SÅDAN SER DET UD",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Demonstration — kun et eksempel. Organisationen er fiktiv.",
    heroAlt: "Rejsende, der kigger på en AutoVere-rute og rejseomkostninger fra en parkeret bil",
    heroTagline: "Lad os gøre planlægningen lettere for dem, I holder af.",
    dealerEyebrow: "For uafhængige forhandlere",
    dealerTitle: "Gør hver bilaflevering lidt mere komplet.",
    dealerBody:
      "Giv kunderne en praktisk rejsemakker sammen med den nye bil. AutoVere hjælper dem med at forstå vejafgifter, vignetter, brændstof- og ladeomkostninger, inden den første lange tur — mens jeres forhandler giver dem 25 % rabat på Pro.",
    dealerAlt: "Uafhængig bilforhandler, der præsenterer AutoVere for en kunde ved bilaflevering",
    dealerCaption: "En nyttig rejsefordel, præsenteret på præcis det rette tidspunkt.",
    dealerBullets: [
      "Et gennemtænkt ekstra til kunder, der køber ny eller brugt bil",
      "Relevant for elbil-, autocamper- og turistkøbere",
      "Ingen software, abonnementer eller fakturering for jeres team",
    ],
    dealerCta: "Tilbyd AutoVere til jeres kunder",
    whyTitle: "Hvorfor samarbejde med AutoVere?",
    why: [
      {
        icon: Gift,
        heading: "En fordel, medlemmerne virkelig sætter pris på",
        body: "Medlemmerne får noget, de rent faktisk griber til før hver tur: ægte omkostninger til vejafgifter, vignetter, brændstof og opladning — aldrig gætværk.",
      },
      {
        icon: Zap,
        heading: "Nemt for jer",
        body: "Vi tager os af teknologien, abonnementerne og medlemsoplevelsen. Intet at bygge, og ingen fakturering at holde styr på.",
      },
      {
        icon: RouteIcon,
        heading: "Bygget til dem, der rejser — og til dem, der hjælper dem ud på vejen",
        body: "Klubber, forbund og forhandlere kan vise rejsende, hvad en tur reelt vil koste — fra vejafgifter og vignetter til brændstof og elbilsopladning — længe før de forlader hjemmet.",
      },
    ],
    howTitle: "Sådan fungerer det",
    how: [
      {
        icon: Handshake,
        heading: "1. Vi sætter fordelen op for jer",
        body: "Fortæl os lidt om jeres organisation, så tager vi os af partneraftalen og medlemsadgangen. Intet, I selv skal konfigurere.",
      },
      {
        icon: Share2,
        heading: "2. I deler den, som det passer jer",
        body: "I får et medlemslink og en kode. Del dem i nyhedsbrevet, på jeres side eller personligt — helt som det passer jer bedst.",
      },
      {
        icon: BadgePercent,
        heading: "3. Medlemmerne får 25 % rabat på AutoVere Pro",
        body: "Det fungerer fra dag ét, og vi er her, hvis nogen skulle have et spørgsmål undervejs.",
      },
    ],
    partnersTitle: "Vores organisationspartnere",
    partnersEmpty:
      "Partnerlogoer vises her, efterhånden som aftaler underskrives. Vi vil meget gerne have jer blandt de første.",
    trustTitle: "Sikkert, gennemsigtigt og aldrig videresalg",
    trust: [
      "Alle køb af vejafgifter og vignetter sker direkte hos den officielle udbyder — vi er aldrig videresælger, og vi lægger aldrig noget oveni.",
      "Medlemsdata forbliver private; vi deler dem aldrig med tredjepart til markedsføring.",
      "Én tjeneste, der dækker Europa, USA og Canada.",
      "Lavet med omhu af KM TECH LABS i Kristiansand, Norge.",
    ],
    ctaTitle: "Vi vil meget gerne høre fra jer",
    ctaHeading: "Bliv AutoVere-partner",
    ctaBody: "Registrer jeres organisation direkte hos AutoVere — det tager kun nogle minutter, og det forpligter ingenting at spørge.",
    ctaButton: "Bliv AutoVere-partner",
    ctaFine:
      "I opgiver organisationens oplysninger, logo, land, kontaktinformation og lidt om medlemsfordelen. Når I er godkendt, sender vi jeres partnerkode og partnerlink på mail — og vi hjælper gerne med at præsentere den for jeres medlemmer.",
    talkBody:
      "Ikke helt klar til at tilmelde jer endnu? Sig bare hej. Vi taler altid gerne om, hvordan AutoVere kan hjælpe dem, I har ansvar for.",
    talkButton: "Lad os tale sammen",
    applyTitle: "Ansøg om at blive partner",
    applyBody:
      "Fortæl os om jeres organisation, så kontakter vi jer. Når I er godkendt, er medlemskoden og linket klar med det samme — intet for jer at sætte op.",
    fields: {
      org: "Organisationens navn",
      orgPh: "f.eks. European Touring Association",
      country: "Land",
      countryPh: "f.eks. Danmark",
      site: "Officiel hjemmeside",
      name: "Dit navn",
      namePh: "Fulde navn",
      email: "Din e-mail",
      emailPh: "navn@organisation.dk",
      members: "Fortæl lidt om jeres medlemmer (valgfrit)",
      membersPh: "Hvem er jeres medlemmer, og cirka hvor mange er I?",
      submit: "Send ansøgning",
      msgTitle: "Send os en besked",
      msgBody: "Har I et spørgsmål eller opdaget noget, vi bør forbedre? Skriv til os, så vender vi tilbage.",
      yourName: "Navn",
      subject: "Emne",
      subjectPh: "Hvad drejer det sig om?",
      message: "Besked",
      messagePh: "Fortæl os, hvad I tænker på …",
      send: "Send besked",
    },
  },
  fi: {
    eyebrow: "AutoVere-kumppanit",
    title: "Anna jäsenillesi 25 %:n alennus AutoVere Prosta.",
    intro:
      "AutoVere tarjoaa moottoriklubeille, sähköautoyhdistyksille, matkailuauto- ja asuntovaunuliitoille sekä matkailu- ja retkeilyjärjestöille — samoin kuin riippumattomille uusien ja käytettyjen autojen jälleenmyyjille — helpon tavan tarjota jäsenilleen ja asiakkailleen jotain, mitä he oikeasti käyttävät: todelliset matkakustannukset ennen matkaan lähtöä, sekä 25 %:n alennus AutoVere Prosta.",
    lead: "Olemme ylpeitä siitä, että saamme tehdä yhteistyötä ihmisten kanssa, jotka auttavat muita matkustamaan pidemmälle, fiksummin ja ilman ikäviä yllätyksiä.",
    howItLooks: "NÄIN SE NÄYTTÄÄ",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Havainnollistus — vain esimerkki. Organisaatio on kuvitteellinen.",
    heroAlt: "Matkailija tarkastelee AutoVere-reittiä ja matkakuluja pysäköidyssä autossa",
    heroTagline: "Tehdään suunnittelusta helpompaa niille, joista välität.",
    dealerEyebrow: "Riippumattomille jälleenmyyjille",
    dealerTitle: "Tee jokaisesta auton luovutuksesta hieman täydellisempi.",
    dealerBody:
      "Tarjoa asiakkaillesi käytännöllinen matkakumppani uuden auton mukana. AutoVere auttaa heitä ymmärtämään tietullit, tievinjetit sekä polttoaine- ja latauskustannukset jo ennen ensimmäistä pitkää matkaa — kun taas liikkeenne antaa heille 25 %:n alennuksen Prosta.",
    dealerAlt: "Riippumaton autokauppias esittelee AutoVerea asiakkaalle auton luovutuksen yhteydessä",
    dealerCaption: "Hyödyllinen matkaetu, esiteltynä juuri oikealla hetkellä.",
    dealerBullets: [
      "Harkittu lisä uuden tai käytetyn auton ostajille",
      "Hyödyllinen sähköauto-, matkailuauto- ja matkailuasiakkaille",
      "Ei ohjelmistoja, tilauksia tai laskutusta tiimillenne",
    ],
    dealerCta: "Tarjoa AutoVere asiakkaillesi",
    whyTitle: "Miksi tehdä yhteistyötä AutoVeren kanssa?",
    why: [
      {
        icon: Gift,
        heading: "Etu, josta jäsenet aidosti pitävät",
        body: "Jäsenenne saavat jotain, mihin he todella turvautuvat ennen jokaista matkaa: todelliset tietulli-, tievinjetti-, polttoaine- ja latauskustannukset — ei koskaan arvailua.",
      },
      {
        icon: Zap,
        heading: "Helppoa teidän puoleltanne",
        body: "Me huolehdimme teknologiasta, tilauksista ja jäsenkokemuksesta. Ei mitään rakennettavaa, eikä laskutusta seurattavaksi.",
      },
      {
        icon: RouteIcon,
        heading: "Suunniteltu matkustaville — ja niille, jotka auttavat heidät liikkeelle",
        body: "Klubit, liitot ja jälleenmyyjät voivat näyttää matkustajille, mitä matka todella maksaa — tietulleista ja vinjeteistä polttoaineeseen ja latauskuluihin — hyvissä ajoin ennen kotoa lähtöä.",
      },
    ],
    howTitle: "Näin se toimii",
    how: [
      {
        icon: Handshake,
        heading: "1. Järjestämme edun puolestanne",
        body: "Kertokaa meille hieman organisaatiostanne, niin hoidamme kumppanuussopimuksen ja jäsenpääsyn. Teidän ei tarvitse konfiguroida mitään.",
      },
      {
        icon: Share2,
        heading: "2. Jaatte sen omalla tavallanne",
        body: "Saatte jäsenlinkin ja koodin. Jakakaa ne uutiskirjeessä, verkkosivuillanne tai kasvotusten — miten ikinä teille sopii parhaiten.",
      },
      {
        icon: BadgePercent,
        heading: "3. Jäsenet saavat 25 %:n alennuksen AutoVere Prosta",
        body: "Se toimii ensimmäisestä päivästä lähtien, ja olemme täällä, jos jollakulla on kysyttävää matkan varrella.",
      },
    ],
    partnersTitle: "Organisaatiokumppanimme",
    partnersEmpty:
      "Kumppaneiden logot ilmestyvät tänne sitä mukaa, kun sopimuksia allekirjoitetaan. Ottaisimme mielellämme teidät joukkoon ensimmäisten seassa.",
    trustTitle: "Turvallista, läpinäkyvää eikä koskaan jälleenmyyntiä",
    trust: [
      "Jokainen tietulli- ja vinjettiosto tapahtuu suoraan virallisen operaattorin kanssa — emme koskaan toimi jälleenmyyjänä emmekä koskaan lisää omaa katetta.",
      "Jäsentiedot pysyvät yksityisinä; emme koskaan jaa niitä kolmansille osapuolille markkinointitarkoituksiin.",
      "Yksi palvelu, joka kattaa Euroopan, Yhdysvallat ja Kanadan.",
      "Huolella tehnyt KM TECH LABS, Kristiansand, Norja.",
    ],
    ctaTitle: "Kuulisimme mielellämme teistä",
    ctaHeading: "Ryhdy AutoVere-kumppaniksi",
    ctaBody: "Rekisteröikää organisaationne suoraan AutoVereen — se vie vain muutaman minuutin, eikä kysyminen sido teitä mihinkään.",
    ctaButton: "Ryhdy AutoVere-kumppaniksi",
    ctaFine:
      "Kerrotte organisaationne tiedot, logon, maan, yhteystiedot ja hieman jäsenedusta. Hyväksynnän jälkeen lähetämme kumppanikoodinne ja -linkkinne sähköpostitse — ja autamme mielellämme esittelemään sen jäsenillenne.",
    talkBody:
      "Ette vielä ihan valmiita rekisteröitymään? Sanokaa vain hei. Juttelemme aina mielellämme siitä, miten AutoVere voisi auttaa niitä, joista huolehditte.",
    talkButton: "Jutellaan",
    applyTitle: "Hae kumppaniksi",
    applyBody:
      "Kertokaa meille organisaatiostanne, niin olemme yhteydessä. Hyväksynnän jälkeen jäsenkoodi ja -linkki ovat valmiina heti — ei mitään konfiguroitavaa.",
    fields: {
      org: "Organisaation nimi",
      orgPh: "esim. European Touring Association",
      country: "Maa",
      countryPh: "esim. Suomi",
      site: "Virallinen verkkosivu",
      name: "Nimesi",
      namePh: "Koko nimi",
      email: "Sähköpostisi",
      emailPh: "nimi@organisaatio.fi",
      members: "Kerro hieman jäsenistänne (valinnainen)",
      membersPh: "Keitä jäsenenne ovat, ja suunnilleen kuinka monta teitä on?",
      submit: "Lähetä hakemus",
      msgTitle: "Lähetä meille viesti",
      msgBody: "Onko teillä kysyttävää tai huomasitteko jotain, mitä voisimme parantaa? Kirjoittakaa meille, niin vastaamme mahdollisimman pian.",
      yourName: "Nimi",
      subject: "Aihe",
      subjectPh: "Mitä asia koskee?",
      message: "Viesti",
      messagePh: "Kertokaa, mitä mielessänne on …",
      send: "Lähetä viesti",
    },
  },
  de: {
    eyebrow: "AutoVere Partner",
    title: "Geben Sie Ihren Mitgliedern 25 % Rabatt auf AutoVere Pro.",
    intro:
      "AutoVere bietet Automobilclubs, E-Mobilitätsverbänden, Wohnmobil- und Wohnwagenverbänden, Reise- und Tourismusorganisationen — sowie unabhängigen Neu- und Gebrauchtwagenhändlern — eine einfache Möglichkeit, ihren Mitgliedern und Kunden etwas wirklich Nützliches zu bieten: echte Reisekosten, bevor es losgeht, plus 25 % Rabatt auf AutoVere Pro.",
    lead: "Wir sind stolz darauf, mit Menschen zusammenzuarbeiten, die anderen helfen, weiter, klüger und mit weniger Überraschungen zu reisen.",
    howItLooks: "SO SIEHT ES AUS",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Demonstration — nur ein Beispiel. Diese Organisation ist fiktiv.",
    heroAlt: "Reisende betrachtet eine AutoVere-Route und die Reisekosten vom geparkten Auto aus",
    heroTagline: "Lassen Sie uns die Planung für die Menschen, die Ihnen wichtig sind, einfacher machen.",
    dealerEyebrow: "Für unabhängige Händler",
    dealerTitle: "Machen Sie jede Fahrzeugübergabe ein Stück runder.",
    dealerBody:
      "Bieten Sie Ihren Kunden einen praktischen Reisebegleiter zum neuen Auto dazu. AutoVere hilft ihnen, Maut, Vignetten sowie Kraftstoff- oder Ladekosten schon vor der ersten langen Fahrt zu verstehen — während Ihr Autohaus ihnen 25 % Rabatt auf Pro schenkt.",
    dealerAlt: "Unabhängiger Autohändler stellt einem Kunden AutoVere bei der Fahrzeugübergabe vor",
    dealerCaption: "Ein nützlicher Reisevorteil — genau im richtigen Moment vorgestellt.",
    dealerBullets: [
      "Eine durchdachte Zugabe für Neu- und Gebrauchtwagenkunden",
      "Relevant für Käufer von Elektrofahrzeugen, Wohnmobilen und Reisefahrzeugen",
      "Keine Software, Abonnements oder Abrechnung für Ihr Team",
    ],
    dealerCta: "Bieten Sie Ihren Kunden AutoVere an",
    whyTitle: "Warum mit AutoVere zusammenarbeiten?",
    why: [
      {
        icon: Gift,
        heading: "Ein Vorteil, über den sich Ihre Mitglieder wirklich freuen",
        body: "Ihre Mitglieder erhalten etwas, worauf sie vor jeder Fahrt tatsächlich zurückgreifen: echte Maut-, Vignetten-, Kraftstoff- und Ladekosten — nie Rätselraten.",
      },
      {
        icon: Zap,
        heading: "Einfach für Sie",
        body: "Wir kümmern uns um die Technologie, die Abonnements und das Mitgliedererlebnis. Nichts zu entwickeln, und keine Abrechnung, um die Sie sich kümmern müssten.",
      },
      {
        icon: RouteIcon,
        heading: "Gemacht für Menschen, die reisen — und für die, die ihnen auf die Straße helfen",
        body: "Clubs, Verbände und Händler können Reisenden zeigen, was eine Fahrt wirklich kosten wird — von Maut und Vignetten bis zu Kraftstoff und E-Ladung — lange bevor sie zu Hause losfahren.",
      },
    ],
    howTitle: "So funktioniert es",
    how: [
      {
        icon: Handshake,
        heading: "1. Wir richten den Vorteil für Sie ein",
        body: "Erzählen Sie uns etwas über Ihre Organisation, und wir kümmern uns um die Partnervereinbarung und den Mitgliederzugang. Nichts, was Sie selbst einrichten müssen.",
      },
      {
        icon: Share2,
        heading: "2. Sie teilen ihn auf Ihre Weise",
        body: "Sie erhalten einen Mitgliedslink und einen Code. Teilen Sie sie im Newsletter, auf Ihrer Website oder persönlich — wie es Ihnen am besten passt.",
      },
      {
        icon: BadgePercent,
        heading: "3. Ihre Mitglieder erhalten 25 % Rabatt auf AutoVere Pro",
        body: "Es funktioniert vom ersten Tag an, und wir sind da, falls jemand unterwegs eine Frage hat.",
      },
    ],
    partnersTitle: "Unsere Organisationspartner",
    partnersEmpty:
      "Partnerlogos erscheinen hier, sobald Vereinbarungen unterzeichnet sind. Wir würden uns freuen, Sie zu den Ersten zu zählen.",
    trustTitle: "Sicher, transparent und niemals als Wiederverkäufer",
    trust: [
      "Jeder Maut- und Vignettenkauf erfolgt direkt beim offiziellen Betreiber — wir sind nie Wiederverkäufer und schlagen nie etwas auf.",
      "Mitgliederdaten bleiben privat; wir geben sie niemals zu Marketingzwecken an Dritte weiter.",
      "Ein Service, der Europa, die USA und Kanada abdeckt.",
      "Mit Sorgfalt entwickelt von KM TECH LABS in Kristiansand, Norwegen.",
    ],
    ctaTitle: "Wir würden uns freuen, von Ihnen zu hören",
    ctaHeading: "Werden Sie AutoVere-Partner",
    ctaBody: "Registrieren Sie Ihre Organisation direkt bei AutoVere — es dauert nur wenige Minuten, und eine Anfrage verpflichtet zu nichts.",
    ctaButton: "Werden Sie AutoVere-Partner",
    ctaFine:
      "Sie teilen uns Ihre Organisationsdaten, Ihr Logo, Ihr Land, Ihre Kontaktinformationen und ein wenig über den Mitgliedervorteil mit. Nach der Freigabe senden wir Ihnen Ihren Partnercode und Partnerlink per E-Mail — und helfen Ihnen gerne dabei, ihn Ihren Mitgliedern vorzustellen.",
    talkBody:
      "Noch nicht ganz bereit, sich anzumelden? Sagen Sie einfach Hallo. Wir sprechen jederzeit gerne darüber, wie AutoVere den Menschen helfen könnte, um die Sie sich kümmern.",
    talkButton: "Lassen Sie uns sprechen",
    applyTitle: "Bewerben Sie sich als Partner",
    applyBody:
      "Erzählen Sie uns von Ihrer Organisation, und wir melden uns bei Ihnen. Nach der Freigabe stehen Ihr Mitgliedscode und -link sofort bereit — nichts, was Sie einrichten müssten.",
    fields: {
      org: "Name der Organisation",
      orgPh: "z. B. European Touring Association",
      country: "Land",
      countryPh: "z. B. Deutschland",
      site: "Offizielle Website",
      name: "Ihr Name",
      namePh: "Vollständiger Name",
      email: "Ihre E-Mail",
      emailPh: "name@organisation.de",
      members: "Erzählen Sie uns etwas über Ihre Mitglieder (optional)",
      membersPh: "Wer sind Ihre Mitglieder, und wie viele sind es ungefähr?",
      submit: "Bewerbung absenden",
      msgTitle: "Senden Sie uns eine Nachricht",
      msgBody: "Haben Sie eine Frage oder etwas entdeckt, das wir verbessern sollten? Schreiben Sie uns, wir melden uns zurück.",
      yourName: "Name",
      subject: "Betreff",
      subjectPh: "Worum geht es?",
      message: "Nachricht",
      messagePh: "Erzählen Sie uns, was Sie bewegt …",
      send: "Nachricht senden",
    },
  },
  nl: {
    eyebrow: "AutoVere Partners",
    title: "Geef je leden 25% korting op AutoVere Pro.",
    intro:
      "AutoVere biedt automobielclubs, EV-verenigingen, camper- en caravanverenigingen, reis- en toerismeorganisaties — en onafhankelijke dealers in nieuwe en tweedehands auto's — een eenvoudige manier om hun leden en klanten iets te geven dat ze echt gebruiken: reële reiskosten voordat ze vertrekken, plus 25% korting op AutoVere Pro.",
    lead: "We zijn er trots op samen te werken met mensen die anderen helpen verder, slimmer en met minder verrassingen te reizen.",
    howItLooks: "ZO ZIET HET ERUIT",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Demonstratie — alleen een voorbeeld. Deze organisatie is fictief.",
    heroAlt: "Reiziger bekijkt een AutoVere-route en reiskosten vanuit een geparkeerde auto",
    heroTagline: "Laten we het plannen makkelijker maken voor de mensen om wie je geeft.",
    dealerEyebrow: "Voor onafhankelijke dealers",
    dealerTitle: "Maak elke auto-overdracht net iets completer.",
    dealerBody:
      "Geef klanten een praktische reisgenoot bij hun nieuwe auto. AutoVere helpt hen tol, vignetten, brandstof- en laadkosten te begrijpen vóór hun eerste lange rit — terwijl jouw bedrijf ze 25% korting op Pro geeft.",
    dealerAlt: "Onafhankelijke autodealer die AutoVere aan een klant voorstelt tijdens de auto-overdracht",
    dealerCaption: "Een nuttig reisvoordeel, precies op het juiste moment geïntroduceerd.",
    dealerBullets: [
      "Een doordacht extraatje voor klanten die een nieuwe of tweedehands auto kopen",
      "Relevant voor kopers van EV's, campers en toercaravans",
      "Geen software, abonnementen of facturatie voor jouw team",
    ],
    dealerCta: "Bied AutoVere aan je klanten aan",
    whyTitle: "Waarom samenwerken met AutoVere?",
    why: [
      {
        icon: Gift,
        heading: "Een voordeel waar leden echt blij mee zijn",
        body: "Je leden krijgen iets waar ze voor elke reis daadwerkelijk naar grijpen: reële kosten voor tol, vignetten, brandstof en laden — nooit gokwerk.",
      },
      {
        icon: Zap,
        heading: "Simpel voor jou",
        body: "Wij regelen de techniek, de abonnementen en de ledenervaring. Niets om te bouwen, en geen facturatie om bij te houden.",
      },
      {
        icon: RouteIcon,
        heading: "Gemaakt voor mensen die reizen — en voor wie hen op weg helpt",
        body: "Clubs, verenigingen en dealers kunnen reizigers laten zien wat een reis écht gaat kosten — van tol en vignetten tot brandstof en EV-laden — ruim voordat ze thuis vertrekken.",
      },
    ],
    howTitle: "Zo werkt het",
    how: [
      {
        icon: Handshake,
        heading: "1. Wij zetten het voordeel voor je op",
        body: "Vertel ons iets over je organisatie, en wij regelen de partnerovereenkomst en de ledentoegang. Niets dat jij zelf hoeft in te stellen.",
      },
      {
        icon: Share2,
        heading: "2. Jij deelt het op jouw manier",
        body: "Je krijgt een ledenlink en -code. Deel ze in de nieuwsbrief, op je site of persoonlijk — precies zoals het jou het beste uitkomt.",
      },
      {
        icon: BadgePercent,
        heading: "3. Je leden genieten 25% korting op AutoVere Pro",
        body: "Het werkt vanaf dag één, en we staan klaar als iemand onderweg een vraag heeft.",
      },
    ],
    partnersTitle: "Onze organisatiepartners",
    partnersEmpty:
      "Partnerlogo's verschijnen hier zodra overeenkomsten zijn getekend. We zouden je graag bij de eersten rekenen.",
    trustTitle: "Veilig, transparant en nooit wederverkoop",
    trust: [
      "Elke tol- en vignetaankoop verloopt rechtstreeks via de officiële exploitant — wij zijn nooit wederverkoper en rekenen nooit iets extra's aan.",
      "Ledengegevens blijven privé; we delen ze nooit met derden voor marketingdoeleinden.",
      "Eén dienst die Europa, de VS en Canada dekt.",
      "Met zorg gemaakt door KM TECH LABS in Kristiansand, Noorwegen.",
    ],
    ctaTitle: "We horen graag van je",
    ctaHeading: "Word AutoVere-partner",
    ctaBody: "Registreer je organisatie rechtstreeks bij AutoVere — het kost maar een paar minuten, en vragen verplicht tot niets.",
    ctaButton: "Word AutoVere-partner",
    ctaFine:
      "Je deelt je organisatiegegevens, logo, land, contactinformatie en iets over het ledenvoordeel. Na goedkeuring mailen we je partnercode en partnerlink — en helpen we je graag om het aan je leden te presenteren.",
    talkBody:
      "Nog niet helemaal klaar om je aan te melden? Zeg gewoon hallo. We praten altijd graag over hoe AutoVere de mensen voor wie jij zorgt kan helpen.",
    talkButton: "Laten we praten",
    applyTitle: "Solliciteer als partner",
    applyBody:
      "Vertel ons over je organisatie en we nemen contact op. Na goedkeuring staan je ledencode en -link direct klaar — niets voor jou om in te stellen.",
    fields: {
      org: "Naam organisatie",
      orgPh: "bijv. European Touring Association",
      country: "Land",
      countryPh: "bijv. Nederland",
      site: "Officiële website",
      name: "Jouw naam",
      namePh: "Volledige naam",
      email: "Jouw e-mail",
      emailPh: "naam@organisatie.nl",
      members: "Vertel ons iets over je leden (optioneel)",
      membersPh: "Wie zijn je leden, en hoeveel ongeveer?",
      submit: "Aanvraag versturen",
      msgTitle: "Stuur ons een bericht",
      msgBody: "Heb je een vraag of iets ontdekt dat we kunnen verbeteren? Schrijf ons en we reageren zo snel mogelijk.",
      yourName: "Naam",
      subject: "Onderwerp",
      subjectPh: "Waar gaat het over?",
      message: "Bericht",
      messagePh: "Vertel ons wat je op je hart hebt …",
      send: "Bericht versturen",
    },
  },
  fr: {
    eyebrow: "Partenaires AutoVere",
    title: "Offrez à vos membres 25 % de réduction sur AutoVere Pro.",
    intro:
      "AutoVere offre aux clubs automobiles, associations de véhicules électriques, fédérations de camping-cars et caravanes, organisations touristiques et de voyage — ainsi qu'aux concessionnaires indépendants de véhicules neufs et d'occasion — un moyen simple de proposer à leurs membres et clients quelque chose qu'ils utiliseront vraiment : de vrais coûts de voyage avant le départ, plus 25 % de réduction sur AutoVere Pro.",
    lead: "Nous sommes fiers de collaborer avec des personnes qui aident les autres à voyager plus loin, plus intelligemment et avec moins de surprises.",
    howItLooks: "VOICI À QUOI ÇA RESSEMBLE",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Démonstration — exemple uniquement. Cette organisation est fictive.",
    heroAlt: "Voyageur consultant un itinéraire AutoVere et les coûts du trajet depuis une voiture garée",
    heroTagline: "Simplifions la planification pour les personnes qui comptent pour vous.",
    dealerEyebrow: "Pour les concessionnaires indépendants",
    dealerTitle: "Rendez chaque remise de véhicule un peu plus complète.",
    dealerBody:
      "Offrez à vos clients un compagnon de voyage pratique avec leur nouvelle voiture. AutoVere les aide à comprendre les péages, vignettes, frais de carburant ou de recharge avant leur premier long trajet — pendant que votre concession leur offre 25 % de réduction sur Pro.",
    dealerAlt: "Concessionnaire indépendant présentant AutoVere à un client lors de la remise du véhicule",
    dealerCaption: "Un avantage voyage utile, présenté au moment idéal.",
    dealerBullets: [
      "Une attention bien pensée pour les clients qui achètent une voiture neuve ou d'occasion",
      "Pertinent pour les acheteurs de véhicules électriques, camping-cars et véhicules de tourisme",
      "Aucun logiciel, abonnement ou facturation pour votre équipe",
    ],
    dealerCta: "Proposez AutoVere à vos clients",
    whyTitle: "Pourquoi s'associer à AutoVere ?",
    why: [
      {
        icon: Gift,
        heading: "Un avantage que vos membres apprécient vraiment",
        body: "Vos membres obtiennent quelque chose qu'ils utiliseront réellement avant chaque trajet : de vrais coûts de péage, vignette, carburant et recharge — jamais d'approximations.",
      },
      {
        icon: Zap,
        heading: "Simple de votre côté",
        body: "Nous nous occupons de la technologie, des abonnements et de l'expérience membre. Rien à construire, et aucune facturation à suivre.",
      },
      {
        icon: RouteIcon,
        heading: "Conçu pour les voyageurs — et pour ceux qui les aident à prendre la route",
        body: "Clubs, fédérations et concessionnaires peuvent montrer aux voyageurs ce qu'un trajet coûtera réellement — des péages et vignettes au carburant et à la recharge électrique — bien avant qu'ils ne quittent la maison.",
      },
    ],
    howTitle: "Comment ça marche",
    how: [
      {
        icon: Handshake,
        heading: "1. Nous mettons en place l'avantage pour vous",
        body: "Parlez-nous un peu de votre organisation, et nous nous chargeons de l'accord de partenariat et de l'accès membre. Rien à configurer de votre côté.",
      },
      {
        icon: Share2,
        heading: "2. Vous le partagez à votre façon",
        body: "Vous recevez un lien et un code membre. Partagez-les dans votre newsletter, sur votre site ou en personne — comme cela vous convient le mieux.",
      },
      {
        icon: BadgePercent,
        heading: "3. Vos membres profitent de 25 % de réduction sur AutoVere Pro",
        body: "Ça fonctionne dès le premier jour, et nous sommes là si quelqu'un a une question en cours de route.",
      },
    ],
    partnersTitle: "Nos partenaires organisationnels",
    partnersEmpty:
      "Les logos des partenaires apparaîtront ici au fur et à mesure des accords signés. Nous serions ravis de vous compter parmi les premiers.",
    trustTitle: "Sûr, transparent, et jamais revendeur",
    trust: [
      "Chaque achat de péage et de vignette se fait directement auprès de l'opérateur officiel — nous ne sommes jamais revendeur, et nous n'ajoutons jamais de marge.",
      "Les données des membres restent privées ; nous ne les partageons jamais avec des tiers à des fins marketing.",
      "Un seul service couvrant l'Europe, les États-Unis et le Canada.",
      "Conçu avec soin par KM TECH LABS à Kristiansand, en Norvège.",
    ],
    ctaTitle: "Nous serions ravis d'avoir de vos nouvelles",
    ctaHeading: "Devenez partenaire AutoVere",
    ctaBody: "Inscrivez votre organisation directement auprès d'AutoVere — cela ne prend que quelques minutes, et demander n'engage à rien.",
    ctaButton: "Devenez partenaire AutoVere",
    ctaFine:
      "Vous nous communiquez les informations de votre organisation, votre logo, votre pays, vos coordonnées et quelques mots sur l'avantage membre. Une fois approuvé, nous vous envoyons votre code et votre lien partenaire par e-mail — et nous serons heureux de vous aider à le présenter à vos membres.",
    talkBody:
      "Pas encore tout à fait prêt à vous inscrire ? Dites-nous simplement bonjour. Nous sommes toujours ravis de discuter de la façon dont AutoVere pourrait aider les personnes dont vous vous occupez.",
    talkButton: "Discutons",
    applyTitle: "Devenir partenaire",
    applyBody:
      "Parlez-nous de votre organisation et nous vous recontacterons. Une fois approuvés, votre code et lien membre sont prêts immédiatement — rien à configurer de votre côté.",
    fields: {
      org: "Nom de l'organisation",
      orgPh: "ex. European Touring Association",
      country: "Pays",
      countryPh: "ex. France",
      site: "Site officiel",
      name: "Votre nom",
      namePh: "Nom complet",
      email: "Votre e-mail",
      emailPh: "nom@organisation.fr",
      members: "Parlez-nous un peu de vos membres (facultatif)",
      membersPh: "Qui sont vos membres, et combien environ ?",
      submit: "Envoyer la demande",
      msgTitle: "Envoyez-nous un message",
      msgBody: "Une question, ou quelque chose que nous devrions améliorer ? Écrivez-nous, nous vous répondrons rapidement.",
      yourName: "Nom",
      subject: "Sujet",
      subjectPh: "De quoi s'agit-il ?",
      message: "Message",
      messagePh: "Dites-nous ce qui vous préoccupe …",
      send: "Envoyer le message",
    },
  },
  es: {
    eyebrow: "Socios de AutoVere",
    title: "Dale a tus socios un 25 % de descuento en AutoVere Pro.",
    intro:
      "AutoVere ofrece a clubes de automovilismo, asociaciones de vehículos eléctricos, federaciones de autocaravanas y caravanas, organizaciones de turismo y viajes — y a concesionarios independientes de coches nuevos y de segunda mano — una forma sencilla de ofrecer a sus socios y clientes algo que realmente van a usar: costes de viaje reales antes de salir, además de un 25 % de descuento en AutoVere Pro.",
    lead: "Nos enorgullece colaborar con personas que ayudan a otras a viajar más lejos, con más inteligencia y con menos sorpresas.",
    howItLooks: "ASÍ ES COMO SE VE",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Demostración — solo un ejemplo. Esta organización es ficticia.",
    heroAlt: "Viajero consultando una ruta de AutoVere y los costes del viaje desde un coche aparcado",
    heroTagline: "Hagamos que planificar sea más fácil para las personas que te importan.",
    dealerEyebrow: "Para concesionarios independientes",
    dealerTitle: "Haz que cada entrega de vehículo se sienta un poco más completa.",
    dealerBody:
      "Ofrece a tus clientes un compañero de viaje práctico junto con su coche nuevo. AutoVere les ayuda a entender los peajes, viñetas, y los costes de combustible o carga antes de su primer viaje largo — mientras tu concesionario les regala un 25 % de descuento en Pro.",
    dealerAlt: "Concesionario independiente presentando AutoVere a un cliente durante la entrega del vehículo",
    dealerCaption: "Una ventaja de viaje útil, presentada justo en el momento adecuado.",
    dealerBullets: [
      "Un detalle bien pensado para clientes de coches nuevos y de segunda mano",
      "Relevante para compradores de vehículos eléctricos, autocaravanas y turismo",
      "Sin software, suscripciones ni facturación para tu equipo",
    ],
    dealerCta: "Ofrece AutoVere a tus clientes",
    whyTitle: "¿Por qué asociarte con AutoVere?",
    why: [
      {
        icon: Gift,
        heading: "Una ventaja que tus socios agradecen de verdad",
        body: "Tus socios reciben algo a lo que recurrirán de verdad antes de cada viaje: costes reales de peajes, viñetas, combustible y carga — nunca conjeturas.",
      },
      {
        icon: Zap,
        heading: "Sencillo para ti",
        body: "Nosotros nos encargamos de la tecnología, las suscripciones y la experiencia de los socios. No tienes nada que construir, ni facturación que gestionar.",
      },
      {
        icon: RouteIcon,
        heading: "Pensado para quienes viajan — y para quienes les ayudan a ponerse en marcha",
        body: "Clubes, federaciones y concesionarios pueden mostrar a los viajeros lo que un trayecto realmente costará — de peajes y viñetas a combustible y recarga eléctrica — mucho antes de salir de casa.",
      },
    ],
    howTitle: "Así funciona",
    how: [
      {
        icon: Handshake,
        heading: "1. Configuramos la ventaja por ti",
        body: "Cuéntanos un poco sobre tu organización, y nosotros nos encargamos del acuerdo de colaboración y el acceso de los socios. No tienes que configurar nada.",
      },
      {
        icon: Share2,
        heading: "2. La compartes a tu manera",
        body: "Recibirás un enlace y un código de socio. Compártelos en tu boletín, en tu web o en persona — como mejor te venga.",
      },
      {
        icon: BadgePercent,
        heading: "3. Tus socios disfrutan de un 25 % de descuento en AutoVere Pro",
        body: "Funciona desde el primer día, y estamos aquí por si alguien tiene alguna duda en el camino.",
      },
    ],
    partnersTitle: "Nuestros socios organizativos",
    partnersEmpty:
      "Los logotipos de los socios aparecerán aquí a medida que se firmen los acuerdos. Nos encantaría contarte entre los primeros.",
    trustTitle: "Seguro, transparente y nunca revendedores",
    trust: [
      "Cada compra de peaje y viñeta se realiza directamente con el operador oficial — nunca somos revendedores, y nunca añadimos ningún recargo.",
      "Los datos de los socios permanecen privados; nunca los compartimos con terceros con fines de marketing.",
      "Un solo servicio que cubre Europa, Estados Unidos y Canadá.",
      "Creado con esmero por KM TECH LABS en Kristiansand, Noruega.",
    ],
    ctaTitle: "Nos encantaría saber de ti",
    ctaHeading: "Conviértete en socio de AutoVere",
    ctaBody: "Registra tu organización directamente con AutoVere — solo lleva unos minutos, y preguntar no te compromete a nada.",
    ctaButton: "Conviértete en socio de AutoVere",
    ctaFine:
      "Nos facilitas los datos de tu organización, logotipo, país, información de contacto y algunos detalles sobre la ventaja para socios. Una vez aprobado, te enviaremos por correo tu código y enlace de socio — y estaremos encantados de ayudarte a presentarlo a tus socios.",
    talkBody:
      "¿Aún no estás listo para registrarte? Simplemente salúdanos. Siempre nos encanta hablar de cómo AutoVere podría ayudar a las personas de las que te ocupas.",
    talkButton: "Hablemos",
    applyTitle: "Solicita ser socio",
    applyBody:
      "Cuéntanos sobre tu organización y te contactaremos. Una vez aprobado, tu código y enlace de socio estarán listos de inmediato — nada que configurar de tu parte.",
    fields: {
      org: "Nombre de la organización",
      orgPh: "p. ej. European Touring Association",
      country: "País",
      countryPh: "p. ej. España",
      site: "Sitio web oficial",
      name: "Tu nombre",
      namePh: "Nombre completo",
      email: "Tu correo electrónico",
      emailPh: "nombre@organizacion.es",
      members: "Cuéntanos un poco sobre tus socios (opcional)",
      membersPh: "¿Quiénes son tus socios, y aproximadamente cuántos sois?",
      submit: "Enviar solicitud",
      msgTitle: "Envíanos un mensaje",
      msgBody: "¿Tienes alguna pregunta o has detectado algo que deberíamos mejorar? Escríbenos y te responderemos lo antes posible.",
      yourName: "Nombre",
      subject: "Asunto",
      subjectPh: "¿De qué se trata?",
      message: "Mensaje",
      messagePh: "Cuéntanos qué tienes en mente …",
      send: "Enviar mensaje",
    },
  },
  it: {
    eyebrow: "Partner AutoVere",
    title: "Offri ai tuoi soci il 25% di sconto su AutoVere Pro.",
    intro:
      "AutoVere offre a club automobilistici, associazioni per veicoli elettrici, federazioni di camper e caravan, organizzazioni turistiche e di viaggio — e a concessionari indipendenti di auto nuove e usate — un modo semplice per offrire ai propri soci e clienti qualcosa che useranno davvero: costi di viaggio reali prima della partenza, più il 25% di sconto su AutoVere Pro.",
    lead: "Siamo orgogliosi di collaborare con persone che aiutano gli altri a viaggiare più lontano, in modo più intelligente e con meno sorprese.",
    howItLooks: "ECCO COME APPARE",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Dimostrazione — solo un esempio. Questa organizzazione è fittizia.",
    heroAlt: "Viaggiatore che consulta un percorso AutoVere e i costi del viaggio da un'auto parcheggiata",
    heroTagline: "Rendiamo più semplice la pianificazione per le persone a cui tieni.",
    dealerEyebrow: "Per i concessionari indipendenti",
    dealerTitle: "Rendi ogni consegna dell'auto un po' più completa.",
    dealerBody:
      "Offri ai clienti un pratico compagno di viaggio insieme alla loro nuova auto. AutoVere li aiuta a capire pedaggi, vignette e costi di carburante o ricarica prima del loro primo lungo viaggio — mentre la tua concessionaria offre loro il 25% di sconto su Pro.",
    dealerAlt: "Concessionario indipendente che presenta AutoVere a un cliente durante la consegna dell'auto",
    dealerCaption: "Un vantaggio di viaggio utile, presentato proprio al momento giusto.",
    dealerBullets: [
      "Un pensiero in più per i clienti che acquistano un'auto nuova o usata",
      "Utile per chi acquista veicoli elettrici, camper e mezzi da turismo",
      "Nessun software, abbonamento o fatturazione per il tuo team",
    ],
    dealerCta: "Offri AutoVere ai tuoi clienti",
    whyTitle: "Perché collaborare con AutoVere?",
    why: [
      {
        icon: Gift,
        heading: "Un vantaggio che i soci apprezzano davvero",
        body: "I tuoi soci ricevono qualcosa a cui ricorreranno davvero prima di ogni viaggio: costi reali di pedaggi, vignette, carburante e ricarica — mai supposizioni.",
      },
      {
        icon: Zap,
        heading: "Semplice per te",
        body: "Ci pensiamo noi alla tecnologia, agli abbonamenti e all'esperienza dei soci. Niente da costruire, e nessuna fatturazione da gestire.",
      },
      {
        icon: RouteIcon,
        heading: "Pensato per chi viaggia — e per chi li aiuta a mettersi in strada",
        body: "Club, federazioni e concessionari possono mostrare ai viaggiatori quanto costerà davvero un viaggio — da pedaggi e vignette a carburante e ricarica elettrica — molto prima che partano da casa.",
      },
    ],
    howTitle: "Come funziona",
    how: [
      {
        icon: Handshake,
        heading: "1. Impostiamo noi il vantaggio per te",
        body: "Raccontaci qualcosa della tua organizzazione, e ci occuperemo noi dell'accordo di partnership e dell'accesso per i soci. Niente da configurare da parte tua.",
      },
      {
        icon: Share2,
        heading: "2. Lo condividi a modo tuo",
        body: "Riceverai un link e un codice per i soci. Condividili nella newsletter, sul tuo sito o di persona — come preferisci.",
      },
      {
        icon: BadgePercent,
        heading: "3. I tuoi soci ottengono il 25% di sconto su AutoVere Pro",
        body: "Funziona fin dal primo giorno, e siamo qui nel caso qualcuno abbia una domanda lungo il percorso.",
      },
    ],
    partnersTitle: "I nostri partner organizzativi",
    partnersEmpty:
      "I loghi dei partner appariranno qui man mano che gli accordi vengono firmati. Ci piacerebbe averti tra i primi.",
    trustTitle: "Sicuro, trasparente e mai rivenditore",
    trust: [
      "Ogni acquisto di pedaggio e vignetta avviene direttamente presso il gestore ufficiale — non siamo mai rivenditori, e non aggiungiamo mai alcun sovrapprezzo.",
      "I dati dei soci restano privati; non li condividiamo mai con terze parti a scopo di marketing.",
      "Un unico servizio che copre Europa, Stati Uniti e Canada.",
      "Realizzato con cura da KM TECH LABS a Kristiansand, in Norvegia.",
    ],
    ctaTitle: "Ci piacerebbe sentirti",
    ctaHeading: "Diventa partner AutoVere",
    ctaBody: "Registra la tua organizzazione direttamente su AutoVere — bastano pochi minuti, e chiedere non ti impegna a nulla.",
    ctaButton: "Diventa partner AutoVere",
    ctaFine:
      "Ci fornisci i dati della tua organizzazione, il logo, il paese, le informazioni di contatto e qualche dettaglio sul vantaggio per i soci. Una volta approvato, ti invieremo via email il tuo codice e link partner — e saremo felici di aiutarti a presentarlo ai tuoi soci.",
    talkBody:
      "Non sei ancora del tutto pronto a registrarti? Dicci semplicemente ciao. Siamo sempre felici di parlare di come AutoVere potrebbe aiutare le persone di cui ti occupi.",
    talkButton: "Parliamone",
    applyTitle: "Candidati come partner",
    applyBody:
      "Raccontaci della tua organizzazione e ti ricontatteremo. Una volta approvato, il tuo codice e link per i soci saranno pronti subito — niente da configurare da parte tua.",
    fields: {
      org: "Nome dell'organizzazione",
      orgPh: "es. European Touring Association",
      country: "Paese",
      countryPh: "es. Italia",
      site: "Sito ufficiale",
      name: "Il tuo nome",
      namePh: "Nome completo",
      email: "La tua email",
      emailPh: "nome@organizzazione.it",
      members: "Raccontaci qualcosa dei tuoi soci (facoltativo)",
      membersPh: "Chi sono i tuoi soci, e all'incirca quanti sono?",
      submit: "Invia candidatura",
      msgTitle: "Inviaci un messaggio",
      msgBody: "Hai una domanda o hai notato qualcosa che dovremmo migliorare? Scrivici e ti risponderemo il prima possibile.",
      yourName: "Nome",
      subject: "Oggetto",
      subjectPh: "Di cosa si tratta?",
      message: "Messaggio",
      messagePh: "Raccontaci cosa hai in mente …",
      send: "Invia messaggio",
    },
  },
  pt: {
    eyebrow: "Parceiros AutoVere",
    title: "Dê aos seus membros 25% de desconto no AutoVere Pro.",
    intro:
      "A AutoVere oferece a clubes automóveis, associações de veículos elétricos, federações de autocaravanas e caravanas, organizações de turismo e viagens — e a concessionários independentes de automóveis novos e usados — uma forma simples de oferecer aos seus membros e clientes algo que vão realmente usar: custos de viagem reais antes de partirem, mais 25% de desconto no AutoVere Pro.",
    lead: "Orgulhamo-nos de colaborar com pessoas que ajudam outras a viajar mais longe, com mais inteligência e com menos surpresas.",
    howItLooks: "É ASSIM QUE FUNCIONA",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Demonstração — apenas um exemplo. Esta organização é fictícia.",
    heroAlt: "Viajante a consultar uma rota AutoVere e os custos da viagem a partir de um carro estacionado",
    heroTagline: "Vamos tornar o planeamento mais fácil para as pessoas que lhe são importantes.",
    dealerEyebrow: "Para concessionários independentes",
    dealerTitle: "Torne cada entrega de veículo um pouco mais completa.",
    dealerBody:
      "Ofereça aos clientes um companheiro de viagem prático junto com o carro novo. A AutoVere ajuda-os a compreender portagens, vinhetas e custos de combustível ou carregamento antes da primeira viagem longa — enquanto o seu stand lhes oferece 25% de desconto no Pro.",
    dealerAlt: "Concessionário independente a apresentar a AutoVere a um cliente durante a entrega do veículo",
    dealerCaption: "Uma vantagem de viagem útil, apresentada exatamente no momento certo.",
    dealerBullets: [
      "Um extra bem pensado para clientes de automóveis novos e usados",
      "Relevante para compradores de veículos elétricos, autocaravanas e turismo",
      "Sem software, subscrições ou faturação para a sua equipa",
    ],
    dealerCta: "Ofereça a AutoVere aos seus clientes",
    whyTitle: "Porquê ser parceiro da AutoVere?",
    why: [
      {
        icon: Gift,
        heading: "Uma vantagem que os membros realmente apreciam",
        body: "Os seus membros recebem algo a que recorrerão de facto antes de cada viagem: custos reais de portagens, vinhetas, combustível e carregamento — nunca suposições.",
      },
      {
        icon: Zap,
        heading: "Simples do seu lado",
        body: "Nós tratamos da tecnologia, das subscrições e da experiência dos membros. Nada para construir, e nenhuma faturação para gerir.",
      },
      {
        icon: RouteIcon,
        heading: "Feito para quem viaja — e para quem os ajuda a pôr-se a caminho",
        body: "Clubes, federações e concessionários podem mostrar aos viajantes quanto uma viagem vai realmente custar — de portagens e vinhetas a combustível e carregamento elétrico — muito antes de saírem de casa.",
      },
    ],
    howTitle: "Como funciona",
    how: [
      {
        icon: Handshake,
        heading: "1. Configuramos a vantagem por si",
        body: "Conte-nos um pouco sobre a sua organização, e nós tratamos do acordo de parceria e do acesso dos membros. Nada para configurar do seu lado.",
      },
      {
        icon: Share2,
        heading: "2. Partilhe-a à sua maneira",
        body: "Recebe um link e um código de membro. Partilhe-os na newsletter, no seu site ou pessoalmente — como lhe for mais conveniente.",
      },
      {
        icon: BadgePercent,
        heading: "3. Os seus membros usufruem de 25% de desconto no AutoVere Pro",
        body: "Funciona desde o primeiro dia, e estamos aqui caso alguém tenha alguma dúvida pelo caminho.",
      },
    ],
    partnersTitle: "Os nossos parceiros organizacionais",
    partnersEmpty:
      "Os logótipos dos parceiros vão aparecer aqui à medida que os acordos forem assinados. Gostaríamos muito de o ter entre os primeiros.",
    trustTitle: "Seguro, transparente e nunca revendedor",
    trust: [
      "Cada compra de portagem e vinheta é feita diretamente com o operador oficial — nunca somos revendedores, e nunca acrescentamos qualquer margem.",
      "Os dados dos membros permanecem privados; nunca os partilhamos com terceiros para fins de marketing.",
      "Um único serviço que cobre a Europa, os Estados Unidos e o Canadá.",
      "Feito com cuidado pela KM TECH LABS em Kristiansand, na Noruega.",
    ],
    ctaTitle: "Gostaríamos muito de o ouvir",
    ctaHeading: "Torne-se parceiro AutoVere",
    ctaBody: "Registe a sua organização diretamente na AutoVere — demora apenas alguns minutos, e perguntar não o compromete a nada.",
    ctaButton: "Torne-se parceiro AutoVere",
    ctaFine:
      "Envie-nos os dados da sua organização, logótipo, país, informações de contacto e um pouco sobre a vantagem para os membros. Após aprovação, enviamos o seu código e link de parceiro por email — e teremos todo o gosto em ajudá-lo a apresentá-lo aos seus membros.",
    talkBody:
      "Ainda não está totalmente pronto para se registar? Basta dizer olá. Temos sempre todo o gosto em conversar sobre como a AutoVere poderia ajudar as pessoas de quem cuida.",
    talkButton: "Vamos conversar",
    applyTitle: "Candidate-se a parceiro",
    applyBody:
      "Conte-nos sobre a sua organização e entraremos em contacto. Após aprovação, o seu código e link de membro ficam prontos de imediato — nada para configurar do seu lado.",
    fields: {
      org: "Nome da organização",
      orgPh: "ex.: European Touring Association",
      country: "País",
      countryPh: "ex.: Portugal",
      site: "Site oficial",
      name: "O seu nome",
      namePh: "Nome completo",
      email: "O seu email",
      emailPh: "nome@organizacao.pt",
      members: "Conte-nos um pouco sobre os seus membros (opcional)",
      membersPh: "Quem são os seus membros, e aproximadamente quantos são?",
      submit: "Enviar candidatura",
      msgTitle: "Envie-nos uma mensagem",
      msgBody: "Tem alguma dúvida ou reparou em algo que devêssemos melhorar? Escreva-nos e responderemos assim que possível.",
      yourName: "Nome",
      subject: "Assunto",
      subjectPh: "Do que se trata?",
      message: "Mensagem",
      messagePh: "Conte-nos o que tem em mente …",
      send: "Enviar mensagem",
    },
  },
  ja: {
    eyebrow: "AutoVereパートナー",
    title: "会員の皆様にAutoVere Proを25%オフでご提供ください。",
    intro:
      "AutoVereは、自動車クラブ、EV団体、キャンピングカー・キャラバン協会、旅行・観光団体様、そして独立系の新車・中古車ディーラー様に、会員様やお客様に本当に役立つものを提供できる、シンプルな方法をお届けします。出発前に分かる本当の旅費と、AutoVere Proの25%割引です。",
    lead: "私たちは、人々がより遠くへ、より賢く、そしてより少ないサプライズで旅ができるよう手助けする方々と協力できることを、誇りに思っています。",
    howItLooks: "こんなイメージです",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "デモンストレーション — あくまで一例です。この団体は架空のものです。",
    heroAlt: "駐車した車の中でAutoVereのルートと旅費を確認する旅行者",
    heroTagline: "大切な方々のために、旅の計画をもっと簡単にしましょう。",
    dealerEyebrow: "独立系ディーラー様向け",
    dealerTitle: "車両お引き渡しを、もう少し充実したものに。",
    dealerBody:
      "新しい車と一緒に、実用的な旅の相棒をお客様に提供しませんか。AutoVereは、最初の長距離ドライブの前に、通行料金やビニエット、燃料・充電コストを理解するお手伝いをします — 販売店様はお客様にPro 25%オフを提供するだけです。",
    dealerAlt: "車両引き渡し時に、お客様にAutoVereを紹介する独立系ディーラー",
    dealerCaption: "ちょうど良いタイミングでご紹介する、役立つ旅の特典です。",
    dealerBullets: [
      "新車・中古車のお客様への、気の利いたプラスアルファ",
      "EV・キャンピングカー・観光目的の購入者様に最適",
      "御社にソフトウェア・サブスクリプション・請求業務は一切発生しません",
    ],
    dealerCta: "お客様にAutoVereをご案内する",
    whyTitle: "AutoVereと提携する理由",
    why: [
      {
        icon: Gift,
        heading: "会員様が本当に喜ぶ特典",
        body: "会員様は、旅に出るたびに実際に頼りにするものを手に入れます。通行料金、ビニエット、燃料、充電の本当のコストです — 推測ではありません。",
      },
      {
        icon: Zap,
        heading: "御社の負担はありません",
        body: "技術面、サブスクリプション、会員体験はすべて私たちが担当します。構築するものはなく、管理する請求業務もありません。",
      },
      {
        icon: RouteIcon,
        heading: "旅する人、そして旅立ちを後押しする人のために",
        body: "クラブ、団体、そしてディーラー様も、旅行者が家を出る前から、通行料金やビニエットから燃料、EV充電まで、旅の本当の費用を示すことができます。",
      },
    ],
    howTitle: "ご利用の流れ",
    how: [
      {
        icon: Handshake,
        heading: "1. 私たちが特典をご用意します",
        body: "貴団体について少し教えてください。パートナー契約と会員アクセスの手配はこちらで行います。御社側で設定していただくことは何もありません。",
      },
      {
        icon: Share2,
        heading: "2. お好きな方法で共有していただけます",
        body: "会員用のリンクとコードをお渡しします。ニュースレターやウェブサイト、あるいは直接手渡しなど、貴団体に一番合った方法で共有してください。",
      },
      {
        icon: BadgePercent,
        heading: "3. 会員様はAutoVere Proを25%オフでご利用いただけます",
        body: "初日からすぐにご利用いただけ、途中でご不明な点があればいつでもサポートいたします。",
      },
    ],
    partnersTitle: "パートナー団体様",
    partnersEmpty:
      "契約が成立次第、パートナーロゴをこちらに掲載してまいります。ぜひ最初のパートナーの一社になっていただけると嬉しいです。",
    trustTitle: "安全・透明で、代理販売は一切なし",
    trust: [
      "通行料金・ビニエットのお支払いはすべて公式運営会社と直接行われます — AutoVereが代理販売することも、手数料を上乗せすることも一切ありません。",
      "会員データは非公開のまま保たれ、マーケティング目的で第三者と共有することは一切ありません。",
      "ヨーロッパ、アメリカ、カナダを1つのサービスでカバーしています。",
      "ノルウェー・クリスタンサンのKM TECH LABSが心を込めて開発しました。",
    ],
    ctaTitle: "ぜひお話をお聞かせください",
    ctaHeading: "AutoVereパートナーになる",
    ctaBody: "貴団体を直接AutoVereにご登録ください — 数分で完了し、お問い合わせだけでも何の負担もありません。",
    ctaButton: "AutoVereパートナーになる",
    ctaFine:
      "団体情報、ロゴ、国、連絡先、そして会員特典について少し教えてください。承認後、パートナーコードとパートナーリンクをメールでお送りします — 会員様へのご紹介もお手伝いいたします。",
    talkBody:
      "まだ登録するか迷っていらっしゃいますか？ まずはお気軽にご連絡ください。AutoVereが皆様の大切な方々にどのように役立てるか、いつでも喜んでお話しします。",
    talkButton: "お話ししましょう",
    applyTitle: "パートナーに応募する",
    applyBody:
      "貴団体について教えてください。こちらからご連絡いたします。承認後、会員コードとリンクはすぐにご用意できます — 設定していただくことは何もありません。",
    fields: {
      org: "団体名",
      orgPh: "例：European Touring Association",
      country: "国",
      countryPh: "例：日本",
      site: "公式ウェブサイト",
      name: "お名前",
      namePh: "フルネーム",
      email: "メールアドレス",
      emailPh: "name@organization.jp",
      members: "会員様について少し教えてください（任意）",
      membersPh: "どのような会員様が、およそ何名くらいいらっしゃいますか？",
      submit: "申し込みを送信",
      msgTitle: "メッセージを送る",
      msgBody: "ご質問や改善点のご提案があれば、ぜひお聞かせください。できるだけ早くお返事いたします。",
      yourName: "お名前",
      subject: "件名",
      subjectPh: "どのようなご用件でしょうか？",
      message: "メッセージ",
      messagePh: "お考えをお聞かせください…",
      send: "メッセージを送る",
    },
  },
  zh: {
    eyebrow: "AutoVere 合作伙伴",
    title: "为你的会员提供 AutoVere Pro 25% 会员折扣。",
    intro:
      "AutoVere 为汽车俱乐部、电动车协会、房车与拖挂式露营车联盟、旅游与出行组织——以及独立的新车和二手车经销商——提供了一种简单的方式，让他们的会员和客户获得真正实用的服务：出发前就能看到真实的旅行花费，外加 AutoVere Pro 25% 的会员折扣。",
    lead: "我们很自豪能与那些帮助他人走得更远、更聪明、少一些意外的人合作。",
    howItLooks: "效果是这样的",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "演示效果——仅作示例，该组织为虚构。",
    heroAlt: "旅行者坐在停靠的车内查看 AutoVere 路线和旅行花费",
    heroTagline: "让我们为你关心的人，把出行规划变得更简单。",
    dealerEyebrow: "面向独立经销商",
    dealerTitle: "让每一次交车都更加圆满。",
    dealerBody:
      "在交付新车的同时，为客户提供一位实用的旅行伙伴。AutoVere 帮助他们在第一次长途出行前就了解过路费、电子通行凭证以及燃油或充电成本——而你的经销商只需为他们提供 AutoVere Pro 25% 的折扣。",
    dealerAlt: "独立汽车经销商在交车时向客户介绍 AutoVere",
    dealerCaption: "恰到好处地介绍这项实用的出行福利。",
    dealerBullets: [
      "为购买新车或二手车的客户提供的贴心增值服务",
      "适用于电动车、房车及旅行车型的购买者",
      "你的团队无需搭建任何系统、订阅或处理账单",
    ],
    dealerCta: "向客户推荐 AutoVere",
    whyTitle: "为什么要与 AutoVere 合作？",
    why: [
      {
        icon: Gift,
        heading: "会员真正会感激的福利",
        body: "会员在每次出行前都会用到的东西：真实的过路费、电子通行凭证、燃油和充电成本——从不靠猜测。",
      },
      {
        icon: Zap,
        heading: "你这边完全省心",
        body: "技术、订阅和会员体验都由我们负责，你无需搭建任何系统，也无需处理任何账单。",
      },
      {
        icon: RouteIcon,
        heading: "为出行的人，也为帮助他们上路的人而生",
        body: "俱乐部、协会和经销商都可以让旅行者在出发前，就清楚了解一趟旅程的真实花费——从过路费、电子通行凭证到燃油和电动车充电。",
      },
    ],
    howTitle: "运作方式",
    how: [
      {
        icon: Handshake,
        heading: "1. 我们为你搭建好这项福利",
        body: "简单介绍一下你的组织，我们会负责合作协议和会员权限的开通，你这边无需任何设置。",
      },
      {
        icon: Share2,
        heading: "2. 你可以按自己的方式分享",
        body: "你将获得专属会员链接和优惠码，可以通过新闻通讯、官网或者当面分享——一切以你最方便的方式进行。",
      },
      {
        icon: BadgePercent,
        heading: "3. 会员即可享受 AutoVere Pro 25% 折扣",
        body: "从第一天起就能使用，如果有人在使用过程中有疑问，我们随时都在。",
      },
    ],
    partnersTitle: "我们的合作组织",
    partnersEmpty:
      "随着合作协议陆续签署，合作伙伴的标志将陆续显示在这里。我们很希望能有你的一席之地。",
    trustTitle: "安全、透明，绝不代收费用",
    trust: [
      "每一笔过路费和电子通行凭证的付款都直接在官方运营方完成——我们从不代为收费，也绝不加价。",
      "会员数据始终保密，我们从不会为营销目的与第三方共享。",
      "一项服务，覆盖欧洲、美国和加拿大。",
      "由挪威克里斯蒂安桑的 KM TECH LABS 用心打造。",
    ],
    ctaTitle: "我们很期待收到你的消息",
    ctaHeading: "成为 AutoVere 合作伙伴",
    ctaBody: "直接在 AutoVere 注册你的组织——只需几分钟，咨询也不会让你承担任何义务。",
    ctaButton: "成为 AutoVere 合作伙伴",
    ctaFine:
      "你需要提供组织信息、标志、所在国家、联系方式，以及关于会员福利的简单说明。审核通过后，我们会通过邮件发送你的合作伙伴优惠码和专属链接——也很乐意协助你将其介绍给会员。",
    talkBody:
      "还没准备好注册？先跟我们打个招呼吧。我们随时乐意聊聊 AutoVere 能如何帮助你所关心的人。",
    talkButton: "聊一聊",
    applyTitle: "申请成为合作伙伴",
    applyBody:
      "告诉我们关于你组织的信息，我们会与你联系。审核通过后，会员优惠码和链接会立即生效——你无需做任何设置。",
    fields: {
      org: "组织名称",
      orgPh: "例如：European Touring Association",
      country: "国家/地区",
      countryPh: "例如：中国",
      site: "官方网站",
      name: "你的姓名",
      namePh: "全名",
      email: "你的邮箱",
      emailPh: "name@organization.com",
      members: "简单介绍一下你的会员（选填）",
      membersPh: "你的会员是哪些人？大概有多少人？",
      submit: "提交申请",
      msgTitle: "给我们发消息",
      msgBody: "有问题，或者发现了我们可以改进的地方？欢迎告诉我们，我们会尽快回复。",
      yourName: "姓名",
      subject: "主题",
      subjectPh: "关于什么内容？",
      message: "留言内容",
      messagePh: "告诉我们你在想什么……",
      send: "发送消息",
    },
  },
} as const;

const TOASTS: Record<Lang, { sending: string; ok: string; fail: string }> = {
  no: {
    sending: "Sender …",
    ok: "Takk! Meldingen er sendt.",
    fail: "Kunne ikke sende akkurat nå. Prøv igjen om litt.",
  },
  en: {
    sending: "Sending …",
    ok: "Thank you! Your message has been sent.",
    fail: "We couldn't send that right now. Please try again shortly.",
  },
  pl: {
    sending: "Wysyłamy …",
    ok: "Dziękujemy! Wiadomość została wysłana.",
    fail: "Nie udało się wysłać w tej chwili. Spróbuj ponownie za moment.",
  },
  se: {
    sending: "Skickar …",
    ok: "Tack! Ditt meddelande har skickats.",
    fail: "Vi kunde inte skicka just nu. Försök igen om en liten stund.",
  },
  dk: {
    sending: "Sender …",
    ok: "Tak! Din besked er sendt.",
    fail: "Vi kunne ikke sende den lige nu. Prøv igen om lidt.",
  },
  fi: {
    sending: "Lähetetään …",
    ok: "Kiitos! Viestisi on lähetetty.",
    fail: "Emme voineet lähettää sitä juuri nyt. Yritä hetken kuluttua uudelleen.",
  },
  de: {
    sending: "Wird gesendet …",
    ok: "Danke! Ihre Nachricht wurde gesendet.",
    fail: "Das konnten wir gerade nicht senden. Bitte versuchen Sie es in Kürze erneut.",
  },
  nl: {
    sending: "Verzenden …",
    ok: "Bedankt! Je bericht is verzonden.",
    fail: "We konden dat nu niet verzenden. Probeer het straks opnieuw.",
  },
  fr: {
    sending: "Envoi en cours …",
    ok: "Merci ! Votre message a été envoyé.",
    fail: "Nous n'avons pas pu l'envoyer pour le moment. Merci de réessayer sous peu.",
  },
  es: {
    sending: "Enviando …",
    ok: "¡Gracias! Tu mensaje ha sido enviado.",
    fail: "No hemos podido enviarlo en este momento. Inténtalo de nuevo en unos instantes.",
  },
  it: {
    sending: "Invio in corso …",
    ok: "Grazie! Il tuo messaggio è stato inviato.",
    fail: "Non siamo riusciti a inviarlo in questo momento. Riprova tra poco.",
  },
  pt: {
    sending: "A enviar …",
    ok: "Obrigado! A sua mensagem foi enviada.",
    fail: "Não foi possível enviar neste momento. Tente novamente dentro de instantes.",
  },
  ja: {
    sending: "送信中…",
    ok: "ありがとうございます！メッセージを送信しました。",
    fail: "只今送信できませんでした。しばらくしてからもう一度お試しください。",
  },
  zh: {
    sending: "发送中…",
    ok: "谢谢！你的消息已发送。",
    fail: "暂时无法发送，请稍后再试。",
  },
};

export function PartnersPage({
  lang: langProp = "en",
  localized,
}: {
  lang?: string;
  localized?: { eyebrow?: string; title?: string; intro?: string } | undefined;
}) {
  const lang: Lang = langProp in COPY ? (langProp as Lang) : "en";
  const base = COPY[lang];
  const c = {
    ...base,
    eyebrow: localized?.eyebrow ?? base.eyebrow,
    title: localized?.title ?? base.title,
    intro: localized?.intro ?? base.intro,
  };
  const [applyOpen, setApplyOpen] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const t = TOASTS[lang];

  async function submit(form: HTMLFormElement, kind: "partner" | "message", close: () => void) {
    const f = new FormData(form);
    setSending(true);
    try {
      await sendContactMessage({
        data: {
          kind,
          name: String(f.get("name") ?? ""),
          email: String(f.get("email") ?? ""),
          subject: f.get("subject") ? String(f.get("subject")) : undefined,
          organisation: f.get("org") ? String(f.get("org")) : undefined,
          country: f.get("country") ? String(f.get("country")) : undefined,
          website: f.get("site") ? String(f.get("site")) : undefined,
          message: String(f.get("message") ?? f.get("members") ?? ""),
        },
      });
      toast.success(t.ok);
      form.reset();
      close();
    } catch {
      toast.error(t.fail);
    } finally {
      setSending(false);
    }
  }

  function submitApplication(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void submit(e.currentTarget, "partner", () => setApplyOpen(false));
  }

  function submitMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void submit(e.currentTarget, "message", () => setTalkOpen(false));
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative min-h-[780px] overflow-hidden border-b border-border sm:min-h-[720px]">
        <img
          src={travellerAutovereImage}
          alt={c.heroAlt}
          width={1536}
          height={1024}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-[58%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        <div className="relative mx-auto flex min-h-[780px] w-full max-w-5xl flex-col justify-center px-6 py-20 sm:min-h-[720px] sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{c.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {c.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{c.intro}</p>
          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-foreground/90">
            {c.lead}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => setApplyOpen(true)}>
              {c.ctaButton} <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setTalkOpen(true)}>
              <Mail className="size-4" /> {c.talkButton}
            </Button>
          </div>

          <p className="mt-4 text-sm italic text-muted-foreground">{c.heroTagline}</p>

          <p className="mt-12 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {c.howItLooks}
          </p>
          <div className="mt-3 max-w-xl rounded-2xl border border-border bg-gradient-to-br from-card/90 via-card/75 to-primary/[0.08] p-6 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
                Auto<span className="text-primary">Vere</span>
              </span>
              <span className="text-muted-foreground">×</span>
              <span className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-sm text-foreground/90">
                <Building2 className="size-4 text-primary" /> {c.demoOrg}
              </span>
              <span className="rounded-full bg-primary/15 px-3 py-1 text-[0.65rem] font-bold tracking-[0.16em] text-primary">
                {c.demoBadge}
              </span>
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-primary/20 bg-background/50 px-4 py-3">
              <BadgePercent className="size-5 shrink-0 text-primary" />
              <p className="text-sm font-medium text-foreground">
                25% off AutoVere Pro <span className="font-normal text-muted-foreground">— member benefit</span>
              </p>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{c.demoNote}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card/20">
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-6 py-16 sm:px-8 md:grid-cols-[1.08fr_0.92fr] md:items-center md:py-20">
          <figure className="relative overflow-hidden rounded-2xl border border-border bg-card">
            <img
              src={dealerHandoverImage}
              alt={c.dealerAlt}
              width={1536}
              height={1024}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent px-5 pb-5 pt-14 text-xs font-medium text-foreground/90">
              {c.dealerCaption}
            </figcaption>
          </figure>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{c.dealerEyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground">{c.dealerTitle}</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">{c.dealerBody}</p>
            <ul className="mt-6 space-y-3">
              {c.dealerBullets.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-7" onClick={() => setApplyOpen(true)}>
              {c.dealerCta} <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>


      {/* Why partner */}
      <div className="bg-gradient-to-b from-primary/[0.05] via-transparent to-transparent">
        <section className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-8">
          <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-foreground">
            <Sparkles className="size-5 text-primary" /> {c.whyTitle}
          </h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {c.why.map((item) => (
              <article
                key={item.heading}
                className="group rounded-2xl border border-border bg-card/50 p-6 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/80"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15">
                  <item.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold leading-snug text-foreground">{item.heading}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* How it works */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-20 pt-4 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{c.howTitle}</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {c.how.map((item, i) => (
            <article
              key={item.heading}
              className="relative rounded-2xl border border-border bg-gradient-to-b from-card/70 to-card/30 p-6 backdrop-blur"
            >
              <span className="absolute right-5 top-5 text-4xl font-semibold leading-none text-primary/15">
                {i + 1}
              </span>
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15">
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold leading-snug text-foreground">{item.heading}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-16 sm:px-8">
        <div className="rounded-3xl border border-border bg-card/50 p-8 backdrop-blur">
          <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-foreground">
            <ShieldCheck className="size-5 text-primary" /> {c.trustTitle}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {c.trust.map((line) => (
              <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Partner logos */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-16 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{c.partnersTitle}</h2>
        <div className="mt-6 rounded-3xl border border-dashed border-border bg-card/30 px-8 py-14 text-center">
          <Building2 className="mx-auto size-8 text-muted-foreground/60" />
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">{c.partnersEmpty}</p>
          <Button className="mt-6" variant="outline" onClick={() => setApplyOpen(true)}>
            {c.ctaButton} <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-24 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{c.ctaTitle}</h2>
        <div className="mt-6 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/12 via-card/60 to-card/30 p-8 backdrop-blur">
          <h3 className="text-xl font-semibold text-foreground">{c.ctaHeading}</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{c.ctaBody}</p>
          <Button size="lg" className="mt-6" onClick={() => setApplyOpen(true)}>
            {c.ctaButton} <ArrowRight className="size-4" />
          </Button>
          <p className="mt-5 max-w-2xl text-xs leading-relaxed text-muted-foreground">{c.ctaFine}</p>
        </div>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground">{c.talkBody}</p>
        <Button variant="secondary" className="mt-4" onClick={() => setTalkOpen(true)}>
          {c.talkButton}
        </Button>
      </section>

      {/* Apply modal */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-primary">
              AUTOVERE
            </p>
            <DialogTitle className="text-2xl">{c.applyTitle}</DialogTitle>
            <DialogDescription>{c.applyBody}</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitApplication}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="org">{c.fields.org}</Label>
                <Input id="org" name="org" required placeholder={c.fields.orgPh} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="country">{c.fields.country}</Label>
                <Input id="country" name="country" required placeholder={c.fields.countryPh} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="site">{c.fields.site}</Label>
              <Input id="site" name="site" type="url" placeholder="https://" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">{c.fields.name}</Label>
                <Input id="name" name="name" required placeholder={c.fields.namePh} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">{c.fields.email}</Label>
                <Input id="email" name="email" type="email" required placeholder={c.fields.emailPh} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="members">{c.fields.members}</Label>
              <Textarea id="members" name="members" rows={4} placeholder={c.fields.membersPh} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={sending}>
                <Send className="size-4" /> {sending ? t.sending : c.fields.submit}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contact modal */}
      <Dialog open={talkOpen} onOpenChange={setTalkOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-primary">
              AUTOVERE
            </p>
            <DialogTitle className="text-2xl">{c.fields.msgTitle}</DialogTitle>
            <DialogDescription>{c.fields.msgBody}</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitMessage}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="c-name">{c.fields.yourName}</Label>
                <Input id="c-name" name="name" required placeholder={c.fields.namePh} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-email">{c.fields.email}</Label>
                <Input id="c-email" name="email" type="email" required placeholder={c.fields.emailPh} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-subject">{c.fields.subject}</Label>
              <Input id="c-subject" name="subject" required placeholder={c.fields.subjectPh} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-message">{c.fields.message}</Label>
              <Textarea id="c-message" name="message" rows={5} required placeholder={c.fields.messagePh} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={sending}>
                <Send className="size-4" /> {sending ? t.sending : c.fields.send}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="border-t border-white/5 py-6 text-center">
        <a
          href="/partners/in-car"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/50 transition-colors hover:text-muted-foreground"
        >
          <Lock className="size-3" /> OEM &amp; In-Car Intelligence Portal
        </a>
      </div>
    </main>
  );
}
