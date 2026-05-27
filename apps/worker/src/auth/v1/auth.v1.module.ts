import { Module } from "@nestjs/common";
import { EnvProvider } from "@/config/env/env.provider";
import { DatabaseModule } from "@/db/db.module";
import { AuthCookieService } from "@/lib/cookie/cookie.service";
import { MailService } from "@/lib/mail/mail.service";
import { AuthController } from "./auth.v1.controller";
import { LoginService } from "./providers/login.service";
import { LogoutService } from "./providers/logout.service";
import { SignupService } from "./providers/signup.service";
import { VerifyEmailService } from "./providers/verify-email.service";

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    AuthCookieService,
    EnvProvider,
    LoginService,
    LogoutService,
    MailService,
    SignupService,
    VerifyEmailService,
  ],
})
export class AuthModule {}
