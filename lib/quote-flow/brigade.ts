/**
 * Dimensionamento da brigada de incêndio a partir do fluxo de filtro.
 *
 * Funções puras, sem dependência de React ou de UI — é aqui que mora a regra
 * de negócio e é isto que os testes cobrem.
 */

import {
  TUNNEL_BANDS,
  getOccupancy,
  type CourseLevel,
  type LevelShare,
  type Occupancy,
} from "./occupancies.ts";

export type BrigadeBreakdown = { level: CourseLevel; count: number };

export type BrigadeResult = {
  /** Cliente dispensado de constituir brigada. */
  exempt: boolean;
  /**
   * Total de brigadistas a treinar, JÁ com o piso legal de 3 aplicado quando há
   * exigência de brigada (ver `MINIMUM_BRIGADE_MEMBERS`). 0 quando isento —
   * exceto no condomínio, que é isento mas recebe uma quantidade SUGERIDA
   * (ver `computeCondoBrigade`).
   */
  total: number;
  /** Distribuição do `total` entre os níveis de curso. */
  breakdown: BrigadeBreakdown[];
  /**
   * Envolve nível Avançado ⇒ não pode ser vendido online: tem aula presencial
   * e precisa ser orçado à parte (nota da Ariele no fluxo).
   */
  requiresQuote: boolean;
  /**
   * O piso legal de 3 elevou o número: a conta da ocupação deu menos que isso.
   * É o que dispara o aviso normativo na tela (ver `MINIMUM_BRIGADE_NOTICE`).
   * Sempre `false` para isentos e para o condomínio (sugestão, não exigência).
   */
  minimumApplied: boolean;
  /** População considerada no cálculo (ausente nos ramos túnel e condomínio). */
  population?: number;
  occupancyCode: string;
};

/**
 * Distribui `total` brigadistas entre os níveis respeitando os percentuais.
 *
 * Arredonda cada fatia para baixo e devolve as sobras ao nível de MAIOR
 * participação, garantindo que a soma feche exatamente com `total`. Níveis que
 * ficariam zerados são omitidos.
 */
export function splitByLevel(total: number, levels: LevelShare[]): BrigadeBreakdown[] {
  if (total <= 0) return [];
  if (levels.length === 1) return [{ level: levels[0].level, count: total }];

  const counts = levels.map((entry) => ({
    level: entry.level,
    share: entry.share,
    count: Math.floor(total * entry.share),
  }));

  let remainder = total - counts.reduce((sum, entry) => sum + entry.count, 0);
  const order = [...counts].sort((a, b) => b.share - a.share);
  let index = 0;
  while (remainder > 0) {
    order[index % order.length].count += 1;
    remainder -= 1;
    index += 1;
  }

  return counts
    .filter((entry) => entry.count > 0)
    .map(({ level, count }) => ({ level, count }));
}

function hasAdvanced(breakdown: BrigadeBreakdown[]): boolean {
  return breakdown.some((entry) => entry.level === "avancado" && entry.count > 0);
}

/**
 * Piso legal de brigadistas — Art. 16, § 2º da IN 28: "Quando houver a exigência
 * de brigadista orgânico, o número mínimo a ser implementado será de 03 (três)
 * brigadistas orgânicos, independente do previsto no caput deste artigo."
 *
 * "Independente do previsto no caput" ⇒ o piso SE SOBREPÕE à conta da ocupação:
 * o total entregue é `max(calculado, 3)`. Vale para todo resultado com exigência
 * de brigada (não isento), inclusive o túnel. NÃO vale para isentos — o piso só
 * existe "quando houver a exigência" — nem para o condomínio, cuja quantidade é
 * uma sugestão comercial, não uma exigência legal.
 */
export const MINIMUM_BRIGADE_MEMBERS = 3;

/** Dados que identificam o cálculo, comuns a todos os desfechos. */
type BrigadeBase = { occupancyCode: string; population?: number };

/** Desfecho isento: sem exigência, logo sem piso e sem brigadista. */
function exemptResult(base: BrigadeBase): BrigadeResult {
  return {
    ...base,
    exempt: true,
    total: 0,
    breakdown: [],
    requiresQuote: false,
    minimumApplied: false,
  };
}

/**
 * Fecha o dimensionamento de quem TEM exigência de brigada, aplicando o piso
 * legal de 3 e redistribuindo os níveis sobre o total já elevado — a divisão
 * por percentual é a mesma (`splitByLevel`, com os shares da ocupação), só muda
 * o total que entra nela.
 *
 * `computed <= 0` significa que não sobrou exigência nenhuma (ex.: percentual de
 * uma população zerada): aí o desfecho é isento e o piso não se aplica.
 */
