import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { sendSMS, sendWhatsApp } from "@/lib/sms/twilioClient";

export async function POST(req: NextRequest) {
  const session = await requireSession(["ADMIN", "SUPER_ADMIN", "AGENT"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { to, message, channel } = body;

  if (!to || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result =
    channel === "whatsapp"
      ? await sendWhatsApp(to, message)
      : await sendSMS(to, message);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, sid: result.sid });
}
