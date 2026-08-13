/**
 * Monta o resultado exibido no modal a partir do dimensionamento da brigada.
 *
 * Este arquivo substituiu o antigo `pricing.ts`: o fluxo do filtro não calcula
 * preço, ele qualifica o cliente (isento / quantos brigadistas / qual nível) e
 * decide o destino — link de compra, link com desconto ou WhatsApp.
 */

import {
  ARIELE_WHATSAPP_MESSAGES,
  arieleWhatsappHref,
  HOTMART_BRIGADISTA_HREF,
} from "../constants.ts";
import {
  computeCompanyBrigade,
  computeCondoBrigade,
  computeTunnelBrigade,
  MINIMUM_BRIGADE_MEMBERS,
  type BrigadeResult,
} from "./brigade.ts";
import { getProfileLabel } from "./config.ts";
import { getOccupancy, occupancyLabel } from "./occupancies.ts";
import type { QuoteResult } from "./types.ts";

function toNumber(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

/**
 * Aviso normativo do piso de 3 brigadistas (pedido da Ariele).
 *
 * O número exibido JÁ É o mínimo legal (o piso é aplicado no cálculo, em
 * `requiredResult`), então o aviso não corrige nada na tela: ele explica por que
 * o número é 3 mesmo com a conta da ocupação dando menos.
 */
export const MINIMUM_BRIGADE_NOTICE =
  `A quantidade foi definida como ${MINIMUM_BRIGADE_MEMBERS} pois a norma estabelece este número como o mínimo exigido. ` +
  "Conforme o Art. 16 da IN 28, § 2º: “Quando houver a exigência de brigadista orgânico, o número mínimo " +
  "a ser implementado será de 03 (três) brigadistas orgânicos, independente do previsto no caput " +
  "deste artigo.”";

/**
 * O aviso sai apenas quando o piso foi de fato aplicado — se a conta já dava 3
 * ou mais, não há o que explicar. Isento nunca recebe o aviso (o piso só vale
 * "quando houver a exigência"), o condomínio incluído.
 */
function minimumNotice(brigade: BrigadeResult): string | undefined {
  return brigade.minimumApplied ? MINIMUM_BRIGADE_NOTICE : undefined;
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
  // população — nesse caso não há número a exibir. O condomínio também não tem
  // população: o fluxo calcula por andar e torre, sem estimar moradores.
  if (answers.metros_tunel) {
    summary.push({ label: "Extensão do túnel", value: `${answers.metros_tunel} m` });
  } else if (brigade.population) {
    summary.push({ label: "Funcionários", value: String(brigade.population) });
  }

  return summary;
}

function computeBrigade(answers: Record<string, string>): BrigadeResult {
  if (answers.perfil === "condominio") {
    return computeCondoBrigade({
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

  // Condomínio: o fluxo manda informar a isenção E, ainda assim, oferecer o
  // curso mostrando a quantidade sugerida (1 por andar, por torre). Isento
  // compra avulso, pelo link de inscrição única da Hotmart.
  if (answers.perfil === "condominio") {
    return {
      title: "Seu condomínio é isento",
      summary,
      brigade,
      showBrigadeCount: true,
      info: "Condomínio residencial é dispensado de constituir brigada de incêndio — a lei não exige nenhum brigadista aqui.",
      text: `Os ${brigade.total} acima são uma sugestão nossa, não uma exigência legal: 1 brigadista por andar, em cada torre. Muitos condomínios treinam a equipe mesmo isentos — a inscrição é feita direto pelo nosso link de compra.`,
      ctaLabel: "Quero fazer o curso",
      ctaHref: HOTMART_BRIGADISTA_HREF,
      variant: "exemption",
    };
  }

  // Isento: informar a isenção, mas oferecer o curso pelo link de compra única.
  if (brigade.exempt) {
    return {
      title: "Sua edificação é isenta",
      summary,
      brigade,
      info: brigade.population
        ? "Pela ocupação e pela população informadas, você está dispensado de constituir brigada de incêndio."
        : "Esta ocupação é dispensada de constituir brigada de incêndio, independente da população.",
      text: "Mesmo isento, muitos clientes treinam a equipe por segurança — a inscrição é feita direto pelo nosso link de compra.",
      ctaLabel: "Quero fazer o curso",
      ctaHref: HOTMART_BRIGADISTA_HREF,
      variant: "exemption",
    };
  }

  // Avançado tem aula presencial: precisa ser orçado à parte (nota da Ariele).
  if (brigade.requiresQuote) {
    return {
      title: "Vamos montar seu orçamento",
      summary,
      brigade,
      notice: minimumNotice(brigade),
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
    notice: minimumNotice(brigade),
    text: "Garanta as vagas para a quantidade calculada e receba o certificado reconhecido.",
    ctaLabel: "Garantir as vagas",
    ctaHref: arieleWhatsappHref(ARIELE_WHATSAPP_MESSAGES.compra(brigade)),
    variant: "purchase",
  };
}

/**
 * Resultado da Pessoa Física: compra única imediata, sem filtro — vai direto
 * para o checkout da Hotmart ("Link compra unica" no fluxograma do cliente).
 */
export function buildPessoaFisicaResult(): QuoteResult {
  return {
    title: "Compra individual",
    summary: [],
    hideSummary: true,
    info: "Garanta sua vaga com a compra única do curso.",
    ctaLabel: "Ir para a compra",
    ctaHref: HOTMART_BRIGADISTA_HREF,
    variant: "purchase",
  };
}
