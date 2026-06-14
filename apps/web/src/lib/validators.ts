import { z } from "zod";

const getEmailSchema = () =>
  z.email({ error: "Email is required" }).min(6, "A valid email is required");

const getPasswordSchema = (errorMessage: string) =>
  z
    .string({ error: errorMessage })
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must not exceed 64 characters");

export const loginFormSchema = z.object({
  email: getEmailSchema(),
  password: getPasswordSchema("Password is required"),
});
