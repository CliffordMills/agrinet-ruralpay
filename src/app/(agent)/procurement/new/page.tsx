import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProcurementForm from "@/components/agent/ProcurementForm";

export default async function NewProcurementPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: agent } = await supabase.from("agents").select("id").eq("user_id", session.user.id).single();

  const [farmersResult, commoditiesResult, hubsResult] = await Promise.all([
    supabase.from("farmers").select("id, first_name, last_name, digital_id").eq("agent_id", agent?.id || "").eq("is_active", true).order("first_name"),
    supabase.from("commodities").select("id, name, unit").order("name"),
    supabase.from("storage_hubs").select("id, name, code").eq("is_active", true).order("name"),
  ]);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Record New Batch</h1>
        <p className="text-muted-foreground text-sm mt-1">Log commodity intake and generate a Goods Received Note (GRN)</p>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <ProcurementForm farmers={farmersResult.data || []} commodities={commoditiesResult.data || []} hubs={hubsResult.data || []} />
      </div>
    </div>
  );
}
