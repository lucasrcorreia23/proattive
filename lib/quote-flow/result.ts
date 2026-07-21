/**
 * Monta o resultado exibido no modal a partir do dimensionamento da brigada.
 *
 * Este arquivo substituiu o antigo `pricing.ts`: o fluxo do filtro não calcula
 * preço, ele qualifica o cliente (isento / quantos brigadistas / qual nível) e
 * decide o destino — link de compra, link com desconto ou WhatsApp.
 */

import { ARIELE_WHATSAPP_MESSAGES, arieleWhatsappHref } from "../constants.ts";
import {
  computeCompanyBrigade,
  computeCondoBrigade,
  computeTunnelBrigade,
  type BrigadeResult,
} from "./brigade.ts";
import { getProfileLabel } from "./config.ts";
import { getOccupancy, occupancyLabel } from "./occupancies.ts";
import type { QuoteResult } from "./types.ts";

function toNumber(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function buildSummary(
  answers: Record<string, string>,
  brigade: BrigadeResult,
): QuoteResult["summary"] {
  const summary = [
    { label: "Perfil", value: getProfileLabel(answers.perfil ?? "") },
  ];

  const occupancy = getOccupancy(brigade.occupancyCode);
  if (occupancy) {
    summary.push({ label: "Ocupação", value: occupancyLabel(occupancy) });
  }

  // Ocupações sempre isentas (J-1, M-4, M-11) nem chegam a perguntar a
  // população — nesse caso não há número a exibir.
  if (answers.metros_tunel) {
    summary.push({ label: "Extensão do túnel", value: `${answers.metros_tunel} m` });
  } else if (brigade.population) {
    const label = answers.perfil === "condominio" ? "População estimada" : "Funcionários";
    summary.push({ label, value: String(brigade.population) });
  }

  return summary;
}

function computeBrigade(answers: Record<string, string>): BrigadeResult {
  if (answers.perfil === "condominio") {
    return computeCondoBrigade({
      apartamentosPorAndar: toNumber(answers.apartamentos_por_andar),
      andaresPorBloco: toNumber(answers.andares_por_bloco),
      blocos: toNumber(answers.blocos_por_torre),
    });
  }

  const code = answers.ocupacao ?? "";
  const occupancy = getOccupancy(code);

  if (occupancy?.rule.kind === "tunnel") {
    return computeTunnelBrigade(toNumber(answers.metros_tunel));
  }

  return computeCompanyBrigade(code, toNumber(answers.qtd_funcionarios));
}

export function buildQuoteResult(answers: Record<string, string>): QuoteResult {
  const brigade = computeBrigade(answers);
  const summary = buildSummary(answers, brigade);

  // Isento: informar a isenção, mas oferecer o curso com desconto.
  if (brigade.exempt) {
    return {
      title: "Sua edificação é isenta",
      summary,
      brigade,
      info: brigade.population
        ? "Pela ocupação e pela população informadas, você está dispensado de constituir brigada de incêndio."
        : "Esta ocupação é dispensada de constituir brigada de incêndio, independente da população.",
      text: "Mesmo isento, muitos clientes treinam a equipe por segurança — e temos condição especial para isso.",
      ctaLabel: "Quero o curso com desconto",
      ctaHref: arieleWhatsappHref(ARIELE_WHATSAPP_MESSAGES.isento),
      variant: "exemption",
    };
  }

  // Avançado tem aula presencial: precisa ser orçado à parte (nota da Ariele).
  if (brigade.requiresQuote) {
    return {
      title: "Vamos montar seu orçamento",
      summary,
      brigade,
      text: "O nível Avançado tem aulas presenciais e é orçado à parte. Fale com a nossa equipe para fechar o formato e a data.",
      ctaLabel: "Falar com a equipe",
      ctaHref: arieleWhatsappHref(ARIELE_WHATSAPP_MESSAGES.avancado(brigade)),
      variant: "quote",
    };
  }

  return {
    title: "Sua brigada de incêndio",
    summary,
    brigade,
    text: "Garanta as vagas para a quantidade calculada e receba o certificado reconhecido.",
    ctaLabel: "Garantir as vagas",
    ctaHref: arieleWhatsappHref(ARIELE_WHATSAPP_MESSAGES.compra(brigade)),
    variant: "purchase",
  };
}

/** Resultado da Pessoa Física: popup de compra única imediato, sem filtro. */
export function buildPessoaFisicaResult(): QuoteResult {
  return {
    title: "Compra individual",
    summary: [],
    hideSummary: true,
    info: "Garanta sua vaga com a compra única do curso.",
    ctaLabel: "Quero me inscrever",
    ctaHref: arieleWhatsappHref(ARIELE_WHATSAPP_MESSAGES.pessoaFisica),
    variant: "purchase",
  };
}
