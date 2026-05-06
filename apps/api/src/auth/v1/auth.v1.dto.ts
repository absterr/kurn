import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from "class-validator";
import { IntersectionType, PickType } from "nestjs-mapped-types";
import Match from "src/utils/match-decorator";

class PasswordDto {
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @MaxLength(64, { message: "Password must not exceed 32 characters" })
  password: string;

  @IsString()
  @MinLength(8, { message: "Must contain at least 8 characters" })
  @MaxLength(64, { message: "Must not exceed 32 characters" })
  @Match("password", { message: "Passwords do not match" })
  confirmPassword: string;
}

class UserAgentDto {
  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class EmailDto {
  @IsEmail({}, { message: "A valid email is required" })
  @MinLength(6, { message: "A valid email is required" })
  email: string;
}

export class TokenDto {
  @IsString()
  @Length(64, 64, { message: "Invalid token" })
  token: string;
}

export class SignupDto extends IntersectionType(EmailDto, PasswordDto) {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MaxLength(64, { message: "Name must be less than 20 characters" })
  name: string;
}

export class LoginDto extends IntersectionType(
  EmailDto,
  PickType(PasswordDto, ["password"]),
  UserAgentDto,
) {}

export class VerifyEmailDto extends IntersectionType(TokenDto, UserAgentDto) {}

export class ResetPasswordDto extends IntersectionType(PasswordDto, TokenDto) {}
