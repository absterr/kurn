import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { Sessions, Users } from "src/db/types";

export type AccessTokenPayload = {
  userId: Users["id"];
  sessionId: Sessions["id"];
};

export type RefreshTokenPayload = {
  sessionId: Sessions["id"];
};

export const signUserToken = ({
  payload,
  options,
  secret,
}: {
  payload: AccessTokenPayload | RefreshTokenPayload;
  options: SignOptions;
  secret: string;
}) => jwt.sign(payload, secret, { ...options, audience: ["user"] });

export const verifyUserToken = <T extends object>({
  token,
  options,
  secret,
}: {
  token: string;
  options?: VerifyOptions;
  secret: string;
}) => {
  try {
    const payload = jwt.verify(token, secret, {
      ...options,
      audience: ["user"],
    }) as T;

    return { payload };
  } catch (error) {
    return { error };
  }
};
