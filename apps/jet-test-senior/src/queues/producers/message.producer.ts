import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Message } from '../../../../core/domain/entities/message.entity';
import { BULL_JOB_SEND_MESSAGE, BULL_QUEUE_NAME } from '../../../../core/application/constants/queue.const';

@Injectable()
export class MessageProducer {
    constructor(@InjectQueue(BULL_QUEUE_NAME) private messageQueue: Queue) { }

    async addMessageToQueue(message: Message) {
        await this.messageQueue.add(BULL_JOB_SEND_MESSAGE, { message });
    }
}
