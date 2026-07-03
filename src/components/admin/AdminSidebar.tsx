"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/analytics/regional", label: "Regional", icon: "🗺️" },
  { href: "/admin/analytics/payments", label: "Payments", icon: "💳" },
  { href: "/admin/analytics/commodities", label: "Commodities", icon: "🌾" },
  { href: "/admin/farmers", label: "Farmers", icon: "👨‍🌾" },
  { href: "/admin/agents", label: "Agents", icon: "🧑‍💼" },
  { href: "/admin/hubs", label: "Hubs", icon: "🏭" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 border-r border-border bg-card min-h-screen flex flex-col">
      <div className="px-4 py-5 border-b border-border">
        <div className="font-bold text-sm text-primary">AgriNet Admin</div>
        <div className="text-xs text-muted-foreground mt-0.5">Executive Portal</div>
      </div>
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {NAV.map((item) => {
          const active =
            item.href === "/admin/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
