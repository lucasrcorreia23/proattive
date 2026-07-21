/**
 * Dimensionamento da brigada de incêndio a partir do fluxo de filtro.
 *
 * Funções puras, sem dependência de React ou de UI — é aqui que mora a regra
 * de negócio e é isto que os testes cobrem.
 */

import {
  CONDO_RULE,
  PEOPLE_PER_APARTMENT,
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
  /** Total de brigadistas a treinar (0 quando isento). */
  total: number;
  /** Distribuição do total entre os níveis de curso. */
  breakdown: BrigadeBreakdown[];
  /**
   * Envolve nível Avançado ⇒ não pode ser vendido online: tem aula presencial
   * e precisa ser orçado à parte (nota da Ariele no fluxo).
   */
  requiresQuote: boolean;
  /** População considerada no cálculo (ausente no ramo túnel). */
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
 * Aplica uma regra de ocupação a uma população.
 *
 * Fórmula confirmada com o cliente: `teto((população − isenção) / N)`.
 */
function applyRule(
  rule: Occupancy["rule"],
  population: number,
  occupancyCode: string,
): BrigadeResult {
  const base = { population, occupancyCode };

  switch (rule.kind) {
    case "always-exempt":
      return { ...base, exempt: true, total: 0, breakdown: [], requiresQuote: false };

    case "percent": {
      // "50% / 75% da população fixa": sem isenção, aplica direto sobre o total.
      const total = Math.ceil(population * rule.percent);
      const breakdown = splitByLevel(total, rule.levels);
      return {
        ...base,
        exempt: total === 0,
        total,
        breakdown,
        requiresQuote: hasAdvanced(breakdown),
      };
    }

    case "ratio": {
      if (population < rule.exemptBelow) {
        return { ...base, exempt: true, total: 0, breakdown: [], requiresQuote: false };
      }
      const total = Math.ceil((population - rule.exemptBelow) / rule.perPeople);
      const breakdown = splitByLevel(total, rule.levels);
      return {
        ...base,
        exempt: total === 0,
        total,
        breakdown,
        requiresQuote: hasAdvanced(breakdown),
      };
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

/** Ramo M-1: dimensionado pela metragem do túnel. */
export function computeTunnelBrigade(meters: number): BrigadeResult {
  const band = TUNNEL_BANDS.find((item) => meters <= item.maxMeters) ?? TUNNEL_BANDS[3];
  const base = { occupancyCode: "M-1" };

  if (band.exempt) {
    return { ...base, exempt: true, total: 0, breakdown: [], requiresQuote: false };
  }

  // Acima de 1.000 m: 02 brigadistas + 1 a cada 1.000 m adicionais.
  const total =
    band.brigadistas ?? 2 + Math.floor((meters - 1000) / 1000) + (meters % 1000 > 0 ? 1 : 0);
  const breakdown = splitByLevel(total, [...band.levels]);

  return {
    ...base,
    exempt: false,
    total,
    breakdown,
    requiresQuote: hasAdvanced(breakdown),
  };
}

export type CondoInput = {
  apartamentosPorAndar: number;
  andaresPorBloco: number;
  blocos: number;
};

/** População estimada do condomínio a partir das 3 perguntas do fluxo. */
export function condoPopulation(input: CondoInput): number {
  return (
    input.apartamentosPorAndar *
    input.andaresPorBloco *
    input.blocos *
    PEOPLE_PER_APARTMENT
  );
}

/** Ramo Condomínio: tratado como A-2 (multifamiliar vertical). */
export function computeCondoBrigade(input: CondoInput): BrigadeResult {
  return applyRule(CONDO_RULE, condoPopulation(input), "A-2");
}
