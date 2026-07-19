"use client";

import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { QUOTE_SECTION_ID } from "@/lib/constants";

const modules = [
  {
    id: "modulo-1",
    title: "Módulo 1 | Noções de Extinção de Incêndio - 6h",
    content: (
      <ul className="space-y-1">
        {[
          "Fundamentos do fogo",
          "Tetraedro do fogo e classes de incêndio",
          "Métodos de extinção do fogo",
          "Extintores de incêndio",
          "Uso correto do extintor",
          "Equipamentos de proteção individual",
          "Sistema hidráulico preventivo",
          "Esguichos e acessórios hidráulicos",
          "Sistemas de prevenção contra incêndio",
          "Sistemas automáticos de proteção",
          "Manutenção dos sistemas preventivos",
        ].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ),
  },
  {
    id: "modulo-2",
    title: "Módulo 2 | Primeiros Socorros - 6h",
    content: (
      <ul className="space-y-1">
        {[
          "Avaliação inicial da vítima",
          "Emergências traumáticas",
          "Queimaduras",
          "Obstrução de vias aéreas",
          "Parada cardiorrespiratória",
          "Emergências clínicas",
          "Simulações de atendimento",
        ].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ),
  },
  {
    id: "modulo-3",
    title: "Módulo 3 | Atividades da Brigada de Incêndio - 4h",
    content: (
      <ul className="space-y-1">
        {[
          "Introdução à brigada de incêndio",
          "Aspectos legais da brigada",
          "Organização da brigada",
          "Atuação em emergências",
          "Comportamento humano em incêndios",
          "Plano de emergência e abandono de área",
        ].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ),
  },
];

export function ModulesSection() {
  return (
    <section id="modulos" className="bg-white px-4 py-16 md:px-[186px]">
      <div className="mx-auto grid max-w-[1128px] gap-10 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl font-semibold leading-tight text-brand">
            O que você vai dominar no treinamento
          </h2>
          <p className="text-base leading-7 text-brand/80">
            Tudo o que você precisa saber sobre prevenção de acidentes, combate a
            incêndio e primeiros socorros em um único treinamento certificado.
          </p>
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
        <Accordion items={modules} />
      </div>
    </section>
  );
}
