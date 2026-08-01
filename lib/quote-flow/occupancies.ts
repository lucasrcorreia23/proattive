/**
 * Tabela de ocupações e regras de dimensionamento da brigada.
 *
 * Fonte: "fluxo de filtro.pdf" (Ariele). Cada ocupação define (a) a partir de
 * qual população deixa de ser isenta, (b) a razão de cálculo e (c) em qual
 * nível de curso os brigadistas se enquadram.
 *
 * IMPORTANTE: o `code` é o que dirige o cálculo — ele veio direto do fluxo e
 * está conferido. O `label` é apenas texto de tela; ver LABELS abaixo.
 */

export type CourseLevel = "basico" | "intermediario" | "avancado";

/** Divisão da brigada entre níveis (soma dos `share` = 1). */
export type LevelShare = { level: CourseLevel; share: number };

export type OccupancyRule =
  /** Isento independente da população (J-1, M-4, M-11). */
  | { kind: "always-exempt" }
  /** Isento abaixo de `exemptBelow`; acima disso, 1 brigadista a cada `perPeople`. */
  | { kind: "ratio"; exemptBelow: number; perPeople: number; levels: LevelShare[] }
  /** Sem isenção: a brigada é um percentual da população fixa. */
  | { kind: "percent"; percent: number; levels: LevelShare[] }
  /** M-1: dimensionado por metragem de túnel, não por população. */
  | { kind: "tunnel" }
  /**
   * A-1 / A-2: entram pelo ramo Condomínio. Todo residencial é isento; o fluxo
   * só sugere 1 brigadista por andar, por torre. Ver `computeCondoBrigade`.
   */
  | { kind: "residential" };

export type Occupancy = {
  code: string;
  /** Grupo do sistema do Corpo de Bombeiros, ex.: "residencial". */
  group: string;
  /** Descrição da ocupação. `null` = ainda não confirmada com a Ariele. */
  description: string | null;
  rule: OccupancyRule;
};

const BASICO: LevelShare[] = [{ level: "basico", share: 1 }];
const INTERMEDIARIO: LevelShare[] = [{ level: "intermediario", share: 1 }];
const AVANCADO: LevelShare[] = [{ level: "avancado", share: 1 }];

const BASICO_50_INTERMEDIARIO_50: LevelShare[] = [
  { level: "basico", share: 0.5 },
  { level: "intermediario", share: 0.5 },
];
const INTERMEDIARIO_75_AVANCADO_25: LevelShare[] = [
  { level: "intermediario", share: 0.75 },
  { level: "avancado", share: 0.25 },
];
const INTERMEDIARIO_50_AVANCADO_50: LevelShare[] = [
  { level: "intermediario", share: 0.5 },
  { level: "avancado", share: 0.5 },
];

/** Faixas de dimensionamento do M-1 (túnel). */
export const TUNNEL_BANDS = [
  { maxMeters: 200, label: "Até 200 m", exempt: true, brigadistas: 0, levels: BASICO },
  {
    maxMeters: 500,
    label: "De 200 m a 500 m",
    exempt: false,
    brigadistas: 2,
    levels: BASICO,
  },
  {
    maxMeters: 1000,
    label: "De 500 m a 1.000 m",
    exempt: false,
    brigadistas: 2,
    levels: BASICO_50_INTERMEDIARIO_50,
  },
  {
    maxMeters: Infinity,
    label: "Acima de 1.000 m",
    exempt: false,
    /** 02 + 1 a cada 1.000 m. */
    brigadistas: null,
    levels: INTERMEDIARIO,
  },
] as const;

/**
 * Descrições exibidas no seletor de ocupação.
 *
 * Fonte: IN 1 - P2, Anexo A, Tabela 1 - Classificação das Ocupações (Normas de
 * Segurança Contra Incêndio / CBMSC, 2024), enviada pela Ariele. O texto antes
 * dos parênteses vem da coluna "Descrição"; os exemplos entre parênteses vêm da
 * coluna "Destinação" — é por eles que o cliente se reconhece no seletor.
 *
 * As 63 divisões (A-1 a M-11) estão confirmadas. Se alguma voltar a `null`, o
 * seletor mostra "descrição a confirmar": preferimos isso a arriscar um texto
 * errado, porque o cliente escolhe a ocupação pela descrição e um erro aqui
 * dimensiona a brigada errada.
 */
