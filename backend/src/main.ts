import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL || process.env.APP_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Receipt Details Extractor API V1')
    .setDescription('API for extracting data from receipt images')
    .setVersion('1.0')
    .addTag('Data-Extractor')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? process.env.APP_API_PORT);
}
bootstrap();
