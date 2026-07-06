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
