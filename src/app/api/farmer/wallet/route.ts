import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await requireSession();
    const supabase = await createClient();

    // Get farmer record for this user
    const { data: farmer } = await supabase
      .from("farmers")
      .select("id, wallet_id")
      .eq("user_id", session.id)
      .single();

    if (!farmer?.wallet_id) {
      return NextResponse.json({ balance: 0, transactions: [] });
    }

    const [walletResult, txResult] = await Promise.all([
      supabase
        .from("wallets")
        .select("balance, currency, updated_at")
        .eq("id", farmer.wallet_id)
        .single(),
      supabase
        .from("transactions")
        .select("id, type, amount, balance_after, description, created_at")
        .eq("wallet_id", farmer.wallet_id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    return NextResponse.json({
      wallet: walletResult.data,
      transactions: txResult.data ?? [],
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
