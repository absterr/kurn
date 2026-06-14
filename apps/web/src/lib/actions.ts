"use server";
import { z } from "zod";
import { APIError } from "./api-error";
import type { loginSchema } from "./validators";

const API_URL = process.env.API_URL;
const authResponseSchema = z.object({ message: z.string() });

export const loginUser = async (body: z.infer<typeof loginSchema>) => {
  try {
    const res = await fetch(`${API_URL}/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new APIError(errorData?.error ?? "Unable to login", res.status);
    }

    const data = await res.json();

    return { data: authResponseSchema.parse(data), error: null };
  } catch (err) {
    const data = null;

    if (err instanceof APIError) {
      return {
        data,
        error: err.message,
      };
    }
    if (err instanceof DOMException && err.name === "TimeoutError") {
      return {
        data,
        error: "Request timed out. Please try again.",
      };
    }

    return {
      data,
      error: "Network error. Please check your connection.",
    };
  }
};
