import jwt, { type SignOptions, type VerifyOptions } from "jsonwebtoken";
import type { Selectable } from "kysely";
import type { Accounts, Sessions, Users } from "@/db/types";

interface TokenPayload {
  sessionId: Selectable<Sessions>["id"];
}

export interface AccessTokenPayload extends TokenPayload {
  accountId: Selectable<Accounts>["id"];
  role: Selectable<Accounts>["role"];
  userId: Selectable<Users>["id"];
}

export interface RefreshTokenPayload extends TokenPayload {
  version: Selectable<Sessions>["version"];
}

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
