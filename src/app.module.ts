import { Module } from '@nestjs/common';
import { MessagesModule } from './presentation/messages';
import { BullModule } from '@nestjs/bullmq';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { RMQ_KEY_MESSAGE_SERVICE, RMQ_QUEUE_NAME } from './application/constants/queue.const';
import { QueuesModule } from './infra/queues';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
      },
    }),
    MessagesModule,
  ],
})
export class AppModule { }
