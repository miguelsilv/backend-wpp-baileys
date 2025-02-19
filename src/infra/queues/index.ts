import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MessageProducer } from './producers/message.producer';
import { BULL_QUEUE_NAME, RMQ_KEY_MESSAGE_SERVICE, RMQ_QUEUE_NAME } from '../../application/constants/queue.const';
import { RMQMessageConsumer } from './consumers/rmq-message.consumer';
import { RabbitMQProducer } from './producers/rmq-message.producer';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { WhatsAppProvider } from 'src/common/providers/whatsapp/whatsapp.provider';
import { BaileysWhatsappProvider } from 'src/common/providers/whatsapp/baileys-whatsapp.provider';
import { MessageConsumer } from './consumers/message.consumer';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: RMQ_KEY_MESSAGE_SERVICE,
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
                    queue: RMQ_QUEUE_NAME,
                    queueOptions: {
                        durable: true,
                    },
                },
            },
        ]),
        BullModule.registerQueue({
            name: BULL_QUEUE_NAME,
        }),
    ],
    providers: [
        MessageProducer,
        RabbitMQProducer,
        RMQMessageConsumer,
        MessageConsumer,
        {
            provide: WhatsAppProvider,
            useClass: BaileysWhatsappProvider,
        }
    ],
    exports: [MessageProducer],
})
export class QueuesModule { }
