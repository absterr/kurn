import { apiFetch, handleFetchErrors } from "../api";
import { dashboardDetailsSchema } from "../schema/dashboard-schema";

export const getDashboardDetailsHandler = async () => {
  try {
    const res = await apiFetch("/v1/dashboard", { method: "GET" });
    const data = dashboardDetailsSchema.parse(res);
    return { data, error: null };
  } catch (err) {
    return handleFetchErrors(err);
  }
};
