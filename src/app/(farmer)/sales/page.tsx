import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";
import { SalesChart } from "@/components/farmer/SalesChart";

export const metadata: Metadata = { title: "My Sales" };

export default async function SalesPage() {
  const session = await getSession();
  const supabase = await createClient();

  const { data: farmer } = await supabase
    .from("farmers")
    .select("id")
    .eq("user_id", session?.id ?? "")
    .single();

  const { data: batches } = farmer
    ? await supabase
        .from("commodity_batches")
        .select(`id, batch_id, quantity_kg, total_value, status, grn_number, created_at,
          commodities(name, unit), commodity_grades(name), storage_hubs(name)`)
        .eq("farmer_id", farmer.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const monthly: Record<string, number> = {};
  for (const b of batches ?? []) {
    const month = new Date(b.created_at).toLocaleDateString("en-GH", { month: "short", year: "2-digit" });
    monthly[month] = (monthly[month] ?? 0) + Number(b.total_value ?? 0);
  }
  const chartData = Object.entries(monthly).slice(-6).map(([month, value]) => ({ month, value }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Sales</h1>
        <p className="text-muted-foreground">Commodity procurement history</p>
      </div>

      {chartData.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="font-bold mb-4">Monthly Sales (GHS)</h3>
          <SalesChart data={chartData} />
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-bold mb-4">All Batches</h3>
        {batches && batches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-semibold">Batch ID</th>
                  <th className="text-left py-2 font-semibold">Commodity</th>
                  <th className="text-right py-2 font-semibold">Qty (kg)</th>
                  <th className="text-right py-2 font-semibold">Value (GHS)</th>
                  <th className="text-left py-2 font-semibold">Status</th>
                  <th className="text-left py-2 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-mono text-xs">{b.batch_id}</td>
                    <td className="py-3">{(b.commodities as { name: string } | null)?.name}</td>
                    <td className="py-3 text-right">{Number(b.quantity_kg).toLocaleString()}</td>
                    <td className="py-3 text-right font-semibold">{Number(b.total_value).toLocaleString()}</td>
                    <td className="py-3">
                      <span className="capitalize text-xs bg-muted px-2 py-0.5 rounded-full">{b.status}</span>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(b.created_at).toLocaleDateString("en-GH")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-8">No sales recorded yet.</p>
        )}
      </div>
    </div>
  );
}
