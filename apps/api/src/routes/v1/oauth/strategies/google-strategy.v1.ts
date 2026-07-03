import { HTTPException } from "hono/http-exception";
import { getQueryParam } from "hono/utils/url";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import env from "@/config/env.js";
import { CALLBACK_URL_PREFIX, getAccount } from "./get-account.js";

export default function v1GoogleStrategyInit() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${CALLBACK_URL_PREFIX}/google`,
        passReqToCallback: true,
      },
      async (req, _, __, profile, done) => {
        try {
          const role = getQueryParam(req.url ?? "", "state");
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

          const userAccount = await getAccount({
            provider: "google",
            name,
            email,
            accountId: googleId,
            role,
          });

          return done(null, userAccount);
        } catch (err) {
          return done(err, undefined);
        }
      },
    ),
  );
}
