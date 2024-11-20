import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import basicAuth from "express-basic-auth";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );
  app.enableCors();

  app.use(
    "/api",
    basicAuth({
      users: { admin: "admin123" },
      challenge: true,
    })
  );
  const config = new DocumentBuilder()
    .setTitle("API Documentation")
    .setDescription("The API documentation for the project")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      "access_token"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
