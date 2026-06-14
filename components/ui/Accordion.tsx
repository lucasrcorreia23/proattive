"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  allowMultiple?: boolean;
  variant?: "default" | "faq";
  className?: string;
};

export function Accordion({
  items,
  allowMultiple = false,
  variant = "default",
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);

  function toggle(id: string) {
    setOpenIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      if (allowMultiple) {
        return [...current, id];
      }
      return [id];
    });
  }

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className={cn(
              "overflow-hidden rounded-card border border-border bg-white",
              variant === "faq" && "border-transparent bg-white",
            )}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
            >
              <span className="text-sm font-medium text-text">{item.title}</span>
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 text-accent transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen && (
              <div className="border-t border-border px-5 pb-5 pt-2 text-sm leading-6 text-text/80">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
