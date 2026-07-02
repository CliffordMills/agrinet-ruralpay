export interface RepaymentRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface LoanSchedule {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  rows: RepaymentRow[];
}

export function calculateLoanSchedule(
  principal: number,
  annualRatePercent: number,
  termMonths: number
): LoanSchedule {
  const r = annualRatePercent / 100 / 12;
  let monthlyPayment: number;

  if (r === 0) {
    monthlyPayment = principal / termMonths;
  } else {
    monthlyPayment =
      (principal * r * Math.pow(1 + r, termMonths)) /
      (Math.pow(1 + r, termMonths) - 1);
  }

  const rows: RepaymentRow[] = [];
  let balance = principal;

  for (let i = 1; i <= termMonths; i++) {
    const interest = balance * r;
    const principalPaid = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPaid);
    rows.push({
      period: i,
      payment: monthlyPayment,
      principal: principalPaid,
      interest,
      balance,
    });
  }

  const totalPayment = monthlyPayment * termMonths;
  return {
    monthlyPayment,
    totalPayment,
    totalInterest: totalPayment - principal,
    rows,
  };
}

export function maxLoanAmount(creditScore: number): number {
  if (creditScore >= 750) return 50000;
  if (creditScore >= 600) return 25000;
  if (creditScore >= 400) return 10000;
  if (creditScore >= 200) return 2000;
  return 0;
}

export function interestRateForScore(creditScore: number): number {
  if (creditScore >= 750) return 18;
  if (creditScore >= 600) return 22;
  if (creditScore >= 400) return 28;
  return 35;
}
