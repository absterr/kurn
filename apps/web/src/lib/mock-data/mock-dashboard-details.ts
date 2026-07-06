import type { DashboardDetails } from "../schema/dashboard-schema";
import { mockLeadQueries } from "./mock-lead-queries";
import { mockLeads } from "./mock-leads";

export function getMockDashboardDetails(): DashboardDetails {
  const totalLeads = mockLeads.length;
  const reviewedLeads = mockLeads.filter((lead) => lead.reviewed).length;

  const processingQueries = mockLeadQueries.filter(
    (query) => query.status === "processing",
  ).length;

  const pendingQueries = mockLeadQueries.filter(
    (query) => query.status === "pending",
  ).length;

  const successfulQueries = mockLeadQueries.filter(
    (query) => query.status === "successful",
  ).length;

  const totalQueries = mockLeadQueries.length;

  return {
    totalLeads,
    reviewedLeads,

    processingQueries,
    pendingQueries,
    successfulQueries,

    successfulQueriesPercentage:
      totalQueries === 0 ? 0 : (successfulQueries / totalQueries) * 100,

    processingQueriesPercentage:
      totalQueries === 0 ? 0 : (processingQueries / totalQueries) * 100,

    pendingQueriesPercentage:
      totalQueries === 0 ? 0 : (pendingQueries / totalQueries) * 100,
  };
}
