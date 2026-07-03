const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID ?? "";
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ?? "";
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER ?? "";
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886";

interface SMSResult {
  success: boolean;
  sid?: string;
  error?: string;
}

export async function sendSMS(to: string, body: string): Promise<SMSResult> {
  if (!ACCOUNT_SID || !AUTH_TOKEN || !FROM_NUMBER) {
    console.warn("[SMS] Twilio credentials not configured — message not sent");
    return { success: false, error: "SMS provider not configured" };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`;
    const params = new URLSearchParams({ To: to, From: FROM_NUMBER, Body: body });
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message ?? "Twilio error" };
    return { success: true, sid: data.sid };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function sendWhatsApp(to: string, body: string): Promise<SMSResult> {
  if (!ACCOUNT_SID || !AUTH_TOKEN) {
    console.warn("[WhatsApp] Twilio credentials not configured — message not sent");
    return { success: false, error: "WhatsApp provider not configured" };
  }

  const waTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`;
    const params = new URLSearchParams({ To: waTo, From: WHATSAPP_FROM, Body: body });
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message ?? "Twilio error" };
    return { success: true, sid: data.sid };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export function paymentSMSBody(farmerName: string, amount: number, currency: string, reference: string): string {
  return `AgriNet RuralPay: Dear ${farmerName}, your payment of ${currency} ${amount.toLocaleString("en-GH", { minimumFractionDigits: 2 })} has been initiated. Ref: ${reference}. Check your Mobile Money wallet.`;
}

export function bidAcceptedSMSBody(commodity: string, quantity: number, price: number, currency: string): string {
  return `AgriNet: Your bid for ${quantity}t of ${commodity} at ${currency} ${price}/kg has been ACCEPTED. A contract will be generated shortly.`;
}
