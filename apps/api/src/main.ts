import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { EnvProvider } from "./config/env/env.provider";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const env = app.get(EnvProvider);
  const PORT = env.get("SERVER_PORT");
  const WEB_ORIGIN = env.get("WEB_ORIGIN");

  const corsOptions = {
    origin: [WEB_ORIGIN],
    method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  };

  app.use(cookieParser(env.get("COOKIE_SECRET")));
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("/api");
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors(corsOptions);

  await app.listen(PORT);
}
bootstrap();
