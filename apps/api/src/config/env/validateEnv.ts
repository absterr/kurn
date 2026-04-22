import { plainToInstance } from "class-transformer";
import { IsNumber, IsOptional, IsUrl, validateSync } from "class-validator";

export class EnvironmentVariables {
  @IsUrl({
    require_tld: false,
  })
  WEB_ORIGIN: string;

  @IsNumber()
  @IsOptional()
  SERVER_PORT: number = 4000;

  @IsUrl()
  DATABASE_URL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) throw new Error(errors.toString());
  return validatedConfig;
}
