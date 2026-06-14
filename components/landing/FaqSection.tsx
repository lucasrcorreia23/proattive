import { SectionTitle } from "@/components/ui/SectionTitle";
import { Accordion } from "@/components/ui/Accordion";

const faqs = [
  {
    id: "faq-1",
    title: "O certificado é válido para o Corpo de Bombeiros?",
    content:
      "Sim. Nosso treinamento de Brigadista é emitido em conformidade com a NR-23 e as Normas Técnicas do Corpo de Bombeiros Militar, sendo plenamente aceito para a emissão ou renovação de alvarás e do AVCB.",
  },
  {
    id: "faq-2",
    title: "O curso atende a todas as exigências da Lei Lucas?",
    content:
      "Sim. O conteúdo programático foi desenvolvido rigorosamente para cumprir a Lei Federal 13.722/18, capacitando professores e colaboradores de instituições de ensino e recreação para agir em emergências infantis.",
  },
  {
    id: "faq-3",
    title: "Quem pode realizar o treinamento?",
    content:
      "O curso é destinado a profissionais da educação, monitores, síndicos, zeladores e colaboradores de empresas designados para a brigada de incêndio, além de qualquer pessoa que deseje aprender primeiros socorros.",
  },
  {
    id: "faq-4",
    title: "Qual a carga horária do curso?",
    content:
      "O treinamento completo possui uma carga horária total de 16 horas. O conteúdo é dividido de forma estratégica em três módulos: Noções de Extinção de Incêndios (6h), Primeiros Socorros (6h) e Atividades da Brigada de Incêndio (4h).",
  },
  {
    id: "faq-5",
    title: "Recebo o certificado logo após o término?",
    content:
      "Sim. Após a conclusão do treinamento e a avaliação final, o seu certificado digital é gerado e liberado imediatamente para download na plataforma, pronto para ser apresentado aos órgãos de fiscalização.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="bg-brand-surface px-4 py-16 md:px-[186px]">
      <div className="mx-auto flex max-w-[1128px] flex-col items-center gap-10">
        <SectionTitle
          dark
          title="Perguntas frequentes"
          subtitle="Tire suas dúvidas sobre certificações, validade legal e como nosso treinamento funciona na prática."
        />
        <div className="w-full max-w-[744px]">
          <Accordion items={faqs} variant="faq" />
        </div>
      </div>
    </section>
  );
}
