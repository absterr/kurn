import { HTTPException } from "hono/http-exception";
import type { z } from "zod";
import { makeDB } from "@/db";
import { hashPassword } from "@/utils/hash";
import type { passwordSchema, tokenSchema } from "../auth.v1.schema";

export const credentialRegisterHandler = async (
  queryParam: z.infer<typeof tokenSchema>,
  body: z.infer<typeof passwordSchema>,
) => {
  const { token } = queryParam;
  const { password } = body;

  const invite = await makeDB()
    .selectFrom("invites")
    .where("token", "=", token)
    .where("status", "=", "pending")
    .selectAll()
    .executeTakeFirst();

  if (!invite)
    throw new HTTPException(401, { message: "Invalid or expired token" });

  await makeDB()
    .transaction()
    .execute(async (tx) => {
      const newUser = await tx
        .insertInto("users")
        .values({
          name: invite.name,
          email: invite.email,
          roles: [invite.role],
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
          providerId: "CREDENTIAL",
          role: invite.role,
        })
        .execute();
    });

  return { message: "Account created successfully. Please log in." };
};
