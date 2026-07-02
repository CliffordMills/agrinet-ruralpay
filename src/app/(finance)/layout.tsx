import RoleGuard from "@/components/auth/RoleGuard";
import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function FinanceLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  if (!session) redirect("/login");

  const navItems = [
    { href: "/finance/credit", label: "Credit Score" },
    { href: "/finance/loans", label: "Loans" },
    { href: "/finance/insurance", label: "Insurance" },
  ];

  return (
    <RoleGuard allowedRoles={["FARMER", "AGENT", "ADMIN", "SUPER_ADMIN"]}>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-8 h-14">
              <Link href="/finance/credit" className="font-bold text-primary text-sm">
                AgriFinance
              </Link>
              <nav className="flex gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
      </div>
    </RoleGuard>
  );
}
