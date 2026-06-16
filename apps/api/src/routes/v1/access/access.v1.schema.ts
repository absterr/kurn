import { z } from "zod";

const ACCESS_REQUEST_STATUSES = ["approved", "rejected"] as const;
const USER_ROLE = ["member", "admin"] as const;

const getIDSchema = () => z.uuid("Invalid ID");

export const revokeInviteSchema = z.object({
  inviteId: getIDSchema(),
});

export const reviewRequestSchema = z.object({
  requestId: getIDSchema(),
  review: z.enum(ACCESS_REQUEST_STATUSES, { error: "Invalid review status" }),
});

export const inviteSchema = z.object({
  name: z.string("Name is required"),
  email: z
    .email({ error: "Email is required" })
    .min(6, "A valid email is required"),
  roles: z
    .array(z.enum(USER_ROLE))
    .min(1, "At least one role is required")
    .max(2, "Maximum of two roles allowed")
    .refine(
      (roles) => new Set(roles).size === roles.length,
      "Duplicate roles are not allowed",
    ),
});
