import { Module } from '@nestjs/common';
import { WhatsAppProvider } from './providers/whatsapp/whatsapp.provider';
import { BaileysWhatsappProvider } from './providers/whatsapp/baileys-whatsapp.provider';
import { RMQMessageConsumer } from './rmq-message.consumer';

@Module({
  imports: [],
  controllers: [RMQMessageConsumer],
  providers: [
    {
      provide: WhatsAppProvider,
      useClass: BaileysWhatsappProvider,
    }
  ],
})
export class AppModule { }
