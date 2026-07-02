import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const session = await requireSession(["AGENT", "ADMIN", "SUPER_ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const url = new URL(req.url);
  const search = url.searchParams.get("q") || "";
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const offset = parseInt(url.searchParams.get("offset") || "0");

  const { data: agent } = await supabase.from("agents").select("id").eq("user_id", session.user.id).single();

  let query = supabase.from("farmers").select(`id, first_name, last_name, phone, digital_id, credit_score, created_at, villages(name, districts(name))`).eq("is_active", true).is("deleted_at", null).order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  if (agent) query = query.eq("agent_id", agent.id);
  if (search) query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,phone.ilike.%${search}%,digital_id.ilike.%${search}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ farmers: data });
}

export async function POST(req: NextRequest) {
  const session = await requireSession(["AGENT", "ADMIN", "SUPER_ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data: agent } = await supabase.from("agents").select("id").eq("user_id", session.user.id).single();
  if (!agent) return NextResponse.json({ error: "Agent record not found" }, { status: 404 });

  const body = await req.json();
  const { first_name, last_name, phone, gender, date_of_birth, village_id, national_id, farm_size_ha, primary_crop } = body;
  if (!first_name || !last_name || !phone || !village_id) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const { data, error } = await supabase.from("farmers").insert({ agent_id: agent.id, first_name, last_name, phone, gender, date_of_birth, village_id, national_id, farm_size_ha, primary_crop }).select("id, digital_id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
