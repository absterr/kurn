import { sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./timestamps";
import { users } from "./users-schema";

export const accountRoleEnum = pgEnum("user_role", ["admin", "member"]);

export const verificationTypeEnum = pgEnum("verification_type", [
  "email_change",
  "password_reset",
]);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: varchar("account_id", { length: 255 }).notNull(),
    providerId: varchar("provider_id", { length: 255 }).notNull(),
    role: accountRoleEnum("role").notNull(),
    password: varchar("password", { length: 255 }),
    ...timestamps,
  },
  (t) => [
    unique("accounts_provider_id_account_id_role_unique").on(
      t.providerId,
      t.accountId,
      t.role,
    ),
  ],
);

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  version: integer("version").notNull().default(1),
  userAgent: varchar("user_agent", { length: 255 }),
  expiresAt: timestamp("expires_at").notNull(),
  ...timestamps,
});

export const verifications = pgTable("verifications", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountRole: accountRoleEnum("account_role").notNull(),
  verificationType: verificationTypeEnum("verification_type").notNull(),
  token: varchar("token", { length: 255 }).unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ...timestamps,
});
