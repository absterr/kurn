import { sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  check,
  jsonb,
  pgEnum,
  pgTable,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./timestamps";
import { users } from "./user.tables";

const enumCheck = (column: AnyPgColumn, values: readonly string[]) =>
  sql`${column} IN (${sql.raw(values.map((v) => `'${v}'`).join(", "))})`;

export const leadQueueNameEnum = pgEnum("lead_queue_name", [
  "lead-search",
  "lead-audit",
  "lead-enrichment",
]);

export const leadQueueStatusEnum = pgEnum("lead_queue_status", [
  "pending",
  "audited",
  "auditing",
  "enriched",
  "enriching",
]);

const leadQueryStatuses = [
  "cancelled",
  "completed",
  "failed",
  "exhausted",
  "paused",
  "pending",
  "processing",
  "successful",
] as const;

export const leadQueries = pgTable(
  "lead_queries",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    keyword: varchar("keyword", { length: 255 }).notNull(),
    location: varchar("location", { length: 255 }).notNull(),
    status: varchar("status", { length: 255 }).notNull().default("pending"),
    ...timestamps,
  },
  (table) => [
    check(
      "lead_query_status_check",
      enumCheck(table.status, leadQueryStatuses),
    ),
    uniqueIndex("lead_queries_user_keyword_location_idx").on(
      table.userId,
      table.keyword,
      table.location,
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
    unique("leads_query_map_link_unique").on(table.mapLink, table.leadQueryId),
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

export const leadQueue = pgTable("lead_queue", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  leadQueryId: uuid("lead_query_id")
    .notNull()
    .references(() => leadQueries.id, { onDelete: "cascade" }),
  name: leadQueueNameEnum("queue_name").notNull(),
  status: leadQueueStatusEnum("queue_status").notNull().default("pending"),
  payload: jsonb("payload").notNull(),
  ...timestamps,
});
