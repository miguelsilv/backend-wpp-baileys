import { Controller, Post, Body } from "@nestjs/common";

@Controller('messages')
export class MessagesController {

    @Post()
    async sendMessage(@Body() body: any) {
        return {
            message: 'Message sent successfully',
        }
    }
}