import { z } from "zod";

export const RequestSchema = z.object({
  user_id: z.string().uuid(),
  purpose: z.string().min(1, "Purpose is required."),
  pickup: z.string().min(1, "Pickup is required."),
  destination: z.string().min(1, "Destination is required."),
  schedule: z.string().datetime().optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  passengers: z.union([z.number().int().min(1), z.null(), z.literal("")]).optional(),
  notes: z.string().optional().or(z.null()).or(z.literal("")),
});
