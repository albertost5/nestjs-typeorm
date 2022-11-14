import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();
  
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 3001;
  
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
    
  console.log('NODE ENV: ', process.env.NODE_ENV);
  
  logger.log(`Listening on port: ${PORT}`, 'NestApplication');
}
bootstrap();
