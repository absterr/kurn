import { sql } from "drizzle-orm";
import { boolean, jsonb, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./timestamps";

type LeadQueryStatus =
  | "cancelled"
  | "completed"
  | "failed"
  | "partial"
  | "paused"
  | "pending"
  | "processing"
  | "successful";
type LeadCompletionStatus =
  | "cancelled"
  | "completed"
  | "failed"
  | "partial"
  | "paused"
  | "pending"
  | "processing";

type EmailDraft = {
  subject: string;
  body: string;
};

export const leadQueries = pgTable("lead_queries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  keyword: varchar("keyword", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  status: varchar("status", { length: 255 })
    .notNull()
    .default("pending")
    .$type<LeadQueryStatus>(),
  ...timestamps,
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  leadQueryId: uuid("lead_query_id")
    .notNull()
    .references(() => leadQueries.id, { onDelete: "cascade" }),
  completionStatus: varchar("completion_status", { length: 255 })
    .notNull()
    .default("pending")
    .$type<LeadCompletionStatus>(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  mapLink: varchar("map_link", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  website: varchar("website", { length: 255 }),
  websiteReachable: boolean("website_reachable"),
  emails: varchar("emails", { length: 255 }).array(),
  auditDiagnosis: varchar("audit_diagnosis", { length: 255 }).array(),
  emailDraft: jsonb("email_draft").$type<EmailDraft>(),
  ...timestamps,
});
