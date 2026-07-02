import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CommodityListingCard from "@/components/marketplace/CommodityListingCard";

export default async function MarketplacePage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: listings } = await supabase.from("marketplace_listings").select(`id, quantity_tonnes, price_per_kg, currency, expires_at, is_active, created_at, commodities(name), commodity_grades(name, code), storage_hubs(name, regions(name))`).eq("is_active", true).order("created_at", { ascending: false });
  const { data: priceData } = await supabase.from("market_prices").select("commodity_id, price_per_kg, commodities(name)").order("price_date", { ascending: false }).limit(8);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Commodity Marketplace</h1>
        <p className="text-muted-foreground text-sm mt-1">Browse and bid on certified, graded commodities from Ghana&apos;s AgriHubs</p>
      </div>
      {priceData && priceData.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Current Market Prices (GHS/kg)</div>
          <div className="flex flex-wrap gap-4">
            {priceData.map((p, i) => {
              const commodity = p.commodities as { name: string } | null;
              return <div key={i} className="text-sm"><span className="text-muted-foreground">{commodity?.name}:</span> <span className="font-semibold text-primary">{p.price_per_kg.toFixed(2)}</span></div>;
            })}
          </div>
        </div>
      )}
      {!listings || listings.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground"><div className="text-4xl mb-3">📦</div><div className="font-medium">No active listings</div><div className="text-sm mt-1">Check back soon for available commodities</div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing) => {
            const commodity = listing.commodities as { name: string } | null;
            const grade = listing.commodity_grades as { name: string; code: string } | null;
            const hub = listing.storage_hubs as { name: string; regions: { name: string } | null } | null;
            return <CommodityListingCard key={listing.id} id={listing.id} commodity={commodity?.name || "Unknown"} grade={grade ? `${grade.name} (${grade.code})` : "Ungraded"} quantityTonnes={listing.quantity_tonnes} pricePerKg={listing.price_per_kg} currency={listing.currency} hubName={hub?.name || "—"} hubRegion={hub?.regions?.name || "—"} expiresAt={listing.expires_at} isActive={listing.is_active} />;
          })}
        </div>
      )}
    </div>
  );
}