const LABELS: Record<string, { group: string; description: string | null }> = {
  "A-1": { group: "residencial", description: "Multifamiliar Horizontal e Unifamiliar" },
  "A-2": { group: "residencial", description: "Multifamiliar Vertical" },
  "A-3": { group: "residencial", description: "Coletiva" },
  "B-1": { group: "serviço de hospedagem", description: "Hotel e Assemelhado" },
  "B-2": { group: "serviço de hospedagem", description: "Hotel Residencial" },
  "C-1": { group: "comercial", description: "Comércio Com Baixa Carga de Incêndio" },
  "C-2": {
    group: "comercial",
    description: "Comércio Com Média, Alta Ou Altíssima Carga de Incêndio",
  },
  "C-3": { group: "comercial", description: "Shopping Centers" },
  "D-1": {
    group: "serviço profissional",
    description: "Local Para Prestação de Serviço Profissional Ou Condução de Negócios",
  },
  "D-2": { group: "serviço profissional", description: "Agência Bancária" },
  "D-3": {
    group: "serviço profissional",
    description: "Serviço de Reparação (exceto Os Classificados Em G-4)",
  },
  "D-4": { group: "serviço profissional", description: "Laboratório" },
  "E-1": { group: "educacional e cultura física", description: "Escola Em Geral" },
  "E-2": { group: "educacional e cultura física", description: "Escola Especial" },
  "E-3": {
    group: "educacional e cultura física",
    description: "Espaço Para Cultura Física",
  },
  "E-4": {
    group: "educacional e cultura física",
    description: "Centro de Treinamento Profissional",
  },
  "E-5": { group: "educacional e cultura física", description: "Pré-escola" },
  "E-6": {
    group: "educacional e cultura física",
    description: "Escola Para Portadores de Deficiências",
  },
  "F-1": {
    group: "local de reunião de público",
    description: "Local Onde Há Objeto de Valor Inestimável",
  },
  "F-2": {
    group: "local de reunião de público",
    description:
      "Local Religioso e Velório (igrejas, capelas, templos, sinagogas, mesquitas, cemitérios, crematórios, salas de funerais)",
  },
  "F-3": {
    group: "local de reunião de público",
    description:
      "Centro Esportivo e de Exibição (arenas, estádios, ginásios, piscinas, rodeios, autódromos, sambódromos, pista de patinação, todos com arquibancadas)",
  },
  "F-4": {
    group: "local de reunião de público",
    description:
      "Estação e Terminal de Passageiros (estações rodoferroviárias e marítimas, portos, metrô, aeroportos, heliponto, estações de transbordo)",
  },
  "F-5": {
    group: "local de reunião de público",
    description:
      "Arte Cênica e Auditório (teatros, cinemas, óperas, auditórios de estúdios de rádio e televisão, auditórios em geral)",
  },
  "F-6": {
    group: "local de reunião de público",
    description:
      "Clubes Sociais e Diversão (salões de festa e buffet, centro de eventos, restaurantes dançantes, clubes sociais, bingo, bilhares, tiro ao alvo, boliche)",
  },
  "F-7": {
    group: "local de reunião de público",
    description: "Construção Provisória (circos, palcos, estruturas temporárias diversas)",
  },
  "F-8": {
    group: "local de reunião de público",
    description:
      "Local Para Refeição (restaurantes, lanchonetes, bares, cafés, refeitórios, cantinas)",
  },
  "F-9": {
    group: "local de reunião de público",
    description:
      "Recreação Pública (jardim zoológico, parques recreativos e temáticos, parques aquáticos)",
  },
  "F-10": {
    group: "local de reunião de público",
    description:
      "Exposição de Objetos Ou Animais (salões e salas para exposição de objetos ou animais, em edificações permanentes)",
  },
  "F-11": {
    group: "local de reunião de público",
    description: "Boate (casas noturnas, danceterias, discotecas)",
  },
  "G-1": {
    group: "serviço automotivo",
    description:
      "Garagem Sem Acesso de Público e Sem Abastecimento (garagens automáticas, garagens com manobristas, estacionamentos)",
  },
  "G-2": {
    group: "serviço automotivo",
    description:
      "Garagem Com Acesso de Público e Sem Abastecimento (garagens coletivas sem automação, exceto veículos de carga e coletivos)",
  },
  "G-3": {
    group: "serviço automotivo",
    description:
      "Local Dotado de Abastecimento de Combustível (postos de abastecimento com tanque subterrâneo e serviço, garagens, exceto veículos de carga e coletivos)",
  },
  "G-4": {
    group: "serviço automotivo",
    description:
      "Serviço de Conservação, Manutenção e Reparos (oficinas de conserto de veículos, borracharia sem recauchutagem, oficinas e garagens de veículos de carga e coletivos, máquinas agrícolas e rodoviárias, retificadoras de motores)",
  },
  "G-5": {
    group: "serviço automotivo",
    description: "Hangares (abrigos para aeronaves com ou sem abastecimento)",
  },
  "H-1": {
    group: "serviço de saúde e institucional",
    description:
      "Hospital Veterinário e Assemelhados (hospitais, clínicas e consultórios veterinários, incluindo alojamento com ou sem adestramento)",
  },
  "H-2": {
    group: "serviço de saúde e institucional",
    description:
      "Local Onde Pessoas Requerem Cuidados Especiais Por Limitações Físicas Ou Mentais (asilos, orfanatos, abrigos geriátricos, hospitais psiquiátricos, reformatórios, tratamento de dependentes de drogas e álcool, todos sem celas)",
  },
  "H-3": {
    group: "serviço de saúde e institucional",
    description:
      "Hospitalar (hospitais, casas de saúde, prontos-socorros, clínicas com internação, ambulatórios e postos de atendimento de urgência, postos de saúde e puericultura com internação)",
  },
  "H-4": {
    group: "serviço de saúde e institucional",
    description:
      "Edificação Pública (edificações dos poderes executivo, legislativo e judiciário, cartórios, quartéis, delegacias, postos policiais, consulados)",
  },
  "H-5": {
    group: "serviço de saúde e institucional",
    description:
      "Local Onde A Liberdade das Pessoas Sofre Restrições (hospitais psiquiátricos, manicômios, reformatórios, prisões em geral, casas de detenção, penitenciárias, presídios, todos com celas)",
  },
  "H-6": {
    group: "serviço de saúde e institucional",
    description:
      "Clínica e Consultório Médico e Odontológico (clínicas médicas, consultórios em geral, unidades de hemodiálise, ambulatórios, postos de saúde, todos sem internação)",
  },
  "I-1": {
    group: "industrial",
    description:
      "Locais Onde A Carga de Incêndio É de Até 300 MJ/m² (indústrias de aço, artigos de metal, gesso, cimento, concreto, cerâmica, olarias, ferramentas, joias, serralheria, louças, vidro, acessórios automotivos, bebidas não alcoólicas, cervejarias, conservas, laticínios)",
  },
  "I-2": {
    group: "industrial",
    description:
      "Locais Com Média Carga de Incêndio (indústrias de automóveis, bebidas destiladas, instrumentos musicais, móveis, marcenarias, alimentos, artigos em couro e plástico, baterias, calçados, colchões, eletrodomésticos, óleos comestíveis, tintas látex, têxteis)",
  },
  "I-3": {
    group: "industrial",
    description:
      "Locais Com Alta Ou Altíssima Carga de Incêndio (indústrias de inflamáveis, combustíveis, materiais oxidantes, ceras, espumas, grãos e cereais, tintas, vernizes e solventes, borracha, madeira, papelão, resinas, gráficas, estaleiros, produtos de limpeza, processamento de lixo)",
  },
  "J-1": {
    group: "depósito",
    description:
      "Depósitos de Material Incombustível (tijolos, pedras, areias, cimentos e metais, sem processo industrial e sem embalagem)",
  },
  "J-2": {
    group: "depósito",
    description:
      "Depósito Com Baixa Carga de Incêndio (galpões, centros de distribuição e centros atacadistas com carga de incêndio de até 300 MJ/m²)",
  },
  "J-3": {
    group: "depósito",
    description:
      "Depósito Com Média Carga de Incêndio (galpões, centros de distribuição e centros atacadistas com carga de incêndio entre 300 e 1.200 MJ/m²)",
  },
  "J-4": {
    group: "depósito",
    description:
      "Depósito Com Alta Ou Altíssima Carga de Incêndio (galpões, centros de distribuição e centros atacadistas com carga de incêndio acima de 1.200 MJ/m²)",
  },
  "K-1": {
    group: "energia",
    description: "Central de Transmissão e Distribuição de Energia (subestações elétricas)",
  },
  "K-2": {
    group: "energia",
    description: "Usinas (hidroelétrica, termoelétrica, usina fotovoltaica, usina eólica)",
  },
  "L-1": { group: "explosivo", description: "Comércio de Fogos de Artifício e Assemelhados" },
  "L-2": { group: "explosivo", description: "Indústria de Material Explosivo" },
  "L-3": { group: "explosivo", description: "Depósito de Material Explosivo" },
  "M-1": { group: "especial", description: "Túnel" },
  "M-2": {
    group: "especial",
    description:
      "Líquido Ou Gás Inflamáveis Ou Combustíveis (produção, manipulação, armazenamento e distribuição, exceto postos de revenda de GLP)",
  },
  "M-3": {
    group: "especial",
    description:
      "Central de TV, Rádio, Computação (centros de comunicação, centrais de transmissão, centros de computação, estações de rádio ou TV)",
  },
  "M-4": {
    group: "especial",
    description: "Canteiro de Obras (locais em construção ou demolição)",
  },
  "M-5": {
    group: "especial",
    description:
      "Silos, Moegas, Correias Transportadoras e Secadores (secadores de grãos ou folhas e similares)",
  },
  "M-6": {
    group: "especial",
    description:
      "Floresta Nativa Ou de Cultivo (floresta, reserva ecológica, parque florestal)",
  },
  "M-7": {
    group: "especial",
    description: "Pátio de Contêineres (área aberta destinada a armazenamento de contêineres)",
  },
  "M-8": { group: "especial", description: "Posto de Revenda de GLP Risco I (PRGLP classes I, II, III e IV)" },
  "M-9": {
    group: "especial",
    description: "Posto de Revenda de GLP Risco II (PRGLP classes V, VI, VII e Especial)",
  },
  "M-10": {
    group: "especial",
    description: "Minas Subterrâneas (mina para exploração de jazidas ou minérios)",
  },
  "M-11": {
    group: "especial",
    description:
      "Estufas e Galpões (estufas para secagem, galpões para estocagem de forrageiras ou fardos)",
  },
};

