import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import { ANCHOR_LINKS, MATRICULA_PATH, SITE } from "@/lib/constants";

function quickLinkHref(href: string) {
  // ANCHOR_LINKS aponta para seções que vivem na página realocada (/matricula).
  return href === "#" ? MATRICULA_PATH : `${MATRICULA_PATH}${href}`;
}

export function HomeFooter() {
  return (
    <footer className="bg-brand-surface">
      <div className="mx-auto flex max-w-[1128px] flex-col gap-12 px-4 py-16 md:flex-row md:items-start md:justify-between lg:px-0">
        {/* Marca */}
        <div className="flex max-w-[280px] flex-col gap-6">
          <Image
            src={assets.logo.treinamentosFull}
            alt="ProAttive Treinamentos"
            width={525}
            height={168}
            className="h-auto w-[240px]"
          />
          <p className="text-sm leading-6 text-brand-light">
            Mais que um treinamento, entregamos a confiança e o conhecimento
            necessários para salvar vidas e proteger seu patrimônio.
          </p>
        </div>

        {/* Links + Contato agrupados à direita */}
        <div className="flex gap-16 sm:gap-24">
          <nav className="flex flex-col gap-6">
            <h3 className="text-base font-bold text-brand">Links Rápidos</h3>
            {ANCHOR_LINKS.map((link) => (
              <Link
                key={link.label}
                href={quickLinkHref(link.href)}
                className="text-sm text-brand-light transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-6">
            <h3 className="text-base font-bold text-brand">Contato</h3>
            <a
              href={`tel:${SITE.phoneHref}`}
              className="flex items-center gap-3 text-sm text-brand-light transition-colors hover:text-accent"
            >
              <Image
                src={assets.icons.phone}
                alt=""
                width={20}
                height={20}
                className="size-5 shrink-0"
              />
              {SITE.phone}
            </a>
            <div className="flex max-w-[240px] gap-3 text-sm leading-6 text-brand-light">
              <Image
                src={assets.icons.mapPin}
                alt=""
                width={20}
                height={20}
                className="mt-0.5 size-5 shrink-0"
              />
              <span>{SITE.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé inferior */}
      <div className="bg-[#f5f5f5]">
        <div className="mx-auto max-w-[1128px] px-4 py-4 lg:px-0">
          <p className="text-sm text-brand-light">{SITE.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
