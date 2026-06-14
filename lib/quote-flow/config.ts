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

const TIPO_CONDOMINIO = [
  { value: "residencial", label: "Residencial" },
  { value: "comercial", label: "Comercial" },
  { value: "misto", label: "Misto" },
];

const QTD_UNIDADES = [
  { value: "ate-50", label: "Até 50 unidades" },
  { value: "51-100", label: "51 a 100 unidades" },
  { value: "101-200", label: "101 a 200 unidades" },
  { value: "200+", label: "Acima de 200 unidades" },
];

const MODALIDADE = [
  { value: "presencial", label: "Presencial in company" },
  { value: "online", label: "Online ao vivo" },
  { value: "hibrido", label: "Híbrido" },
];

const QTD_PARTICIPANTES = [
  { value: "1", label: "1 participante" },
  { value: "2-5", label: "2 a 5 participantes" },
  { value: "6-10", label: "6 a 10 participantes" },
  { value: "10+", label: "Mais de 10 participantes" },
];

const PERFIL_SELECTOR: FlowStep["fields"][number] = {
  id: "perfil",
  type: "selector",
  label: "Qual o seu perfil?",
  options: [...PROFILE_OPTIONS],
};

function profileStep(profile: ProfileType): FlowStep {
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
        : profile === "condominio"
          ? [
              {
                id: "tipo_condominio",
                type: "dropdown" as const,
                label: "Qual o tipo de condomínio?",
                options: TIPO_CONDOMINIO,
              },
              {
                id: "destinacao",
                type: "dropdown" as const,
                label: "Destinação",
                options: DESTINACAO,
              },
              {
                id: "qtd_unidades",
                type: "dropdown" as const,
                label: "Quantidade de unidades?",
                options: QTD_UNIDADES,
              },
            ]
          : [
              {
                id: "modalidade",
                type: "dropdown" as const,
                label: "Qual modalidade prefere?",
                options: MODALIDADE,
              },
              {
                id: "destinacao",
                type: "dropdown" as const,
                label: "Destinação",
                options: DESTINACAO,
              },
              {
                id: "qtd_participantes",
                type: "dropdown" as const,
                label: "Quantidade de participantes?",
                options: QTD_PARTICIPANTES,
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
      if (!perfil) return "step-1";
      return `step-2-${perfil}`;
    },
  },
  "step-2-condominio": profileStep("condominio"),
  "step-2-empresa": profileStep("empresa"),
  "step-2-pessoa_fisica": profileStep("pessoa_fisica"),
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
