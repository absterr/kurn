import { plainToInstance } from "class-transformer";
import { IsNumber, IsOptional, IsUrl, validateSync } from "class-validator";

class EnvironmentVariables {
  @IsUrl({
    require_tld: false,
  })
  WEB_ORIGIN: string;

  @IsNumber()
  @IsOptional()
  SERVER_PORT: number = 4000;
}

export function validate(config: Record<string, string>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) throw new Error(errors.toString());
  return validatedConfig;
}
