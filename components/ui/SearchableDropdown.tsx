"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { DropdownOption } from "./Dropdown";

type SearchableDropdownProps = {
  label: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  hint?: string;
  labelClassName?: string;
};

/** Remove acentuação para que "reuniao" encontre "reunião". */
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function SearchableDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Selecione",
  hint,
  labelClassName,
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

  /** Fechar sempre limpa a busca, para reabrir com a lista inteira. */
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return options;
    return options.filter((option) => normalize(option.label).includes(term));
  }, [options, query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [close]);

  return (
    <div ref={containerRef} className="relative flex w-full flex-col gap-2">
      <p className={cn("text-base font-semibold text-white", labelClassName)}>
        {label}
      </p>

      <div className="relative">
        <button
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={cn(
            "flex h-[52px] w-full items-center gap-2.5 rounded-card border bg-white px-4",
            open ? "border-accent" : "border-border",
          )}
        >
          <span
            className={cn(
              "flex-1 truncate text-left text-sm",
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
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 rounded-card border border-border bg-white shadow-lg">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Search className="size-4 shrink-0 text-muted" />
              <input
                ref={(node) => node?.focus()}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por código ou descrição"
                className="w-full text-sm text-text outline-none placeholder:text-muted"
              />
            </div>

            <div role="listbox" className="max-h-[280px] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-muted">
                  Nenhuma ocupação encontrada.
                </p>
              )}

              {filtered.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange?.(option.value);
                      close();
                    }}
                    className="flex w-full items-center rounded p-2 text-left"
                  >
                    <span
                      className={cn(
                        "flex min-h-[42px] flex-1 items-center justify-between gap-3 rounded px-4 py-2 text-sm text-text",
                        isSelected && "bg-brand-light/20",
                      )}
                    >
                      {option.label}
                      {isSelected && <Check className="size-4 shrink-0 text-brand" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {hint && <p className="text-xs font-light text-white/70">{hint}</p>}
    </div>
  );
}
