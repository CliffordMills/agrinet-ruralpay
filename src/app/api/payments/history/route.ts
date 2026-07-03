import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const url = new URL(req.url);
  const farmerId = url.searchParams.get("farmer_id");
  const batchId = url.searchParams.get("batch_id");
  const loanId = url.searchParams.get("loan_id");
  const status = url.searchParams.get("status");
  const limit = parseInt(url.searchParams.get("limit") ?? "50");

  let query = supabase
    .from("payments")
    .select(
      `id, reference, amount, currency, status, provider, payment_type,
       description, recipient_name, recipient_phone, created_at, updated_at,
       farmer_id, batch_id, loan_id`
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (farmerId) query = query.eq("farmer_id", farmerId);
  if (batchId) query = query.eq("batch_id", batchId);
  if (loanId) query = query.eq("loan_id", loanId);
  if (status) query = query.eq("status", status);

  const role =
    session.user.app_metadata?.role || session.user.user_metadata?.role;

  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    query = query.eq("initiated_by", session.user.id);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
