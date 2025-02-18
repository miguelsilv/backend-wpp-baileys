import { Controller, Post, Body } from "@nestjs/common";
import { SendMessageDto } from "src/common/dtos/message.dto";
import { MessagesService } from "./messages.services";


interface SendMessageResponse {
    message: string;
}

@Controller('messages')
export class MessagesController {

    constructor(
        private readonly messagesService: MessagesService
    ) { }

    @Post()
    async sendMessage(@Body() data: SendMessageDto): Promise<SendMessageResponse> {
        await this.messagesService.sendMessage(data);

        return {
            message: 'Mensagem enviada com sucesso',
        }
    }
}