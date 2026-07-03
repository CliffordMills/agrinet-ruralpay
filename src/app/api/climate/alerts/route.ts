import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const url = new URL(req.url);
  const hubId = url.searchParams.get("hub_id");
  const resolved = url.searchParams.get("resolved") === "true";

  let query = supabase
    .from("climate_alerts")
    .select("id, alert_type, severity, message, hub_id, created_at, resolved_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (hubId) query = query.eq("hub_id", hubId);
  if (!resolved) query = query.is("resolved_at", null);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const session = await requireSession(["HUB_MANAGER", "ADMIN", "SUPER_ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const body = await req.json();
  const { alert_type, severity, message, hub_id } = body;

  if (!alert_type || !severity || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("climate_alerts")
    .insert({ alert_type, severity, message, hub_id: hub_id || null })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ alert_id: data.id }, { status: 201 });
}
