import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/utils";

type CtaBandSectionProps = {
  theme: "surface" | "brand" | "white";
  title: string;
  paragraph: ReactNode;
  ctaLabel: string;
  ctaHref: string;
};

const THEME_CLASSES: Record<CtaBandSectionProps["theme"], string> = {
  brand: "bg-brand text-white",
  surface: "bg-brand-surface text-brand",
  white: "bg-white text-brand",
};

export function CtaBandSection({
  theme,
  title,
  paragraph,
  ctaLabel,
  ctaHref,
}: CtaBandSectionProps) {
  return (
    <section className={cn(THEME_CLASSES[theme])}>
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-6 px-6 py-16 text-center">
        <h2 className="text-[28px] font-semibold leading-tight sm:text-[32px]">{title}</h2>
        <p className="max-w-[742px] text-base font-light leading-7">{paragraph}</p>
        <ButtonLink href={ctaHref} className="mt-2">
          {ctaLabel}
        </ButtonLink>
      </div>
    </section>
  );
}
