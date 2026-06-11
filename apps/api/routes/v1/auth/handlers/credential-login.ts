import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { z } from "zod";
import env from "@/config/env";
import { makeDB } from "@/db";
import { setAuthCookies } from "@/lib/jwt";
import { signUserToken } from "@/lib/user-token";
import { oneWeekFromNow } from "@/utils/date";
import { comparePassword } from "@/utils/hash";
import type { loginSchema } from "../auth.v1.schema";

export const credentialLoginHandler = async (
  ctx: Context,
  data: z.infer<typeof loginSchema>,
) => {
  const { email, password, role, userAgent } = data;

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

  const session = await makeDB()
    .insertInto("sessions")
    .values({
      accountId: userAccount.id,
      userAgent,
      expiresAt: oneWeekFromNow(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  const accessToken = signUserToken({
    payload: {
      accountId: session.accountId,
      role: userAccount.role,
      sessionId: session.id,
      userId: foundUser.id,
    },
    options: { expiresIn: "15m" },
    secret: env.ACCESS_SECRET,
  });

  const refreshToken = signUserToken({
    payload: { sessionId: session.id, version: session.version },
    options: { expiresIn: "7d" },
    secret: env.REFRESH_SECRET,
  });

  setAuthCookies({ ctx, accessToken, refreshToken });
  return { userId: foundUser.id };
};
