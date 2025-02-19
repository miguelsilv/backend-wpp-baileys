import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Message } from '../../../domain/entities/message.entity';
import { RMQ_KEY_MESSAGE_SERVICE, RMQ_ROUTING_KEY } from '../../../application/constants/queue.const';

@Injectable()
export class RabbitMQProducer {

    constructor(@Inject(RMQ_KEY_MESSAGE_SERVICE) private readonly client: ClientProxy) { }

    async publishEvent(message: Message) {
        this.client.emit(RMQ_ROUTING_KEY, message);
    }
}
