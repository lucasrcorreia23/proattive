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
  { label: "HOME", href: "https://proattive.com.br/", external: true, highlight: false },
  { label: "QUEM SOMOS", href: "https://proattive.com.br/#quem-somos", external: true, highlight: false },
  { label: "SOLUÇÕES", href: "https://proattive.com.br/#solucoes", external: true, highlight: false },
  { label: "POR QUE PROATTIVE?", href: "https://proattive.com.br/#porque", external: true, highlight: false },
  { label: "CASES", href: "https://proattive.com.br/#cases", external: true, highlight: false },
  { label: "CLIENTES", href: "https://proattive.com.br/#clientes", external: true, highlight: false },
  { label: "CONTATO", href: "https://proattive.com.br/#contato", external: true, highlight: false },
  { label: "BLOG", href: "https://proattive.com.br/blog/", external: true, highlight: false },
  // CURSOS = este site. Estilizado como pílula (mesmo visual do menu do site principal).
  { label: "CURSOS", href: "/", external: false, highlight: true },
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
 * Checkout do curso de Carros Elétricos na Hotmart. Projeto Preventivo continua
 * passando pelo WhatsApp.
 */
export const HOTMART_CARROS_ELETRICOS_HREF = "https://go.hotmart.com/R106034478B";

/**
 * Checkout do curso de Brigadista na Hotmart — link de inscrição única. Usado
 * na compra da Pessoa Física e nos desfechos de isenção (empresa e condomínio),
 * que compram avulso. Turmas obrigatórias seguem orçadas pela Ariele.
 */
export const HOTMART_BRIGADISTA_HREF = "https://pay.hotmart.com/R106035323R";

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
 * Mensagens pré-preenchidas do WhatsApp para os desfechos do filtro que passam
 * pelo atendimento da Ariele — turma obrigatória (compra) e nível Avançado
 * (orçamento), com o resultado do filtro já escrito na mensagem.
 *
 * Pessoa Física e isentos NÃO estão aqui: compram avulso pelo link da Hotmart
 * (`HOTMART_BRIGADISTA_HREF`).
 */
export const ARIELE_WHATSAPP_MESSAGES = {
  avancado: (brigade: BrigadeLike) =>
    `Olá! Fiz o filtro no site (ocupação ${brigade.occupancyCode}) e preciso de ${brigade.total} brigadista(s): ${describeBrigade(brigade)}. Como envolve nível Avançado, quero um orçamento.`,
  compra: (brigade: BrigadeLike) =>
    `Olá! Fiz o filtro no site (ocupação ${brigade.occupancyCode}) e preciso de ${brigade.total} brigadista(s): ${describeBrigade(brigade)}. Quero garantir as vagas.`,
} as const;
