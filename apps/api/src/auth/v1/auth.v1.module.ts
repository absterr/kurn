import { Module } from "@nestjs/common";
import { EnvProvider } from "src/config/env/env.provider";
import { DatabaseModule } from "src/db/db.module";
import { AuthCookieService } from "src/lib/cookie/cookie.service";
import { MailService } from "src/lib/mail/mail.service";
import { AuthController } from "./auth.v1.controller";
import { SignupService } from "./providers/signup.service";
import { VerifyEmailService } from "./providers/verify-email.service";

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    AuthCookieService,
    EnvProvider,
    MailService,
    SignupService,
    VerifyEmailService,
  ],
})
export class AuthModule {}
