"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/farmer/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/farmer/digital-id", label: "Digital ID", icon: "🆔" },
  { href: "/farmer/wallet", label: "Wallet", icon: "💰" },
  { href: "/farmer/sales", label: "My Sales", icon: "📊" },
  { href: "/farmer/loans", label: "Loans", icon: "🌱" },
  { href: "/farmer/climate", label: "Climate", icon: "⛅" },
  { href: "/farmer/profile", label: "Profile", icon: "👤" },
];

export function FarmerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card min-h-screen">
      <div className="p-5 border-b border-border">
        <Link href="/farmer/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">AG</span>
          </div>
          <span className="font-bold text-sm text-primary">AGRINET</span>
        </Link>
      </div>
      <nav className="flex-1 p-3">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5",
              pathname === item.href
                ? "bg-primary text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <span>🚪</span> Sign out
        </button>
      </div>
    </aside>
  );
}
