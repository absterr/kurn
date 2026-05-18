import {
  IsArray,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

const EXPERIENCE_LEVEL = [
  "Internship",
  "Entry level",
  "Associate",
  "Mid-Senior level",
  "Director",
  "Executive",
] as const;

const TIMEFRAME_POSTED = [
  "Any time",
  "Past month",
  "Past week",
  "Past 24 hours",
] as const;

const WORKPLACE_TYPE = ["Remote", "On-site", "Hybrid"] as const;

export type TimeframePosted = (typeof TIMEFRAME_POSTED)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVEL)[number];
export type WorkplaceType = (typeof WORKPLACE_TYPE)[number];

export enum CronInterval {
  H6 = "6h",
  H12 = "12h",
  H24 = "24h",
}

export class JobsV1Dto {
  // @IsUUID()
  // userId: string;

  @IsString()
  @MinLength(1)
  position: string;

  @IsString()
  @IsIn(TIMEFRAME_POSTED)
  timeframePosted: TimeframePosted;

  @IsString()
  @IsEnum(CronInterval)
  cronInterval: CronInterval;

  @IsArray()
  @IsString({ each: true })
  @IsIn(WORKPLACE_TYPE, { each: true })
  @IsOptional()
  workplaceType: WorkplaceType[];

  @IsArray()
  @IsString({ each: true })
  @IsIn(EXPERIENCE_LEVEL, { each: true })
  @IsOptional()
  experienceLevel: ExperienceLevel[];

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Time must be in HH:mm (24h) format",
  })
  startAt: string;
}
