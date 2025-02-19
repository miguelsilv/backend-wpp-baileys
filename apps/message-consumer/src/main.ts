import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  console.log('RABBITMQ_URL', process.env.RABBITMQ_URL);
  
  const maxRetries = 5;
  const retryDelay = 5000; // 5 segundos
  let currentRetry = 0;

  while (currentRetry < maxRetries) {
    try {
      const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'message_queue',
          noAck: false,
          queueOptions: {
            durable: true
          },
        },
      });

      await app.listen();
      console.log('Sucesso ao conectar no RabbitMQ');
      return;
    } catch (error) {
      currentRetry++;
      console.log(`Falha ao conectar no RabbitMQ. Tentativa ${currentRetry} de ${maxRetries}`);
      if (currentRetry === maxRetries) {
        console.error('Maximo de tentativas atingido. Saindo...');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

bootstrap();
