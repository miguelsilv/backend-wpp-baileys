import { WorkerHost, Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RabbitMQProducer } from '../producers/rmq-message.producer';
import { BULL_JOB_SEND_MESSAGE, BULL_QUEUE_NAME } from '../../../../core/application/constants/queue.const';

@Processor(BULL_QUEUE_NAME)
export class MessageConsumer extends WorkerHost {

  constructor(private readonly rmqProducer: RabbitMQProducer) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    const { message } = job.data;

    if (job.name === BULL_JOB_SEND_MESSAGE) {
      await this.rmqProducer.publishEvent(message);
      console.log('Mensagem enfileirada:', message);
    }

  }

}
