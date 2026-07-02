import { z } from "zod";

export const paymentSchema = z.object({
  farmer_id: z.string().uuid(),
  batch_id: z.string().uuid().optional(),
  amount: z.number().positive("Amount must be greater than 0"),
  provider: z.enum(["mtn", "telecel", "airteltigo", "bank"]),
  phone_number: z.string().regex(/^(\+233|0)[0-9]{9}$/, "Enter a valid Ghana phone number").optional(),
  account_number: z.string().optional(),
}).refine(
  (data) => { if (data.provider !== "bank") return !!data.phone_number; return !!data.account_number; },
  { message: "Payment details required for selected provider" }
);

export type PaymentFormData = z.infer<typeof paymentSchema>;
