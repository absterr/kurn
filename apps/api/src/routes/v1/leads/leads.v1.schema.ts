import { z } from "zod";

export const leadsQuerySchema = z.object({
  keyword: z.string().min(1),
  location: z.string().min(1),
});

export const leadQueryIdSchema = z.object({
  queryId: z.uuid(),
});
