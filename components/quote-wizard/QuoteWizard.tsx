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
import type { QuoteResult, QuoteState } from "@/lib/quote-flow/types";
import { FilterResultModal } from "./FilterResultModal";
import { StepRenderer } from "./StepRenderer";

export function QuoteWizard() {
  const [state, setState] = useState<QuoteState>({
    stepId: INITIAL_STEP_ID,
    answers: {},
  });
  const [result, setResult] = useState<QuoteResult | null>(null);

  const step = getStep(state.stepId);

  const isValid = useMemo(() => {
    if (!step) return false;
    return validateStep(step, state.answers);
  }, [step, state.answers]);

  if (!step) return null;

  function handleChange(fieldId: string, value: string) {
    setState((current) => ({
      ...current,
      answers: { ...current.answers, [fieldId]: value },
    }));
  }

  function handleAdvance() {
    if (!isValid) return;
    const next = advanceQuoteState(state);
    if (isQuoteResult(next)) {
      setResult(next);
      return;
    }
    setState(next);
  }

  function handleReset() {
    setState({ stepId: INITIAL_STEP_ID, answers: {} });
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
              {step.highlightSubtitle ? (
                <>
                  {step.subtitle.replace(step.highlightSubtitle, "")}
                  <strong className="font-bold text-accent">
                    {step.highlightSubtitle}
                  </strong>
                  .
                </>
              ) : (
                step.subtitle
              )}
            </p>
          )}
        </div>

        <StepRenderer
          fields={step.fields}
          answers={state.answers}
          onChange={handleChange}
          compactProfile={showCompactProfile}
        />

        <div className="flex w-full max-w-[744px] justify-end">
          <Button
            variant={isValid ? "default" : "disabled"}
            disabled={!isValid}
            onClick={handleAdvance}
          >
            Avançar
          </Button>
        </div>
      </div>

      {result && (
        <FilterResultModal
          result={result}
          onClose={() => {
            setResult(null);
            handleReset();
          }}
        />
      )}
    </>
  );
}
