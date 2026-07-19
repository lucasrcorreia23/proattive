"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    quote:
      "Quero expressar meus sinceros elogios ao excelente treinamento proporcionado pela ProAttive engenharia contra incêndio para formação da nossa brigada de incêndio. Fiquei extremamente impressionada com a dedicação, profissionalismo e eficácia demonstrados durante o treinamento. É evidente que a empresa se preocupa profundamente com a segurança e investe de forma significativa para garantir que estejam bem preparados para lidar com situações de emergência. Parabéns à equipe de treinamento e à empresa por sua abordagem proativa e compromisso com a segurança.",
    name: "Rejane Bizoto",
    role: "Khomp | Enabling Technology",
  },
  {
    quote:
      "Gratidão à Proattive que através da Deise e sua equipe estão sempre buscando as melhores alternativas técnicas para melhor atender e viabilizar nossos projetos. Sua equipe técnica é preparada, responsável, nos atendem sempre com simpatia, possuem praticidade e agilidade nas respostas, promovem soluções viáveis em relação a custo e operação e dão todo o suporte técnico nos processos de aprovação dos projetos preventivos contra incêndio e implantação da obra.",
    name: "Helmo Luiz Arbusa",
    role: "Grupo Koch",
  },
  {
    quote:
      "Passando aqui para fazer uma menção a ProAttive. Nós aqui da Dermus estamos muito felizes e realizados com o trabalho que desempenharam, era um momento em que a Dermus estava precisando de bastante orientação já que é um trabalho sério, e vocês conseguiram entregar até muito mais, fizeram um trabalho bem minucioso, sempre preocupados com questão de custos, sempre otimizando o trabalho, levantando as várias possibilidades e linkando isso com custos mais acessíveis. Então fizeram um trabalho de excelência aqui e ficamos bem honrados e felizes aqui a Equipe da Dermus com a ProAttive.",
    name: "Juliano André Appel",
    role: "Dermus Pharma",
  },
];

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  return (
    <section id="depoimentos" className="bg-white px-4 py-16 md:px-[186px]">
      <div className="mx-auto grid max-w-[1128px] gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-4xl font-semibold leading-tight text-brand">
            A escolha de quem prioriza um ambiente seguro
          </h2>
          <p className="mt-4 text-base leading-7 text-brand/80">
            Veja como ajudamos diretores e gestores a garantirem a conformidade
            legal e a segurança de suas equipes.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              setIndex((value) => (value - 1 + testimonials.length) % testimonials.length)
            }
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-white"
            aria-label="Depoimento anterior"
          >
            <ChevronLeft className="size-5" />
          </button>

          <article className="flex-1 rounded-card border border-border p-6">
            <p className="text-sm leading-6 text-brand/80">&ldquo;{current.quote}&rdquo;</p>
            <div className="mt-6">
              <p className="font-semibold text-brand">{current.name}</p>
              <p className="text-sm text-brand/70">{current.role}</p>
            </div>
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  aria-label={`Ir para depoimento ${dotIndex + 1}`}
                  onClick={() => setIndex(dotIndex)}
                  className={`size-2.5 rounded-full ${
                    dotIndex === index ? "bg-accent" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </article>

          <button
            type="button"
            onClick={() => setIndex((value) => (value + 1) % testimonials.length)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-white"
            aria-label="Próximo depoimento"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
