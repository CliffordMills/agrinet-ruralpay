import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  repaid: "bg-gray-100 text-gray-600",
  defaulted: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-600",
};

export default async function LoansPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();

  const { data: farmer } = await supabase
    .from("farmers")
    .select("id, credit_score")
    .eq("user_id", session.user.id)
    .single();

  const { data: loans } = farmer
    ? await supabase
        .from("loans")
        .select("id, amount, currency, interest_rate, term_months, status, purpose, created_at, due_date")
        .eq("farmer_id", farmer.id)
        .order("created_at", { ascending: false })
    : { data: null };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Loans</h1>
        <Link
          href="/finance/loans/new"
          className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Apply for Loan
        </Link>
      </div>

      {!loans || loans.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-4xl mb-3">💰</div>
          <div className="font-medium">No loans yet</div>
          <div className="text-sm mt-1">
            <Link href="/finance/loans/new" className="text-primary hover:underline">
              Apply for your first loan
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {loans.map((loan) => (
            <Link
              key={loan.id}
              href={`/finance/loans/${loan.id}`}
              className="block bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-lg">
                    {loan.currency} {loan.amount.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {loan.purpose} · {loan.term_months} months · {loan.interest_rate}% p.a.
                  </div>
                  {loan.due_date && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Due {new Date(loan.due_date).toLocaleDateString("en-GH")}
                    </div>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[loan.status] || "bg-gray-100 text-gray-800"}`}>
                    {loan.status}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    {new Date(loan.created_at).toLocaleDateString("en-GH")}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
