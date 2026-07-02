import { z } from "zod";

export const generatedEmailSchema = z.object({
  subject: z.string(),
  body: z.string(),
});

export const generatedAuditSchema = z.object({
  auditDiagnosis: z.array(z.string()),
});
