import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Providers POST to this endpoint when payment status changes.
// Each provider uses a different payload shape; we normalise here.
export async function POST(req: NextRequest) {
  const body = await req.json();

  // MTN MoMo shape: { externalId, status, financialTransactionId }
  // Telecel shape:  { reference, transaction_status, txn_id }
  // Unified fallback: extract reference + status from whichever keys are present
  const reference: string =
    body.externalId ??
    body.reference ??
    body.external_id ??
    "";

  const rawStatus: string =
    body.status ??
    body.transaction_status ??
    body.txn_status ??
    "";

  const providerRef: string =
    body.financialTransactionId ??
    body.txn_id ??
    body.provider_reference ??
    "";

  if (!reference || !rawStatus) {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }

  const statusMap: Record<string, string> = {
    SUCCESSFUL: "successful",
    SUCCESS: "successful",
    successful: "successful",
    FAILED: "failed",
    failed: "failed",
    CANCELLED: "cancelled",
    cancelled: "cancelled",
    PENDING: "pending",
    pending: "pending",
  };

  const normalisedStatus = statusMap[rawStatus] ?? "pending";

  const supabase = await createClient();

  const { error } = await supabase
    .from("payments")
    .update({
      status: normalisedStatus,
      provider_reference: providerRef || null,
      updated_at: new Date().toISOString(),
    })
    .eq("reference", reference);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
