import { Injectable } from '@nestjs/common';
import { Ctx, MessagePattern, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { WhatsAppProvider } from './providers/whatsapp/whatsapp.provider';
import { Message } from '@/core/domain/entities/message.entity';
import { RMQ_ROUTING_KEY } from '@/core/application/constants/queue.const';

@Injectable()
export class RMQMessageConsumer {
    constructor(
        private readonly whatsapp: WhatsAppProvider,
    ) { }

    @EventPattern(RMQ_ROUTING_KEY)
    async listenForMessages(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            await this.waitWhatsappConnection();
            console.log("Enviando mensagem para o whatsapp", data);
            await this.whatsapp.sendMessage(new Message(data));
            await channel.ack(originalMsg);
        } catch (error) {
            console.error("Falha na entrega da mensagem", error);
            await channel.nack(originalMsg);
        }
    }

    private async waitWhatsappConnection() {
        const maxAttempts = 10;
        let attempts = 0;

        while (!this.whatsapp.isConnected() && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }

        if (!this.whatsapp.isConnected()) {
            throw new Error('Whatsapp não está conectado');
        }
    }
}
