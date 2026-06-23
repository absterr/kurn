import { z } from "zod";

// const leadQueryStatuses = [
//   "cancelled",
//   "completed",
//   "failed",
//   "exhausted",
//   "paused",
//   "pending",
//   "processing",
//   "successful",
// ] as const;

const dateSchema = {
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
};

export const leadQueryFormSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
  location: z.string().min(1, "Location is required"),
});

export const leadQuerySchema = leadQueryFormSchema.extend({
  id: z.uuid(),
  status: z.string(),
  resultsCount: z.number().int().nonnegative(),
  ...dateSchema,
});

export const leadSchema = z.object({
  id: z.uuid(),
  leadQueryId: z.uuid(),
  companyName: z.string(),
  mapLink: z.string(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  websiteReachable: z.boolean().nullable(),
  auditDiagnosis: z.array(z.string()).nullable(),
  emails: z.array(z.string()).nullable(),
  emailDraft: z
    .object({
      subject: z.string(),
      body: z.string(),
    })
    .nullable(),
  reviewed: z.boolean(),
  ...dateSchema,
});

export type LeadQuery = z.infer<typeof leadQuerySchema>;
export type LeadQueryForm = z.infer<typeof leadQueryFormSchema>;
export type Lead = z.infer<typeof leadSchema>;
