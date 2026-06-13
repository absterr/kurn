import { HTTPException } from "hono/http-exception";
import { makeDB } from "@/db";
import { hashPassword } from "@/utils/hash";

export const credentialRegisterHandler = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  await makeDB()
    .transaction()
    .execute(async (tx) => {
      const invite = await tx
        .selectFrom("invites")
        .where("token", "=", token)
        .where("status", "=", "pending")
        .where("expiresAt", ">", new Date())
        .selectAll()
        .executeTakeFirst();

      if (!invite) {
        throw new HTTPException(401, { message: "Invalid or expired token" });
      }

      const newUser = await tx
        .insertInto("users")
        .values({
          name: invite.name,
          email: invite.email,
        })
        .returning(["id"])
        .executeTakeFirstOrThrow();

      const hashedPassword = await hashPassword(password);

      await tx
        .insertInto("accounts")
        .values({
          userId: newUser.id,
          password: hashedPassword,
          accountId: newUser.id,
          providerId: "credential",
          role: invite.role,
        })
        .execute();

      await tx
        .updateTable("invites")
        .set({ status: "accepted", expiresAt: new Date() })
        .where("id", "=", invite.id)
        .where("token", "=", token)
        .execute();
    });

  return { message: "Account created successfully. Please log in." };
};
