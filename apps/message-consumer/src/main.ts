import "./instrument";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import rabbitMQConfig from './infra/config/rabbitmq.config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule, 
    rabbitMQConfig()
  );
  
  const logger = app.get(Logger);
  app.useLogger(logger);
  
  try {
    await app.listen();
    logger.log('Microservice is listening');
  } catch (error) {
    logger.error('Failed to start microservice', error);
    process.exit(1);
  }
}

bootstrap();
