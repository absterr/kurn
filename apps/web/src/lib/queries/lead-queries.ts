import { apiFetch, handleFetchErrors } from "@/lib/api";
import { type LeadQueryForm, leadQuerySchema } from "../schema/lead-schema";

const apiLeadsRoute = "/v1/leads" as const;

export const addLeadQueryHandler = async (body: LeadQueryForm) => {
  try {
    const res = await apiFetch(apiLeadsRoute, { method: "POST", body });
    const data = leadQuerySchema.parse(res);

    return { data, error: null };
  } catch (err) {
    return handleFetchErrors(err);
  }
};
