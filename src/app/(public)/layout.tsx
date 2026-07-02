import type { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export const metadata: Metadata = {
  title: {
    default: "AGRINET RURALPAY — Digitising Ghana’s Agricultural Value Chain",
    template: "%s | AGRINET RURALPAY",
  },
  description:
    "AGRINET RURALPAY connects smallholder farmers, field agents, storage hubs, and commodity buyers across Ghana's agricultural supply chain with embedded payments, traceability, and climate intelligence.",
  keywords: ["Ghana agriculture", "AgriTech", "rural payments", "commodity marketplace", "farmgate"],
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: "AGRINET RURALPAY",
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
