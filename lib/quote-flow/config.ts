import { COMPANY_OCCUPANCY_OPTIONS, getOccupancy } from "./occupancies.ts";
import type { FlowStep, ProfileType } from "./types.ts";

export const PROFILE_OPTIONS = [
  { value: "condominio", label: "Condomínio" },
  { value: "empresa", label: "Empresa" },
  { value: "pessoa_fisica", label: "Pessoa Física" },
] as const;

const PERFIL_SELECTOR: FlowStep["fields"][number] = {
  id: "perfil",
  type: "selector",
  label: "Qual o seu perfil?",
  options: [...PROFILE_OPTIONS],
};

const STEP_TITLE = "Encontre o formato ideal para você";
const STEP_SUBTITLE =
  "Ajuste os campos conforme a sua estrutura e descubra a brigada exigida.";

/** Cabeçalho comum dos passos internos, com o perfil já escolhido em modo leitura. */
function innerStep(
  id: string,
  fields: FlowStep["fields"],
  next?: FlowStep["next"],
): FlowStep {
  return {
    id,
    title: STEP_TITLE,
    subtitle: STEP_SUBTITLE,
    fields: [{ ...PERFIL_SELECTOR, readOnly: true }, ...fields],
    next: next ?? (() => null),
  };
}

export const FLOW_STEPS: Record<string, FlowStep> = {
  "step-1": {
    id: "step-1",
    title: STEP_TITLE,
    subtitle: STEP_SUBTITLE,
    highlightSubtitle: "a brigada exigida",
    fields: [PERFIL_SELECTOR],
    next: (answers) => {
      const perfil = answers.perfil as ProfileType | undefined;
      // Pessoa Física não avança: é tratada com popup imediato (ver QuoteWizard).
      if (perfil === "condominio") return "step-2-condominio";
      if (perfil === "empresa") return "step-2-empresa";
      return "step-1";
    },
  },

  // ---------- Empresas: ocupação → população (ou metragem, se M-1) ----------
  "step-2-empresa": innerStep(
    "step-2-empresa",
    [
      {
        id: "ocupacao",
        type: "searchable-dropdown",
        label: "Qual é a ocupação da edificação?",
        options: COMPANY_OCCUPANCY_OPTIONS,
        hint: "A mesma classificação usada pelo Corpo de Bombeiros.",
      },
    ],
    (answers) => {
      const occupancy = getOccupancy(answers.ocupacao ?? "");
      if (!occupancy) return "step-2-empresa";
      if (occupancy.rule.kind === "tunnel") return "step-3-tunel";
      // Isento em qualquer população: não faz sentido perguntar o resto.
      if (occupancy.rule.kind === "always-exempt") return null;
      return "step-3-populacao";
    },
  ),

  "step-3-populacao": innerStep("step-3-populacao", [
    {
      id: "qtd_funcionarios",
      type: "number",
      label: "Qual a quantidade de funcionários?",
      options: [],
      placeholder: "Ex.: 40",
      min: 1,
    },
  ]),

  // Metragem exata, e não faixa: acima de 1.000 m o cálculo é
  // "02 + 1 a cada 1.000 m", que depende do número real.
  "step-3-tunel": innerStep("step-3-tunel", [
    {
      id: "metros_tunel",
      type: "number",
      label: "Quantos metros de túnel?",
      options: [],
      placeholder: "Ex.: 1500",
      min: 1,
    },
  ]),

  // ---------- Condomínios ----------
  "step-2-condominio": innerStep("step-2-condominio", [
    {
      id: "apartamentos_por_andar",
      type: "number",
      label: "Há quantos apartamentos por andar?",
      options: [],
      placeholder: "Ex.: 4",
      min: 1,
    },
    {
      id: "blocos_por_torre",
      type: "number",
      label: "Quantos blocos/torres?",
      options: [],
      placeholder: "Ex.: 2",
      min: 1,
    },
    {
      id: "andares_por_bloco",
      type: "number",
      label: "Qual a quantidade de andares por bloco?",
      options: [],
      placeholder: "Ex.: 10",
      min: 1,
    },
  ]),
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
