import { Body, Controller, Post } from '@nestjs/common';
import { SendMessageUseCase } from '../../application/use-cases/send-message/send-message.use-case';
import { SendMessageDto } from '../../common/dtos/message.dto';
  
@Controller('messages')
export class MessagesController {
  constructor(private readonly sendMessageUseCase: SendMessageUseCase) {}

  @Post()
  async sendMessage(@Body() dto: SendMessageDto): Promise<void> {
    await this.sendMessageUseCase.execute({
      content: dto.message,
      phone: dto.phone,
    });
  }
} 