import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { buttonClasses, type ButtonVariant } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

/**
 * CTA em forma de link: reusa exatamente os tokens da pílula do Button, mas
 * renderiza um <Link> (HTML válido para navegação, funciona em server components).
 */
export function ButtonLink({
  variant = "default",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, cn("uppercase", className))} {...props}>
      {children}
    </Link>
  );
}
