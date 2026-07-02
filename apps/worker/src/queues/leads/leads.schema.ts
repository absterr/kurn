import { z } from "zod";

const viewportNameSchema = z.enum(["mobile", "tablet", "desktop"]);
export type ViewportName = z.infer<typeof viewportNameSchema>;

const coreWebVitalsSchema = z.object({
  ttfbMs: z.number().nullable(),
  fcpMs: z.number().nullable(),
  lcpMs: z.number().nullable(),
  cls: z.number().nullable(),
  inpMs: z.number().nullable(),
});

const consoleIssueSchema = z.object({
  type: z.enum(["error", "warning", "uncaught-exception"]),
  text: z.string(),
  location: z.string().optional(),
});

const failedRequestSchema = z.object({
  url: z.string(),
  failure: z.string().nullable(),
  resourceType: z.string(),
});

const viewportAuditResultSchema = z.object({
  viewport: viewportNameSchema,
  screenshotPath: z.string(),
  httpStatus: z.number().nullable(),
  totalLoadTimeMs: z.number(),
  vitals: coreWebVitalsSchema,
  consoleIssues: z.array(consoleIssueSchema),
  failedRequests: z.array(failedRequestSchema),
  error: z.string().optional(),
});

export const websiteAuditResultSchema = z.object({
  auditedAt: z.string(),
  viewports: z.array(viewportAuditResultSchema),
});

const leadSchema = z.object({
  companyName: z.string().min(1),
  mapLink: z.string().min(1),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
});

export const auditedLeadSchema = leadSchema.extend({
  websiteReachable: z.boolean().nullable(),
  emails: z.array(z.string()).nullable(),
  websiteAudits: websiteAuditResultSchema.nullable(),
});

export const leadArrSchema = z.array(leadSchema);

export type CoreWebVitals = z.infer<typeof coreWebVitalsSchema>;
export type ConsoleIssue = z.infer<typeof consoleIssueSchema>;
export type FailedRequest = z.infer<typeof failedRequestSchema>;
export type ViewportAuditResult = z.infer<typeof viewportAuditResultSchema>;
export type WebsiteAuditResult = z.infer<typeof websiteAuditResultSchema>;
export type Lead = z.infer<typeof leadSchema>;
export type AuditedLead = z.infer<typeof auditedLeadSchema>;
