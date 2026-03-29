import { IsString, MinLength } from "class-validator";

export class LinkedInDto {
  @IsString()
  @MinLength(1)
  keyword: string;

  @IsString()
  @MinLength(1)
  location: string;
}
