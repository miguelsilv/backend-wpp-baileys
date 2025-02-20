import { Message } from "@/core/domain/entities/message.entity";

export abstract class WhatsAppProvider {
    abstract sendMessage(message: Message): Promise<void>;
    abstract isConnected():boolean;
}