function requiredResult(
  base: BrigadeBase,
  computed: number,
  levels: LevelShare[],
): BrigadeResult {
  if (computed <= 0) return exemptResult(base);

  const total = Math.max(computed, MINIMUM_BRIGADE_MEMBERS);
  const breakdown = splitByLevel(total, levels);

  return {
    ...base,
    exempt: false,
    total,
    breakdown,
    // Recalculado sobre o breakdown final: o piso pode fazer surgir um nível
    // Avançado que a conta original, menor, não alcançava.
    requiresQuote: hasAdvanced(breakdown),
    minimumApplied: total > computed,
  };
}

/**
 * Aplica uma regra de ocupação a uma população.
 *
 * Fórmula confirmada por escrito pela Ariele: `teto(população / N)`.
 * A faixa de isenção (`exemptBelow`) define QUEM é dispensado, mas NÃO é
 * subtraída da população no cálculo. Exemplos dela:
 *   - D-1 (isento < 10, 1 a cada 15) com 40 funcionários → 40/15 = 2,66 → 3.
 *   - I-2 (isento < 10, 1 a cada 10) com 80 funcionários → 80/10 = 8.
 */
function applyRule(
  rule: Occupancy["rule"],
  population: number,
  occupancyCode: string,
): BrigadeResult {
  const base = { population, occupancyCode };

  switch (rule.kind) {
    case "always-exempt":
      return exemptResult(base);

    case "percent":
      // "50% / 75% da população fixa": sem isenção, aplica direto sobre o total.
      return requiredResult(base, Math.ceil(population * rule.percent), rule.levels);

    case "ratio": {
      if (population < rule.exemptBelow) return exemptResult(base);
      return requiredResult(base, Math.ceil(population / rule.perPeople), rule.levels);
    }

    case "tunnel":
      throw new Error("M-1 deve ser calculado por computeTunnelBrigade().");

    case "residential":
      throw new Error("A-1/A-2 devem ser calculados por computeCondoBrigade().");
  }
}

/** Ramo Empresas: ocupação + número de funcionários. */
export function computeCompanyBrigade(
  occupancyCode: string,
  population: number,
): BrigadeResult {
  const occupancy = getOccupancy(occupancyCode);
  if (!occupancy) throw new Error(`Ocupação desconhecida: ${occupancyCode}`);
  return applyRule(occupancy.rule, population, occupancyCode);
}

/**
 * Ramo M-1: dimensionado pela metragem do túnel.
 *
 * Também há exigência de brigada aqui, então o piso legal de 3 vale igual: as
 * faixas de 200-500 m e 500-1.000 m preveem 02 brigadistas e sobem para 3.
 */
export function computeTunnelBrigade(meters: number): BrigadeResult {
  const band = TUNNEL_BANDS.find((item) => meters <= item.maxMeters) ?? TUNNEL_BANDS[3];
  const base = { occupancyCode: "M-1" };

  if (band.exempt) return exemptResult(base);

  // Acima de 1.000 m: 02 brigadistas + 1 a cada 1.000 m adicionais.
  const computed =
    band.brigadistas ?? 2 + Math.floor((meters - 1000) / 1000) + (meters % 1000 > 0 ? 1 : 0);

  return requiredResult(base, computed, [...band.levels]);
}

export type CondoInput = {
  andaresPorBloco: number;
  blocos: number;
};

/**
 * Ramo Condomínio: tratado como A-2 (multifamiliar vertical).
 *
 * Fluxograma (board do Figma): "Todo residencial é isento" → "Informar isenção,
 * porém oferecer link com desconto / Calcular uma pessoa por andar por torre".
 * Logo: SEMPRE isento, sem faixa de isenção nem população mínima, e a sugestão
 * comercial é `andares × torres`, tudo no nível Básico.
 * Exemplo da Ariele: 5 torres de 10 andares = 50 brigadistas sugeridos.
 *
 * `population` fica ausente de propósito: o fluxo não estima moradores, e o
 * resumo do resultado só exibe população quando ela existe.
 *
 * O piso legal de 3 NÃO se aplica: ele só existe "quando houver a exigência de
 * brigadista orgânico", e aqui não há exigência nenhuma — o número é sugestão
 * comercial. Por isso `minimumApplied` é sempre `false` e não há aviso.
 */
export function computeCondoBrigade(input: CondoInput): BrigadeResult {
  const total = input.andaresPorBloco * input.blocos;

  return {
    exempt: true,
    total,
    breakdown: splitByLevel(total, [{ level: "basico", share: 1 }]),
    requiresQuote: false,
    minimumApplied: false,
    occupancyCode: "A-2",
  };
}
