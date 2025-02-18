import { Module } from "@nestjs/common";
import { MessagesController } from "./messages.controller";
import { PrismaService } from "../../prisma.service";
import { MessagesService } from "./messages.services";
import { BaileysWhatsappAdapter } from "./baileys-whatsapp.adpter";
import { WhatsappAdapter } from "./whatsapp.adapter";

@Module({
    controllers: [MessagesController],
    providers: [
        PrismaService,
        MessagesService,
        {
            provide: WhatsappAdapter,
            useClass: BaileysWhatsappAdapter
        }
    ],
})
export class MessagesModule { }