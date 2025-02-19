import { Message } from "src/domain/entities/message.entity";

export abstract class WhatsAppProvider {
    abstract sendMessage(message: Message): Promise<void>;
}

