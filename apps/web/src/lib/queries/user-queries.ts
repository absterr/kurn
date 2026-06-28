import { z } from "zod";
import { USER_ROLE } from "@/app/(auth)/_Role/role-provider";
import { apiFetch, handleTanstackQueryError } from "../api";

const userDetailsSchema = z.object({
  name: z.string(),
  email: z.email().min(6),
  role: z.enum(USER_ROLE),
});

export const getUserDetailsHandler = async () => {
  try {
    const res = await apiFetch("/v1/session/user", { method: "GET" });
    const data = userDetailsSchema.parse(res);
    return data;
  } catch (err) {
    return handleTanstackQueryError(err);
  }
};
