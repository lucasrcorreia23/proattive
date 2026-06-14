"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { assets } from "@/lib/assets";
import { QUOTE_SECTION_ID } from "@/lib/constants";

const checklist = [
  "Certificado emitido imediatamente após a conclusão.",
  "Atende 100% às exigências da Lei 13.722/18 (Lei Lucas).",
  "Conforme as normas da NR-23 e do Corpo de Bombeiros.",
];

export function FinalCtaSection() {
  return (
    <section className="bg-white px-4 py-16 md:px-[186px]">
      <div className="mx-auto grid max-w-[1128px] gap-0 overflow-hidden rounded-card lg:grid-cols-2">
        <div className="relative min-h-[280px] lg:min-h-[540px]">
          <Image
            src={assets.sections.finalCta}
            alt="Treinamento de primeiros socorros"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 738px"
          />
        </div>
        <div className="flex flex-col justify-center gap-8 bg-brand px-8 py-12 text-white lg:px-12">
          <div>
            <h2 className="text-4xl font-semibold leading-tight">
              Regularize sua instituição hoje mesmo
            </h2>
            <p className="mt-4 text-base leading-7 text-white/90">
              Não deixe a segurança da sua equipe e a conformidade da sua
              instituição para depois. Obtenha sua certificação completa em um
              treinamento prático, reconhecido e atualizado.
            </p>
          </div>

          <ul className="space-y-4">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Image
                  src={assets.icons.checkCircle}
                  alt=""
                  width={24}
                  height={24}
                  className="mt-0.5 size-6 shrink-0"
                />
                <span className="text-sm leading-6">{item}</span>
              </li>
            ))}
          </ul>

          <Button
            variant="default"
            className="w-fit"
            onClick={() =>
              document.getElementById(QUOTE_SECTION_ID)?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            QUERO ME INSCREVER
          </Button>
        </div>
      </div>
    </section>
  );
}
