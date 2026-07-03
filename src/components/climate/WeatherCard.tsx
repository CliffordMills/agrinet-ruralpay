import { CurrentWeather } from "@/lib/climate/openWeather";

interface Props {
  weather: CurrentWeather;
  hubName: string;
}

export default function WeatherCard({ weather, hubName }: Props) {
  const windDirLabel = (deg: number) => {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(deg / 45) % 8];
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm text-muted-foreground">{hubName}</div>
          <div className="text-4xl font-bold mt-1">{weather.temp.toFixed(1)}°C</div>
          <div className="text-sm text-muted-foreground mt-1 capitalize">{weather.description}</div>
        </div>
        <div className="text-right text-sm">
          <div className="text-muted-foreground">Feels like</div>
          <div className="font-semibold">{weather.feelsLike.toFixed(1)}°C</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Humidity</div>
          <div className="font-semibold mt-0.5">{weather.humidity}%</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Wind</div>
          <div className="font-semibold mt-0.5">
            {weather.windSpeed} m/s {windDirLabel(weather.windDir)}
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Rain (1h)</div>
          <div className="font-semibold mt-0.5">{weather.rainMm ?? 0} mm</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Pressure</div>
          <div className="font-semibold mt-0.5">{weather.pressure} hPa</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Visibility</div>
          <div className="font-semibold mt-0.5">{weather.visibility.toFixed(1)} km</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Cloud Cover</div>
          <div className="font-semibold mt-0.5">{weather.cloudCover}%</div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground mt-3">
        Updated {new Date(weather.timestamp * 1000).toLocaleTimeString("en-GH")}
      </div>
    </div>
  );
}
