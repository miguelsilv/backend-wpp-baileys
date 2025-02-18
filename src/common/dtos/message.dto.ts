class MessageDto {
    phone: string;
    message: string;
}

export class SendMessageDto extends MessageDto {
    name?: string;
}

export class ReceiveMessageDto extends MessageDto {
    name: string;
}