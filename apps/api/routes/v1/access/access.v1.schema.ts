import { z } from "zod";

const ACCESS_REQUEST_STATUSES = ["approved", "rejected"] as const;

export const reviewRequestSchema = z.object({
  requestId: z.uuid("Invalid request ID"),
  review: z.enum(ACCESS_REQUEST_STATUSES, { error: "Invalid review status" }),
});
