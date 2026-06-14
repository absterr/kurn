import { z } from "zod";
import { USER_ROLE } from "@/app/(auth)/_Role/role-provider";

const TOKEN_LENGTH = 43;

const getEmailSchema = () =>
  z.email({ error: "Email is required" }).min(6, "A valid email is required");

const getPasswordSchema = (errorMessage: string) =>
  z
    .string({ error: errorMessage })
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must not exceed 64 characters");

export const userDetailsSchema = z.object({
  email: getEmailSchema(),
  role: z.enum(USER_ROLE, { error: "Role is required" }),
});

export const loginSchema = userDetailsSchema.extend({
  password: getPasswordSchema("Password is required"),
});

export const requestAccessSchema = z.object({
  name: z.string({ error: "Name is required" }),
  email: getEmailSchema(),
});

export const passwordSchema = z
  .object({
    password: getPasswordSchema("Password is required"),
    confirmPassword: getPasswordSchema("This field is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const tokenSchema = z.object({
  token: z
    .string()
    .length(TOKEN_LENGTH)
    .regex(/^[A-Za-z0-9_-]+$/, "Invalid token"),
});
