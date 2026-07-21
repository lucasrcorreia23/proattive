import type { Metadata } from "next";
import { CourseSplitSection, type CourseBullet } from "@/components/home/CourseSplitSection";
import { CtaBandSection } from "@/components/home/CtaBandSection";
import { HomeFooter } from "@/components/home/HomeFooter";
import { Header } from "@/components/layout/Header";
import { assets } from "@/lib/assets";
import {
  arieleWhatsappHref,
  HOTMART_CARROS_ELETRICOS_HREF,
  MATRICULA_QUOTE_HREF,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "ProAttive Treinamentos | Cursos e Consultoria em Segurança Contra Incêndio",
  description:
    "Cursos, mentoria e consultoria especializada em segurança contra incêndio, Lei Lucas, projetos preventivos e regularização de recarga de veículos elétricos.",
};

type CourseSection = {
  imageSrc: string;
  imageAlt: string;
  imageSide: "left" | "right";
  bg: "surface" | "white";
  title: string;
  subtitle: string;
  bullets: CourseBullet[];
  ctaHref: string;
  ctaExternal?: boolean;
};

const COURSES: CourseSection[] = [
  {
    imageSrc: assets.courses.brigada,
    imageAlt: "Equipe de profissionais com capacetes de segurança",
    imageSide: "left",
    bg: "surface",
    title: "Curso Brigada de Incêndio e Conformidade com a Lei Lucas (Lei 13.722/18)",
    subtitle:
      "Uma solução completa para profissionais e empresas que buscam conformidade com a legislação vigente e máxima segurança.",
    bullets: [
      {
        title: "Empresas e Condomínios",
        description:
          "Profissionais designados para a Brigada de Incêndio e cumprimento de normas de segurança.",
      },
      {
        title: "Instituições de Ensino",
        description:
          "Escolas, creches e colônias de férias que precisam se adequar à Lei Lucas.",
      },
      {
        title: "Eventos e Recreação",
        description:
          "Monitores, instrutores de academias, buffets infantis e profissionais de lazer.",
      },
    ],
    ctaHref: arieleWhatsappHref(
      "Olá! Tenho interesse no Curso Brigada de Incêndio e Lei Lucas.",
    ),
    ctaExternal: true,
  },
  {
    imageSrc: assets.courses.eletricos,
    imageAlt: "Recarga de veículo elétrico",
    imageSide: "right",
    bg: "white",
    title: "Curso Regularização de Locais com Alimentação de Carros Elétricos",
    subtitle:
      "Domine a Instrução Normativa mais urgente do mercado atual. Um treinamento desenvolvido para capacitar profissionais a projetar, enquadrar e aprovar infraestruturas de recarga de veículos elétricos com total segurança técnica e conformidade legal.",
    bullets: [
      {
        title: "Engenheiros",
        description:
          "Profissionais que precisam entender as características do incêndio em baterias de lítio, dominar os requisitos gerais do SAVE e aprender o passo a passo definitivo para montar um Projeto Baseado em Desempenho (PBD) sem travar nas exigências do Corpo de Bombeiros.",
      },
    ],
    // Único curso com checkout próprio; os outros dois passam pelo WhatsApp.
    ctaHref: HOTMART_CARROS_ELETRICOS_HREF,
    ctaExternal: true,
  },
  {
    imageSrc: assets.courses.preventivo,
    imageAlt: "Engenheiros analisando projeto em obra",
    imageSide: "left",
    bg: "surface",
    title: "Curso Qualificação ao Projeto Preventivo",
    subtitle:
      "A formação definitiva para dominar processos preventivos do zero ao Habite-se. Aprenda a aplicar a legislação com inteligência prática e elimine os erros comuns que reprovam projetos.",
    bullets: [
      {
        title: "Engenheiros e Arquitetos:",
        description:
          "Engenheiros civis, mecânicos, sanitários, industriais e arquitetos que buscam segurança técnica para compatibilizar layouts e projetar sistemas (hidrantes, GLP, compartimentação) sem medo de reprovações.",
      },
      {
        title: "Técnicos de Edificações:",
        description:
          "Profissionais focados na execução gráfica, lançamento preciso de simbologias padronizadas em planta e estruturação de memoriais descritivos sem superdimensionamento.",
      },
      {
        title: "Técnicos de Segurança do Trabalho:",
        description:
          "Especialistas responsáveis pelo compliance de empresas, implantação de planos de emergência e gestão de vistorias anuais para a geração de receita recorrente com alvarás.",
      },
    ],
    ctaHref: arieleWhatsappHref(
      "Olá! Tenho interesse no Curso de Qualificação ao Projeto Preventivo.",
    ),
    ctaExternal: true,
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {COURSES.map((course) => (
          <CourseSplitSection
            key={course.title}
            {...course}
            ctaLabel="MATRICULE-SE AGORA"
          />
        ))}

        <CtaBandSection
          theme="white"
          title="Mentoria Direcionada"
          ctaLabel="ENTRE EM CONTATO CONOSCO"
          ctaHref={MATRICULA_QUOTE_HREF}
          paragraph={
            <>
              <strong className="font-semibold">6 meses</strong> de acompanhamento prático{" "}
              <strong className="font-semibold">em grupo</strong> com{" "}
              <strong className="font-semibold">encontros agendados</strong>,{" "}
              <strong className="font-semibold">suporte no WhatsApp</strong> e análise de{" "}
              <strong className="font-semibold">casos reais</strong>. O passo a passo
              definitivo para você aprovar processos de{" "}
              <strong className="font-semibold">Habite-se e Alvará</strong>.
            </>
          }
        />

        <CtaBandSection
          theme="brand"
          title="Consultoria Especializada"
          ctaLabel="ENTRE EM CONTATO CONOSCO"
          ctaHref={MATRICULA_QUOTE_HREF}
          paragraph={
            <>
              <strong className="font-semibold">2 meses</strong> de direcionamento focado e{" "}
              <strong className="font-semibold">individual</strong>, com agendas
              personalizadas para{" "}
              <strong className="font-semibold">resolver os gargalos</strong> dos seus
              projetos mais complexos e garantir total{" "}
              <strong className="font-semibold">segurança técnica e jurídica</strong> nas
              aprovações.
            </>
          }
        />
      </main>
      <HomeFooter />
    </>
  );
}
