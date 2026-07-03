import { CurrentWeather } from "./openWeather";

export type AlertSeverity = "info" | "warning" | "critical";

export interface ClimateAlert {
  id: string;
  type: string;
  severity: AlertSeverity;
  message: string;
  value: number;
  threshold: number;
  unit: string;
}

const THRESHOLDS = {
  tempHigh: 35,
  tempLow: 10,
  humidityHigh: 85,
  humidityLow: 30,
  windHigh: 15,
  rainHeavy: 20,
};

export function generateAlerts(weather: CurrentWeather): ClimateAlert[] {
  const alerts: ClimateAlert[] = [];

  if (weather.temp >= THRESHOLDS.tempHigh) {
    alerts.push({
      id: `temp-high-${weather.timestamp}`,
      type: "High Temperature",
      severity: weather.temp >= 40 ? "critical" : "warning",
      message: `Temperature ${weather.temp.toFixed(1)}°C exceeds safe storage threshold of ${THRESHOLDS.tempHigh}°C`,
      value: weather.temp,
      threshold: THRESHOLDS.tempHigh,
      unit: "°C",
    });
  }

  if (weather.temp <= THRESHOLDS.tempLow) {
    alerts.push({
      id: `temp-low-${weather.timestamp}`,
      type: "Low Temperature",
      severity: "warning",
      message: `Temperature ${weather.temp.toFixed(1)}°C is below minimum ${THRESHOLDS.tempLow}°C`,
      value: weather.temp,
      threshold: THRESHOLDS.tempLow,
      unit: "°C",
    });
  }

  if (weather.humidity >= THRESHOLDS.humidityHigh) {
    alerts.push({
      id: `humid-high-${weather.timestamp}`,
      type: "High Humidity",
      severity: weather.humidity >= 95 ? "critical" : "warning",
      message: `Humidity ${weather.humidity}% risks mould and spoilage in stored grain`,
      value: weather.humidity,
      threshold: THRESHOLDS.humidityHigh,
      unit: "%",
    });
  }

  if (weather.humidity <= THRESHOLDS.humidityLow) {
    alerts.push({
      id: `humid-low-${weather.timestamp}`,
      type: "Low Humidity",
      severity: "info",
      message: `Humidity ${weather.humidity}% is below ideal range — monitor moisture content`,
      value: weather.humidity,
      threshold: THRESHOLDS.humidityLow,
      unit: "%",
    });
  }

  if (weather.windSpeed >= THRESHOLDS.windHigh) {
    alerts.push({
      id: `wind-${weather.timestamp}`,
      type: "High Wind Speed",
      severity: weather.windSpeed >= 25 ? "critical" : "warning",
      message: `Wind speed ${weather.windSpeed} m/s may affect transport and open storage`,
      value: weather.windSpeed,
      threshold: THRESHOLDS.windHigh,
      unit: "m/s",
    });
  }

  if ((weather.rainMm ?? 0) >= THRESHOLDS.rainHeavy) {
    alerts.push({
      id: `rain-${weather.timestamp}`,
      type: "Heavy Rainfall",
      severity: "warning",
      message: `Rainfall ${weather.rainMm}mm/hr — check drainage and flood risk at hub`,
      value: weather.rainMm ?? 0,
      threshold: THRESHOLDS.rainHeavy,
      unit: "mm/hr",
    });
  }

  return alerts;
}

export function severityColor(severity: AlertSeverity): string {
  const map: Record<AlertSeverity, string> = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    critical: "bg-red-50 border-red-200 text-red-800",
  };
  return map[severity];
}
