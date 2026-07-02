import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#1b5e20] via-[#2e7d32] to-[#388e3c] text-white">
      <div className="text-center px-6">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm mb-8">
          <span className="w-2 h-2 bg-[#f9a825] rounded-full animate-pulse" />
          Platform launching soon
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          AGRINET RURALPAY
        </h1>
        <p className="text-xl text-white/80 max-w-lg mx-auto mb-10">
          Africa&apos;s leading village-level commodity origination platform.
          Digitizing first-mile agricultural supply chains.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="bg-[#f9a825] text-black font-semibold px-8 py-3 rounded-lg hover:bg-[#ffa000] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/book-demo"
            className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/20 transition-colors"
          >
            Book a Demo
          </Link>
        </div>
      </div>
    </main>
  );
}
