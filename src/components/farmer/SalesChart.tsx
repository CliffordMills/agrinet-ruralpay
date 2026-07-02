"use client";

interface SalesDataPoint {
  month: string;
  value: number;
}

export function SalesChart({ data }: { data: SalesDataPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
        No sales data yet.
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.month} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-8 shrink-0">{d.month}</span>
          <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium w-16 text-right">
            GHS {d.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
