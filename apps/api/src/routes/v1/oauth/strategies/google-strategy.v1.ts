import { HTTPException } from "hono/http-exception";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import env from "@/config/env.js";
import { makeDB } from "@/db/index.js";

export default function v1GoogleStrategyInit() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/v1/oauth/callback/google",
        passReqToCallback: true,
      },
      async (req, _, __, profile, done) => {
        try {
          const role = req.query.state;
          if (role !== "member" && role !== "admin") {
            throw new HTTPException(400, { message: "Invalid role" });
          }

          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;

          if (!email) {
            throw new HTTPException(400, {
              message: "Google account has no accessible email",
            });
          }

          const existingUser = await makeDB()
            .selectFrom("users")
            .where("email", "=", email)
            .selectAll()
            .executeTakeFirst();

          if (existingUser) {
            const existingGoogleAccount = await makeDB()
              .selectFrom("accounts")
              .where("userId", "=", existingUser.id)
              .where("providerId", "=", "google")
              .where("accountId", "=", googleId)
              .where("role", "=", role)
              .selectAll()
              .executeTakeFirst();

            if (existingGoogleAccount) {
              return done(null, existingGoogleAccount);
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
                providerId: "google",
                userId: existingUser.id,
                accountId: googleId,
                role,
              })
              .returningAll()
              .executeTakeFirstOrThrow();

            return done(null, newAccount);
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
                  providerId: "google",
                  userId: user.id,
                  accountId: googleId,
                  role,
                })
                .returningAll()
                .executeTakeFirstOrThrow();
            });

          return done(null, newUserAccount);
        } catch (err) {
          return done(err, undefined);
        }
      },
    ),
  );
}
