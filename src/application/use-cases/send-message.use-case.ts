import { Injectable } from '@nestjs/common';
import { Message } from '../../domain/entities/message.entity';
import { MessageRepository } from '../../domain/repositories/message-repository.abstract';
import { WhatsAppProvider } from 'src/common/providers/whatsapp/whatsapp.provider';
import { IUseCase } from 'src/common/base/usecase.base';

interface SendMessageInput {
  content: string;
  phone: string;
  author?: string;
}

@Injectable()
export class SendMessageUseCase implements IUseCase<void> {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly whatsAppService: WhatsAppProvider,
  ) { }

  public async execute(input: SendMessageInput): Promise<void> {
    const message = new Message({
      content: input.content,
      phone: input.phone,
      author: input.author,
    });

    await this.whatsAppService.sendMessage(message);

    await this.messageRepository.save(message);
  }
} 