import { Injectable } from "@nestjs/common";
import { Contact } from "@prisma/client";
import { ReplyMessageDto, SendMessageDto } from "src/common/dtos/message.dto";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class MessagesService {

    constructor(private readonly prisma: PrismaService) { }

    async sendMessage(data: SendMessageDto): Promise<void> {
        const { name, phone, message } = data;

        let contact = await this.getContact(phone);

        if (!contact) {
            contact = await this.createContact(name ?? phone, phone);
        } else if (name && contact.name !== name) {
            await this.updateContactName(contact.id, name);
        }

        await this.createMessage(message, contact.id);
    }

    private async createMessage(content: string, contactId: string): Promise<void> {
        await this.prisma.message.create({
            data: { content, contactId },
        });
    }

    private async createContact(name: string, phone: string): Promise<Contact> {
        return this.prisma.contact.create({
            data: { phone, name },
        });
    }

    private async updateContactName(contactId: string, name: string): Promise<void> {
        await this.prisma.contact.update({
            where: { id: contactId },
            data: { name },
        });
    }

    private async getContact(phone: string): Promise<Contact | null> {
        return this.prisma.contact.findUnique({
            where: { phone },
        });
    }
}