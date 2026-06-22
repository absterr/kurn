import { type Selectable, sql } from "kysely";
import type { z } from "zod";
import { makeDB } from "@/db/index.js";
import type { Users } from "@/db/types.js";
import type { leadsQuerySchema } from "./leads.v1.schema.js";

export const getLeadQueries = async (memberId: Selectable<Users>["id"]) => {
  const leadQueries = await makeDB()
    .selectFrom("leadQueries")
    .leftJoin("leads", "leads.leadQueryId", "leadQueries.id")
    .where("userId", "=", memberId)
    .select([
      "leadQueries.id",
      "leadQueries.status",
      "leadQueries.keyword",
      "leadQueries.location",
      "leadQueries.createdAt",
      "leadQueries.updatedAt",
    ])
    .select(() => [sql<number>`count(leads.id)::int`.as("resultsCount")])
    .groupBy("leadQueries.id")
    .execute();

  return leadQueries;
};

export const addLeadQuery = async (
  queries: z.infer<typeof leadsQuerySchema>,
  memberId: Selectable<Users>["id"],
) => {
  const { userId, ...leadsQuery } = await makeDB()
    .insertInto("leadQueries")
    .values({ ...queries, userId: memberId })
    .returningAll()
    .executeTakeFirstOrThrow();

  return { ...leadsQuery, resultsCount: 0 };
};
