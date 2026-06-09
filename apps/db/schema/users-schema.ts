import { sql } from "drizzle-orm";
import { boolean, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./timestamps";

export const userRoleEnum = pgEnum("user_role", ["admin", "member"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(true),
  roles: userRoleEnum("roles")
    .array()
    .notNull()
    .default(sql`ARRAY['member']::user_role[]`),
  ...timestamps,
});
