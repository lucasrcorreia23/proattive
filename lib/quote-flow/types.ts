import type { BrigadeResult } from "./brigade.ts";

export type ProfileType = "condominio" | "empresa" | "pessoa_fisica";

export type FieldType = "selector" | "dropdown" | "searchable-dropdown" | "number";

export type FlowField = {
  id: string;
  type: FieldType;
  label: string;
  /** Vazio nos campos numéricos. */
  options: Array<{ value: string; label: string }>;
  readOnly?: boolean;
  /** Apenas para `type: "number"`. */
  placeholder?: string;
  min?: number;
  hint?: string;
};

export type FlowStep = {
  id: string;
  title: string;
  subtitle?: string;
  highlightSubtitle?: string;
  fields: FlowField[];
  next?: (answers: Record<string, string>) => string | null;
};

export type QuoteResult = {
  title: string;
  summary: Array<{ label: string; value: string }>;
  info?: string;
  text?: string;
  ctaLabel: string;
  ctaHref: string;
  /**
   * `exemption` — dispensado de brigada (informa a isenção e oferece desconto).
   * `quote` — envolve nível Avançado: aula presencial, orçar à parte no WhatsApp.
   * `purchase` — segue para o link de compra.
   */
  variant: "purchase" | "exemption" | "quote";
  /** Dimensionamento calculado. Ausente na compra direta da Pessoa Física. */
  brigade?: BrigadeResult;
  /** Oculta o bloco de resumo no modal (compra direta, sem filtro). */
  hideSummary?: boolean;
};

export type QuoteState = {
  stepId: string;
  answers: Record<string, string>;
};
