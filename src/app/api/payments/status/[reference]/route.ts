import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reference } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select(
      "id, reference, amount, currency, status, provider, payment_type, description, created_at, updated_at"
    )
    .eq("reference", reference)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json({ payment: data });
}
