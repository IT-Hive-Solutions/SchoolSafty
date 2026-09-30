import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Enable CORS since the Next.js client might run on a different port during dev
  app.enableCors();

  await app.listen(process.env.PORT ?? 3001); // Changing to 3001 to avoid clash with Next.js default 3000
}
await bootstrap();
