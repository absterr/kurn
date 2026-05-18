import { IsOptional, IsString, MinLength } from "class-validator";

export class LeadsV1Dto {
  @IsString()
  @MinLength(1)
  keyword: string;

  @IsString()
  @IsOptional()
  location: string;
}
