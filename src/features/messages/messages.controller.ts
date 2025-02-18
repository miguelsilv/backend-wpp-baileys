import { Controller, Post, Body, Query, Get, BadRequestException } from "@nestjs/common";
import { SendMessageDto, ReceiveMessageDto } from "src/common/dtos/message.dto";
import { MessagesService } from "./messages.services";
import { Author, Message } from "@prisma/client";


interface SendMessageResponse {
    message: string;
}

@Controller('messages')
export class MessagesController {

    constructor(
        private readonly messagesService: MessagesService
    ) { }

    @Post('send')
    async sendMessage(@Body() data: SendMessageDto): Promise<SendMessageResponse> {
        await this.messagesService.sendMessage(Author.BOT, data);

        return {
            message: 'Mensagem enviada com sucesso',
        }
    }

    @Post('receive')
    async receiveMessage(@Body() data: ReceiveMessageDto): Promise<SendMessageResponse> {
        await this.messagesService.sendMessage(Author.USER, data);

        return {
            message: 'Mensagem recebida com sucesso',
        }
    }

    @Get('unread')
    async listUnreadMessages(@Query('phone') phone: string): Promise<Omit<Message, 'contactId' | 'read'>[]> {
        try {
            const messages = await this.messagesService.listUnreadMessagesOfContact(phone);
            return messages;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}