import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

const TEAM = [
  { name: "Emmanuel Owusu", role: "CEO & Co-Founder", bg: "EO" },
  { name: "Adjoa Asante", role: "CTO & Co-Founder", bg: "AA" },
  { name: "Kwabena Darko", role: "Head of Agri-Finance", bg: "KD" },
  { name: "Naomi Boateng", role: "Head of Field Operations", bg: "NB" },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          AGRINET RURALPAY was founded in 2023 to solve a simple but urgent problem: Ghana’s smallholder
          farmers — who produce 70% of the country’s food — lack access to transparent markets,
          instant payments, and formal financial services. We’re changing that.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {[
          { title: "Our Vision", text: "A Ghana where every smallholder farmer has a digital identity, a fair market, and a bank account." },
          { title: "Our Values", text: "Farmer-first design. Radical transparency. Embedded trust. Technology that works offline." },
          { title: "Our Reach", text: "Active in 10 Ghana regions, partnering with MoFA, COCOBOD, CRIG, and leading commodity exporters." },
        ].map((v) => (
          <div key={v.title} className="bg-primary/5 border border-primary/10 rounded-xl p-8">
            <h3 className="font-bold text-xl mb-3 text-primary">{v.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{v.text}</p>
          </div>
        ))}
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEAM.map((m) => (
          <div key={m.name} className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              {m.bg}
            </div>
            <h3 className="font-semibold">{m.name}</h3>
            <p className="text-sm text-muted-foreground">{m.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
