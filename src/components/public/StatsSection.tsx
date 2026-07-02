const STATS = [
  { value: "50,000+", label: "Farmers Onboarded", desc: "Across 10 Ghana regions" },
  { value: "₵12M+", label: "Payments Processed", desc: "Via MTN MoMo & mobile money" },
  { value: "5", label: "Smart AgriHubs", desc: "IoT-enabled storage facilities" },
  { value: "8", label: "Commodities", desc: "Maize, Soy, Cashew, Cocoa & more" },
];

export function StatsSection() {
  return (
    <section className="bg-primary/5 border-y border-primary/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-primary mb-1">{stat.value}</p>
              <p className="font-semibold text-foreground">{stat.label}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
