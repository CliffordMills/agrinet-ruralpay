import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const session = await requireSession(["BUYER", "ADMIN", "SUPER_ADMIN"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data: buyer } = await supabase.from("buyers").select("id").eq("user_id", session.user.id).single();
  if (!buyer) return NextResponse.json({ error: "Buyer record not found" }, { status: 404 });

  const body = await req.json();
  const { listing_id, price_per_kg, quantity_tonnes, currency } = body;
  if (!listing_id || !price_per_kg || !quantity_tonnes) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const { data: listing } = await supabase.from("marketplace_listings").select("is_active, quantity_tonnes").eq("id", listing_id).single();
  if (!listing?.is_active) return NextResponse.json({ error: "Listing is not active" }, { status: 400 });
  if (quantity_tonnes > listing.quantity_tonnes) return NextResponse.json({ error: `Quantity exceeds available stock (${listing.quantity_tonnes} tonnes)` }, { status: 400 });

  const { data, error } = await supabase.from("bids").insert({ buyer_id: buyer.id, listing_id, price_per_kg, quantity_tonnes, currency: currency || "GHS", status: "pending" }).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bid_id: data.id }, { status: 201 });
}
