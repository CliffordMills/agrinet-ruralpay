interface Props {
  label: string;
  value: string | number;
  sub?: string;
  trend?: number;
  icon?: string;
  accent?: "green" | "blue" | "amber" | "red" | "purple";
}

const ACCENT_CLASSES: Record<string, string> = {
  green: "border-green-200 bg-green-50",
  blue: "border-blue-200 bg-blue-50",
  amber: "border-amber-200 bg-amber-50",
  red: "border-red-200 bg-red-50",
  purple: "border-purple-200 bg-purple-50",
};

const VALUE_CLASSES: Record<string, string> = {
  green: "text-green-700",
  blue: "text-blue-700",
  amber: "text-amber-700",
  red: "text-red-700",
  purple: "text-purple-700",
};

export default function KPICard({ label, value, sub, trend, icon, accent = "blue" }: Props) {
  return (
    <div className={`border rounded-xl p-5 ${ACCENT_CLASSES[accent]}`}>
      <div className="flex items-start justify-between">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div className={`text-3xl font-bold mt-2 ${VALUE_CLASSES[accent]}`}>{value}</div>
      <div className="flex items-center justify-between mt-1">
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
        {trend !== undefined && (
          <div className={`text-xs font-medium ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs last month
          </div>
        )}
      </div>
    </div>
  );
}
