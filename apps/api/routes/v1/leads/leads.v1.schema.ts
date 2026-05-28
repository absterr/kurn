import { z } from "zod";

export const leadsQuerySchema = z.object({
  keyword: z.string().min(1),
  location: z.string().optional(),
});
