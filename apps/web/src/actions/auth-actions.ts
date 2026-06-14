"use server";
import { z } from "zod";
import { apiFetch, handleFetchErrors } from "@/lib/api";
import type {
  loginSchema,
  requestAccessSchema,
  userDetailsSchema,
} from "@/lib/schema/auth-schema";

const authResponseSchema = z.object({ message: z.string() });

const authPost = async <T>(url: string, body: T) => {
  try {
    const res = await apiFetch<T>(url, {
      method: "POST",
      body,
    });

    const data = authResponseSchema.parse(res);

    return { data, error: null };
  } catch (err) {
    return handleFetchErrors(err);
  }
};

export const loginHandler = async (body: z.infer<typeof loginSchema>) =>
  authPost("/v1/auth/login", body);

export const forgotPasswordHandler = async (
  body: z.infer<typeof userDetailsSchema>,
) => authPost("/v1/auth/forgot-password", body);

export const requestAccessHandler = async (
  body: z.infer<typeof requestAccessSchema>,
) => authPost("/v1/auth/request-access", body);
