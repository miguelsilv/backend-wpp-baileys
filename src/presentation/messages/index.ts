import { Module } from "@nestjs/common";
import { PrismaService } from "../../common/providers/prisma.service";
import { MessagesController } from "./messages.controller";
import { SendMessageUseCase } from "src/application/use-cases/send-message.use-case";
import { BaileysWhatsappProvider } from "src/common/providers/whatsapp/baileys-whatsapp.provider";
import { WhatsAppProvider } from "src/common/providers/whatsapp/whatsapp.provider";
import { MessageRepository } from "src/domain/repositories/message-repository.abstract";
import { PGMessageRepository } from "src/application/repositories/message.repository";


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