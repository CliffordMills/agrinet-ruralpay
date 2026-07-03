import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import KPICard from "@/components/admin/KPICard";

export default async function PaymentAnalyticsPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();

  const { data: payments } = await supabase
    .from("payments")
    .select("amount, currency, status, provider, payment_type, created_at")
    .order("created_at", { ascending: false });

  const all = payments ?? [];
  const successful = all.filter((p) => p.status === "successful");
  const pending = all.filter((p) => p.status === "pending" || p.status === "processing");
  const failed = all.filter((p) => p.status === "failed");

  const totalDisb = successful.reduce((s, p) => s + (p.amount ?? 0), 0);
  const successRate = all.length > 0 ? (successful.length / all.length) * 100 : 0;

  const byProvider = ["MTN", "Telecel", "AirtelTigo", "Bank"].map((prov) => {
    const provPayments = successful.filter((p) => p.provider === prov);
    return {
      provider: prov,
      count: provPayments.length,
      volume: provPayments.reduce((s, p) => s + (p.amount ?? 0), 0),
    };
  });

  const maxVolume = Math.max(...byProvider.map((p) => p.volume), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Disbursed"
          value={`GHS ${(totalDisb / 1_000_000).toLocaleString("en-GH", { minimumFractionDigits: 2 })}M`}
          icon="💸" accent="green"
        />
        <KPICard label="Transactions" value={all.length.toLocaleString()} icon="📊" accent="blue" />
        <KPICard
          label="Success Rate"
          value={`${successRate.toFixed(1)}%`}
          sub={`${successful.length} successful`}
          icon="✅" accent="green"
        />
        <KPICard
          label="Failed / Pending"
          value={failed.length + pending.length}
          sub={`${failed.length} failed, ${pending.length} pending`}
          icon="⚠️" accent="amber"
        />
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Volume by Provider</h2>
        <div className="space-y-3">
          {byProvider.map((p) => (
            <div key={p.provider} className="flex items-center gap-4">
              <div className="w-28 text-sm font-medium">{p.provider}</div>
              <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(p.volume / maxVolume) * 100}%` }}
                />
              </div>
              <div className="text-sm text-right w-40">
                <span className="font-semibold">GHS {p.volume.toLocaleString("en-GH", { minimumFractionDigits: 0 })}</span>
                <span className="text-muted-foreground ml-2">({p.count})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border font-semibold">Recent Transactions</div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Type</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Provider</th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Amount</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {all.slice(0, 15).map((p, i) => (
              <tr key={i}>
                <td className="px-4 py-2.5">{p.payment_type}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{p.provider ?? "—"}</td>
                <td className="px-4 py-2.5 text-right font-medium">
                  {p.currency} {(p.amount ?? 0).toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-2.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    p.status === "successful" ? "bg-green-100 text-green-800" :
                    p.status === "failed" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>{p.status}</span>
                </td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">
                  {new Date(p.created_at).toLocaleDateString("en-GH")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
