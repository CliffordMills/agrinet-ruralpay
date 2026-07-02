"use client";

import { useState } from "react";
import { calculateLoanSchedule } from "@/lib/finance/loanCalculator";

interface Props {
  principal: number;
  annualRate: number;
  termMonths: number;
  currency?: string;
  paidPeriods?: number;
}

export default function LoanRepaymentSchedule({
  principal,
  annualRate,
  termMonths,
  currency = "GHS",
  paidPeriods = 0,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const schedule = calculateLoanSchedule(principal, annualRate, termMonths);
  const visibleRows = expanded ? schedule.rows : schedule.rows.slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Monthly Payment</div>
          <div className="font-bold text-lg mt-0.5">
            {currency} {schedule.monthlyPayment.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Total Repayment</div>
          <div className="font-bold text-lg mt-0.5">
            {currency} {schedule.totalPayment.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="text-xs text-amber-700">Total Interest</div>
          <div className="font-bold text-lg mt-0.5 text-amber-700">
            {currency} {schedule.totalInterest.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Month</th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Payment</th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Principal</th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Interest</th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleRows.map((row) => {
              const isPaid = row.period <= paidPeriods;
              return (
                <tr key={row.period} className={isPaid ? "bg-green-50 text-muted-foreground" : ""}>
                  <td className="px-4 py-2">
                    <span className={isPaid ? "line-through" : ""}>{row.period}</span>
                    {isPaid && <span className="ml-2 text-xs text-green-600">✓</span>}
                  </td>
                  <td className="px-4 py-2 text-right font-medium">
                    {row.payment.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {row.principal.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2 text-right text-amber-600">
                    {row.interest.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {row.balance.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {schedule.rows.length > 6 && (
          <div className="border-t border-border p-3 text-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-primary hover:underline"
            >
              {expanded ? "Show less" : `Show all ${schedule.rows.length} months`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
