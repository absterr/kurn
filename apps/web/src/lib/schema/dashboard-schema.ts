import { z } from "zod";

export const dashboardDetailsSchema = z.object({
  totalLeads: z.number(),
  reviewedLeads: z.number(),

  successfulQueries: z.number(),
  processingQueries: z.number(),
  pendingQueries: z.number(),

  successfulQueriesPercentage: z.number(),
  processingQueriesPercentage: z.number(),
  pendingQueriesPercentage: z.number(),
});

export type DashboardDetails = z.infer<typeof dashboardDetailsSchema>;
