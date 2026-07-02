import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { maxLoanAmount } from "@/lib/finance/loanCalculator";

export async function GET(req: NextRequest) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const url = new URL(req.url);
  const farmerId = url.searchParams.get("farmer_id");
  const status = url.searchParams.get("status");

  let query = supabase
    .from("loans")
    .select(
      "id, amount, currency, interest_rate, term_months, status, purpose, created_at, due_date"
    )
    .order("created_at", { ascending: false });

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

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const session = await requireSession(["FARMER", "ADMIN", "SUPER_ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const { data: farmer } = await supabase
    .from("farmers")
    .select("id, credit_score")
    .eq("user_id", session.user.id)
    .single();

  if (!farmer) return NextResponse.json({ error: "Farmer record not found" }, { status: 404 });

  const body = await req.json();
  const { amount, term_months, interest_rate, purpose, currency } = body;

  if (!amount || !term_months || !interest_rate || !purpose) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const creditScore = farmer.credit_score ?? 0;
  const max = maxLoanAmount(creditScore);

  if (amount > max) {
    return NextResponse.json(
      { error: `Loan amount exceeds maximum allowed (${max}) for your credit score` },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("loans")
    .insert({
      farmer_id: farmer.id,
      amount,
      term_months,
      interest_rate,
      purpose,
      currency: currency || "GHS",
      status: "pending",
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ loan_id: data.id }, { status: 201 });
}
