"use client";

interface CreditScoreGaugeProps {
  score: number;
  maxScore?: number;
}

export function CreditScoreGauge({ score, maxScore = 1000 }: CreditScoreGaugeProps) {
  const pct = Math.min(100, (score / maxScore) * 100);
  const color =
    pct >= 70 ? "text-green-600" : pct >= 40 ? "text-secondary" : "text-red-500";
  const label =
    pct >= 70 ? "Excellent" : pct >= 55 ? "Good" : pct >= 40 ? "Fair" : "Poor";

  // SVG arc
  const r = 70;
  const cx = 90;
  const cy = 90;
  const startAngle = -210;
  const endAngle = 30;
  const totalAngle = endAngle - startAngle;
  const arcAngle = startAngle + (pct / 100) * totalAngle;

  function polarToCartesian(angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(endAngle);
  const arcEnd = polarToCartesian(arcAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  const filledLargeArc = arcAngle - startAngle > 180 ? 1 : 0;

  const trackPath = `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  const fillPath = `M ${start.x} ${start.y} A ${r} ${r} 0 ${filledLargeArc} 1 ${arcEnd.x} ${arcEnd.y}`;

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="130" viewBox="0 0 180 130">
        <path d={trackPath} fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" />
        <path
          d={fillPath}
          fill="none"
          stroke={pct >= 70 ? "#16a34a" : pct >= 40 ? "#f9a825" : "#dc2626"}
          strokeWidth="14"
          strokeLinecap="round"
        />
        <text x={cx} y={cy + 10} textAnchor="middle" className="text-2xl" fontSize="28" fontWeight="bold" fill="currentColor">
          {score}
        </text>
        <text x={cx} y={cy + 30} textAnchor="middle" fontSize="12" fill="#64748b">
          / {maxScore}
        </text>
      </svg>
      <span className={`text-sm font-semibold ${color}`}>{label}</span>
    </div>
  );
}
