import { Module } from '@nestjs/common';
import { MessagesModule } from './presentation/messages';
import { BullModule } from '@nestjs/bullmq';

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
