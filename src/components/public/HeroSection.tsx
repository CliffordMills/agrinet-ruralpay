import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative bg-primary overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Now live across 10 Ghana regions</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            The Digital Backbone of Ghana&apos;s{" "}
            <span className="text-secondary">Agricultural Economy</span>
          </h1>

          <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
            AGRINET RURALPAY digitises first-mile supply chains from farmgate to export market — connecting farmers, field agents, storage hubs, and commodity buyers with embedded payments, traceability, and climate intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/book-demo"
              className="inline-flex items-center justify-center rounded-lg bg-secondary text-black font-semibold px-8 py-4 text-base hover:bg-secondary/90 transition-colors"
            >
              Book a Demo
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/40 text-white font-semibold px-8 py-4 text-base hover:border-white hover:bg-white/10 transition-colors"
            >
              How it Works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
