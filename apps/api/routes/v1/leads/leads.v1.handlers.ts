import type { z } from "zod";
import { makeDB } from "@/db";
import type { leadsQuerySchema } from "./leads.v1.schema";

export const createLeadsQuery = async (
  queries: z.infer<typeof leadsQuerySchema>,
) => {
  const leadsQuery = await makeDB()
    .insertInto("leadQueries")
    .values(queries)
    .returningAll()
    .executeTakeFirstOrThrow();

  return leadsQuery;
};
