import type { InfoPageContent } from "@/lib/info-content";

const DISCLAIMER_FI = "Vain suuntaa-antavia arvioita – tarkista aina viralliset tiedot ennen matkaa.";

export const FI_FAQ: InfoPageContent = {
  eyebrow: "Usein kysytyt kysymykset",
  title: "Kaikki, mitä matkailijat kysyvät meiltä ennen lähtöä.",
  intro:
    "Suorat vastaukset siitä, miten arviomme lasketaan, mistä data tulee ja mitä sinun on vielä hankittava itse.",
  sections: [
    {
      heading: "Kuinka tarkkoja kuluarviot ovat?",
      body: "Mallinnamme julkaistuja tietullihintoja, vinjettihintoja sekä alueellisia keskimääräisiä polttoaine- ja latausmaksuja. Todelliset kulut vaihtelevat polttoainemarkkinoiden, kausihintojen, vuorokaudenajan hinnoittelun ja ajoneuvoluokan sääntöjen mukaan, joten pidä jokaista lukua hyvin perusteltuna suuntaa-antavana arviona ja varmista tiedot viralliselta palvelulta ennen matkaa.",
    },
    {
      heading: "Myyttekö vinjettejä tai tietulleja?",
      body: "Emme. Emme koskaan myy niitä jälleen. Jokainen tullirivi linkittää suoraan viralliseen operaattoriin – ASFINAG, via.admin.ch, AutoPASS, Telepass, 407 ETR, SunPass ja muut – joten maksat aina oikean hinnan ilman jälleenmyyntikorotusta.",
    },
    {
      heading: "Miten moottoripyörät huomioidaan?",
      body: "Matkailumoottoripyörät hinnoitellaan omana ajoneuvoluokkanaan. Kun operaattorit julkaisevat alennetun moottoripyörätariffin, sovellamme suuntaa-antavaa alennusta, Norjan kaupunkirenkaat näytetään ilmaisina kaksipyöräisille, ja saat kuljettajakohtaisen turvallisuus- ja varustetutkan vuoristosoliin.",
    },
    {
      heading: "Entä matkailuautot ja asuntoautot?",
      body: "Matkailuautot hinnoitellaan painon ja akseliluokan mukaan silloin, kun se on sovellettavissa, ja näytämme korkeus-, pituus- ja painovaroitukset tunneleille, soille ja matalille silloille reitin varrella.",
    },
    {
      heading: "Tuetteko sähköautoja?",
      body: "Kyllä. Valitse Sähkö (EV) ja syötä akkusi koko ja kulutus. Suunnittelemme pikalatauspysähdykset 75 % toimintamatkan turvamarginaalilla ja näytämme verkot, joita matkalla kohtaat – Ionity, Fastned, Tesla Supercharger, Electrify America ja FLO.",
    },
    {
      heading: "Tarvitsenko tilin?",
      body: "Et. Voit suunnitella ja viedä reitin ilman rekisteröitymistä. Oma autotalli tallentaa ajoneuvosi ja matkasi omalle laitteellesi, joten mikään ei poistu selaimestasi, ellet itse päätä jakaa sitä.",
    },
  ],
  note: DISCLAIMER_FI,
  meta: {
    title: "UKK – Tietullit, vinjetit, polttoaine ja sähköauton lataus | AutoVere",
    description:
      "Vastauksia arvioiden tarkkuudesta, virallisista tullipalveluista, moottoripyörä- ja matkailuautoluokista, sähköauton latauksen suunnittelusta ja tileistä.",
  },
};

