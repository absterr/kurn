import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./timestamps";
import { userRoleEnum, users } from "./users-schema";

export const accessRequestStatusEnum = pgEnum("access_request_status", [
  "pending",
  "approved",
  "rejected",
]);

export const inviteStatusEnum = pgEnum("invite_status", [
  "pending",
  "accepted",
  "revoked",
  "expired",
]);

export const accessRequests = pgTable(
  "access_requests",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    requestStatus: accessRequestStatusEnum("status")
      .notNull()
      .default("pending"),
    reviewedBy: uuid("reviewed_by").references(() => users.id),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("access_requests_email_active_idx")
      .on(table.email)
      .where(sql`status != 'rejected'`),
  ],
);

export const invites = pgTable("invites", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  accessRequestId: uuid("access_request_id").references(
    () => accessRequests.id,
    { onDelete: "cascade" },
  ),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  roles: userRoleEnum("roles")
    .array()
    .notNull()
    .default(sql`ARRAY['member']::user_role[]`),
  token: varchar("token", { length: 255 }).notNull().unique(),
  status: inviteStatusEnum("status").notNull().default("pending"),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  ...timestamps,
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
