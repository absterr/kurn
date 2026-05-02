import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/db/db.module";
import { AuthController } from "./auth.v1.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
})
export class AuthModule {}
