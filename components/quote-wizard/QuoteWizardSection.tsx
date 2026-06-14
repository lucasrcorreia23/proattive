import { QUOTE_SECTION_ID } from "@/lib/constants";
import { QuoteWizard } from "./QuoteWizard";

export function QuoteWizardSection() {
  return (
    <section
      id={QUOTE_SECTION_ID}
      className="relative overflow-visible bg-brand px-4 py-12 md:px-[186px] md:py-16"
    >
      <QuoteWizard />
    </section>
  );
}
