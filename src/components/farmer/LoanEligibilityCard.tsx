"use client";

import Link from "next/link";

interface LoanEligibilityCardProps {
  creditScore: number;
  activeLoans: number;
}

export function LoanEligibilityCard({ creditScore, activeLoans }: LoanEligibilityCardProps) {
  const maxLoan =
    creditScore >= 700
      ? 5000
      : creditScore >= 500
      ? 2000
      : creditScore >= 300
      ? 1000
      : 0;

  const eligible = maxLoan > 0 && activeLoans === 0;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-bold mb-4">Loan Eligibility</h3>
      {eligible ? (
        <div>
          <p className="text-muted-foreground text-sm mb-3">
            Based on your credit score, you may qualify for:
          </p>
          <p className="text-3xl font-extrabold text-primary mb-1">
            GHS {maxLoan.toLocaleString()}
          </p>
          <p className="text-muted-foreground text-xs mb-4">Maximum input loan amount</p>
          <Link
            href="/farmer/loans"
            className="block text-center rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Apply for Loan
          </Link>
        </div>
      ) : (
        <div className="text-center py-4">
          {activeLoans > 0 ? (
            <>
              <p className="text-muted-foreground text-sm mb-2">
                You have {activeLoans} active loan{activeLoans > 1 ? "s" : ""}.
              </p>
              <p className="text-muted-foreground text-xs">Repay existing loans to unlock new credit.</p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground text-sm mb-2">Credit score too low</p>
              <p className="text-muted-foreground text-xs">Sell more produce to build your score.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
