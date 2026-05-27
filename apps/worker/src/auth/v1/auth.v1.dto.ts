import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { IntersectionType, PickType } from "nestjs-mapped-types";
import Match from "@/utils/match-decorator";

export class PasswordDto {
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

export class EmailDto {
  @IsEmail({}, { message: "A valid email is required" })
  @MinLength(6, { message: "A valid email is required" })
  email: string;
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
) {}
