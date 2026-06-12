import { is } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import * as schema from "../schema";

export const tableNames = Object.values(schema).filter(
  (table) => is(table, PgTable) && "updatedAt" in table,
);
