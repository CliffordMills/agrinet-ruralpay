import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import KPICard from "@/components/admin/KPICard";

export default async function RegionalAnalyticsPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();

  const { data: regions } = await supabase
    .from("regions")
    .select(`
      id, name,
      districts(id, name,
        villages(id,
          farmers(id, credit_score)
        )
      ),
      storage_hubs(id, name, capacity_tonnes, current_stock_tonnes)
    `)
    .order("name");

  type RegionData = {
    id: string;
    name: string;
    districts: { id: string; name: string; villages: { id: string; farmers: { id: string; credit_score: number | null }[] }[] }[];
    storage_hubs: { id: string; name: string; capacity_tonnes: number | null; current_stock_tonnes: number | null }[];
  };

  const regionStats = (regions as RegionData[] ?? []).map((r) => {
    const farmerCount = r.districts.reduce(
      (s, d) => s + d.villages.reduce((s2, v) => s2 + v.farmers.length, 0),
      0
    );
    const avgCredit = farmerCount > 0
      ? r.districts
          .flatMap((d) => d.villages.flatMap((v) => v.farmers.map((f) => f.credit_score ?? 0)))
          .reduce((a, b) => a + b, 0) / farmerCount
      : 0;
    const hubCapacity = r.storage_hubs.reduce((s, h) => s + (h.capacity_tonnes ?? 0), 0);
    const hubStock = r.storage_hubs.reduce((s, h) => s + (h.current_stock_tonnes ?? 0), 0);
    const utilPct = hubCapacity > 0 ? (hubStock / hubCapacity) * 100 : 0;
    return { name: r.name, farmerCount, avgCredit: Math.round(avgCredit), hubCount: r.storage_hubs.length, utilPct };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Regional Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Regions" value={regionStats.length} icon="🗺️" accent="blue" />
        <KPICard
          label="Total Farmers"
          value={regionStats.reduce((s, r) => s + r.farmerCount, 0).toLocaleString()}
          icon="👨‍🌾"
          accent="green"
        />
        <KPICard
          label="Total Hubs"
          value={regionStats.reduce((s, r) => s + r.hubCount, 0)}
          icon="🏭"
          accent="purple"
        />
        <KPICard
          label="Avg Credit Score"
          value={
            regionStats.length
              ? Math.round(
                  regionStats.reduce((s, r) => s + r.avgCredit, 0) / regionStats.length
                )
              : "—"
          }
          icon="⭐"
          accent="amber"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border font-semibold">Region Breakdown</div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Region</th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Farmers</th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Avg Score</th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Hubs</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Hub Utilisation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {regionStats.map((r) => (
              <tr key={r.name}>
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3 text-right">{r.farmerCount.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">{r.avgCredit > 0 ? r.avgCredit : "—"}</td>
                <td className="px-4 py-3 text-right">{r.hubCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          r.utilPct >= 90 ? "bg-red-500" : r.utilPct >= 70 ? "bg-amber-500" : "bg-green-500"
                        }`}
                        style={{ width: `${r.utilPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {r.utilPct.toFixed(0)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
