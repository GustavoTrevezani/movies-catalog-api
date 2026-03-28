import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: "http://localhost:3001",
  });
  await app.listen(3000);
}
bootstrap();
