import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200', // Allow requests from the Angular frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,               // Strips away properties that aren't in the DTO
    forbidNonWhitelisted: true,    // Throws an error if unknown properties are sent
    transform: true,               // Automatically transforms payloads to DTO instances
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
