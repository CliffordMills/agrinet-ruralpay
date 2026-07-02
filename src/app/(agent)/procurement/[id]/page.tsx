import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import GRNDocument from "@/components/agent/GRNDocument";
import CommodityGradingPanel from "@/components/agent/CommodityGradingPanel";
import PaymentInitiationForm from "@/components/agent/PaymentInitiationForm";
import type { GRNData } from "@/lib/grn/generateGRN";

export default async function BatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const supabase = await createClient();

  const { data: batch } = await supabase.from("commodity_batches").select(`id, grn_number, quantity_kg, total_value, unit_price_ghs, status, grade_at_intake, notes, created_at, farmers(id, first_name, last_name, digital_id, phone), commodities(id, name, unit), storage_hubs(name, code), agents(first_name, last_name, agent_code)`).eq("id", id).single();
  if (!batch) notFound();

  const farmer = batch.farmers as { id: string; first_name: string; last_name: string; digital_id: string; phone: string } | null;
  const commodity = batch.commodities as { id: string; name: string; unit: string } | null;
  const hub = batch.storage_hubs as { name: string; code: string } | null;
  const agent = batch.agents as { first_name: string; last_name: string; agent_code: string } | null;

  const { data: grades } = await supabase.from("commodity_grades").select("name, code, min_score, max_score, price_premium_pct").eq("commodity_id", commodity?.id || "");
  const { data: basePrice } = await supabase.from("market_prices").select("price_per_kg").eq("commodity_id", commodity?.id || "").order("price_date", { ascending: false }).limit(1).single();

  const grnData: GRNData = {
    grnNumber: batch.grn_number || `GRN-${id.slice(0, 8)}`,
    batchId: batch.id,
    farmerName: farmer ? `${farmer.first_name} ${farmer.last_name}` : "Unknown",
    farmerDigitalId: farmer?.digital_id || "—",
    agentName: agent ? `${agent.first_name} ${agent.last_name}` : "Unknown",
    agentCode: agent?.agent_code || "—",
    hubName: hub?.name || "—",
    hubCode: hub?.code || "—",
    commodity: commodity?.name || "Unknown",
    grade: batch.grade_at_intake || "Ungraded",
    quantityKg: batch.quantity_kg,
    unitPrice: batch.unit_price_ghs || 0,
    totalValue: batch.total_value,
    currency: "GHS",
    dateReceived: new Date(batch.created_at).toLocaleDateString("en-GH"),
    notes: batch.notes || undefined,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/agent/procurement" className="text-muted-foreground hover:text-foreground text-sm">← Procurement</Link>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${batch.status === "stored" ? "bg-green-100 text-green-800" : batch.status === "graded" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}>{batch.status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GRNDocument data={grnData} />
          {batch.status === "pending" && grades && grades.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-semibold mb-4">Grade This Batch</h2>
              <CommodityGradingPanel batchId={batch.id} commodity={commodity?.name || ""} currentGrade={batch.grade_at_intake || undefined} grades={grades} basePrice={basePrice?.price_per_kg || 1} />
            </div>
          )}
        </div>
        <div>
          {farmer && batch.status !== "pending" && (
            <div className="bg-card border border-border rounded-lg p-5">
              <h2 className="font-semibold mb-4">Initiate Payment</h2>
              <PaymentInitiationForm batchId={batch.id} farmerId={farmer.id} farmerName={`${farmer.first_name} ${farmer.last_name}`} farmerPhone={farmer.phone} amount={batch.total_value} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
