import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import LoanRepaymentSchedule from "@/components/finance/LoanRepaymentSchedule";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  repaid: "bg-gray-100 text-gray-600",
  defaulted: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-600",
};

export default async function LoanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const supabase = await createClient();

  const { data: loan } = await supabase
    .from("loans")
    .select(
      `id, amount, currency, interest_rate, term_months, status, purpose,
       created_at, due_date, approved_at, disbursed_at, repaid_at, notes,
       farmers(first_name, last_name)`
    )
    .eq("id", id)
    .single();

  if (!loan) notFound();

  const farmer = loan.farmers as { first_name: string; last_name: string } | null;

  const { data: repayments } = await supabase
    .from("loan_repayments")
    .select("id, amount, paid_at, period_month")
    .eq("loan_id", id)
    .order("period_month", { ascending: true });

  const paidPeriods = repayments?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/finance/loans" className="text-muted-foreground hover:text-foreground text-sm">
          ← Loans
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {loan.currency} {loan.amount.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
            </h1>
            <div className="text-sm text-muted-foreground mt-1">
              {farmer ? `${farmer.first_name} ${farmer.last_name}` : ""} · {loan.purpose}
            </div>
          </div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${STATUS_COLORS[loan.status] || "bg-gray-100 text-gray-800"}`}>
            {loan.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Interest Rate</div>
            <div className="font-semibold">{loan.interest_rate}% p.a.</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Term</div>
            <div className="font-semibold">{loan.term_months} months</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Applied</div>
            <div className="font-semibold">{new Date(loan.created_at).toLocaleDateString("en-GH")}</div>
          </div>
          {loan.due_date && (
            <div>
              <div className="text-xs text-muted-foreground">Due Date</div>
              <div className="font-semibold">{new Date(loan.due_date).toLocaleDateString("en-GH")}</div>
            </div>
          )}
        </div>

        {loan.notes && (
          <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
            {loan.notes}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Repayment Schedule</h2>
        <LoanRepaymentSchedule
          principal={loan.amount}
          annualRate={loan.interest_rate}
          termMonths={loan.term_months}
          currency={loan.currency}
          paidPeriods={paidPeriods}
        />
      </div>

      {repayments && repayments.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border font-semibold">Payment History</div>
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Month</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Amount Paid</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Date Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {repayments.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2.5">Month {r.period_month}</td>
                  <td className="px-4 py-2.5 text-right font-semibold">
                    {loan.currency} {r.amount.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {new Date(r.paid_at).toLocaleDateString("en-GH")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
