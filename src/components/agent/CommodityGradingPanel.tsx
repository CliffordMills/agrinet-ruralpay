"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface GradeOption {
  name: string;
  code: string;
  min_score: number;
  max_score: number;
  price_premium_pct: number;
}

interface CommodityGradingPanelProps {
  batchId: string;
  commodity: string;
  currentGrade?: string;
  grades: GradeOption[];
  basePrice: number;
}

export default function CommodityGradingPanel({ batchId, commodity, currentGrade, grades, basePrice }: CommodityGradingPanelProps) {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState(currentGrade || "");
  const [qualityScore, setQualityScore] = useState(75);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (!selectedGrade) return;
    setLoading(true);

    const grade = grades.find((g) => g.code === selectedGrade);
    const adjustedPrice = basePrice * (1 + (grade?.price_premium_pct || 0) / 100);

    try {
      const res = await fetch(`/api/agent/procurement/${batchId}/grade`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade_code: selectedGrade, quality_score: qualityScore, unit_price_ghs: adjustedPrice }),
      });
      if (!res.ok) throw new Error("Failed to update grade");
      setSuccess(true);
      setTimeout(() => router.refresh(), 1500);
    } catch {
      // silently handled
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">✅ Grade updated successfully</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Quality Score: {qualityScore}/100</label>
        <input type="range" min={0} max={100} value={qualityScore} onChange={(e) => {
          const score = parseInt(e.target.value);
          setQualityScore(score);
          const auto = grades.find((g) => score >= g.min_score && score <= g.max_score);
          if (auto) setSelectedGrade(auto.code);
        }} className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Poor (0)</span><span>Excellent (100)</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Select Grade for {commodity}</label>
        <div className="grid grid-cols-1 gap-2">
          {grades.map((grade) => {
            const adjustedPrice = basePrice * (1 + grade.price_premium_pct / 100);
            return (
              <button key={grade.code} type="button" onClick={() => setSelectedGrade(grade.code)}
                className={`flex items-center justify-between px-4 py-3 border rounded-lg text-sm transition-colors ${
                  selectedGrade === grade.code ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${selectedGrade === grade.code ? "border-primary bg-primary" : "border-border"}`} />
                  <div className="text-left">
                    <div className="font-medium">{grade.name}</div>
                    <div className="text-xs text-muted-foreground">Score: {grade.min_score}–{grade.max_score}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">GHS {adjustedPrice.toFixed(2)}/kg</div>
                  {grade.price_premium_pct > 0 && <div className="text-xs text-green-600">+{grade.price_premium_pct}% premium</div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={!selectedGrade || loading} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
        {loading ? "Updating..." : "Apply Grade"}
      </button>
    </div>
  );
}
