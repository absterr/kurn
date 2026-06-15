import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvProvider } from "./config/env/env.provider";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = app.get(EnvProvider);
  const PORT = env.get("SERVER_PORT");

  await app.listen(PORT);
}
bootstrap();
