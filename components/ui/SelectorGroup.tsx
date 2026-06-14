"use client";

import { cn } from "@/lib/utils";

type SelectorCardProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

export function SelectorCard({
  label,
  selected = false,
  onClick,
  disabled = false,
}: SelectorCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-[52px] flex-1 items-center gap-2.5 rounded-card px-4 text-sm transition-colors",
        selected
          ? "border border-accent bg-accent-soft text-accent"
          : "border border-transparent bg-white text-text",
        disabled && "cursor-default opacity-80",
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-accent" : "border-text/40",
        )}
      >
        {selected && <span className="size-2.5 rounded-full bg-accent" />}
      </span>
      <span className="text-left font-normal">{label}</span>
    </button>
  );
}

type SelectorOption = {
  value: string;
  label: string;
};

type SelectorGroupProps = {
  label: string;
  options: SelectorOption[];
  value?: string;
  onChange?: (value: string) => void;
  compact?: boolean;
  readOnly?: boolean;
  labelClassName?: string;
};

export function SelectorGroup({
  label,
  options,
  value,
  onChange,
  compact = false,
  readOnly = false,
  labelClassName,
}: SelectorGroupProps) {
  return (
    <div className={cn("flex w-full flex-col gap-4", compact && "gap-2")}>
      <p
        className={cn(
          "text-base font-semibold text-white",
          labelClassName,
        )}
      >
        {label}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
        {options.map((option) => (
          <SelectorCard
            key={option.value}
            label={option.label}
            selected={value === option.value}
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(option.value)}
          />
        ))}
      </div>
    </div>
  );
}
