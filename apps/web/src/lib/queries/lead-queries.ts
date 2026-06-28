import { apiFetch, handleTanstackQueryError } from "@/lib/api";
import {
  type LeadQueryForm,
  leadQuerySchema,
  leadSchema,
} from "../schema/lead-schema";

const API_LEADS_ROUTE = "/v1/leads" as const;

export const getLeadQueriesHandler = async () => {
  try {
    const res = await apiFetch(API_LEADS_ROUTE, { method: "GET" });
    const data = leadQuerySchema.array().parse(res);
    return data;
  } catch (err) {
    return handleTanstackQueryError(err);
  }
};

export const addLeadQueryHandler = async (body: LeadQueryForm) => {
  try {
    const res = await apiFetch(API_LEADS_ROUTE, { method: "POST", body });
    const data = leadQuerySchema.parse(res);
    return data;
  } catch (err) {
    return handleTanstackQueryError(err);
  }
};

export const getLeadsByQueryIdHandler = async (queryId: string) => {
  try {
    const res = await apiFetch(`${API_LEADS_ROUTE}/${queryId}`, {
      method: "GET",
    });
    const data = leadSchema.array().parse(res);
    return data;
  } catch (err) {
    return handleTanstackQueryError(err);
  }
};
