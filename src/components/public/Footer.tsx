import Link from "next/link";

const LINKS = {
  Product: [
    { href: "/how-it-works", label: "How it Works" },
    { href: "/solutions", label: "Solutions" },
    { href: "/pricing", label: "Pricing" },
    { href: "/impact", label: "Impact" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/partners", label: "Partners" },
    { href: "/contact", label: "Contact" },
    { href: "/book-demo", label: "Book a Demo" },
  ],
  Legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/faq", label: "FAQ" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <span className="font-bold text-black text-xs">AG</span>
              </div>
              <span className="font-bold">AGRINET RURALPAY</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Digitising Ghana&apos;s agricultural value chain from farmgate to export market.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="font-semibold mb-4 text-secondary">{group}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} AGRINET RURALPAY. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span>Made in Ghana 🇬🇭</span>
            <span>•</span>
            <span>MoFA Certified</span>
            <span>•</span>
            <span>COCOBOD Partner</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
