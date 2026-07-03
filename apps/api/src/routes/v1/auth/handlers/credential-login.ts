import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { z } from "zod";
import { makeDB } from "@/db/index.js";
import { grantUserSession } from "@/lib/grant-session.js";
import { comparePassword } from "@/utils/hash.js";
import type { loginSchema } from "../auth.v1.schema.js";

export const credentialLoginHandler = async (
  ctx: Context,
  data: z.infer<typeof loginSchema>,
  userAgent: string | undefined,
) => {
  const { email, password, role } = data;

  const foundUser = await makeDB()
    .selectFrom("users")
    .where("email", "=", email)
    .selectAll()
    .executeTakeFirst();

  if (!foundUser)
    throw new HTTPException(401, { message: "Invalid email or password" });

  const userAccount = await makeDB()
    .selectFrom("accounts")
    .where("userId", "=", foundUser.id)
    .where("role", "=", role)
    .where("providerId", "=", "credential")
    .selectAll()
    .executeTakeFirst();

  if (!userAccount || !userAccount.password)
    throw new HTTPException(400, {
      message: "Account not found or password not set",
    });

  const isCorrectPassword = await comparePassword(
    password,
    userAccount.password,
  );

  if (!isCorrectPassword)
    throw new HTTPException(401, { message: "Invalid email or password" });

  await grantUserSession(ctx, userAccount, userAgent);
  return { message: "Login successful" };
};
