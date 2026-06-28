import { z } from "zod";
import { USER_ROLE } from "@/app/(auth)/_Role/role-provider";
import { apiFetch, handleFetchErrors, handleTanstackQueryError } from "../api";

const API_SESSION_ROUTE = "/v1/session" as const;

const userDetailsSchema = z.object({
  name: z.string(),
  email: z.email().min(6),
  role: z.enum(USER_ROLE),
});

export const getUserDetailsHandler = async () => {
  try {
    const res = await apiFetch(`${API_SESSION_ROUTE}/user`, { method: "GET" });
    const data = userDetailsSchema.parse(res);
    return data;
  } catch (err) {
    return handleTanstackQueryError(err);
  }
};

export const logoutHandler = async () => {
  try {
    const res = await apiFetch(`${API_SESSION_ROUTE}/logout`, {
      method: "GET",
    });
    return { data: res, error: null };
  } catch (err) {
    return handleFetchErrors(err);
  }
};
