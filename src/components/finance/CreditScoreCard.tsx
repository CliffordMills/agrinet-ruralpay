"use client";

import { scoreTier, tierBg, scoreGaugePercent } from "@/lib/finance/creditScoring";

interface Props {
  score: number;
  previousScore?: number;
  lastUpdated?: string;
}

export default function CreditScoreCard({ score, previousScore, lastUpdated }: Props) {
  const tier = scoreTier(score);
  const pct = scoreGaugePercent(score);
  const delta = previousScore !== undefined ? score - previousScore : null;

  const gaugeColor =
    score >= 750
      ? "bg-green-500"
      : score >= 600
      ? "bg-blue-500"
      : score >= 400
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm text-muted-foreground">Credit Score</div>
          <div className="text-5xl font-bold mt-1">{score > 0 ? score : "—"}</div>
          {delta !== null && score > 0 && (
            <div className={`text-sm mt-1 font-medium ${delta >= 0 ? "text-green-600" : "text-red-600"}`}>
              {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)} pts since last update
            </div>
          )}
        </div>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${tierBg(tier)}`}>
          {tier}
        </span>
      </div>

      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${gaugeColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>0</span>
        <span>Poor</span>
        <span>Fair</span>
        <span>Good</span>
        <span>850</span>
      </div>

      {lastUpdated && (
        <div className="text-xs text-muted-foreground mt-4">
          Last updated {new Date(lastUpdated).toLocaleDateString("en-GH")}
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-center">
        {[
          { label: "Excellent", range: "750–850", active: score >= 750 },
          { label: "Good", range: "600–749", active: score >= 600 && score < 750 },
          { label: "Fair", range: "400–599", active: score >= 400 && score < 600 },
        ].map((t) => (
          <div
            key={t.label}
            className={`rounded-lg p-2 border ${
              t.active ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <div className={`font-semibold ${t.active ? "text-primary" : "text-muted-foreground"}`}>
              {t.label}
            </div>
            <div className="text-muted-foreground">{t.range}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
