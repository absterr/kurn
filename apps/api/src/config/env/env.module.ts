import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvProvider } from "./env.provider";
import validate from "./validate";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
  ],
  providers: [EnvProvider],
  exports: [EnvProvider],
})
export class EnvModule {}
