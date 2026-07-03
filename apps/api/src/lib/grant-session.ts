import type { Context } from "hono";
import type { Selectable } from "kysely";
import env from "@/config/env.js";
import { makeDB } from "@/db/index.js";
import type { Accounts } from "@/db/types.js";
import { oneWeekFromNow } from "@/utils/date.js";
import { setAuthCookies } from "./cookies.js";
import { signUserToken } from "./user-token.js";

export const grantUserSession = async (
  ctx: Context,
  account: Selectable<Accounts>,
  userAgent?: string,
) => {
  const session = await makeDB()
    .insertInto("sessions")
    .values({
      accountId: account.id,
      userAgent,
      expiresAt: oneWeekFromNow(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  const accessToken = signUserToken({
    payload: {
      accountId: session.accountId,
      role: account.role,
      sessionId: session.id,
      userId: account.userId,
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
};
