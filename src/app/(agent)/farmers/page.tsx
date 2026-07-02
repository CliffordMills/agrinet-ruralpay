import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AgentFarmersPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: agent } = await supabase.from("agents").select("id").eq("user_id", session.user.id).single();
  const { data: farmers } = await supabase.from("farmers").select("id, first_name, last_name, phone, digital_id, credit_score, created_at, villages(name)").eq("agent_id", agent?.id || "").eq("is_active", true).is("deleted_at", null).order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Farmers</h1>
        <Link href="/agent/farmers/new" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">+ Onboard New Farmer</Link>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Farmer</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Digital ID</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Village</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Phone</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Credit Score</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!farmers || farmers.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No farmers registered yet. <Link href="/agent/farmers/new" className="text-primary hover:underline">Onboard your first farmer</Link></td></tr>
            ) : (
              farmers.map((farmer) => {
                const village = farmer.villages as { name: string } | null;
                return (
                  <tr key={farmer.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3"><Link href={`/agent/farmers/${farmer.id}`} className="font-medium hover:text-primary transition-colors">{farmer.first_name} {farmer.last_name}</Link></td>
                    <td className="px-4 py-3 font-mono text-xs">{farmer.digital_id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{village?.name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{farmer.phone}</td>
                    <td className="px-4 py-3 text-right"><span className={`font-semibold ${farmer.credit_score >= 700 ? "text-green-600" : farmer.credit_score >= 400 ? "text-amber-600" : "text-red-600"}`}>{farmer.credit_score}</span></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(farmer.created_at).toLocaleDateString("en-GH")}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
