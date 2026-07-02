import { z } from "zod";

export const farmerSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().regex(/^(\+233|0)[0-9]{9}$/, "Enter a valid Ghana phone number"),
  ghana_card_id: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  village_id: z.string().uuid("Select a village"),
  gps_lat: z.number().min(-90).max(90).optional(),
  gps_lng: z.number().min(-180).max(180).optional(),
});

export type FarmerFormData = z.infer<typeof farmerSchema>;
