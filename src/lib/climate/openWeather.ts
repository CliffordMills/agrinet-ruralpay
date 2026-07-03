export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDir: number;
  description: string;
  icon: string;
  visibility: number;
  uvIndex?: number;
  cloudCover: number;
  rainMm?: number;
  timestamp: number;
}

export interface ForecastDay {
  date: string;
  tempMin: number;
  tempMax: number;
  humidity: number;
  rainMm: number;
  description: string;
  icon: string;
}

const BASE = "https://api.openweathermap.org/data/2.5";
const KEY = process.env.OPENWEATHER_API_KEY ?? "";

export async function fetchCurrentWeather(
  lat: number,
  lon: number
): Promise<CurrentWeather | null> {
  if (!KEY) return null;
  try {
    const res = await fetch(
      `${BASE}/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric`,
      { next: { revalidate: 600 } }
    );
    if (!res.ok) return null;
    const d = await res.json();
    return {
      temp: d.main.temp,
      feelsLike: d.main.feels_like,
      humidity: d.main.humidity,
      pressure: d.main.pressure,
      windSpeed: d.wind?.speed ?? 0,
      windDir: d.wind?.deg ?? 0,
      description: d.weather?.[0]?.description ?? "",
      icon: d.weather?.[0]?.icon ?? "",
      visibility: (d.visibility ?? 10000) / 1000,
      cloudCover: d.clouds?.all ?? 0,
      rainMm: d.rain?.["1h"] ?? 0,
      timestamp: d.dt,
    };
  } catch {
    return null;
  }
}

export async function fetchForecast(
  lat: number,
  lon: number
): Promise<ForecastDay[]> {
  if (!KEY) return [];
  try {
    const res = await fetch(
      `${BASE}/forecast?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric&cnt=40`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const d = await res.json();

    const byDay: Record<string, { temps: number[]; rain: number; humidity: number[]; desc: string; icon: string }> = {};
    for (const item of d.list) {
      const date = new Date(item.dt * 1000).toISOString().slice(0, 10);
      if (!byDay[date]) byDay[date] = { temps: [], rain: 0, humidity: [], desc: "", icon: "" };
      byDay[date].temps.push(item.main.temp);
      byDay[date].rain += item.rain?.["3h"] ?? 0;
      byDay[date].humidity.push(item.main.humidity);
      byDay[date].desc = item.weather?.[0]?.description ?? "";
      byDay[date].icon = item.weather?.[0]?.icon ?? "";
    }

    return Object.entries(byDay)
      .slice(0, 7)
      .map(([date, v]) => ({
        date,
        tempMin: Math.min(...v.temps),
        tempMax: Math.max(...v.temps),
        humidity: Math.round(v.humidity.reduce((a, b) => a + b, 0) / v.humidity.length),
        rainMm: Math.round(v.rain * 10) / 10,
        description: v.desc,
        icon: v.icon,
      }));
  } catch {
    return [];
  }
}

export function weatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
