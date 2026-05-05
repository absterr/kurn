import { Module } from "@nestjs/common";
import { EnvModule } from "src/config/env/env.module";
import { MailService } from "./mail.service";

@Module({
  imports: [EnvModule],
  providers: [MailService],
})
export class MailModule {}
