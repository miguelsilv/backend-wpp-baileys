import { Module } from '@nestjs/common';
import { WhatsAppProvider } from './infra/providers/whatsapp/whatsapp.provider';
import { BaileysWhatsappProvider } from './infra/providers/whatsapp/baileys-whatsapp.provider';
import { MessageConsumer } from './application/consumers/message.consumer';

@Module({
  imports: [],
  controllers: [MessageConsumer],
  providers: [
    {
      provide: WhatsAppProvider,
      useClass: BaileysWhatsappProvider,
    }
  ],
})
export class AppModule { }
