import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import InventoryTable from "@/components/agent/InventoryTable";

export default async function ProcurementPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: agent } = await supabase.from("agents").select("id").eq("user_id", session.user.id).single();

  const { data: rawBatches } = await supabase.from("commodity_batches").select(`id, grn_number, quantity_kg, total_value, status, grade_at_intake, created_at, farmers(first_name, last_name), commodities(name), storage_hubs(name)`).eq("agent_id", agent?.id || "").order("created_at", { ascending: false });

  const batches = (rawBatches || []).map((b) => {
    const farmer = b.farmers as { first_name: string; last_name: string } | null;
    const commodity = b.commodities as { name: string } | null;
    const hub = b.storage_hubs as { name: string } | null;
    return { id: b.id, grn_number: b.grn_number || "", farmer_name: farmer ? `${farmer.first_name} ${farmer.last_name}` : "Unknown", commodity: commodity?.name || "Unknown", grade: b.grade_at_intake || "", quantity_kg: b.quantity_kg, total_value: b.total_value, status: b.status, hub_name: hub?.name || "—", created_at: b.created_at };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Procurement</h1>
        <Link href="/agent/procurement/new" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">+ Record New Batch</Link>
      </div>
      <InventoryTable batches={batches} />
    </div>
  );
}
