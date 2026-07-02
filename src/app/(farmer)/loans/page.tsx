import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";
import { LoanEligibilityCard } from "@/components/farmer/LoanEligibilityCard";

export const metadata: Metadata = { title: "Loans" };

export default async function FarmerLoansPage() {
  const session = await getSession();
  const supabase = await createClient();

  const { data: farmer } = await supabase
    .from("farmers")
    .select("id, credit_score")
    .eq("user_id", session?.id ?? "")
    .single();

  const { data: loans } = farmer
    ? await supabase
        .from("loans")
        .select("id, amount, status, interest_rate, term_weeks, due_date, repaid_amount, created_at, purpose")
        .eq("farmer_id", farmer.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const activeLoans = loans?.filter((l) => ["disbursed", "repaying"].includes(l.status)).length ?? 0;

  const STATUS_STYLES: Record<string, string> = {
    applied: "bg-blue-100 text-blue-800",
    under_review: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    disbursed: "bg-primary/10 text-primary",
    repaying: "bg-purple-100 text-purple-800",
    settled: "bg-gray-100 text-gray-600",
    defaulted: "bg-red-100 text-red-800",
    rejected: "bg-red-50 text-red-600",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Loans</h1>
        <p className="text-muted-foreground">Input financing and production loans</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <LoanEligibilityCard
          creditScore={farmer?.credit_score ?? 0}
          activeLoans={activeLoans}
        />
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-bold mb-4">Loan History</h3>
        {loans && loans.length > 0 ? (
          <div className="space-y-4">
            {loans.map((loan) => (
              <div key={loan.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">GHS {Number(loan.amount).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{loan.purpose ?? "General loan"}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {loan.term_weeks} weeks • {(Number(loan.interest_rate) * 100).toFixed(1)}% interest
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[loan.status] ?? ""`}">
                    {loan.status.replace("_", " ")}
                  </span>
                </div>
                {loan.due_date && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Due: {new Date(loan.due_date).toLocaleDateString("en-GH")}
                    {" "}• Repaid: GHS {Number(loan.repaid_amount).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-8">No loan history.</p>
        )}
      </div>
    </div>
  );
}
