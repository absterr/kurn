import { IsNumber, IsOptional, IsUrl } from "class-validator";

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
}
