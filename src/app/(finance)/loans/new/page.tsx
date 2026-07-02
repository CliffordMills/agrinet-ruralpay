import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LoanApplicationForm from "@/components/finance/LoanApplicationForm";
import CreditScoreCard from "@/components/finance/CreditScoreCard";

export default async function NewLoanPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();

  const { data: farmer } = await supabase
    .from("farmers")
    .select("id, credit_score")
    .eq("user_id", session.user.id)
    .single();

  if (!farmer) redirect("/finance/credit");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/finance/loans" className="text-muted-foreground hover:text-foreground text-sm">
          ← Loans
        </Link>
      </div>

      <h1 className="text-2xl font-bold">Apply for a Loan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CreditScoreCard score={farmer.credit_score ?? 0} />
        </div>
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Loan Application</h2>
          <LoanApplicationForm creditScore={farmer.credit_score ?? 0} />
        </div>
      </div>
    </div>
  );
}
