import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HubBatchesPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: batches } = await supabase.from("commodity_batches").select(`id, grn_number, quantity_kg, total_value, status, grade_at_intake, created_at, farmers(first_name, last_name), commodities(name), storage_hubs(name)`).order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Batches</h1>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50"><tr><th className="text-left px-4 py-3 font-medium text-muted-foreground">GRN</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Farmer</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Commodity</th><th className="text-right px-4 py-3 font-medium text-muted-foreground">Qty (kg)</th><th className="text-right px-4 py-3 font-medium text-muted-foreground">Value (GHS)</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Hub</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th></tr></thead>
          <tbody className="divide-y divide-border">
            {!batches || batches.length === 0 ? <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No batches found</td></tr> : batches.map((batch) => {
              const farmer = batch.farmers as { first_name: string; last_name: string } | null;
              const commodity = batch.commodities as { name: string } | null;
              const hub = batch.storage_hubs as { name: string } | null;
              return (<tr key={batch.id} className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 font-mono text-xs"><Link href={`/hub/batches/${batch.id}`} className="hover:text-primary">{batch.grn_number}</Link></td><td className="px-4 py-3 font-medium">{farmer?.first_name} {farmer?.last_name}</td><td className="px-4 py-3">{commodity?.name}{batch.grade_at_intake && <span className="ml-1.5 text-xs bg-muted px-1.5 py-0.5 rounded">{batch.grade_at_intake}</span>}</td><td className="px-4 py-3 text-right">{batch.quantity_kg.toLocaleString()}</td><td className="px-4 py-3 text-right font-medium">{batch.total_value.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</td><td className="px-4 py-3 text-xs text-muted-foreground">{hub?.name}</td><td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${batch.status === "stored" ? "bg-green-100 text-green-800" : batch.status === "graded" ? "bg-blue-100 text-blue-800" : batch.status === "sold" ? "bg-purple-100 text-purple-800" : "bg-yellow-100 text-yellow-800"}`}>{batch.status}</span></td></tr>);
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
