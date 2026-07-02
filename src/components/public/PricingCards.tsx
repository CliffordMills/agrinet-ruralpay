import Link from "next/link";

const PLANS = [
  {
    name: "Cooperative",
    price: "Free",
    desc: "For farmer cooperatives and NGO programmes",
    features: [
      "Up to 500 farmer profiles",
      "Basic procurement logging",
      "GRN generation",
      "SMS payment notifications",
      "Community support",
    ],
    cta: "Get started free",
    href: "/register",
    highlight: false,
  },
  {
    name: "AgriHub",
    price: "₵1,200",
    period: "/month",
    desc: "For storage hubs and aggregators",
    features: [
      "Unlimited farmer profiles",
      "Full procurement & grading",
      "IoT device integration",
      "Commodity marketplace access",
      "Mobile money payments",
      "Climate intelligence",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/book-demo",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For buyers, exporters, and government programmes",
    features: [
      "Everything in AgriHub",
      "Dedicated account manager",
      "Custom analytics & reports",
      "API & ERP integration",
      "Multi-hub management",
      "SLA guarantee",
      "On-site training",
    ],
    cta: "Contact sales",
    href: "/contact",
    highlight: false,
  },
];

export function PricingCards() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg">No hidden fees. Pay only for what you use.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border ${
                plan.highlight
                  ? "border-primary bg-primary text-white shadow-2xl scale-105"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-secondary text-black text-xs font-bold px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
              <p className={`text-sm mb-4 ${plan.highlight ? "text-white/70" : "text-muted-foreground"}`}>
                {plan.desc}
              </p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                {plan.period && (
                  <span className={`text-sm ${plan.highlight ? "text-white/70" : "text-muted-foreground"}`}>
                    {plan.period}
                  </span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <svg
                      className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? "text-secondary" : "text-primary"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center rounded-lg px-6 py-3 font-semibold text-sm transition-colors ${
                  plan.highlight
                    ? "bg-secondary text-black hover:bg-secondary/90"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
