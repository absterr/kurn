import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { addWeeks } from "date-fns";
import { Response } from "express";
import { Kysely } from "kysely";
import { EnvProvider } from "src/config/env/env.provider";
import { KYSELY_DB } from "src/db/db.module";
import { DB } from "src/db/types";
import { AuthCookieService } from "src/lib/cookie/cookie.service";
import { signUserToken } from "src/utils/user-token";

@Injectable()
export class VerifyEmailService {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly env: EnvProvider,
    private readonly authCookieService: AuthCookieService,
  ) {}

  async verifyEmail(
    res: Response,
    verificationToken: string,
    userAgent: string | undefined,
  ) {
    try {
      const emailVerification = await this.db
        .selectFrom("verifications")
        .where("verificationType", "=", "email_verification")
        .where("verificationType", "=", verificationToken)
        .where("expiresAt", ">=", new Date())
        .select(["id", "userId"])
        .executeTakeFirst();

      if (!emailVerification) {
        throw new UnauthorizedException(
          "Invalid or expired verification token",
        );
      }

      const session = await this.db.transaction().execute(async (tx) => {
        await tx
          .updateTable("users")
          .set({ emailVerified: true })
          .where("id", "=", emailVerification.userId)
          .execute();

        await tx
          .deleteFrom("verifications")
          .where("id", "=", emailVerification.id)
          .execute();

        const session = await tx
          .insertInto("sessions")
          .values({
            userId: emailVerification.userId,
            userAgent,
            expiresAt: addWeeks(new Date(), 2),
          })
          .returning("id")
          .executeTakeFirstOrThrow();

        return session;
      });

      const accessToken = signUserToken({
        payload: { userId: emailVerification.userId, sessionId: session.id },
        options: { expiresIn: "15m" },
        secret: this.env.get("ACCESS_SECRET"),
      });
      const refreshToken = signUserToken({
        payload: { sessionId: session.id },
        options: { expiresIn: "14d" },
        secret: this.env.get("REFRESH_SECRET"),
      });

      return this.authCookieService.setAuthCookies(
        res,
        accessToken,
        refreshToken,
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
