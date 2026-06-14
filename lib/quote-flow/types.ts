export type ProfileType = "condominio" | "empresa" | "pessoa_fisica";

export type FieldType = "selector" | "dropdown";

export type FlowField = {
  id: string;
  type: FieldType;
  label: string;
  options: Array<{ value: string; label: string }>;
  readOnly?: boolean;
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
  price: number;
  priceLabel: string;
  ctaLabel: string;
  ctaHref: string;
  variant: "purchase" | "exemption" | "discount";
};

export type QuoteState = {
  stepId: string;
  answers: Record<string, string>;
};
