import { detectProvider, MoMoProvider } from "./providers";

export type PaymentStatus = "pending" | "processing" | "successful" | "failed" | "cancelled";

export interface PaymentRequest {
  reference: string;
  amount: number;
  currency: string;
  recipientPhone: string;
  recipientName: string;
  description: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  reference: string;
  provider: MoMoProvider;
  status: PaymentStatus;
  providerReference?: string;
  failureReason?: string;
  processedAt?: string;
}

export function generatePaymentReference(): string {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `PAY-${ts}-${rand}`;
}

export function buildPaymentRequest(
  amount: number,
  currency: string,
  recipientPhone: string,
  recipientName: string,
  description: string,
  metadata?: Record<string, string>
): PaymentRequest {
  return {
    reference: generatePaymentReference(),
    amount,
    currency,
    recipientPhone,
    recipientName,
    description,
    metadata,
  };
}

export async function initiatePayment(req: PaymentRequest): Promise<PaymentResult> {
  const provider = detectProvider(req.recipientPhone);

  // In production these would call real provider SDKs / REST APIs.
  // For now we record intent and return pending — the webhook will update status.
  return {
    reference: req.reference,
    provider,
    status: "pending",
  };
}

export async function pollPaymentStatus(reference: string): Promise<PaymentStatus> {
  // Stub: production would call provider status endpoint.
  // Returns the status stored in our DB.
  return "pending";
}
