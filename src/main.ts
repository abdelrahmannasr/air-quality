import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { Constants } from './data';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap', { timestamp: true });
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle(Constants.API_TITLE)
    .setDescription(Constants.API_DESCRIPTION)
    .setVersion(Constants.API_VERSION)
    .addTag(Constants.API_TAG)
    .build();
  const options: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, options);

  await app.listen(Constants.PORT);
  logger.log(`Application 🚀 listening on port ${Constants.PORT}`);
}
bootstrap();
