import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  active: "bg-blue-100 text-blue-800",
  fulfilled: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  complete: "bg-gray-100 text-gray-800",
};

export default async function ContractsPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: buyer } = await supabase.from("buyers").select("id").eq("user_id", session.user.id).single();
  const { data: contracts } = await supabase.from("contracts").select(`id, contract_number, quantity_tonnes, price_per_kg, total_value, currency, delivery_date, status, created_at, marketplace_listings(commodities(name), commodity_grades(name, code), storage_hubs(name))`).eq("buyer_id", buyer?.id || "").order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Contracts</h1>
      {!contracts || contracts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground"><div className="text-4xl mb-3">📄</div><div className="font-medium">No contracts yet</div><div className="text-sm mt-1">Contracts are created when bids are accepted</div></div>
      ) : (
        <div className="space-y-3">
          {contracts.map((contract) => {
            const listing = contract.marketplace_listings as { commodities: { name: string } | null; commodity_grades: { name: string; code: string } | null; storage_hubs: { name: string } | null } | null;
            return (
              <Link key={contract.id} href={`/marketplace/contracts/${contract.id}`} className="block bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{listing?.commodities?.name} — {listing?.commodity_grades?.name} ({listing?.commodity_grades?.code})</div>
                    <div className="text-xs text-muted-foreground mt-1 font-mono">{contract.contract_number}</div>
                    <div className="text-sm text-muted-foreground mt-1">{listing?.storage_hubs?.name} · {contract.quantity_tonnes.toLocaleString()} tonnes · {contract.currency} {contract.price_per_kg.toFixed(2)}/kg</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{contract.currency} {contract.total_value.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</div>
                    <span className={`mt-1 inline-block text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[contract.status] || "bg-gray-100 text-gray-800"}`}>{contract.status}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
