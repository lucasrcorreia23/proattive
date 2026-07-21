"use client";

import { cn } from "@/lib/utils";

type NumberInputProps = {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  min?: number;
  hint?: string;
  labelClassName?: string;
};

export function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  min = 1,
  hint,
  labelClassName,
}: NumberInputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <p className={cn("text-base font-semibold text-white", labelClassName)}>
        {label}
      </p>

      <input
        type="number"
        inputMode="numeric"
        min={min}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-[52px] w-full rounded-card border border-border bg-white px-4 text-sm text-text outline-none placeholder:text-muted focus:border-accent"
      />

      {hint && <p className="text-xs font-light text-white/70">{hint}</p>}
    </div>
  );
}
