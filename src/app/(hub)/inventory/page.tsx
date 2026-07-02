import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HubInventoryPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: batches } = await supabase.from("commodity_batches").select(`id, grn_number, quantity_kg, total_value, status, grade_at_intake, created_at, farmers(first_name, last_name, digital_id), commodities(name), storage_hubs(name, code), agents(first_name, last_name)`).in("status", ["stored", "graded", "pending"]).order("created_at", { ascending: false });

  const stored = (batches || []).filter((b) => b.status === "stored");
  const pending = (batches || []).filter((b) => b.status === "pending");
  const totalKg = (batches || []).reduce((s, b) => s + b.quantity_kg, 0);
  const totalValue = (batches || []).reduce((s, b) => s + b.total_value, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hub Inventory</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-xs text-muted-foreground">Total Batches</div><div className="text-2xl font-bold mt-1">{batches?.length || 0}</div></div>
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-xs text-muted-foreground">Stored</div><div className="text-2xl font-bold mt-1 text-green-600">{stored.length}</div></div>
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-xs text-muted-foreground">Total Volume (kg)</div><div className="text-2xl font-bold mt-1">{totalKg.toLocaleString()}</div></div>
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-xs text-muted-foreground">Total Value (GHS)</div><div className="text-xl font-bold mt-1">{totalValue.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</div></div>
      </div>
      {pending.length > 0 && <div className="bg-amber-50 border border-amber-200 rounded-lg p-4"><div className="text-sm font-medium text-amber-800">⚠️ {pending.length} batch{pending.length > 1 ? "es" : ""} awaiting intake confirmation</div></div>}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50"><tr><th className="text-left px-4 py-3 font-medium text-muted-foreground">GRN</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Farmer</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Commodity</th><th className="text-right px-4 py-3 font-medium text-muted-foreground">Qty (kg)</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Hub</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th></tr></thead>
          <tbody className="divide-y divide-border">
            {!batches || batches.length === 0 ? <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No batches in inventory</td></tr> : batches.map((batch) => {
              const farmer = batch.farmers as { first_name: string; last_name: string; digital_id: string } | null;
              const commodity = batch.commodities as { name: string } | null;
              const hub = batch.storage_hubs as { name: string; code: string } | null;
              return (<tr key={batch.id} className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 font-mono text-xs"><Link href={`/hub/batches/${batch.id}`} className="hover:text-primary">{batch.grn_number}</Link></td><td className="px-4 py-3"><div className="font-medium">{farmer?.first_name} {farmer?.last_name}</div><div className="text-xs text-muted-foreground font-mono">{farmer?.digital_id}</div></td><td className="px-4 py-3">{commodity?.name}{batch.grade_at_intake && <span className="ml-1.5 text-xs bg-muted px-1.5 py-0.5 rounded">{batch.grade_at_intake}</span>}</td><td className="px-4 py-3 text-right font-medium">{batch.quantity_kg.toLocaleString()}</td><td className="px-4 py-3 text-xs text-muted-foreground">{hub?.name}</td><td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${batch.status === "stored" ? "bg-green-100 text-green-800" : batch.status === "graded" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}>{batch.status}</span></td><td className="px-4 py-3 text-xs text-muted-foreground">{new Date(batch.created_at).toLocaleDateString("en-GH")}</td></tr>);
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
