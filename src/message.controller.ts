import { Controller, Post, Body } from "@nestjs/common";

@Controller('message')
export class MessageController {

    @Post()
    async sendMessage(@Body() body: any) {
        return {
            message: 'Message sent successfully',
        }
    }
}