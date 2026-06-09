import { HTTPException } from "hono/http-exception";
import type { z } from "zod";
import { makeDB } from "@/db";
import type { tokenSchema } from "../auth.v1.schema";

export const validateRegisterTokenHandler = async (
  data: z.infer<typeof tokenSchema>,
) => {
  const { token } = data;

  const invite = await makeDB()
    .selectFrom("invites")
    .where("token", "=", token)
    .where("status", "=", "pending")
    .selectAll()
    .executeTakeFirst();

  if (!invite)
    throw new HTTPException(401, { message: "Invalid or expired token" });

  return invite;
};
