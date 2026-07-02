import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import BidForm from "@/components/marketplace/BidForm";

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase.from("marketplace_listings").select(`id, quantity_tonnes, price_per_kg, currency, expires_at, is_active, description, created_at, commodities(name), commodity_grades(name, code, price_premium_pct), storage_hubs(name, code, regions(name), districts(name))`).eq("id", id).single();
  if (!listing) notFound();

  const { data: bids } = await supabase.from("bids").select("id, price_per_kg, quantity_tonnes, status, created_at").eq("listing_id", id).order("price_per_kg", { ascending: false }).limit(10);

  const commodity = listing.commodities as { name: string } | null;
  const grade = listing.commodity_grades as { name: string; code: string; price_premium_pct: number } | null;
  const hub = listing.storage_hubs as { name: string; code: string; regions: { name: string } | null; districts: { name: string } | null } | null;
  const userRole = session.user.app_metadata?.role || session.user.user_metadata?.role;
  const isBuyer = userRole === "BUYER";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/marketplace" className="text-muted-foreground hover:text-foreground text-sm">← Marketplace</Link>
        {!listing.is_active && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Closed</span>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{commodity?.name}</h1>
                <div className="text-sm text-muted-foreground mt-1">{hub?.name} · {hub?.districts?.name}, {hub?.regions?.name}</div>
              </div>
              {grade && <span className="bg-primary/10 text-primary font-semibold text-sm px-3 py-1 rounded-full">{grade.name} ({grade.code})</span>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><div className="text-xs text-muted-foreground">Available Qty</div><div className="font-semibold text-lg">{listing.quantity_tonnes.toLocaleString()} t</div></div>
              <div><div className="text-xs text-muted-foreground">Asking Price</div><div className="font-semibold text-lg text-primary">{listing.currency} {listing.price_per_kg.toFixed(2)}/kg</div></div>
              <div><div className="text-xs text-muted-foreground">Total Value</div><div className="font-semibold text-lg">{listing.currency} {(listing.quantity_tonnes * 1000 * listing.price_per_kg).toLocaleString("en-GH", { minimumFractionDigits: 2 })}</div></div>
              <div><div className="text-xs text-muted-foreground">Hub Code</div><div className="font-mono font-medium">{hub?.code}</div></div>
              {listing.expires_at && <div><div className="text-xs text-muted-foreground">Expires</div><div>{new Date(listing.expires_at).toLocaleDateString("en-GH")}</div></div>}
              <div><div className="text-xs text-muted-foreground">Listed</div><div>{new Date(listing.created_at).toLocaleDateString("en-GH")}</div></div>
            </div>
            {listing.description && <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground">{listing.description}</div>}
          </div>
          {bids && bids.length > 0 && (
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 border-b border-border"><h2 className="font-semibold">Active Bids ({bids.length})</h2></div>
              <table className="w-full text-sm">
                <thead className="bg-muted/50"><tr><th className="text-right px-4 py-2 font-medium text-muted-foreground">Price/kg</th><th className="text-right px-4 py-2 font-medium text-muted-foreground">Qty (t)</th><th className="text-left px-4 py-2 font-medium text-muted-foreground">Status</th><th className="text-left px-4 py-2 font-medium text-muted-foreground">Date</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {bids.map((bid, i) => (
                    <tr key={bid.id} className={i === 0 ? "bg-green-50" : ""}>
                      <td className="px-4 py-2.5 text-right font-semibold">{listing.currency} {bid.price_per_kg.toFixed(2)}{i === 0 && <span className="ml-1 text-xs text-green-600">★ highest</span>}</td>
                      <td className="px-4 py-2.5 text-right">{bid.quantity_tonnes}</td>
                      <td className="px-4 py-2.5"><span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">{bid.status}</span></td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(bid.created_at).toLocaleDateString("en-GH")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div>
          {isBuyer && listing.is_active ? (
            <div className="bg-card border border-border rounded-lg p-5"><h2 className="font-semibold mb-4">Place Your Bid</h2><BidForm listingId={listing.id} commodity={commodity?.name || ""} quantityTonnes={listing.quantity_tonnes} askingPricePerKg={listing.price_per_kg} currency={listing.currency} /></div>
          ) : !isBuyer ? (
            <div className="bg-muted/50 border border-border rounded-lg p-5 text-center text-sm text-muted-foreground">Only registered buyers can place bids.</div>
          ) : (
            <div className="bg-muted/50 border border-border rounded-lg p-5 text-center text-sm text-muted-foreground">This listing is no longer active.</div>
          )}
        </div>
      </div>
    </div>
  );
}
