import { IsString, MinLength } from "class-validator";

export class JobsDto {
  @IsString()
  @MinLength(1)
  position: string;
}
