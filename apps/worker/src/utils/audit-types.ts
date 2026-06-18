export type ViewportName = "mobile" | "tablet" | "desktop";

export interface CoreWebVitals {
  ttfbMs: number | null;
  fcpMs: number | null;
  lcpMs: number | null;
  cls: number | null;
  inpMs: number | null;
}

export interface ConsoleIssue {
  type: "error" | "warning" | "uncaught-exception";
  text: string;
  location?: string;
}

export interface FailedRequest {
  url: string;
  failure: string | null;
  resourceType: string;
}

export interface ViewportAuditResult {
  viewport: ViewportName;
  screenshotPath: string;
  httpStatus: number | null;
  totalLoadTimeMs: number;
  vitals: CoreWebVitals;
  consoleIssues: ConsoleIssue[];
  failedRequests: FailedRequest[];
  error?: string;
}

export interface WebsiteAuditResult {
  auditedAt: string;
  viewports: ViewportAuditResult[];
}

export type AuditedLead = {
  companyName: string;
  mapLink: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  websiteReachable: boolean | null;
  emails: string[] | null;
  websiteAudits: WebsiteAuditResult | null;
};
