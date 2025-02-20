import { Module } from '@nestjs/common';
import { WhatsAppProvider } from './infra/providers/whatsapp/whatsapp.provider';
import { BaileysWhatsappProvider } from './infra/providers/whatsapp/baileys-whatsapp.provider';
import { MessageConsumer } from './application/consumers/message.consumer';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
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
    }
  ],
})
export class AppModule { }
