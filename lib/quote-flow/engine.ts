import { z } from "zod";
import { FLOW_STEPS } from "./config.ts";
import { buildQuoteResult } from "./result.ts";
import type { FlowStep, QuoteResult, QuoteState } from "./types.ts";

export function getStep(stepId: string): FlowStep | undefined {
  return FLOW_STEPS[stepId];
}

export function createStepSchema(step: FlowStep) {
  const shape: Record<string, z.ZodType> = {};

  for (const field of step.fields) {
    if (field.readOnly) continue;
    shape[field.id] =
      field.type === "number"
        ? z.coerce.number().int().min(field.min ?? 1, "Informe um número válido")
        : z.string().min(1, "Selecione uma opção");
  }

  return z.object(shape);
}

export function validateStep(
  step: FlowStep,
  answers: Record<string, string>,
): boolean {
  const schema = createStepSchema(step);
  return schema.safeParse(answers).success;
}

export function getNextStepId(
  step: FlowStep,
  answers: Record<string, string>,
): string | null {
  if (!step.next) return null;
  return step.next(answers);
}

export function advanceQuoteState(state: QuoteState): QuoteState | QuoteResult {
  const step = getStep(state.stepId);
  if (!step) return state;

  const nextId = getNextStepId(step, state.answers);
  if (!nextId) {
    return buildQuoteResult(state.answers);
  }

  return { stepId: nextId, answers: state.answers };
}

export function isQuoteResult(value: QuoteState | QuoteResult): value is QuoteResult {
  return "ctaHref" in value;
}
