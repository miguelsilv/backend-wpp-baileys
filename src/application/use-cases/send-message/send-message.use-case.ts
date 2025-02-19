import { Injectable } from '@nestjs/common';
import { WhatsAppProvider } from '../../../common/providers/whatsapp/whatsapp.provider';
import { IUseCase } from '../../../common/base/usecase.base';
import { MessageRepository } from '../../../domain/repositories/message-repository.abstract';
import { Message } from '../../../domain/entities/message.entity';
import { MessageProducer } from 'src/infra/queues/producers/message.producer';

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
  ) { }

  public async execute(input: SendMessageInput): Promise<void> {
    const message = new Message({
      content: input.content,
      phone: input.phone,
      author: input.author,
    });

    await this.messageRepository.save(message);
    await this.messageProducer.addMessageToQueue(message);
  }
} 