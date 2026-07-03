import {
  calculateLoanSchedule,
  maxLoanAmount,
  interestRateForScore,
} from "@/lib/finance/loanCalculator";

describe("calculateLoanSchedule", () => {
  it("returns correct number of rows", () => {
    const schedule = calculateLoanSchedule(10000, 24, 12);
    expect(schedule.rows).toHaveLength(12);
  });

  it("final balance is approximately zero", () => {
    const schedule = calculateLoanSchedule(5000, 18, 6);
    const lastRow = schedule.rows[schedule.rows.length - 1];
    expect(lastRow.balance).toBeCloseTo(0, 0);
  });

  it("total payment equals monthly * term", () => {
    const schedule = calculateLoanSchedule(10000, 22, 12);
    expect(schedule.totalPayment).toBeCloseTo(schedule.monthlyPayment * 12, 1);
  });

  it("total interest is positive", () => {
    const schedule = calculateLoanSchedule(10000, 22, 12);
    expect(schedule.totalInterest).toBeGreaterThan(0);
  });

  it("handles zero interest rate", () => {
    const schedule = calculateLoanSchedule(1200, 0, 12);
    expect(schedule.monthlyPayment).toBeCloseTo(100, 1);
    expect(schedule.totalInterest).toBeCloseTo(0, 1);
  });
});

describe("maxLoanAmount", () => {
  it("returns 50000 for excellent score", () => {
    expect(maxLoanAmount(800)).toBe(50000);
  });

  it("returns 0 for score below 200", () => {
    expect(maxLoanAmount(100)).toBe(0);
  });

  it("returns 10000 for fair score", () => {
    expect(maxLoanAmount(500)).toBe(10000);
  });
});

describe("interestRateForScore", () => {
  it("returns lower rate for higher score", () => {
    expect(interestRateForScore(800)).toBeLessThan(interestRateForScore(400));
  });

  it("returns 18 for excellent score", () => {
    expect(interestRateForScore(760)).toBe(18);
  });
});
