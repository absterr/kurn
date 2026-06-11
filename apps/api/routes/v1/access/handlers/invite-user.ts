import { randomBytes } from "node:crypto";
import { HTTPException } from "hono/http-exception";
import type { Selectable } from "kysely";
import type { z } from "zod";
import { makeDB } from "@/db";
import type { Users } from "@/db/types";
import { oneWeekFromNow } from "@/utils/date";
import type { inviteSchema } from "../access.v1.schema";

export const inviteUserHandler = async (
  data: z.infer<typeof inviteSchema>,
  inviterId: Selectable<Users>["id"],
) => {
  const { name, email, roles } = data;

  const acceptedInvites = await makeDB()
    .selectFrom("invites")
    .where("email", "=", email)
    .where("status", "=", "accepted")
    .where("role", "in", roles)
    .selectAll()
    .execute();

  if (acceptedInvites.length > 0) {
    const conflictingRoles = acceptedInvites.map((i) => i.role).join(", ");
    throw new HTTPException(409, {
      message: `Invite already accepted for: ${conflictingRoles}`,
    });
  }

  const existingUserAccounts = await makeDB()
    .selectFrom("users")
    .innerJoin("accounts", "accounts.userId", "users.id")
    .where("users.email", "=", email)
    .where("accounts.role", "in", roles)
    .select(["users.email"])
    .select([
      "accounts.id as accountId",
      "accounts.userId",
      "accounts.providerId",
      "accounts.role",
    ])
    .execute();

  if (existingUserAccounts.length > 0) {
    const conflictingRoles = existingUserAccounts.map((a) => a.role).join(", ");
    throw new HTTPException(409, {
      message: `User already has an account with these roles: ${conflictingRoles}`,
    });
  }

  await makeDB()
    .transaction()
    .execute(async (tx) => {
      await tx
        .updateTable("invites")
        .where("email", "=", email)
        .where("status", "=", "pending")
        .where("role", "in", roles)
        .where("expiresAt", ">", new Date())
        .set({ status: "revoked" })
        .execute();

      for (const role of roles) {
        await tx
          .insertInto("invites")
          .values({
            createdBy: inviterId,
            name,
            email,
            role,
            token: randomBytes(32).toString("base64url"),
            expiresAt: oneWeekFromNow(),
          })
          .execute();

        // SEND INVITE EMAIL HERE
      }
    });

  return { message: "Invite email sent" };
};
