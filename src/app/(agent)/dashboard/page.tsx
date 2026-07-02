import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AgentDashboardPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();

  const { data: agent } = await supabase
    .from("agents")
    .select("id, first_name, last_name, agent_code, is_active")
    .eq("user_id", session.user.id)
    .single();

  if (!agent) {
    return <div className="text-center py-16 text-muted-foreground">Agent profile not found. Contact your administrator.</div>;
  }

  const [summaryResult, recentBatchesResult, pendingPaymentsResult] = await Promise.all([
    supabase.rpc("agent_procurement_summary", { p_agent_id: agent.id }),
    supabase.from("commodity_batches").select("id, grn_number, quantity_kg, total_value, status, created_at, farmers(first_name, last_name), commodities(name)").eq("agent_id", agent.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("payments").select("id, amount, status, created_at, farmers(first_name, last_name)").in("farmer_id", supabase.from("farmers").select("id").eq("agent_id", agent.id)).eq("status", "pending").limit(5),
  ]);

  const summary = summaryResult.data?.[0];
  const recentBatches = recentBatchesResult.data || [];
  const pendingPayments = pendingPaymentsResult.data || [];

  const stats = [
    { label: "Total Farmers", value: summary?.farmer_count ?? 0, icon: "👨‍🌾", href: "/agent/farmers" },
    { label: "Total Batches", value: summary?.total_batches ?? 0, icon: "📦", href: "/agent/procurement" },
    { label: "Total Volume (kg)", value: ((summary?.total_kg as number) ?? 0).toLocaleString(), icon: "⚖️" },
    { label: "Total Value (GHS)", value: ((summary?.total_value as number) ?? 0).toLocaleString("en-GH", { minimumFractionDigits: 2 }), icon: "💰" },
    { label: "This Month (kg)", value: ((summary?.this_month_kg as number) ?? 0).toLocaleString(), icon: "📅" },
    { label: "This Month Value", value: `GHS ${((summary?.this_month_value as number) ?? 0).toLocaleString("en-GH", { minimumFractionDigits: 2 })}`, icon: "📈" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {agent.first_name} {agent.last_name}</h1>
          <p className="text-muted-foreground text-sm mt-1">Agent Code: {agent.agent_code}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/agent/farmers/new" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">+ Onboard Farmer</Link>
          <Link href="/agent/procurement/new" className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">+ Record Batch</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2"><span>{stat.icon}</span>{stat.label}</div>
            <div className="text-2xl font-bold">
              {(stat as { href?: string }).href ? <Link href={(stat as { href: string }).href} className="hover:text-primary transition-colors">{stat.value}</Link> : stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold">Recent Batches</h2>
            <Link href="/agent/procurement" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {recentBatches.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">No batches yet</div>
            ) : (
              recentBatches.map((batch) => {
                const farmer = batch.farmers as { first_name: string; last_name: string } | null;
                const commodity = batch.commodities as { name: string } | null;
                return (
                  <Link key={batch.id} href={`/agent/procurement/${batch.id}`} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div>
                      <div className="text-sm font-medium">{farmer?.first_name} {farmer?.last_name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{commodity?.name} · {batch.grn_number}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{batch.quantity_kg.toLocaleString()} kg</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${batch.status === "stored" ? "bg-green-100 text-green-800" : batch.status === "graded" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}>{batch.status}</span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold">Pending Payments</h2>
            <Link href="/agent/payments" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {pendingPayments.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">No pending payments</div>
            ) : (
              pendingPayments.map((payment) => {
                const farmer = payment.farmers as { first_name: string; last_name: string } | null;
                return (
                  <div key={payment.id} className="flex items-center justify-between p-4">
                    <div>
                      <div className="text-sm font-medium">{farmer?.first_name} {farmer?.last_name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{new Date(payment.created_at).toLocaleDateString("en-GH")}</div>
                    </div>
                    <div className="text-sm font-semibold text-amber-600">GHS {payment.amount.toFixed(2)}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
