import { IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class EnvironmentVariables {
  @IsString()
  NODE_ENV: "development" | "production";

  @IsNumber()
  @IsOptional()
  SERVER_PORT: number = 4000;

  @IsUrl({
    protocols: ["postgres", "postgresql"],
  })
  DATABASE_URL: string;

  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number = 6379;

  @IsString()
  USER_GMAIL: string;

  @IsString()
  GOOGLE_REFRESH_TOKEN: string;

  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  GEMINI_API_KEY: string;
}
