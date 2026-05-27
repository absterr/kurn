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
import { LoginDto, SignupDto } from "./auth.v1.dto";
import { LoginService } from "./providers/login.service";
import { LogoutService } from "./providers/logout.service";
import { SignupService } from "./providers/signup.service";
import { VerifyEmailService } from "./providers/verify-email.service";

@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(
    private readonly signupService: SignupService,
    private readonly loginService: LoginService,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly logoutService: LogoutService,
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

  @Post("login")
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: LoginDto,
  ) {
    const userAgent = req.get("user-agent");
    return this.loginService.login(res, dto, userAgent);
  }

  // PROTECT THIS ROUTE LATER
  @Get("logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    return this.logoutService.logout(req, res);
  }
}
