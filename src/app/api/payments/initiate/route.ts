import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import {
  buildPaymentRequest,
  initiatePayment,
} from "@/lib/payments/paymentEngine";
import { detectProvider } from "@/lib/payments/providers";

export async function POST(req: NextRequest) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const body = await req.json();
  const {
    amount,
    currency,
    recipient_phone,
    recipient_name,
    description,
    farmer_id,
    batch_id,
    loan_id,
    payment_type,
  } = body;

  if (!amount || !recipient_phone || !recipient_name || !payment_type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const payReq = buildPaymentRequest(
    amount,
    currency || "GHS",
    recipient_phone,
    recipient_name,
    description || payment_type
  );

  const result = await initiatePayment(payReq);
  const provider = detectProvider(recipient_phone);

  const { data, error } = await supabase
    .from("payments")
    .insert({
      reference: payReq.reference,
      amount,
      currency: currency || "GHS",
      recipient_phone,
      recipient_name,
      description: description || payment_type,
      payment_type,
      provider,
      status: result.status,
      farmer_id: farmer_id || null,
      batch_id: batch_id || null,
      loan_id: loan_id || null,
      initiated_by: session.user.id,
    })
    .select("id, reference")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ payment_id: data.id, reference: data.reference }, { status: 201 });
}
