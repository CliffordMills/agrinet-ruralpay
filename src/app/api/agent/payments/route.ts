import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const session = await requireSession(["AGENT", "ADMIN", "SUPER_ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const offset = parseInt(url.searchParams.get("offset") || "0");

  const { data: agent } = await supabase.from("agents").select("id").eq("user_id", session.user.id).single();
  const { data: farmerIds } = await supabase.from("farmers").select("id").eq("agent_id", agent?.id || "");
  const ids = (farmerIds || []).map((f) => f.id);

  const { data, error } = await supabase.from("payments").select(`id, amount, currency, provider, status, reference, created_at, farmers(first_name, last_name, digital_id), commodity_batches(grn_number)`).in("farmer_id", ids.length > 0 ? ids : ["none"]).order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ payments: data });
}

export async function POST(req: NextRequest) {
  const session = await requireSession(["AGENT", "ADMIN", "SUPER_ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const body = await req.json();
  const { batch_id, farmer_id, amount, provider, phone, currency } = body;
  if (!farmer_id || !amount || !provider || !currency) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const reference = `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const { data, error } = await supabase.from("payments").insert({ farmer_id, batch_id: batch_id || null, amount, currency, provider, phone, reference, status: "pending", initiated_by: session.user.id }).select("id, reference").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ payment_id: data.id, reference: data.reference }, { status: 201 });
}
