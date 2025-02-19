import { Message } from '../entities/message.entity';

export abstract class MessageRepository {
  abstract save(message: Message): Promise<void>;
} 