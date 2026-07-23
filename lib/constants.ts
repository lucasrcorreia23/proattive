export const SITE = {
  phone: "+55 (48) 99968-1883",
  phoneHref: "5548999681883",
  whatsappHref: "https://wa.me/5548999681883",
  instagramHref: "https://www.instagram.com/proattive",
  address:
    "Rua Elizeu Di Bernardi, 34. Kplatz Corporate - Sala 607 - Campinas São José - 88101-050",
  copyright: "©ProAttive 2024. Todos os direitos reservados.",
} as const;

export const NAV_LINKS = [
  { label: "HOME", href: "https://proattive.com.br/", external: true },
  { label: "QUEM SOMOS", href: "https://proattive.com.br/#quem-somos", external: true },
  { label: "SOLUÇÕES", href: "https://proattive.com.br/#solucoes", external: true },
  { label: "POR QUE PROATTIVE?", href: "https://proattive.com.br/#porque", external: true },
  { label: "CASES", href: "https://proattive.com.br/#cases", external: true },
  { label: "CLIENTES", href: "https://proattive.com.br/#clientes", external: true },
  { label: "CONTATO", href: "https://proattive.com.br/#contato", external: true },
  { label: "BLOG", href: "https://proattive.com.br/blog/", external: true },
  { label: "CURSOS", href: "/", external: false },
] as const;

export const ANCHOR_LINKS = [
  { label: "Início", href: "#" },
  { label: "Módulos", href: "#modulos" },
  { label: "Quem pode fazer?", href: "#publico" },
  { label: "Vantagens", href: "#vantagens" },
  { label: "FAQ", href: "#faq" },
  { label: "Depoimentos", href: "#depoimentos" },
] as const;

export const QUOTE_SECTION_ID = "orcamento";

/** Rota da landing do curso (página realocada) e destino dos CTAs da home. */
export const MATRICULA_PATH = "/matricula";
export const MATRICULA_QUOTE_HREF = `${MATRICULA_PATH}#${QUOTE_SECTION_ID}`;

/** Contato comercial da Ariele (Proattive) para captação dos cursos. */
export const ARIELE_WHATSAPP = "5548991664962";

/** Contato da Deise (Proattive) — mesmo número do site — para Mentoria e Consultoria. */
export const DEISE_WHATSAPP = SITE.phoneHref;

/** Monta um link do WhatsApp com uma mensagem opcional pré-preenchida. */
function whatsappHref(number: string, message?: string) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Link do WhatsApp da Ariele (cursos) com mensagem opcional pré-preenchida. */
export function arieleWhatsappHref(message?: string) {
  return whatsappHref(ARIELE_WHATSAPP, message);
}

/** Link do WhatsApp da Deise (mentoria/consultoria) com mensagem opcional pré-preenchida. */
export function deiseWhatsappHref(message?: string) {
  return whatsappHref(DEISE_WHATSAPP, message);
}

/**
 * Checkout do curso de Carros Elétricos na Hotmart — único curso vendido
 * direto pelo site. Brigadista e Projeto Preventivo passam pelo WhatsApp.
 */
export const HOTMART_CARROS_ELETRICOS_HREF = "https://go.hotmart.com/R106034478B";

type BrigadeLike = {
  total: number;
  occupancyCode: string;
  breakdown: Array<{ level: string; count: number }>;
};

function describeBrigade(brigade: BrigadeLike) {
  const levels: Record<string, string> = {
    basico: "Básico",
    intermediario: "Intermediário",
    avancado: "Avançado",
  };
  return brigade.breakdown
    .map((entry) => `${entry.count} ${levels[entry.level] ?? entry.level}`)
    .join(" + ");
}

/**
 * Mensagens pré-preenchidas do WhatsApp para cada desfecho do filtro. O curso
 * de Brigadista não é vendido pelo site: todo caminho termina no atendimento
 * da Ariele, com o resultado do filtro já escrito na mensagem.
 */
export const ARIELE_WHATSAPP_MESSAGES = {
  isento:
    "Olá! Fiz o filtro no site e minha edificação é isenta de brigada, mas quero treinar a equipe com a condição especial.",
  pessoaFisica: "Olá! Quero fazer a compra individual (Pessoa Física) do curso.",
  avancado: (brigade: BrigadeLike) =>
    `Olá! Fiz o filtro no site (ocupação ${brigade.occupancyCode}) e preciso de ${brigade.total} brigadista(s): ${describeBrigade(brigade)}. Como envolve nível Avançado, quero um orçamento.`,
  compra: (brigade: BrigadeLike) =>
    `Olá! Fiz o filtro no site (ocupação ${brigade.occupancyCode}) e preciso de ${brigade.total} brigadista(s): ${describeBrigade(brigade)}. Quero garantir as vagas.`,
} as const;
