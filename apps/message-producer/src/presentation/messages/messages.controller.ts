import { Body, Controller, Post } from '@nestjs/common';
import { SendMessageUseCase } from '../../use-cases/send-message/send-message.use-case';
import { SendMessageDto } from '@/core/common/dtos/message.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly sendMessageUseCase: SendMessageUseCase,
    @InjectPinoLogger(MessagesController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Post()
  async sendMessage(@Body() dto: SendMessageDto): Promise<void> {
    this.logger.info({ dto }, 'Recebida requisição para envio de mensagem');
    try {
      await this.sendMessageUseCase.execute({
        content: dto.message,
        phone: dto.phone,
      });
      this.logger.info('Mensagem processada com sucesso');
    } catch (error) {
      this.logger.error({ error, dto }, 'Erro ao processar mensagem');
      throw error;
    }
  }
} 