import { HTTPException } from "hono/http-exception";
import type { Selectable } from "kysely";
import type { z } from "zod";
import { makeDB } from "@/db";
import type { Users } from "@/db/types";
import type { revokeInviteSchema } from "../access.v1.schema";

export const revokeInviteHandler = async (
  data: z.infer<typeof revokeInviteSchema>,
  reviewerId: Selectable<Users>["id"],
) => {
  const { inviteId } = data;

  const result = await makeDB()
    .updateTable("invites")
    .set({ status: "revoked", revokedBy: reviewerId })
    .where("id", "=", inviteId)
    .where("status", "=", "pending")
    .where("expiresAt", ">", new Date())
    .executeTakeFirst();

  if (!result.numUpdatedRows) {
    throw new HTTPException(404, {
      message: "Invite not found or already terminated",
    });
  }

  return {
    message: "Invite revoked successfully",
  };
};
