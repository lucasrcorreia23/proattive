import { cn } from "@/lib/utils";

type SectionTitleProps = {
  title: string;
  subtitle?: React.ReactNode;
  className?: string;
  dark?: boolean;
};

export function SectionTitle({
  title,
  subtitle,
  className,
  dark = false,
}: SectionTitleProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 text-center", className)}>
      <h2
        className={cn(
          "text-[32px] font-semibold leading-tight",
          dark ? "text-brand" : "text-white",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "max-w-3xl text-base font-light leading-7",
            dark ? "text-brand/70" : "text-white",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
