/**
 * Polish translations for content that lives in data modules
 * (compliance, pass intel, corridor map, trip data).
 *
 * Keyed by the exact English source string so components can wrap any
 * data-driven label with `tr(...)` from `useTr()`.
 */
export const CONTENT_PL: Record<string, string> = {
  /* ---------------- Map layer: viewpoints ---------------- */
  "Scenic Viewpoints & Photo Stops": "Punkty widokowe i miejsca na zdjęcia",
  "Panorama rest area": "Miejsce postojowe z panoramą",
  "Lakeside viewpoint": "Punkt widokowy nad jeziorem",
  "Alpine summit overlook": "Widok ze szczytu alpejskiego",
  "Coastal cliff lookout": "Punkt widokowy na klifie",
  "Valley overlook · picnic tables · photo spot":
    "Widok na dolinę · stoły piknikowe · miejsce na zdjęcia",
  "Free parking · short walk to the shoreline":
    "Bezpłatny parking · krótki spacer nad brzeg",
  "Glacier panorama · café · restrooms": "Panorama lodowca · kawiarnia · toalety",
  "Sunset viewpoint · motorhome-friendly parking":
    "Widok na zachód słońca · parking przyjazny kamperom",
  /* ---------------- Compliance: heavy motorhome systems ---------------- */
  Austria: "Austria",
  Switzerland: "Szwajcaria",
  Slovenia: "Słowenia",
  Germany: "Niemcy",
  France: "Francja",
  Italy: "Włochy",
  Norway: "Norwegia",
  Sweden: "Szwecja",
  Denmark: "Dania",
  Spain: "Hiszpania",
  Portugal: "Portugalia",
  Netherlands: "Holandia",
  Belgium: "Belgia",
  "United Kingdom": "Wielka Brytania",
  "Belgium & Netherlands": "Belgia i Holandia",
  Ferries: "Promy",

  "GO-Box (ASFINAG)": "GO-Box (ASFINAG)",
  "Motorhomes over 3.5 t maximum permissible weight may not use the car vignette. You need a GO-Box on-board unit, charged per kilometre by axle count and EURO class. Pick one up at a GO point near the border before your first motorway kilometre.":
    "Kampery o dopuszczalnej masie całkowitej powyżej 3,5 t nie mogą korzystać z winiety osobowej. Potrzebujesz urządzenia pokładowego GO-Box, naliczającego opłatę za kilometr według liczby osi i klasy EURO. Odbierz je w punkcie GO przy granicy, zanim wjedziesz na autostradę.",
  "LSVA / PSVA heavy vehicle charge": "Opłata dla pojazdów ciężkich LSVA / PSVA",
  "Above 3.5 t the Swiss motorway vignette no longer covers you. Foreign motorhomes normally pay the flat-rate PSVA (per-day or per-year) declared at the border customs post; ID-based LSVA applies to commercial units.":
    "Powyżej 3,5 t szwajcarska winieta autostradowa już cię nie obejmuje. Zagraniczne kampery zazwyczaj płacą ryczałtową opłatę PSVA (dzienną lub roczną) deklarowaną na granicznym posterunku celnym; LSVA oparta na identyfikatorze dotyczy pojazdów komercyjnych.",
  "DarsGo unit": "Urządzenie DarsGo",
  "Slovenian motorways charge vehicles over 3.5 t through a DarsGo on-board unit with free-flow gantries. Register online or at a DarsGo service point; the e-vignette is invalid for your weight class.":
    "Słoweńskie autostrady pobierają opłaty od pojazdów powyżej 3,5 t za pomocą urządzenia pokładowego DarsGo i bramownic bezobsługowych. Zarejestruj się online lub w punkcie obsługi DarsGo; e-winieta nie jest ważna dla twojej klasy wagowej.",
  "No toll for private motorhomes": "Brak opłat dla prywatnych kamperów",
  "Privately used motorhomes are exempt from the German Lkw-Maut regardless of weight, but weight-based speed limits and overtaking bans still apply.":
    "Kampery używane prywatnie są zwolnione z niemieckiej Lkw-Maut niezależnie od wagi, ale nadal obowiązują ograniczenia prędkości i zakazy wyprzedzania zależne od masy.",

  /* ---------------- Compliance: clearance advisories ---------------- */
  "Alpine underpasses & village arches": "Alpejskie przejazdy podziemne i bramy wjazdowe do miasteczek",
  "Several Alpine valley roads (Susa, Vinschgau, Maurienne) and old town gateways drop below 3.2 m. Trust posted signs over your navigation app and follow the signed HGV/camper diversion where offered.":
    "Kilka alpejskich dróg dolinowych (Susa, Vinschgau, Maurienne) oraz bramy starówek mają prześwit poniżej 3,2 m. Ufaj oznakowaniu bardziej niż aplikacji nawigacyjnej i podążaj wyznaczonym objazdem dla pojazdów ciężarowych/kamperów, gdy taki jest dostępny.",
  "Tunnel height & LPG restrictions": "Ograniczenia wysokości i LPG w tunelach",
  "Mont Blanc, Fréjus and Gotthard road tunnels apply strict height, length and LPG-cylinder rules. Vehicles above 4.0 m are routed to dedicated lanes and may face convoy timing.":
    "Tunele Mont Blanc, Fréjus i Gotthard mają surowe zasady dotyczące wysokości, długości i butli LPG. Pojazdy powyżej 4,0 m są kierowane na wydzielone pasy i mogą czekać na przejazd w konwoju.",
  "Ferry deck clearance": "Prześwit na pokładzie promowym",
  "Book ferries in the correct height and length bracket. Under-declaring your height means a re-fare at the ramp or refused boarding.":
    "Rezerwuj promy w odpowiedniej kategorii wysokości i długości. Zaniżenie wysokości oznacza dopłatę na rampie albo odmowę wejścia na pokład.",
  "Roof box, aerials & solar": "Boks dachowy, anteny i panele solarne",
  "Measure to the highest fixed point — solar panels, satellite domes and roof boxes typically add 15–25 cm over the plate height.":
    "Mierz do najwyższego stałego punktu — panele solarne, anteny satelitarne i boksy dachowe zwykle dodają 15–25 cm do wysokości z dowodu rejestracyjnego.",

  /* ---------------- Compliance: speed rules ---------------- */
  "100 km/h (over 3.5 t)": "100 km/h (powyżej 3,5 t)",
  "110 km/h (over 3.5 t)": "110 km/h (powyżej 3,5 t)",
  "80 km/h with caravan/heavy load": "80 km/h z przyczepą/ciężkim ładunkiem",
  "Above 3.5 t you are capped at 100 km/h on the Autobahn and 80 km/h on rural roads, and overtaking bans for heavy vehicles apply to you.":
    "Powyżej 3,5 t obowiązuje limit 100 km/h na autostradzie i 80 km/h na drogach lokalnych, a zakazy wyprzedzania dla pojazdów ciężkich dotyczą też ciebie.",
  "Over 3.5 t: 110 km/h motorway, 100 km/h dual carriageway, 80 km/h single carriageway. Keep 50 m from the vehicle ahead.":
    "Powyżej 3,5 t: 110 km/h na autostradzie, 100 km/h na drodze dwujezdniowej, 80 km/h na jednojezdniowej. Zachowaj 50 m odstępu od poprzedzającego pojazdu.",
  "100 km/h motorway and 80 km/h on main roads; the left-most lane of three is closed to vehicles over 3.5 t.":
    "100 km/h na autostradzie i 80 km/h na drogach głównych; skrajny lewy pas z trzech jest zamknięty dla pojazdów powyżej 3,5 t.",
  "Motorhomes over 3.5 t are limited to 80 km/h; many fjord roads sign 60 km/h with passing places only.":
    "Kampery powyżej 3,5 t są ograniczone do 80 km/h; wiele dróg fiordowych ma znak 60 km/h z tylko mijankami.",
  "Heavy motorhomes are limited to 100 km/h and must use the lorry lane in tunnels with lane separation.":
    "Ciężkie kampery są ograniczone do 100 km/h i muszą korzystać z pasa dla ciężarówek w tunelach z rozdziałem pasów.",

  /* ---------------- Compliance: LEZ ---------------- */
  "Crit'Air vignette": "Winieta Crit'Air",
  "A Crit'Air sticker must be displayed inside the windscreen in every French ZFE. Classes are based on EURO standard and fuel; motorhomes are classed like the base vehicle.":
    "Naklejka Crit'Air musi być widoczna za szybą we wszystkich francuskich strefach ZFE. Klasy są oparte na normie EURO i rodzaju paliwa; kampery są klasyfikowane jak pojazd bazowy.",
  "€3.81 incl. postage": "3,81 € wraz z przesyłką",
  "Order 3–4 weeks ahead for delivery abroad": "Zamów 3–4 tygodnie wcześniej przy dostawie za granicę",
  "Required for motorcycles and scooters too.": "Wymagana także dla motocykli i skuterów.",
  "Umweltplakette (green zone 4)": "Umweltplakette (strefa zielona 4)",
  "A green sticker (Schadstoffgruppe 4) is required in ~50 Umweltzonen. Enforcement is by camera and patrol; a missing badge is a €100 fine.":
    "Zielona naklejka (Schadstoffgruppe 4) jest wymagana w ok. 50 strefach Umweltzonen. Kontrola odbywa się kamerami i patrolami; brak naklejki to mandat 100 €.",
  "€6–€30 depending on issuer": "6–30 € w zależności od wystawcy",
  "Order 2 weeks ahead or buy at a TÜV/DEKRA station on arrival":
    "Zamów 2 tygodnie wcześniej albo kup na miejscu w stacji TÜV/DEKRA",
  "Motorcycles are exempt from German Umweltzonen.": "Motocykle są zwolnione z niemieckich Umweltzonen.",
  "LEZ online registration": "Rejestracja LEZ przez internet",
  "No sticker — foreign plates must be registered online before the first entry into Brussels, Antwerp, Ghent, Rotterdam or Amsterdam. Cameras match plates automatically.":
    "Brak naklejki — zagraniczne tablice trzeba zarejestrować online przed pierwszym wjazdem do Brukseli, Antwerpii, Gandawy, Rotterdamu lub Amsterdamu. Kamery automatycznie rozpoznają tablice.",
  "Free registration; fines from €150": "Bezpłatna rejestracja; mandaty od 150 €",
  "Register at least 24 hours before entry": "Zarejestruj się co najmniej 24 godziny przed wjazdem",
  "Motorcycles are currently outside the Belgian and Dutch LEZ scope.":
    "Motocykle są obecnie poza zakresem belgijskich i niderlandzkich stref LEZ.",
  "ULEZ + Congestion Charge": "ULEZ + opłata za korki (Congestion Charge)",
  "Greater London's ULEZ charges non-compliant vehicles £12.50/day, plus £15 Congestion Charge in the central zone on weekdays. Pay online or by Auto Pay.":
    "Strefa ULEZ w Wielkim Londynie pobiera £12,50 dziennie od pojazdów niespełniających norm, plus £15 opłaty za korki w strefie centralnej w dni robocze. Zapłać online lub przez Auto Pay.",
  "£12.50/day ULEZ · £15/day Congestion Charge": "£12,50/dzień ULEZ · £15/dzień opłata za korki",
  "Pay up to 3 days after travel": "Można zapłacić do 3 dni po przejeździe",
  "Pre-Euro 3 motorcycles pay ULEZ; Congestion Charge does not apply to motorcycles.":
    "Motocykle sprzed normy Euro 3 płacą ULEZ; opłata za korki ich nie dotyczy.",

  /* ---------------- Compliance: toll tags ---------------- */
  "Norway, Sweden, Denmark — city rings, bridges, Øresund & Storebælt":
    "Norwegia, Szwecja, Dania — ringi miejskie, mosty, Øresund i Storebælt",
  "Free-flow gantries, no barrier stop": "Bramownice bezobsługowe, bez zatrzymywania się przy szlabanie",
  "France, Spain, Portugal, Italy — barrier motorways":
    "Francja, Hiszpania, Portugalia, Włochy — autostrady z bramkami",
  "Yellow 'T' / télépéage lanes, barrier lifts automatically":
    "Żółte pasy „T” / télépéage, szlaban podnosi się automatycznie",
  "US turnpikes, express lanes and bridges": "Amerykańskie autostrady płatne, pasy ekspresowe i mosty",
  "Open-road tolling gantries, no cash booth": "Bramownice poboru opłat w ruchu, bez kasy gotówkowej",
  "Ontario Highway 407 ETR and 412/418": "Highway 407 ETR i 412/418 w Ontario",
  "Transponder rate instead of camera video-toll charge":
    "Stawka z transpondera zamiast opłaty naliczanej przez kamerę",

  /* ---------------- Corridor map ---------------- */
  "EV Fast Chargers": "Szybkie ładowarki dla EV",
  "Fuel Stations": "Stacje paliw",
  "RV Campgrounds & Service Areas": "Kempingi dla kamperów i strefy serwisowe",
  "Mountain Passes": "Przełęcze górskie",
  "Ferry Terminals": "Terminale promowe",
  "Live Government Fuel Data (prix-carburants)": "Aktualne dane rządowe o paliwach (prix-carburants)",
  "Station prices published by the French Ministry of Economy open data feed.":
    "Ceny na stacjach publikowane w otwartych danych francuskiego Ministerstwa Gospodarki.",
  "Live E-Control Spritpreisrechner": "Aktualny kalkulator cen paliw E-Control",
  "Austrian regulator E-Control publishes station-level prices, updated through the day.":
    "Austriacki regulator E-Control publikuje ceny na poszczególnych stacjach, aktualizowane w ciągu dnia.",
  "National Average Benchmark (EAFO / EU Bulletin)": "Krajowa średnia referencyjna (EAFO / Biuletyn UE)",
  "Indicative national averages from EAFO and the EU Weekly Oil Bulletin.":
    "Orientacyjne średnie krajowe z EAFO i cotygodniowego Biuletynu Naftowego UE.",
  "per gallon": "za galon",
  "per litre": "za litr",
  "24/7 · restrooms · café": "Całodobowo · toalety · kawiarnia",
  "Dump station · fresh water · overnight pitches": "Stacja zlewna · świeża woda · miejsca na nocleg",
  "Ferry terminal · check-in 30 min before departure": "Terminal promowy · odprawa 30 min przed odjazdem",
  "24/7": "Całodobowo",
  "HGV/RV lanes": "Pasy dla pojazdów ciężarowych/kamperów",
  "Café": "Kawiarnia",
  AdBlue: "AdBlue",
  "Car wash": "Myjnia samochodowa",
  Europe: "Europa",
  "United States": "Stany Zjednoczone",
  Canada: "Kanada",

  /* Camp spots */
  "Aire de camping-car municipale": "Gminny postój dla kamperów (aire)",
  "Aire · France": "Aire · Francja",
  "Stellplatz am Fluss": "Stellplatz nad rzeką",
  "Stellplatz · Germany/Austria": "Stellplatz · Niemcy/Austria",
  "Camping Alpenblick": "Camping Alpenblick",
  "Rated campsite · Alps": "Oceniany kemping · Alpy",
  "Bobilparkering Fjordsyn": "Bobilparkering Fjordsyn",
  "Bobil pitch · Norway": "Miejsce dla kampera · Norwegia",
  "Sosta camper Lago": "Sosta camper Lago",
  "Sosta · Italy": "Sosta · Włochy",
  "KOA Holiday Resort": "KOA Holiday Resort",
  "Full hook-up RV park": "Park kamperowy z pełnym podłączeniem",
  "State Park Campground": "Kemping w parku stanowym",
  "Public campground": "Ogólnodostępny kemping",
  "Interstate Travel Plaza": "Interstate Travel Plaza",
  "Overnight service area": "Strefa serwisowa na nocleg",
  "Lakeside RV Resort": "Lakeside RV Resort",
  "Premium RV resort": "Ekskluzywny park kamperowy",
  "Provincial Park Campground": "Kemping w parku prowincjonalnym",
  "Halte routière VR": "Halte routière VR",
  "Roadside VR halt": "Przydrożny postój dla kamperów",
  "KOA Campground": "KOA Campground",
  "Mountain View RV Park": "Mountain View RV Park",
  "Rated RV park": "Oceniany park kamperowy",
  "Dump station": "Stacja zlewna",
  "Fresh water": "Świeża woda",
  "Electric hook-up": "Podłączenie elektryczne",
  "Overnight pitches": "Miejsca na nocleg",
  "Grey water": "Szarą wodę",
  WiFi: "Wi-Fi",
  Showers: "Prysznice",
  Laundry: "Pralnia",
  Restaurant: "Restauracja",
  "Fjord view": "Widok na fiord",
  Toilets: "Toalety",
  Shade: "Cień",
  "Walk to town": "Spacer do centrum",
  "50-amp": "50 A",
  "30/50-amp": "30/50 A",
  Sewer: "Kanalizacja",
  Pool: "Basen",
  "Potable water": "Woda pitna",
  Trails: "Szlaki",
  "RV dump": "Zlew dla kamperów",
  Propane: "Propan",
  "24/7 fuel": "Całodobowe paliwo",
  Firewood: "Drewno na opał",
  "Full hook-up": "Pełne podłączenie",
  "Overnight parking": "Parking na nocleg",

  /* ---------------- Mountain passes ---------------- */
  "Grossglockner High Alpine Road": "Grossglockner Hochalpenstrasse",
  "🇦🇹 Austria · Salzburg ↔ Carinthia": "🇦🇹 Austria · Salzburg ↔ Karyntia",
  "2 504 m · Hochtor summit": "2504 m · szczyt Hochtor",
  "Early May – late October (gates close nightly)":
    "Wczesny maj – koniec października (bramy zamykane na noc)",
  "€40.00 car day ticket · €30.00 motorcycle · motorhomes €40.00 (over 3.5 t on request)":
    "40,00 € bilet dzienny dla samochodu · 30,00 € motocykl · kamper 40,00 € (powyżej 3,5 t na zapytanie)",
  "Toll road, not part of the Austrian vignette network. Gates open ~05:30–06:00 and close 19:30–21:30 depending on the month — plan to be through before dusk and enjoy the Edelweissspitze detour.":
    "Droga płatna, niebędąca częścią austriackiego systemu winiet. Bramy otwierają się ok. 05:30–06:00, a zamykają 19:30–21:30 w zależności od miesiąca — zaplanuj przejazd przed zmierzchem i skorzystaj z objazdu na Edelweissspitze.",
  "Riders get a reduced ticket and a dedicated Bikers Point at Fuschertörl.":
    "Motocykliści otrzymują bilet ulgowy oraz dedykowany Bikers Point przy Fuschertörl.",
  "Passo dello Stelvio (Stelvio Pass)": "Passo dello Stelvio (przełęcz Stelvio)",
  "🇮🇹 Italy · Bormio ↔ Trafoi, South Tyrol": "🇮🇹 Włochy · Bormio ↔ Trafoi, Południowy Tyrol",
  "2 758 m · 48 numbered hairpins on the north ramp":
    "2758 m · 48 ponumerowanych zakrętów po stronie północnej",
  "Usually late May/June – early November, snow dependent":
    "Zwykle koniec maja/czerwiec – początek listopada, zależnie od śniegu",
  "Free of charge": "Bezpłatnie",
  "Europe's most photogenic hairpin ladder. Ride or drive it early — coaches and cyclists fill the switchbacks from 10:00. Expect 8–12 °C colder at the summit than in Bormio.":
    "Najbardziej fotogeniczna drabina zakrętów w Europie. Jedź wcześnie — autokary i rowerzyści zapełniają serpentyny od godz. 10:00. Na szczycie spodziewaj się temperatur o 8–12 °C niższych niż w Bormio.",
  "Tight, off-camber hairpins: stay wide on entry and watch for gravel after rain.":
    "Ciasne zakręty z przechyłem w złą stronę: wjeżdżaj szeroko i uważaj na żwir po deszczu.",
  "Furka & Grimsel Passes": "Przełęcze Furka i Grimsel",
  "🇨🇭 Switzerland · Valais ↔ Uri ↔ Bern": "🇨🇭 Szwajcaria · Valais ↔ Uri ↔ Berno",
  "Furka 2 429 m · Grimsel 2 164 m": "Furka 2429 m · Grimsel 2164 m",
  "Roughly mid-June – late October": "Mniej więcej połowa czerwca – koniec października",
  "Free passes · CHF 40 motorway vignette still required for Swiss motorways":
    "Bezpłatne przełęcze · nadal wymagana winieta autostradowa CHF 40 na szwajcarskich autostradach",
  "Check the live pass board before committing — snow chains can be mandated at short notice even in summer. The Furka–Grimsel–Susten triangle is a perfect full-day loop.":
    "Sprawdź aktualny status przełęczy, zanim wyruszysz — łańcuchy śniegowe mogą być wymagane z krótkim wyprzedzeniem nawet latem. Trójkąt Furka–Grimsel–Susten to idealna całodniowa pętla.",
  "Cool mornings at altitude: pack a thermal layer and waterproofs.":
    "Chłodne poranki na wysokości: zabierz warstwę termiczną i odzież przeciwdeszczową.",
  "Trollstigen & Sognefjellet": "Trollstigen i Sognefjellet",
  "🇳🇴 Norway · Møre og Romsdal · Jotunheimen": "🇳🇴 Norwegia · Møre og Romsdal · Jotunheimen",
  "Trollstigen 858 m · Sognefjellet 1 434 m (highest road in Northern Europe)":
    "Trollstigen 858 m · Sognefjellet 1434 m (najwyższa droga w Europie Północnej)",
  "Trollstigen late May – October · Sognefjellet May – November":
    "Trollstigen koniec maja – październik · Sognefjellet maj – listopad",
  "Free roads · parking fee at the Trollstigen viewpoint":
    "Bezpłatne drogi · opłata za parking przy punkcie widokowym Trollstigen",
  "Both are National Tourist Routes with hairpins and narrow shoulders. Trollstigen has periodic rockfall closures — check the live status the morning you travel. Vehicles over 12.4 m are not permitted on Trollstigen.":
    "Obie to Narodowe Trasy Turystyczne z ostrymi zakrętami i wąskimi poboczami. Trollstigen bywa okresowo zamykany z powodu obrywów skalnych — sprawdź aktualny status rano w dniu wyjazdu. Pojazdy powyżej 12,4 m nie mogą wjeżdżać na Trollstigen.",
  "Wet granite and painted lines get slick in fjord drizzle — brake early into the hairpins.":
    "Mokry granit i malowane linie robią się śliskie przy mżawce fiordowej — hamuj wcześnie przed zakrętami.",
  "Icefields Parkway (Highway 93N)": "Icefields Parkway (Highway 93N)",
  "🇨🇦 Alberta · Lake Louise ↔ Jasper": "🇨🇦 Alberta · Lake Louise ↔ Jasper",
  "2 088 m · Bow Summit": "2088 m · Bow Summit",
  "Open year-round, with winter storm closures": "Otwarta cały rok, z zamknięciami podczas zimowych burz",
  "Parks Canada pass required: C$11.00 adult/day or C$75.25 Discovery Pass (annual, per vehicle)":
    "Wymagany bilet Parks Canada: 11,00 CAD za dorosłego/dzień lub 75,25 CAD Discovery Pass (roczny, na pojazd)",
  "232 km of glaciers with no fuel between Lake Louise and Saskatchewan River Crossing — top up before you start. From 1 Nov to 31 Mar winter tires or carried chains are mandatory on Highway 93N.":
    "232 km wśród lodowców bez stacji paliw między Lake Louise a Saskatchewan River Crossing — zatankuj przed startem. Od 1 listopada do 31 marca na Highway 93N obowiązkowe są zimowe opony lub łańcuchy w bagażniku.",
  "Wildlife on the shoulder at dawn and dusk — ride the centre of your lane and keep speed down.":
    "Dzikie zwierzęta przy poboczu o świcie i o zmierzchu — jedź środkiem pasa i zwolnij.",
  "Tail of the Dragon (US 129, Deals Gap)": "Tail of the Dragon (US 129, Deals Gap)",
  "🇺🇸 North Carolina ↔ Tennessee": "🇺🇸 Karolina Północna ↔ Tennessee",
  "318 curves in 11 miles (17.7 km)": "318 zakrętów na 17,7 km",
  "Open year-round · best March – November, ice risk in winter":
    "Otwarta cały rok · najlepsza marzec – listopad, zimą ryzyko lodu",
  "Free — no tolls": "Bezpłatnie — brak opłat",
  "Strictly enforced 30 mph (48 km/h) limit with unmarked patrols and roadside speed radar. No guardrails on many curves and zero fuel on the strip — fill up in Robbinsville or Tapoco.":
    "Ściśle egzekwowany limit 48 km/h, z nieoznakowanymi patrolami i radarami przy drodze. Wiele zakrętów bez barierek, brak stacji paliw na tym odcinku — zatankuj w Robbinsville lub Tapoco.",
  "Photographers shoot every curve — ride your own pace, not the camera's. Trailers and RVs should use US 74 instead.":
    "Fotografowie ustawiają się na każdym zakręcie — jedź w swoim tempie, nie tempie aparatu. Przyczepy i kampery powinny korzystać z US 74.",
  "Open · winter tyres / chains required": "Otwarta · wymagane opony zimowe/łańcuchy",
  Open: "Otwarta",
  "Closed for the season": "Zamknięta na sezon",
  "Opening/closing window · check live status": "Okres otwarcia/zamknięcia · sprawdź aktualny status",
  "€30.00 motorcycle day ticket (reduced)": "30,00 € bilet dzienny dla motocykla (ulgowy)",

  /* ---------------- Border tips ---------------- */
  "Refuel in Austria before the Brenner Pass": "Zatankuj w Austrii przed przełęczą Brenner",
  "Diesel and petrol run roughly 15% cheaper in Austria than in Italy. Fill the tank around Innsbruck or Matrei am Brenner — the last Austrian stations before the border are the cheapest on the corridor.":
    "Diesel i benzyna są w Austrii o ok. 15% tańsze niż we Włoszech. Zatankuj w okolicach Innsbrucku lub Matrei am Brenner — ostatnie austriackie stacje przed granicą są najtańsze na całej trasie.",
  "≈ €12–18 saved on a 60 L tank": "≈ 12–18 € oszczędności na baku 60 l",
  "Plan a fuel stop at Matrei am Brenner": "Zaplanuj tankowanie w Matrei am Brenner",
  "Swiss motorways need the CHF 40 annual vignette":
    "Szwajcarskie autostrady wymagają rocznej winiety za CHF 40",
  "Switzerland has no day or week option — one sticker (or the e-vignette) costs CHF 40 and is valid for the whole calendar year, even if you only transit for two hours. Motorcycles need their own vignette.":
    "Szwajcaria nie ma opcji dziennej ani tygodniowej — jedna naklejka (lub e-winieta) kosztuje CHF 40 i jest ważna przez cały rok kalendarzowy, nawet jeśli przejeżdżasz tylko dwie godziny. Motocykle potrzebują własnej winiety.",
  "Switch to Smart Bypass to route around Swiss motorways on a short transit leg":
    "Przełącz na Smart Bypass, aby ominąć szwajcarskie autostrady na krótkim odcinku tranzytowym",
  "Try the 🧭 Smart Bypass variant": "Wypróbuj wariant 🧭 Smart Bypass",
  "Luxembourg fuel arbitrage on the Benelux corridor":
    "Arbitraż paliwowy w Luksemburgu na trasie Beneluksu",
  "Luxembourg keeps some of the lowest excise duties in Western Europe — expect 15–25 cents/litre less than France, Belgium or Germany. Stations near Wasserbillig, Schengen and Berchem are the classic top-up points.":
    "Luksemburg utrzymuje jedne z najniższych akcyz w Europie Zachodniej — spodziewaj się cen niższych o 15–25 centów/litr niż we Francji, Belgii czy Niemczech. Stacje w okolicach Wasserbillig, Schengen i Berchem to klasyczne miejsca tankowania.",
  "≈ €10–15 per tank versus neighbouring countries": "≈ 10–15 € na baku w porównaniu z sąsiednimi krajami",
  "Add a Luxembourg fuel stop": "Dodaj postój na tankowanie w Luksemburgu",
  "Cross into Spain (or Andorra) before you refuel":
    "Przekrocz granicę Hiszpanii (lub Andory) przed tankowaniem",
  "Spanish pump prices sit well below French ones, and Andorra is cheaper still. Coming down the A9/AP-7, hold out past La Jonquera; on the Atlantic side, Irún and Behobia are the border bargains.":
    "Ceny paliw w Hiszpanii są znacznie niższe niż we Francji, a w Andorze jeszcze niższe. Jadąc A9/AP-7, wytrzymaj do minięcia La Jonquera; od strony Atlantyku Irún i Behobia to okazje graniczne.",
  "≈ 20–30 cents/litre versus France": "≈ 20–30 centów/litr w porównaniu z Francją",
  "Add a La Jonquera or Irún fuel stop": "Dodaj postój na tankowanie w La Jonquera lub Irún",
  "State fuel-tax arbitrage": "Arbitraż podatku paliwowego między stanami",
  "State excise makes a real difference: California and Pennsylvania sit at the top, while Texas, Missouri, Mississippi and Arizona are consistently cheap. Fill up just before entering a high-tax state.":
    "Podatek stanowy robi realną różnicę: Kalifornia i Pensylwania są na szczycie, a Teksas, Missouri, Missisipi i Arizona konsekwentnie tanie. Zatankuj tuż przed wjazdem do stanu z wysokim podatkiem.",
  "Up to US$0.70/gal between neighbouring states": "Do 0,70 USD/galon różnicy między sąsiednimi stanami",
  "Fuel is usually cheaper south of the 49th": "Paliwo jest zazwyczaj tańsze na południe od 49. równoleżnika",
  "Once currency and litres-vs-gallons are converted, US fuel typically lands 20–30% below Canadian pumps — biggest gaps around BC and Québec. Cross with a low tank, return with a full one (within duty-free allowances).":
    "Po przeliczeniu waluty i litrów na galony paliwo w USA jest zwykle o 20–30% tańsze niż w Kanadzie — największe różnice w okolicach Kolumbii Brytyjskiej i Quebecu. Przekrocz granicę z prawie pustym bakiem, wróć z pełnym (w granicach limitów bezcłowych).",
  "≈ C$25–40 per tank on a border run": "≈ 25–40 CAD na baku przy wyjeździe do granicy",

  /* ---------------- Border crossings ---------------- */
  "Germany → Austria": "Niemcy → Austria",
  "Open border · random ID checks": "Granica otwarta · wyrywkowe kontrole dokumentów",
  "Free movement inside Schengen. Bavaria runs intermittent spot checks on the A8/A93 — keep passports or ID cards within reach and you'll roll straight through.":
    "Swobodne przemieszczanie się w strefie Schengen. Bawaria prowadzi okresowe kontrole wyrywkowe na A8/A93 — miej paszport lub dowód osobisty pod ręką, a przejedziesz bez zatrzymania.",
  "Photo ID for every occupant (random checks)": "Dokument tożsamości ze zdjęciem dla każdego pasażera (kontrole wyrywkowe)",
  "Austrian motorway vignette valid before the first motorway metre":
    "Ważna austriacka winieta autostradowa przed pierwszym metrem autostrady",
  "Warning triangle, hi-vis vest and first-aid kit on board":
    "Trójkąt ostrzegawczy, kamizelka odblaskowa i apteczka w pojeździe",
  "Typically 0–10 min": "Zwykle 0–10 min",
  "Austria → Italy (Brenner)": "Austria → Włochy (Brenner)",
  "Open border · occasional customs patrol": "Granica otwarta · okazjonalne patrole celne",
  "No passport control at the Brenner, but Italian Guardia di Finanza patrols do stop vehicles. Switch to Telepass lanes only if you have a transponder fitted.":
    "Brak kontroli paszportowej na Brennerze, ale włoskie patrole Guardia di Finanza zatrzymują pojazdy. Korzystaj z pasów Telepass tylko wtedy, gdy masz zamontowany transponder.",
  "Photo ID on board": "Dokument tożsamości ze zdjęciem w pojeździe",
  "Brenner autostrada toll paid at the barrier (card, cash or Telepass)":
    "Opłata za autostradę Brenner pobierana przy bramce (karta, gotówka lub Telepass)",
  "Crit'Air-style city rules do not apply, but Italian ZTL zones do":
    "Przepisy w stylu Crit'Air nie obowiązują, ale włoskie strefy ZTL już tak",
  "Typically 0–15 min at the toll plaza": "Zwykle 0–15 min przy bramce",
  "Swiss borders (Schengen, non-EU customs)": "Granice szwajcarskie (Schengen, poza unią celną UE)",
  "Customs control · goods declaration": "Kontrola celna · deklaracja towarów",
  "Switzerland is in Schengen but outside the EU customs union, so customs officers can and do stop vehicles. Declare goods above the duty-free allowance and buy the vignette before the first motorway.":
    "Szwajcaria należy do strefy Schengen, ale nie do unii celnej UE, więc celnicy mogą zatrzymywać pojazdy i to robią. Zgłoś towary powyżej limitu bezcłowego i kup winietę przed wjazdem na pierwszą autostradę.",
  "CHF 40 motorway vignette (annual) or e-vignette per vehicle":
    "Winieta autostradowa CHF 40 (roczna) lub e-winieta na pojazd",
  "Customs declaration for goods over CHF 300 per person":
    "Deklaracja celna dla towarów powyżej CHF 300 na osobę",
  "Meat, dairy and alcohol allowances are strictly enforced":
    "Limity na mięso, nabiał i alkohol są ściśle egzekwowane",
  "0–20 min · longer at Basel and Chiasso on weekends":
    "0–20 min · dłużej w Bazylei i Chiasso w weekendy",
  "UK ↔ France (Channel Tunnel & Dover–Calais)":
    "Wielka Brytania ↔ Francja (Tunel pod Kanałem i Dover–Calais)",
  "Full passport control & customs": "Pełna kontrola paszportowa i celna",
  "Post-Brexit juxtaposed controls mean both British and French officers check you before boarding. Arrive 60–90 min ahead in peak season and have every document to hand.":
    "Po brexicie stosowane są kontrole łączone — sprawdzają cię zarówno brytyjscy, jak i francuscy funkcjonariusze przed wjazdem na pokład. Przyjedź 60–90 minut wcześniej w sezonie i miej wszystkie dokumenty pod ręką.",
  "Valid passport for every traveller (ID cards no longer accepted for UK entry)":
    "Ważny paszport dla każdego podróżnego (dowody osobiste nie są już akceptowane przy wjeździe do Wielkiej Brytanii)",
  "EU Entry/Exit System biometric registration on first crossing":
    "Biometryczna rejestracja w unijnym systemie Entry/Exit przy pierwszym przekroczeniu granicy",
  "Customs declaration for goods, alcohol, tobacco and pets (animal health certificate)":
    "Deklaracja celna dla towarów, alkoholu, tytoniu i zwierząt (świadectwo zdrowia zwierzęcia)",
  "UK sticker on the vehicle and headlamp beam deflectors":
    "Naklejka UK na pojeździe i osłony reflektorów",
  "30–120 min in summer peaks": "30–120 min w szczycie letnim",
  "Croatia ↔ Bosnia & Herzegovina (Neum corridor)":
    "Chorwacja ↔ Bośnia i Hercegowina (korytarz Neum)",
  "Passport control · EU external border": "Kontrola paszportowa · zewnętrzna granica UE",
  "The Neum corridor crosses out of and back into the EU within 9 km. Green card insurance is essential, and queues build sharply on July/August weekends. The Pelješac Bridge bypasses it entirely.":
    "Korytarz Neum wyprowadza z UE i z powrotem do niej na odcinku 9 km. Ubezpieczenie Zielona Karta jest niezbędne, a kolejki mocno rosną w weekendy lipca i sierpnia. Most Peljeszacki pozwala go całkowicie ominąć.",
  "Passport for every occupant (two stamps in 20 minutes)":
    "Paszport dla każdego pasażera (dwie pieczątki w 20 minut)",
  "Green Card motor insurance valid for BiH": "Ubezpieczenie Zielona Karta ważne dla BiH",
  "Vehicle registration document in the driver's name or a notarised letter":
    "Dowód rejestracyjny na nazwisko kierowcy lub notarialne pełnomocnictwo",
  "15–90 min in high season": "15–90 min w wysokim sezonie",
  "USA ↔ Canada land border": "Granica lądowa USA ↔ Kanada",
  "Passport control · CBP / CBSA inspection": "Kontrola paszportowa · odprawa CBP / CBSA",
  "Every crossing is a full immigration and customs stop. NEXUS lanes cut the wait dramatically at Peace Arch, Detroit–Windsor and Niagara. Declare all food, alcohol, cannabis and firearms — penalties are steep.":
    "Każde przekroczenie to pełna odprawa imigracyjna i celna. Pasy NEXUS znacznie skracają czas oczekiwania przy Peace Arch, Detroit–Windsor i Niagarze. Zgłoś całą żywność, alkohol, marihuanę i broń palną — kary są surowe.",
  "Passport, NEXUS card or enhanced driver's licence":
    "Paszport, karta NEXUS lub rozszerzone prawo jazdy",
  "Vehicle registration and proof of insurance valid in the destination country":
    "Dowód rejestracyjny i potwierdzenie ubezpieczenia ważne w kraju docelowym",
  "Declare food, alcohol, tobacco, cannabis and pets; firearms need advance paperwork":
    "Zgłoś żywność, alkohol, tytoń, marihuanę i zwierzęta; broń palna wymaga wcześniejszych formalności",
  "Electronic toll transponders (E-ZPass, 407 ETR) are not interchangeable across the border":
    "Elektroniczne transpondery drogowe (E-ZPass, 407 ETR) nie działają po drugiej stronie granicy",
  "10–60 min · check live CBP border wait times":
    "10–60 min · sprawdź aktualne czasy oczekiwania CBP",

  "Rider Safety & Gear Radar": "Radar bezpieczeństwa i sprzętu dla motocyklistów",
  "Camper Clearance & Weight Radar": "Radar prześwitu i wagi dla kamperów",
  "Driver Safety Radar": "Radar bezpieczeństwa kierowcy",
  "🧤 Gear & legal kit": "🧤 Sprzęt i wymagane wyposażenie",
  "🏔️ Mountain pass alerts": "🏔️ Alerty o przełęczach górskich",
  "⛽ Long-stretch fuel alerts": "⛽ Alerty o długich odcinkach bez paliwa",
  "📏 Clearance warnings": "📏 Ostrzeżenia o prześwicie",
  "⚖️ Weight & axle limits": "⚖️ Limity wagi i nacisku na oś",
  "🛠️ Services": "🛠️ Serwisy",
  "🚗 On the road": "🚗 W trasie",
  "🏔️ Pass conditions": "🏔️ Warunki na przełęczach",
  "France: CE-approved gloves are mandatory for rider and pillion, and a high-vis vest must be carried within reach.": "Francja: rękawice z homologacją CE są obowiązkowe dla kierowcy i pasażera, a kamizelka odblaskowa musi być w zasięgu ręki.",
  "Austria & Germany: carry a first-aid kit meeting DIN 13167 (motorcycle standard) — small, and checked at roadside stops.": "Austria i Niemcy: miej apteczkę zgodną z normą DIN 13167 (standard motocyklowy) — mała, sprawdzana podczas kontroli drogowych.",
  "Keep your vest, kit and documents on top of the pannier so a check takes seconds.": "Trzymaj kamizelkę, apteczkę i dokumenty na wierzchu sakwy, żeby kontrola trwała sekundy.",
  "Two stretches exceed 180 km between open stations — top up before the pass climbs.": "Dwa odcinki przekraczają 180 km między czynnymi stacjami — zatankuj przed podjazdem na przełęcz.",
  "Night-time pumps on the alpine leg are card-only; carry a backup card.": "Nocne dystrybutory na odcinku alpejskim przyjmują tylko karty — miej kartę zapasową.",
  "Two tunnels on this route cap height at 3.2 m — your 3.05 m profile clears with margin.": "Dwa tunele na tej trasie mają ograniczenie wysokości 3,2 m — twój profil 3,05 m mieści się z zapasem.",
  "One low village archway (2.9 m) was bypassed via the valley road automatically.": "Jedna niska brama wjazdowa do wsi (2,9 m) została automatycznie ominięta drogą doliną.",
  "Route verified for vehicles up to 3.5 t; a 7.5 t restriction on the old pass road is avoided.": "Trasa zweryfikowana dla pojazdów do 3,5 t; ograniczenie 7,5 t na starej drodze przełęczowej jest omijane.",
  "Crosswind advisory on the coastal bridge section — reduce speed with a high side profile.": "Ostrzeżenie o bocznym wietrze na odcinku mostu przybrzeżnego — zwolnij przy wysokim profilu bocznym.",
  "Three overnight-friendly service areas with fresh water and grey-water disposal along the way.": "Trzy strefy serwisowe przyjazne noclegom, ze świeżą wodą i zrzutem szarej wody po drodze.",
  "Winter equipment rules apply on the alpine section between October and April.": "Na odcinku alpejskim od października do kwietnia obowiązują przepisy o wyposażeniu zimowym.",
  "Rest stops are mapped every 2 hours so the drive stays fresh and relaxed.": "Postoje na odpoczynek są zaplanowane co 2 godziny, dzięki czemu jazda pozostaje odprężona.",
  "Every toll gantry on this route accepts contactless cards — no cash needed.": "Każda bramka na tej trasie akceptuje karty zbliżeniowe — gotówka niepotrzebna.",
  "Stelvio Pass (2,757 m) — 48 hairpins, open, dry tarmac forecast until early evening.": "Przełęcz Stelvio (2757 m) — 48 zakrętów, otwarta, prognoza suchego asfaltu do wczesnego wieczora.",
  "Grossglockner High Alpine Road — toll road, gates close at 21:00; ride it before dusk.": "Grossglockner Hochalpenstrasse — droga płatna, bramy zamykane o 21:00; jedź przed zmierzchem.",
  "Furka Pass — clear and open today, light crosswinds on the western ramp.": "Przełęcz Furka — dziś bezchmurnie i otwarta, lekki boczny wiatr po zachodniej stronie.",
  "Trollstigen — single-lane sections with tourist traffic; take the early morning slot.": "Trollstigen — odcinki jednopasmowe z ruchem turystycznym; wybierz wczesny poranek.",
  "Tail of the Dragon (US-129) — 318 curves in 11 miles; watch for gravel on the inside lines.": "Tail of the Dragon (US-129) — 318 zakrętów na 18 km; uważaj na żwir po wewnętrznej stronie zakrętów.",
  "Icefields Parkway — stunning but exposed; wildlife on the road at dawn and dusk.": "Icefields Parkway — zapierająca dech, ale odsłonięta; dzikie zwierzęta na drodze o świcie i o zmierzchu.",
  "🇩🇪 Germany": "🇩🇪 Niemcy",
  "🇦🇹 Austria": "🇦🇹 Austria",
  "🇨🇭 Switzerland": "🇨🇭 Szwajcaria",
  "🇮🇹 Italy": "🇮🇹 Włochy",
  "🇳🇴 Norway": "🇳🇴 Norwegia",
  "⛴️ Ferries": "⛴️ Promy",
  "🏙️ Illinois": "🏙️ Illinois",
  "🌄 Colorado": "🌄 Kolorado",
  "🌉 California": "🌉 Kalifornia",
  "🌴 Florida": "🌴 Floryda",
  "🍁 Ontario": "🍁 Ontario",
  "🌲 Nova Scotia": "🌲 Nowa Szkocja",
  "🏔️ British Columbia": "🏔️ Kolumbia Brytyjska",
  "No car tolls on German autobahns": "Brak opłat dla samochodów na niemieckich autostradach",
  "Ticket system, 8 checkpoints": "System biletowy, 8 punktów kontrolnych",
  "Ticket system, 5 checkpoints": "System biletowy, 5 punktów kontrolnych",
  "AutoPASS gantries — motorcycles pass free": "Bramownice AutoPASS — motocykle przejeżdżają bezpłatnie",
  "Vehicle + 2 passengers": "Pojazd + 2 pasażerów",
  "Reserve seat": "Zarezerwuj miejsce",
  "Reserve": "Zarezerwuj",
  "Reserve ahead": "Zarezerwuj z wyprzedzeniem",
  "6 gantries, I-PASS rate": "6 bramownic, stawka I-PASS",
  "Plate-pay surcharge included": "Wliczona dopłata za odczyt tablic",
  "Peak weekend rate": "Stawka szczytowa w weekend",
  "Southbound, FasTrak": "Kierunek południowy, FasTrak",
  "Weekday peak": "Godziny szczytu w dni robocze",
  "Evening rate": "Stawka wieczorna",
  "SunPass rate, 9 gantries": "Stawka SunPass, 9 bramownic",
  "Vehicle under 22ft + driver": "Pojazd poniżej 6,7 m + kierowca",
  "Vehicle under 20ft + 2 adults": "Pojazd poniżej 6,1 m + 2 dorosłych",
  "Peak rate, transponder": "Stawka szczytowa, transponder",
  "Per-trip camera fee": "Opłata kamerowa za przejazd",
  "Two-axle vehicle": "Pojazd dwuosiowy",
  "Toll-free since 2008": "Bezpłatna od 2008 roku",
  "Digital vignette": "Winieta cyfrowa",
  "🇳🇴 Norway · Fjord ferries": "🇳🇴 Norwegia · Promy fiordowe",
  "🌊 Scandinavia & Baltic": "🌊 Skandynawia i Bałtyk",
  "🇬🇧 English Channel": "🇬🇧 Kanał La Manche",
  "☘️ Irish Sea": "☘️ Morze Irlandzkie",
  "☀️ Mediterranean & Adriatic": "☀️ Morze Śródziemne i Adriatyk",
  "🇺🇸 US marine highways": "🇺🇸 Amerykańskie szlaki morskie",
  "🇨🇦 Canadian coastal ferries": "🇨🇦 Kanadyjskie promy przybrzeżne",
  "10–45 min per crossing": "10–45 min na przeprawę",
  "Every 20–40 min, most run 24/7": "Co 20–40 min, większość kursuje całodobowo",
  "NOK 120–290 per car": "120–290 NOK za samochód",
  "NOK 55–120 per motorcycle": "55–120 NOK za motocykl",
  "Register an AutoPASS ferjekort for an automatic ~50% discount — no cash, no queue at the booth.": "Zarejestruj kartę AutoPASS ferjekort, aby uzyskać automatyczną zniżkę ok. 50% — bez gotówki i kolejki przy kasie.",
  "AutoPASS ferjekort −50%": "AutoPASS ferjekort −50%",
  "45 min – 20 h depending on crossing": "45 min – 20 godz. w zależności od przeprawy",
  "Scandlines every 30 min; overnight lines 1–2 sailings a day": "Scandlines co 30 min; nocne linie 1–2 rejsy dziennie",
  "€45–210 car + driver": "45–210 € samochód + kierowca",
  "€28–120 motorcycle + rider": "28–120 € motocykl + kierowca",
  "Book overnight cabins early in July and August — the Oslo–Kiel and Tallinn routes sell out weeks ahead.": "Rezerwuj kabiny na noc wcześnie w lipcu i sierpniu — trasy Oslo–Kiel i do Tallina wyprzedają się z wielotygodniowym wyprzedzeniem.",
  "Cabins book out early": "Kabiny szybko się wyprzedają",
  "35 min (LeShuttle) · 90–120 min (ferry)": "35 min (LeShuttle) · 90–120 min (prom)",
  "Up to 4 departures an hour at peak": "Do 4 odjazdów na godzinę w szczycie",
  "£70–190 car + passengers": "£70–190 samochód + pasażerowie",
  "£45–95 motorcycle + rider": "£45–95 motocykl + kierowca",
  "LeShuttle keeps you in your vehicle — the fastest option with a roof box or a loaded bike.": "LeShuttle pozwala zostać w pojeździe — najszybsza opcja z boksem dachowym lub załadowanym motocyklem.",
  "Flexi tickets recommended": "Zalecane bilety elastyczne",
  "2 h (fast craft) – 3 h 30 min": "2 godz. (szybki prom) – 3 godz. 30 min",
  "4–8 sailings a day per route": "4–8 rejsów dziennie na trasę",
  "€95–230 car + driver": "95–230 € samochód + kierowca",
  "€60–130 motorcycle + rider": "60–130 € motocykl + kierowca",
  "Wild Atlantic Way traffic peaks at weekends — a midweek morning sailing is calmer and cheaper.": "Ruch na Wild Atlantic Way jest największy w weekendy — rejs w środku tygodnia rano jest spokojniejszy i tańszy.",
  "50 min (island hops) – 20 h (overnight)": "50 min (skoki między wyspami) – 20 godz. (nocna przeprawa)",
  "Island hops hourly; long crossings daily": "Skoki między wyspami co godzinę; długie przeprawy codziennie",
  "€55–260 car + driver": "55–260 € samochód + kierowca",
  "€30–140 motorcycle + rider": "30–140 € motocykl + kierowca",
  "Motorcycles usually board first and pay roughly 40% less — arrive 45 min before departure.": "Motocykle zwykle wjeżdżają na pokład jako pierwsze i płacą ok. 40% mniej — przybądź 45 min przed odjazdem.",
  "Bikes board first": "Motocykle wjeżdżają pierwsze",
  "60 min – 38 h (Alaska)": "60 min – 38 godz. (Alaska)",
  "San Juans hourly; Alaska weekly": "San Juans co godzinę; Alaska co tydzień",
  "$62–180 vehicle + driver": "62–180 USD pojazd + kierowca",
  "$28–70 motorcycle + rider": "28–70 USD motocykl + kierowca",
  "Vehicle reservations open two months ahead on Washington State Ferries and are essential in summer.": "Rezerwacje pojazdów na Washington State Ferries otwierają się dwa miesiące wcześniej i są konieczne latem.",
  "1 h 35 min – 7 h (Newfoundland)": "1 godz. 35 min – 7 godz. (Nowa Fundlandia)",
  "Every 1–2 h on the Vancouver Island runs": "Co 1–2 godz. na trasach do Wyspy Vancouver",
  "C$96–150 vehicle + 2 adults": "96–150 CAD pojazd + 2 dorosłych",
  "C$45–70 motorcycle + rider": "45–70 CAD motocykl + kierowca",
  "Book a Saver fare on BC Ferries — cheapest sailings are before 09:00 and after 19:00.": "Zarezerwuj taryfę Saver na BC Ferries — najtańsze rejsy są przed 9:00 i po 19:00.",
  "Saver fares available": "Dostępne taryfy Saver",
  "⚡ Smart EV Charging Optimizer": "⚡ Inteligentny optymalizator ładowania EV",
  "⛽ Smart Fuel Stop Optimizer": "⛽ Inteligentny optymalizator postojów na paliwo",
  "24/7 forecourt": "Całodobowa stacja",

  "I have AutoPASS / EPASS24": "Mam AutoPASS / EPASS24",
  "I have Telepass / Bip&Go / Fulli": "Mam Telepass / Bip&Go / Fulli",
  "I have SunPass / E-ZPass": "Mam SunPass / E-ZPass",
  "Vignettes & e-vignettes": "Winiety i e-winiety",
  "Ticket-based motorway tolls": "Opłaty autostradowe na bilety",
  "Urban low-emission zones": "Miejskie strefy czystego transportu",
  "State toll roads & turnpikes": "Stanowe drogi płatne i turnpike'i",
  "HOV / Express lanes": "Pasy HOV / ekspresowe",
  "Bridge & tunnel tolls": "Opłaty za mosty i tunele",
  "Highway 407 ETR": "Highway 407 ETR",
  "Provincial tolls & bridges": "Prowincjonalne opłaty i mosty",
  "BC Ferries crossings": "Przeprawy BC Ferries",

  "Fuel is ~15% cheaper in Austria than Italy — refuel before crossing the Brenner Pass.": "Paliwo jest ok. 15% tańsze w Austrii niż we Włoszech — zatankuj przed przejazdem przez przełęcz Brenner.",
  "Luxembourg is the cheapest tank in Western Europe — top up before entering Belgium or France.": "Luksemburg oferuje najtańsze paliwo w Europie Zachodniej — zatankuj przed wjazdem do Belgii lub Francji.",
  "Diesel in Norway runs well above Swedish prices — fill near the border at Svinesund.": "Diesel w Norwegii jest znacznie droższy niż w Szwecji — zatankuj przy granicy w Svinesund.",
  "Fuel in Georgia is ~20% cheaper than Florida — fill up before the state line on I-95.": "Paliwo w Georgii jest ok. 20% tańsze niż na Florydzie — zatankuj przed granicą stanu na I-95.",
  "Skip turnpike service plazas: prices run 10–15% above exits one mile off the highway.": "Omiń stacje przy autostradach płatnych: ceny są o 10–15% wyższe niż przy zjazdach kilometr dalej.",
  "California is the most expensive tank on the West Coast — fill in Nevada or Arizona first.": "Kalifornia ma najdroższe paliwo na Zachodnim Wybrzeżu — zatankuj wcześniej w Newadzie lub Arizonie.",
  "Alberta fuel is ~20% cheaper than British Columbia — fill before Kicking Horse Pass.": "Paliwo w Albercie jest ok. 20% tańsze niż w Kolumbii Brytyjskiej — zatankuj przed Kicking Horse Pass.",
  "Québec charges more per litre than Ontario — top up before the provincial border on the 417.": "Quebec pobiera więcej za litr niż Ontario — zatankuj przed granicą prowincji na trasie 417.",
  "Northern Ontario pumps run a premium — refuel in Sault Ste. Marie before Highway 17.": "Dystrybutory w północnym Ontario mają wyższe ceny — zatankuj w Sault Ste. Marie przed Highway 17.",
  "Sognefjell (RV55), Norway — 194 km without a verified 24/7 station. Fill in Lom.": "Sognefjellet (RV55), Norwegia — 194 km bez zweryfikowanej całodobowej stacji. Zatankuj w Lom.",
  "Grossglockner High Alpine Road — 186 km loop with no fuel above the toll gate.": "Grossglockner Hochalpenstrasse — 186 km pętli bez paliwa powyżej bramki opłat.",
  "US-50 “Loneliest Road”, Nevada — 226 km between verified stations. Fill in Ely.": "US-50 „Najbardziej samotna droga”, Nevada — 226 km między zweryfikowanymi stacjami. Zatankuj w Ely.",
  "I-10 Van Horn → Fort Stockton, Texas — 190 km with limited overnight service.": "I-10 Van Horn → Fort Stockton, Teksas — 190 km z ograniczoną obsługą nocną.",
  "Highway 17 Wawa → White River — 198 km with no verified overnight fuel.": "Highway 17 Wawa → White River — 198 km bez zweryfikowanego paliwa w nocy.",
  "Icefields Parkway, Alberta — 232 km between Lake Louise and Jasper; Saskatchewan Crossing only.": "Icefields Parkway, Alberta — 232 km między Lake Louise a Jasper; jedynie Saskatchewan Crossing po drodze.",
  "Eleven hairpins climbing a sheer wall — viewing platform over the valley.": "Jedenaście zakrętów wspinających się po stromej ścianie — platforma widokowa nad doliną.",
  "Eight bridges hopping island to island straight over the open sea.": "Osiem mostów przeskakujących z wyspy na wyspę prosto nad otwartym morzem.",
  "48 km of alpine theatre topping out at 2,504 m.": "48 km alpejskiego widowiska osiągającego 2504 m.",
  "48 numbered hairpins — the classic rider pilgrimage.": "48 ponumerowanych zakrętów — klasyczna pielgrzymka motocyklistów.",
  "Glacier views, smooth tarmac and a lakeside descent.": "Widoki na lodowce, gładki asfalt i zjazd wzdłuż jeziora.",
  "Turquoise canyon rim road on the way to the Côte d'Azur.": "Droga wzdłuż turkusowego kanionu w drodze na Lazurowe Wybrzeże.",
  "469 miles of ridgeline overlooks, no trucks, no tolls.": "755 km punktów widokowych wzdłuż grani, bez ciężarówek, bez opłat.",
  "Big Sur cliffs, Bixby Bridge and endless Pacific vistas.": "Klify Big Sur, most Bixby i niekończące się widoki na Pacyfik.",
  "318 curves in 11 miles — ride it early to beat traffic.": "318 zakrętów na 18 km — jedź wcześnie, aby uniknąć ruchu.",
  "Switchbacks to 10,947 ft on the doorstep of Yellowstone.": "Serpentyny do 3337 m tuż przy granicy Yellowstone.",
  "Red-rock tunnels and canyon overlooks between two parks.": "Tunele w czerwonej skale i punkty widokowe na kanion między dwoma parkami.",
  "232 km between Lake Louise and Jasper past glaciers and turquoise lakes.": "232 km między Lake Louise a Jasper obok lodowców i turkusowych jezior.",
  "Highland cliffs, whale lookouts and ocean switchbacks.": "Klify wyżynne, punkty obserwacji wielorybów i serpentyny nad oceanem.",
  "Howe Sound fjord views from Vancouver up to Whistler.": "Widoki na fiord Howe Sound od Vancouver aż po Whistler.",
  "St. Lawrence riverside villages and beluga-watching stops.": "Wioski nad rzeką Świętego Wawrzyńca i przystanki na obserwację białuch.",
  "Late May – October": "Koniec maja – październik",
  "Year-round": "Cały rok",
  "May – early November": "Maj – początek listopada",
  "June – October": "Czerwiec – październik",
  "Year-round (peak: October)": "Cały rok (szczyt: październik)",
  "April – November": "Kwiecień – listopad",
  "Late May – mid October": "Koniec maja – połowa października",
  "Year-round (winter tyres Oct–Apr)": "Cały rok (opony zimowe paź.–kwi.)",
  "May – October": "Maj – październik",
  "Rauma, Norway": "Rauma, Norwegia",
  "Møre og Romsdal, Norway": "Møre og Romsdal, Norwegia",
  "Provence, France": "Prowansja, Francja",
  "Virginia – North Carolina": "Wirginia – Karolina Północna",
  "California": "Kalifornia",
  "Tennessee": "Tennessee",
  "Montana – Wyoming": "Montana – Wyoming",
  "Utah": "Utah",
  "Alberta": "Alberta",
  "Cape Breton, Nova Scotia": "Cape Breton, Nowa Szkocja",
  "British Columbia": "Kolumbia Brytyjska",
  "Québec": "Quebec",
  "Fjord-side pitches, 5 min walk to the ferry quay.": "Miejsca nad fiordem, 5 minut spacerem do nabrzeża promowego.",
  "Great overnight before Grossglockner — book in July/August.": "Świetny nocleg przed Grossglocknerem — rezerwuj w lipcu/sierpniu.",
  "France's aire network is the cheapest overnight option en route south.": "Francuska sieć aire to najtańszy nocleg na trasie na południe.",
  "Large pitches; height/width friendly access road.": "Duże miejsca; droga dojazdowa przyjazna dla wysokich i szerokich pojazdów.",
  "EV hookup": "Podłączenie EV",
  "Chemical WC": "Zrzut toalety chemicznej",
  "Electricity": "Prąd",
  "Bakery service": "Dostawa pieczywa",
  "Full hookup": "Pełne podłączenie",
  "24h access": "Dostęp całodobowy",
  "Geiranger, Norway": "Geiranger, Norwegia",
  "Salzburg, Austria": "Salzburg, Austria",
  "Haute-Savoie, France": "Haute-Savoie, Francja",
  "Lake Garda, Italy": "Jezioro Garda, Włochy",
  "Motorcycles are exempt from this e-vignette — nothing to buy.": "Motocykle są zwolnione z tej e-winiety — nic do kupienia.",
  "Only one validity period exists — it covers the whole stay.": "Istnieje tylko jeden okres ważności — obejmuje cały pobyt.",

  /* ---------------- Tolls guide ---------------- */
  "🇪🇺 Europe": "🇪🇺 Europa",
  "🇺🇸 United States": "🇺🇸 Stany Zjednoczone",
  "🇨🇦 Canada": "🇨🇦 Kanada",
  "Tolls & vignettes": "Opłaty drogowe i winiety",
  "Every barrier, badge and sticker — made simple.": "Każdy szlaban, plakietka i naklejka — prosto wyjaśnione.",
  "No guesswork, no fines. Here's what you need in each country, and how to get it before you set off.": "Żadnego zgadywania i żadnych mandatów. Oto czego potrzebujesz w każdym kraju i jak to załatwić przed wyjazdem.",
  "Austria digital vignette": "Austriacka winieta cyfrowa",
  "10-day, 2-month or annual. Plate-linked, activates instantly.": "Na 10 dni, 2 miesiące lub rok. Przypisana do tablicy, aktywuje się od razu.",
  "Switzerland e-vignette": "Szwajcarska e-winieta",
  "Annual only, valid 14 months. Motorcycles need their own.": "Tylko roczna, ważna 14 miesięcy. Motocykl potrzebuje własnej.",
  "France & Italy ticket tolls": "Bramki biletowe we Francji i Włoszech",
  "Take a ticket, pay on exit. Telepass and Bip&Go tags speed it up.": "Pobierasz bilet, płacisz przy zjeździe. Telepass i Bip&Go bardzo to przyspieszają.",
  "Norway AutoPASS": "Norweski AutoPASS",
  "Automatic plate billing with discounts for registered EVs.": "Automatyczne rozliczenie po tablicy, ze zniżkami dla zarejestrowanych elektryków.",
  "E-ZPass network": "Sieć E-ZPass",
  "One transponder covers 19 states from Maine to Illinois.": "Jeden transponder działa w 19 stanach, od Maine po Illinois.",
  "SunPass (Florida)": "SunPass (Floryda)",
  "Best value for Turnpike and Miami express lanes.": "Najkorzystniejszy na Turnpike i pasach ekspresowych w Miami.",
  "FasTrak (California)": "FasTrak (Kalifornia)",
  "Required for bridge and express-lane discounts.": "Wymagany, by dostać zniżki na mostach i pasach ekspresowych.",
  "Plate-pay tolling": "Rozliczenie po tablicy rejestracyjnej",
  "Rental cars often add a daily admin fee — worth checking first.": "Wypożyczalnie często doliczają dzienną opłatę administracyjną — warto sprawdzić wcześniej.",
  "Ontario's all-electronic toll road. A transponder beats camera billing.": "W pełni elektroniczna płatna droga w Ontario. Transponder wychodzi taniej niż rozliczenie z kamer.",
  "Cobequid Pass": "Cobequid Pass",
  "Nova Scotia's only mainline toll — cash and card accepted.": "Jedyna główna opłata w Nowej Szkocji — gotówka i karta.",
  "Bridge tolls": "Opłaty mostowe",
  "Confederation Bridge is charged on the way off PEI only.": "Za Confederation Bridge płacisz tylko przy wyjeździe z Wyspy Księcia Edwarda.",

  /* ---------------- Corridor map: fuel & map extras ---------------- */
  "Est. rate": "Szac. stawka",
  "Petrol 95": "Benzyna 95",
  Diesel: "Diesel",
  "Open in Google Maps": "Otwórz w Mapach Google",

  /* ---------------- Trip results: EV optimizer extras ---------------- */
  "Preferred network": "Preferowana sieć",
  "Nearest high-power CCS hub": "Najbliższy punkt szybkiego ładowania CCS",

  /* ---------------- Route tolls: distance & vignette details ---------------- */
  "Ticket system, charged per kilometre": "System biletowy, opłata za kilometr",
  "Private concession segments only — state-run e-TOLL motorways are free for cars":
    "Tylko prywatne odcinki koncesyjne — państwowe autostrady e-TOLL są bezpłatne dla samochodów osobowych",
  "Remaining concession sections": "Pozostałe odcinki koncesyjne",
  "Includes electronic-only motorways": "Obejmuje autostrady z wyłącznie elektronicznym poborem opłat",
  "Fixed plaza charges along the corridor": "Stałe opłaty na bramkach wzdłuż trasy",
  "Automatic tolling — motorcycles pass free": "Automatyczny pobór opłat — motocykle przejeżdżają bezpłatnie",
  "10-day pass, valid nationwide": "Bilet 10-dniowy, ważny w całym kraju",
  "Annual e-vignette, plate-linked (no short tier exists)":
    "Roczna e-winieta, przypisana do tablicy (brak wariantu krótkoterminowego)",
  "7-day e-vignette": "E-winieta 7-dniowa",
  "10-day electronic vignette": "Elektroniczna winieta 10-dniowa",
  "10-day national e-vignette": "Krajowa e-winieta 10-dniowa",
  "Weekend/weekly e-vignette": "E-winieta weekendowa/tygodniowa",
  "7-day road vignette": "Winieta drogowa 7-dniowa",

  /* ---------------- Route tolls: toll-free country/province notes ---------------- */
  "No motorway toll in Denmark — only the Storebælt and Øresund bridges are charged, and only if you cross them.":
    "W Danii nie ma opłat autostradowych — płatne są tylko mosty Storebælt i Øresund, i tylko jeśli nimi przejeżdżasz.",
  "German autobahns are toll-free for cars and motorhomes up to 7.5 t.":
    "Niemieckie autostrady są bezpłatne dla samochodów i kamperów do 7,5 t.",
  "Dutch motorways are free — only the Westerschelde and Kil tunnels charge.":
    "Holenderskie autostrady są bezpłatne — opłaty pobierane są tylko w tunelach Westerschelde i Kil.",
  "Belgian motorways are free for cars; the Liefkenshoek tunnel is the exception.":
    "Belgijskie autostrady są bezpłatne dla samochodów; wyjątkiem jest tunel Liefkenshoek.",
  "Luxembourg motorways are toll-free (and the cheapest fuel on the corridor).":
    "Autostrady w Luksemburgu są bezpłatne (a paliwo jest tam najtańsze na całej trasie).",
  "Swedish motorways are free; only Stockholm/Göteborg congestion charges apply.":
    "Szwedzkie autostrady są bezpłatne; obowiązują jedynie opłaty za korki w Sztokholmie i Göteborgu.",
  "Finnish roads are toll-free.": "Fińskie drogi są bezpłatne.",
  "Estonian roads are toll-free for passenger vehicles.": "Estońskie drogi są bezpłatne dla samochodów osobowych.",
  "Latvian roads are toll-free for passenger vehicles.": "Łotewskie drogi są bezpłatne dla samochodów osobowych.",
  "Lithuanian roads are toll-free for passenger vehicles.": "Litewskie drogi są bezpłatne dla samochodów osobowych.",
  "Only individual toll plazas (M50 eFlow) charge — none on this corridor.":
    "Opłaty pobierane są tylko na pojedynczych bramkach (M50 eFlow) — żadnej na tej trasie.",
  "UK motorways are free apart from the M6 Toll and Dartford Crossing.":
    "Brytyjskie autostrady są bezpłatne, poza M6 Toll i Dartford Crossing.",
  "New Brunswick highways are toll-free.": "Autostrady w Nowym Brunszwiku są bezpłatne.",
  "BC highways are toll-free since the Port Mann and Golden Ears tolls ended.":
    "Autostrady w Kolumbii Brytyjskiej są bezpłatne, odkąd zniesiono opłaty za Port Mann i Golden Ears.",
  "Alberta highways are toll-free.": "Autostrady w Albercie są bezpłatne.",
  "Manitoba highways are toll-free.": "Autostrady w Manitobie są bezpłatne.",
  "Saskatchewan highways are toll-free.": "Autostrady w Saskatchewan są bezpłatne.",

  /* ---------------- Vignette optimizer: tier labels ---------------- */
  "1-Day": "1 dzień",
  "10-Day": "10 dni",
  "2-Month": "2 miesiące",
  Annual: "Roczna",
  "7-Day": "7 dni",
  "1-Month": "1 miesiąc",
  "30-Day": "30 dni",

  // Travel Party & Route Stop Cards (POI taxonomy, universal stop card)
  "Personalize stops for your travel party (POI & Rest Stops)": "Dopasuj postoje do towarzyszy podróży (POI i miejsca odpoczynku)",
  "Apply stops to route": "Dodaj postoje do trasy",
  "Loading rating…": "Wczytywanie oceny…",
  "Petrol/diesel stations, 24/7 pumps, LPG/autogas": "Stacje benzynowe/diesla, czynne całą dobę, LPG",
  "Fast DC chargers along the corridor": "Szybkie ładowarki wzdłuż trasy",
  "Dump stations, fresh water, LPG/autogas": "Stacje zlewne, świeża woda, LPG",
  "Campgrounds, RV parks, permitted overnight zones": "Kempingi, pola dla kamperów, dozwolone strefy noclegowe",
  "Mountain passes and tourist byways": "Przełęcze górskie i trasy widokowe",
  "Overlooks and photo pull-offs": "Punkty widokowe i miejsca na zdjęcia",
  "National parks, waterfalls, gorges, reserves": "Parki narodowe, wodospady, wąwozy, rezerwaty",
  "Swim spots, lakes, beaches, hot springs": "Kąpieliska, jeziora, plaże, gorące źródła",
  "Botanical gardens, quiet parks, thermal spas": "Ogrody botaniczne, spokojne parki, łaźnie termalne",
  "Historic sites, museums, UNESCO landmarks": "Miejsca historyczne, muzea, zabytki UNESCO",
  "Castles, palaces, châteaux, manors": "Zamki, pałace, twierdze, dwory",
  "Theme parks, playgrounds, waterparks": "Parki rozrywki, place zabaw, parki wodne",
  "Zoos, sanctuaries, aquariums, farms": "Zoo, rezerwaty przyrody, akwaria, gospodarstwa",
  "Markets, farm shops, vineyards, food halls": "Targi, sklepy przyzagrodowe, winnice, hale targowe",
  "Old towns, pedestrian markets, architecture": "Stare miasta, deptaki, architektura",
  "Via ferrata, climbing, whitewater, trailheads": "Via ferraty, wspinaczka, spływy górskie, szlaki piesze",
};
