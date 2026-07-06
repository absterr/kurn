import { sql } from "kysely";
import { makeDB } from "@/db/index.js";

export const getDashboardDetails = async (memberId: string) => {
  const result = await makeDB()
    .selectFrom("leadQueries")
    .leftJoin("leads", "leadQueries.id", "leads.leadQueryId")
    .where("leadQueries.userId", "=", memberId)
    .select((_eb) => [
      sql<number>`count(leads.id)`.as("totalLeads"),

      sql<number>`
        count(*) filter (where leads.reviewed = true)
      `.as("reviewedLeads"),

      sql<number>`
        count(distinct leadQueries.id)
        filter (where leadQueries.status = 'processing')
      `.as("processingQueries"),

      sql<number>`
        count(distinct leadQueries.id)
        filter (where leadQueries.status = 'pending')
      `.as("pendingQueries"),

      sql<number>`
        count(distinct leadQueries.id)
        filter (where leadQueries.status = 'successful')
      `.as("successfulQueries"),

      sql<number>`count(distinct leadQueries.id)`.as("totalQueries"),
    ])
    .executeTakeFirstOrThrow();

  const totalQueries = result.totalQueries || 0;

  return {
    totalLeads: result.totalLeads,
    reviewedLeads: result.reviewedLeads,

    processingQueries: result.processingQueries,
    pendingQueries: result.pendingQueries,
    successfulQueries: result.successfulQueries,

    successfulQueriesPercentage:
      totalQueries === 0 ? 0 : (result.successfulQueries / totalQueries) * 100,

    processingQueriesPercentage:
      totalQueries === 0 ? 0 : (result.processingQueries / totalQueries) * 100,

    pendingQueriesPercentage:
      totalQueries === 0 ? 0 : (result.pendingQueries / totalQueries) * 100,
  };
};
