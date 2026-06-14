"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { QuoteResult } from "@/lib/quote-flow/types";

type FilterResultModalProps = {
  result: QuoteResult;
  onClose: () => void;
};

export function FilterResultModal({ result, onClose }: FilterResultModalProps) {
  function handleCta() {
    console.log("Quote submitted:", result);
    window.alert("Orçamento enviado com sucesso! Em breve entraremos em contato.");
    window.open(result.ctaHref, "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-[493px] rounded-card bg-white px-8 py-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-1 -top-3 flex size-6 items-center justify-center rounded-full bg-white text-brand shadow"
          aria-label="Fechar"
        >
          <X className="size-4" />
        </button>

        <div className="flex flex-col gap-6">
          <h3 className="text-center font-[family-name:var(--font-inter)] text-2xl font-bold tracking-tight text-brand">
            {result.title}
          </h3>

          <div className="rounded-card bg-brand/10 p-4 text-center font-[family-name:var(--font-inter)] text-lg text-brand">
            {result.summary.map((item) => (
              <p key={item.label}>
                {item.label}: <strong>{item.value}</strong>
              </p>
            ))}
          </div>

          {result.info && (
            <p className="text-center font-[family-name:var(--font-inter)] text-lg font-medium text-brand">
              {result.info}
            </p>
          )}
          {result.text && (
            <p className="text-center font-[family-name:var(--font-inter)] text-lg font-medium text-brand">
              {result.text}
            </p>
          )}

          <p className="text-center font-[family-name:var(--font-inter)] text-4xl font-extrabold tracking-tight text-brand">
            {result.priceLabel}
          </p>

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
