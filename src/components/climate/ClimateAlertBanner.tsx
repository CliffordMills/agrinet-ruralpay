"use client";

import { useState } from "react";
import { ClimateAlert, severityColor } from "@/lib/climate/alertEngine";

interface Props {
  alerts: ClimateAlert[];
}

export default function ClimateAlertBanner({ alerts }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = alerts.filter((a) => !dismissed.has(a.id));

  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      {visible.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start justify-between border rounded-lg p-4 ${
            severityColor(alert.severity)
          }`}
        >
          <div className="flex gap-3">
            <span className="text-lg">
              {alert.severity === "critical" ? "🚨" : alert.severity === "warning" ? "⚠️" : "ℹ️"}
            </span>
            <div>
              <div className="font-semibold text-sm">{alert.type}</div>
              <div className="text-sm mt-0.5">{alert.message}</div>
            </div>
          </div>
          <button
            onClick={() => setDismissed((prev) => new Set([...prev, alert.id]))}
            className="ml-4 text-current opacity-60 hover:opacity-100 text-lg leading-none flex-shrink-0"
            aria-label="Dismiss alert"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
