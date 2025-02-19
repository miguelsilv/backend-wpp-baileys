import { IsNotEmpty, Matches } from "class-validator";

import { IsString } from "class-validator";

class MessageDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{13}$/, {
        message: 'O número de telefone deve ser válido no padrão 5511999999999.',
    })
    phone: string;

    @IsNotEmpty()
    message: string;
}

export class SendMessageDto extends MessageDto {
    name?: string;
}

export class ReceiveMessageDto extends MessageDto {
    @IsNotEmpty()
    name: string;
}