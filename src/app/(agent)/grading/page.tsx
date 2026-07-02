import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AgentGradingPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: agent } = await supabase.from("agents").select("id").eq("user_id", session.user.id).single();

  const { data: pendingBatches } = await supabase.from("commodity_batches").select(`id, grn_number, quantity_kg, created_at, farmers(first_name, last_name), commodities(name)`).eq("agent_id", agent?.id || "").eq("status", "pending").order("created_at", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Commodity Grading</h1>
        <p className="text-muted-foreground text-sm mt-1">Grade pending batches to unlock payments</p>
      </div>

      {!pendingBatches || pendingBatches.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <div className="text-4xl mb-3">⭐</div>
          <div className="font-medium">No batches pending grading</div>
          <div className="text-sm text-muted-foreground mt-1">All batches have been graded</div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-sm text-amber-600 font-medium">{pendingBatches.length} batch{pendingBatches.length > 1 ? "es" : ""} awaiting grading</div>
          {pendingBatches.map((batch) => {
            const farmer = batch.farmers as { first_name: string; last_name: string } | null;
            const commodity = batch.commodities as { name: string } | null;
            return (
              <Link key={batch.id} href={`/agent/procurement/${batch.id}`} className="flex items-center justify-between bg-card border border-amber-200 rounded-lg p-4 hover:border-amber-400 transition-colors">
                <div>
                  <div className="font-medium">{farmer?.first_name} {farmer?.last_name} — {commodity?.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{batch.grn_number} · {batch.quantity_kg.toLocaleString()} kg · Received {new Date(batch.created_at).toLocaleDateString("en-GH")}</div>
                </div>
                <div className="text-sm font-medium text-amber-600">Grade Now →</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
