import { Module } from "@nestjs/common";
import { EnvProvider } from "src/config/env/env.provider";
import { DatabaseModule } from "src/db/db.module";
import { MailService } from "src/lib/mail/mail.service";
import { AuthController } from "./auth.v1.controller";
import { SignupService } from "./providers/signup.service";

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [SignupService, MailService, EnvProvider],
})
export class AuthModule {}
