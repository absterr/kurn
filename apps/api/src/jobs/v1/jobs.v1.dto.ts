import {
  IsArray,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

const LEVEL = [
  "Internship",
  "Entry level",
  "Associate",
  "Mid-Senior level",
  "Director",
  "Executive",
] as const;

const TIMEFRAME = [
  "Any time",
  "Past month",
  "Past week",
  "Past 24 hours",
] as const;

const WORK_TYPE = ["Remote", "On-site", "Hybrid"] as const;

export type Timeframe = (typeof TIMEFRAME)[number];
export type Level = (typeof LEVEL)[number];
export type WorkType = (typeof WORK_TYPE)[number];

export enum Interval {
  H6 = "6h",
  H12 = "12h",
  H24 = "24h",
}

export const INTERVAL_MS: Record<Interval, number> = {
  [Interval.H6]: 6 * 60 * 60 * 1000,
  [Interval.H12]: 12 * 60 * 60 * 1000,
  [Interval.H24]: 24 * 60 * 60 * 1000,
};

export class JobsV1Dto {
  @IsString()
  @MinLength(1)
  position: string;

  @IsString()
  @IsIn(TIMEFRAME)
  timeframe: Timeframe;

  @IsString()
  @IsEnum(Interval)
  interval: Interval;

  @IsArray()
  @IsString({ each: true })
  @IsIn(WORK_TYPE, { each: true })
  @IsOptional()
  workType: WorkType[];

  @IsArray()
  @IsString({ each: true })
  @IsIn(LEVEL, { each: true })
  @IsOptional()
  level: Level[];

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Time must be in HH:mm (24h) format",
  })
  startAt: string;
}
