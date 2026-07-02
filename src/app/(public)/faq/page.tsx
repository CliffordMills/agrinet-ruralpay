import type { Metadata } from "next";
import { FAQAccordion } from "@/components/public/FAQAccordion";

export const metadata: Metadata = { title: "FAQ" };

export default function FAQPage() {
  return (
    <div>
      <div className="bg-primary text-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-white/80">
            Everything you need to know about AGRINET RURALPAY.
          </p>
        </div>
      </div>
      <FAQAccordion />
    </div>
  );
}
