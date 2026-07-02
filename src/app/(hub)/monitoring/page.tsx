import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EnvironmentalGauges from "@/components/hub/EnvironmentalGauges";

const SEVERITY_COLORS: Record<string, string> = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  critical: "bg-red-50 border-red-200 text-red-800",
};

export default async function HubMonitoringPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: readings } = await supabase.from("sensor_readings").select("id, metric, value, unit, recorded_at, iot_devices(device_name, storage_hubs(name))").order("recorded_at", { ascending: false }).limit(200);
  const { data: alerts } = await supabase.from("climate_alerts").select("id, title, message, severity, created_at").eq("is_active", true).order("created_at", { ascending: false }).limit(5);

  const formattedReadings = (readings || []).map((r) => ({ metric: r.metric, value: r.value, unit: r.unit, recorded_at: r.recorded_at }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Environmental Monitoring</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time sensor data from all storage facilities</p>
      </div>
      {alerts && alerts.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-semibold text-sm">Active Alerts</h2>
          {alerts.map((alert) => (<div key={alert.id} className={`border rounded-lg p-3 text-sm ${SEVERITY_COLORS[alert.severity] || "bg-gray-50 border-gray-200"}`}><span className="font-medium">{alert.title}:</span> {alert.message}</div>))}
        </div>
      )}
      <EnvironmentalGauges readings={formattedReadings} />
      {readings && readings.length > 0 && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border"><h2 className="font-semibold">Recent Sensor Readings</h2></div>
          <table className="w-full text-sm">
            <thead className="bg-muted/50"><tr><th className="text-left px-4 py-3 font-medium text-muted-foreground">Device</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Metric</th><th className="text-right px-4 py-3 font-medium text-muted-foreground">Value</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Time</th></tr></thead>
            <tbody className="divide-y divide-border">
              {readings.slice(0, 20).map((r) => {
                const device = r.iot_devices as { device_name: string } | null;
                return (<tr key={r.id}><td className="px-4 py-2.5 text-xs text-muted-foreground">{device?.device_name || "—"}</td><td className="px-4 py-2.5 capitalize">{r.metric}</td><td className="px-4 py-2.5 text-right font-medium">{r.value} {r.unit}</td><td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(r.recorded_at).toLocaleString("en-GH")}</td></tr>);
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
