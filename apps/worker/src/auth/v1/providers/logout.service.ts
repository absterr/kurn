import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";
import { Kysely } from "kysely";
import { EnvProvider } from "@/config/env/env.provider";
import { KYSELY_DB } from "@/db/db.module";
import { DB } from "@/db/types";
import { AuthCookieService } from "@/lib/cookie/cookie.service";
import { AccessTokenPayload, verifyUserToken } from "@/utils/user-token";

@Injectable()
export class LogoutService {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly env: EnvProvider,
    private readonly authCookieService: AuthCookieService,
  ) {}

  async logout(req: Request, res: Response) {
    const accessToken = req.cookies.accessToken as string;

    const { payload } = verifyUserToken<AccessTokenPayload>({
      token: accessToken,
      secret: this.env.get("ACCESS_SECRET"),
    });

    if (!payload) {
      throw new UnauthorizedException("Invalid access token");
    }

    await this.db
      .deleteFrom("sessions")
      .where("id", "=", payload.sessionId)
      .execute();

    return this.authCookieService.clearAuthCookies(res);
  }
}
