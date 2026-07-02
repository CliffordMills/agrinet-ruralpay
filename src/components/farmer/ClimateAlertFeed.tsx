"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  alert_type: string;
  created_at: string;
}

const SEVERITY_STYLES = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  critical: "bg-red-50 border-red-200 text-red-800",
};

const SEVERITY_ICONS = { info: "ℹ️", warning: "⚠️", critical: "🚨" };

export function ClimateAlertFeed({ regionId }: { regionId?: string }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const supabase = createClient();
    let query = supabase
      .from("climate_alerts")
      .select("id, title, message, severity, alert_type, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(5);
    if (regionId) query = query.eq("region_id", regionId);
    query.then(({ data }) => setAlerts((data as Alert[]) ?? []));
  }, [regionId]);

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        <span className="text-2xl block mb-2">☀️</span>
        No active climate alerts for your region.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`border rounded-lg p-4 ${SEVERITY_STYLES[alert.severity]}`}
        >
          <div className="flex items-start gap-2">
            <span>{SEVERITY_ICONS[alert.severity]}</span>
            <div>
              <p className="font-semibold text-sm">{alert.title}</p>
              <p className="text-sm mt-0.5 opacity-80">{alert.message}</p>
              <p className="text-xs mt-1 opacity-60">
                {new Date(alert.created_at).toLocaleDateString("en-GH")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
