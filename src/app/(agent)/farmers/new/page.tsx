import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FarmerOnboardingForm from "@/components/agent/FarmerOnboardingForm";

export default async function NewFarmerPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: agent } = await supabase.from("agents").select("id, agent_villages(village_id, villages(id, name))").eq("user_id", session.user.id).single();

  let villages: { id: string; name: string }[] = [];
  if (agent?.agent_villages) {
    villages = (agent.agent_villages as Array<{ villages: { id: string; name: string } | null }>).map((av) => av.villages).filter(Boolean) as { id: string; name: string }[];
  }
  if (villages.length === 0) {
    const { data: allVillages } = await supabase.from("villages").select("id, name").order("name");
    villages = allVillages || [];
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Onboard New Farmer</h1>
        <p className="text-muted-foreground text-sm mt-1">Register a new farmer to the AGRINET network</p>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <FarmerOnboardingForm villages={villages} />
      </div>
    </div>
  );
}
