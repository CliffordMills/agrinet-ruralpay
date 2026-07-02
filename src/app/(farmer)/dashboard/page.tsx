import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";
import { WalletCard } from "@/components/farmer/WalletCard";
import { CreditScoreGauge } from "@/components/farmer/CreditScoreGauge";
import { ClimateAlertFeed } from "@/components/farmer/ClimateAlertFeed";
import { LoanEligibilityCard } from "@/components/farmer/LoanEligibilityCard";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard | Farmer" };

export default async function FarmerDashboardPage() {
  const session = await getSession();
  const supabase = await createClient();

  const { data: farmer } = await supabase
    .from("farmers")
    .select("*, wallets(balance, currency)")
    .eq("user_id", session?.id ?? "")
    .single();

  const { data: loans } = await supabase
    .from("loans")
    .select("id")
    .eq("farmer_id", farmer?.id ?? "")
    .in("status", ["disbursed", "repaying"]);

  const { data: recentBatches } = await supabase
    .from("commodity_batches")
    .select("id, batch_id, quantity_kg, total_value, status, created_at, commodities(name)")
    .eq("farmer_id", farmer?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(5);

  const wallet = farmer?.wallets as { balance: number; currency: string } | null;
  const activeLoans = loans?.length ?? 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Welcome, {farmer?.first_name ?? session?.email?.split("@")[0]}
        </h1>
        <p className="text-muted-foreground">Digital ID: {farmer?.digital_id ?? "—"}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Wallet */}
        <div className="lg:col-span-2">
          <WalletCard
            balance={wallet?.balance ?? 0}
            currency={wallet?.currency ?? "GHS"}
          />
        </div>

        {/* Credit Score */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center">
          <h3 className="font-bold mb-4">Credit Score</h3>
          <CreditScoreGauge score={farmer?.credit_score ?? 0} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Batches */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Recent Sales</h3>
            <Link href="/farmer/sales" className="text-primary text-sm hover:underline">
              View all
            </Link>
          </div>
          {recentBatches && recentBatches.length > 0 ? (
            <div className="space-y-3">
              {recentBatches.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-sm">{b.batch_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {(b.commodities as { name: string } | null)?.name} • {b.quantity_kg} kg
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">GHS {Number(b.total_value).toLocaleString()}</p>
                    <span className="text-xs text-muted-foreground capitalize">{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-6">
              No sales recorded yet.
            </p>
          )}
        </div>

        {/* Loan Eligibility */}
        <LoanEligibilityCard
          creditScore={farmer?.credit_score ?? 0}
          activeLoans={activeLoans}
        />
      </div>

      {/* Climate */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-bold mb-4">Climate Alerts</h3>
        <ClimateAlertFeed />
      </div>
    </div>
  );
}
