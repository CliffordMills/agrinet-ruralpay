import RoleGuard from "@/components/auth/RoleGuard";

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["BUYER", "ADMIN", "SUPER_ADMIN", "ANALYST", "AGENT", "HUB_MANAGER"]}>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="font-bold text-primary text-lg">AGRINET Marketplace</div>
            <nav className="flex gap-6 text-sm">
              <a href="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">Listings</a>
              <a href="/marketplace/bids" className="text-muted-foreground hover:text-foreground transition-colors">My Bids</a>
              <a href="/marketplace/contracts" className="text-muted-foreground hover:text-foreground transition-colors">Contracts</a>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
      </div>
    </RoleGuard>
  );
}
