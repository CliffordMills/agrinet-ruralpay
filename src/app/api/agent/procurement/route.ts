import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { generateGRNNumber } from "@/lib/grn/generateGRN";

export async function GET(req: NextRequest) {
  const session = await requireSession(["AGENT", "ADMIN", "SUPER_ADMIN", "HUB_MANAGER"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const offset = parseInt(url.searchParams.get("offset") || "0");
  const status = url.searchParams.get("status");

  const { data: agent } = await supabase.from("agents").select("id").eq("user_id", session.user.id).single();

  let query = supabase.from("commodity_batches").select(`id, grn_number, quantity_kg, total_value, status, grade_at_intake, created_at, farmers(first_name, last_name, digital_id), commodities(name, unit), storage_hubs(name, code)`).order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  if (agent) query = query.eq("agent_id", agent.id);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ batches: data });
}

export async function POST(req: NextRequest) {
  const session = await requireSession(["AGENT", "ADMIN", "SUPER_ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data: agent } = await supabase.from("agents").select("id").eq("user_id", session.user.id).single();
  if (!agent) return NextResponse.json({ error: "Agent record not found" }, { status: 404 });

  const body = await req.json();
  const { farmer_id, commodity_id, hub_id, quantity_kg, unit_price_ghs, grade_code, notes } = body;
  if (!farmer_id || !commodity_id || !hub_id || !quantity_kg || !unit_price_ghs) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const grnNumber = generateGRNNumber();
  const { data, error } = await supabase.from("commodity_batches").insert({ agent_id: agent.id, farmer_id, commodity_id, hub_id, quantity_kg, unit_price_ghs, grade_at_intake: grade_code, grn_number: grnNumber, notes, status: "pending" }).select("id, grn_number").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ batch_id: data.id, grn_number: data.grn_number }, { status: 201 });
}
