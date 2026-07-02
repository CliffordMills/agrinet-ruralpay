import type { Metadata } from "next";

export const metadata: Metadata = { title: "Partners" };

const PARTNERS = [
  { name: "Ministry of Food & Agriculture", abbr: "MoFA", type: "Government" },
  { name: "COCOBOD", abbr: "COCOBOD", type: "Commodity Board" },
  { name: "CRIG Ghana", abbr: "CRIG", type: "Research" },
  { name: "MTN Ghana", abbr: "MTN", type: "Mobile Money" },
  { name: "Telecel Ghana", abbr: "TELECEL", type: "Mobile Money" },
  { name: "AirtelTigo Ghana", abbr: "AT", type: "Mobile Money" },
  { name: "Ghana Exim Bank", abbr: "EXIM", type: "Finance" },
  { name: "Farmerline", abbr: "FL", type: "NGO" },
];

export default function PartnersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Partners</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Built with and for Ghana’s agricultural ecosystem.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PARTNERS.map((p) => (
          <div key={p.name} className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-bold text-primary text-sm">{p.abbr}</span>
            </div>
            <h3 className="font-semibold mb-1">{p.name}</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{p.type}</span>
          </div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <p className="text-muted-foreground mb-6">Interested in partnering with AGRINET RURALPAY?</p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
        >
          Get in touch
        </a>
      </div>
    </div>
  );
}
