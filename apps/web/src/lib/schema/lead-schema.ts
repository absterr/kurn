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
  ...dateSchema,
});

export const leadQueryArraySchema = z.array(
  leadQuerySchema.extend({
    resultsCount: z.number().int().nonnegative(),
  }),
);

export type LeadQueryForm = z.infer<typeof leadQueryFormSchema>;

export const leadSchema = z.object({
  id: z.uuid(),
  leadQueryId: z.uuid(),
  companyName: z.string(),
  mapLink: z.string(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  websiteReachable: z.boolean().optional(),
  auditDiagnosis: z.array(z.string()).optional(),
  emails: z.array(z.string()).optional(),
  emailDraft: z
    .object({
      subject: z.string(),
      body: z.string(),
    })
    .optional(),
  reviewed: z.boolean(),
  ...dateSchema,
});
