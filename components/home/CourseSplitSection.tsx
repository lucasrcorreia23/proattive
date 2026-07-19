import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/utils";

export type CourseBullet = {
  title: string;
  description: string;
};

type CourseSplitSectionProps = {
  imageSrc: string;
  imageAlt: string;
  imageSide: "left" | "right";
  bg: "surface" | "white";
  title: string;
  subtitle: string;
  bullets: CourseBullet[];
  ctaLabel: string;
  ctaHref: string;
  /** Quando true, abre o link em nova aba (WhatsApp/Hotmart e outros destinos externos). */
  ctaExternal?: boolean;
};

export function CourseSplitSection({
  imageSrc,
  imageAlt,
  imageSide,
  bg,
  title,
  subtitle,
  bullets,
  ctaLabel,
  ctaHref,
  ctaExternal = false,
}: CourseSplitSectionProps) {
  return (
    <section className={cn(bg === "surface" ? "bg-brand-surface" : "bg-white")}>
      <div className="grid lg:grid-cols-2 lg:items-stretch">
        <div
          className={cn(
            "relative aspect-[4/3] lg:aspect-auto",
            imageSide === "right" ? "lg:order-2" : "lg:order-1",
          )}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div
          className={cn(
            "flex items-center px-6 py-12 sm:px-10 lg:px-16 lg:py-20",
            imageSide === "right" ? "lg:order-1" : "lg:order-2",
          )}
        >
          <div className="flex w-full max-w-[620px] flex-col gap-10 text-brand">
            <div className="flex flex-col gap-2">
              <h2 className="text-[32px] font-semibold leading-tight sm:text-[40px] sm:leading-[48px]">
                {title}
              </h2>
              <p className="text-base font-light leading-7">{subtitle}</p>
            </div>

            <ul className="flex flex-col gap-6">
              {bullets.map((bullet) => (
                <li key={bullet.title} className="flex gap-3">
                  <span className="mt-[10px] size-2 shrink-0 rounded-full bg-brand" aria-hidden />
                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-semibold leading-7">{bullet.title}</p>
                    <p className="text-sm font-light leading-7">{bullet.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <ButtonLink
              href={ctaHref}
              className="self-start"
              {...(ctaExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {ctaLabel}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
