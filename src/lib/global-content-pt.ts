import type { InfoPageContent } from "@/lib/info-content";

const DISCLAIMER = "Estimativas indicativas — confirme sempre nos portais oficiais.";

export const PT_HOW_IT_WORKS: InfoPageContent = {
  eyebrow: "Como funciona",
  title: "De uma ideia inicial a uma viagem de carro com os custos calculados, em três passos simples.",
  intro:
    "A AutoVere transforma uma origem e um destino num quadro de custos transparente e transfronteiriço — portagens, vinhetas, combustível, carregamento e ferries — para carros, autocaravanas e motas de viagem.",
  sections: [
    {
      heading: "1 — Conte-nos a viagem",
      body: "Indique a origem e o destino, escolha o tipo de veículo e a fonte de combustível ou energia, e defina as suas preferências de rota, como desvios panorâmicos, evitar portagens ou incluir ferries.",
      items: [
        "Perfis para carro, autocaravana/campervan ou mota de viagem",
        "Gasolina, gasóleo ou elétrico, com os seus próprios dados de depósito, bateria e consumo",
        "Dispositivos de telemática como AutoPASS, Telepass, Bip&Go, SunPass ou E-ZPass",
      ],
    },
    {
      heading: "2 — Calculamos o custo real de cada quilómetro",
      body: "Cada país ou estado do seu percurso é calculado separadamente, de acordo com o seu próprio sistema de portagens — vinhetas eletrónicas, barreiras por distância, portagens urbanas ou autoestradas gratuitas — juntamente com os preços locais de combustível e carregamento rápido.",
      items: [
        "Descrição de portagens e vinhetas país a país, com detalhe de cada ponto de cobrança",
        "Descontos para motas aplicados sempre que os operadores publicam tarifas reduzidas",
        "Custos de ferries e passagens de montanha apresentados como itens separados",
        "Otimizador inteligente de combustível e carregamento elétrico, com uma margem de segurança de 75% da autonomia",
      ],
    },
    {
      heading: "3 — Parta em viagem",
      body: "Exporte um ficheiro GPX para o seu GPS, guarde o itinerário n'A Minha Garagem ou partilhe-o com os seus companheiros de viagem. Cada portagem tem uma ligação direta ao portal oficial, para poder pagar antes de atravessar a fronteira.",
      links: [
        { label: "ASFINAG (Áustria)", url: "https://www.asfinag.at/" },
        { label: "AutoPASS (Noruega)", url: "https://www.autopass.no/" },
        { label: "Telepass (Itália)", url: "https://www.telepass.com/" },
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Como Funciona a AutoVere — Planeamento de Custos de Viagem Transfronteiriços",
    description:
      "Veja como a AutoVere calcula portagens, vinhetas, combustível, carregamento elétrico e ferries país a país para carros, autocaravanas e motas de viagem.",
  },
};

export const PT_PRICING: InfoPageContent = {
  eyebrow: "Preços",
  title: "Planeie à vontade. Só suba de plano quando a viagem ficar mais ambiciosa.",
  intro:
    "O planeamento de viagens do dia a dia é gratuito. Os planos pagos destinam-se a quem vive no seu veículo durante semanas e quer um planeamento de rotas mais avançado, exportações offline e viagens guardadas sem limite.",
  sections: [
    {
      heading: "Explorer — Gratuito",
      body: "Tudo o que precisa para uma escapadela de fim de semana ou uma travessia entre dois países.",
      items: [
        "Estimativas de viagem ilimitadas na Europa, nos Estados Unidos e no Canadá",
        "Descrição de portagens, vinhetas e ferries por país e por estado",
        "Estimativas de combustível e carregamento elétrico com ligações aos portais oficiais",
        "Até 3 veículos guardados e 5 viagens guardadas n'A Minha Garagem",
      ],
    },
    {
      heading: "Voyager — 4,90 € / mês",
      body: "Para a grande viagem de verão, a volta pelos fiordes e a travessia de costa a costa.",
      items: [
        "Veículos e viagens guardados sem limite",
        "Exportação GPX com pontos de portagem e carregamento assinalados",
        "Sugestões inteligentes de poupança em combustível e alertas para troços longos",
        "Atualizações prioritárias sempre que os preços de portagens ou vinhetas mudam",
      ],
    },
    {
      heading: "Fleet & Partners — a partir de 29 € / mês",
      body: "Para frotas de aluguer, concessionários de autocaravanas, clubes de motociclismo e operadores turísticos.",
      items: [
        "Perfis para vários veículos e itinerários partilhados com a sua equipa",
        "Folhas de viagem personalizadas para entregar aos seus clientes",
        "Acesso à API de estimativas de custos (atualmente em pré-visualização privada)",
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Preços — Planeamento de Viagens Gratuito, Plano Voyager Opcional | AutoVere",
    description:
      "A AutoVere é gratuita para o planeamento de viagens do dia a dia. Os planos Voyager e Fleet acrescentam viagens guardadas sem limite, exportação GPX e ferramentas para parceiros.",
  },
};

export const PT_FAQ: InfoPageContent = {
  eyebrow: "Perguntas frequentes",
  title: "Tudo o que os viajantes nos perguntam antes de partir.",
  intro:
    "Respostas diretas sobre como construímos as nossas estimativas, de onde vêm os dados e o que ainda precisa de comprar por sua conta.",
  sections: [
    {
      heading: "Qual é o grau de precisão das estimativas de custos?",
      body: "Baseamo-nos em tarifas de portagem publicadas, preços de vinhetas e preços médios regionais de combustível e carregamento. Os custos reais variam com o mercado dos combustíveis, tarifas sazonais, preços por hora do dia e regras de classe de veículo, por isso encare cada valor como uma indicação bem fundamentada e confirme sempre no portal oficial antes de viajar.",
    },
    {
      heading: "Vendem vinhetas ou passes de portagem?",
      body: "Não. Nunca revendemos, propositadamente. Cada portagem tem uma ligação direta ao operador oficial — ASFINAG, via.admin.ch, AutoPASS, Telepass, 407 ETR, SunPass e outros — para pagar sempre o preço real, sem margem de revenda.",
    },
    {
      heading: "Como são tratadas as motas?",
      body: "As motas de viagem são calculadas como uma classe de veículo própria. Onde os operadores publicam tarifas reduzidas para motas, aplicamos um desconto indicativo, as portagens urbanas norueguesas são apresentadas como gratuitas para duas rodas, e tem à disposição um alerta de segurança e equipamento específico para motociclistas nas passagens de montanha.",
    },
    {
      heading: "E as autocaravanas e campervans?",
      body: "As autocaravanas são calculadas por peso e classe de eixo sempre que aplicável, e mostramos avisos de altura, comprimento e peso para túneis, passagens e pontes baixas ao longo do percurso.",
    },
    {
      heading: "Têm suporte para veículos elétricos?",
      body: "Sim. Escolha Elétrico (EV) e indique a capacidade da bateria e o consumo. Planeamos as paragens de carregamento rápido com uma margem de segurança de 75% da autonomia e mostramos as redes que vai encontrar — Ionity, Fastned, Tesla Supercharger, Electrify America e FLO.",
    },
    {
      heading: "Preciso de ter conta?",
      body: "Não. Pode planear e exportar sem se registar. A Minha Garagem guarda os seus veículos e viagens no seu próprio dispositivo, por isso nada sai do seu navegador a não ser que opte por partilhar.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Perguntas Frequentes — Portagens, Vinhetas, Combustível e Carregamento EV | AutoVere",
    description:
      "Respostas sobre a precisão das estimativas, portais oficiais de portagens, classes para motas e autocaravanas, planeamento de carregamento EV e contas.",
  },
};

export const PT_PARTNERS: InfoPageContent = {
  eyebrow: "Parceiros",
  title: "Trabalhamos com quem mantém a estrada em movimento.",
  intro:
    "A AutoVere liga-se a operadores oficiais de portagens e colabora com empresas de viagens, aluguer e motociclismo em toda a Europa, nos Estados Unidos e no Canadá.",
  sections: [
    {
      heading: "Operadores oficiais de portagens e vinhetas a que nos ligamos",
      body: "Cada compra é feita diretamente no site do operador. Nunca atuamos como revendedores.",
      links: [
        { label: "ASFINAG — Áustria", url: "https://www.asfinag.at/" },
        { label: "via.admin.ch — Suíça", url: "https://via.admin.ch/" },
        { label: "AutoPASS — Noruega", url: "https://www.autopass.no/" },
        { label: "Telepass — Itália", url: "https://www.telepass.com/" },
        { label: "DARS — Eslovénia", url: "https://www.dars.si/" },
        { label: "407 ETR — Ontário", url: "https://www.407etr.com/" },
        { label: "SunPass — Florida", url: "https://www.sunpass.com/" },
      ],
    },
    {
      heading: "Quem trabalha connosco",
      items: [
        "Frotas de aluguer de autocaravanas e campervans que procuram orçamentos de viagem transparentes",
        "Operadores turísticos e clubes de motociclismo que planeiam rotas alpinas e pelos fiordes",
        "Redes de carregamento elétrico e aplicações de planeamento de rotas",
        "Entidades de turismo que promovem passagens panorâmicas, estradas costeiras e travessias de ferry",
      ],
    },
    {
      heading: "Trabalhe connosco",
      body: "A KM TECH LABS tem sede em Kristiansand, na Noruega. Se gere uma frota, um negócio turístico ou um serviço de portagens e quer falar sobre integração, co-marketing ou parcerias de dados, contacte-nos através de partners@autovere.com.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Parceiros — Operadores Oficiais de Portagens e Parceiros de Viagem | AutoVere",
    description:
      "A AutoVere liga-se diretamente a operadores oficiais de portagens e vinhetas, e colabora com frotas de aluguer, operadores turísticos e redes de carregamento.",
  },
};

export const PT_PRIVACY: InfoPageContent = {
  eyebrow: "Política de privacidade",
  title: "A sua rota é um assunto seu.",
  intro:
    "A AutoVere é operada pela KM TECH LABS, Kristiansand, Noruega. Mantemos a recolha de dados no mínimo necessário para lhe dar uma estimativa de custos precisa.",
  sections: [
    {
      heading: "O que guardamos",
      items: [
        "Dados da viagem (origem, destino, veículo e preferências) usados para gerar a sua estimativa",
        "Veículos e viagens guardados — armazenados localmente no seu navegador, não nos nossos servidores",
        "Estatísticas de utilização agregadas e não identificáveis, para melhorar o planeador",
      ],
    },
    {
      heading: "O que não fazemos",
      items: [
        "Não vendemos nem cedemos dados pessoais",
        "Não seguimos a sua localização em tempo real",
        "Não exigimos conta para planear, exportar ou partilhar uma viagem",
      ],
    },
    {
      heading: "Os seus direitos ao abrigo do RGPD",
      body: "Como operador sediado na Noruega/EEE, cumprimos o RGPD. Pode solicitar acesso, retificação, apagamento, limitação, portabilidade dos seus dados, ou opor-se ao tratamento. Ao limpar o armazenamento do seu navegador remove imediatamente os veículos e viagens guardados.",
    },
    {
      heading: "Cookies e análise de dados",
      body: "Usamos armazenamento essencial para memorizar a sua região, idioma e garagem. Qualquer análise que realizamos é agregada e não permite identificá-lo individualmente.",
    },
    {
      heading: "Contacto",
      body: "Questões de privacidade: privacy@autovere.com — KM TECH LABS, Kristiansand, Noruega. Avisos regionais: a privacidade nos Estados Unidos está descrita em /us/legal, e os direitos ao abrigo da PIPEDA canadiana e da Lei 25 do Quebeque estão descritos em /ca/legal.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Política de Privacidade — RGPD, Armazenamento Local e os Seus Dados | AutoVere",
    description:
      "Como a KM TECH LABS trata os dados de viagem, os dados de garagem guardados localmente, os cookies e os seus direitos ao abrigo do RGPD na AutoVere.",
  },
};

export const PT_TERMS: InfoPageContent = {
  eyebrow: "Termos de utilização",
  title: "Condições claras, para planear com confiança.",
  intro:
    "Ao utilizar a AutoVere, aceita estas condições. Existem para manter expectativas honestas sobre o que é — e o que não é — uma estimativa de custos.",
  sections: [
    {
      heading: "Estimativas, não faturas",
      body: "Todos os custos apresentados são estimativas indicativas, baseadas em tarifas publicadas e preços médios regionais. As portagens, vinhetas, combustível, carregamento e tarifas de ferry reais podem variar consoante a classe do veículo, a época do ano, a hora do dia e alterações dos operadores. Confirme sempre no portal oficial antes de viajar.",
    },
    {
      heading: "Utilização segura e lícita",
      items: [
        "Não utilize a AutoVere enquanto conduz — planeie antes de partir",
        "Respeite o código da estrada local, as regras de classe de veículo e as restrições de passagens ou túneis",
        "Não é permitido fazer scraping automatizado, revender os nossos resultados nem apresentá-los como preços oficiais",
      ],
    },
    {
      heading: "Ligações e serviços de terceiros",
      body: "As ligações a operadores de portagens, companhias de ferry e redes de carregamento são disponibilizadas por conveniência. Esses serviços têm as suas próprias condições e preços, e a KM TECH LABS não é responsável pelo respetivo conteúdo ou transações.",
    },
    {
      heading: "Responsabilidade",
      body: "A AutoVere é fornecida “tal como está”. Na medida permitida por lei, a KM TECH LABS não é responsável por custos, multas, ligações perdidas ou perdas decorrentes de confiança numa estimativa.",
    },
    {
      heading: "Lei aplicável",
      body: "Estas condições regem-se pela lei norueguesa, com Kristiansand como foro competente acordado, sem prejuízo das proteções obrigatórias do consumidor previstas no seu país de residência.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Termos de Utilização — Aviso sobre Estimativas e Utilização Justa | AutoVere",
    description:
      "Os termos de utilização da AutoVere pela KM TECH LABS: estimativas indicativas, utilização segura, ligações de terceiros, responsabilidade e lei aplicável.",
  },
};
