"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { assets } from "@/lib/assets";
import { QUOTE_SECTION_ID } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-surface px-4 py-12 md:px-[186px] md:py-14">
      {/* Desktop: polígonos com fotos de treinamento (frame 35:17) */}
      <Image
        src={assets.hero.polygonLeft}
        alt=""
        aria-hidden
        width={810}
        height={556}
        className="pointer-events-none absolute -left-[337px] top-0 hidden h-[556px] w-[810px] object-cover md:block"
        priority
      />
      <Image
        src={assets.hero.polygonRight}
        alt=""
        aria-hidden
        width={810}
        height={556}
        className="pointer-events-none absolute -right-[337px] top-0 hidden h-[556px] w-[810px] object-cover md:block"
        priority
      />

      {/* Mobile: fotos de extintor e primeiros socorros (frame 35:596) */}
      <div className="relative mx-auto mb-8 grid max-w-[770px] grid-cols-2 gap-3 md:hidden">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <Image
            src={assets.hero.fireTraining}
            alt="Treinamento de combate a incêndio"
            fill
            className="object-cover object-left"
            sizes="50vw"
            priority
          />
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <Image
            src={assets.hero.cprTraining}
            alt="Treinamento de primeiros socorros"
            fill
            className="object-cover object-right"
            sizes="50vw"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[320px] max-w-[770px] flex-col items-center justify-center gap-8 text-center md:min-h-[444px]">
        <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-extrabold leading-tight text-brand md:text-[48px] md:leading-[64px]">
          Curso Brigada de Incêndio e Conformidade com a Lei Lucas (Lei 13.722/18):
          certificação completa e reconhecida
        </h1>
        <p className="max-w-[572px] text-lg leading-7 text-brand/90 md:text-xl">
          Treine sua equipe com especialistas e garanta a conformidade legal da sua
          instituição ou empresa em poucos passos.
        </p>
        <Button
          variant="default"
          className="h-10 px-8 text-sm"
          onClick={() =>
            document.getElementById(QUOTE_SECTION_ID)?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          MATRICULE-SE AGORA
        </Button>
      </div>
    </section>
  );
}
