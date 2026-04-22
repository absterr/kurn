import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "./validateEnv";

@Injectable()
export class EnvProvider {
  constructor(private configService: ConfigService<EnvironmentVariables>) {}

  get<T extends keyof EnvironmentVariables>(key: T) {
    const value = this.configService.get(key, { infer: true });
    if (value === undefined) {
      throw new Error(`Config error: ${key} is undefined`);
    }

    return value;
  }
}
