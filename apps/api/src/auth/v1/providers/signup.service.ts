import { randomBytes } from "node:crypto";
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { addDays } from "date-fns";
import { Kysely } from "kysely";
import { EnvProvider } from "src/config/env/env.provider";
import { KYSELY_DB } from "src/db/db.module";
import { DB } from "src/db/types";
import { MailService } from "src/lib/mail/mail.service";
import { EMAIL_VERIFICATION_TEMPLATE } from "src/utils/email-templates";
import { hashPassword } from "src/utils/hash";
import { SignupDto } from "../auth.v1.dto";

@Injectable()
export class SignupService {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private readonly env: EnvProvider,
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

    await this.mailService.sendMail(
      email,
      "Email verification",
      EMAIL_VERIFICATION_TEMPLATE(url),
    );
  }

  async signup(dto: SignupDto) {
    const { name, email, password } = dto;

    try {
      const existingUser = await this.db
        .selectFrom("users")
        .where("email", "=", email)
        .select(["id", "emailVerified"])
        .executeTakeFirst();

      if (existingUser) {
        if (existingUser.emailVerified) {
          throw new ConflictException("A user with this email already exists");
        }

        const emailVerifcation = await this.db
          .selectFrom("verifications")
          .where("userId", "=", existingUser.id)
          .where("verificationType", "=", "email_verification")
          .executeTakeFirst();

        if (emailVerifcation) {
          throw new ConflictException(
            "An email verification link has already been sent",
          );
        }

        await this.sendVerificationEmail(existingUser.id, email);
        return {
          message:
            "An email verification link has been sent to your email. Please check your inbox.",
        };
      }

      await this.db.transaction().execute(async (tx) => {
        const { id: userId } = await tx
          .insertInto("users")
          .values({ name, email })
          .returning("id")
          .executeTakeFirstOrThrow();

        const hashedPassword = await hashPassword(password);

        await tx
          .insertInto("accounts")
          .values({
            providerId: "credential",
            userId,
            password: hashedPassword,
          })
          .execute();

        await this.sendVerificationEmail(userId, email);

        return {
          message:
            "An email verification link has been sent to your email. Please check your inbox.",
        };
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
