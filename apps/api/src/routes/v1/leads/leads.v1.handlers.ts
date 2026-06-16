import type { Selectable } from "kysely";
import type { z } from "zod";
import { makeDB } from "@/db/index.js";
import type { Users } from "@/db/types.js";
import type { leadsQuerySchema } from "./leads.v1.schema.js";

export const createLeadsQuery = async (
  queries: z.infer<typeof leadsQuerySchema>,
  memberId: Selectable<Users>["id"],
) => {
  const leadsQuery = await makeDB()
    .insertInto("leadQueries")
    .values({ ...queries, userId: memberId })
    .returningAll()
    .executeTakeFirstOrThrow();

  return leadsQuery;
};
