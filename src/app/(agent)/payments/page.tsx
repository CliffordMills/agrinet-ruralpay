import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  successful: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  reversed: "bg-gray-100 text-gray-800",
};

export default async function AgentPaymentsPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: agent } = await supabase.from("agents").select("id").eq("user_id", session.user.id).single();
  const { data: farmerIds } = await supabase.from("farmers").select("id").eq("agent_id", agent?.id || "");
  const ids = (farmerIds || []).map((f) => f.id);

  const { data: payments } = await supabase.from("payments").select("id, amount, currency, provider, status, reference, created_at, farmers(first_name, last_name, digital_id)").in("farmer_id", ids.length > 0 ? ids : ["none"]).order("created_at", { ascending: false });

  const totalPaid = (payments || []).filter((p) => p.status === "successful").reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = (payments || []).filter((p) => p.status === "pending").length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payments</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-sm text-muted-foreground">Total Paid (GHS)</div><div className="text-2xl font-bold mt-1 text-green-600">{totalPaid.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</div></div>
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-sm text-muted-foreground">Pending</div><div className="text-2xl font-bold mt-1 text-amber-600">{pendingCount}</div></div>
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-sm text-muted-foreground">Total Transactions</div><div className="text-2xl font-bold mt-1">{payments?.length || 0}</div></div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Farmer</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Provider</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount (GHS)</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Reference</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!payments || payments.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No payments yet</td></tr>
            ) : (
              payments.map((payment) => {
                const farmer = payment.farmers as { first_name: string; last_name: string; digital_id: string } | null;
                return (
                  <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3"><div className="font-medium">{farmer?.first_name} {farmer?.last_name}</div><div className="text-xs text-muted-foreground font-mono">{farmer?.digital_id}</div></td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{payment.provider.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-right font-semibold">{payment.amount.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[payment.status] || "bg-gray-100 text-gray-800"}`}>{payment.status}</span></td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{payment.reference}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(payment.created_at).toLocaleDateString("en-GH")}</td>
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
