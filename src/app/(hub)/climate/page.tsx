import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { fetchCurrentWeather, fetchForecast } from "@/lib/climate/openWeather";
import { generateAlerts } from "@/lib/climate/alertEngine";
import WeatherCard from "@/components/climate/WeatherCard";
import ClimateAlertBanner from "@/components/climate/ClimateAlertBanner";
import RainfallChart from "@/components/climate/RainfallChart";

export default async function ClimateIntelligencePage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();

  const { data: hubs } = await supabase
    .from("storage_hubs")
    .select("id, name, code, latitude, longitude")
    .not("latitude", "is", null)
    .limit(5);

  const primaryHub = hubs?.[0];
  const lat = primaryHub?.latitude ?? 5.6037;
  const lon = primaryHub?.longitude ?? -0.187;

  const [weather, forecast] = await Promise.all([
    fetchCurrentWeather(lat, lon),
    fetchForecast(lat, lon),
  ]);

  const alerts = weather ? generateAlerts(weather) : [];

  const { data: dbAlerts } = await supabase
    .from("climate_alerts")
    .select("id, alert_type, severity, message, hub_id, created_at, resolved_at")
    .is("resolved_at", null)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Climate Intelligence</h1>

      {alerts.length > 0 && <ClimateAlertBanner alerts={alerts} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {weather ? (
          <WeatherCard weather={weather} hubName={primaryHub?.name ?? "Primary Hub"} />
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 text-muted-foreground text-sm">
            Weather data unavailable. Configure <code>OPENWEATHER_API_KEY</code> to enable live data.
          </div>
        )}

        {forecast.length > 0 ? (
          <RainfallChart forecast={forecast} />
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <h3 className="font-semibold">7-Day Outlook</h3>
            <div className="text-sm text-muted-foreground">
              Forecast unavailable — configure API key to enable.
            </div>
          </div>
        )}
      </div>

      {forecast.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border font-semibold">Forecast Details</div>
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Date</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Min °C</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Max °C</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Humidity</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Rain mm</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Conditions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {forecast.map((day) => (
                <tr key={day.date}>
                  <td className="px-4 py-2.5">
                    {new Date(day.date).toLocaleDateString("en-GH", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="px-4 py-2.5 text-right">{day.tempMin.toFixed(1)}</td>
                  <td className="px-4 py-2.5 text-right font-medium">{day.tempMax.toFixed(1)}</td>
                  <td className="px-4 py-2.5 text-right">{day.humidity}%</td>
                  <td className={`px-4 py-2.5 text-right ${day.rainMm >= 20 ? "text-blue-600 font-semibold" : ""}`}>
                    {day.rainMm}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground capitalize">{day.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {dbAlerts && dbAlerts.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border font-semibold">Active Platform Alerts</div>
          <div className="divide-y divide-border">
            {dbAlerts.map((alert) => (
              <div key={alert.id} className="px-4 py-3 flex items-start gap-3">
                <span>
                  {alert.severity === "critical" ? "🚨" : alert.severity === "warning" ? "⚠️" : "ℹ️"}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{alert.alert_type}</div>
                  <div className="text-sm text-muted-foreground">{alert.message}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(alert.created_at).toLocaleDateString("en-GH")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
