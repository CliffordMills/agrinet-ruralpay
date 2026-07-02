import type { Metadata } from "next";
import { HowItWorksTimeline } from "@/components/public/HowItWorksTimeline";

export const metadata: Metadata = { title: "How it Works" };

export default function HowItWorksPage() {
  return (
    <div>
      <div className="bg-primary text-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How AGRINET Works</h1>
          <p className="text-xl text-white/80">
            Six steps that transform Ghana’s first-mile agricultural supply chain.
          </p>
        </div>
      </div>
      <HowItWorksTimeline />
    </div>
  );
}
