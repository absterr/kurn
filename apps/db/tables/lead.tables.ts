import { sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  check,
  jsonb,
  pgEnum,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./timestamps";
import { users } from "./user.tables";

const enumCheck = (column: AnyPgColumn, values: readonly string[]) =>
  sql`${column} IN (${sql.raw(values.map((v) => `'${v}'`).join(", "))})`;

const leadQueryStatuses = [
  "cancelled",
  "completed",
  "failed",
  "partial",
  "paused",
  "pending",
  "processing",
  "successful",
] as const;

export const leadCompletionStatus = pgEnum("lead_completion_status", [
  "completed",
  "partial",
]);

export const leadQueries = pgTable(
  "lead_queries",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    keyword: varchar("keyword", { length: 255 }).notNull(),
    location: varchar("location", { length: 255 }),
    status: varchar("status", { length: 255 }).notNull().default("pending"),
    ...timestamps,
  },
  (table) => [
    check(
      "lead_query_status_check",
      enumCheck(table.status, leadQueryStatuses),
    ),
  ],
);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    leadQueryId: uuid("lead_query_id")
      .notNull()
      .references(() => leadQueries.id, { onDelete: "cascade" }),
    completionStatus: leadCompletionStatus("completion_status")
      .notNull()
      .default("partial"),
    reviewed: boolean("reviewed").notNull().default(false),
    companyName: varchar("company_name", { length: 255 }).notNull(),
    mapLink: varchar("map_link", { length: 255 }).notNull(),
    address: varchar("address", { length: 255 }),
    phone: varchar("phone", { length: 255 }),
    website: varchar("website", { length: 255 }),
    websiteReachable: boolean("website_reachable"),
    emails: varchar("emails", { length: 255 }).array(),
    auditDiagnosis: varchar("audit_diagnosis", { length: 255 }).array(),
    emailDraft: jsonb("email_draft").notNull(),
    ...timestamps,
  },
  (table) => [
    check(
      "email_draft_check",
      sql`
        jsonb_typeof(${table.emailDraft}) = 'object'
        AND ${table.emailDraft} ? 'subject'
        AND ${table.emailDraft} ? 'body'
      `,
    ),
  ],
);
