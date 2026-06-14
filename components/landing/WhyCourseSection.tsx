import Image from "next/image";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { assets } from "@/lib/assets";

const benefits = [
  {
    icon: assets.icons.law,
    title: "Conformidade Legal",
    description:
      "Evite multas e interdições. Esteja em conformidade com a Lei Lucas e as normas de segurança do trabalho (NR-23) exigidas pelos órgãos fiscalizadores.",
  },
  {
    icon: assets.icons.shield,
    title: "Gestão de Riscos",
    description:
      "Proteja sua estrutura. Brigadistas treinados reduzem drasticamente o risco de danos irreversíveis ao patrimônio em casos de princípios de incêndio.",
  },
  {
    icon: assets.icons.heart,
    title: "Proteção à Vida",
    description:
      "O fator tempo é decisivo. Saiba como agir corretamente em engasgos, paradas e acidentes, garantindo a sobrevivência de alunos, moradores e colaboradores.",
  },
];

export function WhyCourseSection() {
  return (
    <section className="bg-white px-4 py-16 md:px-[186px]">
      <div className="mx-auto flex max-w-[1128px] flex-col items-center gap-12">
        <SectionTitle
          dark
          title="Sua equipe preparada é a sua maior segurança"
          subtitle="Transforme a teoria em prontidão. Capacite seus colaboradores com as técnicas essenciais de salvamento e combate a incêndio exigidas por lei."
        />

        <div className="grid w-full gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="flex flex-col items-center rounded-card bg-brand px-6 py-8 text-center text-white"
            >
              <div className="mb-6 flex size-[72px] items-center justify-center rounded-full bg-brand-light/30">
                <Image
                  src={benefit.icon}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 object-contain"
                />
              </div>
              <h3 className="mb-4 text-lg font-semibold">{benefit.title}</h3>
              <p className="text-sm leading-6 text-white/90">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
