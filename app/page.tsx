import { AudienceSection } from "@/components/landing/AudienceSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { ModulesSection } from "@/components/landing/ModulesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { WhyCourseSection } from "@/components/landing/WhyCourseSection";
import { WhyUsSection } from "@/components/landing/WhyUsSection";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { QuoteWizardSection } from "@/components/quote-wizard/QuoteWizardSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <WhyCourseSection />
        <QuoteWizardSection />
        <ModulesSection />
        <AudienceSection />
        <WhyUsSection />
        <FaqSection />
        <TestimonialsSection />
        <FinalCtaSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
