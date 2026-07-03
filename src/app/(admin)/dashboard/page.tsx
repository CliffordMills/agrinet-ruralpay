import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import KPICard from "@/components/admin/KPICard";

async function getPlatformStats(supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>) {
  const [farmers, agents, hubs, batches, payments, loans] = await Promise.all([
    supabase.from("farmers").select("id", { count: "exact", head: true }),
    supabase.from("agents").select("id", { count: "exact", head: true }),
    supabase.from("storage_hubs").select("id", { count: "exact", head: true }),
    supabase.from("procurement_batches").select("quantity_kg, unit_price_ghs"),
    supabase.from("payments").select("amount, status"),
    supabase.from("loans").select("amount, status"),
  ]);

  const totalVolume = (batches.data ?? []).reduce(
    (s, b) => s + (b.quantity_kg ?? 0),
    0
  );
  const totalGMV = (batches.data ?? []).reduce(
    (s, b) => s + (b.quantity_kg ?? 0) * (b.unit_price_ghs ?? 0),
    0
  );
  const totalDisbursed = (payments.data ?? [])
    .filter((p) => p.status === "successful")
    .reduce((s, p) => s + (p.amount ?? 0), 0);
  const activeLoanValue = (loans.data ?? [])
    .filter((l) => l.status === "active")
    .reduce((s, l) => s + (l.amount ?? 0), 0);

  return {
    farmerCount: farmers.count ?? 0,
    agentCount: agents.count ?? 0,
    hubCount: hubs.count ?? 0,
    batchCount: batches.data?.length ?? 0,
    totalVolume,
    totalGMV,
    totalDisbursed,
    activeLoanValue,
  };
}

export default async function AdminDashboard() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const stats = await getPlatformStats(supabase);

  const { data: recentBatches } = await supabase
    .from("procurement_batches")
    .select(
      `grn_number, quantity_kg, status, created_at,
       farmers(first_name, last_name),
       commodities(name),
       storage_hubs(name)`
    )
    .order("created_at", { ascending: false })
    .limit(8);

  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    graded: "bg-blue-100 text-blue-800",
    stored: "bg-green-100 text-green-800",
    sold: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Executive Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Registered Farmers" value={stats.farmerCount.toLocaleString()} icon="👨‍🌾" accent="green" />
        <KPICard label="Active Agents" value={stats.agentCount.toLocaleString()} icon="🧑‍💼" accent="blue" />
        <KPICard label="Storage Hubs" value={stats.hubCount.toLocaleString()} icon="🏭" accent="purple" />
        <KPICard label="Batches Processed" value={stats.batchCount.toLocaleString()} icon="📦" accent="amber" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Volume"
          value={`${(stats.totalVolume / 1000).toLocaleString("en-GH", { maximumFractionDigits: 1 })} t`}
          sub="Across all commodities"
          icon="⚖️"
          accent="green"
        />
        <KPICard
          label="Platform GMV"
          value={`GHS ${(stats.totalGMV / 1_000_000).toLocaleString("en-GH", { minimumFractionDigits: 2 })}M`}
          sub="Gross merchandise value"
          icon="💰"
          accent="blue"
        />
        <KPICard
          label="Farmer Disbursements"
          value={`GHS ${(stats.totalDisbursed / 1_000_000).toLocaleString("en-GH", { minimumFractionDigits: 2 })}M`}
          sub="Successful MoMo payments"
          icon="💸"
          accent="amber"
        />
        <KPICard
          label="Active Loan Book"
          value={`GHS ${(stats.activeLoanValue / 1_000_000).toLocaleString("en-GH", { minimumFractionDigits: 2 })}M`}
          sub="Outstanding loan value"
          icon="🏦"
          accent="purple"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border font-semibold">Recent Batch Activity</div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">GRN</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Farmer</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Commodity</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Hub</th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Qty (kg)</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(recentBatches ?? []).map((b) => {
              const farmer = b.farmers as { first_name: string; last_name: string } | null;
              const commodity = b.commodities as { name: string } | null;
              const hub = b.storage_hubs as { name: string } | null;
              return (
                <tr key={b.grn_number}>
                  <td className="px-4 py-2.5 font-mono text-xs">{b.grn_number}</td>
                  <td className="px-4 py-2.5">
                    {farmer ? `${farmer.first_name} ${farmer.last_name}` : "—"}
                  </td>
                  <td className="px-4 py-2.5">{commodity?.name ?? "—"}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{hub?.name ?? "—"}</td>
                  <td className="px-4 py-2.5 text-right">{(b.quantity_kg ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[b.status] ?? "bg-gray-100 text-gray-700"}` }>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">
                    {new Date(b.created_at).toLocaleDateString("en-GH")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
