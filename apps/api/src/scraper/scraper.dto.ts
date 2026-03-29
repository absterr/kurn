import { IsString, MinLength } from "class-validator";

export class LeadsDto {
  @IsString()
  @MinLength(1)
  keyword: string;

  @IsString()
  @MinLength(1)
  location: string;
}
