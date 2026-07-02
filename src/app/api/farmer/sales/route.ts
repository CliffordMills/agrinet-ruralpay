import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await requireSession();
    const supabase = await createClient();

    const { data: farmer } = await supabase
      .from("farmers")
      .select("id")
      .eq("user_id", session.id)
      .single();

    if (!farmer) return NextResponse.json({ batches: [], summary: {} });

    const { data: batches } = await supabase
      .from("commodity_batches")
      .select(`
        id, batch_id, quantity_kg, purchase_price, total_value,
        status, grn_number, created_at,
        commodities(name, unit),
        commodity_grades(name),
        storage_hubs(name)
      `)
      .eq("farmer_id", farmer.id)
      .order("created_at", { ascending: false })
      .limit(50);

    // Monthly summary for chart
    const monthly: Record<string, number> = {};
    for (const b of batches ?? []) {
      const month = new Date(b.created_at).toLocaleDateString("en-GH", { month: "short", year: "2-digit" });
      monthly[month] = (monthly[month] ?? 0) + Number(b.total_value ?? 0);
    }

    return NextResponse.json({
      batches: batches ?? [],
      monthly: Object.entries(monthly).map(([month, value]) => ({ month, value })),
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
