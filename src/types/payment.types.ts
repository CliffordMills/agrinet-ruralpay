import type { PaymentProvider, PaymentStatus } from "./database.types";

export interface PaymentParams {
  amount: number;
  currency: string;
  phoneNumber?: string;
  accountNumber?: string;
  farmerId: string;
  batchId?: string;
  reference: string;
  description?: string;
}

export interface PaymentResult {
  providerRef: string;
  status: PaymentStatus;
  message?: string;
}

export interface PaymentProvider_Interface {
  name: PaymentProvider;
  initiate(params: PaymentParams): Promise<PaymentResult>;
  verify(ref: string): Promise<PaymentStatus>;
  reverse(ref: string): Promise<void>;
}

export interface WebhookPayload {
  provider: PaymentProvider;
  reference: string;
  providerRef: string;
  status: "successful" | "failed";
  amount?: number;
  failureReason?: string;
  metadata?: Record<string, unknown>;
}
