import { HTTPException } from "hono/http-exception";
import type { z } from "zod";
import env from "@/config/env.js";
import { makeDB } from "@/db/index.js";
import { sendEmail } from "@/lib/sendEmail.js";
import { oneWeekFromNow } from "@/utils/date.js";
import { INVITATION_TEMPLATE } from "@/utils/email-templates.js";
import { generateToken } from "@/utils/hash.js";
import type { reviewRequestSchema } from "../access.v1.schema.js";

export const reviewRequestHandler = async (
  data: z.infer<typeof reviewRequestSchema>,
  reviewerId: string,
) => {
  const { requestId, review } = data;

  await makeDB()
    .transaction()
    .execute(async (tx) => {
      const accessRequest = await tx
        .selectFrom("accessRequests")
        .where("id", "=", requestId)
        .where("status", "=", "pending")
        .selectAll()
        .executeTakeFirst();

      if (!accessRequest)
        throw new HTTPException(404, {
          message: "Access request not found or has been reviewed",
        });

      await tx
        .updateTable("accessRequests")
        .where("id", "=", accessRequest.id)
        .set({ status: review, reviewedBy: reviewerId })
        .execute();

      const token = generateToken();
      await tx
        .insertInto("invites")
        .values({
          createdBy: reviewerId,
          accessRequestId: accessRequest.id,
          name: accessRequest.name,
          email: accessRequest.email,
          token,
          role: "member",
          expiresAt: oneWeekFromNow(),
        })
        .execute();

      const url = `${env.WEB_ORIGIN}/invite?token=${token}`;
      await sendEmail({
        to: accessRequest.email,
        subject: "You're invited to join Kurn",
        html: INVITATION_TEMPLATE({
          url,
          name: accessRequest.name,
          role: "member",
        }),
      });
    });

  return {
    message: `Access request ${review}. ${review === "approved" && "An invite email has been sent"}`,
  };
};
