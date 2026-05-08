import { randomBytes } from "node:crypto";
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { addDays, addWeeks } from "date-fns";
import { Response } from "express";
import { Kysely } from "kysely";
import { EnvProvider } from "src/config/env/env.provider";
import { KYSELY_DB } from "src/db/db.module";
import { DB } from "src/db/types";
import { AuthCookieService } from "src/lib/cookie/cookie.service";
import { MailService } from "src/lib/mail/mail.service";
import { comparePassword } from "src/utils/hash";
import { signUserToken } from "src/utils/user-token";
import { LoginDto } from "../auth.v1.dto";

@Injectable()
export class LoginService {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly env: EnvProvider,
    private readonly authCookieService: AuthCookieService,
    private readonly mailService: MailService,
  ) {}

  private async sendVerificationEmail(userId: string, email: string) {
    const expiresAt = addDays(new Date(), 1);
    const verificationToken = randomBytes(32).toString("hex");

    await this.db
      .insertInto("verifications")
      .values({
        userId,
        verificationType: "email_verification",
        value: verificationToken,
        expiresAt,
      })
      .execute();

    const url = `${this.env.get("WEB_ORIGIN")}/verify-email?token=${verificationToken}`;

    // SHOULD DEFINITELY USE EMAIL TEMPLATE FOR THIS

    await this.mailService.sendMail(
      email,
      "Email verification",
      `Please verify your email by clicking on this link: ${url}`,
    );
  }

  async login(res: Response, dto: LoginDto, userAgent: string | undefined) {
    try {
      const user = await this.db
        .selectFrom("users")
        .where("email", "=", dto.email)
        .select(["id", "emailVerified"])
        .executeTakeFirst();

      if (!user) {
        throw new NotFoundException("Invalid email or password");
      }

      if (!user.emailVerified) {
        const emailVerifcation = await this.db
          .selectFrom("verifications")
          .where("userId", "=", user.id)
          .where("verificationType", "=", "email_verification")
          .executeTakeFirst();

        if (!emailVerifcation) {
          await this.sendVerificationEmail(user.id, dto.email);
        }

        throw new ForbiddenException(
          "Email not verified, please check your inbox for the verification link.",
        );
      }

      const userAccount = await this.db
        .selectFrom("accounts")
        .where("userId", "=", user.id)
        .select(["password", "providerId"])
        .executeTakeFirstOrThrow();

      if (!userAccount.password) {
        throw new BadRequestException(
          "Account does not support credential login",
        );
      }

      const isCorrectPassword = await comparePassword(
        dto.password,
        userAccount.password,
      );

      if (!isCorrectPassword) {
        throw new UnauthorizedException("Invalid email or password");
      }

      const session = await this.db
        .insertInto("sessions")
        .values({
          userId: user.id,
          userAgent,
          expiresAt: addWeeks(new Date(), 2),
        })
        .returning("id")
        .executeTakeFirstOrThrow();

      const accessToken = signUserToken({
        payload: { userId: user.id, sessionId: session.id },
        options: { expiresIn: "15m" },
        secret: this.env.get("ACCESS_SECRET"),
      });
      const refreshToken = signUserToken({
        payload: { sessionId: session.id },
        options: { expiresIn: "14d" },
        secret: this.env.get("REFRESH_SECRET"),
      });

      this.authCookieService.setAuthCookies(res, accessToken, refreshToken);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
