interface Reading {
  metric: string;
  value: number;
  unit: string;
  recorded_at: string;
}

interface EnvironmentalGaugesProps {
  readings: Reading[];
}

const METRIC_CONFIG: Record<string, { label: string; icon: string; min: number; max: number; safeMin: number; safeMax: number }> = {
  temperature: { label: "Temperature", icon: "🌡️", min: 0, max: 50, safeMin: 15, safeMax: 25 },
  humidity: { label: "Humidity", icon: "💧", min: 0, max: 100, safeMin: 40, safeMax: 65 },
  co2: { label: "CO₂ (ppm)", icon: "💨", min: 0, max: 5000, safeMin: 0, safeMax: 1000 },
  weight: { label: "Weight (kg)", icon: "⚖️", min: 0, max: 100000, safeMin: 0, safeMax: 100000 },
};

function isInSafeRange(metric: string, value: number): boolean {
  const config = METRIC_CONFIG[metric];
  if (!config) return true;
  return value >= config.safeMin && value <= config.safeMax;
}

function getBarWidth(metric: string, value: number): number {
  const config = METRIC_CONFIG[metric];
  if (!config) return 0;
  return Math.min(100, ((value - config.min) / (config.max - config.min)) * 100);
}

export default function EnvironmentalGauges({ readings }: EnvironmentalGaugesProps) {
  if (readings.length === 0) {
    return <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">No sensor readings available</div>;
  }

  const latestByMetric = readings.reduce<Record<string, Reading>>((acc, r) => {
    if (!acc[r.metric] || r.recorded_at > acc[r.metric].recorded_at) acc[r.metric] = r;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.values(latestByMetric).map((reading) => {
        const config = METRIC_CONFIG[reading.metric];
        const safe = isInSafeRange(reading.metric, reading.value);
        const barWidth = getBarWidth(reading.metric, reading.value);
        return (
          <div key={reading.metric} className={`bg-card border rounded-lg p-5 ${safe ? "border-border" : "border-red-300 bg-red-50/30"}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span>{config?.icon || "📊"}</span>
                <span className="font-medium text-sm">{config?.label || reading.metric}</span>
              </div>
              {!safe && <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">⚠️ Alert</span>}
            </div>
            <div className="flex items-end gap-2 mb-3">
              <div className="text-3xl font-bold">{reading.value.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground pb-1">{reading.unit}</div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${safe ? "bg-primary" : "bg-red-500"}`} style={{ width: `${barWidth}%` }} />
            </div>
            <div className="text-xs text-muted-foreground mt-2">Updated: {new Date(reading.recorded_at).toLocaleString("en-GH")}</div>
          </div>
        );
      })}
    </div>
  );
}
