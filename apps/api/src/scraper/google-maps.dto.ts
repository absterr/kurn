import { IsString, MinLength } from "class-validator";

export class GoogleMapsDto {
  @IsString()
  @MinLength(1)
  keyword: string;

  @IsString()
  @MinLength(1)
  location: string;
}
