import { Module } from "@nestjs/common";
import { PrismaService } from "../../common/providers/prisma.service";
import { MessagesController } from "./messages.controller";
import { SendMessageUseCase } from "../../application/use-cases/send-message/send-message.use-case";
import { BaileysWhatsappProvider } from "../../common/providers/whatsapp/baileys-whatsapp.provider";
import { WhatsAppProvider } from "../../common/providers/whatsapp/whatsapp.provider";
import { MessageRepository } from "../../domain/repositories/message-repository.abstract";
import { PGMessageRepository } from "../../application/repositories/message.repository";


@Module({
    controllers: [MessagesController],
    providers: [
        PrismaService,
        SendMessageUseCase,
        {
            provide: WhatsAppProvider,
            useClass: BaileysWhatsappProvider
        },
        {
            provide: MessageRepository,
            useClass: PGMessageRepository,
        },
    ],
})
export class MessagesModule { }