import { Module } from "@nestjs/common";
import { QueuesModule } from "../../queues";
import { MessagesController } from "./messages.controller";
import { PrismaService } from "@/core/common/providers/prisma.service";
import { SendMessageUseCase } from "../../use-cases/send-message/send-message.use-case";
import { MessageRepository } from "@/core/domain/repositories/message-repository.abstract";
import { PGMessageRepository } from "@/core/application/repositories/message.repository";

@Module({
    imports: [QueuesModule],
    controllers: [MessagesController],
    providers: [
        PrismaService,
        SendMessageUseCase,
        {
            provide: MessageRepository,
            useClass: PGMessageRepository,
        },
    ],
})
export class MessagesModule { }