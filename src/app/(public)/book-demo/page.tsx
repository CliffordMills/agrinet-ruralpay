import type { Metadata } from "next";
import { BookDemoForm } from "@/components/public/BookDemoForm";

export const metadata: Metadata = { title: "Book a Demo" };

export default function BookDemoPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            See AGRINET RURALPAY in Action
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Book a personalised 45-minute demo with our team. We’ll walk through the platform live, tailored to your specific use case.
          </p>
          <div className="space-y-4">
            {[
              { icon: "⏱️", title: "45-minute session", desc: "Live walkthrough tailored to your organisation" },
              { icon: "🎯", title: "Custom use cases", desc: "Farmer onboarding, payments, marketplace, or analytics" },
              { icon: "📊", title: "Live data demo", desc: "Real platform with Ghana agricultural data" },
              { icon: "🔒", title: "No commitment", desc: "No credit card or contract required" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6">Request your demo</h2>
          <BookDemoForm />
        </div>
      </div>
    </div>
  );
}
