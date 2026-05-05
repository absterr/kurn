import { IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class EnvironmentVariables {
  @IsUrl({
    require_tld: false,
  })
  WEB_ORIGIN: string;

  @IsNumber()
  @IsOptional()
  SERVER_PORT: number = 4000;

  @IsUrl({
    protocols: ["postgres", "postgresql"],
  })
  DATABASE_URL: string;

  @IsString()
  USER_GMAIL: string;

  @IsString()
  GOOGLE_REFRESH_TOKEN: string;

  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  GOOGLE_CLIENT_SECRET: string;
}
