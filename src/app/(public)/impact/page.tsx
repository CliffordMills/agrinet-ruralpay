import type { Metadata } from "next";
import { ImpactMetrics } from "@/components/public/ImpactMetrics";

export const metadata: Metadata = { title: "Our Impact" };

export default function ImpactPage() {
  return (
    <div>
      <div className="bg-primary text-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Measurable Impact</h1>
          <p className="text-xl text-white/80">
            Real outcomes for Ghana’s farmers, agents, and agricultural ecosystem.
          </p>
        </div>
      </div>
      <ImpactMetrics />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Aligned with Ghana’s AgriTech Agenda</h2>
        <p className="text-muted-foreground leading-relaxed">
          AGRINET RURALPAY operates in direct alignment with Ghana’s Planting for Food and Jobs (PFJ) programme,
          the Ministry of Food and Agriculture’s digitisation roadmap, and COCOBOD’s traceability mandate.
          Our data feeds the Ghana Agriculture Statistics and the CAADP implementation framework.
        </p>
      </div>
    </div>
  );
}
