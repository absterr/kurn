import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { SignupDto } from "./auth.v1.dto";
import { SignupService } from "./providers/signup.service";
import { VerifyEmailService } from "./providers/verify-email.service";

@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(
    private readonly signupService: SignupService,
    private readonly verifyEmailService: VerifyEmailService,
  ) {}

  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignupDto) {
    return this.signupService.signup(dto);
  }

  @Get("verify-email")
  async verifyEmail(
    @Req() req: Request,
    @Res() res: Response,
    @Query("token") token: string,
  ) {
    const userAgent = req.get("user-agent");
    return this.verifyEmailService.verifyEmail(res, token, userAgent);
  }
}
