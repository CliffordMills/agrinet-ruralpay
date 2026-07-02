import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Us" };

const CONTACTS = [
  { label: "General Enquiries", value: "hello@agrinetruralpay.com", icon: "✉️" },
  { label: "Partnerships", value: "partners@agrinetruralpay.com", icon: "🤝" },
  { label: "Technical Support", value: "support@agrinetruralpay.com", icon: "🔧" },
  { label: "Head Office", value: "Accra, Ghana", icon: "📍" },
];

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
        <p className="text-xl text-muted-foreground">
          We’re a team of 30+ people based in Accra, Ghana.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {CONTACTS.map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-xl p-6 flex items-start gap-4">
            <span className="text-2xl">{c.icon}</span>
            <div>
              <p className="font-semibold mb-1">{c.label}</p>
              <p className="text-muted-foreground text-sm">{c.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-muted-foreground mb-6">
          Book a personalised demo and see how AGRINET RURALPAY can transform your agricultural value chain.
        </p>
        <a
          href="/book-demo"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
        >
          Book a Demo
        </a>
      </div>
    </div>
  );
}
