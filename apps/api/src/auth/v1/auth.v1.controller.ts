import { Body, Controller, Post } from "@nestjs/common";
import { SignupDto } from "./auth.v1.dto";
import { SignupService } from "./providers/signup.service";

@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(private readonly signupService: SignupService) {}

  @Post("signup")
  async(@Body() dto: SignupDto) {
    return this.signupService.signup(dto);
  }
}
