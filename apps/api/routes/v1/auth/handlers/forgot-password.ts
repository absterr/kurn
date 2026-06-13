import { HTTPException } from "hono/http-exception";
import type { z } from "zod";
import env from "@/config/env";
import { makeDB } from "@/db";
import { sendEmail } from "@/lib/sendEmail";
import { fifteenMinsFromNow } from "@/utils/date";
import { PASSWORD_RESET_TEMPLATE } from "@/utils/email-templates";
import { generateToken } from "@/utils/hash";
import type { userDetailsSchema } from "../auth.v1.schema";

export const forgotPasswordHandler = async (
  data: z.infer<typeof userDetailsSchema>,
) => {
  const { email, role } = data;

  await makeDB()
    .transaction()
    .execute(async (tx) => {
      const userInfo = await tx
        .selectFrom("users")
        .innerJoin("accounts", "accounts.userId", "userId")
        .where("users.email", "=", email)
        .where("role", "=", role)
        .select(["users.email"])
        .select(["accounts.userId", "accounts.role"])
        .executeTakeFirst();

      if (!userInfo) {
        throw new HTTPException(404, { message: "User not found" });
      }

      await tx
        .updateTable("verifications")
        .where("userId", "=", userInfo.userId)
        .where("verificationType", "=", "password_reset")
        .where("expiresAt", ">", new Date())
        .set({ expiresAt: new Date() })
        .execute();

      const token = generateToken();
      await tx
        .insertInto("verifications")
        .values({
          userId: userInfo.userId,
          verificationType: "password_reset",
          token,
          accountRole: role,
          expiresAt: fifteenMinsFromNow(),
        })
        .execute();

      const resetPasswordUrl = `${env.WEB_ORIGIN}/reset-password?token=${token}`;
      await sendEmail({
        to: email,
        subject: "You're invited to join Kurn",
        html: PASSWORD_RESET_TEMPLATE(resetPasswordUrl),
      });
    });

  return { message: "Password reset link sent to your email" };
};
