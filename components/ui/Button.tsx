import { cn } from "@/lib/utils";

export type ButtonVariant = "default" | "outlined" | "secondary" | "disabled";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  asChild?: false;
};

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-accent text-white hover:bg-accent/90",
  outlined: "border border-accent bg-transparent text-accent hover:bg-accent-soft",
  secondary: "border border-black bg-white text-text hover:bg-gray-50",
  disabled: "bg-disabled text-white cursor-not-allowed",
};

export function Button({
  variant = "default",
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || variant === "disabled";

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-pill px-6 text-xs font-bold transition-colors",
        variantClasses[isDisabled ? "disabled" : variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
