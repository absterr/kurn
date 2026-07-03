import { HTTPException } from "hono/http-exception";
import { makeDB } from "@/db/index.js";
import type { UserRole } from "@/db/types.js";

interface OAuthStrategyProps {
  provider: string;
  name: string;
  email: string;
  accountId: string;
  role: UserRole;
}

export const CALLBACK_URL_PREFIX = "/api/v1/oauth/callback" as const;

export const getAccount = async ({
  provider,
  name,
  email,
  accountId,
  role,
}: OAuthStrategyProps) => {
  const existingUser = await makeDB()
    .selectFrom("users")
    .where("email", "=", email)
    .selectAll()
    .executeTakeFirst();

  if (existingUser) {
    const existingGoogleAccount = await makeDB()
      .selectFrom("accounts")
      .where("userId", "=", existingUser.id)
      .where("providerId", "=", provider)
      .where("accountId", "=", accountId)
      .where("role", "=", role)
      .selectAll()
      .executeTakeFirst();

    if (existingGoogleAccount) {
      return existingGoogleAccount;
    }

    const userAccounts = await makeDB()
      .selectFrom("accounts")
      .where("userId", "=", existingUser.id)
      .where("role", "=", role)
      .selectAll()
      .executeTakeFirst();

    if (!userAccounts) {
      const invite = await makeDB()
        .selectFrom("invites")
        .where("email", "=", email)
        .where("role", "=", role)
        .where("expiresAt", ">", new Date())
        .selectAll()
        .executeTakeFirst();

      if (!invite) {
        throw new HTTPException(403, {
          message: `User does not have ${role} access`,
        });
      }
    }

    const newAccount = await makeDB()
      .insertInto("accounts")
      .values({
        providerId: provider,
        userId: existingUser.id,
        accountId,
        role,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return newAccount;
  }

  const invite = await makeDB()
    .selectFrom("invites")
    .where("email", "=", email)
    .where("role", "=", role)
    .where("expiresAt", ">", new Date())
    .selectAll()
    .executeTakeFirst();

  if (!invite) {
    throw new HTTPException(401, {
      message: "No valid invitation found for this email.",
    });
  }

  const newUserAccount = await makeDB()
    .transaction()
    .execute(async (tx) => {
      const user = await tx
        .insertInto("users")
        .values({
          name,
          email,
          emailVerified: true,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return tx
        .insertInto("accounts")
        .values({
          providerId: provider,
          userId: user.id,
          accountId,
          role,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    });

  return newUserAccount;
};
