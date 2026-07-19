"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { assets } from "@/lib/assets";
import { QUOTE_SECTION_ID } from "@/lib/constants";

const audiences = [
  {
    number: "01",
    title: "Empresas e Condomínios",
    description:
      "Profissionais designados para a Brigada de Incêndio e cumprimento de normas de segurança.",
  },
  {
    number: "02",
    title: "Instituições de Ensino",
    description:
      "Escolas, creches e colônias de férias que precisam se adequar à Lei Lucas.",
  },
  {
    number: "03",
    title: "Eventos e Recreação",
    description:
      "Monitores, instrutores de academias, buffets infantis e profissionais de lazer.",
  },
];

export function AudienceSection() {
  return (
    <section id="publico" className="bg-brand-surface px-4 py-16 md:px-[186px]">
      <div className="mx-auto grid max-w-[1128px] gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative min-h-[320px] overflow-hidden rounded-card lg:min-h-[684px]">
          <Image
            src={assets.sections.audience}
            alt="Profissionais em treinamento de segurança"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 728px"
          />
        </div>

        <div className="flex flex-col gap-10">
          <div>
            <h2 className="mb-4 text-3xl font-semibold text-brand">
              Para quem é este treinamento?
            </h2>
            <p className="text-base leading-7 text-brand/80">
              Uma solução completa para profissionais e empresas que buscam
              conformidade com a legislação vigente e máxima segurança.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {audiences.map((item) => (
              <div key={item.number} className="flex gap-4">
                <span className="text-xl font-semibold text-accent">{item.number}</span>
                <div>
                  <h3 className="text-lg font-semibold text-brand">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-brand/80">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="default"
            className="w-fit"
            onClick={() =>
              document.getElementById(QUOTE_SECTION_ID)?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            SOLICITAR ORÇAMENTO
          </Button>
        </div>
      </div>
    </section>
  );
}
