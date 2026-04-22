import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get("SERVER_PORT");
  const WEB_ORIGIN = configService.get("WEB_ORIGIN");

  const corsOptions = {
    origin: [WEB_ORIGIN],
    method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  };

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("/api");
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors(corsOptions);

  await app.listen(PORT);
}
bootstrap();
