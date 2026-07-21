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
  { label: "HOME", href: "#" },
  { label: "QUEM SOMOS", href: "#" },
  { label: "SOLUÇÕES", href: "#" },
  { label: "POR QUE PROATTIVE?", href: "#" },
  { label: "CASES", href: "#" },
  { label: "CLIENTES", href: "#" },
  { label: "CONTATO", href: "#" },
  { label: "BLOG", href: "#" },
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

/** Monta o link do WhatsApp da Ariele com uma mensagem opcional pré-preenchida. */
export function arieleWhatsappHref(message?: string) {
  const base = `https://wa.me/${ARIELE_WHATSAPP}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * TODO(Ariele): substituir pelo link real da Hotmart (curso Carros Elétricos /
 * compra única da Pessoa Física). Enquanto não chega, os CTAs de Carros Elétricos
 * e da Pessoa Física apontam para o WhatsApp da Ariele (ver app/page.tsx e result.ts).
 */
export const HOTMART_CARROS_ELETRICOS_HREF = "";

/** Checkout do curso de Brigadista na Hotmart. */
export const HOTMART_BRIGADISTA_HREF = "https://go.hotmart.com/R106034478B";

/**
 * O fluxo pede "apresentar link para a quantidade de acordo com o cálculo".
 * `quantity` é o parâmetro de checkout da Hotmart; se o produto não estiver
 * configurado para venda de múltiplas unidades ele é simplesmente ignorado.
 * TODO(Ariele): confirmar no painel se o produto aceita quantidade > 1.
 */
export function hotmartBrigadistaHref(quantity?: number) {
  if (!quantity || quantity <= 1) return HOTMART_BRIGADISTA_HREF;
  return `${HOTMART_BRIGADISTA_HREF}?quantity=${quantity}`;
}

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
 * Mensagens pré-preenchidas do WhatsApp, para os desfechos do filtro que NÃO
 * vão direto para a Hotmart: isenção (precisa do link com desconto) e nível
 * Avançado (aula presencial, orçado à parte).
 */
export const ARIELE_WHATSAPP_MESSAGES = {
  isento:
    "Olá! Fiz o filtro no site e minha edificação é isenta de brigada, mas quero treinar a equipe com a condição especial.",
  avancado: (brigade: BrigadeLike) =>
    `Olá! Fiz o filtro no site (ocupação ${brigade.occupancyCode}) e preciso de ${brigade.total} brigadista(s): ${describeBrigade(brigade)}. Como envolve nível Avançado, quero um orçamento.`,
} as const;
