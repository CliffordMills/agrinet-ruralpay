export type CreditTier = "Excellent" | "Good" | "Fair" | "Poor" | "No Score";

export interface CreditScoreBreakdown {
  repaymentHistory: number;
  procurementVolume: number;
  farmSize: number;
  accountAge: number;
  total: number;
  tier: CreditTier;
}

export function scoreTier(score: number): CreditTier {
  if (score >= 750) return "Excellent";
  if (score >= 600) return "Good";
  if (score >= 400) return "Fair";
  if (score > 0) return "Poor";
  return "No Score";
}

export function tierColor(tier: CreditTier): string {
  const map: Record<CreditTier, string> = {
    Excellent: "text-green-600",
    Good: "text-blue-600",
    Fair: "text-amber-600",
    Poor: "text-red-600",
    "No Score": "text-gray-400",
  };
  return map[tier];
}

export function tierBg(tier: CreditTier): string {
  const map: Record<CreditTier, string> = {
    Excellent: "bg-green-100 text-green-800",
    Good: "bg-blue-100 text-blue-800",
    Fair: "bg-amber-100 text-amber-800",
    Poor: "bg-red-100 text-red-800",
    "No Score": "bg-gray-100 text-gray-500",
  };
  return map[tier];
}

export function scoreGaugePercent(score: number): number {
  return Math.min(100, Math.max(0, (score / 850) * 100));
}
