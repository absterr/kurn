import type { IncomingMessage } from "node:http";
import { HTTPException } from "hono/http-exception";
import { getQueryParam } from "hono/utils/url";
import passport from "passport";
import { Strategy as GithubStrategy, type Profile } from "passport-github2";
import env from "@/config/env.js";
import { CALLBACK_URL_PREFIX, getAccount } from "./get-account.js";

export default function v1GithubStrategyInit() {
  passport.use(
    new GithubStrategy(
      {
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: `${CALLBACK_URL_PREFIX}/github`,
        passReqToCallback: true,
      },
      async (
        req: IncomingMessage,
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: (err: unknown, user: unknown) => void,
      ) => {
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
              message: "Github account has no accessible email",
            });
          }

          const userAccount = await getAccount({
            provider: "github",
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