/** Aplica a mesma regra a um conjunto de códigos que o fluxo agrupou. */
function group(codes: string[], rule: OccupancyRule): Occupancy[] {
  return codes.map((code) => {
    const meta = LABELS[code];
    if (!meta) throw new Error(`Ocupação sem rótulo cadastrado: ${code}`);
    return { code, group: meta.group, description: meta.description, rule };
  });
}

function ratio(
  codes: string[],
  exemptBelow: number,
  perPeople: number,
  levels: LevelShare[],
): Occupancy[] {
  return group(codes, { kind: "ratio", exemptBelow, perPeople, levels });
}

function percent(codes: string[], value: number, levels: LevelShare[]): Occupancy[] {
  return group(codes, { kind: "percent", percent: value, levels });
}

/**
 * As 63 ocupações do fluxo. A ordem das entradas espelha o diagrama
 * (Básico → Intermediário → Avançado → isentos → especiais).
 */
export const OCCUPANCIES: Occupancy[] = [
  // ---------- Ramo Condomínio ----------
  ...group(["A-1", "A-2"], { kind: "residential" }),

  // ---------- BÁSICO ----------
  ...ratio(["M-3"], 5, 15, BASICO),
  ...ratio(["D-1", "D-2", "D-3", "D-4"], 10, 15, BASICO),
  ...ratio(["F-2", "F-3", "F-4", "F-9", "F-10", "G-1", "G-2"], 15, 15, BASICO),
  ...ratio(["A-3", "B-2", "C-1", "H-1", "H-4", "H-6"], 10, 20, BASICO),
  ...ratio(["E-1", "E-2", "E-3", "E-4", "E-5", "E-6"], 15, 20, BASICO),
  ...ratio(["M-6", "M-10"], 20, 20, BASICO),
  ...ratio(["J-2"], 10, 25, BASICO),
  ...ratio(["I-1"], 15, 25, BASICO),
  ...percent(["L-1"], 0.5, BASICO),
  ...ratio(["I-2"], 10, 10, BASICO_50_INTERMEDIARIO_50),

  // ---------- INTERMEDIÁRIO ----------
  ...ratio(["F-7", "F-11"], 5, 5, INTERMEDIARIO),
  ...ratio(
    ["C-3", "F-1", "F-5", "F-6", "F-8", "K-1", "K-2", "M-5", "M-7"],
    10,
    10,
    INTERMEDIARIO,
  ),
  ...ratio(["H-2", "H-3", "H-5"], 5, 15, INTERMEDIARIO),
  ...ratio(["G-3", "G-4", "G-5", "M-8"], 15, 15, INTERMEDIARIO),
  ...ratio(["J-3"], 5, 20, INTERMEDIARIO),
  ...ratio(["B-1", "C-2"], 10, 20, INTERMEDIARIO),
  ...percent(["M-2"], 0.75, INTERMEDIARIO),
  ...ratio(["I-3"], 10, 10, INTERMEDIARIO_75_AVANCADO_25),
  ...ratio(["J-4"], 5, 10, INTERMEDIARIO_50_AVANCADO_50),

  // ---------- AVANÇADO ----------
  ...percent(["L-2", "L-3"], 0.75, AVANCADO),
  ...ratio(["M-9"], 5, 10, AVANCADO),

  // ---------- Isentos e especiais ----------
  ...group(["J-1", "M-4", "M-11"], { kind: "always-exempt" }),
  ...group(["M-1"], { kind: "tunnel" }),
];

