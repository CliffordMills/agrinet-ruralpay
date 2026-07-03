import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { fetchCurrentWeather, fetchForecast } from "@/lib/climate/openWeather";
import { generateAlerts } from "@/lib/climate/alertEngine";

export async function GET(req: NextRequest) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const hubId = url.searchParams.get("hub_id");

  let lat = parseFloat(url.searchParams.get("lat") ?? "5.6037");
  let lon = parseFloat(url.searchParams.get("lon") ?? "-0.187");

  if (hubId) {
    const supabase = await createClient();
    const { data: hub } = await supabase
      .from("storage_hubs")
      .select("latitude, longitude")
      .eq("id", hubId)
      .single();
    if (hub?.latitude) lat = hub.latitude;
    if (hub?.longitude) lon = hub.longitude;
  }

  const [weather, forecast] = await Promise.all([
    fetchCurrentWeather(lat, lon),
    fetchForecast(lat, lon),
  ]);

  const alerts = weather ? generateAlerts(weather) : [];

  return NextResponse.json({ weather, forecast, alerts });
}
