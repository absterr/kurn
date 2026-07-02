import type { Selectable } from "kysely";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import env from "@/config/env.js";
import { makeDB } from "@/db/index.js";
import type { Users } from "@/db/types.js";

export default function googleStrategyInit() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/callback/google",
      },
      async (_, __, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;

          if (!email) {
            throw new Error("Google account has no accessible email");
          }

          let user: Selectable<Users>;
          const existingUser = await makeDB()
            .selectFrom("users")
            .where("email", "=", email)
            .selectAll()
            .executeTakeFirst();
          const existingAccounts = existingUser
            ? await makeDB()
                .selectFrom("accounts")
                .where("userId", "=", existingUser.id)
                .where("accountId", "=", googleId)
                .where("providerId", "=", "google")
                .selectAll()
                .execute()
            : [];

          const hasGoogleAccount = existingAccounts.length > 0;

          if (existingUser && hasGoogleAccount) {
            user = existingUser;
          } else {
            if (existingUser && !hasGoogleAccount) {
              const accounts = await makeDB()
                .selectFrom("accounts")
                .where("userId", "=", existingUser.id)
                .select(["role"])
                .execute();

              const roles = accounts.map((a) => a.role);

              await makeDB()
                .insertInto("accounts")
                .values(
                  roles.map((role) => ({
                    providerId: "google",
                    userId: existingUser.id,
                    accountId: googleId,
                    role,
                  })),
                )
                .execute();

              user = existingUser;
            } else {
              const invites = await makeDB()
                .selectFrom("invites")
                .where("email", "=", email)
                .where("expiresAt", ">", new Date())
                .selectAll()
                .execute();
              const roles = invites.map((i) => i.role);

              if (invites.length > 0) {
                const newUser = await makeDB()
                  .transaction()
                  .execute(async (tx) => {
                    const newUser = await tx
                      .insertInto("users")
                      .values({
                        name,
                        email,
                        emailVerified: true,
                      })
                      .returningAll()
                      .executeTakeFirstOrThrow();

                    await tx
                      .insertInto("accounts")
                      .values(
                        roles.map((role) => ({
                          providerId: "google",
                          userId: newUser.id,
                          accountId: googleId,
                          role,
                        })),
                      )
                      .execute();

                    return newUser;
                  });

                user = newUser;
              } else {
                throw new Error("No valid invitation found for this email.");
              }
            }
          }

          return done(null, user);
        } catch (err) {
          return done(err, undefined);
        }
      },
    ),
  );
}
