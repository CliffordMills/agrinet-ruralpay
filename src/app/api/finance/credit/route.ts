import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const url = new URL(req.url);
  const farmerId = url.searchParams.get("farmer_id");

  let query = supabase
    .from("credit_scores")
    .select("id, score, reason, created_at, farmer_id")
    .order("created_at", { ascending: false })
    .limit(50);

  if (farmerId) {
    query = query.eq("farmer_id", farmerId);
  } else {
    const { data: farmer } = await supabase
      .from("farmers")
      .select("id")
      .eq("user_id", session.user.id)
      .single();
    if (!farmer) return NextResponse.json({ data: [] });
    query = query.eq("farmer_id", farmer.id);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
