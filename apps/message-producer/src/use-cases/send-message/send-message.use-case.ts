import { Injectable } from '@nestjs/common';
import { IUseCase } from '../../base/usecase.base';
import { MessageRepository } from '../../../../core/domain/repositories/message-repository.abstract';
import { Message } from '../../../../core/domain/entities/message.entity';
import { MessageProducer } from '../../queues/producers/message.producer';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

interface SendMessageInput {
  content: string;
  phone: string;
  author?: string;
}

@Injectable()
export class SendMessageUseCase implements IUseCase<void> {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly messageProducer: MessageProducer,
    @InjectPinoLogger(SendMessageUseCase.name)
    private readonly logger: PinoLogger,
  ) { }

  public async execute(input: SendMessageInput): Promise<void> {
    this.logger.info({ input }, 'Iniciando envio de mensagem');
    
    const message = new Message({
      content: input.content,
      phone: input.phone,
      author: input.author,
    });

    try {
      await this.messageRepository.save(message);
      this.logger.debug({ message }, 'Mensagem salva no repositório');
      
      await this.messageProducer.addMessageToQueue(message);
      this.logger.info({ message }, 'Mensagem adicionada à fila com sucesso');
    } catch (error) {
      this.logger.error({ error, message }, 'Erro ao processar mensagem');
      throw error;
    }
  }
} 