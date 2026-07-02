import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  claimed: "bg-blue-100 text-blue-800",
  expired: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-100 text-red-700",
};

export default async function InsurancePage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();

  const { data: farmer } = await supabase
    .from("farmers")
    .select("id")
    .eq("user_id", session.user.id)
    .single();

  const { data: policies } = farmer
    ? await supabase
        .from("insurance_policies")
        .select(
          `id, policy_number, policy_type, coverage_amount, premium_amount,
           currency, status, start_date, end_date, created_at`
        )
        .eq("farmer_id", farmer.id)
        .order("created_at", { ascending: false })
    : { data: null };

  const activePolicies = policies?.filter((p) => p.status === "active") ?? [];
  const totalCoverage = activePolicies.reduce((sum, p) => sum + (p.coverage_amount || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Insurance Policies</h1>

      {activePolicies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="text-sm text-green-700 font-medium">Active Policies</div>
            <div className="text-3xl font-bold text-green-800 mt-1">{activePolicies.length}</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="text-sm text-blue-700 font-medium">Total Coverage</div>
            <div className="text-3xl font-bold text-blue-800 mt-1">
              GHS {totalCoverage.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      )}

      {!policies || policies.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-4xl mb-3">🛡️</div>
          <div className="font-medium">No insurance policies</div>
          <div className="text-sm mt-1">Contact your agent to enrol in crop or weather insurance</div>
        </div>
      ) : (
        <div className="space-y-3">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="bg-card border border-border rounded-lg p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{policy.policy_type}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-0.5">
                    {policy.policy_number}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Coverage: {policy.currency}{" "}
                    {policy.coverage_amount?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                  </div>
                  {policy.start_date && policy.end_date && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(policy.start_date).toLocaleDateString("en-GH")} –{" "}
                      {new Date(policy.end_date).toLocaleDateString("en-GH")}
                    </div>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[policy.status] || "bg-gray-100 text-gray-800"}`}>
                    {policy.status}
                  </span>
                  <div className="text-sm font-semibold">
                    {policy.currency}{" "}
                    {policy.premium_amount?.toLocaleString("en-GH", { minimumFractionDigits: 2 })}/yr
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-muted/50 border border-border rounded-xl p-5 text-sm text-muted-foreground">
        <div className="font-semibold text-foreground mb-2">Available Products</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: "Crop Insurance", desc: "Covers crop loss from drought, flood, or pests" },
            { name: "Weather Index", desc: "Parametric payout based on rainfall index" },
            { name: "Equipment Cover", desc: "Protects farm machinery and tools" },
          ].map((p) => (
            <div key={p.name} className="bg-background border border-border rounded-lg p-3">
              <div className="font-medium text-foreground">{p.name}</div>
              <div className="text-xs mt-1">{p.desc}</div>
              <div className="mt-2">
                <Link href="/agent" className="text-xs text-primary hover:underline">
                  Contact your agent →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
