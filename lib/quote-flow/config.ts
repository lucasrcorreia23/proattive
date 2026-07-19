import type { FlowStep, ProfileType } from "./types";

export const PROFILE_OPTIONS = [
  { value: "condominio", label: "Condomínio" },
  { value: "empresa", label: "Empresa" },
  { value: "pessoa_fisica", label: "Pessoa Física" },
] as const;

const TIPO_EMPRESA = [
  { value: "comercial", label: "Comercial" },
  { value: "industrial", label: "Industrial" },
  { value: "servicos", label: "Serviços" },
  { value: "educacional", label: "Educacional" },
];

const DESTINACAO = [
  { value: "escritorio", label: "Escritório / Administrativo" },
  { value: "industria", label: "Área industrial" },
  { value: "comercio", label: "Comércio / Varejo" },
  { value: "educacao", label: "Instituição de ensino" },
  { value: "eventos", label: "Eventos e recreação" },
];

const QTD_FUNCIONARIOS = [
  { value: "1-10", label: "1 a 10 colaboradores" },
  { value: "11-30", label: "11 a 30 colaboradores" },
  { value: "31-50", label: "31 a 50 colaboradores" },
  { value: "51+", label: "Acima de 50 colaboradores" },
];

// TODO(Ariele): confirmar as faixas reais dos campos do filtro de condomínio.
const APARTAMENTOS_POR_ANDAR = [
  { value: "1-2", label: "1 a 2 apartamentos" },
  { value: "3-4", label: "3 a 4 apartamentos" },
  { value: "5-6", label: "5 a 6 apartamentos" },
  { value: "7+", label: "7 ou mais apartamentos" },
];

const BLOCOS_POR_TORRE = [
  { value: "1", label: "1 bloco" },
  { value: "2", label: "2 blocos" },
  { value: "3", label: "3 blocos" },
  { value: "4+", label: "4 ou mais blocos" },
];

const ANDARES_POR_BLOCO = [
  { value: "1-4", label: "1 a 4 andares" },
  { value: "5-8", label: "5 a 8 andares" },
  { value: "9-12", label: "9 a 12 andares" },
  { value: "13+", label: "13 ou mais andares" },
];

const PERFIL_SELECTOR: FlowStep["fields"][number] = {
  id: "perfil",
  type: "selector",
  label: "Qual o seu perfil?",
  options: [...PROFILE_OPTIONS],
};

function profileStep(profile: "condominio" | "empresa"): FlowStep {
  return {
    id: `step-2-${profile}`,
    title: "Encontre o Formato Ideal para Você",
    subtitle: "Ajuste os campos conforme a sua estrutura e gere um orçamento sob medida.",
    fields: [
      { ...PERFIL_SELECTOR, readOnly: true },
      ...(profile === "empresa"
        ? [
            {
              id: "tipo_empresa",
              type: "dropdown" as const,
              label: "Qual é o tipo de empresa?",
              options: TIPO_EMPRESA,
            },
            {
              id: "destinacao",
              type: "dropdown" as const,
              label: "Destinação",
              options: DESTINACAO,
            },
            {
              id: "qtd_funcionarios",
              type: "dropdown" as const,
              label: "Qual a quantidade de funcionários?",
              options: QTD_FUNCIONARIOS,
            },
          ]
        : [
            {
              id: "apartamentos_por_andar",
              type: "dropdown" as const,
              label: "Há quantos apartamentos por andar?",
              options: APARTAMENTOS_POR_ANDAR,
            },
            {
              id: "blocos_por_torre",
              type: "dropdown" as const,
              label: "Há quantos blocos por torre?",
              options: BLOCOS_POR_TORRE,
            },
            {
              id: "andares_por_bloco",
              type: "dropdown" as const,
              label: "Qual a quantidade de andares por bloco?",
              options: ANDARES_POR_BLOCO,
            },
          ]),
    ],
    next: () => null,
  };
}

export const FLOW_STEPS: Record<string, FlowStep> = {
  "step-1": {
    id: "step-1",
    title: "Encontre o formato ideal para você",
    subtitle:
      "Ajuste os campos conforme a sua estrutura e gere um orçamento sob medida.",
    highlightSubtitle: "orçamento sob medida",
    fields: [PERFIL_SELECTOR],
    next: (answers) => {
      const perfil = answers.perfil as ProfileType | undefined;
      // Pessoa Física não avança para step-2: é tratada com popup imediato (ver QuoteWizard).
      if (perfil === "condominio" || perfil === "empresa") return `step-2-${perfil}`;
      return "step-1";
    },
  },
  "step-2-condominio": profileStep("condominio"),
  "step-2-empresa": profileStep("empresa"),
};

export const INITIAL_STEP_ID = "step-1";

export function getProfileLabel(value: string) {
  return PROFILE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function getOptionLabel(
  fieldId: string,
  value: string,
  stepId: string,
): string {
  const step = FLOW_STEPS[stepId];
  const field = step?.fields.find((item) => item.id === fieldId);
  return field?.options.find((option) => option.value === value)?.label ?? value;
}
