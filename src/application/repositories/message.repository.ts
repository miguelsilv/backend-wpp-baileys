import { Message } from "src/domain/entities/message.entity";
import { MessageRepository } from "../../domain/repositories/message-repository.abstract";
import { PrismaService } from "src/common/providers/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PGMessageRepository implements MessageRepository {

    constructor(private readonly prisma: PrismaService) {}
    
    async save(message: Message): Promise<void> {
        await this.prisma.message.create({
            data: {
                content: message.getContent(),
                contact: {
                    connectOrCreate: {
                        where: {
                            phone: message.getPhone()
                        },
                        create: {
                            name: message.getAuthor(),
                            phone: message.getPhone()
                        }
                    }
                }
            }
        });
    }
}