export const FI_PRIVACY: InfoPageContent = {
  eyebrow: "Tietosuojaseloste",
  title: "Reittisi on sinun asiasi.",
  intro:
    "AutoVerea ylläpitää KM TECH LABS, Kristiansand, Norja. Keräämme vain sen tiedon, joka tarvitaan tarkan kuluarvion antamiseen.",
  sections: [
    {
      heading: "Mitä tallennamme",
      items: [
        "Matkan syötteet (lähtöpiste, määränpää, ajoneuvo ja asetukset), joita käytetään arviosi laskemiseen",
        "Tallennetut ajoneuvot ja matkat – tallennettuna paikallisesti omaan selaimeesi, ei palvelimillemme",
        "Koottua, tunnistamatonta käyttötilastoa suunnittelijan kehittämiseksi",
      ],
    },
    {
      heading: "Mitä emme tee",
      items: [
        "Emme myy tai vuokraa henkilötietoja",
        "Emme seuraa reaaliaikaista sijaintiasi",
        "Emme vaadi tiliä matkan suunnitteluun, viemiseen tai jakamiseen",
      ],
    },
    {
      heading: "Oikeutesi GDPR:n mukaisesti",
      body: "Norjassa/ETA-alueella toimivana palveluntarjoajana noudatamme GDPR:ää. Voit pyytää pääsyä tietoihin, niiden korjaamista, poistamista, käsittelyn rajoittamista, siirtämistä tai vastustaa käsittelyä. Selaimen tallennustilan tyhjentäminen poistaa tallennetut ajoneuvosi ja matkasi välittömästi.",
    },
    {
      heading: "Evästeet ja analytiikka",
      body: "Käytämme välttämätöntä tallennustilaa muistaaksemme alueesi, kielesi ja autotallisi. Mahdollinen analytiikkamme on koottua eikä voi tunnistaa sinua yksilönä.",
    },
    {
      heading: "Yhteystiedot",
      body: "Tietosuojakysymykset: privacy@autovere.com – KM TECH LABS, Kristiansand, Norja. Alueelliset huomautukset: Yhdysvaltain tietosuoja käsitellään sivulla /us/legal ja Kanadan PIPEDA- sekä Québecin Law 25 -oikeudet sivulla /ca/legal.",
    },
  ],
  note: DISCLAIMER_FI,
  meta: {
    title: "Tietosuojaseloste – GDPR, paikallinen tallennus ja tietosi | AutoVere",
    description:
      "Miten KM TECH LABS käsittelee matkan syötteitä, paikallisesti tallennettua autotallidataa, evästeitä ja GDPR-oikeuksiasi AutoVeressa.",
  },
};

export const FI_TERMS: InfoPageContent = {
  eyebrow: "Käyttöehdot",
  title: "Selkeät ehdot, jotta voit suunnitella luottavaisin mielin.",
  intro:
    "Käyttämällä AutoVerea hyväksyt nämä ehdot. Ne varmistavat, että odotukset kuluarvion luonteesta ovat rehelliset – sekä sen, mitä se ei ole.",
  sections: [
    {
      heading: "Arvioita, ei laskuja",
      body: "Kaikki näytetyt kulut ovat suuntaa-antavia arvioita, jotka perustuvat julkaistuihin tariffeihin ja alueellisiin keskihintoihin. Todelliset tietullit, vinjetit, polttoaine, lataus- ja lauttamaksut voivat vaihdella ajoneuvoluokan, kauden, vuorokaudenajan ja operaattorimuutosten mukaan. Varmista tiedot aina viralliselta palvelulta ennen matkaa.",
    },
    {
      heading: "Turvallinen ja lainmukainen käyttö",
      items: [
        "Älä käytä AutoVerea ajon aikana – suunnittele ennen matkaan lähtöä",
        "Noudata paikallista liikennelakia, ajoneuvoluokan sääntöjä sekä sola- ja tunnelirajoituksia",
        "Automaattinen tietojen kaappaus, tulostemme jälleenmyynti tai niiden esittäminen virallisena hinnoitteluna ei ole sallittua",
      ],
    },
    {
      heading: "Kolmannen osapuolen linkit ja palvelut",
      body: "Linkit tietullioperaattoreihin, lauttayhtiöihin ja latausverkkoihin tarjotaan käyttömukavuuden vuoksi. Näillä palveluilla on omat ehtonsa ja hinnoittelunsa, eikä KM TECH LABS vastaa niiden sisällöstä tai tapahtumista.",
    },
    {
      heading: "Vastuunrajoitus",
      body: "AutoVere tarjotaan sellaisenaan (\"as is\"). Lain sallimissa rajoissa KM TECH LABS ei vastaa kuluista, sakoista, myöhästyneistä ylityksistä tai menetyksistä, jotka johtuvat arvioon luottamisesta.",
    },
    {
      heading: "Sovellettava laki",
      body: "Näihin ehtoihin sovelletaan Norjan lakia, ja sovittuna oikeuspaikkana on Kristiansand, rajoittamatta asuinmaasi pakottavaa kuluttajansuojaa.",
    },
  ],
  note: DISCLAIMER_FI,
  meta: {
    title: "Käyttöehdot – arviovastuuvapaus ja kohtuullinen käyttö | AutoVere",
    description:
      "AutoVeren käyttöehdot KM TECH LABSilta: suuntaa-antavat arviot, turvallinen käyttö, kolmannen osapuolen linkit, vastuunrajoitus ja sovellettava laki.",
  },
};
