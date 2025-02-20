import { Injectable } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Message } from '@/core/domain/entities/message.entity';
import { RMQ_ROUTING_KEY } from '@/core/application/constants/queue.const';
import { WhatsAppProvider } from '../../infra/providers/whatsapp/whatsapp.provider';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class MessageConsumer {
  constructor(
    private readonly whatsapp: WhatsAppProvider,
    @InjectPinoLogger(MessageConsumer.name)
    private readonly logger: PinoLogger,
  ) { }

  @EventPattern(RMQ_ROUTING_KEY)
  async listenForMessages(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    
    try {
      this.logger.info({ data }, 'Mensagem recebida do RabbitMQ');
      await this.waitWhatsappConnection();
      
      this.logger.debug('Enviando mensagem para o WhatsApp');
      await this.whatsapp.sendMessage(new Message(data));
      
      await channel.ack(originalMsg);
      this.logger.info('Mensagem processada com sucesso');
    } catch (error) {
      this.logger.error({ error, data }, 'Falha no processamento da mensagem');
      await channel.nack(originalMsg);
    }
  }

  private async waitWhatsappConnection() {
    const maxAttempts = 10;
    let attempts = 0;

    while (!this.whatsapp.isConnected() && attempts < maxAttempts) {
      this.logger.debug(
        { attempt: attempts + 1, maxAttempts }, 
        'Aguardando conexão do WhatsApp'
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!this.whatsapp.isConnected()) {
      this.logger.error('WhatsApp não conectado após máximo de tentativas');
      throw new Error('WhatsApp não está conectado');
    }
  }
} 