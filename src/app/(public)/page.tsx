import { HeroSection } from "@/components/public/HeroSection";
import { StatsSection } from "@/components/public/StatsSection";
import { HowItWorksTimeline } from "@/components/public/HowItWorksTimeline";
import { ImpactMetrics } from "@/components/public/ImpactMetrics";
import { TestimonialsCarousel } from "@/components/public/TestimonialsCarousel";
import { PricingCards } from "@/components/public/PricingCards";
import { FAQAccordion } from "@/components/public/FAQAccordion";
import { NewsletterForm } from "@/components/public/NewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AGRINET RURALPAY — Digitising Ghana’s Agricultural Value Chain",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <HowItWorksTimeline />
      <ImpactMetrics />
      <TestimonialsCarousel />
      <PricingCards />
      <FAQAccordion />
      <NewsletterForm />
    </>
  );
}
