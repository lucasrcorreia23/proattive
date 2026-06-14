import { getOptionLabel, getProfileLabel } from "./config";
import type { QuoteResult } from "./types";

const BASE_PRICES: Record<string, number> = {
  condominio: 4200,
  empresa: 4800,
  pessoa_fisica: 890,
};

const MULTIPLIERS: Record<string, number> = {
  "1-10": 1,
  "11-30": 1.2,
  "31-50": 1.45,
  "51+": 1.8,
  "ate-50": 1,
  "51-100": 1.15,
  "101-200": 1.3,
  "200+": 1.55,
  "1": 1,
  "2-5": 1.4,
  "6-10": 1.8,
  "10+": 2.2,
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function buildQuoteResult(answers: Record<string, string>): QuoteResult {
  const perfil = answers.perfil ?? "empresa";
  const base = BASE_PRICES[perfil] ?? 4800;
  const multiplierKey =
    answers.qtd_funcionarios ??
    answers.qtd_unidades ??
    answers.qtd_participantes ??
    "1";
  const price = Math.round(base * (MULTIPLIERS[multiplierKey] ?? 1));

  const summary = [
    { label: "Perfil", value: getProfileLabel(perfil) },
  ];

  if (answers.tipo_empresa) {
    summary.push({
      label: "Tipo",
      value: getOptionLabel("tipo_empresa", answers.tipo_empresa, `step-2-${perfil}`),
    });
  }
  if (answers.tipo_condominio) {
    summary.push({
      label: "Tipo",
      value: getOptionLabel("tipo_condominio", answers.tipo_condominio, `step-2-${perfil}`),
    });
  }
  if (answers.destinacao) {
    summary.push({
      label: "Destinação",
      value: getOptionLabel("destinacao", answers.destinacao, `step-2-${perfil}`),
    });
  }
  if (answers.qtd_funcionarios) {
    summary.push({
      label: "Funcionários",
      value: getOptionLabel("qtd_funcionarios", answers.qtd_funcionarios, `step-2-${perfil}`),
    });
  }
  if (answers.qtd_unidades) {
    summary.push({
      label: "Unidades",
      value: getOptionLabel("qtd_unidades", answers.qtd_unidades, `step-2-${perfil}`),
    });
  }
  if (answers.modalidade) {
    summary.push({
      label: "Modalidade",
      value: getOptionLabel("modalidade", answers.modalidade, `step-2-${perfil}`),
    });
  }
  if (answers.qtd_participantes) {
    summary.push({
      label: "Participantes",
      value: getOptionLabel("qtd_participantes", answers.qtd_participantes, `step-2-${perfil}`),
    });
  }

  const isExempt = perfil === "pessoa_fisica" && answers.qtd_participantes === "1";
  const variant = isExempt ? "exemption" : perfil === "pessoa_fisica" ? "discount" : "purchase";

  return {
    title: isExempt ? "Isenção disponível para participante individual" : "Seu orçamento personalizado",
    summary,
    info: isExempt
      ? "Para 1 participante, oferecemos condição especial com desconto."
      : "Treinamento completo com certificação reconhecida.",
    text: "Valor estimado com base nas informações selecionadas.",
    price,
    priceLabel: formatCurrency(price),
    ctaLabel: isExempt ? "Ver opção com desconto" : "Solicitar inscrição",
    ctaHref: isExempt
      ? "https://proattive.com.br/checkout-desconto"
      : "https://proattive.com.br/checkout",
    variant,
  };
}
