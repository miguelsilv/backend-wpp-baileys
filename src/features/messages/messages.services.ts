import { Injectable } from "@nestjs/common";
import { SendMessageDto } from "src/common/dtos/message.dto";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class MessagesService {

    constructor(private readonly prisma: PrismaService) { }

    async sendMessage(data: SendMessageDto): Promise<void> {
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
        } else if (name && contact.name !== name) {
            await this.prisma.contact.update({
                where: { id: contact.id },
                data: { name },
            });
        }

        await this.prisma.message.create({
            data: {
                content: message,
                contactId: contact.id
            },
        });
    }
}