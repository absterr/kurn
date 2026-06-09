import { HTTPException } from "hono/http-exception";
import type { z } from "zod";
import { makeDB } from "@/db";
import type { reviewRequestSchema } from "../admin.v1.schema";

export const reviewRequestHandler = async (
  data: z.infer<typeof reviewRequestSchema>,
) => {
  const { requestId, review } = data;

  const accessRequest = await makeDB()
    .selectFrom("accessRequests")
    .where("id", "=", requestId)
    .selectAll()
    .executeTakeFirst();

  if (!accessRequest)
    throw new HTTPException(404, { message: "Access request not found" });

  if (accessRequest.status !== "pending")
    throw new HTTPException(409, {
      message: "Access request has been reviewed",
    });

  /*
  IN A SINGLE TRANSACTION
  1. Update the access_request status and reviewed_by
  2. Create an invite
  3. Send an email
  */

  return { message: `Access request ${review}` };
};
