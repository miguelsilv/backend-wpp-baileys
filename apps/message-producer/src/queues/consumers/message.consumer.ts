import { WorkerHost, Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RabbitMQProducer } from '../producers/rmq-message.producer';
import { BULL_JOB_SEND_MESSAGE, BULL_QUEUE_NAME } from '../../../../core/application/constants/queue.const';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Processor(BULL_QUEUE_NAME)
export class MessageConsumer extends WorkerHost {

  constructor(
    private readonly rmqProducer: RabbitMQProducer,
    @InjectPinoLogger(MessageConsumer.name)
    private readonly logger: PinoLogger,
  ) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    const { message } = job.data;

    if (job.name === BULL_JOB_SEND_MESSAGE) {
      this.logger.info({ message }, 'Processando mensagem');
      await this.rmqProducer.publishEvent(message);
      this.logger.info({ message }, 'Mensagem enfileirada com sucesso');
    }

  }

}
