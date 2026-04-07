import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("/api");
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors({
    origin: [process.env.WEB_URL],
    method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
