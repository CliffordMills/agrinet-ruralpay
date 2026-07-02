"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/agent/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/agent/farmers", label: "Farmers", icon: "👨‍🌾" },
  { href: "/agent/procurement", label: "Procurement", icon: "📦" },
  { href: "/agent/inventory", label: "Inventory", icon: "🏪" },
  { href: "/agent/payments", label: "Payments", icon: "💳" },
  { href: "/agent/grading", label: "Grading", icon: "⭐" },
  { href: "/agent/profile", label: "Profile", icon: "👤" },
];

export default function AgentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="text-lg font-bold text-primary">AGRINET</div>
        <div className="text-xs text-muted-foreground mt-1">Agent Portal</div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <span>🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
