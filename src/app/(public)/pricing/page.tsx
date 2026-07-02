import type { Metadata } from "next";
import { PricingCards } from "@/components/public/PricingCards";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div>
      <div className="bg-primary text-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Pricing</h1>
          <p className="text-xl text-white/80">
            Transparent pricing for every stage of your agricultural value chain.
          </p>
        </div>
      </div>
      <PricingCards />
    </div>
  );
}
