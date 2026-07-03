import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import KPICard from "@/components/admin/KPICard";

export default async function CommodityAnalyticsPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();

  const { data: batches } = await supabase
    .from("procurement_batches")
    .select("quantity_kg, unit_price_ghs, quality_score, status, commodity_id, commodities(name)")
    .not("commodity_id", "is", null);

  type BatchRow = {
    quantity_kg: number | null;
    unit_price_ghs: number | null;
    quality_score: number | null;
    status: string;
    commodity_id: string;
    commodities: { name: string } | null;
  };

  const all = (batches as BatchRow[] ?? []);

  const byCommodity = Object.entries(
    all.reduce<Record<string, { name: string; kg: number; value: number; scores: number[]; count: number }>>(
      (acc, b) => {
        const id = b.commodity_id;
        if (!acc[id]) acc[id] = { name: b.commodities?.name ?? id, kg: 0, value: 0, scores: [], count: 0 };
        acc[id].kg += b.quantity_kg ?? 0;
        acc[id].value += (b.quantity_kg ?? 0) * (b.unit_price_ghs ?? 0);
        if (b.quality_score) acc[id].scores.push(b.quality_score);
        acc[id].count++;
        return acc;
      },
      {}
    )
  )
    .map(([id, v]) => ({
      id,
      name: v.name,
      kg: v.kg,
      value: v.value,
      avgScore: v.scores.length > 0 ? Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length) : null,
      count: v.count,
    }))
    .sort((a, b) => b.value - a.value);

  const totalKg = all.reduce((s, b) => s + (b.quantity_kg ?? 0), 0);
  const totalValue = all.reduce((s, b) => s + (b.quantity_kg ?? 0) * (b.unit_price_ghs ?? 0), 0);
  const maxValue = Math.max(...byCommodity.map((c) => c.value), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Commodity Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Volume"
          value={`${(totalKg / 1000).toLocaleString("en-GH", { maximumFractionDigits: 1 })} t`}
          icon="⚖️" accent="green"
        />
        <KPICard
          label="Total Value"
          value={`GHS ${(totalValue / 1_000_000).toLocaleString("en-GH", { minimumFractionDigits: 2 })}M`}
          icon="💰" accent="blue"
        />
        <KPICard label="Commodities" value={byCommodity.length} icon="🌾" accent="amber" />
        <KPICard label="Batches" value={all.length.toLocaleString()} icon="📦" accent="purple" />
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Value by Commodity</h2>
        <div className="space-y-3">
          {byCommodity.map((c) => (
            <div key={c.id} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium truncate">{c.name}</div>
              <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(c.value / maxValue) * 100}%` }}
                />
              </div>
              <div className="text-sm text-right w-44">
                <span className="font-semibold">
                  GHS {c.value.toLocaleString("en-GH", { minimumFractionDigits: 0 })}
                </span>
                <span className="text-muted-foreground ml-1">
                  ({(c.kg / 1000).toFixed(1)}t)
                </span>
              </div>
              {c.avgScore !== null && (
                <div className="text-xs text-muted-foreground w-16 text-right">
                  Q: {c.avgScore}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
