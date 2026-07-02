import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ batchId: string }> }) {
  const session = await requireSession(["AGENT", "ADMIN", "SUPER_ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { batchId } = await params;
  const supabase = await createClient();
  const body = await req.json();
  const { grade_code, quality_score, unit_price_ghs } = body;

  const { error } = await supabase.from("commodity_batches").update({ grade_at_intake: grade_code, quality_score, unit_price_ghs, status: "graded" }).eq("id", batchId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
