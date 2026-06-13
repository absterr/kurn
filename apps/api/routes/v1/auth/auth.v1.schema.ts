import { email, string, z } from "zod";

const USER_ROLE = ["member", "admin"] as const;

const getEmailSchema = () =>
  email({ error: "Email is required" }).min(6, "A valid email is required");

const getPasswordSchema = (errorMessage: string) =>
  string({ error: errorMessage })
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must not exceed 64 characters");

export const userDetailsSchema = z.object({
  email: getEmailSchema(),
  role: z.enum(USER_ROLE, { error: "Role is required" }),
});

export const accessRequestSchema = z.object({
  name: z.string({ error: "Name is required" }),
  email: getEmailSchema(),
});

export const loginSchema = userDetailsSchema.extend({
  password: getPasswordSchema("Password is required"),
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
  token: z.string(),
});
