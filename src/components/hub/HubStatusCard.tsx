interface HubStatusCardProps {
  name: string;
  code: string;
  capacityTonnes: number;
  currentStockTonnes: number;
  isActive: boolean;
  region: string;
  district: string;
}

export default function HubStatusCard({ name, code, capacityTonnes, currentStockTonnes, isActive, region, district }: HubStatusCardProps) {
  const utilizationPct = capacityTonnes > 0 ? Math.min(100, (currentStockTonnes / capacityTonnes) * 100) : 0;
  const barColor = utilizationPct >= 90 ? "bg-red-500" : utilizationPct >= 70 ? "bg-amber-500" : "bg-primary";

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-semibold text-lg">{name}</div>
          <div className="text-xs font-mono text-muted-foreground mt-0.5">{code}</div>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>{isActive ? "Active" : "Inactive"}</span>
      </div>
      <div className="text-xs text-muted-foreground mb-3">{district}, {region}</div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Storage Utilization</span>
          <span className="font-medium">{utilizationPct.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${utilizationPct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentStockTonnes.toLocaleString()} t used</span>
          <span>{capacityTonnes.toLocaleString()} t capacity</span>
        </div>
      </div>
    </div>
  );
}
