import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";
import { WalletCard } from "@/components/farmer/WalletCard";

export const metadata: Metadata = { title: "Wallet" };

export default async function WalletPage() {
  const session = await getSession();
  const supabase = await createClient();

  const { data: farmer } = await supabase
    .from("farmers")
    .select("id, wallet_id")
    .eq("user_id", session?.id ?? "")
    .single();

  const { data: wallet } = farmer?.wallet_id
    ? await supabase
        .from("wallets")
        .select("balance, currency, updated_at")
        .eq("id", farmer.wallet_id)
        .single()
    : { data: null };

  const { data: transactions } = farmer?.wallet_id
    ? await supabase
        .from("transactions")
        .select("id, type, amount, balance_after, description, created_at")
        .eq("wallet_id", farmer.wallet_id)
        .order("created_at", { ascending: false })
        .limit(30)
    : { data: [] };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Wallet</h1>
        <p className="text-muted-foreground">Your AGRINET digital wallet</p>
      </div>

      <div className="max-w-md mb-8">
        <WalletCard balance={wallet?.balance ?? 0} currency={wallet?.currency ?? "GHS"} />
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-bold mb-4">Transaction History</h3>
        {transactions && transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.created_at).toLocaleDateString("en-GH")}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${
                    tx.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}>
                    {tx.type === "credit" ? "+" : "-"}GHS {Number(tx.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Balance: GHS {Number(tx.balance_after).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-8">
            No transactions yet.
          </p>
        )}
      </div>
    </div>
  );
}
