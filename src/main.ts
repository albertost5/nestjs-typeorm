import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3001;
  
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);

  logger.log(`Listening on port: ${PORT}`, 'NestApplication')
}
bootstrap();
