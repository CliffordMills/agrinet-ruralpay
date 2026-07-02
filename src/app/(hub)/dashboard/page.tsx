import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import HubStatusCard from "@/components/hub/HubStatusCard";

export default async function HubDashboardPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();

  const { data: hubs } = await supabase.from("storage_hubs").select("id, name, code, capacity_tonnes, current_stock_tonnes, is_active, regions(name), districts(name)").eq("is_active", true).order("name");
  const { data: recentBatches } = await supabase.from("commodity_batches").select("id, grn_number, quantity_kg, status, created_at, farmers(first_name, last_name), commodities(name), storage_hubs(name)").order("created_at", { ascending: false }).limit(10);

  const totalStock = (hubs || []).reduce((sum, h) => sum + (h.current_stock_tonnes || 0), 0);
  const totalCapacity = (hubs || []).reduce((sum, h) => sum + (h.capacity_tonnes || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Hub Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor and manage all storage facilities</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-sm text-muted-foreground">Active Hubs</div><div className="text-2xl font-bold mt-1">{hubs?.length || 0}</div></div>
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-sm text-muted-foreground">Total Stock (t)</div><div className="text-2xl font-bold mt-1">{totalStock.toLocaleString()}</div></div>
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-sm text-muted-foreground">Overall Utilization</div><div className="text-2xl font-bold mt-1">{totalCapacity > 0 ? `${((totalStock / totalCapacity) * 100).toFixed(1)}%` : "0%"}</div></div>
      </div>

      <div>
        <h2 className="font-semibold mb-4">Storage Hubs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(hubs || []).map((hub) => {
            const region = hub.regions as { name: string } | null;
            const district = hub.districts as { name: string } | null;
            return (
              <Link key={hub.id} href={`/hub/inventory?hub=${hub.id}`}>
                <HubStatusCard name={hub.name} code={hub.code} capacityTonnes={hub.capacity_tonnes} currentStockTonnes={hub.current_stock_tonnes || 0} isActive={hub.is_active} region={region?.name || "—"} district={district?.name || "—"} />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold">Recent Batch Activity</h2>
          <Link href="/hub/batches" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-border">
          {!recentBatches || recentBatches.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No batch activity yet</div>
          ) : (
            recentBatches.map((batch) => {
              const farmer = batch.farmers as { first_name: string; last_name: string } | null;
              const commodity = batch.commodities as { name: string } | null;
              const hub = batch.storage_hubs as { name: string } | null;
              return (
                <div key={batch.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="text-sm font-medium">{farmer?.first_name} {farmer?.last_name} — {commodity?.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{batch.grn_number} · {hub?.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{batch.quantity_kg.toLocaleString()} kg</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${batch.status === "stored" ? "bg-green-100 text-green-800" : batch.status === "graded" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}>{batch.status}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