const BY_CODE = new Map(OCCUPANCIES.map((item) => [item.code, item]));

export function getOccupancy(code: string): Occupancy | undefined {
  return BY_CODE.get(code);
}

/** Rótulo no formato do sistema do Corpo de Bombeiros. */
export function occupancyLabel(item: Occupancy): string {
  const description = item.description ?? "descrição a confirmar";
  return `${item.code} [${item.group}] ${description}`;
}

/** Ocupações selecionáveis no ramo Empresas (A-1/A-2 entram por Condomínio). */
export const COMPANY_OCCUPANCIES = OCCUPANCIES.filter(
  (item) => item.rule.kind !== "residential",
).sort((a, b) => {
  const [aLetter, aNumber] = a.code.split("-");
  const [bLetter, bNumber] = b.code.split("-");
  return aLetter === bLetter
    ? Number(aNumber) - Number(bNumber)
    : aLetter.localeCompare(bLetter);
});

export const COMPANY_OCCUPANCY_OPTIONS = COMPANY_OCCUPANCIES.map((item) => ({
  value: item.code,
  label: occupancyLabel(item),
}));

export const LEVEL_LABELS: Record<CourseLevel, string> = {
  basico: "Básico",
  intermediario: "Intermediário",
  avancado: "Avançado",
};
