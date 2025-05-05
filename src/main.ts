import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Включаем CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // Для cookies
  });
  
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();