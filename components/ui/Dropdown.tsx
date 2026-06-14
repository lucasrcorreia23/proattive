"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type DropdownOption = {
  value: string;
  label: string;
};

type DropdownProps = {
  label: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  labelClassName?: string;
};

export function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Selecione",
  labelClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative flex w-full flex-col gap-2">
      <p className={cn("text-base font-semibold text-white", labelClassName)}>
        {label}
      </p>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={cn(
            "flex h-[52px] w-full items-center gap-2.5 rounded-card border bg-white px-4",
            open ? "border-accent" : "border-border",
          )}
        >
          <span
            className={cn(
              "flex-1 text-left text-sm",
              selected ? "text-text" : "text-muted",
            )}
          >
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown
            className={cn(
              "size-5 shrink-0 text-accent transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-[280px] overflow-y-auto rounded-card border border-border bg-white p-2 shadow-lg"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange?.(option.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center rounded p-2"
                >
                  <span
                    className={cn(
                      "flex h-[42px] flex-1 items-center justify-between rounded px-4 text-sm text-text",
                      isSelected && "bg-brand-light/20",
                    )}
                  >
                    {option.label}
                    {isSelected && <Check className="size-4 text-brand" />}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
