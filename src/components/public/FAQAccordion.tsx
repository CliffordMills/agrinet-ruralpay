"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Who can use AGRINET RURALPAY?",
    a: "AGRINET RURALPAY is built for smallholder farmers, field agents (aggregators), storage hub managers, commodity buyers and exporters, and agricultural NGOs across Ghana.",
  },
  {
    q: "How do farmers receive payments?",
    a: "Farmers receive payments directly to their mobile money wallet (MTN MoMo, Telecel Cash, or AirtelTigo) or to their AGRINET digital wallet. Payments are typically processed within 24 hours of contract completion.",
  },
  {
    q: "Do farmers need a smartphone?",
    a: "No. Field agents collect farmer data using the agent app. Farmers receive SMS notifications on basic phones. A smartphone or internet connection is only required for agents and hub managers.",
  },
  {
    q: "How is commodity quality graded?",
    a: "Grading is performed at smart AgriHubs using standardised scoring criteria (moisture content, visual inspection, weight). Grades are recorded on-chain and linked to the farmer’s batch QR code.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All data is encrypted in transit and at rest. We use Supabase PostgreSQL with row-level security, meaning each user only sees data they are authorised to access. We are fully GDPR and Ghana Data Protection Act compliant.",
  },
  {
    q: "Can AGRINET integrate with our existing ERP or trading system?",
    a: "Yes. Our Enterprise plan includes REST API and webhook access. We have existing integrations with common Ghanaian commodity trading and export management systems. Contact our team for details.",
  },
];

export function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 bg-primary/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Can&apos;t find the answer? <a href="/contact" className="text-primary underline">Contact us</a>.</p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-background border border-border rounded-xl overflow-hidden"
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between font-semibold hover:bg-accent/50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {faq.q}
                <svg
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
