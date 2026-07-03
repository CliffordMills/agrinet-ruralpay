import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TraceabilityTimeline from "@/components/traceability/TraceabilityTimeline";
import FarmOriginMap from "@/components/traceability/FarmOriginMap";

export default async function PublicScanPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  const supabase = await createClient();

  const { data: batch } = await supabase
    .from("procurement_batches")
    .select(
      `id, grn_number, quantity_kg, unit_price_ghs, quality_score, status,
       received_at, graded_at, payment_initiated_at, created_at,
       farmers(
         first_name, last_name, digital_id, farm_size_ha, primary_crop,
         villages(name, districts(name, regions(name)))
       ),
       commodities(name),
       commodity_grades(name, code),
       storage_hubs(name, code),
       agents(first_name, last_name, agent_code)`
    )
    .eq("id", batchId)
    .single();

  if (!batch) notFound();

  const farmer = batch.farmers as {
    first_name: string;
    last_name: string;
    digital_id: string;
    farm_size_ha?: number;
    primary_crop?: string;
    villages: {
      name: string;
      districts: { name: string; regions: { name: string } | null } | null;
    } | null;
  } | null;

  const commodity = batch.commodities as { name: string } | null;
  const grade = batch.commodity_grades as { name: string; code: string } | null;
  const hub = batch.storage_hubs as { name: string; code: string } | null;
  const agent = batch.agents as {
    first_name: string;
    last_name: string;
    agent_code: string;
  } | null;

  const village = farmer?.villages;
  const district = village?.districts;
  const region = district?.regions;

  const events = [
    {
      label: "Farm Intake",
      description: `${batch.quantity_kg?.toLocaleString() ?? "?"} kg received at ${hub?.name ?? "hub"}${agent ? ` by Agent ${agent.first_name} ${agent.last_name} (${agent.agent_code})` : ""}`,
      timestamp: batch.received_at ?? batch.created_at,
      status: "done" as const,
      icon: "🌾",
    },
    {
      label: "Quality Grading",
      description: batch.quality_score
        ? `Score ${batch.quality_score}/100 — Grade ${grade?.name ?? ""} (${grade?.code ?? ""})`
        : "Pending grading assessment",
      timestamp: batch.graded_at ?? null,
      status: batch.graded_at ? ("done" as const) : ("pending" as const),
      icon: "⚖️",
    },
    {
      label: "Storage",
      description: hub ? `Stored at ${hub.name} (${hub.code})` : "Awaiting storage assignment",
      timestamp: batch.graded_at ?? null,
      status:
        batch.status === "stored" || batch.status === "graded" || batch.status === "sold"
          ? ("done" as const)
          : ("pending" as const),
      icon: "🏭",
    },
    {
      label: "Payment to Farmer",
      description: batch.payment_initiated_at
        ? `Payment of GHS ${((batch.quantity_kg ?? 0) * (batch.unit_price_ghs ?? 0)).toLocaleString("en-GH", { minimumFractionDigits: 2 })} initiated`
        : "Pending payment disbursement",
      timestamp: batch.payment_initiated_at ?? null,
      status: batch.payment_initiated_at ? ("done" as const) : ("pending" as const),
      icon: "💸",
    },
    {
      label: "Market Ready",
      description: "Listed on AgriNet marketplace for buyer procurement",
      timestamp: null,
      status: batch.status === "sold" ? ("done" as const) : ("pending" as const),
      icon: "🛒",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="font-bold text-lg">AgriNet RuralPay</div>
          <div className="text-xs opacity-80">Batch Traceability</div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Batch GRN</div>
              <div className="font-mono font-bold text-xl">{batch.grn_number}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {commodity?.name} — {grade?.name} ({grade?.code})
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Quantity</div>
              <div className="font-semibold text-lg">
                {batch.quantity_kg?.toLocaleString()} kg
              </div>
              {batch.quality_score && (
                <div className="text-xs text-muted-foreground mt-1">
                  Quality score: {batch.quality_score}/100
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Provenance Timeline</h2>
          <div className="bg-card border border-border rounded-xl p-6">
            <TraceabilityTimeline events={events} />
          </div>
        </div>

        {farmer && (
          <FarmOriginMap
            farmerName={`${farmer.first_name} ${farmer.last_name}`}
            digitalId={farmer.digital_id ?? ""}
            village={village?.name ?? "—"}
            district={district?.name ?? "—"}
            region={region?.name ?? "—"}
            farmSizeHa={farmer.farm_size_ha}
            primaryCrop={farmer.primary_crop ?? undefined}
            commodity={commodity?.name ?? "—"}
            grade={grade ? `${grade.name} (${grade.code})` : "—"}
            hubName={hub?.name ?? "—"}
            hubCode={hub?.code ?? "—"}
          />
        )}

        <div className="text-center text-xs text-muted-foreground pb-8">
          Verified by AgriNet RuralPay · Blockchain-anchored traceability coming soon
        </div>
      </main>
    </div>
  );
}
