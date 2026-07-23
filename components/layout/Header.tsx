"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { assets } from "@/lib/assets";
import {
  MATRICULA_PATH,
  MATRICULA_QUOTE_HREF,
  NAV_LINKS,
  QUOTE_SECTION_ID,
  SITE,
} from "@/lib/constants";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  function handleContact() {
    // Na landing do curso, o quote wizard existe na própria página → scroll suave.
    // Nas demais páginas (ex.: nova home), navega até a seção na página realocada.
    if (pathname === MATRICULA_PATH) {
      document.getElementById(QUOTE_SECTION_ID)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(MATRICULA_QUOTE_HREF);
    }
  }

  return (
    <header className="relative border-b border-white/60 bg-white/75 backdrop-blur-md">
      <div className="mx-auto max-w-[1128px] px-4 lg:px-0">
        {/* Linha superior: telefone | logo | instagram */}
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center py-5">
          <a
            href={`tel:${SITE.phoneHref}`}
            className="hidden items-center gap-2 text-sm font-medium text-brand lg:flex"
          >
            <Image
              src={assets.icons.phone}
              alt=""
              width={18}
              height={18}
              className="size-[18px] shrink-0"
            />
            {SITE.phone}
          </a>

          <Link href="/" className="col-start-2 justify-self-center">
            <Logo />
          </Link>

          <a
            href={SITE.instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center justify-end gap-2 text-sm font-medium text-brand lg:flex"
          >
            <InstagramIcon className="size-[18px] shrink-0" />
            Instagram
          </a>

          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 lg:hidden"
            onClick={() => setOpen((current) => !current)}
            aria-label="Menu"
          >
            {open ? (
              <X className="size-6 text-brand" />
            ) : (
              <Menu className="size-6 text-brand" />
            )}
          </button>
        </div>

        {/* Linha inferior: navegação | CTA */}
        <div className="hidden items-center justify-between gap-6 border-t border-brand/10 py-4 lg:flex">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium uppercase tracking-wide text-brand transition-colors hover:text-accent"
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button variant="default" className="shrink-0 uppercase" onClick={handleContact}>
            ENTRE EM CONTATO
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-brand/10 bg-white/95 px-4 py-4 backdrop-blur-md lg:hidden">
          <div className="mb-4 flex flex-col gap-3 border-b border-brand/10 pb-4">
            <a
              href={`tel:${SITE.phoneHref}`}
              className="flex items-center gap-2 text-sm font-medium text-brand"
            >
              <Image
                src={assets.icons.phone}
                alt=""
                width={18}
                height={18}
                className="size-[18px]"
              />
              {SITE.phone}
            </a>
            <a
              href={SITE.instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-brand"
            >
              <InstagramIcon className="size-[18px]" />
              Instagram
            </a>
          </div>
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium uppercase tracking-wide text-brand"
                onClick={() => setOpen(false)}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </Link>
            ))}
            <Button
              variant="default"
              className="mt-2 uppercase"
              onClick={() => {
                setOpen(false);
                handleContact();
              }}
            >
              ENTRE EM CONTATO
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
