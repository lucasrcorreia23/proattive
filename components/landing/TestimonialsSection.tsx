"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    quote:
      "Lorem ipsum id varius duis rhoncus aliquam mi blandit sit habitant duis ea morbi et lacus od mam mi blandit sit habitant duit duisaandit sit habitant duis e.a morbi et lacus od mam mi blandit sit habitant duit duisamm mi blandit sit habitant duisauris sapien pulvinar.",
    name: "João Vitor M. Teixeira",
    role: "Residencial Sunset",
  },
  {
    quote:
      "Lorem ipsum id varius duis rhoncus aliquam mi blandit sit habitant duis ea morbi et lacus od mam mi blandit sit habitant duit duisam mi blandit sit habitant duisauris sapien pulvinar.",
    name: "Maria L. Albuquerque",
    role: "Residencial Sunset",
  },
  {
    quote:
      "Lorem ipsum id varius duis rhoncus aliquam mi blandit sit habitant duis ea morbi et lacus od mam mi blandit sit habitant duit duisam mi blandit sit habitant duisauris sapien pulvinar.",
    name: "Pedro J. Silveira",
    role: "Residencial Sunset",
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
          <p className="mt-4 text-base leading-7 text-text/80">
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
            <p className="text-sm leading-6 text-text/80">&ldquo;{current.quote}&rdquo;</p>
            <div className="mt-6">
              <p className="font-semibold text-brand">{current.name}</p>
              <p className="text-sm text-text/70">{current.role}</p>
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
