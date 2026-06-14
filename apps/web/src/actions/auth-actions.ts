"use server";
import { z } from "zod";
import { apiFetch, handleFetchErrors } from "@/lib/api";
import type {
  loginSchema,
  passwordSchema,
  requestAccessSchema,
  tokenSchema,
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

export const registerHandler = async (
  body: z.infer<typeof passwordSchema>,
  token: z.infer<typeof tokenSchema>,
) => authPost(`/v1/auth/register?token=${token}`, body);

export const resetPasswordHandler = async (
  body: z.infer<typeof passwordSchema>,
  token: z.infer<typeof tokenSchema>,
) => authPost(`/v1/auth/reset-password?token=${token}`, body);
