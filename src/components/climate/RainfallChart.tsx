import { ForecastDay } from "@/lib/climate/openWeather";

interface Props {
  forecast: ForecastDay[];
}

export default function RainfallChart({ forecast }: Props) {
  const maxRain = Math.max(...forecast.map((d) => d.rainMm), 1);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-semibold mb-4">7-Day Rainfall Forecast</h3>
      <div className="flex items-end gap-2 h-32">
        {forecast.map((day) => {
          const pct = (day.rainMm / maxRain) * 100;
          const date = new Date(day.date);
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs text-muted-foreground font-medium">
                {day.rainMm > 0 ? `${day.rainMm}` : ""}
              </div>
              <div className="w-full flex flex-col justify-end" style={{ height: "80px" }}>
                <div
                  className={`w-full rounded-t transition-all ${
                    day.rainMm >= 20
                      ? "bg-blue-600"
                      : day.rainMm >= 10
                      ? "bg-blue-400"
                      : day.rainMm > 0
                      ? "bg-blue-300"
                      : "bg-muted"
                  }`}
                  style={{ height: `${Math.max(pct, day.rainMm > 0 ? 4 : 2)}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {date.toLocaleDateString("en-GH", { weekday: "short" })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>mm</span>
        <span className="text-blue-600">■ Heavy (≥20mm)</span>
      </div>
    </div>
  );
}
