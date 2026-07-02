"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { maxLoanAmount, interestRateForScore, calculateLoanSchedule } from "@/lib/finance/loanCalculator";

interface Props {
  creditScore: number;
  currency?: string;
}

export default function LoanApplicationForm({ creditScore, currency = "GHS" }: Props) {
  const router = useRouter();
  const maxAmount = maxLoanAmount(creditScore);
  const suggestedRate = interestRateForScore(creditScore);

  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("12");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const amountNum = parseFloat(amount) || 0;
  const termNum = parseInt(term) || 12;
  const preview =
    amountNum > 0
      ? calculateLoanSchedule(amountNum, suggestedRate, termNum)
      : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (amountNum <= 0 || amountNum > maxAmount) {
      setError(`Amount must be between 1 and ${maxAmount.toLocaleString()} ${currency}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/finance/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountNum,
          term_months: termNum,
          interest_rate: suggestedRate,
          purpose,
          currency,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit application");
      router.push(`/finance/loans/${data.loan_id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (maxAmount === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-5 text-sm text-red-700">
        Your current credit score is too low to qualify for a loan. Build your score by completing
        more procurement cycles and maintaining on-time repayments.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">
          Loan Amount ({currency})
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          min={100}
          max={maxAmount}
          step={100}
          required
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="text-xs text-muted-foreground mt-1">
          Maximum: {currency} {maxAmount.toLocaleString()} · Rate: {suggestedRate}% p.a.
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Repayment Term</label>
        <select
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {[3, 6, 9, 12, 18, 24].map((m) => (
            <option key={m} value={m}>
              {m} months
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Purpose</label>
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select purpose…</option>
          <option value="inputs">Farm Inputs (seeds, fertiliser)</option>
          <option value="equipment">Equipment Purchase</option>
          <option value="irrigation">Irrigation</option>
          <option value="storage">Post-Harvest Storage</option>
          <option value="working_capital">Working Capital</option>
          <option value="other">Other</option>
        </select>
      </div>

      {preview && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 text-sm space-y-1">
          <div className="font-semibold mb-2">Loan Preview</div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monthly payment</span>
            <span className="font-semibold">
              {currency} {preview.monthlyPayment.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total repayment</span>
            <span>{currency} {preview.totalPayment.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total interest</span>
            <span className="text-amber-600">
              {currency} {preview.totalInterest.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors"
      >
        {loading ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}
