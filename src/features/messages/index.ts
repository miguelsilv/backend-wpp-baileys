import { Module } from "@nestjs/common";
import { MessagesController } from "./messages.controller";
import { PrismaService } from "../../prisma.service";
import { MessagesService } from "./messages.services";
@Module({
    controllers: [MessagesController],
    providers: [PrismaService, MessagesService],
})
export class MessagesModule { }