import { HTTPException } from "hono/http-exception";
import { makeDB } from "@/db/index.js";
import { hashPassword } from "@/utils/hash.js";

export const resetPasswordHandler = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  const hashedPassword = await hashPassword(password);

  await makeDB()
    .transaction()
    .execute(async (tx) => {
      const passwordResetVerification = await tx
        .selectFrom("verifications")
        .innerJoin("users", "verifications.userId", "users.id")
        .where("verificationType", "=", "password_reset")
        .where("token", "=", token)
        .where("expiresAt", ">", new Date())
        .selectAll()
        .executeTakeFirst();

      if (!passwordResetVerification) {
        throw new HTTPException(401, { message: "Invalid or expired token" });
      }

      const existingCredentialAccount = await tx
        .selectFrom("accounts")
        .where("userId", "=", passwordResetVerification.userId)
        .where("providerId", "=", "credential")
        .where("role", "=", passwordResetVerification.accountRole)
        .select(["id"])
        .executeTakeFirst();

      if (existingCredentialAccount) {
        await tx
          .updateTable("accounts")
          .where("id", "=", existingCredentialAccount.id)
          .set({
            password: hashedPassword,
          })
          .execute();
      } else {
        await tx
          .insertInto("accounts")
          .values({
            userId: passwordResetVerification.userId,
            accountId: passwordResetVerification.email,
            providerId: "credential",
            role: passwordResetVerification.accountRole,
            password: hashedPassword,
          })
          .execute();
      }

      await tx
        .updateTable("verifications")
        .where("verificationType", "=", "password_reset")
        .where("token", "=", token)
        .set({ expiresAt: new Date() })
        .execute();
    });

  return { message: "Password reset successful" };
};
