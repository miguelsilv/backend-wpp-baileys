import { Injectable } from '@nestjs/common';
import { IUseCase } from '../../base/usecase.base';
import { MessageRepository } from '@/core/domain/repositories/message-repository.abstract';
import { Message } from '@/core/domain/entities/message.entity';
import { MessageProducer } from 'apps/message-producer/src/queues/producers/message.producer';

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