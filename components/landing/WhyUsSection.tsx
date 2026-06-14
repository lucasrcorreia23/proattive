"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { assets } from "@/lib/assets";
import { QUOTE_SECTION_ID } from "@/lib/constants";

const items = [
  {
    icon: assets.icons.certificate,
    title: "Certificação Reconhecida",
    description:
      "Emitido imediatamente e aceito em todo o Brasil pelo Corpo de Bombeiros e órgãos de educação.",
  },
  {
    icon: assets.icons.methodology,
    title: "Metodologia Prática",
    description:
      "Simulações reais de combate a incêndio e manobras de primeiros socorros para o público infantil.",
  },
  {
    icon: assets.icons.instructors,
    title: "Instrutores Especialistas",
    description:
      "Conteúdo ministrado por profissionais com experiência real em emergências e segurança do trabalho.",
  },
  {
    icon: assets.icons.content,
    title: "Conteúdo Atualizado",
    description:
      "Material didático em total conformidade com as últimas atualizações da NR-23 e da Lei Lucas.",
  },
];

export function WhyUsSection() {
  return (
    <section id="vantagens" className="bg-white px-4 py-16 md:px-[186px]">
      <div className="mx-auto flex max-w-[1128px] flex-col items-center gap-12">
        <SectionTitle
          dark
          title="Por que escolher nosso treinamento?"
          subtitle="Unimos metodologia prática, suporte de especialistas e conformidade total com a lei para garantir a melhor experiência de aprendizado."
        />

        <div className="grid w-full gap-6 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.title}
              className="flex flex-col items-center rounded-card border border-border px-8 py-8 text-center"
            >
              <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-brand-light/20">
                <Image
                  src={item.icon}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 object-contain"
                />
              </div>
              <h3 className="mb-4 text-lg font-semibold text-brand">{item.title}</h3>
              <p className="text-sm leading-6 text-text/80">{item.description}</p>
            </article>
          ))}
        </div>

        <Button
          variant="default"
          onClick={() =>
            document.getElementById(QUOTE_SECTION_ID)?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          QUERO ME INSCREVER
        </Button>
      </div>
    </section>
  );
}
