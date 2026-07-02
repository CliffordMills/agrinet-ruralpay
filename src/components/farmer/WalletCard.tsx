"use client";

interface WalletCardProps {
  balance: number;
  currency?: string;
  recentTransactions?: Array<{
    id: string;
    type: "credit" | "debit";
    amount: number;
    description: string;
    created_at: string;
  }>;
}

export function WalletCard({ balance, currency = "GHS", recentTransactions = [] }: WalletCardProps) {
  return (
    <div className="bg-primary rounded-2xl p-6 text-white">
      <p className="text-white/70 text-sm mb-1">Wallet Balance</p>
      <p className="text-4xl font-extrabold mb-1">
        {currency} {balance.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
      </p>
      <p className="text-white/60 text-xs">Available for withdrawal</p>

      {recentTransactions.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="text-white/70 text-xs uppercase tracking-wide font-semibold mb-3">Recent</p>
          {recentTransactions.slice(0, 3).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between">
              <span className="text-white/80 text-sm truncate max-w-[180px]">{tx.description}</span>
              <span
                className={`text-sm font-semibold ${
                  tx.type === "credit" ? "text-secondary" : "text-red-300"
                }`}
              >
                {tx.type === "credit" ? "+" : "-"}{currency} {tx.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
