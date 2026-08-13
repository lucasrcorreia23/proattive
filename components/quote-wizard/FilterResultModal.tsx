"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LEVEL_LABELS } from "@/lib/quote-flow/occupancies";
import type { QuoteResult } from "@/lib/quote-flow/types";

type FilterResultModalProps = {
  result: QuoteResult;
  onClose: () => void;
};

export function FilterResultModal({ result, onClose }: FilterResultModalProps) {
  const brigade = result.brigade;
  // Isento normalmente não tem número a exibir; o condomínio é a exceção —
  // é isento, mas recebe uma quantidade sugerida (`showBrigadeCount`).
  const showCount =
    brigade !== undefined && (result.showBrigadeCount ?? !brigade.exempt);
  // Isento com número na tela = sugestão, não exigência. A isenção vem antes do
  // número e o rótulo diz "sugeridos", para ninguém ler o total como obrigação legal.
  const isSuggestion = brigade !== undefined && showCount && brigade.exempt;

  const infoBlock = result.info ? (
    <p className="text-center font-[family-name:var(--font-inter)] text-base font-medium text-brand">
      {result.info}
    </p>
  ) : null;

  function handleCta() {
    window.open(result.ctaHref, "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-[493px] overflow-y-auto rounded-card bg-white px-8 py-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-white text-brand shadow"
          aria-label="Fechar"
        >
          <X className="size-4" />
        </button>

        <div className="flex flex-col gap-6">
          <h3 className="text-center font-[family-name:var(--font-inter)] text-2xl font-bold tracking-tight text-brand">
            {result.title}
          </h3>

          {!result.hideSummary && result.summary.length > 0 && (
            <div className="rounded-card bg-brand/10 p-4 text-center font-[family-name:var(--font-inter)] text-base text-brand">
              {result.summary.map((item) => (
                <p key={item.label}>
                  {item.label}: <strong>{item.value}</strong>
                </p>
              ))}
            </div>
          )}

          {isSuggestion && infoBlock}

          {/* Piso legal de 3 brigadistas: o total já vem com o piso aplicado, e a
              explicação da norma vem ANTES do número — quem lê o 3 já chega nele
              sabendo de onde saiu. */}
          {result.notice && (
            <p className="rounded-card bg-brand/10 p-4 text-center font-[family-name:var(--font-inter)] text-sm font-medium text-brand">
              {result.notice}
            </p>
          )}

          {showCount && (
            <div className="flex flex-col items-center gap-2">
              <p className="font-[family-name:var(--font-inter)] text-5xl font-extrabold tracking-tight text-brand">
                {brigade.total}
              </p>
              <p className="text-sm font-medium uppercase tracking-wide text-brand/70">
                {isSuggestion
                  ? brigade.total === 1
                    ? "brigadista sugerido"
                    : "brigadistas sugeridos"
                  : brigade.total === 1
                    ? "brigadista"
                    : "brigadistas"}
              </p>

              <div className="mt-2 flex flex-col gap-1 text-center">
                {brigade.breakdown.map((entry) => (
                  <p
                    key={entry.level}
                    className="font-[family-name:var(--font-inter)] text-lg text-brand"
                  >
                    <strong>{entry.count}</strong> no nível{" "}
                    <strong>{LEVEL_LABELS[entry.level]}</strong>
                  </p>
                ))}
              </div>
            </div>
          )}

          {!isSuggestion && infoBlock}

          {result.text && (
            <p className="text-center font-[family-name:var(--font-inter)] text-sm text-brand/80">
              {result.text}
            </p>
          )}

          <Button
            variant="default"
            className="h-12 w-full text-base"
            onClick={handleCta}
          >
            {result.ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
