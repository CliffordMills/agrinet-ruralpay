import type { Metadata } from "next";

export const metadata: Metadata = { title: "Solutions" };

const SOLUTIONS = [
  {
    icon: "👨‍🌾",
    title: "Farmer Digitisation",
    desc: "Digital profiles, biometric verification, GPS farm mapping, and QR identity cards for every smallholder farmer.",
  },
  {
    icon: "📦",
    title: "Procurement & Traceability",
    desc: "End-to-end commodity tracking from farmgate to export with auto-generated GRNs and batch QR codes.",
  },
  {
    icon: "🏭",
    title: "Smart AgriHubs",
    desc: "IoT-monitored storage facilities with real-time temperature, humidity, and stock level tracking.",
  },
  {
    icon: "💸",
    title: "Embedded Payments",
    desc: "Instant farmer payouts via MTN MoMo, Telecel Cash, AirtelTigo, or bank transfer. Zero delays.",
  },
  {
    icon: "📊",
    title: "Commodity Marketplace",
    desc: "B2B marketplace for buyers and exporters to browse certified inventory, bid, and sign digital contracts.",
  },
  {
    icon: "🌱",
    title: "Agri-Finance & Insurance",
    desc: "Credit scores from procurement history unlock input loans, production loans, and crop insurance.",
  },
  {
    icon: "⚡",
    title: "Climate Intelligence",
    desc: "Hyperlocal weather forecasts, drought and flood alerts, NDVI crop health maps, and yield predictions.",
  },
  {
    icon: "📍",
    title: "Analytics & Reporting",
    desc: "National dashboards for MoFA, DFIs, and commodity boards with GIS maps and commodity flow visualisation.",
  },
];

export default function SolutionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Solutions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A complete digital infrastructure for Ghana’s agricultural value chain.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SOLUTIONS.map((s) => (
          <div key={s.title} className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all">
            <div className="text-3xl mb-4">{s.icon}</div>
            <h3 className="font-bold text-lg mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
