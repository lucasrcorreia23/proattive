import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { assets } from "@/lib/assets";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto grid max-w-[1128px] gap-10 px-4 py-14 md:grid-cols-[1fr_2fr] lg:px-0">
        <div className="flex flex-col gap-4">
          <Logo variant="footer" />
          <p className="max-w-xs text-sm leading-6 text-text/80">
            Muito mais do que serviços, construímos parcerias sólidas, reforçando
            nossa missão de tornar edificações mais seguras e prontas para a
            atuação eficaz dos bombeiros.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase text-brand">Onde estamos</h3>
            <div className="flex gap-3 text-sm leading-6 text-text/80">
              <Image
                src={assets.icons.mapPin}
                alt=""
                width={24}
                height={24}
                className="mt-1 size-6 shrink-0"
              />
              <span>{SITE.address}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text/80">
              <Image
                src={assets.icons.phone}
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
              <a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-brand">Institucional</h3>
            {NAV_LINKS.slice(0, 5).map((link) => (
              <Link key={link.label} href={link.href} className="text-sm text-text/80 hover:text-accent">
                {link.label.charAt(0) + link.label.slice(1).toLowerCase()}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-brand">Links Rápidos</h3>
            {NAV_LINKS.slice(4).map((link) => (
              <Link key={link.label} href={link.href} className="text-sm text-text/80 hover:text-accent">
                {link.label.charAt(0) + link.label.slice(1).toLowerCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border py-4">
        <p className="text-center text-sm text-text/70">{SITE.copyright}</p>
      </div>
    </footer>
  );
}
