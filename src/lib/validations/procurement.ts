import { z } from "zod";

export const procurementSchema = z.object({
  farmer_id: z.string().uuid("Select a farmer"),
  commodity_id: z.string().uuid("Select a commodity"),
  grade_id: z.string().uuid("Select a grade").optional(),
  hub_id: z.string().uuid("Select a hub").optional(),
  quantity_kg: z.number().positive("Quantity must be greater than 0").max(100000, "Quantity too large"),
  moisture_pct: z.number().min(0).max(100, "Moisture must be between 0 and 100").optional(),
  purchase_price: z.number().positive("Price must be greater than 0"),
  gps_lat: z.number().min(-90).max(90).optional(),
  gps_lng: z.number().min(-180).max(180).optional(),
});

export type ProcurementFormData = z.infer<typeof procurementSchema>;
