import { HTTPException } from "hono/http-exception";
import { type Selectable, sql } from "kysely";
import { DatabaseError } from "pg";
import type { z } from "zod";
import { makeDB } from "@/db/index.js";
import type { Users } from "@/db/types.js";
import type { leadsQuerySchema } from "./leads.v1.schema.js";

const UNIQUE_VIOLATION = "23505" as const;

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
  try {
    const { userId, ...leadsQuery } = await makeDB()
      .insertInto("leadQueries")
      .values({ ...queries, userId: memberId })
      .returningAll()
      .executeTakeFirstOrThrow();

    return { ...leadsQuery, resultsCount: 0 };
  } catch (err) {
    if (err instanceof DatabaseError && err.code === UNIQUE_VIOLATION) {
      throw new HTTPException(409, {
        message: "Query with this keyword and location already exists",
      });
    }

    throw err;
  }
};

export const getLeadsByQueryId = async (queryId: string) => {
  const leads = await makeDB()
    .selectFrom("leads")
    .where("leadQueryId", "=", queryId)
    .selectAll()
    .execute();

  return leads;
};
