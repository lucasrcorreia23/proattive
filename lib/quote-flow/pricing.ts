import { arieleWhatsappHref } from "@/lib/constants";
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
  "1": 1,
  "2-5": 1.4,
  "6-10": 1.8,
  "10+": 2.2,
};

// TODO(Ariele): calibrar os fatores de preço do condomínio (valores placeholder).
// As chaves omitidas (ex.: "1", "1-4") caem no fallback 1.
const COND_FACTOR: Record<string, number> = {
  // apartamentos por andar
  "1-2": 1,
  "3-4": 1.15,
  "5-6": 1.3,
  "7+": 1.5,
  // blocos por torre
  "2": 1.2,
  "3": 1.4,
  "4+": 1.7,
  // andares por bloco
  "5-8": 1.2,
  "9-12": 1.45,
  "13+": 1.7,
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
  let multiplier: number;
  if (perfil === "condominio") {
    // TODO(Ariele): definir a regra real de precificação do condomínio.
    multiplier =
      (COND_FACTOR[answers.apartamentos_por_andar ?? ""] ?? 1) *
      (COND_FACTOR[answers.blocos_por_torre ?? ""] ?? 1) *
      (COND_FACTOR[answers.andares_por_bloco ?? ""] ?? 1);
  } else {
    const multiplierKey = answers.qtd_funcionarios ?? answers.qtd_participantes ?? "1";
    multiplier = MULTIPLIERS[multiplierKey] ?? 1;
  }
  const price = Math.round(base * multiplier);

  const summary = [
    { label: "Perfil", value: getProfileLabel(perfil) },
  ];

  if (answers.tipo_empresa) {
    summary.push({
      label: "Tipo",
      value: getOptionLabel("tipo_empresa", answers.tipo_empresa, `step-2-${perfil}`),
    });
  }
  if (answers.apartamentos_por_andar) {
    summary.push({
      label: "Apartamentos por andar",
      value: getOptionLabel(
        "apartamentos_por_andar",
        answers.apartamentos_por_andar,
        `step-2-${perfil}`,
      ),
    });
  }
  if (answers.blocos_por_torre) {
    summary.push({
      label: "Blocos por torre",
      value: getOptionLabel("blocos_por_torre", answers.blocos_por_torre, `step-2-${perfil}`),
    });
  }
  if (answers.andares_por_bloco) {
    summary.push({
      label: "Andares por bloco",
      value: getOptionLabel("andares_por_bloco", answers.andares_por_bloco, `step-2-${perfil}`),
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
  return {
    title: "Seu orçamento personalizado",
    summary,
    info: "Treinamento completo com certificação reconhecida.",
    text: "Valor estimado com base nas informações selecionadas.",
    price,
    priceLabel: formatCurrency(price),
    ctaLabel: "Solicitar inscrição",
    // TODO(Ariele): confirmar o destino do orçamento (checkout próprio ou WhatsApp).
    ctaHref: arieleWhatsappHref(
      "Olá! Fiz uma simulação de orçamento no site e quero prosseguir.",
    ),
    variant: "purchase",
  };
}

/**
 * Resultado da Pessoa Física: popup de compra única imediato, sem orçamento.
 * TODO(Ariele): trocar o ctaHref pelo link da Hotmart (compra única) quando disponível.
 */
export function buildPessoaFisicaResult(): QuoteResult {
  return {
    title: "Compra individual",
    summary: [],
    hideSummary: true,
    hidePrice: true,
    info: "Garanta sua vaga com a compra única do curso.",
    price: 0,
    priceLabel: "",
    ctaLabel: "Comprar agora",
    ctaHref: arieleWhatsappHref(
      "Olá! Quero fazer a compra individual (Pessoa Física) do curso.",
    ),
    variant: "purchase",
  };
}
