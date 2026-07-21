"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { INITIAL_STEP_ID } from "@/lib/quote-flow/config";
import {
  advanceQuoteState,
  getStep,
  isQuoteResult,
  validateStep,
} from "@/lib/quote-flow/engine";
import { buildPessoaFisicaResult } from "@/lib/quote-flow/result";
import type { QuoteResult, QuoteState } from "@/lib/quote-flow/types";
import { FilterResultModal } from "./FilterResultModal";
import { StepRenderer } from "./StepRenderer";

/** Destaca um trecho do subtítulo preservando o texto ao redor (inclusive a pontuação). */
function highlight(subtitle: string, term?: string) {
  if (!term) return subtitle;
  const at = subtitle.indexOf(term);
  if (at === -1) return subtitle;
  return (
    <>
      {subtitle.slice(0, at)}
      <strong className="font-bold text-accent">{term}</strong>
      {subtitle.slice(at + term.length)}
    </>
  );
}

export function QuoteWizard() {
  const [state, setState] = useState<QuoteState>({
    stepId: INITIAL_STEP_ID,
    answers: {},
  });
  /** Passos já percorridos, para o botão Voltar. */
  const [history, setHistory] = useState<QuoteState[]>([]);
  const [result, setResult] = useState<QuoteResult | null>(null);

  const step = getStep(state.stepId);

  const isValid = useMemo(() => {
    if (!step) return false;
    return validateStep(step, state.answers);
  }, [step, state.answers]);

  if (!step) return null;

  function handleChange(fieldId: string, value: string) {
    // Pessoa Física: abre o popup de compra única imediatamente, sem perguntas.
    if (fieldId === "perfil" && value === "pessoa_fisica") {
      setResult(buildPessoaFisicaResult());
      return;
    }

    setState((current) => {
      // Trocar de ocupação invalida a resposta seguinte (funcionários × metragem).
      const answers = { ...current.answers, [fieldId]: value };
      if (fieldId === "ocupacao") {
        delete answers.qtd_funcionarios;
        delete answers.metros_tunel;
      }
      return { ...current, answers };
    });
  }

  function handleAdvance() {
    if (!isValid) return;
    const next = advanceQuoteState(state);
    if (isQuoteResult(next)) {
      setResult(next);
      return;
    }
    setHistory((current) => [...current, state]);
    setState(next);
  }

  function handleBack() {
    setHistory((current) => {
      const previous = current[current.length - 1];
      if (previous) setState(previous);
      return current.slice(0, -1);
    });
  }

  function handleReset() {
    setState({ stepId: INITIAL_STEP_ID, answers: {} });
    setHistory([]);
    setResult(null);
  }

  const showCompactProfile = state.stepId !== INITIAL_STEP_ID;

  return (
    <>
      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex max-w-[774px] flex-col items-center gap-2 text-center text-white">
          <h2 className="text-[32px] font-semibold capitalize leading-tight">
            {step.title}
          </h2>
          {step.subtitle && (
            <p className="text-base font-light leading-7">
              {highlight(step.subtitle, step.highlightSubtitle)}
            </p>
          )}
        </div>

        <StepRenderer
          fields={step.fields}
          answers={state.answers}
          onChange={handleChange}
          compactProfile={showCompactProfile}
        />

        <div className="flex w-full max-w-[744px] justify-between gap-4">
          {history.length > 0 ? (
            <Button variant="outlined" onClick={handleBack}>
              Voltar
            </Button>
          ) : (
            <span />
          )}

          <Button
            variant={isValid ? "default" : "disabled"}
            disabled={!isValid}
            onClick={handleAdvance}
          >
            Avançar
          </Button>
        </div>
      </div>

      {result && <FilterResultModal result={result} onClose={handleReset} />}
    </>
  );
}
