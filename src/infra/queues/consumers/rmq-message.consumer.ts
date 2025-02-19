import { Injectable } from '@nestjs/common';
import { WhatsAppProvider } from '../../../common/providers/whatsapp/whatsapp.provider';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Message } from '../../../domain/entities/message.entity';
import { RMQ_ROUTING_KEY } from 'src/application/constants/queue.const';

@Injectable()
export class RMQMessageConsumer {
    constructor(
        private readonly whatsapp: WhatsAppProvider,
    ) { }

    @MessagePattern(RMQ_ROUTING_KEY)
    async listenForMessages(@Payload() data: Message, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        await this.whatsapp.sendMessage(data);
        await channel.ack(originalMsg);
    }
}
