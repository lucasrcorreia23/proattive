import Image from "next/image";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "header" | "footer";
};

export function Logo({ className, variant = "header" }: LogoProps) {
  if (variant === "footer") {
    return (
      <div className={cn("relative h-[98px] w-[217px]", className)}>
        <Image
          src={assets.logo.main}
          alt="ProAttive Engenharia Contra-Incêndio"
          fill
          className="object-contain object-left"
          priority
        />
      </div>
    );
  }

  return (
    <div className={cn("relative h-[72px] w-[220px] sm:h-[82px] sm:w-[250px]", className)}>
      <Image
        src={assets.logo.full}
        alt="ProAttive Engenharia Contra-Incêndio"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
