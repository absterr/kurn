import { HTTPException } from "hono/http-exception";
import { makeDB } from "@/db";

export const validateRegisterTokenHandler = async (token: string) => {
  const invite = await makeDB()
    .selectFrom("invites")
    .where("token", "=", token)
    .where("status", "=", "pending")
    .where("expiresAt", ">", new Date())
    .selectAll()
    .executeTakeFirst();

  if (!invite)
    throw new HTTPException(401, { message: "Invalid or expired token" });

  return invite;
};
