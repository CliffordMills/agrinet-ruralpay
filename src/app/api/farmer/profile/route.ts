import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await requireSession();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("farmers")
      .select(`
        *,
        villages(name, gps_lat, gps_lng,
          districts(name,
            regions(name)
          )
        )
      `)
      .eq("user_id", session.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSession();
    const supabase = await createClient();
    const body = await request.json();

    const allowed = ["first_name", "last_name", "phone", "date_of_birth", "gender"];
    const updates = Object.fromEntries(
      Object.entries(body).filter(([k]) => allowed.includes(k))
    );

    const { data, error } = await supabase
      .from("farmers")
      .update(updates)
      .eq("user_id", session.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
