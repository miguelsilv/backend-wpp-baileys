import { Controller, Post, Body } from "@nestjs/common";
import { SendMessageDto } from "src/common/dtos/message.dto";
import { PrismaService } from "src/prisma.service";

@Controller('messages')
export class MessagesController {

    constructor(private readonly prisma: PrismaService) { }

    @Post()
    async sendMessage(@Body() data: SendMessageDto) {
        console.log(data);

        const { name, phone, message } = data;

        let contact = await this.prisma.contact.findUnique({
            where: { phone },
        });

        if (!contact) {
            contact = await this.prisma.contact.create({
                data: {
                    name: name ?? phone,
                    phone,
                },
            });
        }

        await this.prisma.message.create({
            data: {
                content: message,
                contactId: contact.id
            },
        });

        return {
            message: 'Mensagem enviada com sucesso',
        }

    }
}