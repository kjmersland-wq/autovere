import type { InfoPageContent } from "@/lib/info-content";

const DISCLAIMER = "Tylko orientacyjne szacunki — zawsze sprawdzaj na oficjalnych portalach.";

export const PL_HOW_IT_WORKS: InfoPageContent = {
  eyebrow: "Jak to działa",
  title: "Od luźnego pomysłu do w pełni wycenionej podróży samochodem w trzech spokojnych krokach.",
  intro:
    "AutoVere zamienia start i cel podróży w przejrzysty, transgraniczny obraz kosztów — opłaty drogowe, winiety, paliwo, ładowanie i promy — dla samochodów, kamperów i motocykli turystycznych.",
  sections: [
    {
      heading: "1 — Opowiedz nam o podróży",
      body: "Podaj miejsce startu i cel, wybierz typ pojazdu oraz rodzaj paliwa lub zasilania, a także preferencje trasy, takie jak malownicze objazdy, unikanie opłat drogowych czy uwzględnienie promów.",
      items: [
        "Profile dla samochodu, kampera/campervana i motocykla turystycznego",
        "Benzyna, diesel lub elektryczny z własnymi danymi o baku, baterii i zużyciu",
        "Znaczniki opłat drogowych, takie jak AutoPASS, Telepass, Bip&Go, SunPass czy E-ZPass",
      ],
    },
    {
      heading: "2 — Obliczamy rzeczywisty koszt każdego kilometra",
      body: "Każdy kraj i stan na trasie jest wyceniany osobno, zgodnie z jego własnym systemem opłat — elektronicznymi winietami, bramkami naliczającymi opłaty według odległości, obwodnicami miejskimi lub bezpłatnymi autostradami — a do tego dochodzą lokalne ceny paliwa i szybkiego ładowania.",
      items: [
        "Zestawienie opłat drogowych i winiet kraj po kraju, ze szczegółami dla każdego punktu poboru",
        "Zniżki motocyklowe tam, gdzie operatorzy oferują własne stawki",
        "Promy i przełęcze górskie pokazane jako osobne pozycje",
        "Inteligentna optymalizacja paliwa i ładowania z 75% buforem zasięgu",
      ],
    },
    {
      heading: "3 — Zabierz to w trasę",
      body: "Pobierz plik GPX do nawigacji, zapisz trasę w Mojej Garażu lub udostępnij ją współpodróżnym. Każda pozycja opłaty prowadzi do oficjalnego portalu, dzięki czemu możesz zapłacić, zanim przekroczysz granicę.",
      links: [
        { label: "ASFINAG (Austria)", url: "https://www.asfinag.at/" },
        { label: "AutoPASS (Norwegia)", url: "https://www.autopass.no/" },
        { label: "Telepass (Włochy)", url: "https://www.telepass.com/" },
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Jak działa AutoVere — Planowanie kosztów podróży transgranicznych",
    description:
      "Zobacz, jak AutoVere wylicza opłaty drogowe, winiety, paliwo, ładowanie i promy kraj po kraju dla samochodów, kamperów i motocykli turystycznych.",
  },
};

export const PL_PRICING: InfoPageContent = {
  eyebrow: "Cennik",
  title: "Planuj swobodnie. Ulepsz plan dopiero, gdy podróż stanie się ambitniejsza.",
  intro:
    "Codzienne planowanie podróży jest darmowe. Płatne plany są dla osób, które mieszkają w pojeździe przez tygodnie i chcą głębszego planowania trasy, eksportu offline oraz nieograniczonej liczby zapisanych przygód.",
  sections: [
    {
      heading: "Explorer — Za darmo",
      body: "Wszystko, czego potrzebujesz na weekendowy wyjazd lub podróż przez dwa kraje.",
      items: [
        "Nieograniczona liczba szacunków podróży w Europie, USA i Kanadzie",
        "Zestawienia opłat drogowych, winiet i promów według kraju i stanu",
        "Szacunki kosztów paliwa i ładowania z linkami do oficjalnych portali",
        "Do 3 zapisanych pojazdów i 5 zapisanych tras w Mojej Garażu",
      ],
    },
    {
      heading: "Voyager — 4,90 € / miesiąc",
      body: "Na długą letnią wyprawę, przejazd wzdłuż fiordów i podróż od wybrzeża do wybrzeża.",
      items: [
        "Nieograniczona liczba zapisanych pojazdów i przygód",
        "Eksport GPX z punktami opłat i ładowania",
        "Inteligentne wskazówki dotyczące cen paliwa i alerty na długich odcinkach",
        "Priorytetowe powiadomienia o zmianach cen opłat drogowych i winiet",
      ],
    },
    {
      heading: "Fleet & Partners — od 29 € / miesiąc",
      body: "Dla flot wynajmu, dealerów kamperów, klubów motocyklowych i organizatorów wycieczek.",
      items: [
        "Profile wielu pojazdów i wspólne trasy dla całego zespołu",
        "Karty tras z własną marką do przekazania klientom",
        "Dostęp do API z szacunkami kosztów (obecnie w prywatnym podglądzie)",
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Cennik — Darmowe planowanie podróży, opcjonalny plan Voyager | AutoVere",
    description:
      "AutoVere jest darmowe dla codziennego planowania podróży. Plany Voyager i Fleet dodają nieograniczoną liczbę zapisanych tras, eksport GPX i narzędzia partnerskie.",
  },
};

export const PL_FAQ: InfoPageContent = {
  eyebrow: "Najczęściej zadawane pytania",
  title: "Wszystko, o co pytają nas podróżni przed wyruszeniem w drogę.",
  intro:
    "Szczere odpowiedzi na temat tego, jak powstają nasze szacunki, skąd pochodzą dane i co nadal musisz kupić samodzielnie.",
  sections: [
    {
      heading: "Jak dokładne są szacunki kosztów?",
      body: "Opieramy się na publikowanych stawkach opłat drogowych, cenach winiet oraz średnich regionalnych cenach paliwa i ładowania. Rzeczywiste koszty zmieniają się wraz z rynkiem paliwowym, sezonowymi taryfami, porą dnia i klasą pojazdu — traktuj więc każdą liczbę jako dobrze uzasadnioną wskazówkę i potwierdzaj ją na oficjalnym portalu przed podróżą.",
    },
    {
      heading: "Czy sprzedajecie winiety lub opłaty drogowe?",
      body: "Nie. Świadomie nigdy ich nie odsprzedajemy. Każda pozycja opłaty prowadzi bezpośrednio do oficjalnego operatora — ASFINAG, via.admin.ch, AutoPASS, Telepass, 407 ETR, SunPass i innych — dzięki czemu zawsze płacisz rzeczywistą cenę, bez żadnej marży pośrednika.",
    },
    {
      heading: "Jak traktowane są motocykle?",
      body: "Motocykle turystyczne są wyceniane jako osobna klasa pojazdu. Tam, gdzie operatorzy oferują obniżone stawki motocyklowe, stosujemy orientacyjną zniżkę, norweskie obwodnice miejskie są pokazywane jako darmowe dla jednośladów, a Ty otrzymujesz dedykowany radar bezpieczeństwa i sprzętu na przełęcze górskie.",
    },
    {
      heading: "A co z kamperami i samochodami kempingowymi?",
      body: "Kampery są wyceniane według wagi i klasy osi tam, gdzie ma to zastosowanie, a my ostrzegamy o wysokości, długości i wadze przy tunelach, przełęczach górskich i niskich mostach na trasie.",
    },
    {
      heading: "Czy obsługujecie pojazdy elektryczne?",
      body: "Tak. Wybierz Elektryczny (EV) i podaj pojemność baterii oraz zużycie. Planujemy postoje na szybkie ładowanie z 75% buforem zasięgu i pokazujemy sieci, które napotkasz — Ionity, Fastned, Tesla Supercharger, Electrify America i FLO.",
    },
    {
      heading: "Czy potrzebuję konta?",
      body: "Nie. Możesz planować i eksportować trasy bez rejestracji. Moja Garaż zapisuje pojazdy i trasy lokalnie na Twoim urządzeniu, więc nic nie opuszcza przeglądarki, chyba że sam się tym podzielisz.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "FAQ — Opłaty drogowe, winiety, paliwo i ładowanie EV | AutoVere",
    description:
      "Odpowiedzi na temat dokładności szacunków, oficjalnych portali opłat, klas motocykli i kamperów, planowania ładowania EV oraz kont.",
  },
};

export const PL_PARTNERS: InfoPageContent = {
  eyebrow: "Partnerzy",
  title: "Współpracujemy z tymi, którzy utrzymują ruch na drogach.",
  intro:
    "AutoVere linkuje do oficjalnych operatorów opłat drogowych i współpracuje z branżą turystyczną, wynajmem oraz środowiskiem motocyklowym w Europie, USA i Kanadzie.",
  sections: [
    {
      heading: "Oficjalni operatorzy opłat drogowych i winiet, do których linkujemy",
      body: "Każdy zakup odbywa się na stronie samego operatora. Nigdy nie działamy jako pośrednik odsprzedaży.",
      links: [
        { label: "ASFINAG — Austria", url: "https://www.asfinag.at/" },
        { label: "via.admin.ch — Szwajcaria", url: "https://via.admin.ch/" },
        { label: "AutoPASS — Norwegia", url: "https://www.autopass.no/" },
        { label: "Telepass — Włochy", url: "https://www.telepass.com/" },
        { label: "DARS — Słowenia", url: "https://www.dars.si/" },
        { label: "407 ETR — Ontario", url: "https://www.407etr.com/" },
        { label: "SunPass — Floryda", url: "https://www.sunpass.com/" },
      ],
    },
    {
      heading: "Kto z nami współpracuje",
      items: [
        "Flotylle wynajmu kamperów i samochodów kempingowych chcące oferować przejrzyste wyceny podróży",
        "Organizatorzy wycieczek motocyklowych i kluby planujące trasy alpejskie i wzdłuż fiordów",
        "Sieci ładowania EV i aplikacje do planowania tras",
        "Organizacje turystyczne promujące malownicze przełęcze, drogi wybrzeża i przeprawy promowe",
      ],
    },
    {
      heading: "Współpracuj z nami",
      body: "KM TECH LABS ma siedzibę w Kristiansand w Norwegii. Jeśli prowadzisz flotę, firmę turystyczną lub usługę związaną z opłatami drogowymi i chcesz porozmawiać o integracji, współpracy marketingowej lub partnerstwie w zakresie danych, napisz do nas na partners@autovere.com.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Partnerzy — Oficjalni operatorzy opłat drogowych i partnerzy podróżni | AutoVere",
    description:
      "AutoVere linkuje bezpośrednio do oficjalnych operatorów opłat drogowych i winiet oraz współpracuje z flotami wynajmu, organizatorami wycieczek i sieciami ładowania.",
  },
};

export const PL_PRIVACY: InfoPageContent = {
  eyebrow: "Polityka prywatności",
  title: "Twoja trasa to Twoja sprawa.",
  intro:
    "AutoVere jest prowadzone przez KM TECH LABS z siedzibą w Kristiansand w Norwegii. Ograniczamy zbieranie danych do minimum potrzebnego do stworzenia dokładnego szacunku kosztów.",
  sections: [
    {
      heading: "Co przechowujemy",
      items: [
        "Dane podróży (start, cel, pojazd i preferencje) używane do stworzenia szacunku",
        "Zapisane pojazdy i trasy — przechowywane lokalnie w Twojej przeglądarce, a nie na naszych serwerach",
        "Zagregowane, niemożliwe do zidentyfikowania statystyki użytkowania służące do ulepszania planera",
      ],
    },
    {
      heading: "Czego nie robimy",
      items: [
        "Nigdy nie sprzedajemy ani nie wynajmujemy danych osobowych",
        "Nie śledzimy Twojej lokalizacji w czasie rzeczywistym",
        "Nie wymagamy konta, aby planować, eksportować lub udostępniać trasę",
      ],
    },
    {
      heading: "Twoje prawa wynikające z RODO",
      body: "Jako podmiot działający z Norwegii/EOG przestrzegamy RODO. Możesz zażądać dostępu, sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych lub wnieść sprzeciw wobec przetwarzania. Wyczyszczenie pamięci przeglądarki natychmiast usuwa zapisane pojazdy i trasy.",
    },
    {
      heading: "Pliki cookie i analityka",
      body: "Używamy niezbędnego przechowywania danych, aby zapamiętać Twój region, język i garaż. Cała analityka jest zagregowana i nie pozwala Cię zidentyfikować.",
    },
    {
      heading: "Kontakt",
      body: "Pytania dotyczące prywatności: privacy@autovere.com — KM TECH LABS, Kristiansand, Norwegia. Informacje regionalne: prywatność w USA jest opisana na /us/legal, a prawa wynikające z kanadyjskiej ustawy PIPEDA oraz quebeckiej Ustawy 25 na /ca/legal.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Prywatność — RODO, dane lokalne i Twoje dane | AutoVere",
    description:
      "Jak KM TECH LABS obchodzi się z danymi podróży, lokalnie przechowywanym garażem, plikami cookie oraz Twoimi prawami wynikającymi z RODO.",
  },
};

export const PL_TERMS: InfoPageContent = {
  eyebrow: "Warunki korzystania",
  title: "Jasne warunki, abyś mógł planować z pewnością.",
  intro:
    "Korzystając z AutoVere, akceptujesz niniejsze warunki. Istnieją one, aby uczciwie wyjaśnić, czym jest — a czym nie jest — szacunek kosztów.",
  sections: [
    {
      heading: "Szacunki, nie faktury",
      body: "Wszystkie pokazane koszty są orientacyjnymi szacunkami opartymi na publikowanych taryfach i średnich cenach regionalnych. Rzeczywiste opłaty drogowe, winiety, paliwo, ładowanie i bilety promowe mogą się różnić w zależności od klasy pojazdu, sezonu, pory dnia i zmian u operatorów. Zawsze potwierdzaj informacje na oficjalnym portalu przed podróżą.",
    },
    {
      heading: "Bezpieczne i zgodne z prawem korzystanie",
      items: [
        "Nie korzystaj z AutoVere podczas prowadzenia pojazdu — planuj przed wyruszeniem w drogę",
        "Przestrzegaj lokalnych przepisów ruchu drogowego, klas pojazdów oraz ograniczeń dotyczących tuneli i przełęczy górskich",
        "Zautomatyzowane pobieranie danych, odsprzedaż naszych treści lub przedstawianie ich jako oficjalnych cen jest niedozwolone",
      ],
    },
    {
      heading: "Linki i usługi stron trzecich",
      body: "Linki do operatorów opłat drogowych, firm promowych i sieci ładowania są udostępniane wyłącznie dla wygody. Usługi te mają własne warunki i ceny, a KM TECH LABS nie ponosi odpowiedzialności za ich treść ani transakcje.",
    },
    {
      heading: "Odpowiedzialność",
      body: "AutoVere jest dostarczane „takie, jakie jest”. W zakresie dozwolonym przez prawo, KM TECH LABS nie ponosi odpowiedzialności za koszty, opłaty, przegapione przeprawy ani straty wynikające z polegania na szacunku.",
    },
    {
      heading: "Prawo właściwe",
      body: "Niniejsze warunki podlegają prawu norweskiemu, z Kristiansand jako uzgodnionym miejscem rozstrzygania sporów, bez uszczerbku dla bezwzględnie obowiązujących praw konsumenta w kraju Twojego zamieszkania.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Warunki korzystania — Zastrzeżenie dotyczące szacunków i uczciwe użytkowanie | AutoVere",
    description:
      "Warunki korzystania AutoVere od KM TECH LABS: orientacyjne szacunki, bezpieczne korzystanie, linki stron trzecich, odpowiedzialność i prawo właściwe.",
  },
};
