"use server";
import { z } from "zod";
import { apiFetch, handleFetchErrors } from "@/lib/api";
import type { loginSchema, userDetailsSchema } from "@/lib/schema/auth-schema";

const authResponseSchema = z.object({ message: z.string() });

export const loginHandler = async (body: z.infer<typeof loginSchema>) => {
  try {
    const res = await apiFetch<typeof body>("/v1/auth/login", {
      method: "POST",
      body,
    });

    const data = authResponseSchema.parse(res);
    return { data, error: null };
  } catch (err) {
    return handleFetchErrors(err);
  }
};

export const forgotPasswordHandler = async (
  body: z.infer<typeof userDetailsSchema>,
) => {
  try {
    const res = await apiFetch<typeof body>("/v1/auth/forgot-password", {
      method: "POST",
      body,
    });

    const data = authResponseSchema.parse(res);
    return { data, error: null };
  } catch (err) {
    return handleFetchErrors(err);
  }
};
