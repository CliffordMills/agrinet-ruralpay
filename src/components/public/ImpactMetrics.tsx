const METRICS = [
  {
    metric: "34%",
    title: "Income Increase",
    desc: "Average farmer income increase from transparent market pricing and reduced intermediary fees.",
    color: "text-primary",
  },
  {
    metric: "<24hrs",
    title: "Payment Speed",
    desc: "From contract signing to mobile money deposit — compared to 7–14 days with traditional methods.",
    color: "text-secondary",
  },
  {
    metric: "92%",
    title: "Post-Harvest Loss Reduction",
    desc: "IoT-monitored storage conditions reduce grain spoilage in partner AgriHubs.",
    color: "text-primary",
  },
  {
    metric: "8x",
    title: "Credit Access",
    desc: "Farmers with AGRINET digital profiles are 8x more likely to qualify for formal agricultural credit.",
    color: "text-secondary",
  },
];

export function ImpactMetrics() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Measurable Impact</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Real outcomes for Ghana&apos;s smallholder farmers and agribusinesses.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((m) => (
            <div
              key={m.title}
              className="bg-background rounded-xl border border-border p-6 text-center"
            >
              <p className={`text-5xl font-extrabold mb-3 ${m.color}`}>{m.metric}</p>
              <h3 className="font-bold text-lg mb-2">{m.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
