import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/utils";

type CtaBandSectionProps = {
  theme: "surface" | "brand";
  title: string;
  paragraph: ReactNode;
  ctaLabel: string;
  ctaHref: string;
};

export function CtaBandSection({
  theme,
  title,
  paragraph,
  ctaLabel,
  ctaHref,
}: CtaBandSectionProps) {
  const isBrand = theme === "brand";

  return (
    <section className={cn(isBrand ? "bg-brand text-white" : "bg-brand-surface text-brand")}>
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
