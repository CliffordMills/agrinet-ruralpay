import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-600",
};

export default async function MyBidsPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: buyer } = await supabase.from("buyers").select("id").eq("user_id", session.user.id).single();
  const { data: bids } = await supabase.from("bids").select(`id, price_per_kg, quantity_tonnes, status, created_at, marketplace_listings(id, currency, commodities(name), storage_hubs(name))`).eq("buyer_id", buyer?.id || "").order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Bids</h1>
      {!bids || bids.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground"><div className="text-4xl mb-3">📋</div><div className="font-medium">No bids yet</div><div className="text-sm mt-1"><Link href="/marketplace" className="text-primary hover:underline">Browse listings</Link> to place your first bid</div></div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50"><tr><th className="text-left px-4 py-3 font-medium text-muted-foreground">Commodity</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Hub</th><th className="text-right px-4 py-3 font-medium text-muted-foreground">Qty (t)</th><th className="text-right px-4 py-3 font-medium text-muted-foreground">Bid Price</th><th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th></tr></thead>
            <tbody className="divide-y divide-border">
              {bids.map((bid) => {
                const listing = bid.marketplace_listings as { id: string; currency: string; commodities: { name: string } | null; storage_hubs: { name: string } | null } | null;
                const totalValue = bid.quantity_tonnes * 1000 * bid.price_per_kg;
                return (<tr key={bid.id} className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 font-medium"><Link href={`/marketplace/listings/${listing?.id}`} className="hover:text-primary">{listing?.commodities?.name || "—"}</Link></td><td className="px-4 py-3 text-muted-foreground">{listing?.storage_hubs?.name || "—"}</td><td className="px-4 py-3 text-right">{bid.quantity_tonnes}</td><td className="px-4 py-3 text-right font-medium">{listing?.currency} {bid.price_per_kg.toFixed(2)}/kg</td><td className="px-4 py-3 text-right font-semibold">{listing?.currency} {totalValue.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</td><td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[bid.status] || "bg-gray-100 text-gray-800"}`}>{bid.status}</span></td><td className="px-4 py-3 text-xs text-muted-foreground">{new Date(bid.created_at).toLocaleDateString("en-GH")}</td></tr>);
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
