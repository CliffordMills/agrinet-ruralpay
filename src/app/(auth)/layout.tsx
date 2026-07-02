import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication | AGRINET RURALPAY",
  description: "Sign in or create your AGRINET RURALPAY account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/ghana-farm.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <span className="font-bold text-black text-sm">AG</span>
            </div>
            <span className="font-bold text-xl">AGRINET RURALPAY</span>
          </Link>
        </div>
        <div className="relative z-10">
          <blockquote className="text-2xl font-semibold leading-relaxed mb-6">
            &ldquo;Digitising Ghana&rsquo;s agricultural value chain from farmgate to export market.&rdquo;
          </blockquote>
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold text-secondary">50,000+</p>
              <p className="text-sm text-white/70">Farmers Onboarded</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-secondary">₵12M+</p>
              <p className="text-sm text-white/70">Payments Processed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-secondary">10</p>
              <p className="text-sm text-white/70">Ghana Regions</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-white/50 text-sm">
          © {new Date().getFullYear()} AGRINET RURALPAY. All rights reserved.
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-background">
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-sm">AG</span>
            </div>
            <span className="font-bold text-xl text-primary">AGRINET RURALPAY</span>
          </Link>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
