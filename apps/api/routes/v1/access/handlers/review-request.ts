import { randomBytes } from "node:crypto";
import { HTTPException } from "hono/http-exception";
import type { z } from "zod";
import { makeDB } from "@/db";
import { oneWeekFromNow } from "@/utils/date";
import type { reviewRequestSchema } from "../access.v1.schema";

export const reviewRequestHandler = async (
  data: z.infer<typeof reviewRequestSchema>,
  reviewerId: string,
) => {
  const { requestId, review } = data;

  const accessRequest = await makeDB()
    .selectFrom("accessRequests")
    .where("id", "=", requestId)
    .where("status", "=", "pending")
    .selectAll()
    .executeTakeFirst();

  if (!accessRequest)
    throw new HTTPException(404, {
      message: "Access request not found or has been reviewed",
    });

  await makeDB()
    .transaction()
    .execute(async (tx) => {
      await tx
        .updateTable("accessRequests")
        .where("id", "=", accessRequest.id)
        .set({ status: review, reviewedBy: reviewerId })
        .execute();

      await tx
        .insertInto("invites")
        .values({
          createdBy: reviewerId,
          accessRequestId: accessRequest.id,
          name: accessRequest.name,
          email: accessRequest.email,
          role: "member",
          token: randomBytes(32).toString("base64url"),
          expiresAt: oneWeekFromNow(),
        })
        .execute();

      // SEND INVITE EMAIL HERE
    });

  return {
    message: `Access request ${review}. ${review === "approved" && "An invite email has been sent"}`,
  };
};
