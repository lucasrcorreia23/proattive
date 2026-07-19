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
 * e da Pessoa Física apontam para o WhatsApp da Ariele (ver app/page.tsx e pricing.ts).
 */
export const HOTMART_CARROS_ELETRICOS_HREF = "";
