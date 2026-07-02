import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InventoryTable from "@/components/agent/InventoryTable";

export default async function AgentInventoryPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: agent } = await supabase.from("agents").select("id").eq("user_id", session.user.id).single();

  const { data: rawBatches } = await supabase.from("commodity_batches").select(`id, grn_number, quantity_kg, total_value, status, grade_at_intake, created_at, farmers(first_name, last_name), commodities(name), storage_hubs(name)`).eq("agent_id", agent?.id || "").in("status", ["stored", "graded"]).order("created_at", { ascending: false });

  const batches = (rawBatches || []).map((b) => {
    const farmer = b.farmers as { first_name: string; last_name: string } | null;
    const commodity = b.commodities as { name: string } | null;
    const hub = b.storage_hubs as { name: string } | null;
    return { id: b.id, grn_number: b.grn_number || "", farmer_name: farmer ? `${farmer.first_name} ${farmer.last_name}` : "Unknown", commodity: commodity?.name || "Unknown", grade: b.grade_at_intake || "", quantity_kg: b.quantity_kg, total_value: b.total_value, status: b.status, hub_name: hub?.name || "—", created_at: b.created_at };
  });

  const totalKg = batches.reduce((sum, b) => sum + b.quantity_kg, 0);
  const totalValue = batches.reduce((sum, b) => sum + b.total_value, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventory</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-sm text-muted-foreground">Active Batches</div><div className="text-2xl font-bold mt-1">{batches.length}</div></div>
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-sm text-muted-foreground">Total Volume (kg)</div><div className="text-2xl font-bold mt-1">{totalKg.toLocaleString()}</div></div>
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-sm text-muted-foreground">Total Value (GHS)</div><div className="text-2xl font-bold mt-1">{totalValue.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</div></div>
      </div>
      <InventoryTable batches={batches} />
    </div>
  );
}
