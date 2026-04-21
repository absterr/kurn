import { IsIn, IsString, MinLength } from "class-validator";
import type { Timeframe } from "src/lib/types";

export class JobsDto {
  @IsString()
  @MinLength(1)
  position: string;

  @IsString()
  @IsIn(["Any time", "Past month", "Past week", "Past 24 hours"])
  timeframe: Timeframe;
}
