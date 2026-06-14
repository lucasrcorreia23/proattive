"use client";

import { Dropdown } from "@/components/ui/Dropdown";
import { SelectorGroup } from "@/components/ui/SelectorGroup";
import type { FlowField } from "@/lib/quote-flow/types";

type StepRendererProps = {
  fields: FlowField[];
  answers: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
  compactProfile?: boolean;
};

export function StepRenderer({
  fields,
  answers,
  onChange,
  compactProfile = false,
}: StepRendererProps) {
  return (
    <div className="relative flex w-full max-w-[744px] flex-col gap-8 overflow-visible">
      {fields.map((field) => {
        if (field.type === "selector") {
          return (
            <SelectorGroup
              key={field.id}
              label={field.label}
              options={field.options}
              value={answers[field.id]}
              onChange={(value) => onChange(field.id, value)}
              compact={compactProfile || field.readOnly}
              readOnly={field.readOnly}
            />
          );
        }

        return (
          <Dropdown
            key={field.id}
            label={field.label}
            options={field.options}
            value={answers[field.id]}
            onChange={(value) => onChange(field.id, value)}
          />
        );
      })}
    </div>
  );
}
