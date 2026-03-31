import { IsString, MinLength } from "class-validator";

export class CrawlerDto {
  @IsString()
  @MinLength(1)
  website: string;
}
