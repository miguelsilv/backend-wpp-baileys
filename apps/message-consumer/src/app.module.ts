import { Module } from '@nestjs/common';
import { WhatsAppProvider } from './infra/providers/whatsapp/whatsapp.provider';
import { BaileysWhatsappProvider } from './infra/providers/whatsapp/baileys-whatsapp.provider';
import { MessageConsumer } from './application/consumers/message.consumer';
import { LoggerModule } from 'nestjs-pino';
import { SentryModule } from "@sentry/nestjs/setup";
import { APP_FILTER } from "@nestjs/core";
import { SentryGlobalFilter } from "@sentry/nestjs/setup";

@Module({
  imports: [
    SentryModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production' 
          ? { target: 'pino-pretty' } 
          : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        formatters: {
          level: (label) => ({ level: label }),
        },
      },
    }),
  ],
  controllers: [MessageConsumer],
  providers: [
    {
      provide: WhatsAppProvider,
      useClass: BaileysWhatsappProvider,
    },
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule { }
