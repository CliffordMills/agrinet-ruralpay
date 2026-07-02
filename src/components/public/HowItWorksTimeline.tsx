const STEPS = [
  {
    step: "01",
    title: "Farmer Onboarding",
    desc: "Field agents register farmers digitally with GPS coordinates, Ghana Card verification, and photo ID. Each farmer receives a unique digital ID and QR code.",
    icon: "👨‍🌾",
  },
  {
    step: "02",
    title: "Commodity Procurement",
    desc: "Agents collect produce at farmgate using the mobile app. Quantity, moisture content, and GPS location are logged. A Goods Received Note (GRN) is auto-generated.",
    icon: "🌽",
  },
  {
    step: "03",
    title: "Grading & Storage",
    desc: "Produce is graded at smart AgriHubs with IoT-monitored temperature and humidity. Batch QR codes enable full farm-to-market traceability.",
    icon: "🏭",
  },
  {
    step: "04",
    title: "Marketplace & Contracts",
    desc: "Verified buyers browse commodity listings, submit bids, and sign forward contracts. Logistics scheduling and delivery tracking are built in.",
    icon: "📊",
  },
  {
    step: "05",
    title: "Instant Payment",
    desc: "On contract completion, farmers receive instant payment via MTN MoMo, Telecel Cash, or AirtelTigo directly to their AGRINET wallet.",
    icon: "💸",
  },
  {
    step: "06",
    title: "Finance & Insurance",
    desc: "Credit scores built from procurement history unlock input loans and crop insurance. Climate-smart advisories help farmers optimise yields.",
    icon: "🌱",
  },
];

export function HowItWorksTimeline() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            From Farmgate to Export Market
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AGRINET RURALPAY digitises every step of Ghana&apos;s agricultural value chain.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div
              key={step.step}
              className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{step.icon}</div>
                <div>
                  <span className="text-xs font-bold text-primary/60 tracking-widest uppercase">
                    Step {step.step}
                  </span>
                  <h3 className="font-bold text-lg mt-1 mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
